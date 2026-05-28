import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { loginUser } from '../services/authApi';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const identifier = credentials.identifier.trim();
    const isEmail = identifier.includes('@');

    try {
      const data = await loginUser({
        password: credentials.password,
        role: 'ADMIN',
        ...(isEmail
          ? { email: identifier.toLowerCase() }
          : { phone: identifier.replace(/\D/g, '').slice(-10) }),
      });

      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa] p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em]">Admin Portal</p>
              <p className="text-xs font-semibold text-white/55">Database protected access</p>
            </div>
          </div>

          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-teal-100">
              <LockKeyhole size={15} />
              Role verified
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-normal">
              Secure dashboard access for lab operations.
            </h1>
            <p className="mt-5 text-sm font-medium leading-7 text-slate-300">
              Admin credentials are checked from MongoDB, passwords are hashed, and customer accounts cannot open this area.
            </p>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mb-8">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-teal-600 text-white">
              <UserRoundCheck size={25} />
            </div>
            <h2 className="text-2xl font-black text-slate-950">Admin sign in</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Email ya mobile number se dashboard unlock karein.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Admin email or mobile
              </span>
              <input
                value={credentials.identifier}
                onChange={(e) => setCredentials((current) => ({ ...current, identifier: e.target.value }))}
                placeholder="admin@example.com"
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-900 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Password
              </span>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials((current) => ({ ...current, password: e.target.value }))}
                  placeholder="Password"
                  required
                  className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm font-bold text-slate-900 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? 'Checking...' : 'Enter dashboard'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminLogin;
