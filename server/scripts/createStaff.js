const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const allowedRoles = ['ADMIN', 'DOCTOR', 'LAB_STAFF', 'PHLEBOTOMIST', 'PATHOLOGIST'];

function getStaffAccounts() {
  const indexedAccounts = Object.keys(process.env)
    .map((key) => key.match(/^STAFF_(\d+)_ROLE$/)?.[1])
    .filter(Boolean)
    .sort((a, b) => Number(a) - Number(b))
    .map((index) => ({
      name: process.env[`STAFF_${index}_NAME`],
      email: process.env[`STAFF_${index}_EMAIL`],
      phone: process.env[`STAFF_${index}_PHONE`],
      password: process.env[`STAFF_${index}_PASSWORD`],
      role: process.env[`STAFF_${index}_ROLE`],
    }));

  if (indexedAccounts.length) return indexedAccounts;

  return [{
    name: process.env.STAFF_NAME,
    email: process.env.STAFF_EMAIL,
    phone: process.env.STAFF_PHONE,
    password: process.env.STAFF_PASSWORD,
    role: process.env.STAFF_ROLE,
  }];
}

async function upsertStaffAccount(account) {
  const role = (account.role || '').trim().toUpperCase();

  if (!allowedRoles.includes(role)) throw new Error(`STAFF_ROLE must be one of: ${allowedRoles.join(', ')}`);
  if (!account.password || account.password.length < 8) throw new Error(`${role} STAFF_PASSWORD must be at least 8 characters`);
  if (!account.email && !account.phone) throw new Error(`${role} STAFF_EMAIL or STAFF_PHONE is required`);

  const email = account.email?.trim().toLowerCase();
  const phone = account.phone?.replace(/\D/g, '').slice(-10);

  const existingUser = await User.findOne({
    $or: [
      ...(email ? [{ email }] : []),
      ...(phone ? [{ phone }] : []),
    ],
  }).select('+password');

  if (existingUser) {
    existingUser.name = account.name || existingUser.name || role;
    existingUser.email = email || existingUser.email;
    existingUser.phone = phone || existingUser.phone;
    existingUser.password = account.password;
    existingUser.role = role;
    await existingUser.save();
    console.log(`${role} account updated.`);
    return;
  }

  await User.create({
    name: account.name || role,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    password: account.password,
    role,
  });

  console.log(`${role} account created.`);
}

async function createStaff() {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) throw new Error('MONGO_URI is required');

  await mongoose.connect(MONGO_URI);

  const staffAccounts = getStaffAccounts();
  for (const account of staffAccounts) {
    await upsertStaffAccount(account);
  }
}

createStaff()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
