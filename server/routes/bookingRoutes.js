// User ki bookings fetch karne ke liye (Based on Phone or Email)
app.get('/api/bookings/user/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    // Hum phone number ya email dono se search kar sakte hain
    const userBookings = await Booking.find({
      $or: [{ phone: identifier }, { userPhone: identifier }, { email: identifier }]
    }).sort({ bookingDate: -1 });

    res.status(200).json(userBookings);
  } catch (err) {
    res.status(500).json({ error: "Bookings fetch karne mein error hai!" });
  }
});