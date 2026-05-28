import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { popularTests as staticPopularTests } from '../data/siteContent';
import useCartStore from '../store/useCartStore';
import PopularTestCard from './tests/PopularTestCard';
import { API_BASE } from '../services/apiConfig';

const CATEGORY_FILTERS = ['All', 'Blood', 'Hormone', 'Diabetes', 'Heart', 'Vitamins'];

function mapApiTest(test) {
  return {
    id: test._id,
    name: test.name,
    category: test.category || 'Lab test',
    reportTime: test.turnaroundTime ? `${test.turnaroundTime} hrs` : '7 hrs',
    fasting: test.sampleType?.toLowerCase().includes('fast') ? '10 hrs fasting' : 'No fasting',
    price: test.price ?? 399,
    mrp: test.mrp ?? Math.round((test.price ?? 399) * 2.8),
    discount: test.discountPercent,
    tests: 1,
    rating: '4.8',
  };
}

const PopularTests = () => {
  const [tests, setTests] = useState(staticPopularTests);
  const [activeFilter, setActiveFilter] = useState('All');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    let cancelled = false;

    const loadTests = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/catalog/tests`);
        if (!res.ok) return;
        const json = await res.json();
        const apiTests = (json.data || []).slice(0, 12).map(mapApiTest);
        if (!cancelled && apiTests.length >= 4) {
          setTests(apiTests);
        }
      } catch {
        /* keep static fallback */
      }
    };

    loadTests();
    return () => { cancelled = true; };
  }, []);

  const filteredTests = useMemo(() => {
    if (activeFilter === 'All') return tests;
    return tests.filter((t) => t.category.toLowerCase().includes(activeFilter.toLowerCase()));
  }, [tests, activeFilter]);

  const displayTests = filteredTests.length ? filteredTests : tests;

  const handleBookTest = (test) => {
    addItem({
      ...test,
      _id: test._id || test.id,
      title: test.name,
      type: 'TEST',
      offerPrice: test.price,
      price: test.price,
    });
  };

  return (
    <section id="popular-tests" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-14 md:py-16">
      <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-teal-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-teal-50/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600">Popular tests</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Frequently booked lab tests
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
              Quick access to common blood, thyroid, diabetes, heart, and vitamin tests with home collection.
            </p>
          </div>
          <a
            href="#packages"
            className="inline-flex items-center gap-1 self-start text-sm font-bold text-teal-600 transition hover:gap-2 hover:text-teal-700"
          >
            View all tests
            <ChevronRight size={18} />
          </a>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeFilter === cat
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-teal-200 hover:text-teal-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative px-1 md:px-12">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, FreeMode]}
            spaceBetween={20}
            slidesPerView={1.12}
            centeredSlides={false}
            grabCursor
            freeMode={{ enabled: true, momentum: true, momentumRatio: 0.8 }}
            speed={450}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: '.popular-tests-next',
              prevEl: '.popular-tests-prev',
            }}
            pagination={{
              clickable: true,
              el: '.popular-tests-pagination',
              dynamicBullets: true,
            }}
            breakpoints={{
              480: { slidesPerView: 1.35, spaceBetween: 16 },
              640: { slidesPerView: 2.05, centeredSlides: false },
              900: { slidesPerView: 2.6, spaceBetween: 20 },
              1200: { slidesPerView: 3.15, spaceBetween: 24 },
            }}
            className="popular-tests-swiper premium-tests-swiper !overflow-visible !pb-14"
          >
            {displayTests.map((test, index) => (
              <SwiperSlide key={test.id || test._id} className="!h-auto">
                <PopularTestCard
                  test={{
                    ...test,
                    bestSeller: index === 0,
                    rating: test.rating || (index < 3 ? '4.9' : null),
                  }}
                  onBook={handleBookTest}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            className="popular-tests-prev absolute left-0 top-[42%] z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition hover:border-teal-300 hover:bg-teal-600 hover:text-white md:grid"
            aria-label="Previous tests"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            className="popular-tests-next absolute right-0 top-[42%] z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition hover:border-teal-300 hover:bg-teal-600 hover:text-white md:grid"
            aria-label="Next tests"
          >
            <ArrowRight size={20} />
          </button>

          <div className="popular-tests-pagination mt-2 flex items-center justify-center gap-1" />
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 md:hidden">
          Swipe to explore more tests →
        </p>
      </div>
    </section>
  );
};

export default PopularTests;
