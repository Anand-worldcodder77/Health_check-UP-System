import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package, Calendar, FileDown, Loader2, X, MapPin, Phone, UserRound } from 'lucide-react';
import { API_BASE } from '../../services/apiConfig';

const getPatientSummary = (booking) => {
  const names = booking.patients
    ?.map((patient) => patient.relation ? `${patient.patientName} (${patient.relation})` : patient.patientName)
    .filter(Boolean);

  return names?.length ? names.join(', ') : booking.userName || 'Patient';
};

const MyBookings = ({ user }) => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyBookings = async () => {
      const accountId = user?._id || user?.id;
      if (!accountId) {
        setError('Booking records ke liye logged-in patient account id required hai. Please sign in again.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/api/bookings/customer/${encodeURIComponent(accountId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Bookings fetch error');
        setMyBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching user bookings:", err);
        setError(err.message || 'Unable to fetch bookings.');
        setMyBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [user]);

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

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {myBookings.length > 0 ? (
          myBookings.map((b) => (
            <div key={b._id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#009494]/20 transition-all">
              
              {/* Left Side: Package Info */}
              <button type="button" onClick={() => setSelectedBooking(b)} className="flex cursor-pointer items-start gap-4 text-left">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#009494] group-hover:bg-[#009494] group-hover:text-white transition-all shadow-inner">
                  <Package size={24} />
                </div>
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#009494]">
                    <UserRound size={13} /> {getPatientSummary(b)}
                  </div>
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
              </button>

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

                <button type="button" onClick={() => setSelectedBooking(b)} className="cursor-pointer text-right min-w-[100px]">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Current Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    b.status === 'Report Uploaded' ? 'bg-indigo-50 text-indigo-600' : 
                    b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {b.status === 'Report Uploaded' || b.status === 'Confirmed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {b.status || 'Pending'}
                  </span>
                </button>
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

      {selectedBooking && (
        <div className="fixed inset-x-0 bottom-16 top-0 z-[600] flex justify-end bg-slate-950/20 backdrop-blur-sm lg:bottom-0 lg:left-72">
          <div className="h-full w-full overflow-y-auto bg-white p-5 shadow-2xl md:max-w-3xl md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Booking details</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">{getPatientSummary(selectedBooking)}</h3>
                <p className="mt-1 text-sm font-bold text-slate-600">{selectedBooking.selectedPackage || 'Health checkup'}</p>
                <p className="mt-1 text-sm font-bold text-slate-500">{selectedBooking.bookingId || selectedBooking._id}</p>
              </div>
              <button type="button" onClick={() => setSelectedBooking(null)} className="grid h-11 w-11 cursor-pointer place-items-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-900 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Patient', getPatientSummary(selectedBooking)],
                ['Status', selectedBooking.status || 'Pending'],
                ['Date', new Date(selectedBooking.bookingDate || selectedBooking.createdAt).toLocaleDateString('en-IN')],
                ['Slot', selectedBooking.bookingTime || selectedBooking.slot?.timeWindow || 'Slot pending'],
                ['Amount', `Rs. ${(selectedBooking.totalAmount || 0).toLocaleString('en-IN')}`],
                ['Payment', selectedBooking.paymentStatus || 'Pending'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                  <p className="mt-2 text-sm font-bold text-slate-800">{value}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><Phone size={13} /> Contact</p>
                <p className="mt-2 text-sm font-bold text-slate-800">{selectedBooking.userPhone || '-'}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><MapPin size={13} /> Address</p>
                <p className="mt-2 text-sm font-bold text-slate-800">{selectedBooking.address || selectedBooking.collectionAddress?.fullAddress || '-'}</p>
              </div>
            </div>

            {(selectedBooking.reportUrl || selectedBooking.reportPdfUrl) && (
              <a href={selectedBooking.reportUrl || selectedBooking.reportPdfUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#009494] text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-slate-950">
                <FileDown size={16} /> Download report
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
