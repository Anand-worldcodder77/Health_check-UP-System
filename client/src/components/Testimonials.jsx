import React from 'react';
import { Quote, Star } from 'lucide-react';
import { testimonials } from '../data/siteContent';

const Testimonials = () => {
  return (
    <section className="hc-section bg-[var(--hc-brand)] text-[var(--hc-brand-text)]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 text-xs font-black uppercase tracking-[0.22em] opacity-70">Patient feedback</div>
          <h2 className="mx-auto max-w-3xl text-3xl font-black leading-tight md:text-5xl">
            People remember a healthcare experience that feels calm and precise.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((review) => (
            <article key={review.name} className="rounded-[12px] border border-white/10 bg-white/[0.08] p-8">
              <div className="mb-10 flex items-start justify-between">
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, index) => (
                    <Star key={index} size={18} fill="currentColor" className="text-amber-300" />
                  ))}
                </div>
                <Quote size={32} className="text-white/20" />
              </div>

              <p className="min-h-32 text-base font-medium leading-8 opacity-85">"{review.text}"</p>

              <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-white/15 font-black text-base">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.12em]">{review.name}</h3>
                  <p className="mt-1.5 text-xs font-bold opacity-60">{review.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
