import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DoctorConnectSection from './components/DoctorConnectSection';
import BookingForm from './components/BookingForm';
import AdminDashboard from './pages/admin/AdminDashboard'; 
import AdminLogin from './components/AdminLogin';
import AuthPage from './components/AuthPage';
import UserDashboard from './components/UserDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import LabDashboard from './components/LabDashboard';
import ProviderApplication from './components/ProviderApplication';
import VideoConsultationRoom from './components/VideoConsultationRoom';
import Testimonials from './components/Testimonials';
import WhyChooseUs from './components/WhyChooseUs';
import PackagesSlider from './components/packages/PackagesSlider';
import ProcessFlow from './components/ProcessFlow';
import CallbackWidget from './components/CallbackWidget'; 
import WhatsAppWidget from './components/WhatsAppWidget';
import Footer from './components/Footer';
import PackageDetail from './components/PackageDetail';
import PopularTests from './components/PopularTests';
import ServiceAssurance from './components/ServiceAssurance';
import FaqSection from './components/FaqSection';
import CartDrawer from './components/cart/CartDrawer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import SearchOverlay from './components/search/SearchOverlay';
import CategoryMegaMenu, { MobileCategoryStrip } from './components/nav/CategoryMegaMenu';
import HealthAiChatbot from './components/HealthAiChatbot';
import { clearAuthSession, saveAuthSession } from './services/authApi';

function AppContent() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const location = useLocation();
  const isStandalonePage = ['/auth', '/dashboard', '/doctor', '/lab', '/admin', '/provider/apply', '/consult'].some((path) => (
    location.pathname === path || location.pathname.startsWith(`${path}/`)
  ));
  const themeMode = localStorage.getItem('healthThemeMode') || 'day';
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
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

  const handleLoginSuccess = (userData, token) => {
    saveAuthSession({ user: userData, token });
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    clearAuthSession();
    setIsLoggedIn(false);
    setUser(null);
    setShowAdmin(false); 
  };

  return (
    <>
      {/* settingsKey ko key prop mein daala hai taaki components re-render hon */}
      <div className={`theme-${themeMode} min-h-screen hc-page relative font-sans ${showAdmin ? 'overflow-hidden' : ''}`} key={settingsKey}>
        
        {!showAdmin && !isStandalonePage && (
          <>
            <div className="sticky top-0 z-[100]">
              <Navbar
                isLoggedIn={isLoggedIn}
                user={user}
                onLogout={handleLogout}
                onOpenSearch={() => setIsSearchOpen(true)}
              />
              <CategoryMegaMenu />
              <MobileCategoryStrip />
            </div>
            <CallbackWidget />
            <WhatsAppWidget />
          </>
        )}

        {/* --- FLOATING ADMIN TOGGLE --- */}
        {!isStandalonePage && (
        <button 
          onClick={() => setShowAdmin(!showAdmin)}
          className="fixed bottom-4 left-4 z-[300] flex items-center gap-2 rounded-full border border-[var(--hc-border)] bg-[var(--hc-surface)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-[var(--hc-muted)] shadow-lg transition hover:text-[var(--hc-text)] active:scale-95"
        >
          <div className={`w-2 h-2 rounded-full ${showAdmin ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
          {showAdmin ? "Exit" : "Admin"}
        </button>
        )}

        <main className={`${showAdmin ? 'w-full h-screen overflow-hidden' : ''}`}>
          <Routes>
            <Route path="/" element={
              showAdmin ? (
                isLoggedIn && user?.role === 'ADMIN' ? (
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
                  <DoctorConnectSection />
                  <ServiceAssurance />
                  <PopularTests onBook={setSelectedPackage} />
                  <PackagesSlider onBookClick={setSelectedPackage} />
                  <ProcessFlow /> 
                  <WhyChooseUs /> 
                  <Testimonials /> 
                  <FaqSection />
                </>
              )
            } />
            
            <Route path="/auth" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/provider/apply" element={<ProviderApplication />} />
            <Route path="/consult/:roomId" element={<VideoConsultationRoom />} />
            <Route path="/dashboard" element={isLoggedIn ? <UserDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
            <Route path="/doctor" element={isLoggedIn && ['DOCTOR', 'ADMIN'].includes(user?.role) ? <DoctorDashboard user={user} onLogout={handleLogout} /> : <Navigate to={isLoggedIn ? '/dashboard' : '/auth'} />} />
            <Route path="/lab" element={isLoggedIn && ['LAB_STAFF', 'PATHOLOGIST', 'PHLEBOTOMIST', 'ADMIN'].includes(user?.role) ? <LabDashboard user={user} onLogout={handleLogout} /> : <Navigate to={isLoggedIn ? '/dashboard' : '/auth'} />} />
            <Route path="/admin" element={isLoggedIn && user?.role === 'ADMIN' ? <AdminDashboard onLogout={handleLogout} onSettingsUpdate={triggerSettingsRefresh} /> : <Navigate to={isLoggedIn ? '/dashboard' : '/auth'} />} />
            <Route path="/package/:id" element={<PackageDetail onBook={setSelectedPackage} />} />
          </Routes>
        </main>

        {!showAdmin && !isStandalonePage && <Footer />}
        {!showAdmin && !isStandalonePage && <CartDrawer />}
        {!showAdmin && !isStandalonePage && <HealthAiChatbot onBook={setSelectedPackage} />}
        {!showAdmin && !isStandalonePage && <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
        {!showAdmin && !isStandalonePage && <MobileBottomNav onOpenSearch={() => setIsSearchOpen(true)} />}

        {/* --- GLOBAL BOOKING MODAL --- */}
        {selectedPackage && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-[500] p-4 animate-in fade-in duration-300">
            <div className="hc-surface rounded-[8px] shadow-2xl w-full max-w-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
              <button 
                className="absolute top-5 right-5 text-gray-400 hover:text-rose-500 transition-all text-xl font-bold p-2 z-10"
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
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
