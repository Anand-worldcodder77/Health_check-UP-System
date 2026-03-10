import React, { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Anand, abhi ke liye hum hardcoded credentials use kar rahe hain
    // Username: admin | Password: anand2026
    if (credentials.username === 'admin' && credentials.password === 'anand2026') {
      onLogin(true); // Login success
      setError('');
    } else {
      setError('❌ Galat ID ya Password h, dhyan se check karo!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#009494] p-6">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[40px] shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/30">
            <Lock className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Admin Portal</h2>
          <p className="text-white/60 font-bold text-sm mt-2">Sirf Anand hi access kar sakte hain.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-4 text-white/50" size={20} />
            <input 
              type="text" 
              placeholder="Username" 
              required
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 outline-none focus:bg-white/20 transition-all font-bold"
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-white/50" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 outline-none focus:bg-white/20 transition-all font-bold"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>

          {error && <p className="text-red-200 text-xs font-black text-center animate-bounce">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-white text-[#009494] py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center group"
          >
            ENTER DASHBOARD <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;