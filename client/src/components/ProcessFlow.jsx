import React from 'react';
import { processSteps } from '../data/siteContent';

const ProcessFlow = () => {
  return (
    <section id="process" className="hc-section hc-page">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[var(--hc-accent)]">How it works</div>
          <h2 className="text-3xl font-black leading-tight text-[var(--hc-text)] md:text-5xl">
            A simple clinical workflow from booking to report.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {processSteps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.id} className="rounded-[12px] border border-[var(--hc-border)] bg-[var(--hc-surface)] p-8 shadow-sm">
                <div className="mb-10 flex items-center justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-[10px] ${step.accent}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-4xl font-black text-[var(--hc-border)]">{step.id}</span>
                </div>
                <h3 className="text-lg font-black text-[var(--hc-text)]">{step.title}</h3>
                <p className="mt-4 text-sm font-medium leading-6 text-[var(--hc-muted)]">{step.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;
