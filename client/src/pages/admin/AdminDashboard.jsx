import React, { useState } from 'react';
import { LayoutDashboard, Beaker, Settings, UserPlus, LogOut, Bell, User } from 'lucide-react'; // 👈 UserPlus icon add kiya

// --- COMPONENTS IMPORT ---
import BookingManager from '../../components/admin/BookingManager';
import LabSettings from '../../components/admin/LabSettings'; 
import AddPatient from '../../components/admin/AddPatientModal'; // 👈 Check karo ye file hai ya nahi

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('bookings');

  const renderContent = () => {
    switch (activeTab) {
      case 'bookings': 
        return <BookingManager />;
      case 'add-patient': // 👈 Ye wala case wapas add kiya
        return <AddPatient />; 
      case 'settings': 
        return <LabSettings />;
      default: 
        return <BookingManager />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden fixed inset-0 z-[500]">
      
      {/* --- SIDEBAR --- */}
      <div className="w-72 bg-white border-r border-slate-100 p-6 flex flex-col shadow-2xl z-20">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-[#009494] p-2.5 rounded-2xl text-white">
            <Beaker size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-slate-800 italic">CITY LAB <span className="text-[#009494]">PRO</span></h1>
        </div>
        
        <nav className="flex-1 space-y-3">
          {/* Booking Button */}
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'bookings' ? 'bg-[#009494] text-white shadow-xl shadow-[#009494]/25' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Beaker size={18} /> Lab Bookings
          </button>

          {/* 🔴 ADD PATIENT BUTTON (Jo gayab tha) */}
          <button 
            onClick={() => setActiveTab('add-patient')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'add-patient' ? 'bg-[#009494] text-white shadow-xl shadow-[#009494]/25' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <UserPlus size={18} /> Add Patient
          </button>

          {/* Settings Button */}
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-[#009494] text-white shadow-xl shadow-[#009494]/25' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Settings size={18} /> Lab Settings
          </button>
        </nav>

        <div className="border-t border-slate-100 pt-6">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-[22px] font-black text-[11px] uppercase text-rose-400 hover:bg-rose-50 transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 z-10">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Administrator</p>
             </div>
             <div className="w-10 h-10 bg-[#009494]/10 rounded-xl flex items-center justify-center text-[#009494]">
                <User size={20} />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;