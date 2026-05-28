const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const normalizePhone = (phone = '') => phone.replace(/\D/g, '').slice(-10);
const buildUserResponse = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  familyMembers: user.familyMembers,
  addresses: user.addresses,
  healthCoins: user.healthCoins,
});

const createToken = (user) => {
  const secret = process.env.JWT_SECRET || process.env.MONGO_URI;
  if (!secret) {
    throw new Error('JWT_SECRET is required in server environment');
  }

  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    secret,
    { expiresIn: '7d' },
  );
};

// --- SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);
    const requestedRole = req.body.role?.toString().trim().toUpperCase();
    
    if (requestedRole && requestedRole !== 'CUSTOMER') {
      return res.status(403).json({ message: 'Staff accounts must be created by an existing administrator.' });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required!' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    const newUser = new User({
      name,
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
      password,
      role: 'CUSTOMER',
    });
    await newUser.save();
    const token = createToken(newUser);
    
    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: buildUserResponse(newUser),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email || req.body.identifier);
    const phone = normalizePhone(req.body.phone || req.body.identifier);
    const { password, role } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({ message: 'Email/phone and password are required.' });
    }

    const user = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    }).select('+password');
    
    if (!user) return res.status(401).json({ message: "Invalid credentials!" });

    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) return res.status(401).json({ message: "Invalid credentials!" });

    if (role && user.role !== role) {
      return res.status(403).json({ message: 'This account does not have access to this area.' });
    }

    if (user.password && !/^\$2[aby]\$\d{2}\$/.test(user.password)) {
      user.password = password;
      await user.save();
    }

    const token = createToken(user);
    
    res.status(200).json({
      message: "Login successful!",
      token,
      user: buildUserResponse(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/family-members', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { familyMembers: req.body } },
      { new: true, runValidators: true }
    ).select('-password -otp');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:id/addresses', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { addresses: req.body } },
      { new: true, runValidators: true }
    ).select('-password -otp');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
