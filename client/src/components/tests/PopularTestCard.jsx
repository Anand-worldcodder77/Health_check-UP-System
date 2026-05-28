import React, { useState } from 'react';
import { Check, Clock, FlaskConical, Home, Plus, Star } from 'lucide-react';

const PopularTestCard = ({ test, onBook }) => {
  const [added, setAdded] = useState(false);
  const mrp = test.mrp || Math.round(test.price * 2.8);
  const discount = test.discount || Math.round(((mrp - test.price) / mrp) * 100);
  const isBestSeller = test.bestSeller;

  const handleBook = () => {
    onBook(test);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_12px_40px_rgba(13,148,136,0.12)]">
      {isBestSeller && (
        <span className="absolute left-0 top-4 z-10 rounded-r-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-950 shadow-sm">
          Bestseller
        </span>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">
              {test.category}
            </span>
            <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-slate-900 group-hover:text-teal-800">
              {test.name}
            </h3>
            {test.rating && (
              <div className="mt-1.5 flex items-center gap-1 text-amber-500">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-semibold text-slate-600">{test.rating}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleBook}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg shadow-sm transition active:scale-95 ${
              added ? 'bg-emerald-500 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
            aria-label={`Add ${test.name}`}
          >
            {added ? <Check size={18} /> : <Plus size={18} strokeWidth={2.5} />}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-gradient-to-b from-teal-50/90 to-slate-50/50 p-3 ring-1 ring-teal-100/60">
          <div className="text-center">
            <FlaskConical size={17} className="mx-auto text-teal-600" strokeWidth={2} />
            <p className="mt-1.5 text-sm font-bold text-slate-800">{test.tests}</p>
            <p className="text-[10px] font-medium text-slate-500">tests</p>
          </div>
          <div className="border-x border-teal-100/80 text-center">
            <Clock size={17} className="mx-auto text-teal-600" strokeWidth={2} />
            <p className="mt-1.5 text-sm font-bold text-slate-800">{test.reportTime}</p>
            <p className="text-[10px] font-medium text-slate-500">report</p>
          </div>
          <div className="text-center">
            <Home size={17} className="mx-auto text-teal-600" strokeWidth={2} />
            <p className="mt-1.5 text-xs font-bold leading-tight text-slate-800">{test.fasting}</p>
            <p className="text-[10px] font-medium text-slate-500">fasting</p>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">₹{test.price}</span>
              <span className="text-sm text-slate-400 line-through">₹{mrp}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {discount}% off
              </span>
              <span className="text-[11px] font-medium text-slate-500">Free home collection</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleBook}
            className={`shrink-0 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wide shadow-md transition active:scale-95 ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-teal-600/25'
            }`}
          >
            {added ? 'Added' : 'Book'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default PopularTestCard;
