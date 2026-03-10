import React, { useState, useEffect } from 'react';
import { Users, IndianRupee, Activity, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

const LabStats = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalEarnings: 0,
    pendingBookings: 0,
    confirmedBookings: 0
  });

  useEffect(() => {
    // LocalStorage se real data uthao
    const savedBookings = JSON.parse(localStorage.getItem('labBookings') || '[]');
    
    const earnings = savedBookings.reduce((acc, curr) => {
      // Amount se ₹ hata kar number mein badlo
      const price = parseInt(curr.amount.replace('₹', '').replace(',', '')) || 0;
      return acc + price;
    }, 0);

    const pending = savedBookings.filter(b => b.status === 'pending').length;
    const confirmed = savedBookings.filter(b => b.status === 'confirmed').length;

    setStats({
      totalPatients: savedBookings.length,
      totalEarnings: earnings,
      pendingBookings: pending,
      confirmedBookings: confirmed
    });
  }, []);

  const cards = [
    { 
      title: "Total Patients", 
      value: stats.totalPatients, 
      icon: <Users size={24} />, 
      color: "bg-blue-500", 
      trend: "+12% this month" 
    },
    { 
      title: "Revenue (INR)", 
      value: `₹${stats.totalEarnings.toLocaleString()}`, 
      icon: <IndianRupee size={24} />, 
      color: "bg-emerald-500", 
      trend: "Live Earnings" 
    },
    { 
      title: "Active Pending", 
      value: stats.pendingBookings, 
      icon: <Activity size={24} />, 
      color: "bg-amber-500", 
      trend: "Action Required" 
    },
    { 
      title: "Confirmed", 
      value: stats.confirmedBookings, 
      icon: <TrendingUp size={24} />, 
      color: "bg-[#009494]", 
      trend: "Ready for Report" 
    },
  ];

  return (
    <div className="p-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">Quick Overview</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Calendar size={12} /> Today: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Online</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
            <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
              {card.icon}
            </div>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{card.title}</h3>
            <p className="text-3xl font-black text-slate-800 italic">{card.value}</p>
            <div className="mt-4 flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
              <ArrowUpRight size={12} className="text-emerald-500" /> {card.trend}
            </div>
            {/* Background Decoration */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${card.color} opacity-5 rounded-full`}></div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Welcome Message */}
      <div className="bg-slate-900 rounded-[50px] p-12 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h3 className="text-3xl font-black italic mb-4 uppercase tracking-tighter">Welcome Back, Admin!</h3>
          <p className="text-slate-400 text-sm max-w-md font-medium leading-relaxed">
            Your lab is performing <span className="text-[#009494] font-bold">24% better</span> than last week. Check your pending bookings to maintain a high customer satisfaction rate.
          </p>
          <button className="mt-8 px-8 py-4 bg-[#009494] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">
            Generate Full Report
          </button>
        </div>
        <div className="mt-10 md:mt-0 relative z-10 flex gap-4">
            <div className="w-32 h-32 bg-white/5 rounded-[35px] border border-white/10 flex flex-col items-center justify-center backdrop-blur-md">
                <p className="text-2xl font-black">98%</p>
                <p className="text-[8px] font-bold uppercase opacity-40">Accuracy</p>
            </div>
            <div className="w-32 h-32 bg-white/5 rounded-[35px] border border-white/10 flex flex-col items-center justify-center backdrop-blur-md">
                <p className="text-2xl font-black">24m</p>
                <p className="text-[8px] font-bold uppercase opacity-40">Avg. Time</p>
            </div>
        </div>
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#009494]/20 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
};

export default LabStats;