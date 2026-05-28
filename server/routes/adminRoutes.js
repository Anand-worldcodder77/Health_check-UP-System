const express = require('express');
const Booking = require('../models/Booking');
const Callback = require('../models/Callback');
const DoctorApplication = require('../models/DoctorApplication');
const Package = require('../models/Package');
const Slot = require('../models/Slot');
const Test = require('../models/Test');
const User = require('../models/User');

const router = express.Router();

router.get('/overview', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      bookingCount,
      todayBookings,
      pendingBookings,
      reportReady,
      callbacksPending,
      doctorPending,
      doctorApproved,
      patientCount,
      doctorCount,
      packageCount,
      testCount,
      slotCount,
      recentBookings,
      recentApplications,
      usersByRole,
      bookingStatusBreakdown,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: today } }),
      Booking.countDocuments({ status: { $in: ['Pending', 'BOOKED', 'PHLEBO_ASSIGNED', 'ON_THE_WAY'] } }),
      Booking.countDocuments({ status: { $in: ['Report Uploaded', 'REPORT_READY'] } }),
      Callback.countDocuments({ status: { $ne: 'Called' } }),
      DoctorApplication.countDocuments({ status: { $in: ['PENDING', 'UNDER_REVIEW'] } }),
      DoctorApplication.countDocuments({ status: 'APPROVED' }),
      User.countDocuments({ role: { $in: ['CUSTOMER', 'patient'] } }),
      User.countDocuments({ role: 'DOCTOR' }),
      Package.countDocuments({ isActive: true }),
      Test.countDocuments({ isActive: true }),
      Slot.countDocuments({ isActive: true }),
      Booking.find().sort({ createdAt: -1 }).limit(5).select('bookingId userName userPhone selectedPackage totalAmount status createdAt'),
      DoctorApplication.find().sort({ createdAt: -1 }).limit(5).select('fullName specialization medicalRegistrationNumber status createdAt'),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    res.json({
      metrics: {
        bookingCount,
        todayBookings,
        pendingBookings,
        reportReady,
        callbacksPending,
        doctorPending,
        doctorApproved,
        patientCount,
        doctorCount,
        packageCount,
        testCount,
        slotCount,
      },
      recentBookings,
      recentApplications,
      usersByRole,
      bookingStatusBreakdown,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { role = 'ALL' } = req.query;
    const filter = role === 'ALL' ? {} : { role };
    const users = await User.find(filter)
      .select('name email phone role is_active createdAt')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/system', async (req, res) => {
  try {
    const [users, bookings, doctorApplications, packagesCount, testsCount, slotsCount] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      DoctorApplication.countDocuments(),
      Package.countDocuments(),
      Test.countDocuments(),
      Slot.countDocuments(),
    ]);

    res.json({
      counts: { users, bookings, doctorApplications, packages: packagesCount, tests: testsCount, slots: slotsCount },
      integrations: {
        cloudinary: {
          configured: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
          cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
        },
        email: {
          configured: Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS),
        },
        database: {
          configured: Boolean(process.env.MONGO_URI),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
