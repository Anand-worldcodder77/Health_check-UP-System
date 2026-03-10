import React, { useState } from 'react';
import { LayoutDashboard, UserCircle, ShoppingBag, LogOut } from 'lucide-react';
import UserProfile from './dashboard/UserProfile'; 
import MyBookings from './dashboard/MyBookings'; // 👈 STEP 3: Asli file import ho gayi

const UserDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex min-h-screen bg-[#f8fafc] pt-20">
      
      {/* --- USER SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 flex flex-col fixed h-full z-10 left-0 top-0">
        <div className="mb-10 px-4 pt-10">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">User Panel</h2>
          <p className="text-slate-800 font-bold mt-1 truncate">Namaste, {user?.name}</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest ${
              activeTab === 'profile' ? 'bg-[#009494] text-white shadow-lg shadow-teal-100' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <UserCircle size={18} /> My Profile
          </button>

          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest ${
              activeTab === 'bookings' ? 'bg-[#009494] text-white shadow-lg shadow-teal-100' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag size={18} /> My Bookings
          </button>
        </nav>

        <button 
          onClick={onLogout}
          className="mt-auto mb-10 flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-black text-[11px] uppercase tracking-widest"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-72 p-10">
        <div className="max-w-5xl mx-auto">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <UserProfile user={user} />
          )}

          {/* BOOKINGS TAB - 👈 Placeholder hatakar MyBookings connect kar diya */}
          {activeTab === 'bookings' && (
            <MyBookings user={user} />
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;