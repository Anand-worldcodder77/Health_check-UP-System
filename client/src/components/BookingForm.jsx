import React, { useState } from 'react';
import { User, Phone, MapPin, Send, CheckCircle2, X } from 'lucide-react';

const BookingForm = ({ packageName, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submit Clicked..."); // Debug 1

    try {
      // 1. Naya data object banana
      const newEntry = {
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        phone: formData.phone,
        test: packageName || "Health Package",
        address: formData.address,
        date: new Date().toLocaleDateString('en-GB'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'pending',
        amount: "₹999"
      };

      console.log("New Entry Created:", newEntry); // Debug 2

      // 2. Purana data nikalna
      const rawData = localStorage.getItem('labBookings');
      const existingData = rawData ? JSON.parse(rawData) : [];
      
      // 3. Naya data add karna
      const finalData = [newEntry, ...existingData];
      
      // 4. LocalStorage mein save karna (Sabse important step)
      localStorage.setItem('labBookings', JSON.stringify(finalData));
      
      console.log("Data Saved to LocalStorage!"); // Debug 3

      // 5. Signal bhejna
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('new-booking-added'));

      setSubmitted(true);
      setTimeout(() => onClose(), 2500);

    } catch (error) {
      console.error("SAVING ERROR:", error); // Agar koi error aaye toh yahan dikhega
    }
  };

  if (submitted) {
    return (
      <div className="p-10 text-center animate-bounce">
        <CheckCircle2 size={50} className="text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold italic uppercase">Booking Confirmed!</h2>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-black italic uppercase mb-6 text-slate-800">Book Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" required placeholder="Patient Name"
          className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#009494]"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input 
          type="tel" required placeholder="Phone Number"
          className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#009494]"
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
        <textarea 
          required placeholder="Address"
          className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#009494] resize-none"
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        ></textarea>
        
        <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#009494] transition-all">
          Confirm Now
        </button>
      </form>
    </div>
  );
};

export default BookingForm;