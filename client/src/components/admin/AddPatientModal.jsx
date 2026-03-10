import React, { useState } from 'react';
// Humne icons ko change kiya hai jo stable hain
import { X, UserPlus, Phone, Package, MapPin, User, Activity, Users } from 'lucide-react';

const AddPatientModal = ({ isOpen, onClose, onSuccess, isAdmin = false }) => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    selectedPackage: '',
    age: '',
    gender: 'Male',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/bookings/manual-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        onSuccess();
        onClose();
        alert("Patient Added! ✅");
        setFormData({ userName: '', userEmail: '', userPhone: '', selectedPackage: '', age: '', gender: 'Male', address: '' });
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {isAdmin ? "New Patient Entry" : "Book Test"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Patient Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-300" size={16} />
              <input required type="text" placeholder="Name" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                onChange={(e) => setFormData({...formData, userName: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Phone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-slate-300" size={16} />
              <input required type="tel" placeholder="Phone" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                onChange={(e) => setFormData({...formData, userPhone: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Age</label>
            <div className="relative">
              <Activity className="absolute left-4 top-3.5 text-slate-300" size={16} />
              <input required type="number" placeholder="Age" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                onChange={(e) => setFormData({...formData, age: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Gender</label>
            <div className="relative">
              <Users className="absolute left-4 top-3.5 text-slate-300" size={16} />
              <select className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold appearance-none"
                onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Test Package</label>
            <div className="relative">
              <Package className="absolute left-4 top-3.5 text-slate-300" size={16} />
              <input required type="text" placeholder="Package Name" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                onChange={(e) => setFormData({...formData, selectedPackage: e.target.value})} />
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 text-slate-300" size={16} />
              <textarea required rows="2" placeholder="Address" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </div>
          </div>

          <div className="md:col-span-2 flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest">Cancel</button>
            <button type="submit" className="flex-1 py-4 bg-[#009494] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-teal-100">
              Confirm & Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;