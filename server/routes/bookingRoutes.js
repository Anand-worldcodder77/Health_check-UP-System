const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Valid patient account id is required.' });
    }

    const userBookings = await Booking.find({ customer: customerId })
      .sort({ bookingDate: -1, createdAt: -1 });

    res.status(200).json(userBookings);
  } catch (err) {
    res.status(500).json({ error: 'Bookings fetch error' });
  }
});

// Backward-compatible route for current dashboard screens.
router.get('/user/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const search = decodeURIComponent(identifier || '').trim();
    const filters = [
      { phone: search },
      { userPhone: search },
      { email: search },
      { userEmail: search },
    ];

    if (mongoose.Types.ObjectId.isValid(search)) {
      filters.push({ customer: search });
    } else {
      const normalizedPhone = search.replace(/\D/g, '').slice(-10);
      const linkedUser = await User.findOne({
        $or: [
          ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
          ...(search ? [{ email: search.toLowerCase() }] : []),
        ],
      }).select('_id');

      if (linkedUser) {
        filters.push({ customer: linkedUser._id });
      }
    }

    const userBookings = await Booking.find({ $or: filters }).sort({ bookingDate: -1, createdAt: -1 });

    res.status(200).json(userBookings);
  } catch (err) {
    res.status(500).json({ error: 'Bookings fetch error' });
  }
});

module.exports = router;
