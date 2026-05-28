const mongoose = require('mongoose');

const patientBookingSchema = new mongoose.Schema({
  familyMemberId: { type: String },
  patientName: { type: String, trim: true },
  relation: { type: String, trim: true },
  age: Number,
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'MALE', 'FEMALE', 'OTHER'] },
  packagesBooked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Package' }],
  testsBooked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
  reportPdfUrl: String,
}, { _id: true });

const addressSnapshotSchema = new mongoose.Schema({
  tag: String,
  fullAddress: String,
  pincode: String,
  city: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, sparse: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patients: [patientBookingSchema],
  collectionAddress: addressSnapshotSchema,
  slot: {
    date: Date,
    timeWindow: String,
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' },
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'CASH_ON_COLLECTION', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
  },
  totalAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: [
      'Pending',
      'Confirmed',
      'Report Uploaded',
      'Rejected',
      'BOOKED',
      'PHLEBO_ASSIGNED',
      'ON_THE_WAY',
      'SAMPLE_COLLECTED',
      'IN_LAB',
      'REPORT_READY',
      'CANCELLED',
    ],
    default: 'BOOKED',
  },
  assignedPhlebotomist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    note: String,
  }],

  // Backward-compatible fields used by current frontend/admin screens.
  userName: { type: String, trim: true },
  userEmail: { type: String, trim: true },
  userPhone: { type: String, trim: true },
  contactName: { type: String, trim: true },
  selectedPackage: { type: String, trim: true },
  prescription: String,
  reportUrl: { type: String, default: null },
  age: Number,
  gender: String,
  address: String,
  bookingDate: { type: Date, default: Date.now },
}, { timestamps: true });

bookingSchema.pre('validate', function ensureBookingId() {
  if (!this.bookingId) {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    this.bookingId = `HLT-${Date.now().toString().slice(-6)}-${suffix}`;
  }

  if (!this.patients.length && this.userName) {
    this.patients.push({
      patientName: this.userName,
      age: this.age,
      gender: this.gender,
    });
  }

  if (!this.collectionAddress && this.address) {
    this.collectionAddress = { fullAddress: this.address };
  }
});

bookingSchema.pre('save', function addStatusHistory() {
  if (this.isModified('status')) {
    this.statusHistory.push({ status: this.status });
  }
});

bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ userPhone: 1, createdAt: -1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ 'slot.date': 1, 'slot.timeWindow': 1 });

module.exports = mongoose.model('Booking', bookingSchema);
