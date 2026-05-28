const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  fasting: { type: Boolean, default: false },
  fastingHours: { type: Number, default: 0 },
  genderTarget: { type: String, enum: ['ALL', 'MALE', 'FEMALE'], default: 'ALL' },
  ageGroup: { type: String, trim: true },
}, { _id: false });

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: { type: String, trim: true },
  shortDescription: { type: String, trim: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  includesTests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
  testCount: { type: Number, default: 0 },
  reportTimeHours: { type: Number, default: 24 },
  requirements: { type: requirementSchema, default: () => ({}) },
  searchTags: [{ type: String, trim: true }],
  availablePincodes: [{ type: String, trim: true }],
  isBestSeller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

packageSchema.index({ title: 'text', category: 'text', searchTags: 'text' });
packageSchema.index({ category: 1, isBestSeller: -1, isActive: 1 });
packageSchema.index({ availablePincodes: 1 });

module.exports = mongoose.model('Package', packageSchema);
