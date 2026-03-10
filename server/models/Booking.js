const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true }, // Humne isi se dashboard filter kiya hai
    selectedPackage: { type: String, required: true },
    prescription: { type: String }, // Image URL path
    
    // 👈 NAYA: Report PDF ka path save karne ke liye
    reportUrl: { type: String, default: null }, 
    
    // 👈 NAYA: Status tracking ke liye (Pending/Confirmed/Report Uploaded)
    status: { 
      type: String, 
      default: 'Pending',
      enum: ['Pending', 'Confirmed', 'Report Uploaded', 'Rejected'] 
    },
    
    bookingDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

// Model export
module.exports = mongoose.model('Booking', bookingSchema);