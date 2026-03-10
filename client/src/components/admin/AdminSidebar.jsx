import React from 'react';
import { LayoutDashboard, ClipboardList, PhoneCall, Users, Settings, LogOut } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menu = [
    { id: 'overview', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'bookings', name: 'Manage Bookings', icon: <ClipboardList size={20} /> },
    { id: 'callbacks', name: 'Call Requests', icon: <PhoneCall size={20} /> },
    { id: 'users', name: 'Patient Records', icon: <Users size={20} /> },
    { id: 'settings', name: 'Lab Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-8 border-b border-slate-800">
        <h2 className="text-xl font-black tracking-tighter text-[#009494]">
          Admin<span className="text-white">Panel</span>
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
              activeTab === item.id 
              ? 'bg-[#009494] text-white shadow-lg shadow-teal-900/50' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon} {item.name}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all font-bold text-sm"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;