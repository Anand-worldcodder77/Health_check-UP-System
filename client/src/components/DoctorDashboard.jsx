import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Loader2,
  LogOut,
  MessageSquarePlus,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'queue', label: 'Patient Queue', icon: CalendarClock },
  { id: 'reports', label: 'Report Review', icon: FileText },
  { id: 'followups', label: 'Follow-ups', icon: ClipboardCheck },
  { id: 'notes', label: 'Clinical Notes', icon: MessageSquarePlus },
];

const noteTypes = [
  { value: 'CLINICAL_NOTE', label: 'Clinical note' },
  { value: 'REPORT_REVIEW', label: 'Report review' },
  { value: 'FOLLOW_UP', label: 'Follow-up' },
  { value: 'PATIENT_CALL', label: 'Patient call' },
];

const statusStyles = {
  BOOKED: 'bg-blue-50 text-blue-700 border-blue-100',
  Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Pending: 'bg-amber-50 text-amber-700 border-amber-100',
  REPORT_READY: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Report Uploaded': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-100',
};

const formatDate = (value) => {
  if (!value) return 'Date pending';
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const DoctorDashboard = ({ user, onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [noteForm, setNoteForm] = useState({ noteType: 'CLINICAL_NOTE', note: '', followUpDate: '' });
  const [savingNote, setSavingNote] = useState(false);

  const loadWorkspace = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/doctor/workspace`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load doctor workspace');
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (err) {
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, []);

  const metrics = useMemo(() => ({
    activeCases: bookings.filter((booking) => !['CANCELLED', 'Rejected'].includes(booking.status)).length,
    reportsReady: bookings.filter((booking) => ['Report Uploaded', 'REPORT_READY'].includes(booking.status)).length,
    followUps: bookings.filter((booking) => ['Confirmed', 'BOOKED', 'PHLEBO_ASSIGNED'].includes(booking.status)).length,
    notes: bookings.reduce((total, booking) => total + (booking.doctorNotes?.length || 0), 0),
  }), [bookings]);

  const filteredBookings = useMemo(() => {
    const search = query.trim().toLowerCase();
    return bookings.filter((booking) => {
      const patientNames = booking.patients?.map((patient) => patient.patientName).join(' ') || '';
      const haystack = `${booking.bookingId} ${booking.userName} ${booking.userPhone} ${booking.selectedPackage} ${patientNames}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      if (!matchesSearch) return false;
      if (activeTab === 'reports') return ['Report Uploaded', 'REPORT_READY'].includes(booking.status);
      if (activeTab === 'followups') return ['Confirmed', 'BOOKED', 'PHLEBO_ASSIGNED'].includes(booking.status);
      if (activeTab === 'notes') return (booking.doctorNotes?.length || 0) > 0;
      return true;
    });
  }, [bookings, query, activeTab]);

  const selectedNotes = selectedCase?.doctorNotes || [];

  const openCase = (booking) => {
    setSelectedCase(booking);
    setNoteForm({ noteType: 'CLINICAL_NOTE', note: '', followUpDate: '' });
  };

  const saveNote = async (event) => {
    event.preventDefault();
    if (!selectedCase) return;
    if (!noteForm.note.trim()) {
      setError('Doctor note required hai.');
      return;
    }

    setSavingNote(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/doctor/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedCase._id,
          doctorId: user?._id || user?.id,
          doctorName: user?.name,
          ...noteForm,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Unable to save note');

      setBookings((current) => current.map((booking) => (
        booking._id === selectedCase._id
          ? { ...booking, status: data.booking?.status || booking.status, doctorNotes: [data.note, ...(booking.doctorNotes || [])] }
          : booking
      )));
      setSelectedCase((current) => ({
        ...current,
        status: data.booking?.status || current.status,
        doctorNotes: [data.note, ...(current.doctorNotes || [])],
      }));
      setNoteForm({ noteType: 'CLINICAL_NOTE', note: '', followUpDate: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingNote(false);
    }
  };

  const activeTitle = tabs.find((tab) => tab.id === activeTab)?.label || 'Doctor workspace';

  return (
    <div className="fixed inset-0 z-[500] flex h-screen w-full overflow-hidden bg-slate-50">
      <aside className="hidden w-72 flex-col border-r border-slate-100 bg-white p-5 shadow-xl lg:flex">
        <div className="mb-8 rounded-[22px] bg-slate-950 p-5 text-white">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#009494]">
            <Stethoscope size={27} />
          </div>
          <h1 className="mt-4 text-xl font-black tracking-tight">Doctor Desk</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">Clinical workspace</p>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-xs font-black uppercase tracking-[0.08em] transition ${
                  active ? 'bg-[#009494] text-white shadow-lg shadow-teal-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <button type="button" onClick={onLogout} className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-rose-500 transition hover:bg-rose-50">
          <LogOut size={17} /> Logout
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-20 items-center justify-between border-b border-slate-100 bg-white/90 px-5 backdrop-blur md:px-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Doctor portal</p>
            <h2 className="mt-1 text-xl font-black text-slate-800 md:text-2xl">{activeTitle}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={loadWorkspace} className="grid h-10 w-10 cursor-pointer place-items-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-[#009494] hover:text-white">
              <RefreshCw size={18} />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-black uppercase tracking-widest text-slate-800">Dr. {user?.name || 'Care Team'}</p>
              <p className="text-[10px] font-bold text-slate-400">Verified access</p>
            </div>
          </div>
        </header>

        <div className="border-b border-slate-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-black ${activeTab === tab.id ? 'bg-[#009494] text-white' : 'bg-slate-100 text-slate-500'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto p-5 pb-24 md:p-8 lg:pb-8">
          <section className="mb-6 rounded-[28px] bg-slate-950 p-6 text-white shadow-xl shadow-slate-200/70">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-teal-50">
                  <ShieldCheck size={14} /> Clinical control room
                </p>
                <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight md:text-4xl">
                  Review reports, patient context, notes, and follow-up actions in one place.
                </h1>
              </div>
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search patient, phone, booking..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-4 text-sm font-bold text-white outline-none placeholder:text-white/40 focus:border-[#009494]"
                />
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Active cases', metrics.activeCases, HeartPulse],
                ['Reports ready', metrics.reportsReady, FileText],
                ['Follow-ups', metrics.followUps, Phone],
                ['Saved notes', metrics.notes, MessageSquarePlus],
              ].map(([label, value, Icon]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <Icon className="text-teal-100" size={19} />
                  <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/50">{label}</p>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {error && <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}

          {loading ? (
            <div className="flex items-center justify-center gap-3 rounded-[24px] bg-white p-20 font-bold text-slate-400">
              <Loader2 className="animate-spin text-[#009494]" /> Loading clinical workspace...
            </div>
          ) : (
            <div className="grid gap-4">
              {activeTab === 'overview' && (
                <div className="grid gap-4 xl:grid-cols-3">
                  {[
                    ['Patient queue', 'Bookings that need doctor visibility and care context.', metrics.activeCases],
                    ['Report review', 'Reports ready for clinical remarks and review notes.', metrics.reportsReady],
                    ['Follow-up desk', 'Confirmed cases that may need calls or post-report guidance.', metrics.followUps],
                  ].map(([title, text, value]) => (
                    <button key={title} type="button" onClick={() => setActiveTab(title === 'Report review' ? 'reports' : title === 'Follow-up desk' ? 'followups' : 'queue')} className="cursor-pointer rounded-[24px] border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{title}</p>
                      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
                      <p className="mt-3 text-sm font-bold leading-6 text-slate-500">{text}</p>
                    </button>
                  ))}
                </div>
              )}

              {filteredBookings.map((booking) => (
                <article key={booking._id} className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <button type="button" onClick={() => openCase(booking)} className="flex cursor-pointer items-start gap-4 text-left">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-50 text-[#009494]">
                        <UserRound size={22} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black text-slate-900">{booking.userName || booking.patients?.[0]?.patientName || 'Patient'}</h3>
                          <span className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${statusStyles[booking.status] || 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                            {booking.status || 'Pending'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-bold text-slate-600">{booking.selectedPackage || 'Health checkup'}</p>
                        <p className="mt-2 text-xs font-bold text-slate-400">
                          {booking.bookingId || booking._id} | {booking.userPhone || '-'} | {booking.slot?.timeWindow || 'Slot pending'}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-400">{formatDate(booking.bookingDate || booking.createdAt)} | Rs. {(booking.totalAmount || 0).toLocaleString('en-IN')}</p>
                      </div>
                    </button>

                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => openCase(booking)} className="cursor-pointer rounded-xl bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#009494]">
                        Open case
                      </button>
                      <button type="button" onClick={() => openCase(booking)} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-[#009494] transition hover:bg-[#009494] hover:text-white">
                        <MessageSquarePlus size={15} /> Add note
                      </button>
                      {(booking.reportUrl || booking.reportPdfUrl) && (
                        <a href={booking.reportUrl || booking.reportPdfUrl} target="_blank" rel="noreferrer" className="cursor-pointer rounded-xl bg-indigo-50 px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-indigo-700 transition hover:bg-indigo-600 hover:text-white">
                          View report
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}

              {!filteredBookings.length && activeTab !== 'overview' && (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-12 text-center">
                  <Stethoscope className="mx-auto text-slate-300" size={42} />
                  <h3 className="mt-4 text-xl font-black text-slate-800">No clinical cases found</h3>
                  <p className="mx-auto mt-2 max-w-lg text-sm font-semibold leading-6 text-slate-500">
                    This section is connected to live bookings. Jab patient booking/report available hoga, yahan automatically dikhega.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-[650] border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_30px_rgba(15,23,42,0.06)] lg:hidden">
        <div className="grid grid-cols-5 px-1 pt-1">
          {tabs.slice(0, 4).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className="relative flex cursor-pointer flex-col items-center gap-0.5 py-2">
                <span className={`grid h-9 w-9 place-items-center rounded-full ${active ? 'bg-teal-50 text-[#009494]' : 'text-slate-400'}`}>
                  <Icon size={20} />
                </span>
                <span className={`text-[10px] font-semibold ${active ? 'text-[#009494]' : 'text-slate-500'}`}>{tab.label.split(' ')[0]}</span>
                {active && <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-[#009494]" />}
              </button>
            );
          })}
          <button type="button" onClick={onLogout} className="relative flex cursor-pointer flex-col items-center gap-0.5 py-2">
            <span className="grid h-9 w-9 place-items-center rounded-full text-rose-500">
              <LogOut size={20} />
            </span>
            <span className="text-[10px] font-semibold text-rose-500">Logout</span>
          </button>
        </div>
      </nav>

      {selectedCase && (
        <div className="fixed inset-x-0 bottom-16 top-0 z-[600] flex justify-end bg-slate-950/20 backdrop-blur-sm lg:bottom-0 lg:left-72">
          <div className="h-full w-full overflow-y-auto bg-white p-5 shadow-2xl md:max-w-5xl md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Case review</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">{selectedCase.userName || selectedCase.patients?.[0]?.patientName || 'Patient'}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{selectedCase.selectedPackage || 'Health checkup'} | {selectedCase.bookingId}</p>
              </div>
              <button type="button" onClick={() => setSelectedCase(null)} className="grid h-11 w-11 cursor-pointer place-items-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-900 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Phone', selectedCase.userPhone || '-'],
                  ['Email', selectedCase.userEmail || '-'],
                  ['Status', selectedCase.status || '-'],
                  ['Slot', selectedCase.slot?.timeWindow || '-'],
                  ['Booking date', formatDate(selectedCase.bookingDate || selectedCase.createdAt)],
                  ['Amount', `Rs. ${(selectedCase.totalAmount || 0).toLocaleString('en-IN')}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="mt-2 text-sm font-bold text-slate-800">{value}</p>
                  </div>
                ))}
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collection address</p>
                  <p className="mt-2 text-sm font-bold text-slate-800">{selectedCase.address || selectedCase.collectionAddress?.fullAddress || '-'}</p>
                </div>
              </div>

              <form onSubmit={saveNote} className="rounded-2xl border border-slate-100 bg-white p-4">
                <p className="text-sm font-black text-slate-900">Add clinical action</p>
                <select value={noteForm.noteType} onChange={(e) => setNoteForm((current) => ({ ...current, noteType: e.target.value }))} className="mt-4 h-12 w-full cursor-pointer rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]">
                  {noteTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
                <textarea
                  value={noteForm.note}
                  onChange={(e) => setNoteForm((current) => ({ ...current, note: e.target.value }))}
                  placeholder="Clinical note, report remark, or follow-up instruction"
                  className="mt-3 min-h-28 w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-[#009494]"
                />
                <input
                  type="date"
                  value={noteForm.followUpDate}
                  onChange={(e) => setNoteForm((current) => ({ ...current, followUpDate: e.target.value }))}
                  className="mt-3 h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]"
                />
                <button disabled={savingNote} className="mt-3 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#009494] text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-slate-950 disabled:cursor-wait disabled:opacity-60">
                  {savingNote ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />} Save note
                </button>
              </form>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical notes timeline</p>
              <div className="space-y-2">
                {selectedNotes.length ? selectedNotes.map((note) => (
                  <div key={note._id || note.createdAt} className="rounded-xl bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#009494]">{note.noteType?.replaceAll('_', ' ') || 'Note'}</p>
                      <p className="text-[10px] font-bold text-slate-400">{formatDate(note.createdAt)}</p>
                    </div>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{note.note}</p>
                    {note.followUpDate && <p className="mt-2 text-xs font-bold text-slate-400">Follow-up: {formatDate(note.followUpDate)}</p>}
                  </div>
                )) : <p className="text-sm font-bold text-slate-400">No doctor notes saved yet.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
