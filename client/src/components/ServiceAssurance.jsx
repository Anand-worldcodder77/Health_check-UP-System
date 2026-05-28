import React from 'react';
import { serviceHighlights } from '../data/siteContent';

const ServiceAssurance = () => {
  return (
    <section className="hc-section hc-surface">
      <div className="hc-container">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="hc-assurance">
                <div className="hc-assurance-icon">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-black text-[var(--hc-text)]">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-[var(--hc-muted)]">{item.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceAssurance;
