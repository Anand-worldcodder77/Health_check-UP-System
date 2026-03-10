import React, { useState, useEffect } from 'react';
import { Save, Building2, MapPin, Phone, Globe, ShieldCheck } from 'lucide-react';

const LabSettings = () => {
  const [labData, setLabData] = useState({
    labName: 'City Clinical Lab',
    contact: '+91 98765 43210',
    address: '123 Health Street, Medical Hub',
    email: 'contact@citylab.com',
    timing: '08:00 AM - 08:00 PM'
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('labSettings');
    if (savedData) setLabData(JSON.parse(savedData));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('labSettings', JSON.stringify(labData));
    alert("Lab Settings Updated Successfully! 🚀");
    window.location.reload(); // Refresh to apply changes everywhere
  };

  return (
    <div className="p-8 max-w-5xl animate-in fade-in duration-700">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Lab Configuration</h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Manage public information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Lab Display Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-4 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    value={labData.labName}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#009494]/20"
                    onChange={(e) => setLabData({...labData, labName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Support Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    value={labData.contact}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#009494]/20"
                    onChange={(e) => setLabData({...labData, contact: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Lab Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                <textarea 
                  value={labData.address}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#009494]/20 min-h-[100px]"
                  onChange={(e) => setLabData({...labData, address: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-[#009494] text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#009494]/20 hover:bg-slate-900 transition-all active:scale-95">
              <Save size={20} /> Update Lab Profile
            </button>
          </div>
        </form>

        {/* Preview Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="bg-[#009494] w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#009494] mb-2">Live Preview</p>
              <h3 className="text-2xl font-black italic">{labData.labName}</h3>
              <div className="mt-6 space-y-4 text-slate-400 text-sm font-medium">
                <p className="flex items-center gap-3"><Phone size={14} /> {labData.contact}</p>
                <p className="flex items-center gap-3"><MapPin size={14} /> {labData.address}</p>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#009494]/10 blur-[50px] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabSettings;