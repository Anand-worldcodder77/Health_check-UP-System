const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Consultation = require('../models/Consultation');
const Booking = require('../models/Booking');
const User = require('../models/User');
const DoctorNote = require('../models/DoctorNote');

const router = express.Router();

const availabilitySlots = [
  { id: 'today-morning', label: 'Today', timeWindow: '10:00 AM - 2:00 PM', available: true },
  { id: 'today-evening', label: 'Evening', timeWindow: '5:00 PM - 8:00 PM', available: true },
  { id: 'tomorrow-morning', label: 'Tomorrow', timeWindow: '9:00 AM - 1:00 PM', available: true },
];

const createRoomId = () => `healthchecks-${crypto.randomBytes(6).toString('hex')}`;
const parseOptionalDate = (value) => {
  if (!value || Number.isNaN(Date.parse(value))) return undefined;
  return new Date(value);
};

router.get('/availability', (req, res) => {
  res.json({ slots: availabilitySlots });
});

router.post('/start', async (req, res) => {
  try {
    const { userId, role, bookingId, slotId } = req.body;
    const user = userId ? await User.findById(userId) : null;
    const booking = bookingId ? await Booking.findById(bookingId) : null;
    const selectedSlot = availabilitySlots.find((slot) => slot.id === slotId) || availabilitySlots[0];

    const consultation = await Consultation.create({
      roomId: createRoomId(),
      patient: role === 'CUSTOMER' || role === 'patient' ? user?._id : undefined,
      doctor: role === 'DOCTOR' ? user?._id : undefined,
      booking: booking?._id,
      doctorAvailability: selectedSlot,
      reportSummary: {
        packageName: booking?.selectedPackage || 'Health report review',
        reportUrl: booking?.reportUrl || booking?.reportPdfUrl,
        patientContext: booking
          ? `${booking.userName || 'Patient'} | ${booking.userPhone || ''} | ${booking.status || 'Pending'}`
          : 'Patient report and symptoms can be discussed during the call.',
        summaryText: booking?.reportUrl || booking?.reportPdfUrl
          ? 'Report is attached for doctor review.'
          : 'Report summary will appear here when uploaded by lab/admin.',
      },
    });

    res.status(201).json({ consultation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/summaries/patient/:identifier', async (req, res) => {
  try {
    const identifier = decodeURIComponent(req.params.identifier || '').trim();
    const normalizedPhone = identifier.replace(/\D/g, '').slice(-10);
    const filters = [
      { userPhone: identifier },
      ...(normalizedPhone ? [{ userPhone: normalizedPhone }] : []),
      { userEmail: identifier.toLowerCase() },
    ];

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      filters.push({ customer: identifier });
    } else {
      const linkedUser = await User.findOne({
        $or: [
          ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
          ...(identifier ? [{ email: identifier.toLowerCase() }] : []),
        ],
      }).select('_id');
      if (linkedUser) filters.push({ customer: linkedUser._id });
    }

    const bookings = await Booking.find({ $or: filters }).select('_id');
    const bookingIds = bookings.map((booking) => booking._id);
    const notes = await DoctorNote.find({
      $or: [
        { patient: customerId },
        { booking: { $in: bookingIds } },
      ],
    })
      .populate('booking', 'selectedPackage bookingId bookingDate reportUrl reportPdfUrl userName userPhone')
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/summaries/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Valid patient account id is required.' });
    }

    const bookings = await Booking.find({ customer: customerId }).select('_id');
    const bookingIds = bookings.map((booking) => booking._id);
    const notes = await DoctorNote.find({ booking: { $in: bookingIds } })
      .populate('booking', 'selectedPackage bookingId bookingDate reportUrl reportPdfUrl userName userPhone')
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:roomId', async (req, res) => {
  try {
    const consultation = await Consultation.findOne({ roomId: req.params.roomId })
      .populate('patient', 'name email phone role')
      .populate('doctor', 'name email phone role')
      .populate('booking');

    if (!consultation) return res.status(404).json({ message: 'Consultation room not found.' });
    res.json({ consultation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:roomId/join', async (req, res) => {
  try {
    const { userId, name, role } = req.body;
    const consultation = await Consultation.findOne({ roomId: req.params.roomId });
    if (!consultation) return res.status(404).json({ message: 'Consultation room not found.' });

    if (role === 'DOCTOR' && userId && !consultation.doctor) consultation.doctor = userId;
    if ((role === 'CUSTOMER' || role === 'patient') && userId && !consultation.patient) consultation.patient = userId;

    consultation.status = 'LIVE';
    consultation.joinHistory.push({ user: userId || undefined, name, role });
    await consultation.save();

    res.json({ consultation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:roomId/summary', async (req, res) => {
  try {
    const { userId, note, followUp, reportRemarks, healthAdvice } = req.body;
    const consultation = await Consultation.findOne({ roomId: req.params.roomId })
      .populate('booking')
      .populate('patient', 'name email phone role');
    if (!consultation) return res.status(404).json({ message: 'Consultation room not found.' });

    consultation.doctorSummary = {
      note,
      reportRemarks,
      healthAdvice,
      followUp,
      updatedBy: userId || undefined,
      updatedAt: new Date(),
    };
    await consultation.save();

    let doctorNote = null;
    const hasClinicalSummary = [note, reportRemarks, healthAdvice, followUp].some((value) => value?.trim?.());
    if ((consultation.booking?._id || consultation.patient?._id) && hasClinicalSummary) {
      const doctor = userId ? await User.findById(userId) : null;
      doctorNote = await DoctorNote.findOneAndUpdate(
        { consultation: consultation._id },
        {
          booking: consultation.booking?._id,
          patient: consultation.patient?._id,
          doctor: userId || undefined,
          doctorName: doctor?.name || 'Doctor',
          noteType: 'REPORT_REVIEW',
          note: note?.trim() || 'Consultation summary added by doctor.',
          reportRemarks,
          healthAdvice,
          followUpDate: parseOptionalDate(followUp),
          consultation: consultation._id,
        },
        { upsert: true, returnDocument: 'after', runValidators: true }
      );

      if (['Report Uploaded', 'REPORT_READY'].includes(consultation.booking.status)) {
        consultation.booking.status = 'REPORT_READY';
        await consultation.booking.save();
      }
    }

    res.json({ consultation, doctorNote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/patient/:identifier/summaries', async (req, res) => {
  try {
    const identifier = decodeURIComponent(req.params.identifier || '').trim();
    const normalizedPhone = identifier.replace(/\D/g, '').slice(-10);
    const filters = [
      { userPhone: identifier },
      ...(normalizedPhone ? [{ userPhone: normalizedPhone }] : []),
      { userEmail: identifier.toLowerCase() },
    ];

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      filters.push({ customer: identifier });
    } else {
      const linkedUser = await User.findOne({
        $or: [
          ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
          ...(identifier ? [{ email: identifier.toLowerCase() }] : []),
        ],
      }).select('_id');
      if (linkedUser) filters.push({ customer: linkedUser._id });
    }

    const bookings = await Booking.find({ $or: filters }).select('_id selectedPackage bookingId bookingDate');
    const bookingIds = bookings.map((booking) => booking._id);
    const notes = await DoctorNote.find({ booking: { $in: bookingIds } })
      .populate('booking', 'selectedPackage bookingId bookingDate reportUrl reportPdfUrl')
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
