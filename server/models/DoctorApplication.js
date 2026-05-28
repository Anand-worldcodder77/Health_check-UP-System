const mongoose = require('mongoose');

const uploadedDocumentSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  url: { type: String, trim: true },
  type: { type: String, trim: true },
  provider: { type: String, default: 'cloudinary', trim: true },
}, { _id: false });

const doctorApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, trim: true },
  medicalRegistrationNumber: { type: String, required: true, trim: true },
  councilName: { type: String, required: true, trim: true },
  highestDegree: { type: String, trim: true },
  experienceYears: { type: Number, min: 0, default: 0 },
  clinicName: { type: String, trim: true },
  clinicAddress: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  documentsUrl: { type: String, trim: true },
  documents: [uploadedDocumentSchema],
  status: {
    type: String,
    enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
  adminNote: { type: String, trim: true },
  approvedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  temporaryPasswordIssued: { type: Boolean, default: false },
  welcomeEmailSentAt: Date,
  reviewedAt: Date,
}, { timestamps: true });

doctorApplicationSchema.index({ email: 1, medicalRegistrationNumber: 1 }, { unique: true });
doctorApplicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('DoctorApplication', doctorApplicationSchema);
