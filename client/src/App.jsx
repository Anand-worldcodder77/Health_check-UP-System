import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingForm from './components/BookingForm';
import AdminDashboard from './pages/admin/AdminDashboard'; 
import AdminLogin from './components/AdminLogin';
import AuthPage from './components/AuthPage';
import UserDashboard from './components/UserDashboard';
import Testimonials from './components/Testimonials';
import WhyChooseUs from './components/WhyChooseUs';
import PackagesSlider from './components/packages/PackagesSlider';
import AutoSlider from './components/AutoSlider';
import BookingCounter from './components/BookingCounter';
import ExpertPanel from './components/ExpertPanel';
import ProcessFlow from './components/ProcessFlow';
import CallbackWidget from './components/CallbackWidget'; 
import WhatsAppWidget from './components/WhatsAppWidget';
import Footer from './components/Footer';
import PackageDetail from './components/PackageDetail';

function App() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  
  // --- SETTINGS REFRESH KEY ---
  // Ye key help karti hai Navbar/Footer ko update karne mein jab admin settings badalti hain
  const [settingsKey, setSettingsKey] = useState(0);

  const triggerSettingsRefresh = () => {
    setSettingsKey(prev => prev + 1);
  };

  // --- AUTH STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isUserAuthenticated') === 'true';
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('isUserAuthenticated', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('isUserAuthenticated');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUser(null);
    setShowAdmin(false); 
  };

  return (
    <Router>
      {/* settingsKey ko key prop mein daala hai taaki components re-render hon */}
      <div className={`min-h-screen bg-gray-50 relative font-sans ${showAdmin ? 'overflow-hidden' : ''}`} key={settingsKey}>
        
        {!showAdmin && (
          <>
            <Navbar 
              onBook={setSelectedPackage} 
              isLoggedIn={isLoggedIn} 
              user={user} 
              onLogout={handleLogout} 
            />
            <CallbackWidget /> 
            <WhatsAppWidget />
          </>
        )}

        {/* --- FLOATING ADMIN TOGGLE --- */}
        <button 
          onClick={() => setShowAdmin(!showAdmin)}
          className="fixed bottom-10 right-10 z-[300] bg-slate-900 text-white px-8 py-4 rounded-full font-black text-[10px] shadow-2xl hover:scale-110 active:scale-95 transition-all uppercase tracking-[0.2em] border-2 border-white/20 flex items-center gap-3 group"
        >
          <div className={`w-2 h-2 rounded-full ${showAdmin ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
          {showAdmin ? "Exit Dashboard" : "Admin Portal"}
        </button>

        <main className={`${showAdmin ? 'w-full h-screen overflow-hidden' : ''}`}>
          <Routes>
            <Route path="/" element={
              showAdmin ? (
                isLoggedIn ? (
                  <div className="fixed inset-0 bg-white z-[400] overflow-hidden">
                    {/* triggerSettingsRefresh pass kiya hai taaki settings save hote hi website update ho */}
                    <AdminDashboard onLogout={handleLogout} onSettingsUpdate={triggerSettingsRefresh} /> 
                  </div>
                ) : (
                  <AdminLogin onLogin={handleLoginSuccess} />
                )
              ) : (
                <>
                  <Hero onBook={setSelectedPackage} />
                  <PackagesSlider onBookClick={setSelectedPackage} />
                  <AutoSlider /> 
                  <BookingCounter /> 
                  <ExpertPanel /> 
                  <ProcessFlow /> 
                  <WhyChooseUs /> 
                  <Testimonials /> 
                </>
              )
            } />
            
            <Route path="/auth" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/dashboard" element={isLoggedIn ? <UserDashboard user={user} /> : <Navigate to="/auth" />} />
            <Route path="/package/:id" element={<PackageDetail onBook={setSelectedPackage} />} />
          </Routes>
        </main>

        {!showAdmin && <Footer />}

        {/* --- GLOBAL BOOKING MODAL --- */}
        {selectedPackage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[500] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[50px] shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-300">
              <button 
                className="absolute top-8 right-8 text-gray-400 hover:text-rose-500 transition-all text-xl font-bold p-2 z-10"
                onClick={() => setSelectedPackage(null)}
              >✕</button>
              
              <BookingForm 
                packageName={selectedPackage} 
                onClose={() => setSelectedPackage(null)} 
              />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;