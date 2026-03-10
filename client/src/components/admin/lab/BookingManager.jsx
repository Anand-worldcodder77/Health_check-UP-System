import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, Search, Download, Trash2, Eye, RefreshCcw } from 'lucide-react';

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // --- 1. DATA LOADING LOGIC (Memoized for performance) ---
  const loadData = useCallback(() => {
    setIsSyncing(true);
    const saved = localStorage.getItem('labBookings');
    if (saved) {
      // Latest data hamesha upar dikhane ke liye reverse/sort logic use kar sakte hain
      setBookings(JSON.parse(saved));
    }
    // Chhota delay sync animation dikhane ke liye
    setTimeout(() => setIsSyncing(false), 800);
  }, []);

  // --- 2. REAL-TIME SYNC ENGINE ---
  useEffect(() => {
    loadData(); // Initial Load

    // Listen for events from BookingForm.jsx
    window.addEventListener('storage', loadData);
    window.addEventListener('new-booking-added', loadData);

    // Backup Polling (Har 5 second mein)
    const interval = setInterval(loadData, 5000);

    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('new-booking-added', loadData);
      clearInterval(interval);
    };
  }, [loadData]);

  // --- 3. STATUS UPDATE HANDLER ---
  const handleStatusUpdate = (id, newStatus) => {
    const updated = bookings.map(book => 
      book.id === id ? { ...book, status: newStatus } : book
    );
    setBookings(updated);
    localStorage.setItem('labBookings', JSON.stringify(updated));
    // Trigger event taaki baaki tabs update ho jayein
    window.dispatchEvent(new Event('storage'));
  };

  // --- 4. DELETE HANDLER ---
  const deleteBooking = (id) => {
    if(window.confirm("Are you sure you want to remove this record?")) {
      const updated = bookings.filter(book => book.id !== id);
      setBookings(updated);
      localStorage.setItem('labBookings', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
  };

  // --- 5. SEARCH FILTER ---
  const filteredBookings = bookings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.test.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">
            Live <span className="text-[#009494]">Bookings</span>
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200`}>
              <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-[#009494] animate-pulse' : 'bg-emerald-500'}`}></span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                {isSyncing ? 'Syncing...' : 'System Live'}
              </span>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              Records: {filteredBookings.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#009494] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by Patient, ID or Test..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-[24px] text-sm font-bold outline-none focus:ring-4 focus:ring-[#009494]/10 w-80 shadow-sm transition-all italic" 
            />
          </div>
          <button onClick={loadData} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-[#009494] transition-all shadow-lg active:scale-95">
             <RefreshCcw size={18} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[45px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Patient Identity</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Diagnostic Test</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Appointment Status</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black italic text-xs">
                          {item.name.charAt(0)}
                       </div>
                       <div>
                          <p className="font-black text-slate-800 text-base italic uppercase tracking-tight">{item.name}</p>
                          <p className="text-[10px] font-bold text-[#009494] uppercase tracking-tighter">{item.id} • {item.phone}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-sm font-bold text-slate-700 italic">{item.test}</p>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                      <Clock size={10} /> {item.date} | {item.time}
                    </p>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      item.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      item.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                      'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(item.id, 'confirmed')} 
                            className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="Accept"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(item.id, 'rejected')} 
                            className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                            title="Decline"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => deleteBooking(item.id)} 
                        className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
                        title="Delete Permanent"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                 <Search size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-black italic text-lg uppercase tracking-tight">No Patient Records found</p>
              <button onClick={() => setSearchTerm("")} className="text-[#009494] text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">Clear Search</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManager;