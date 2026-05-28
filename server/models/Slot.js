const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  pincode: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  timeWindow: { type: String, required: true, trim: true },
  capacity: { type: Number, required: true, min: 0 },
  bookedCount: { type: Number, default: 0, min: 0 },
  assignedPhlebotomists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

slotSchema.virtual('availableCount').get(function availableCount() {
  return Math.max(this.capacity - this.bookedCount, 0);
});

slotSchema.methods.isSoldOut = function isSoldOut() {
  return !this.isActive || this.bookedCount >= this.capacity;
};

slotSchema.index({ pincode: 1, date: 1, timeWindow: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);
