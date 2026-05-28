import React, { useState } from 'react';
import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Twitter } from 'lucide-react';
import { brandDefaults, careCategories } from '../data/siteContent';

const Footer = () => {
  const [labSettings] = useState(() => {
    const savedData = localStorage.getItem('labSettings');
    return savedData ? { ...brandDefaults, ...JSON.parse(savedData) } : brandDefaults;
  });

  const brandParts = labSettings.labName.trim().split(' ');
  const firstBrand = brandParts[0] || brandDefaults.labName;
  const restBrand = brandParts.slice(1).join(' ') || 'Checks';

  return (
    <footer className="bg-[var(--hc-brand)] px-5 py-20 text-[var(--hc-brand-text)] lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.2fr_0.8fr_1fr_1fr]">
        <div>
          <div className="mb-7 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-white/15 font-black text-lg">H</span>
            <h2 className="text-2xl font-black">
              {firstBrand}
              <span className="opacity-70"> {restBrand}</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm font-medium leading-8 opacity-70">
            Advanced diagnostics, transparent packages, and home collection built around preventive health.
          </p>
          <div className="mt-8 flex gap-4">
            {[Facebook, Instagram, Twitter].map((Icon, index) => (
              <button key={index} className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-white/10 transition hover:bg-white/20" aria-label="Social link">
                <Icon size={20} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-7 text-xs font-black uppercase tracking-[0.2em] opacity-75">Packages</h3>
          <ul className="space-y-4 text-sm font-bold opacity-70">
            {careCategories.slice(0, 5).map((category) => (
              <li key={category} className="transition hover:text-white">{category}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-7 text-xs font-black uppercase tracking-[0.2em] opacity-75">Contact</h3>
          <ul className="space-y-5 text-sm font-medium opacity-70">
            <li className="flex gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0" />
              {labSettings.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0" />
              {labSettings.contact}
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0" />
              {labSettings.email}
            </li>
          </ul>
        </div>

        <div className="rounded-[12px] border border-white/10 bg-white/[0.08] p-8">
          <ShieldCheck size={32} className="mb-6" />
          <h3 className="text-lg font-black">Need support?</h3>
          <p className="mt-4 text-sm font-medium leading-6 opacity-70">
            Our care team can help you choose a package or reschedule a collection.
          </p>
          <a href={`tel:${labSettings.contact}`} className="mt-8 inline-flex w-full justify-center rounded-[10px] bg-white px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-zinc-950 transition hover:bg-white/90">
            Contact care team
          </a>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col justify-between gap-6 border-t border-white/10 pt-12 text-xs font-bold opacity-60 md:flex-row md:items-center">
        <p>Copyright 2026 {labSettings.labName}. All rights reserved.</p>
        <div className="flex gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
