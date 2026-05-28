import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Download, FileDown, FileText, Loader2, Package, RefreshCw, Stethoscope } from 'lucide-react';
import { API_BASE } from '../../services/apiConfig';

const getAccountId = (user) => user?._id || user?.id || '';

const reportStatuses = new Set(['Report Uploaded', 'REPORT_READY']);

const MyReports = ({ user, onGoToBookings }) => {
  const [bookings, setBookings] = useState([]);
  const [doctorNotes, setDoctorNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReports = async () => {
    const accountId = getAccountId(user);
    if (!accountId) {
      setError('Reports fetch karne ke liye logged-in patient account id required hai. Please sign in again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const [bookingsResponse, notesResponse] = await Promise.all([
        fetch(`${API_BASE}/api/bookings/customer/${encodeURIComponent(accountId)}`),
        fetch(`${API_BASE}/api/consultations/summaries/customer/${encodeURIComponent(accountId)}`),
      ]);

      const bookingsData = await bookingsResponse.json();
      if (!bookingsResponse.ok) throw new Error(bookingsData.error || 'Unable to fetch reports');

      const notesData = await notesResponse.json();
      if (!notesResponse.ok) throw new Error(notesData.error || 'Unable to fetch doctor advice');

      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setDoctorNotes(Array.isArray(notesData.notes) ? notesData.notes : []);
    } catch (err) {
      setError(err.message);
      setBookings([]);
      setDoctorNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [user]);

  const reports = useMemo(() => bookings.filter((booking) => (
    booking.reportUrl || booking.reportPdfUrl || reportStatuses.has(booking.status)
  )), [bookings]);

  const downloadDoctorAdvice = (note) => {
    const booking = note.booking || {};
    const lines = [
      'HealthChecks Doctor Advice',
      `Doctor: ${note.doctorName || 'Doctor'}`,
      `Package: ${booking.selectedPackage || 'Health report review'}`,
      `Booking ID: ${booking.bookingId || booking._id || '-'}`,
      `Date: ${new Date(note.createdAt || Date.now()).toLocaleString('en-IN')}`,
      '',
      'Doctor Notes:',
      note.note || '-',
      '',
      'Report Remarks:',
      note.reportRemarks || '-',
      '',
      'Health Advice:',
      note.healthAdvice || '-',
      '',
      `Follow-up: ${note.followUpDate ? new Date(note.followUpDate).toLocaleDateString('en-IN') : '-'}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `doctor-advice-${booking.bookingId || note._id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 p-20 text-center">
        <Loader2 className="animate-spin text-[#009494]" size={40} />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Fetching reports...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Reports & advice</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-800">Lab reports and doctor feedback</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            Completed reports, doctor notes, report remarks and health advice appear here with download access.
          </p>
        </div>
        <button type="button" onClick={loadReports} className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-black uppercase tracking-[0.08em] text-slate-600 shadow-sm transition hover:bg-[#009494] hover:text-white">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}

      {doctorNotes.length > 0 && (
        <section className="mb-6">
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Doctor advice</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-800">Consultation feedback</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              Doctor ke notes, report remarks aur health advice yahan save hote hain.
            </p>
          </div>
          <div className="grid gap-4">
            {doctorNotes.map((note) => {
              const booking = note.booking || {};
              return (
                <article key={note._id} className="rounded-[24px] border border-teal-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-teal-50 text-[#009494]">
                        <Stethoscope size={24} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-black text-slate-900">{booking.selectedPackage || 'Doctor video consultation'}</h3>
                          <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#009494]">
                            {note.noteType || 'REPORT_REVIEW'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                          {note.doctorName || 'Doctor'} | {new Date(note.createdAt).toLocaleDateString('en-IN')}
                        </p>
                        <div className="mt-4 grid gap-3 text-sm font-semibold leading-6 text-slate-600">
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Doctor notes</p>
                            <p className="mt-1 text-slate-800">{note.note || '-'}</p>
                          </div>
                          {note.reportRemarks && (
                            <div className="rounded-2xl bg-slate-50 p-4">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Report remarks</p>
                              <p className="mt-1 text-slate-800">{note.reportRemarks}</p>
                            </div>
                          )}
                          {note.healthAdvice && (
                            <div className="rounded-2xl bg-emerald-50 p-4">
                              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Health advice</p>
                              <p className="mt-1 text-slate-800">{note.healthAdvice}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={() => downloadDoctorAdvice(note)} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#009494]">
                      <Download size={16} /> Download advice
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {reports.length > 0 ? (
        <div className="grid gap-4">
          {reports.map((report) => {
            const reportUrl = report.reportUrl || report.reportPdfUrl;
            return (
              <article key={report._id} className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">{report.selectedPackage || 'Health report'}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-500">
                          <Calendar size={12} /> {new Date(report.bookingDate || report.createdAt).toLocaleDateString('en-IN')}
                        </span>
                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                          {report.status || 'Report Ready'}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-bold text-slate-400">{report.bookingId || report._id}</p>
                    </div>
                  </div>

                  {reportUrl ? (
                    <a href={reportUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#009494] px-5 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-slate-950">
                      <FileDown size={16} /> Download report
                    </a>
                  ) : (
                    <span className="inline-flex h-12 items-center justify-center rounded-xl bg-amber-50 px-5 text-xs font-black uppercase tracking-[0.08em] text-amber-600">
                      Report marked ready
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-50 text-slate-300">
            <Package size={30} />
          </div>
          <h3 className="mt-5 text-xl font-black text-slate-800">No completed reports yet</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-500">
            Jab admin/lab report upload karega, report yahan download option ke saath appear hogi. Aap booking status bhi check kar sakte hain.
          </p>
          <button type="button" onClick={onGoToBookings} className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#009494] px-5 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-slate-950">
            View bookings
          </button>
        </div>
      )}

    </div>
  );
};

export default MyReports;
