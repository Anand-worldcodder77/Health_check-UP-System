const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function createStaff() {
  const {
    MONGO_URI,
    STAFF_NAME,
    STAFF_EMAIL,
    STAFF_PHONE,
    STAFF_PASSWORD,
    STAFF_ROLE,
  } = process.env;

  const role = (STAFF_ROLE || '').trim().toUpperCase();

  if (!MONGO_URI) throw new Error('MONGO_URI is required');
  const allowedRoles = ['ADMIN', 'DOCTOR', 'LAB_STAFF', 'PHLEBOTOMIST', 'PATHOLOGIST'];
  if (!allowedRoles.includes(role)) throw new Error(`STAFF_ROLE must be one of: ${allowedRoles.join(', ')}`);
  if (!STAFF_PASSWORD || STAFF_PASSWORD.length < 8) throw new Error('STAFF_PASSWORD must be at least 8 characters');
  if (!STAFF_EMAIL && !STAFF_PHONE) throw new Error('STAFF_EMAIL or STAFF_PHONE is required');

  await mongoose.connect(MONGO_URI);

  const email = STAFF_EMAIL?.trim().toLowerCase();
  const phone = STAFF_PHONE?.replace(/\D/g, '').slice(-10);

  const existingUser = await User.findOne({
    $or: [
      ...(email ? [{ email }] : []),
      ...(phone ? [{ phone }] : []),
    ],
  }).select('+password');

  if (existingUser) {
    existingUser.name = STAFF_NAME || existingUser.name || role;
    existingUser.email = email || existingUser.email;
    existingUser.phone = phone || existingUser.phone;
    existingUser.password = STAFF_PASSWORD;
    existingUser.role = role;
    await existingUser.save();
    console.log(`${role} account updated.`);
    return;
  }

  await User.create({
    name: STAFF_NAME || role,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    password: STAFF_PASSWORD,
    role,
  });

  console.log(`${role} account created.`);
}

createStaff()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
