const mongoose = require('mongoose');

const joinEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  role: String,
  joinedAt: { type: Date, default: Date.now },
}, { _id: false });

const consultationSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true, index: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  status: {
    type: String,
    enum: ['WAITING', 'LIVE', 'COMPLETED', 'CANCELLED'],
    default: 'WAITING',
  },
  scheduledAt: { type: Date, default: Date.now },
  doctorAvailability: {
    label: { type: String, default: 'Today' },
    timeWindow: { type: String, default: '10:00 AM - 2:00 PM' },
    available: { type: Boolean, default: true },
  },
  reportSummary: {
    packageName: String,
    reportUrl: String,
    patientContext: String,
    summaryText: String,
  },
  doctorSummary: {
    note: String,
    reportRemarks: String,
    healthAdvice: String,
    followUp: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: Date,
  },
  joinHistory: [joinEventSchema],
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
