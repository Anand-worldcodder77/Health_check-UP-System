import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // --- 1. SETTINGS STATE (Default values ke saath) ---
  const [labSettings, setLabSettings] = useState({
    labName: 'HealthChecks',
    contact: '1800-572-0005',
    address: '123 Health Street, Medical Hub, New Delhi',
    email: 'support@healthchecks.com'
  });

  // --- 2. DYNAMIC SYNC (Admin Panel se data uthana) ---
  useEffect(() => {
    const savedData = localStorage.getItem('labSettings');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setLabSettings({
        labName: parsedData.labName || 'HealthChecks',
        contact: parsedData.contact || '1800-572-0005',
        address: parsedData.address || '123 Health Street, Medical Hub',
        email: parsedData.email || 'support@healthchecks.com'
      });
    }
  }, []);

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 px-10 rounded-t-[60px] relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black italic tracking-tighter">
            {labSettings.labName.split(' ')[0]}
            <span className="text-[#009494]">
              {labSettings.labName.split(' ').slice(1).join(' ') || 'PRO'}
            </span>
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Advanced diagnostics and wellness tracking at your fingertips. Your health, our priority.
          </p>
          <div className="flex gap-4">
            <div className="p-3 bg-white/5 rounded-2xl hover:bg-[#009494] transition-all cursor-pointer"><Facebook size={18} /></div>
            <div className="p-3 bg-white/5 rounded-2xl hover:bg-[#009494] transition-all cursor-pointer"><Instagram size={18} /></div>
            <div className="p-3 bg-white/5 rounded-2xl hover:bg-[#009494] transition-all cursor-pointer"><Twitter size={18} /></div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#009494] mb-8">Quick Links</h4>
          <ul className="space-y-4 text-slate-400 font-bold text-sm">
            <li className="hover:text-white transition-colors cursor-pointer italic">Full Body Checkups</li>
            <li className="hover:text-white transition-colors cursor-pointer italic">Diabetes Screening</li>
            <li className="hover:text-white transition-colors cursor-pointer italic">Cancer Markers</li>
            <li className="hover:text-white transition-colors cursor-pointer italic">Book Home Visit</li>
          </ul>
        </div>

        {/* Contact Info (Dynamic) */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#009494] mb-8">Contact Us</h4>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <MapPin size={20} className="text-[#009494] shrink-0" />
              <span className="text-slate-400 text-sm font-medium">{labSettings.address}</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone size={18} className="text-[#009494] shrink-0" />
              <span className="text-slate-400 text-sm font-black tracking-widest">{labSettings.contact}</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail size={18} className="text-[#009494] shrink-0" />
              <span className="text-slate-400 text-sm font-medium">{labSettings.email}</span>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="bg-white/5 p-8 rounded-[40px] border border-white/5">
          <h4 className="text-sm font-black mb-4 italic">Need Support?</h4>
          <p className="text-slate-500 text-xs mb-6 font-medium leading-relaxed">Our medical experts are available 24/7 for your assistance.</p>
          <button className="w-full py-4 bg-[#009494] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#009494]/20">Contact Agent</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-20 pt-10 flex flex-col md:row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
        <p>© 2026 {labSettings.labName}. All Rights Reserved.</p>
        <div className="flex gap-8">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#009494]/10 blur-[100px] rounded-full"></div>
    </footer>
  );
};

export default Footer;