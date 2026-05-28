const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// --- 1. ROUTES & MODELS IMPORT ---
const callbackRoutes = require('./routes/callbackRoutes');
const authRoutes = require('./routes/authRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const slotRoutes = require('./routes/slotRoutes');
const platformBookingRoutes = require('./routes/platformBookingRoutes');
const doctorApplicationRoutes = require('./routes/doctorApplicationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const Booking = require('./models/Booking');
const sendEmail = require('./utils/sendEmail');

const app = express();

// --- 2. MIDDLEWARES ---
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/uploads/reports', express.static('uploads/reports'));

// --- 3. MULTER STORAGE SETUP ---
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only prescription image or PDF can be uploaded.'), false);
    }
  },
});

const reportStorage = multer.diskStorage({
  destination: './uploads/reports/',
  filename: (req, file, cb) => {
    cb(null, `Report-${Date.now()}-${file.originalname}`);
  }
});

const uploadReport = multer({ 
  storage: reportStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Sirf PDF upload kar sakte hain!'), false);
    }
  }
});

// --- 4. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.log("❌ Connection Error:", err));

// --- 5. SYSTEM INTEGRATIONS ---
app.use('/api/callbacks', callbackRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/bookings', bookingRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/platform/bookings', platformBookingRoutes);
app.use('/api/doctor-applications', doctorApplicationRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/chatbot', chatbotRoutes);

// --- 6. ROUTES ---

// 👈 NAYA: Manual Patient/Booking Add Route
app.post('/api/bookings/manual-add', async (req, res) => {
  try {
    const { userName, userEmail, userPhone, selectedPackage, age, gender, address } = req.body;
    
    const newBooking = new Booking({
      userName,
      userEmail,
      userPhone,
      selectedPackage,
      age,
      gender,
      address,
      status: 'Confirmed', // Manual add matlab lab mein patient aa chuka hai
      bookingDate: new Date()
    });

    const saved = await newBooking.save();
    res.status(201).json({ message: "Patient added successfully! ✅", data: saved });
  } catch (err) {
    console.error("Manual Add Error:", err);
    res.status(500).json({ error: "Patient add karne mein error hai!" });
  }
});

const handlePrescriptionUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (!err) return next();
    return res.status(400).json({ error: err.message || 'Upload failed.' });
  });
};

// Prescription/Image Upload API
app.post('/api/upload', handlePrescriptionUpload, (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` });
});

const handleReportUpload = (req, res, next) => {
  uploadReport.single('report')(req, res, (err) => {
    if (!err) return next();
    return res.status(400).json({ error: err.message || 'Report upload failed.' });
  });
};

// Report Upload Route
app.post('/api/bookings/upload-report/:id', handleReportUpload, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'PDF report file is required.' });

    const reportUrl = `${req.protocol}://${req.get('host')}/uploads/reports/${req.file.filename}`;
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { reportUrl: reportUrl, status: 'Report Uploaded' },
      { new: true }
    );

    if (updatedBooking.userEmail) {
      const subject = "Medical Report Ready! 📄";
      const text = `Namaste ${updatedBooking.userName},\n\nAapki ${updatedBooking.selectedPackage} ki report upload ho gayi hai. Aap dashboard se ise download kar sakte hain.\n\nTeam City Lab`;
      await sendEmail(updatedBooking.userEmail, subject, text);
    }

    res.status(200).json({ message: "Report uploaded successfully! ✅", data: updatedBooking });
  } catch (err) {
    res.status(500).json({ error: "Report upload fail ho gayi!" });
  }
});

// Create New Booking (Frontend Form)
app.post('/api/bookings/new', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const saved = await newBooking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch All Bookings (Admin)
app.get('/api/bookings/all', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 }); 
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Data fetch error!" });
  }
});

// Fetch User Specific Bookings
app.get('/api/bookings/user/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const userBookings = await Booking.find({ userPhone: phone }).sort({ createdAt: -1 });
    res.status(200).json(userBookings);
  } catch (err) {
    res.status(500).json({ error: "Bookings fetch error!" });
  }
});

// Update Status
app.patch('/api/bookings/update-status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ message: `Status updated to ${status} ✅`, data: updatedBooking });
  } catch (err) {
    res.status(500).json({ error: "Update error!" });
  }
});

// Admin Callbacks
app.get('/api/admin/callbacks', async (req, res) => {
  try {
    const callbacks = await mongoose.connection.collection('callbacks').find().sort({ createdAt: -1 }).toArray();
    res.status(200).json(callbacks);
  } catch (err) {
    res.status(500).json({ error: "Callbacks error!" });
  }
});

const normalizeProfilePhone = (phone = '') => phone.toString().replace(/\D/g, '').slice(-10);

app.put('/api/auth/update-profile-v2/:id', async (req, res) => {
  try {
    const User = mongoose.model('User');
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Valid user id nahi mila. Please login again.' });
    }

    const phone = normalizeProfilePhone(req.body.phone);
    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Valid 10 digit phone number required hai.' });
    }

    if (phone) {
      const existingPhoneUser = await User.findOne({ phone, _id: { $ne: id } });
      if (existingPhoneUser) {
        return res.status(409).json({ message: 'Ye phone number kisi aur account me already used hai.' });
      }
    }

    const updates = {
      name: req.body.name?.toString().trim(),
      ...(phone ? { phone } : {}),
      address: req.body.address?.toString().trim(),
      age: req.body.age === '' || req.body.age === undefined ? undefined : Number(req.body.age),
      gender: req.body.gender || 'Not Specified',
    };

    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { returnDocument: 'after', runValidators: true }
    ).select('-password -otp');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User account nahi mila. Please login again.' });
    }

    res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Update fail ho gaya.' });
  }
});

// Update User Profile
app.put('/api/auth/update-profile/:id', async (req, res) => {
  try {
    const { name, phone, address, age, gender } = req.body;
    const User = mongoose.model('User'); 
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, phone, address, age, gender }, { new: true }).select('-password'); 
    res.status(200).json({ message: "Profile updated! ✅", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Update fail!" });
  }
});

// Delete Booking
app.delete('/api/bookings/delete/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "✅ Booking delete ho gayi h!" });
  } catch (err) {
    res.status(500).json({ error: "❌ Delete error!" });
  }
});

// --- 7. SERVER START ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`👤 Manual Patient API: http://localhost:${PORT}/api/bookings/manual-add`);
});
