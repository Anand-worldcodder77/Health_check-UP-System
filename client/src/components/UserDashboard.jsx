import React, { useState } from 'react';
import { CalendarCheck, FileText, HeartPulse, Home, LogOut, Settings, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserProfile from './dashboard/UserProfile';
import MyBookings from './dashboard/MyBookings';
import MyReports from './dashboard/MyReports';

const UserDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HeartPulse },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    if (activeTab === 'bookings') return <MyBookings user={user} />;
    if (activeTab === 'profile' || activeTab === 'settings') return <UserProfile user={user} />;
    if (activeTab === 'reports') return <MyReports user={user} onGoToBookings={() => setActiveTab('bookings')} />;

    return (
      <div className="p-5 md:p-8">
        <section className="rounded-[28px] bg-slate-950 p-6 text-white">
          <p className="text-sm font-bold text-white/60">Namaste, {user?.name || 'Patient'}</p>
          <h1 className="mt-2 text-3xl font-black leading-tight">Your health workspace is ready.</h1>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              ['Upcoming bookings', 'Track home sample visits'],
              ['Reports', 'Download completed PDFs'],
              ['Family profiles', 'Manage patient details'],
            ].map(([title, text]) => (
              <button key={title} onClick={() => setActiveTab(title === 'Reports' ? 'reports' : title === 'Upcoming bookings' ? 'bookings' : 'profile')} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left">
                <p className="text-sm font-black">{title}</p>
                <p className="mt-1 text-xs font-semibold text-white/60">{text}</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <aside className="fixed left-0 top-0 z-20 hidden h-full w-72 flex-col border-r border-slate-100 bg-white p-6 lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-3 rounded-[22px] bg-[#009494] p-4 text-white">
          <Home size={22} />
          <div>
            <h2 className="text-base font-black">Patient Portal</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">HealthChecks</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest transition ${
                  active ? 'bg-[#009494] text-white shadow-lg shadow-teal-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} /> {tab.label}
              </button>
            );
          })}
        </nav>

        <button onClick={onLogout} className="mt-6 flex items-center gap-4 rounded-2xl px-5 py-4 text-[11px] font-black uppercase tracking-widest text-rose-500 transition hover:bg-rose-50">
          <LogOut size={18} /> Sign out
        </button>
      </aside>

      <main className="pb-24 lg:ml-72 lg:pb-0">
        <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 px-5 py-4 backdrop-blur lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Patient portal</p>
          <h1 className="mt-1 text-xl font-black text-slate-800">{tabs.find((tab) => tab.id === activeTab)?.label}</h1>
        </header>
        {renderContent()}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-[650] border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_30px_rgba(15,23,42,0.06)] lg:hidden">
        <div className="grid grid-cols-5 px-1 pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className="relative flex flex-col items-center gap-0.5 py-2">
                <span className={`grid h-9 w-9 place-items-center rounded-full ${active ? 'bg-teal-50 text-[#009494]' : 'text-slate-400'}`}>
                  <Icon size={20} />
                </span>
                <span className={`text-[10px] font-semibold ${active ? 'text-[#009494]' : 'text-slate-500'}`}>{tab.label}</span>
                {active && <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-[#009494]" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default UserDashboard;
