import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Home, Phone } from 'lucide-react';
import { categoryNavItems, getPackagesForCategory } from '../../data/categoryNavData';
import useCartStore from '../../store/useCartStore';
import MegaMenuPackageCard from './MegaMenuPackageCard';

const CategoryMegaMenu = () => {
  const [activeId, setActiveId] = useState(null);
  const addItem = useCartStore((state) => state.addItem);

  const activeItem = categoryNavItems.find((item) => item.id === activeId);
  const activePackages = activeItem ? getPackagesForCategory(activeItem, 3) : [];

  const handleBook = (pkg) => {
    addItem({
      ...pkg,
      _id: pkg.id,
      title: pkg.name,
      type: 'PACKAGE',
      offerPrice: pkg.price,
      price: pkg.price,
    });
    setActiveId(null);
  };

  return (
    <div
      className="relative z-[90] hidden border-b border-teal-700 bg-teal-600 md:block"
      onMouseLeave={() => setActiveId(null)}
    >
      <div className="mx-auto flex h-11 max-w-7xl items-stretch px-4 lg:px-8">
        <Link
          to="/"
          className="flex items-center px-3 text-white/90 transition hover:text-white"
          aria-label="Home"
        >
          <Home size={18} />
        </Link>

        <div className="flex flex-1 items-stretch overflow-x-auto no-scrollbar">
          {categoryNavItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActiveId(item.id)}
                onFocus={() => setActiveId(item.id)}
                className={`relative flex shrink-0 items-center gap-1 px-4 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-white text-teal-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-amber-400'
                    : 'text-white hover:bg-teal-500/50'
                }`}
              >
                {item.isNew && (
                  <span className="absolute -top-1 right-2 rounded bg-red-500 px-1 py-0.5 text-[8px] font-bold uppercase text-white">
                    New
                  </span>
                )}
                {item.label}
                <ChevronDown size={14} className={isActive ? 'rotate-180' : ''} />
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeItem && (
          <Motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-full border-t border-slate-100 bg-white shadow-2xl"
          >
            <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[280px_1fr]">
              {/* Left — Why it matters */}
              <div className="border-r border-slate-100 bg-gradient-to-br from-teal-50 to-white p-6">
                <h3 className="text-base font-bold text-slate-900">{activeItem.whyTitle}</h3>
                <ul className="mt-4 space-y-3">
                  {activeItem.whyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-600 text-white">
                        <ArrowRight size={12} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <a
                  href="tel:18005720005"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-600"
                >
                  <Phone size={16} />
                  Talk to a Health Advisor
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* Right — Packages */}
              <div className="p-6">
                <h3 className="mb-4 text-base font-bold text-slate-800">
                  Preventive Packages for {activeItem.label}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activePackages.map((pkg) => (
                    <MegaMenuPackageCard key={pkg.id} pkg={pkg} onBook={handleBook} />
                  ))}
                </div>
                <a
                  href={`#packages`}
                  className="mt-4 inline-block text-sm font-semibold text-teal-600 hover:underline"
                  onClick={() => setActiveId(null)}
                >
                  View all {activeItem.label} packages →
                </a>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Mobile category strip — horizontal scroll */
export const MobileCategoryStrip = () => {
  const [openId, setOpenId] = useState(null);
  const addItem = useCartStore((state) => state.addItem);

  const openItem = categoryNavItems.find((i) => i.id === openId);
  const packages = openItem ? getPackagesForCategory(openItem, 3) : [];

  return (
    <div className="border-b border-teal-700 bg-teal-600 md:hidden">
      <div className="flex gap-1 overflow-x-auto px-3 py-2 no-scrollbar">
        {categoryNavItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className={`relative shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
              openId === item.id ? 'bg-white text-teal-700' : 'bg-teal-500/40 text-white'
            }`}
          >
            {item.isNew && (
              <span className="absolute -right-1 -top-1 rounded bg-red-500 px-1 text-[7px] font-bold text-white">
                NEW
              </span>
            )}
            {item.label}
          </button>
        ))}
      </div>

      {openItem && (
        <div className="border-t border-teal-500 bg-white px-4 py-4">
          <p className="mb-3 text-sm font-bold text-slate-900">{openItem.whyTitle}</p>
          <div className="space-y-3">
            {packages.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{pkg.name}</p>
                  <p className="text-xs text-slate-500">{pkg.tests} tests · ₹{pkg.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addItem({
                      ...pkg,
                      _id: pkg.id,
                      title: pkg.name,
                      type: 'PACKAGE',
                      offerPrice: pkg.price,
                      price: pkg.price,
                    });
                    setOpenId(null);
                  }}
                  className="shrink-0 rounded-lg bg-teal-600 px-3 py-2 text-xs font-bold text-white"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMegaMenu;
