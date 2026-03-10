import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package, Calendar, FileDown, Loader2 } from 'lucide-react';

const MyBookings = ({ user }) => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        // Hum user ke phone number se bookings fetch kar rahe hain
        const res = await fetch(`http://localhost:5000/api/bookings/user/${user.phone}`);
        const data = await res.json();
        setMyBookings(data);
      } catch (err) {
        console.error("Error fetching user bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.phone) fetchMyBookings();
  }, [user.phone]);

  if (loading) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#009494]" size={40} />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Fetching your records...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">My Test Bookings</h2>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Track your health checkup status & reports</p>
      </div>

      <div className="grid gap-4">
        {myBookings.length > 0 ? (
          myBookings.map((b) => (
            <div key={b._id} className="bg-white p-6 rounded-[30px] border border-slate-50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#009494]/20 transition-all">
              
              {/* Left Side: Package Info */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#009494] group-hover:bg-[#009494] group-hover:text-white transition-all shadow-inner">
                  <Package size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight leading-none mb-2">{b.selectedPackage}</h4>
                  <div className="flex flex-wrap gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                      <Calendar size={12} /> {new Date(b.bookingDate).toLocaleDateString('en-GB')}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                      <Clock size={12} /> {b.bookingTime || "Morning Slot"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Status & Download Button */}
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                
                {/* 👈 STEP 4: DOWNLOAD REPORT LOGIC */}
                {b.reportUrl && (
                  <a 
                    href={b.reportUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-[#009494] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-teal-100 animate-in zoom-in duration-300"
                  >
                    <FileDown size={14} /> Download Report
                  </a>
                )}

                <div className="text-right min-w-[100px]">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Current Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    b.status === 'Report Uploaded' ? 'bg-indigo-50 text-indigo-600' : 
                    b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {b.status === 'Report Uploaded' || b.status === 'Confirmed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {b.status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-[40px] text-center border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                <Package size={30} />
             </div>
             <p className="text-slate-400 font-bold italic">Aapne abhi tak koi test book nahi kiya hai.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;