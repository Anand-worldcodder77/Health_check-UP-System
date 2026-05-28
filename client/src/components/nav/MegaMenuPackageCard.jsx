import React from 'react';
import { Clock, FlaskConical } from 'lucide-react';
import { getPackagePricing } from '../../data/categoryNavData';

const MegaMenuPackageCard = ({ pkg, onBook }) => {
  const { offerPrice, mrp, discount } = getPackagePricing(pkg);
  const reportHours = pkg.reportHours || (pkg.tests > 30 ? 24 : pkg.tests > 10 ? 19 : 12);

  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <h4 className="min-h-[40px] text-sm font-bold leading-snug text-slate-900">{pkg.name}</h4>

      <div className="mt-3 grid grid-cols-2 gap-2 border-b border-dashed border-slate-200 pb-3">
        <div className="flex items-start gap-2">
          <FlaskConical size={16} className="mt-0.5 shrink-0 text-teal-600" />
          <div>
            <p className="text-[10px] text-slate-500">Test Included</p>
            <p className="text-xs font-bold text-slate-800">{pkg.tests} Tests</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock size={16} className="mt-0.5 shrink-0 text-teal-600" />
          <div>
            <p className="text-[10px] text-slate-500">Report in</p>
            <p className="text-xs font-bold text-slate-800">{reportHours} Hrs.</p>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[10px] font-medium text-slate-500">Limited Time Offer</p>
        <div className="mt-1 flex flex-wrap items-end gap-2">
          <span className="text-xl font-extrabold text-slate-900">₹{offerPrice}</span>
          <span className="text-sm text-slate-400 line-through">₹{mrp}</span>
          <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {discount}% off
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onBook(pkg)}
        className="mt-4 w-full rounded-md bg-teal-600 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
      >
        Book Now
      </button>
    </article>
  );
};

export default MegaMenuPackageCard;
