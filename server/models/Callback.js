const mongoose = require('mongoose');

const CallbackSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Called'],
    default: 'Pending'
  },
  requestedAt: {
    type: String, // Hum "10:30 AM" format save kar rahe hain
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Sorting ke liye asli timestamp
  }
});

module.exports = mongoose.model('Callback', CallbackSchema);