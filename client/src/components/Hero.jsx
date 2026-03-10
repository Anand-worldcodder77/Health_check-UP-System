import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Link ke saath useNavigate import kiya

const Hero = ({ onBook }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSearch, setHeroSearch] = useState(""); // 2. Search state add ki
  const navigate = useNavigate(); // 3. Navigate hook initialize kiya

  // Search handle karne ka function
  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/package/${heroSearch}`);
      setHeroSearch(""); // Search ke baad input clear karne ke liye
    }
  };

  // 6 Premium Slides
  const banners = [
    { title: "CXO SUPER SPECIALITY PACKAGE", price: "7999", tests: "320+", img: "https://images.unsplash.com/photo-1579152276503-3150bc0c634d?q=80&w=2070&auto=format&fit=crop" },
    { title: "MAKE INDIA HEALTHY 2026", price: "99", tests: "7", img: "https://images.unsplash.com/photo-1504813184591-01574ff81c8d?q=80&w=2070&auto=format&fit=crop" },
    { title: "WINTER WELLNESS SCREENING", price: "2130", tests: "99", img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2070&auto=format&fit=crop" },
    { title: "DIABETES GOLD PACKAGE", price: "1299", tests: "25+", img: "https://images.unsplash.com/photo-1579684385123-1d162705f237?q=80&w=2070&auto=format&fit=crop" },
    { title: "CARDIAC RISK MARKERS", price: "2499", tests: "15+", img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2070&auto=format&fit=crop" },
    { title: "ADVANCED RADIOLOGY OFFERS", price: "900", tests: "Imaging", img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-[#009494]">
      {banners.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.img})`,
              backgroundColor: '#007a7a' 
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-12 max-w-3xl text-center shadow-2xl mx-4">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter drop-shadow-2xl">
                  {slide.title}
                </h1>
                <div className="flex justify-center items-center space-x-6 mb-10 text-white">
                  <span className="text-xl font-bold bg-white/20 px-6 py-2 rounded-full border border-white/10">
                    Total Tests: {slide.tests}
                  </span>
                  <span className="text-5xl text-yellow-300 font-black drop-shadow-lg">₹{slide.price}</span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => onBook(slide.title)}
                    className="bg-[#FF6F61] text-white px-12 py-4 rounded-full text-lg font-black shadow-xl hover:bg-[#e86356] transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest w-full md:w-auto"
                  >
                    Book Now »
                  </button>
                  
                  <Link 
                    to={`/package/${slide.title}`}
                    className="bg-white/20 backdrop-blur-md text-white border border-white/40 px-12 py-4 rounded-full text-lg font-black hover:bg-white hover:text-[#009494] transition-all transform hover:scale-105 uppercase tracking-widest w-full md:w-auto"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* --- UPDATED SEARCH BAR SECTION --- */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center px-4">
        <form 
          onSubmit={handleHeroSearch} 
          className="bg-white rounded-full shadow-2xl flex items-center p-2 w-full max-w-4xl border border-gray-100"
        >
          <input 
            type="text" 
            placeholder="Search for MRI, CT Scans, Blood Tests..." 
            value={heroSearch}
            onChange={(e) => setHeroSearch(e.target.value)}
            className="flex-1 px-8 py-4 rounded-l-full outline-none text-lg font-bold text-gray-700" 
          />
          <button 
            type="submit" 
            className="bg-[#009494] text-white px-12 py-4 rounded-full font-black text-lg flex items-center hover:bg-[#007a7a] transition-all"
          >
            <Search size={22} className="mr-3" /> SEARCH
          </button>
        </form>
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-3">
        {banners.map((_, i) => (
          <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-white w-10' : 'bg-white/40 w-3'}`} />
        ))}
      </div>
    </section>
  );
};

export default Hero;