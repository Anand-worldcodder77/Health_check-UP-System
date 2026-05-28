import React from 'react';
import { whyChooseFeatures } from '../data/siteContent';

const WhyChooseUs = () => {
  return (
    <section id="reports" className="hc-section hc-surface">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[var(--hc-accent)]">Why patients choose us</div>
            <h2 className="max-w-2xl text-3xl font-black leading-tight text-[var(--hc-text)] md:text-5xl">
              Premium care details that make the service feel dependable.
            </h2>
          </div>
          <p className="max-w-md text-sm font-medium leading-7 text-[var(--hc-muted)]">
            From collection timing to report counselling, the interface now highlights operational trust instead of decorative noise.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-[12px] border border-[var(--hc-border)] bg-[var(--hc-soft)] p-8 transition hover:bg-[var(--hc-surface)] hover:shadow-lg hover:shadow-black/5">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[10px] bg-[var(--hc-surface)] text-[var(--hc-accent)] shadow-sm">
                  <Icon size={26} />
                </div>
                <h3 className="text-lg font-black text-[var(--hc-text)]">{feature.title}</h3>
                <p className="mt-4 text-sm font-medium leading-6 text-[var(--hc-muted)]">{feature.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
