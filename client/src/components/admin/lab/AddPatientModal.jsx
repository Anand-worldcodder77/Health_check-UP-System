import React, { useState } from 'react';
import { UserPlus, Phone, Clipboard, Save, User, Hash } from 'lucide-react';

const AddPatient = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Male',
    testRequired: '',
    amount: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Pehle puraani bookings uthao
    const existingBookings = JSON.parse(localStorage.getItem('labBookings') || '[]');

    // 2. Naya patient object banao
    const newPatient = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`, // Random ID
      name: formData.name,
      test: formData.testRequired,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'confirmed', // Manual entry hai toh direct confirm
      amount: `₹${formData.amount}`
    };

    // 3. Save karo
    const updatedBookings = [newPatient, ...existingBookings];
    localStorage.setItem('labBookings', JSON.stringify(updatedBookings));

    alert("Patient Record Saved & Confirmed! ✅");
    
    // Form clear kar do
    setFormData({ name: '', phone: '', age: '', gender: 'Male', testRequired: '', amount: '' });
  };

  return (
    <div className="p-8 max-w-4xl animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">Register Patient</h2>
        <p className="text-[#009494] font-black text-[10px] uppercase tracking-[0.3em] mt-2">Direct Lab Entry Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Name */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">
              <User size={14} className="text-[#009494]" /> Patient Full Name
            </label>
            <input 
              type="text" required value={formData.name}
              placeholder="e.g. Anand Kumar"
              className="w-full px-7 py-5 rounded-[24px] bg-slate-50 border-none font-bold text-slate-700 focus:ring-4 focus:ring-[#009494]/10 outline-none transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Phone */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">
              <Phone size={14} className="text-[#009494]" /> Mobile Number
            </label>
            <input 
              type="tel" required value={formData.phone}
              placeholder="+91 00000 00000"
              className="w-full px-7 py-5 rounded-[24px] bg-slate-50 border-none font-bold text-slate-700 focus:ring-4 focus:ring-[#009494]/10 outline-none transition-all"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          {/* Test & Amount */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">
              <Clipboard size={14} className="text-[#009494]" /> Prescribed Test
            </label>
            <input 
              type="text" required value={formData.testRequired}
              placeholder="e.g. CBC / Vitamin D"
              className="w-full px-7 py-5 rounded-[24px] bg-slate-50 border-none font-bold text-slate-700 focus:ring-4 focus:ring-[#009494]/10 outline-none transition-all"
              onChange={(e) => setFormData({...formData, testRequired: e.target.value})}
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-400 tracking-widest px-1">
              <Hash size={14} className="text-[#009494]" /> Billing Amount (₹)
            </label>
            <input 
              type="number" required value={formData.amount}
              placeholder="999"
              className="w-full px-7 py-5 rounded-[24px] bg-slate-50 border-none font-bold text-slate-700 focus:ring-4 focus:ring-[#009494]/10 outline-none transition-all"
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-6 bg-slate-900 text-white rounded-[30px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#009494] transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <Save size={22} /> Finalize & Print Receipt
        </button>
      </form>
    </div>
  );
};

export default AddPatient;