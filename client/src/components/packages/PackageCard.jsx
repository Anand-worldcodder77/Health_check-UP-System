import React, { useState } from 'react';
import { Check, Clock, Coffee, ShieldCheck, Users } from 'lucide-react';
import useCartStore from '../../store/useCartStore';

const PackageCard = ({ data }) => {
  const name = data.name || data.title;
  const tests = data.tests || data.testCount || 0;
  const price = data.offerPrice || data.discountedPrice || data.price || 0;
  const members = data.members || 1;
  const includes = data.includes || data.shortDescription || 'Includes selected diagnostic tests with home sample collection.';
  const originalPrice = data.mrp || data.price || Math.round(price * 2);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleBookNow = () => {
    addItem({
      ...data,
      _id: data._id || data.id || data.name,
      title: data.title || data.name,
      type: 'PACKAGE',
      price,
      offerPrice: data.offerPrice || data.discountedPrice || price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-[var(--hc-border)] bg-[var(--hc-surface)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8">
      <div className="absolute -top-3 left-5 rounded-full bg-[var(--hc-warm)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-lg">
        50% off
      </div>

      <div className="mb-5 mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--hc-accent-soft)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--hc-accent)]">
            <ShieldCheck size={13} />
            Best Seller
          </div>
          <h3 className="text-lg font-black leading-snug text-[var(--hc-text)] md:text-xl">{name}</h3>
        </div>
        <div className="rounded-[12px] border border-[var(--hc-border)] bg-[var(--hc-soft)] px-4 py-3 text-center">
          <div className="text-2xl font-black text-[var(--hc-text)]">{tests}</div>
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--hc-muted)]">Tests</div>
        </div>
      </div>

      <p className="line-clamp-3 text-sm font-medium leading-6 text-[var(--hc-muted)]">{includes}</p>

      <div className="my-5 space-y-3 border-y border-[var(--hc-border)] py-4">
        <div className="flex items-center gap-3 text-sm font-bold text-[var(--hc-muted)]">
          <Clock size={17} className="text-[var(--hc-accent)]" />
          Reports in 24 hrs
        </div>
        <div className="flex items-center gap-3 text-sm font-bold text-[var(--hc-muted)]">
          <Coffee size={17} className="text-[var(--hc-accent)]" />
          10-12 hrs fasting recommended
        </div>
      </div>

      <div className="mt-auto">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="text-2xl font-black text-[var(--hc-text)]">Rs. {price}</div>
            <div className="text-sm font-bold text-[var(--hc-muted)]">
              <span className="line-through">Rs. {originalPrice}</span>
              <span className="ml-2">per person</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-[10px] bg-[var(--hc-soft)] px-3 py-2 text-xs font-black text-[var(--hc-muted)]">
            <Users size={15} />
            {members}
          </div>
        </div>

        <button
          onClick={handleBookNow}
          className={`flex w-full items-center justify-center gap-2 rounded-[12px] py-3.5 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-black/10 transition hover:opacity-90 ${added ? 'bg-emerald-500' : 'bg-[var(--hc-warm)]'}`}
        >
          {added ? (
            <>
              Added <Check size={16} />
            </>
          ) : 'Add to cart'}
        </button>
      </div>
    </article>
  );
};

export default PackageCard;
