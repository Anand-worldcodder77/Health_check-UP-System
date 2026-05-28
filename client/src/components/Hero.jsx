import React from 'react';
import { ArrowRight, FileUp, ShieldCheck, Star, Users } from 'lucide-react';
import { trustStats } from '../data/siteContent';

const Hero = ({ onBook }) => (
  <section className="bg-slate-50">
    <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 md:py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
      <div className="order-2 flex flex-col justify-center lg:order-1">
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
          <ShieldCheck size={14} />
          India&apos;s Most Trusted Lab Network
        </div>

        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
          Comprehensive Health Checkups at Home
        </h1>

        <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
          NABL accredited labs. Free home sample collection. Accurate reports in 24 hours — book preventive packages with transparent pricing.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => onBook?.('Full Body Checkup')}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 sm:w-auto"
          >
            Book a Test
            <ArrowRight size={18} />
          </button>
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-teal-600 bg-white px-6 py-3.5 text-sm font-bold text-teal-600 transition hover:bg-teal-50 sm:w-auto"
          >
            <FileUp size={18} />
            Upload Prescription
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
          {trustStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label}>
                <div className="flex items-center gap-1.5">
                  <Icon size={16} className="text-teal-600" />
                  <span className="text-lg font-extrabold text-slate-900">{stat.value}</span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-slate-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/60">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop"
              alt="Healthcare professional at home"
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
            />
          </div>

          <div className="absolute -bottom-4 left-4 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg sm:-bottom-5 sm:left-6">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-900">4.9/5</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">from 5M+ users</p>
          </div>

          <div className="absolute -right-2 top-4 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-lg sm:right-4">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-teal-600" />
              <div>
                <p className="text-sm font-bold text-slate-900">70+ Labs</p>
                <p className="text-[10px] font-medium text-slate-500">350+ cities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="border-y border-slate-200 bg-white py-3">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 lg:px-8">
        {['NABL Accredited', 'ISO 9001', 'CAP Certified', 'ICMR Approved'].map((badge) => (
          <span key={badge} className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-teal-600" />
            {badge}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default Hero;
