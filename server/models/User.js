const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  relation: { type: String, required: true, trim: true },
  age: { type: Number, min: 0 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
}, { _id: true });

const addressSchema = new mongoose.Schema({
  tag: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
  pincode: { type: String, trim: true },
  fullAddress: { type: String, trim: true },
  city: { type: String, trim: true },
  coordinates: {
    lat: Number,
    lng: Number,
  },
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true, sparse: true, unique: true },
  phone: { type: String, trim: true, sparse: true, unique: true },
  address: { type: String, trim: true },
  age: { type: Number, min: 0 },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Not Specified'], default: 'Not Specified' },
  password: { type: String, select: false },
  role: {
    type: String,
    enum: ['CUSTOMER', 'ADMIN', 'LAB_STAFF', 'PHLEBOTOMIST', 'PATHOLOGIST', 'DOCTOR', 'patient', 'admin'],
    default: 'CUSTOMER',
  },
  familyMembers: [familyMemberSchema],
  addresses: [addressSchema],
  healthCoins: { type: Number, default: 0 },
  otp: {
    code: String,
    expiresAt: Date,
    verifiedAt: Date,
  },
}, { timestamps: true });

userSchema.index({ phone: 1, role: 1 });

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password') || !this.password) return;

  const isBcryptHash = /^\$2[aby]\$\d{2}\$/.test(this.password);
  if (isBcryptHash) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  if (!candidatePassword || !this.password) return false;

  const isBcryptHash = /^\$2[aby]\$\d{2}\$/.test(this.password);
  if (isBcryptHash) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  return candidatePassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
