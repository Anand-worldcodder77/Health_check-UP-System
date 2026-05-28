import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  Stethoscope,
  Video,
} from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

const availability = [
  { day: 'Today', time: '10:00 AM - 2:00 PM', status: 'Available', active: true },
  { day: 'Evening', time: '5:00 PM - 8:00 PM', status: 'Limited slots', active: true },
  { day: 'Tomorrow', time: '9:00 AM - 1:00 PM', status: 'Open', active: true },
];

const handoffSteps = [
  {
    title: 'Reports reach doctor',
    text: 'Lab report, package details, patient profile, and booking context are shared with the assigned doctor.',
    icon: FileText,
  },
  {
    title: 'Video consultation',
    text: 'Patient joins a secure video call from the portal when the doctor is available.',
    icon: Video,
  },
  {
    title: 'Clinical summary',
    text: 'Doctor adds notes, follow-up advice, and report remarks that remain in the patient record.',
    icon: Stethoscope,
  },
];

const DoctorConnectSection = () => {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  const startConsultation = async () => {
    const isLoggedIn = localStorage.getItem('isUserAuthenticated') === 'true';
    const user = JSON.parse(localStorage.getItem('userData') || 'null');

    if (!isLoggedIn || !user) {
      navigate('/auth');
      return;
    }

    setStarting(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/consultations/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id || user.id,
          role: user.role,
          slotId: 'today-morning',
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Unable to start video consultation');
      navigate(`/consult/${data.consultation.roomId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setStarting(false);
    }
  };

  return (
    <section id="doctor-connect" className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-xl shadow-slate-200/80">
            <div className="relative min-h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1400&auto=format&fit=crop"
                alt="Doctor on video consultation reviewing reports"
                className="absolute inset-0 h-full w-full object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
              <div className="relative flex min-h-[420px] flex-col justify-between p-5 md:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-teal-50">
                    <ShieldCheck size={14} /> Verified clinical desk
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#009494]">
                    <Video size={23} />
                  </div>
                </div>

                <div>
                  <h2 className="max-w-xl text-3xl font-black leading-tight md:text-4xl">
                    Connect with doctors after your health report is ready.
                  </h2>
                  <p className="mt-4 max-w-lg text-sm font-semibold leading-6 text-white/70">
                    Patient report, booking summary, symptoms, and doctor notes stay connected so consultation feels complete, not scattered.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={startConsultation} disabled={starting} className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#009494] px-5 text-sm font-black text-white transition hover:bg-teal-700 disabled:cursor-wait disabled:opacity-70">
                      {starting ? 'Starting room...' : 'Start video consult'} <ArrowRight size={17} />
                    </button>
                    <Link to="/provider/apply" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white/10 px-5 text-sm font-black text-white transition hover:bg-white/20">
                      Join as doctor
                    </Link>
                  </div>
                  {error && <p className="mt-3 rounded-xl bg-rose-500/15 px-4 py-3 text-xs font-bold text-rose-100">{error}</p>}
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Video care + report review</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              From lab report to doctor advice in one smooth flow.
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
              Premium healthcare platforms do not stop at PDF delivery. They connect patients with verified doctors, show availability, and preserve consultation summaries.
            </p>

            <div className="mt-6 grid gap-3">
              {handoffSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="flex gap-4 rounded-[22px] border border-slate-100 bg-slate-50 p-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#009494] shadow-sm">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{step.title}</h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{step.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-6 rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Doctor timing</p>
                  <h3 className="mt-1 text-xl font-black text-slate-900">Available consultation slots</h3>
                </div>
                <Clock className="text-[#009494]" size={24} />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {availability.map((slot) => (
                  <div key={`${slot.day}-${slot.time}`} className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-black text-slate-900">{slot.day}</p>
                      <CheckCircle2 className="text-[#009494]" size={17} />
                    </div>
                    <p className="mt-2 text-xs font-bold text-slate-500">{slot.time}</p>
                    <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#009494]">
                      {slot.status}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <CalendarClock className="mt-0.5 text-slate-400" size={18} />
                <p className="text-xs font-bold leading-5 text-slate-500">
                  In the dashboard, doctors can review report context, add clinical notes, and manage follow-up actions. Video call scheduling can connect to these availability slots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorConnectSection;
