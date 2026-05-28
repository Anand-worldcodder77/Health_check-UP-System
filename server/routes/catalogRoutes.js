const express = require('express');
const Package = require('../models/Package');
const Test = require('../models/Test');

const router = express.Router();

const slugify = (value = '') => value
  .toString()
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

router.get('/packages', async (req, res) => {
  try {
    const { category, pincode, bestSeller, includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };

    if (category) filter.category = category;
    if (bestSeller === 'true') filter.isBestSeller = true;
    if (pincode) {
      filter.$or = [
        { availablePincodes: { $size: 0 } },
        { availablePincodes: pincode },
      ];
    }

    const packages = await Package.find(filter)
      .populate('includesTests', 'name code category turnaroundTime')
      .sort({ isBestSeller: -1, discountedPrice: 1 })
      .limit(50);

    res.json({ data: packages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/packages', async (req, res) => {
  try {
    const item = await Package.create({
      ...req.body,
      slug: req.body.slug || `${slugify(req.body.title)}-${Date.now().toString().slice(-5)}`,
    });
    res.status(201).json({ data: item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/packages/:id', async (req, res) => {
  try {
    const item = await Package.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(req.body.title && !req.body.slug ? { slug: `${slugify(req.body.title)}-${Date.now().toString().slice(-5)}` } : {}),
      },
      { returnDocument: 'after', runValidators: true }
    );
    if (!item) return res.status(404).json({ message: 'Package not found' });
    res.json({ data: item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/tests', async (req, res) => {
  try {
    const { category, includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };
    if (category) filter.category = category;

    const tests = await Test.find(filter).sort({ name: 1 }).limit(100);
    res.json({ data: tests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tests', async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json({ data: test });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/tests/:id', async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json({ data: test });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) return res.json({ tests: [], packages: [] });

    const textSearch = { $text: { $search: query }, isActive: true };
    const regexSearch = { $regex: query, $options: 'i' };

    const [tests, packages] = await Promise.all([
      Test.find({
        isActive: true,
        $or: [
          { name: regexSearch },
          { code: regexSearch },
          { category: regexSearch },
          { searchTags: regexSearch },
        ],
      }).limit(8),
      Package.find({
        isActive: true,
        $or: [
          { title: regexSearch },
          { category: regexSearch },
          { searchTags: regexSearch },
        ],
      }).limit(8),
    ]);

    if (!tests.length && !packages.length) {
      const [textTests, textPackages] = await Promise.all([
        Test.find(textSearch).limit(8),
        Package.find(textSearch).limit(8),
      ]);
      return res.json({ tests: textTests, packages: textPackages });
    }

    res.json({ tests, packages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
