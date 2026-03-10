import React, { useState, useEffect } from 'react';
import { Users, Droplets, ShieldCheck } from 'lucide-react';

const BookingCounter = () => {
  const [samples, setSamples] = useState(12480);
  const [activeUsers, setActiveUsers] = useState(142);

  // Real-time effect: Numbers ko har kuch seconds mein badhana
  useEffect(() => {
    const interval = setInterval(() => {
      setSamples(prev => prev + Math.floor(Math.random() * 3) + 1);
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(130, prev + change);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 py-6 border-y border-white/10 overflow-hidden relative">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/4 w-64 h-full bg-blue-600/20 blur-[100px]"></div>
      
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around items-center gap-8 relative z-10">
        
        {/* Counter 1: Total Samples */}
        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-blue-600/20 rounded-2xl group-hover:bg-blue-600/40 transition-colors">
            <Droplets className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tabular-nums tracking-tight">
              {samples.toLocaleString()}+
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
              Samples Collected Today
            </div>
          </div>
        </div>

        {/* Counter 2: Active Bookings */}
        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-green-600/20 rounded-2xl group-hover:bg-green-600/40 transition-colors">
            <Users className="text-green-400 w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tabular-nums tracking-tight">
              {activeUsers}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
              Patients Booking Now
            </div>
          </div>
        </div>

        {/* Counter 3: Lab Safety */}
        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-teal-600/20 rounded-2xl group-hover:bg-teal-600/40 transition-colors">
            <ShieldCheck className="text-teal-400 w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight uppercase">
              ISO 9001:2015
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
              Certified Safety Standards
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingCounter;