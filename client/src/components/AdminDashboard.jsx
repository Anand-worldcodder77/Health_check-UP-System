import React, { useState, useEffect } from 'react';

// --- COMPONENTS IMPORT (Asli Files) ---
import AdminSidebar from './admin/AdminSidebar';
import AdminOverview from './admin/AdminOverview';
import BookingManager from './admin/BookingManager'; 
import CallbackLogs from './admin/CallbackLogs'; // 👈 Ab ye asli component import ho gaya

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, calls: 0 });

  // --- DATA FETCHING (Live Stats) ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Bookings fetch karna stats ke liye
        const resBookings = await fetch('http://localhost:5000/api/bookings/all');
        const bookingsData = await resBookings.json();
        
        // 2. Callbacks fetch karna stats ke liye
        const resCalls = await fetch('http://localhost:5000/api/admin/callbacks');
        const callsData = await resCalls.json();

        // Real-time calculation
        setStats({
          total: bookingsData.length,
          confirmed: bookingsData.filter(b => b.status === 'Confirmed').length || 0,
          pending: bookingsData.filter(b => b.status !== 'Confirmed' && b.status !== 'Rejected').length || 0,
          calls: callsData.length || 0 // 👈 Ab calls bhi real database se aa rahe hain
        });
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };
    
    fetchStats();
    // Professional Tip: Har 1 minute mein data refresh karne ke liye
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      
      {/* 1. SIDEBAR: Tab change handle karta hai */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 ml-64">
        
        {/* TOP HEADER: Page Title aur Server Status */}
        <header className="bg-white py-6 px-10 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
            {activeTab === 'overview' ? 'Operational Overview' : activeTab.replace('-', ' ')}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                System Live
              </span>
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC TAB SWITCHING (No more placeholders!) */}
        <main className="p-4 animate-in fade-in slide-in-from-bottom-3 duration-700">
          {activeTab === 'overview' && <AdminOverview stats={stats} />}
          {activeTab === 'bookings' && <BookingManager />}
          {activeTab === 'callbacks' && <CallbackLogs />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;