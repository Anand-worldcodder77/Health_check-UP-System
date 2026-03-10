import React, { useState } from 'react';
import axios from 'axios'; 
import { PhoneCall, X, CheckCircle2, Clock, Loader2 } from 'lucide-react';

const CallbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Button ko 'Sending' state mein daala

    const callbackData = {
      phone: phone,
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending'
    };

    try {
      // --- ASLI BACKEND CONNECTION ---
      // Humne server.js mein '/api/callbacks' set kiya tha aur route mein '/add'
      const response = await axios.post('http://localhost:5000/api/callbacks/add', callbackData);

      if (response.status === 201 || response.data.success) {
        setSubmitted(true);
        // 4 second baad widget ko reset aur close karna
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
          setPhone('');
        }, 4000);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("System Busy! Anand, please check if your server is running.");
    } finally {
      setIsSubmitting(false); // Loading khatam
    }
  };

  return (
    <div className="fixed bottom-10 left-10 z-[400]">
      {/* Main Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center gap-3 group border-4 border-white/20"
        >
          <div className="relative">
            <PhoneCall className="w-6 h-6 group-hover:animate-tada" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full animate-ping"></span>
          </div>
          <span className="font-bold text-sm pr-2 hidden md:block tracking-tight">Instant Callback</span>
        </button>
      )}

      {/* Form Card */}
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-2xl p-8 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-white w-[320px] animate-in slide-in-from-bottom-10 fade-in duration-500">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-slate-400 hover:text-black transition-colors bg-slate-100 p-1 rounded-full"
          >
            <X size={16} />
          </button>

          {!submitted ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 leading-none uppercase text-[11px] tracking-tighter">Request Call</h4>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Free & Instant</p>
                </div>
              </div>

              <p className="text-slate-500 text-[11px] font-bold mb-6 leading-relaxed uppercase tracking-tight">
                Hamaare health expert aapko 1 minute ke andar call karenge.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">+91</span>
                  <input 
                    type="tel"
                    required
                    disabled={isSubmitting}
                    pattern="[0-9]{10}"
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-blue-600 focus:bg-white transition-all outline-none disabled:opacity-50"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
                    </>
                  ) : "Call Me Now"}
                </button>
              </form>
            </>
          ) : (
            <div className="py-8 text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 size={40} strokeWidth={3} />
              </div>
              <h4 className="font-black text-slate-900 text-xl uppercase tracking-tighter">Sent!</h4>
              <p className="text-slate-500 text-[11px] font-bold mt-2 uppercase tracking-widest">
                Anand, request mil gayi h. <br/> <span className="text-green-600">Taiyaar rahein!</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CallbackWidget;