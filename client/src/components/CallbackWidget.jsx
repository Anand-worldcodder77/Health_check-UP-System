import React, { useState } from 'react';
import axios from 'axios'; 
import { PhoneCall, X, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

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
      const response = await axios.post(`${API_BASE}/api/callbacks/add`, callbackData);

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
    <div className="fixed bottom-24 right-4 z-[400]">
      {/* Main Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="grid h-12 w-12 place-items-center rounded-full border border-[var(--hc-border)] bg-[var(--hc-surface)] text-[var(--hc-accent)] shadow-lg transition hover:scale-105 active:scale-95"
        >
          <PhoneCall className="h-5 w-5" />
        </button>
      )}

      {/* Form Card */}
      {isOpen && (
        <div className="w-[320px] rounded-[14px] border border-[var(--hc-border)] bg-[var(--hc-surface)] p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-500">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 rounded-full bg-[var(--hc-soft)] p-1 text-[var(--hc-muted)] transition-colors hover:text-[var(--hc-text)]"
          >
            <X size={16} />
          </button>

          {!submitted ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-[10px] bg-[var(--hc-brand)] p-2.5 text-[var(--hc-brand-text)]">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-black text-[var(--hc-text)] leading-none uppercase text-[11px]">Request Call</h4>
                  <p className="text-[10px] text-[var(--hc-accent)] font-bold uppercase tracking-widest mt-1">Care support</p>
                </div>
              </div>

              <p className="text-[var(--hc-muted)] text-xs font-bold mb-6 leading-relaxed">
                Our health expert will call you back shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--hc-muted)] font-black text-xs">+91</span>
                  <input 
                    type="tel"
                    required
                    disabled={isSubmitting}
                    pattern="[0-9]{10}"
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-[10px] border border-[var(--hc-border)] bg-[var(--hc-soft)] py-4 pl-12 pr-4 text-sm font-bold text-[var(--hc-text)] transition-all outline-none focus:border-[var(--hc-accent)] disabled:opacity-50"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--hc-brand)] py-4 text-xs font-black uppercase tracking-[0.12em] text-[var(--hc-brand-text)] transition-all hover:opacity-90"
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
              <h4 className="font-black text-[var(--hc-text)] text-xl uppercase">Sent</h4>
              <p className="text-[var(--hc-muted)] text-[11px] font-bold mt-2 uppercase tracking-widest">
                Request received.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CallbackWidget;
