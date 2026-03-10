import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import CategoryTabs from '../home/CategoryTabs';
import PackageCard from './PackageCard';
import { packageData } from '../../data/packageData'; // Data ko alag file se layenge

const PackagesSlider = ({ onBookClick }) => {
  const [activeTab, setActiveTab] = useState("Full Body Checkup");

  // Category ke basis par data filter karna
  const filteredData = packageData.filter(pkg => pkg.category === activeTab);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">
            Best health checkup <span className="text-[#009494]">packages</span>
          </h1>
          <p className="text-gray-500 text-lg font-bold mt-2">Comprehensive health checkups for your family.</p>
        </div>

        {/* --- PROFESSIONAL TABS --- */}
        <CategoryTabs activeTab={activeTab} onTabClick={setActiveTab} />

        {/* --- SWIPER SLIDER --- */}
        <div className="relative pt-12 pb-16">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-pkg',
              prevEl: '.swiper-button-prev-pkg',
            }}
            pagination={{ clickable: true, el: '.swiper-pagination-pkg' }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="package-swiper"
          >
            {filteredData.map((pkg) => (
              <SwiperSlide key={pkg.id}>
                <PackageCard data={pkg} onBookNow={onBookClick} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons - Screenshot ke jaisa look */}
          <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 swiper-button-prev-pkg bg-white text-gray-400 w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer z-10 hover:bg-[#009494] hover:text-white transition-all duration-300 border border-gray-100">←</div>
          <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 swiper-button-next-pkg bg-white text-gray-400 w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer z-10 hover:bg-[#009494] hover:text-white transition-all duration-300 border border-gray-100">→</div>
          
          {/* Custom Pagination Points */}
          <div className="swiper-pagination-pkg mt-8 text-center flex items-center justify-center"></div>
        </div>
      </div>
    </div>
  );
};

export default PackagesSlider;