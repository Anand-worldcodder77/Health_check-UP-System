import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Search, Filter, MoreVertical, Eye } from 'lucide-react';

const BookingManager = () => {
  // --- MOCK DATA (Baaki isse hum database se connect karenge) ---
  const [bookings, setBookings] = useState([
    { id: 'BK-101', name: 'Rahul Sharma', test: 'Full Body Checkup', date: '2024-03-20', status: 'pending', amount: '₹1,999' },
    { id: 'BK-102', name: 'Anita Verma', test: 'Diabetes Gold', date: '2024-03-21', status: 'confirmed', amount: '₹899' },
    { id: 'BK-103', name: 'Amit Kumar', test: 'Thyroid Advance', date: '2024-03-22', status: 'rejected', amount: '₹1,200' },
  ]);

  // --- STATUS HANDLER ---
  const updateStatus = (id, newStatus) => {
    setBookings(bookings.map(book => 
      book.id === id ? { ...book, status: newStatus } : book
    ));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Booking Manager</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Manage online appointments</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type="text" placeholder="Search ID or Name..." className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#009494]/20 w-64" />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#009494] transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Patient & ID</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Test Details</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#009494] font-bold text-xs uppercase italic">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm italic uppercase">{item.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase mt-0.5">{item.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-700 text-sm">{item.test}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.date}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-end gap-2">
                    {item.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateStatus(item.id, 'confirmed')}
                          className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                          title="Confirm Booking"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => updateStatus(item.id, 'rejected')}
                          className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          title="Reject Booking"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {bookings.length === 0 && (
          <div className="p-20 text-center">
            <Clock size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold italic">No bookings found for today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManager;