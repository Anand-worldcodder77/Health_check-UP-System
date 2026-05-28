import React, { useState } from 'react';
import { FlaskConical, LogOut, PackageSearch } from 'lucide-react';
import BookingManager from './admin/BookingManager';
import CatalogManager from './admin/CatalogManager';

const LabDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
  <div className="min-h-screen bg-[#f8fafc]">
    <aside className="fixed left-0 top-0 z-20 hidden h-full w-72 flex-col border-r border-slate-100 bg-white p-6 lg:flex">
      <div className="mb-8 flex items-center gap-3 rounded-[22px] bg-[#009494] p-4 text-white">
        <FlaskConical size={24} />
        <div>
          <h2 className="text-base font-black">Lab Desk</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">Diagnostics workflow</p>
        </div>
      </div>

      <nav className="mb-5 space-y-2">
        {[
          { id: 'orders', label: 'Orders & Reports', icon: FlaskConical },
          { id: 'catalog', label: 'Catalog & Pricing', icon: PackageSearch },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.08em] transition ${
                activeTab === item.id ? 'bg-[#009494] text-white' : 'bg-slate-50 text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon size={17} /> {item.label}
            </button>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Signed in</p>
        <p className="mt-2 text-sm font-black text-slate-900">{user?.name || 'Lab staff'}</p>
        <p className="mt-1 text-xs font-bold text-slate-500">{user?.email || user?.phone || 'Operations access'}</p>
      </div>

      <div className="mt-6 space-y-3 text-xs font-bold leading-5 text-slate-500">
        {activeTab === 'orders' ? (
          <>
            <p>1. Confirm booking and collection slot.</p>
            <p>2. Move sample through collected and in-lab status.</p>
            <p>3. Upload final signed PDF report.</p>
            <p>4. Patient and doctor dashboards receive report access.</p>
          </>
        ) : (
          <>
            <p>1. Add tests and packages.</p>
            <p>2. Control MRP, offer price and discount.</p>
            <p>3. Publish or hide services by availability.</p>
            <p>4. Admin can review the same live catalog.</p>
          </>
        )}
      </div>

      <button onClick={onLogout} className="mt-auto flex items-center gap-4 rounded-2xl px-5 py-4 text-[11px] font-black uppercase tracking-widest text-rose-500 transition hover:bg-rose-50">
        <LogOut size={18} /> Sign out
      </button>
    </aside>

    <main className="lg:ml-72">
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 px-5 py-4 backdrop-blur lg:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Lab staff portal</p>
        <h1 className="mt-1 text-xl font-black text-slate-800">{activeTab === 'orders' ? 'Orders, samples and reports' : 'Catalog and pricing'}</h1>
      </header>
      {activeTab === 'orders' ? <BookingManager scope="lab" /> : <CatalogManager />}
    </main>
  </div>
  );
};

export default LabDashboard;
