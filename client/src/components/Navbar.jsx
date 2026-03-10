import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Home, Phone, User, Search, LogOut, ShieldCheck } from 'lucide-react';

const Navbar = ({ onBook, isLoggedIn, onLogout, user }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // --- DYNAMIC SETTINGS STATE ---
  const [labSettings, setLabSettings] = useState({
    labName: 'HealthChecks',
    contact: '1800-572-0005'
  });

  // Fetch settings from localStorage on load
  useEffect(() => {
    const savedData = localStorage.getItem('labSettings');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setLabSettings({
        labName: parsedData.labName || 'HealthChecks',
        contact: parsedData.contact || '1800-572-0005'
      });
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/package/${searchTerm}`);
      setSearchTerm("");
    }
  };

  const menuItems = [
    { title: "Full Body Checkup", tests: ["Healthy India 2026", "Winter Wellness", "CXO Speciality"], desc: "Comprehensive health screening for all." },
    { title: "Heart", tests: ["Cardiac Health Marker", "Lipid Profile Advance"], desc: "Early detection of cardiovascular risks." },
    { title: "Cancer", tests: ["Cancer Screening Male", "Cancer Screening Female"], desc: "Advanced tumor marker screenings." },
    { title: "Thyroid", tests: ["Thyroid Profile Total", "Thyroid Advance"], desc: "Complete assessment of T3, T4, and TSH." },
    { title: "Diabetes", tests: ["Diabetes Gold", "HbA1c Test"], desc: "Monitor blood sugar trends effectively." },
  ];

  return (
    <nav className="w-full shadow-xl sticky top-0 z-[100] bg-white font-sans">
      
      {/* --- TOP BRANDING BAR --- */}
      <div className="flex justify-between items-center py-4 px-12 border-b border-gray-100">
        {/* ✅ Dynamic Lab Name from Settings */}
        <Link to="/" className="text-2xl font-black text-[#009494] tracking-tighter uppercase italic">
          {labSettings.labName.split(' ')[0]}
          <span className="text-[#FF6F61]">
            {labSettings.labName.split(' ').slice(1).join(' ') || 'Checks'}
          </span>
        </Link>

        <div className="flex items-center space-x-8 text-[12px] font-black uppercase tracking-widest">
          {/* ✅ Dynamic Support Number */}
          <div className="hidden lg:flex items-center text-gray-400">
            <Phone size={16} className="mr-2 text-[#009494]" />
            <span>{labSettings.contact}</span>
          </div>

          <div className="h-6 w-[1px] bg-gray-200 hidden lg:block"></div>

          {/* --- SECTION 1: NORMAL USER AUTH --- */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-400 lowercase">Welcome back,</span>
                  <span className="text-[#009494] font-black italic">@{user?.name || 'User'}</span>
                </div>
                <button 
                  onClick={onLogout} 
                  className="p-2 bg-gray-50 text-gray-400 hover:text-rose-500 rounded-full transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="flex items-center bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-[#009494] transition-all shadow-lg shadow-gray-200">
                <User size={16} className="mr-2" /> Login / Signup
              </Link>
            )}
          </div>

          {/* --- SECTION 2: ADMIN PORTAL ACCESS --- */}
          <div className="h-6 w-[1px] bg-gray-200"></div>
          {/* Admin link will toggle the showAdmin state via App.jsx logic */}
          <div className="group flex items-center text-gray-400 hover:text-[#FF6F61] transition-colors cursor-pointer">
            <ShieldCheck size={18} className="mr-2 group-hover:animate-bounce text-[#009494]" />
            <span>Portal</span>
          </div>
        </div>
      </div>

      {/* --- BLUE CATEGORY BAR --- */}
      <div className="bg-[#009494] text-white w-full h-14 flex items-center relative shadow-inner">
        <Link to="/" className="h-full flex items-center px-8 border-r border-[#ffffff20] hover:bg-[#007a7a]">
          <Home size={22} fill="white" />
        </Link>
        
        <div className="flex h-full flex-1">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className="h-full px-6 cursor-pointer hover:bg-[#007a7a] flex items-center group transition-colors" 
              onMouseEnter={() => setActiveMenu(index)} 
              onMouseLeave={() => setActiveMenu(null)}
            >
              <span className="text-[11px] font-black tracking-[0.15em] uppercase">{item.title}</span>
              <ChevronDown size={14} className={`ml-2 transition-transform duration-300 ${activeMenu === index ? 'rotate-180' : ''}`} />
              
              {activeMenu === index && (
                <div className="absolute top-full left-0 w-[750px] bg-[#009494] backdrop-blur-xl text-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-b-[40px] flex overflow-hidden border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="w-[55%] p-10">
                    <h3 className="text-[10px] font-black text-white/40 mb-6 uppercase tracking-[0.3em] border-b border-white/5 pb-3 italic">Premium Packages</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {item.tests.map((test, i) => (
                        <div key={i} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all">
                          <Link to={`/package/${test}`} className="flex-1 text-[14px] font-bold tracking-tight">{test}</Link>
                          <button onClick={(e) => { e.preventDefault(); onBook(test); }} className="text-[9px] bg-white text-[#009494] px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 font-black transition-opacity shadow-lg">BOOK NOW</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-[45%] bg-black/10 p-10 flex flex-col justify-center">
                    <div className="bg-white/10 p-6 rounded-[30px] border border-white/5">
                      <p className="text-white font-medium text-sm leading-relaxed italic opacity-80 mb-6">"{item.desc}"</p>
                      <button onClick={() => onBook(item.title)} className="w-full bg-[#FF6F61] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform active:scale-95">View Details</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SEARCH BOX */}
        <form onSubmit={handleSearch} className="ml-auto flex items-center h-full px-8">
           <div className="flex items-center bg-black/10 rounded-full px-4 py-2 border border-white/10 focus-within:bg-white/20 transition-all">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-[11px] font-bold placeholder:text-white/40 w-20 focus:w-36 transition-all text-white" 
              />
              <Search size={14} className="text-white/40 ml-2 cursor-pointer" onClick={handleSearch} />
           </div>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;