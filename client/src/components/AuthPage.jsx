import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        onLoginSuccess(data.user); // Navbar mein naam dikhane ke liye
        navigate('/');
      } else {
        alert(data.message || "Kuch galat hua!");
      }
    } catch (err) {
      console.error("Auth Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9f9] relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#009494]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#FF6F61]/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[40px] shadow-[0_30px_100px_rgba(0,148,148,0.15)] p-10">
          
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-[#009494] text-white rounded-3xl mb-4 shadow-xl shadow-teal-100">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2">
              {isLogin ? 'Enter your details to access' : 'Join our health community'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-400" size={18} />
                <input 
                  type="text" placeholder="Full Name" required
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:border-[#009494] transition-all text-sm font-bold"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
              <input 
                type="email" placeholder="Email Address" required
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:border-[#009494] transition-all text-sm font-bold"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
              <input 
                type="password" placeholder="Password" required
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:border-[#009494] transition-all text-sm font-bold"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[#009494] transition-all flex items-center justify-center group">
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black text-[#009494] uppercase tracking-widest hover:underline"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already a member? Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;