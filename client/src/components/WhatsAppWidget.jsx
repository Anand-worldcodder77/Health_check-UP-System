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
    <div className="fixed bottom-10 right-10 z-[400] group">
      {/* Tooltip Popup */}
      <div className="absolute bottom-20 right-0 scale-0 group-hover:scale-100 transition-all duration-300 origin-bottom-right">
        <div className="bg-white p-4 rounded-3xl shadow-2xl border border-emerald-100 w-48 mb-2 relative">
          <p className="text-[11px] font-black text-slate-800 leading-tight uppercase tracking-tight">
            Koi sawaal hai? <br/> 
            <span className="text-emerald-500">Abhi chat karein!</span>
          </p>
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-emerald-100 rotate-45"></div>
        </div>
      </div>

      {/* Main WhatsApp Button */}
      <button
        onClick={openWhatsApp}
        className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_20px_50px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-90 transition-all duration-300 group"
      >
        {/* Ring Animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
        
        <div className="relative z-10">
          <MessageCircle size={30} strokeWidth={2.5} className="group-hover:hidden" />
          <Send size={28} className="hidden group-hover:block animate-in zoom-in duration-200" />
        </div>
      </button>

      {/* Online Status Badge */}
      <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-400 border-4 border-white rounded-full shadow-sm"></span>
    </div>
  );
};

export default WhatsAppWidget;