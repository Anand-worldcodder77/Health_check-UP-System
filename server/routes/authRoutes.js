const express = require('express');
const router = express.Router();
const User = require('../models/User');

// --- SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    const newUser = new User({ name, email, password }); // Note: Real project mein yahan password 'hash' karna chahiye (bcrypt)
    await newUser.save();
    
    res.status(201).json({ message: "Account created successfully!", user: { name, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password }); // Simple check
    
    if (!user) return res.status(401).json({ message: "Invalid credentials!" });
    
    res.status(200).json({ message: "Login successful!", user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;