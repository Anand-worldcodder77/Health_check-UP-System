const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  category: { type: String, trim: true },
  description: { type: String, trim: true },
  normalRange: { type: String, trim: true },
  unit: { type: String, trim: true },
  sampleType: { type: String, trim: true, default: 'Blood' },
  price: { type: Number, default: 399 },
  mrp: { type: Number, default: 999 },
  discountPercent: { type: Number, default: 60 },
  turnaroundTime: { type: Number, default: 24 },
  searchTags: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

testSchema.index({ name: 'text', code: 'text', category: 'text', searchTags: 'text' });
testSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Test', testSchema);
