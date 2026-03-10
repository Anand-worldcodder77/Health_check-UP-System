import React, { useState } from 'react';
import { LayoutDashboard, Beaker, Settings, UserPlus, LogOut, Bell, User } from 'lucide-center';
import { LayoutDashboard as DashboardIcon, Beaker as BookingIcon, Settings as SettingsIcon, UserPlus as AddIcon, LogOut as LogoutIcon, Bell as BellIcon, User as UserIcon } from 'lucide-react';

// --- COMPONENTS IMPORT ---
import BookingManager from '../../components/admin/lab/BookingManager';
import LabSettings from '../../components/admin/lab/LabSettings'; 
import AddPatient from '../../components/admin/lab/AddPatient';
import LabStats from '../../components/admin/lab/LabStats'; 

const AdminDashboard = ({ onLogout }) => {
  // Default tab 'dashboard' rakha hai taaki login karte hi stats dikhen
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- RENDER LOGIC ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <LabStats />;
      case 'bookings': 
        return <BookingManager />;
      case 'add-patient':
        return <AddPatient />;
      case 'settings': 
        return <LabSettings />;
      default: 
        return <LabStats />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden fixed inset-0 z-[500]">
      
      {/* --- SIDEBAR --- */}
      <div className="w-72 bg-white border-r border-slate-100 p-6 flex flex-col shadow-2xl z-20">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-[#009494] p-2.5 rounded-2xl text-white shadow-lg shadow-[#009494]/30">
            <BookingIcon size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-slate-800 italic">
            CITY LAB <span className="text-[#009494]">PRO</span>
          </h1>
        </div>
        
        <nav className="flex-1 space-y-3 overflow-y-auto pr-2">
          {/* 1. Dashboard Button */}
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'dashboard' 
              ? 'bg-[#009494] text-white shadow-xl shadow-[#009494]/25 translate-x-2' 
              : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <DashboardIcon size={18} /> Dashboard
          </button>

          {/* 2. Booking Button */}
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'bookings' 
              ? 'bg-[#009494] text-white shadow-xl shadow-[#009494]/25 translate-x-2' 
              : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <BookingIcon size={18} /> Lab Bookings
          </button>

          {/* 3. Add Patient Button */}
          <button 
            onClick={() => setActiveTab('add-patient')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'add-patient' 
              ? 'bg-[#009494] text-white shadow-xl shadow-[#009494]/25 translate-x-2' 
              : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <AddIcon size={18} /> Add Patient
          </button>

          {/* 4. Settings Button */}
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'settings' 
              ? 'bg-[#009494] text-white shadow-xl shadow-[#009494]/25 translate-x-2' 
              : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <SettingsIcon size={18} /> Lab Settings
          </button>
        </nav>

        {/* Logout Section */}
        <div className="border-t border-slate-100 pt-6">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-[22px] font-black text-[11px] uppercase text-rose-400 hover:bg-rose-50 transition-all duration-300"
          >
            <LogoutIcon size={18} /> Logout Session
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header Bar */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-[#009494] uppercase tracking-[0.3em]">Management System</h2>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Administrator Live Panel</p>
          </div>
          
          <div className="flex items-center gap-6">
             <button className="relative p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-[#009494] transition-all">
                <BellIcon size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
             </button>
             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                <UserIcon size={20} />
             </div>
          </div>
        </header>

        {/* Component Display Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;