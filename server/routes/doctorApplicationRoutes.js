const express = require('express');
const crypto = require('crypto');
const DoctorApplication = require('../models/DoctorApplication');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

const normalizePhone = (phone = '') => phone.replace(/\D/g, '').slice(-10);
const generateTemporaryPassword = () => `Dr-${crypto.randomBytes(5).toString('hex')}`;

router.post('/', async (req, res) => {
  try {
    const payload = {
      fullName: req.body.fullName?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      phone: normalizePhone(req.body.phone),
      specialization: req.body.specialization?.trim(),
      medicalRegistrationNumber: req.body.medicalRegistrationNumber?.trim(),
      councilName: req.body.councilName?.trim(),
      highestDegree: req.body.highestDegree?.trim(),
      experienceYears: Number(req.body.experienceYears || 0),
      clinicName: req.body.clinicName?.trim(),
      clinicAddress: req.body.clinicAddress?.trim(),
      city: req.body.city?.trim(),
      documentsUrl: req.body.documentsUrl?.trim(),
      documents: Array.isArray(req.body.documents) ? req.body.documents : [],
    };

    const requiredFields = ['fullName', 'email', 'phone', 'specialization', 'medicalRegistrationNumber', 'councilName', 'city'];
    const missing = requiredFields.find((field) => !payload[field]);
    if (missing) return res.status(400).json({ message: `${missing} is required` });

    if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    if (!/^\d{10}$/.test(payload.phone)) {
      return res.status(400).json({ message: 'Valid 10 digit phone is required' });
    }

    const existing = await DoctorApplication.findOne({
      $or: [
        { email: payload.email },
        { medicalRegistrationNumber: payload.medicalRegistrationNumber },
      ],
    });

    if (existing) {
      return res.status(409).json({ message: 'Application already exists for this email or registration number.' });
    }

    const application = await DoctorApplication.create(payload);
    res.status(201).json({ message: 'Doctor application submitted.', application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'ALL' ? { status } : {};
    const applications = await DoctorApplication.find(filter).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status, adminNote, issueTemporaryPassword } = req.body;
    if (!['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let application = await DoctorApplication.findById(req.params.id);

    if (!application) return res.status(404).json({ message: 'Application not found' });

    let doctorUser = null;
    let temporaryPassword = null;
    let emailSent = false;

    if (status === 'APPROVED') {
      doctorUser = await User.findOne({
        $or: [
          { email: application.email },
          { phone: application.phone },
        ],
      }).select('+password');

      if (doctorUser && doctorUser.role !== 'DOCTOR') {
        return res.status(409).json({ message: 'A non-doctor user already exists with this email or phone.' });
      }

      if (!doctorUser) {
        temporaryPassword = generateTemporaryPassword();
        doctorUser = await User.create({
          name: application.fullName,
          email: application.email,
          phone: application.phone,
          password: temporaryPassword,
          role: 'DOCTOR',
        });
      } else if (issueTemporaryPassword) {
        temporaryPassword = generateTemporaryPassword();
        doctorUser.password = temporaryPassword;
        await doctorUser.save();
      }

      const emailText = temporaryPassword
        ? `Dear ${application.fullName},\n\nYour doctor account has been approved.\n\nLogin email: ${application.email}\nTemporary password: ${temporaryPassword}\n\nPlease sign in and change your password after first login.\n\nTeam HealthChecks`
        : `Dear ${application.fullName},\n\nYour doctor account has been approved. You can now sign in with your existing doctor credentials.\n\nTeam HealthChecks`;

      emailSent = await sendEmail(application.email, 'HealthChecks Doctor Account Approved', emailText);

      application.approvedUser = doctorUser._id;
      application.temporaryPasswordIssued = Boolean(temporaryPassword);
      application.welcomeEmailSentAt = emailSent ? new Date() : undefined;
    }

    application.status = status;
    application.adminNote = adminNote;
    application.reviewedAt = ['APPROVED', 'REJECTED'].includes(status) ? new Date() : application.reviewedAt;
    await application.save();

    res.status(200).json({
      message: status === 'APPROVED' ? 'Doctor approved and account activated.' : 'Application updated.',
      application,
      doctorUser: doctorUser ? { id: doctorUser._id, name: doctorUser.name, email: doctorUser.email, role: doctorUser.role } : null,
      temporaryPassword,
      emailSent,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
