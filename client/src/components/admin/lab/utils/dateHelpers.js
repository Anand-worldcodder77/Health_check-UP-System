// src/components/admin/lab/utils/dateHelpers.js
export const sortBookingsByDate = (bookings) => {
  return [...bookings].sort((a, b) => {
    // Maan lete hain ki backend se 'createdAt' ya 'date' aa raha hai
    const dateA = new Date(a.createdAt || a.date);
    const dateB = new Date(b.createdAt || b.date);
    return dateB - dateA; // Newest first
  });
};