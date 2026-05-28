const express = require('express');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

const router = express.Router();

router.post('/checkout', async (req, res) => {
  try {
    const { slotId } = req.body.slot || {};

    if (slotId) {
      const slot = await Slot.findById(slotId);
      if (!slot) return res.status(404).json({ error: 'Slot not found' });
      if (slot.bookedCount >= slot.capacity) {
        return res.status(409).json({ error: 'Selected slot is sold out' });
      }
      slot.bookedCount += 1;
      await slot.save();
    }

    const booking = await Booking.create(req.body);
    res.status(201).json({ data: booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status, assignedPhlebotomist, note } = req.body;
    const update = { status };
    if (assignedPhlebotomist) update.assignedPhlebotomist = assignedPhlebotomist;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        ...update,
        $push: { statusHistory: { status, note, changedAt: new Date() } },
      },
      { new: true, runValidators: true }
    );

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ data: booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/customer/:customerId', async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.params.customerId })
      .populate('patients.packagesBooked', 'title discountedPrice reportTimeHours')
      .populate('assignedPhlebotomist', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ data: bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
