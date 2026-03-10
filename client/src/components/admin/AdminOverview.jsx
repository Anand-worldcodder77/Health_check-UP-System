import React from 'react';
import { TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AdminOverview = ({ stats }) => {
  const cards = [
    { title: "Total Bookings", value: stats?.total || 0, icon: <TrendingUp />, color: "bg-blue-500" },
    { title: "Confirmed", value: stats?.confirmed || 0, icon: <CheckCircle />, color: "bg-emerald-500" },
    { title: "Pending", value: stats?.pending || 0, icon: <Clock />, color: "bg-amber-500" },
    { title: "Urgent Calls", value: stats?.calls || 0, icon: <AlertCircle />, color: "bg-rose-500" },
  ];

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
            <div className={`w-12 h-12 ${card.color} text-white rounded-2xl flex items-center justify-center mb-4`}>
              {card.icon}
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{card.title}</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{card.value}</h3>
          </div>
        ))}
      </div>
      
      {/* Yahan aap aage Graphs ya Charts add kar sakte ho */}
      <div className="mt-8 bg-white p-8 rounded-[40px] border border-slate-100 h-64 flex items-center justify-center text-slate-300 italic font-bold">
        Analytics Graph Coming Soon...
      </div>
    </div>
  );
};

export default AdminOverview;