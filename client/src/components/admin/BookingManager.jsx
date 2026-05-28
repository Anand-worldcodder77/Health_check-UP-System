import React, { useEffect, useMemo, useState } from 'react';
import { Clock, Download, Eye, FileUp, Filter, Loader2, RefreshCw, Search, XCircle } from 'lucide-react';
import { API_BASE } from '../../services/apiConfig';

const workflowSteps = [
  { from: ['Pending', 'BOOKED'], to: 'Confirmed', label: 'Confirm' },
  { from: ['Confirmed'], to: 'PHLEBO_ASSIGNED', label: 'Assign collector' },
  { from: ['PHLEBO_ASSIGNED'], to: 'SAMPLE_COLLECTED', label: 'Sample collected' },
  { from: ['SAMPLE_COLLECTED'], to: 'IN_LAB', label: 'Move to lab' },
];

const BookingManager = ({ scope = 'admin' }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingReport, setUploadingReport] = useState(false);
  const [selectedReportFile, setSelectedReportFile] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/bookings/all`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load bookings');
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings/update-status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Status update failed');
      setBookings((current) => current.map((booking) => (
        booking._id === id ? { ...booking, status: newStatus } : booking
      )));
    } catch (err) {
      setError(err.message);
    }
  };

  const uploadReport = async (booking, file) => {
    if (!file) return;
    setUploadingReport(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('report', file);
      const response = await fetch(`${API_BASE}/api/bookings/upload-report/${booking._id}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Report upload failed');
      setBookings((current) => current.map((item) => (item._id === booking._id ? data.data : item)));
      setSelectedReportFile(null);
      setSelectedBooking(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingReport(false);
    }
  };

  const filteredBookings = useMemo(() => {
    const search = query.trim().toLowerCase();
    return bookings.filter((booking) => {
      const statusMatches = statusFilter === 'All' || booking.status === statusFilter;
      const text = `${booking.bookingId || booking._id} ${booking.userName} ${booking.userPhone} ${booking.selectedPackage}`.toLowerCase();
      return statusMatches && (!search || text.includes(search));
    });
  }, [bookings, query, statusFilter]);

  const stats = useMemo(() => ({
    total: bookings.length,
    confirmed: bookings.filter((booking) => ['Confirmed', 'BOOKED'].includes(booking.status)).length,
    pending: bookings.filter((booking) => booking.status === 'Pending').length,
    reports: bookings.filter((booking) => ['Report Uploaded', 'REPORT_READY'].includes(booking.status)).length,
  }), [bookings]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'BOOKED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Rejected':
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Report Uploaded':
      case 'REPORT_READY':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <div className="p-5 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800 md:text-3xl">{scope === 'lab' ? 'Lab orders queue' : 'Operations queue'}</h2>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {scope === 'lab'
              ? 'Test orders, sample workflow, report upload and patient delivery'
              : 'Live bookings, reports, collections and patient follow-ups'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              placeholder="Search ID, name, phone..."
              className="w-full rounded-2xl border border-slate-100 bg-white py-3 pl-12 pr-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#009494]/20 md:w-72"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold text-slate-500 outline-none"
          >
            {['All', 'Pending', 'Confirmed', 'PHLEBO_ASSIGNED', 'SAMPLE_COLLECTED', 'IN_LAB', 'Report Uploaded', 'BOOKED', 'CANCELLED'].map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <button onClick={loadBookings} className="rounded-2xl border border-slate-100 bg-white p-3 text-slate-400 transition hover:text-[#009494]">
            <RefreshCw size={20} />
          </button>
          <button className="rounded-2xl border border-slate-100 bg-white p-3 text-slate-400">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total', stats.total],
          ['Confirmed', stats.confirmed],
          ['Pending', stats.pending],
          ['Reports ready', stats.reports],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      {error && <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-600">{error}</div>}

      <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-20 font-bold text-slate-400">
            <Loader2 className="animate-spin" /> Loading bookings...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Patient & ID</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Test Details</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Visit</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBookings.map((item) => (
                  <tr key={item._id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xs font-black uppercase text-[#009494]">
                          {(item.userName || 'P').charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase text-slate-800">{item.userName || 'Patient'}</p>
                          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-tighter text-slate-400">{item.bookingId || item._id}</p>
                          <p className="mt-0.5 text-[10px] font-bold text-slate-400">{item.userPhone || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-700">{item.selectedPackage || 'Health checkup'}</p>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Rs. {(item.totalAmount || 0).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-700">{new Date(item.bookingDate || item.createdAt).toLocaleDateString('en-IN')}</p>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.slot?.timeWindow || 'Slot pending'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${getStatusStyle(item.status)}`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {workflowSteps
                          .filter((step) => step.from.includes(item.status || 'Pending'))
                          .map((step) => (
                            <button key={step.to} onClick={() => updateStatus(item._id, step.to)} className="rounded-xl bg-emerald-50 px-3 py-2.5 text-[10px] font-black uppercase tracking-[0.08em] text-emerald-600 transition hover:bg-emerald-600 hover:text-white" title={step.label}>
                              {step.label}
                            </button>
                          ))}
                        {!['CANCELLED', 'Report Uploaded', 'REPORT_READY'].includes(item.status) && (
                          <button onClick={() => updateStatus(item._id, 'CANCELLED')} className="rounded-xl bg-rose-50 p-2.5 text-rose-500 transition hover:bg-rose-500 hover:text-white" title="Cancel booking">
                            <XCircle size={18} />
                          </button>
                        )}
                        {(item.reportUrl || item.reportPdfUrl) ? (
                          <a
                            href={item.reportUrl || item.reportPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2.5 text-[10px] font-black uppercase tracking-[0.08em] text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
                            title="Download uploaded report"
                          >
                            <Download size={16} /> Download
                          </a>
                        ) : (
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#009494] px-3 py-2.5 text-[10px] font-black uppercase tracking-[0.08em] text-white transition hover:bg-slate-950" title="Upload patient report PDF">
                            <FileUp size={16} /> Upload PDF
                            <input
                              type="file"
                              accept="application/pdf"
                              disabled={uploadingReport}
                              onChange={(event) => {
                                uploadReport(item, event.target.files?.[0]);
                                event.target.value = '';
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                        <button onClick={() => {
                          setSelectedReportFile(null);
                          setSelectedBooking(item);
                        }} className="rounded-xl bg-slate-50 p-2.5 text-slate-400 transition hover:bg-slate-900 hover:text-white">
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredBookings.length === 0 && (
          <div className="p-20 text-center">
            <Clock size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="font-bold text-slate-400">No bookings found.</p>
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#009494]">Booking details</p>
                <h3 className="mt-1 text-2xl font-black text-slate-800">{selectedBooking.userName || 'Patient'}</h3>
              </div>
              <button onClick={() => {
                setSelectedReportFile(null);
                setSelectedBooking(null);
              }} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-black text-slate-500">Close</button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ['Booking ID', selectedBooking.bookingId || selectedBooking._id],
                ['Phone', selectedBooking.userPhone || '-'],
                ['Package', selectedBooking.selectedPackage || '-'],
                ['Status', selectedBooking.status || '-'],
                ['Address', selectedBooking.address || selectedBooking.collectionAddress?.fullAddress || '-'],
                ['Slot', selectedBooking.slot?.timeWindow || '-'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                  <p className="mt-2 text-sm font-bold text-slate-800">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Report PDF</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {(selectedBooking.reportUrl || selectedBooking.reportPdfUrl) ? (
                  <a href={selectedBooking.reportUrl || selectedBooking.reportPdfUrl} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 text-xs font-black uppercase tracking-[0.08em] text-indigo-700 transition hover:bg-indigo-600 hover:text-white">
                    <Download size={16} /> Download uploaded report
                  </a>
                ) : (
                  <p className="text-sm font-bold text-slate-500">No report uploaded yet.</p>
                )}
                <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black uppercase tracking-[0.08em] text-slate-700 transition hover:border-[#009494] hover:text-[#009494]">
                  <FileUp size={16} /> Choose PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    disabled={uploadingReport}
                    onChange={(event) => {
                      setSelectedReportFile(event.target.files?.[0] || null);
                      event.target.value = '';
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              {selectedReportFile && (
                <div className="mt-3 flex flex-col gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="min-w-0 truncate text-xs font-black text-emerald-800">
                    Selected: {selectedReportFile.name}
                  </p>
                  <button
                    type="button"
                    disabled={uploadingReport}
                    onClick={() => uploadReport(selectedBooking, selectedReportFile)}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-[#009494] px-4 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-slate-950 disabled:cursor-wait disabled:bg-slate-300"
                  >
                    {uploadingReport ? 'Submitting...' : 'Submit report'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManager;
