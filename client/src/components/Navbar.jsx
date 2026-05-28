import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import {
  ChevronDown,
  FileUp,
  LogOut,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  Stethoscope,
  User,
} from 'lucide-react';
import { brandDefaults, quickSearches } from '../data/siteContent';
import useCartStore from '../store/useCartStore';
import useCatalogSearch from '../hooks/useCatalogSearch';
import SearchResultsList from './search/SearchResultsList';
import PrescriptionUploadDrawer from './PrescriptionUploadDrawer';

const Navbar = ({ isLoggedIn, onLogout, user, onOpenSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [rxOpen, setRxOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('110001, Delhi');
  const [labSettings] = useState(() => {
    const savedData = localStorage.getItem('labSettings');
    return savedData ? { ...brandDefaults, ...JSON.parse(savedData) } : brandDefaults;
  });

  const cartItems = useCartStore((state) => state.cartItems);
  const openCart = useCartStore((state) => state.openCart);
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  const locations = ['110001, Delhi', '400001, Mumbai', '560001, Bangalore', '380001, Ahmedabad'];

  const { results: searchResults, loading: searchLoading, error: searchError } = useCatalogSearch(
    searchTerm,
    { enabled: isSearchFocused },
  );

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    const first = searchResults[0];
    if (first?.slug) {
      navigate(`/package/${first.slug}`);
    } else if (first?.title || first?.name) {
      navigate(`/package/${first.title || first.name}`);
    } else {
      navigate(`/package/${trimmed}`);
    }

    setSearchTerm('');
    setIsSearchFocused(false);
  };

  const handleAddToCart = (item) => {
    addItem(item);
    setIsSearchFocused(false);
  };

  const selectLocation = (loc) => {
    setSelectedLocation(loc);
    setLocationOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] bg-white shadow-sm">
      {/* Layer 1 — Top trust strip (desktop) */}
      <div className="hidden border-b border-slate-800 bg-slate-900 text-white md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs">
          <button
            type="button"
            onClick={() => setLocationOpen((value) => !value)}
            className="flex items-center gap-1.5 font-medium text-white/90 transition hover:text-white"
          >
            <MapPin size={13} className="text-teal-400" />
            Deliver to: {selectedLocation}
            <ChevronDown size={13} />
          </button>
          <span className="font-medium text-emerald-400">Free home sample collection on orders above Rs. 499</span>
          <a href={`tel:${labSettings.contact}`} className="flex items-center gap-1.5 font-medium text-white/90 transition hover:text-white">
            <Phone size={13} />
            {labSettings.contact}
          </a>
        </div>
      </div>

      {/* Layer 2 — Main header */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 md:h-16 md:gap-4 md:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-600 text-white md:h-10 md:w-10">
              <Stethoscope size={20} />
            </span>
            <span className="hidden max-w-[160px] truncate text-base font-bold text-slate-900 sm:block md:max-w-[200px] md:text-lg">
              {labSettings.labName}
            </span>
          </Link>

          {/* Desktop: Location + Search */}
          <div className="relative hidden flex-1 lg:block lg:max-w-2xl">
            <form onSubmit={handleSearch} className="relative z-[120] flex h-11 items-stretch overflow-hidden rounded-full border border-slate-200 bg-slate-50">
              <div className="relative border-r border-slate-200">
                <button
                  type="button"
                  onClick={() => setLocationOpen((value) => !value)}
                  className="flex h-full items-center gap-1.5 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <MapPin size={15} className="text-teal-600" />
                  <span className="max-w-[100px] truncate">{selectedLocation.split(',')[0]}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                {locationOpen && (
                  <>
                    <button type="button" className="fixed inset-0 z-[110]" onClick={() => setLocationOpen(false)} aria-label="Close location" />
                    <div className="absolute left-0 top-[calc(100%+6px)] z-[130] min-w-[200px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                      {locations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => selectLocation(loc)}
                          className={`block w-full px-4 py-2.5 text-left text-sm transition hover:bg-slate-50 ${selectedLocation === loc ? 'font-bold text-teal-600' : 'text-slate-700'}`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex min-w-0 flex-1 items-center px-3">
                <Search size={18} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for tests, packages, or conditions..."
                  value={searchTerm}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </form>

            <AnimatePresence>
              {isSearchFocused && (
                <>
                  <button
                    type="button"
                    aria-label="Close search"
                    className="fixed inset-0 z-[105] bg-slate-900/20"
                    onClick={() => setIsSearchFocused(false)}
                  />
                  <Motion.div
                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-[130] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="border-b border-slate-100 p-4">
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-teal-600">Trending searches</p>
                      <div className="flex flex-wrap gap-2">
                        {quickSearches.map((item) => (
                          <button
                            type="button"
                            key={item}
                            onClick={() => setSearchTerm(item)}
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {searchTerm.trim() ? 'Search results' : 'Suggested results'}
                      </p>
                      <SearchResultsList
                        results={searchResults}
                        loading={searchLoading}
                        error={searchError}
                        onAdd={handleAddToCart}
                      />
                    </div>
                  </Motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setLocationOpen((value) => !value)}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 lg:hidden"
            >
              <MapPin size={16} className="text-teal-600" />
              <span className="max-w-[70px] truncate">{selectedLocation.split(',')[0]}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  navigate('/auth');
                  return;
                }
                setRxOpen(true);
              }}
              className="hidden items-center gap-1.5 rounded-lg border border-teal-600 px-3 py-2 text-sm font-semibold text-teal-600 transition hover:bg-teal-50 md:flex"
            >
              <FileUp size={16} />
              Upload Rx
            </button>

            <button
              type="button"
              onClick={openCart}
              className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-700 transition hover:bg-slate-100"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {cartItems.length}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/dashboard" className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200">
                  Patient Portal
                </Link>
                {(user?.role === 'DOCTOR' || user?.role === 'ADMIN') && (
                  <Link to="/doctor" className="rounded-lg bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-100">
                    Doctor Desk
                  </Link>
                )}
                {['LAB_STAFF', 'PATHOLOGIST', 'PHLEBOTOMIST', 'ADMIN'].includes(user?.role) && (
                  <Link to="/lab" className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100">
                    Lab Desk
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Admin Panel
                  </Link>
                )}
                <Link to="/dashboard" className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200">
                  {user?.name?.split(' ')[0] || 'Account'}
                </Link>
                <button type="button" onClick={onLogout} className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-red-500" aria-label="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden h-10 items-center gap-1.5 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 md:flex">
                <User size={16} />
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search — full width row below header */}
        <div className="px-4 pb-3 lg:hidden">
          <button
            type="button"
            onClick={() => onOpenSearch?.()}
            className="flex h-11 w-full items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 text-left"
          >
            <Search size={18} className="text-slate-400" />
            <span className="text-sm text-slate-400">Search tests, packages, conditions...</span>
          </button>
        </div>
      </div>

      {locationOpen && (
        <div className="border-b border-slate-100 bg-white px-4 py-2 lg:hidden">
          <div className="flex flex-wrap gap-2">
            {locations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => selectLocation(loc)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${selectedLocation === loc ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      )}
      <PrescriptionUploadDrawer isOpen={rxOpen} onClose={() => setRxOpen(false)} user={user} />
    </header>
  );
};

export default Navbar;
