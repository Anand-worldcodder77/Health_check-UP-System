const express = require('express');
const Slot = require('../models/Slot');

const router = express.Router();

router.get('/availability', async (req, res) => {
  try {
    const { pincode, date } = req.query;
    if (!pincode || !date) {
      return res.status(400).json({ error: 'pincode and date are required' });
    }

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const slots = await Slot.find({
      pincode,
      date: { $gte: start, $lt: end },
      isActive: true,
    }).sort({ timeWindow: 1 });

    res.json({
      data: slots.map((slot) => ({
        id: slot._id,
        pincode: slot.pincode,
        date: slot.date,
        timeWindow: slot.timeWindow,
        capacity: slot.capacity,
        bookedCount: slot.bookedCount,
        availableCount: Math.max(slot.capacity - slot.bookedCount, 0),
        soldOut: slot.bookedCount >= slot.capacity,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const slot = await Slot.findOneAndUpdate(
      {
        pincode: req.body.pincode,
        date: req.body.date,
        timeWindow: req.body.timeWindow,
      },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ data: slot });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
