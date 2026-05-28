import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import CategoryTabs from '../home/CategoryTabs';
import PackageCard from './PackageCard';
import { packageData } from '../../data/packageData';
import { API_BASE } from '../../services/apiConfig';

const mapApiPackage = (item) => ({
  ...item,
  id: item._id,
  name: item.title,
  tests: item.testCount || item.includesTests?.length || 0,
  price: item.discountedPrice,
  mrp: item.price,
  members: 1,
  includes: item.shortDescription || `${item.testCount || 0} tests included. Report in ${item.reportTimeHours || 24} hrs.`,
});

const PackagesSlider = ({ onBookClick }) => {
  const [activeTab, setActiveTab] = useState('Full Body Checkup');
  const [packages, setPackages] = useState(packageData);
  const categories = useMemo(() => Array.from(new Set(packages.map((pkg) => pkg.category).filter(Boolean))), [packages]);
  const filteredData = packages.filter((pkg) => pkg.category === activeTab);

  useEffect(() => {
    let cancelled = false;
    const loadPackages = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/catalog/packages`);
        if (!response.ok) return;
        const data = await response.json();
        const apiPackages = (data.data || []).map(mapApiPackage);
        if (!cancelled && apiPackages.length) {
          setPackages(apiPackages);
          setActiveTab(apiPackages[0].category || 'Full Body Checkup');
        }
      } catch {
        /* keep static fallback */
      }
    };

    loadPackages();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="packages" className="hc-section hc-surface">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[var(--hc-accent)]">Preventive packages</div>
            <h2 className="hc-compact-title">
              Most booked health checkup packages
            </h2>
          </div>
          <p className="max-w-md text-sm font-medium leading-7 text-[var(--hc-muted)]">
            Compare tests, fasting needs, report timing, and member pricing before you book.
          </p>
        </div>

        {categories.length > 0 && <CategoryTabs categories={categories} activeTab={activeTab} onTabClick={setActiveTab} />}

        <div className="relative pt-12">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={28}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-pkg',
              prevEl: '.swiper-button-prev-pkg',
            }}
            pagination={{ clickable: true, el: '.swiper-pagination-pkg' }}
            breakpoints={{
              700: { slidesPerView: 2 },
              1080: { slidesPerView: 3 },
            }}
            className="package-swiper !pb-14"
          >
            {filteredData.map((pkg) => (
              <SwiperSlide key={pkg.id} className="h-auto">
                <PackageCard data={pkg} onBookNow={onBookClick} />
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="swiper-button-prev-pkg absolute -left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[8px] border border-[var(--hc-border)] bg-[var(--hc-surface)] text-[var(--hc-muted)] shadow-lg transition hover:bg-[var(--hc-brand)] hover:text-[var(--hc-brand-text)] md:-left-5" aria-label="Previous packages">
            <ArrowLeft size={18} />
          </button>
          <button className="swiper-button-next-pkg absolute -right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[8px] border border-[var(--hc-border)] bg-[var(--hc-surface)] text-[var(--hc-muted)] shadow-lg transition hover:bg-[var(--hc-brand)] hover:text-[var(--hc-brand-text)] md:-right-5" aria-label="Next packages">
            <ArrowRight size={18} />
          </button>

          <div className="swiper-pagination-pkg flex items-center justify-center" />
        </div>
      </div>
    </section>
  );
};

export default PackagesSlider;
