const Callback = require('../models/Callback');

// 1. Naya Callback Save Karna
exports.createCallback = async (req, res) => {
  try {
    const newLead = new Callback(req.body);
    await newLead.save();
    res.status(201).json({ success: true, message: "Lead saved successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// 2. Saare Callbacks Dashboard ke liye mangana
exports.getAllCallbacks = async (req, res) => {
  try {
    const leads = await Callback.find().sort({ createdAt: -1 }); // Naye leads upar
    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Status Update Karna (Pending to Called)
exports.updateStatus = async (req, res) => {
  try {
    const updated = await Callback.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};