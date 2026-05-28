const mongoose = require('mongoose');

const doctorNoteSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorName: { type: String, trim: true },
  noteType: {
    type: String,
    enum: ['CLINICAL_NOTE', 'REPORT_REVIEW', 'FOLLOW_UP', 'PATIENT_CALL'],
    default: 'CLINICAL_NOTE',
  },
  note: { type: String, required: true, trim: true },
  reportRemarks: { type: String, trim: true },
  healthAdvice: { type: String, trim: true },
  followUpDate: Date,
  consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
}, { timestamps: true });

doctorNoteSchema.index({ booking: 1, createdAt: -1 });
doctorNoteSchema.index({ patient: 1, createdAt: -1 });
doctorNoteSchema.index({ doctor: 1, createdAt: -1 });

module.exports = mongoose.model('DoctorNote', doctorNoteSchema);
