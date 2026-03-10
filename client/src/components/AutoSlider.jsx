import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow, Navigation } from 'swiper/modules';

// Professional Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

const AutoSlider = () => {
  const slides = [
    {
      title: "Free Home Collection",
      subtitle: "Safety First",
      desc: "ISO-certified phlebo reaches your home in 60 mins with GPS tracking.",
      gradient: "from-[#00b4d8] to-[#0077b6]",
      icon: "🏠",
      stat: "60 Min Pickup"
    },
    {
      title: "NABL & CAP Labs",
      subtitle: "Gold Standard",
      desc: "Reports generated using AI-driven Swiss technology for 99.9% accuracy.",
      gradient: "from-[#f8961e] to-[#f3722c]",
      icon: "🔬",
      stat: "AI Verified"
    },
    {
      title: "Trend Analysis Reports",
      subtitle: "Smart Health",
      desc: "Visualize your health over months with our interactive smart dashboard.",
      gradient: "from-[#4361ee] to-[#3f37c9]",
      icon: "📊",
      stat: "Visual History"
    },
    {
      title: "Doctor Consultation",
      subtitle: "Expert Advice",
      desc: "Post-report call with MD Doctors to understand every parameter clearly.",
      gradient: "from-[#7209b7] to-[#560bad]",
      icon: "👨‍⚕️",
      stat: "24/7 Support"
    },
    {
      title: "100% Secure Data",
      subtitle: "Privacy Guard",
      desc: "Your health records are encrypted with 256-bit military-grade security.",
      gradient: "from-[#06d6a0] to-[#05a37b]",
      icon: "🛡️",
      stat: "Full Privacy"
    }
  ];

  return (
    <div className="py-20 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header - Pro Style */}
        <div className="flex flex-col mb-12 space-y-2">
          <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs">Premium Experience</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Why India Trusts <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Healthians</span>
          </h2>
          <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, EffectCoverflow, Navigation]}
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={1}
          coverflowEffect={{
            rotate: 5,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // User hover karega toh ruk jayega (UX standard)
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true // Dots bade-chote honge modern look ke liye
          }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pb-20 !pt-10 professional-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="px-4">
              <div className={`relative group h-[380px] w-full rounded-[40px] p-1 bg-gradient-to-br ${slide.gradient} shadow-2xl transition-all duration-500 hover:-translate-y-4`}>
                
                {/* Glassmorphism Inner Card */}
                <div className="bg-white/10 backdrop-blur-md h-full w-full rounded-[38px] p-8 flex flex-col justify-between border border-white/20">
                  
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-xl text-4xl shadow-inner border border-white/30">
                        {slide.icon}
                      </div>
                      <span className="bg-black/20 text-[10px] font-bold text-white px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                        {slide.stat}
                      </span>
                    </div>

                    <div className="mt-8">
                      <p className="text-white/70 text-[10px] font-bold uppercase tracking-[3px] mb-1">
                        {slide.subtitle}
                      </p>
                      <h3 className="text-2xl font-black text-white leading-tight">
                        {slide.title}
                      </h3>
                      <p className="text-white/80 mt-4 text-sm font-medium leading-relaxed">
                        {slide.desc}
                      </p>
                    </div>
                  </div>

                  {/* Pro-Bottom Action Overlay */}
                  <div className="flex items-center space-x-2 text-white/50 group-hover:text-white transition-colors duration-300">
                    <div className="h-[2px] w-8 bg-current"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Global Standards</span>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Global CSS for Swiper Dots */}
      <style dangerouslySetInnerHTML={{ __html: `
        .professional-swiper .swiper-pagination-bullet-active {
          background: #2563eb !important;
          width: 30px !important;
          border-radius: 10px !important;
        }
        .professional-swiper .swiper-slide-active {
          filter: none !important;
          opacity: 1 !important;
        }
        .professional-swiper .swiper-slide {
          filter: blur(2px);
          opacity: 0.5;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}} />
    </div>
  );
};

export default AutoSlider;