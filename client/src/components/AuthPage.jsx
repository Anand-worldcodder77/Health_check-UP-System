import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseMedical,
  FlaskConical,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import { loginUser, signupUser } from '../services/authApi';

const roles = [
  {
    id: 'CUSTOMER',
    label: 'Patient',
    title: 'Patient Portal',
    helper: 'Bookings, family profiles, and reports.',
    icon: UserRound,
    redirect: '/dashboard',
  },
  {
    id: 'LAB_STAFF',
    label: 'Lab',
    title: 'Lab Desk',
    helper: 'Orders, samples, reports, and downloads.',
    icon: FlaskConical,
    redirect: '/lab',
  },
  {
    id: 'DOCTOR',
    label: 'Doctor',
    title: 'Doctor Desk',
    helper: 'Clinical queue, report review, and follow-ups.',
    icon: Stethoscope,
    redirect: '/doctor',
  },
  {
    id: 'ADMIN',
    label: 'Admin',
    title: 'Admin Panel',
    helper: 'Operations, bookings, callbacks, and settings.',
    icon: ShieldCheck,
    redirect: '/admin',
  },
];

const AuthPage = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('CUSTOMER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    password: '',
  });
  const navigate = useNavigate();

  const activeRole = useMemo(() => roles.find((item) => item.id === role), [role]);
  const ActiveRoleIcon = activeRole.icon;
  const identifierType = useMemo(() => (
    formData.identifier.trim().includes('@') ? 'email' : 'phone'
  ), [formData.identifier]);

  const updateField = (field, value) => {
    setError('');
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const identifier = formData.identifier.trim();
    if (mode === 'signup' && !formData.name.trim()) return 'Full name is required.';
    if (!identifier) return 'Email ya mobile number enter karein.';
    if (identifierType === 'email' && !/^\S+@\S+\.\S+$/.test(identifier)) return 'Valid email address enter karein.';
    if (identifierType === 'phone' && identifier.replace(/\D/g, '').length !== 10) return 'Valid 10 digit mobile number enter karein.';
    if (!formData.password || formData.password.length < 8) return 'Password minimum 8 characters hona chahiye.';
    return '';
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    setLoading(true);
    setError('');

    const identifier = formData.identifier.trim();
    const basePayload = {
      password: formData.password,
      role,
      ...(identifierType === 'email'
        ? { email: identifier.toLowerCase() }
        : { phone: identifier.replace(/\D/g, '').slice(-10) }),
    };

    try {
      const data = mode === 'login'
        ? await loginUser(basePayload)
        : await signupUser({
            ...basePayload,
            name: formData.name.trim(),
            role: 'CUSTOMER',
          });

      onLoginSuccess(data.user, data.token);
      navigate(activeRole.redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((current) => (current === 'login' ? 'signup' : 'login'));
    setRole('CUSTOMER');
    setError('');
    setFormData({ name: '', identifier: '', password: '' });
  };

  return (
    <div className="min-h-dvh overflow-y-auto bg-[#f7f9fc] text-slate-950">
      <main className="grid min-h-dvh xl:grid-cols-[0.82fr_1.18fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 px-8 py-7 text-white xl:flex xl:flex-col xl:justify-between 2xl:px-12">
          <img
            src="https://images.unsplash.com/photo-1581093458791-9f3c3900df7b?q=80&w=1400&auto=format&fit=crop"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-slate-950/70" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-white text-teal-700">
                <BriefcaseMedical size={24} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-100">HealthChecks Pro</p>
                <p className="text-xs font-semibold text-white/60">Role-based secure access</p>
              </div>
            </div>
            <Link to="/" className="inline-flex h-10 items-center gap-2 rounded-lg bg-white/10 px-3 text-sm font-bold text-white/80 hover:bg-white/15">
              <ArrowLeft size={17} /> Home
            </Link>
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-teal-50">
              <LockKeyhole size={15} />
              Single-step login
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-normal">
              One secure entry for patients, labs, doctors, and administrators.
            </h1>
            <div className="mt-5 grid grid-cols-4 gap-3">
              {roles.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <Icon className="mb-3 text-teal-200" size={20} />
                    <p className="text-xs font-black">{item.label}</p>
                    <p className="mt-1 text-[11px] font-semibold leading-4 text-white/55">{item.helper}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex min-h-dvh items-center justify-center px-3 py-3 sm:px-5 xl:px-8">
          <div className="w-full max-w-[480px] rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Link to="/" className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-teal-300 hover:text-teal-700 lg:hidden">
                <ArrowLeft size={16} /> Home
              </Link>
              <div className="ml-auto rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-teal-700">
                {activeRole.title}
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-2 grid h-10 w-10 place-items-center rounded-lg bg-teal-600 text-white">
                <ActiveRoleIcon size={21} />
              </div>
              <h2 className="text-[1.65rem] font-black leading-tight tracking-normal text-slate-950">
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </h2>
              <p className="mt-1 text-[13px] font-medium leading-5 text-slate-500">
                {mode === 'login'
                  ? 'Account type select karke email/mobile aur password enter karein.'
                  : 'Patient account self-service hai. Staff access organization se provision hota hai.'}
              </p>
            </div>

            <div className="mb-3 grid grid-cols-4 gap-2">
              {(mode === 'login' ? roles : roles.filter((item) => item.id === 'CUSTOMER')).map((item) => {
                const Icon = item.icon;
                const active = role === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setRole(item.id);
                      setError('');
                    }}
                    className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg border px-2 text-xs font-black transition ${
                      active ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-teal-200'
                    }`}
                  >
                    <Icon size={17} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold leading-5 text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={submitAuth} className="space-y-2.5">
              {mode === 'signup' && (
                <label className="block">
                  <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Full name</span>
                  <input
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Your full name"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Email or mobile</span>
                <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-4 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10">
                  {identifierType === 'email' ? <Mail size={17} className="text-slate-400" /> : <Phone size={17} className="text-slate-400" />}
                  <input
                    value={formData.identifier}
                    onChange={(e) => updateField('identifier', e.target.value)}
                    placeholder="email@example.com or 9876543210"
                    className="min-w-0 flex-1 bg-transparent px-3 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Password</span>
                <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-4 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10">
                  <LockKeyhole size={17} className="text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="min-w-0 flex-1 bg-transparent px-3 text-sm font-bold text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>

              {mode === 'signup' && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold leading-5 text-slate-500">
                  Staff accounts are created by an existing admin after verification. Use sign in if your staff account already exists.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-teal-600 text-sm font-black text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? 'Please wait...' : mode === 'login' ? `Sign in as ${activeRole.label}` : 'Register Patient'}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="mt-3 border-t border-slate-100 pt-3 text-center">
              <button
                type="button"
                onClick={switchMode}
                className="text-sm font-black text-teal-700 transition hover:text-slate-950"
              >
                {mode === 'login' ? 'New patient? Register account' : 'Already registered? Sign in'}
              </button>
              <p className="mt-1.5 text-[11px] font-medium leading-5 text-slate-400">
                Staff access is not public. Lab, doctor, and admin accounts must be created by the organization.
              </p>
              <Link to="/provider/apply" className="mt-2 inline-flex text-xs font-black text-slate-700 underline decoration-teal-300 underline-offset-4">
                Doctor? Apply for verification
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AuthPage;
