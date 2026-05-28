import React from 'react';
import { MessageCircle, Send } from 'lucide-react';

const WhatsAppWidget = () => {
  const phoneNumber = "91XXXXXXXXXX"; // Anand, yahan apna 10 digit number daalein (prefix 91 ke saath)
  const message = "Namaste! Mujhe health package ke baare mein jaankari chahiye.";

  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-8 right-4 z-[400] group">
      {/* Tooltip Popup */}
      <div className="absolute bottom-20 right-0 scale-0 group-hover:scale-100 transition-all duration-300 origin-bottom-right">
        <div className="mb-2 w-44 rounded-[12px] border border-[var(--hc-border)] bg-[var(--hc-surface)] p-3 shadow-xl">
          <p className="text-[11px] font-black text-[var(--hc-text)] leading-tight">
            Need help choosing a package?
          </p>
        </div>
      </div>

      {/* Main WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {/* Ring Animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
        
        <div className="relative z-10">
          <MessageCircle size={23} strokeWidth={2.5} className="group-hover:hidden" />
          <Send size={22} className="hidden group-hover:block animate-in zoom-in duration-200" />
        </div>
      </button>

      {/* Online Status Badge */}
      <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-300 shadow-sm"></span>
    </div>
  );
};

export default WhatsAppWidget;
