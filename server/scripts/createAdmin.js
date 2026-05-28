const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function createAdmin() {
  const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } = process.env;

  if (!MONGO_URI) throw new Error('MONGO_URI is required');
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters');
  }
  if (!ADMIN_EMAIL && !ADMIN_PHONE) {
    throw new Error('ADMIN_EMAIL or ADMIN_PHONE is required');
  }

  await mongoose.connect(MONGO_URI);

  const email = ADMIN_EMAIL?.trim().toLowerCase();
  const phone = ADMIN_PHONE?.replace(/\D/g, '').slice(-10);

  const existingAdmin = await User.findOne({
    $or: [
      ...(email ? [{ email }] : []),
      ...(phone ? [{ phone }] : []),
    ],
  }).select('+password');

  if (existingAdmin) {
    existingAdmin.name = ADMIN_NAME || existingAdmin.name || 'Admin';
    existingAdmin.email = email || existingAdmin.email;
    existingAdmin.phone = phone || existingAdmin.phone;
    existingAdmin.password = ADMIN_PASSWORD;
    existingAdmin.role = 'ADMIN';
    await existingAdmin.save();
    console.log('Admin account updated in database.');
    return;
  }

  await User.create({
    name: ADMIN_NAME || 'Admin',
    email,
    phone,
    password: ADMIN_PASSWORD,
    role: 'ADMIN',
  });

  console.log('Admin account created in database.');
}

createAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
