import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { CalendarClock, CheckCircle2, Copy, Download, FileText, Loader2, Stethoscope, Video } from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('userData') || 'null');
  } catch {
    return null;
  }
};

const VideoConsultationRoom = () => {
  const { roomId } = useParams();
  const [user] = useState(() => getUserFromStorage());
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ note: '', reportRemarks: '', healthAdvice: '', followUp: '' });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLoggedIn = localStorage.getItem('isUserAuthenticated') === 'true' && user;
  const isDoctor = user?.role === 'DOCTOR' || user?.role === 'ADMIN';

  const meetingUrl = useMemo(() => {
    const displayName = encodeURIComponent(user?.name || user?.email || 'HealthChecks User');
    return `https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false&userInfo.displayName="${displayName}"`;
  }, [roomId, user]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadConsultation = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE}/api/consultations/${roomId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error || 'Unable to load consultation');
        setConsultation(data.consultation);
        setSummary({
          note: data.consultation?.doctorSummary?.note || '',
          reportRemarks: data.consultation?.doctorSummary?.reportRemarks || '',
          healthAdvice: data.consultation?.doctorSummary?.healthAdvice || '',
          followUp: data.consultation?.doctorSummary?.followUp || '',
        });

        await fetch(`${API_BASE}/api/consultations/${roomId}/join`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?._id || user?.id,
            name: user?.name || user?.email,
            role: user?.role,
          }),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadConsultation();
  }, [isLoggedIn, roomId, user]);

  const saveSummary = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/consultations/${roomId}/summary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id || user?.id,
          ...summary,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Unable to save summary');
      setConsultation(data.consultation);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const copyRoomLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadAdvice = () => {
    const lines = [
      'HealthChecks Doctor Advice',
      `Room: ${roomId}`,
      `Package: ${consultation?.reportSummary?.packageName || 'Health report review'}`,
      `Patient context: ${consultation?.reportSummary?.patientContext || '-'}`,
      '',
      'Doctor Notes:',
      summary.note || '-',
      '',
      'Report Remarks:',
      summary.reportRemarks || '-',
      '',
      'Health Advice:',
      summary.healthAdvice || '-',
      '',
      `Follow-up: ${summary.followUp || '-'}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `doctor-advice-${roomId.slice(-8)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isLoggedIn) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col gap-4 rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Secure video consultation</p>
            <h1 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">Doctor and patient room</h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">Share this room link with the other side. Logged-in patient and doctor can join the same video call.</p>
          </div>
          <button type="button" onClick={copyRoomLink} className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#009494]">
            <Copy size={16} /> {copied ? 'Copied' : 'Copy room link'}
          </button>
        </header>

        {error && <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-[24px] bg-white p-20 font-bold text-slate-400">
            <Loader2 className="animate-spin text-[#009494]" /> Preparing consultation room...
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
            <section className="overflow-hidden rounded-[28px] border border-slate-100 bg-slate-950 shadow-xl shadow-slate-200/70">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#009494]">
                    <Video size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black">Live video room</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">{consultation?.status || 'WAITING'}</p>
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-teal-50">Room: {roomId.slice(-8)}</span>
              </div>
              <iframe
                title="HealthChecks video consultation"
                src={meetingUrl}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="h-[520px] w-full border-0 bg-slate-900 md:h-[680px]"
              />
            </section>

            <aside className="space-y-4">
              <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <FileText className="text-[#009494]" size={22} />
                  <div>
                    <p className="text-sm font-black text-slate-900">Report handoff</p>
                    <p className="text-xs font-bold text-slate-400">Shared clinical context</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Package / Report</p>
                    <p className="mt-2 text-sm font-bold text-slate-800">{consultation?.reportSummary?.packageName || 'Health report review'}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Patient context</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{consultation?.reportSummary?.patientContext || 'Patient details will appear here.'}</p>
                  </div>
                  {consultation?.reportSummary?.reportUrl && (
                    <a href={consultation.reportSummary.reportUrl} target="_blank" rel="noreferrer" className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-indigo-50 text-xs font-black uppercase tracking-[0.08em] text-indigo-700">
                      Open report PDF
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <CalendarClock className="text-[#009494]" size={22} />
                  <div>
                    <p className="text-sm font-black text-slate-900">Doctor availability</p>
                    <p className="text-xs font-bold text-slate-400">{consultation?.doctorAvailability?.label || 'Today'}</p>
                  </div>
                </div>
                <p className="mt-4 rounded-2xl bg-teal-50 p-4 text-sm font-black text-[#009494]">{consultation?.doctorAvailability?.timeWindow || '10:00 AM - 2:00 PM'}</p>
              </div>

              <form onSubmit={saveSummary} className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Stethoscope className="text-[#009494]" size={22} />
                  <div>
                    <p className="text-sm font-black text-slate-900">Doctor summary</p>
                    <p className="text-xs font-bold text-slate-400">{isDoctor ? 'Write advice for patient' : 'Doctor advice appears here'}</p>
                  </div>
                </div>
                <textarea
                  disabled={!isDoctor}
                  value={summary.note}
                  onChange={(event) => setSummary((current) => ({ ...current, note: event.target.value }))}
                  placeholder="Doctor notes, report remarks, health advice..."
                  className="mt-4 min-h-28 w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-[#009494] disabled:text-slate-500"
                />
                <textarea
                  disabled={!isDoctor}
                  value={summary.reportRemarks}
                  onChange={(event) => setSummary((current) => ({ ...current, reportRemarks: event.target.value }))}
                  placeholder="Report remarks: abnormal values, risk markers, interpretation..."
                  className="mt-3 min-h-24 w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-[#009494] disabled:text-slate-500"
                />
                <textarea
                  disabled={!isDoctor}
                  value={summary.healthAdvice}
                  onChange={(event) => setSummary((current) => ({ ...current, healthAdvice: event.target.value }))}
                  placeholder="Health advice: lifestyle, diet, medicines, next steps..."
                  className="mt-3 min-h-24 w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-[#009494] disabled:text-slate-500"
                />
                <input
                  disabled={!isDoctor}
                  value={summary.followUp}
                  onChange={(event) => setSummary((current) => ({ ...current, followUp: event.target.value }))}
                  placeholder="Follow-up instruction"
                  className="mt-3 h-11 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494] disabled:text-slate-500"
                />
                {isDoctor && (
                  <button disabled={saving} className="mt-3 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#009494] text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-slate-950 disabled:cursor-wait disabled:opacity-60">
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />} Save summary
                  </button>
                )}
                {(summary.note || summary.reportRemarks || summary.healthAdvice) && (
                  <button type="button" onClick={downloadAdvice} className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 text-xs font-black uppercase tracking-[0.08em] text-indigo-700 transition hover:bg-indigo-600 hover:text-white">
                    <Download size={16} /> Download advice
                  </button>
                )}
              </form>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoConsultationRoom;
