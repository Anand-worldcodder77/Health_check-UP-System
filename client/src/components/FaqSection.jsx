import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../data/siteContent';

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="support" className="hc-section hc-page">
      <div className="hc-container">
        <div className="hc-section-head">
          <div>
            <span className="hc-kicker">FAQ</span>
            <h2 className="hc-title">Answers that reduce booking hesitation.</h2>
          </div>
          <p className="hc-copy">
            Healthcare users need clarity before they share personal details or book a home visit.
          </p>
        </div>

        <div className="grid gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <article key={faq.question} className="hc-faq">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="text-base font-black text-[var(--hc-text)]">{faq.question}</span>
                  <ChevronDown size={19} className={`shrink-0 text-[var(--hc-muted)] transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-[var(--hc-muted)]">{faq.answer}</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
