const express = require('express');
const Booking = require('../models/Booking');
const DoctorNote = require('../models/DoctorNote');

const router = express.Router();

router.get('/workspace', async (req, res) => {
  try {
    const [bookings, notes] = await Promise.all([
      Booking.find().sort({ createdAt: -1 }).limit(100),
      DoctorNote.find().sort({ createdAt: -1 }).limit(100),
    ]);

    const notesByBooking = notes.reduce((acc, note) => {
      const key = note.booking?.toString();
      if (!key) return acc;
      acc[key] = acc[key] || [];
      acc[key].push(note);
      return acc;
    }, {});

    res.json({
      bookings: bookings.map((booking) => ({
        ...booking.toObject(),
        doctorNotes: notesByBooking[booking._id.toString()] || [],
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/notes', async (req, res) => {
  try {
    const { bookingId, doctorId, doctorName, noteType, note, followUpDate } = req.body;
    if (!bookingId) return res.status(400).json({ message: 'bookingId is required.' });
    if (!note?.trim()) return res.status(400).json({ message: 'Note is required.' });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const createdNote = await DoctorNote.create({
      booking: bookingId,
      doctor: doctorId || undefined,
      doctorName,
      noteType,
      note,
      followUpDate: followUpDate || undefined,
    });

    if (noteType === 'REPORT_REVIEW' && ['Report Uploaded', 'REPORT_READY'].includes(booking.status)) {
      booking.status = 'REPORT_READY';
      await booking.save();
    }

    res.status(201).json({ note: createdNote, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
