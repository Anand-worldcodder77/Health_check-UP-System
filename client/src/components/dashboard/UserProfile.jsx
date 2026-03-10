import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, ShieldCheck, Loader2 } from 'lucide-react';

const UserProfile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    gender: user?.gender || "Not Specified",
    age: user?.age || ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- API CONNECTION LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/update-profile/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. LocalStorage update karein taaki refresh par purana data na dikhe
        const updatedUserData = { ...user, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        
        alert("Profile update ho gayi hai! ✅");
        // Page reload ya state sync kar sakte hain agar sidebar mein naam turant badalna ho
        window.location.reload(); 
      } else {
        alert(data.message || "Update fail ho gaya");
      }
    } catch (err) {
      console.error("Profile Update Error:", err);
      alert("Server se connect nahi ho pa rahe hain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-[#009494] to-teal-700 p-8 flex items-end">
          <div className="w-24 h-24 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center text-[#009494] mb-[-40px]">
            <User size={40} strokeWidth={3} />
          </div>
        </div>

        <div className="p-12 pt-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Account Settings</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manage your personal information</p>
            </div>
            <div className="px-4 py-2 bg-emerald-50 rounded-full flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={16} />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Account</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-300" size={18} />
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#009494]/20 font-bold text-slate-700"
                  required
                />
              </div>
            </div>

            {/* Email (Disabled - Cannot change) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-300" size={18} />
                <input 
                  type="email" name="email" value={formData.email} disabled
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl cursor-not-allowed font-bold text-slate-400"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-slate-300" size={18} />
                <input 
                  type="text" name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#009494]/20 font-bold text-slate-700"
                />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Age</label>
              <input 
                type="number" name="age" value={formData.age} onChange={handleChange}
                className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#009494]/20 font-bold text-slate-700"
              />
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Home Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-slate-300" size={18} />
                <textarea 
                  name="address" value={formData.address} onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#009494]/20 font-bold text-slate-700 h-24 resize-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="md:col-span-2 mt-4 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-slate-800 disabled:bg-slate-400 transition-all shadow-xl shadow-slate-200"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? "Saving Changes..." : "Save Profile Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;