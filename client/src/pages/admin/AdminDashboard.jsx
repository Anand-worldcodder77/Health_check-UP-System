import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Bell,
  CalendarClock,
  Cloud,
  CreditCard,
  Database,
  FileText,
  FlaskConical,
  LayoutDashboard,
  ListChecks,
  Loader2,
  LockKeyhole,
  LogOut,
  PackageSearch,
  PhoneCall,
  RefreshCw,
  Settings,
  ShieldCheck,
  UserCog,
  UserPlus,
  UsersRound,
} from 'lucide-react';

import BookingManager from '../../components/admin/BookingManager';
import CallbackLogs from '../../components/admin/CallbackLogs';
import DoctorVerification from '../../components/admin/DoctorVerification';
import LabSettings from '../../components/admin/LabSettings';
import AddPatient from '../../components/admin/AddPatientModal';
import CatalogManager from '../../components/admin/CatalogManager';
import { API_BASE } from '../../services/apiConfig';

const navItems = [
  { id: 'overview', label: 'Command Center', icon: LayoutDashboard, mobile: 'Home' },
  { id: 'bookings', label: 'Bookings Queue', icon: CalendarClock, mobile: 'Bookings' },
  { id: 'callbacks', label: 'Care Calls', icon: PhoneCall, mobile: 'Calls' },
  { id: 'add-patient', label: 'New Patient', icon: UserPlus, mobile: 'Patient' },
  { id: 'doctors', label: 'Doctor Verification', icon: UsersRound, mobile: 'Doctors' },
  { id: 'reports', label: 'Reports Center', icon: FlaskConical, mobile: 'Reports' },
  { id: 'patients', label: 'Patients & Users', icon: UserCog, mobile: 'Users' },
  { id: 'catalog', label: 'Catalog & Pricing', icon: PackageSearch, mobile: 'Catalog' },
  { id: 'slots', label: 'Slots & Pincodes', icon: ListChecks, mobile: 'Slots' },
  { id: 'payments', label: 'Billing & Payments', icon: CreditCard, mobile: 'Billing' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, mobile: 'Stats' },
  { id: 'security', label: 'Security & Audit', icon: LockKeyhole, mobile: 'Security' },
  { id: 'integrations', label: 'Integrations', icon: Cloud, mobile: 'Cloud' },
  { id: 'settings', label: 'Lab Settings', icon: Settings, mobile: 'Settings' },
];

const formatNumber = (value) => Number(value || 0).toLocaleString('en-IN');

const StatusPill = ({ ok, text }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
    {text}
  </span>
);

const WorkbenchPanel = ({ eyebrow, title, subtitle, cards = [], actions = [] }) => (
  <div className="p-5 md:p-8">
    <div className="mb-5">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#009494]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black text-slate-800">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">{subtitle}</p>
    </div>
    <div className="grid gap-4 xl:grid-cols-3">
      {cards.map(({ icon: Icon, label, value, text, status }) => (
        <div key={label} className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-50 text-[#009494]">
              <Icon size={20} />
            </div>
            {status}
          </div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{text}</p>
        </div>
      ))}
    </div>
    {actions.length > 0 && (
      <div className="mt-5 rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Controls</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => (
            <button key={action} type="button" className="cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left text-sm font-black text-slate-700 transition hover:border-[#009494]/30 hover:bg-teal-50 hover:text-[#009494]">
              {action}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [system, setSystem] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const activeItem = useMemo(() => navItems.find((item) => item.id === activeTab), [activeTab]);

  const loadAdminData = async () => {
    setLoadingOverview(true);
    try {
      const [overviewRes, systemRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/overview`),
        fetch(`${API_BASE}/api/admin/system`),
        fetch(`${API_BASE}/api/admin/users`),
      ]);
      const [overviewData, systemData, usersData] = await Promise.all([
        overviewRes.json(),
        systemRes.json(),
        usersRes.json(),
      ]);
      if (overviewRes.ok) setOverview(overviewData);
      if (systemRes.ok) setSystem(systemData);
      if (usersRes.ok) setUsers(Array.isArray(usersData.users) ? usersData.users : []);
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const metrics = overview?.metrics || {};
  const integrations = system?.integrations || {};

  const renderOverview = () => (
    <div className="p-5 md:p-8">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#009494]">Live command center</p>
          <h2 className="mt-2 text-3xl font-black text-slate-800">Operations overview</h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
            Bookings, callbacks, doctor onboarding, catalog, reports, users and integrations from your database.
          </p>
        </div>
        <button type="button" onClick={loadAdminData} className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-black uppercase tracking-[0.08em] text-slate-600 shadow-sm transition hover:bg-[#009494] hover:text-white">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loadingOverview ? (
        <div className="flex items-center justify-center gap-3 rounded-[24px] bg-white p-16 font-bold text-slate-400">
          <Loader2 className="animate-spin text-[#009494]" /> Loading admin metrics...
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Today bookings', metrics.todayBookings, CalendarClock, 'New bookings created today'],
              ['Pending ops', metrics.pendingBookings, ListChecks, 'Needs collection/report action'],
              ['Doctor reviews', metrics.doctorPending, UsersRound, 'Pending provider verification'],
              ['Callbacks', metrics.callbacksPending, PhoneCall, 'Unresolved patient calls'],
              ['Patients', metrics.patientCount, UserCog, 'Registered patient accounts'],
              ['Doctors', metrics.doctorCount, StethoscopeIcon, 'Approved doctor accounts'],
              ['Packages', metrics.packageCount, PackageSearch, 'Active packages'],
              ['Tests', metrics.testCount, FlaskConical, 'Active test catalog'],
            ].map(([label, value, Icon, text]) => (
              <button key={label} type="button" onClick={() => {
                if (label.includes('Doctor')) setActiveTab('doctors');
                else if (label.includes('Callback')) setActiveTab('callbacks');
                else if (label.includes('Package') || label.includes('Tests')) setActiveTab('catalog');
                else if (label.includes('Patient')) setActiveTab('patients');
                else setActiveTab('bookings');
              }} className="cursor-pointer rounded-[24px] border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <Icon className="text-[#009494]" size={22} />
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{formatNumber(value)}</p>
                <p className="mt-2 text-sm font-bold text-slate-500">{text}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Recent bookings</p>
              <div className="mt-4 space-y-3">
                {(overview?.recentBookings || []).slice(0, 5).map((booking) => (
                  <button key={booking._id} onClick={() => setActiveTab('bookings')} className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-teal-50">
                    <div>
                      <p className="text-sm font-black text-slate-800">{booking.userName || 'Patient'}</p>
                      <p className="text-xs font-bold text-slate-400">{booking.selectedPackage || booking.bookingId}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-slate-500">{booking.status}</span>
                  </button>
                ))}
                {!overview?.recentBookings?.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-400">No bookings yet.</p>}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Provider onboarding</p>
              <div className="mt-4 space-y-3">
                {(overview?.recentApplications || []).slice(0, 5).map((application) => (
                  <button key={application._id} onClick={() => setActiveTab('doctors')} className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-teal-50">
                    <div>
                      <p className="text-sm font-black text-slate-800">{application.fullName}</p>
                      <p className="text-xs font-bold text-slate-400">{application.specialization} | {application.medicalRegistrationNumber}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-slate-500">{application.status}</span>
                  </button>
                ))}
                {!overview?.recentApplications?.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-400">No doctor applications yet.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="p-5 md:p-8">
      <div className="mb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#009494]">Identity management</p>
        <h2 className="mt-2 text-3xl font-black text-slate-800">Patients, doctors and staff</h2>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          Staff accounts are not public. Admin controls users, roles and verified access from here.
        </p>
      </div>
      <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left">
            <thead className="bg-slate-50">
              <tr>
                {['Name', 'Email', 'Phone', 'Role', 'Created'].map((head) => (
                  <th key={head} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-sm font-black text-slate-800">{item.name || 'Unnamed'}</td>
                  <td className="px-5 py-4 text-xs font-bold text-slate-500">{item.email || '-'}</td>
                  <td className="px-5 py-4 text-xs font-bold text-slate-500">{item.phone || '-'}</td>
                  <td className="px-5 py-4"><span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-black text-[#009494]">{item.role}</span></td>
                  <td className="px-5 py-4 text-xs font-bold text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!users.length && <div className="p-12 text-center text-sm font-bold text-slate-400">No users found.</div>}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'bookings':
        return <BookingManager />;
      case 'callbacks':
        return <CallbackLogs />;
      case 'add-patient':
        return (
          <div className="p-5 md:p-8">
            <div className="mb-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#009494]">Assisted booking</p>
              <h2 className="mt-2 text-3xl font-black text-slate-800">Add patient from reception</h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">Create walk-in, phone, or assisted bookings without leaving the admin workspace.</p>
            </div>
            <AddPatient mode="inline" isAdmin onSuccess={() => setActiveTab('bookings')} />
          </div>
        );
      case 'doctors':
        return <DoctorVerification />;
      case 'patients':
        return renderUsers();
      case 'reports':
        return (
          <WorkbenchPanel
            eyebrow="Lab report operations"
            title="Reports center"
            subtitle="Upload, review, notify and track lab reports. Report upload is connected from each booking row when a booking exists."
            cards={[
              { icon: FileText, label: 'Reports ready', value: formatNumber(metrics.reportReady), text: 'Bookings with uploaded/ready reports' },
              { icon: FlaskConical, label: 'Lab workflow', value: formatNumber(metrics.pendingBookings), text: 'Samples or bookings needing operational progress' },
              { icon: Bell, label: 'Notifications', value: integrations.email?.configured ? 'Email on' : 'Email off', text: 'Patient report emails require email env configuration', status: <StatusPill ok={integrations.email?.configured} text={integrations.email?.configured ? 'Configured' : 'Missing'} /> },
            ]}
            actions={['Open booking queue', 'Upload report from booking', 'Notify patient', 'Track pending reports']}
          />
        );
      case 'catalog':
        return <CatalogManager />;
      case 'slots':
        return (
          <WorkbenchPanel
            eyebrow="Collection capacity"
            title="Slots and pincode coverage"
            subtitle="Manage home sample collection capacity, city coverage, pincode availability and slot load."
            cards={[
              { icon: ListChecks, label: 'Slots configured', value: formatNumber(metrics.slotCount), text: 'Active collection slots in database' },
              { icon: CalendarClock, label: 'Today bookings', value: formatNumber(metrics.todayBookings), text: 'Demand for current day' },
              { icon: Database, label: 'Pending ops', value: formatNumber(metrics.pendingBookings), text: 'Bookings waiting for next step' },
            ]}
            actions={['Add slot capacity', 'Block pincode', 'Assign phlebotomist', 'View collection route']}
          />
        );
      case 'payments':
        return (
          <WorkbenchPanel
            eyebrow="Revenue desk"
            title="Billing and payments"
            subtitle="Track paid, cash-on-collection, refunds and booking revenue controls."
            cards={[
              { icon: CreditCard, label: 'Bookings', value: formatNumber(metrics.bookingCount), text: 'Total booking records' },
              { icon: CalendarClock, label: 'Today queue', value: formatNumber(metrics.todayBookings), text: 'Potential same-day revenue' },
              { icon: FileText, label: 'Reports ready', value: formatNumber(metrics.reportReady), text: 'Orders near completion' },
            ]}
            actions={['Review payments', 'Mark cash collected', 'Process refund', 'Export billing CSV']}
          />
        );
      case 'analytics':
        return (
          <WorkbenchPanel
            eyebrow="Business intelligence"
            title="Analytics"
            subtitle="Monitor demand, provider onboarding, callbacks, report readiness and service catalog health."
            cards={[
              { icon: BarChart3, label: 'Total bookings', value: formatNumber(metrics.bookingCount), text: 'All-time order volume' },
              { icon: PhoneCall, label: 'Callback load', value: formatNumber(metrics.callbacksPending), text: 'Open patient support demand' },
              { icon: UsersRound, label: 'Doctor approvals', value: formatNumber(metrics.doctorApproved), text: 'Verified doctors created' },
            ]}
            actions={['Daily performance', 'Package demand', 'City report', 'Conversion funnel']}
          />
        );
      case 'security':
        return (
          <WorkbenchPanel
            eyebrow="Security operations"
            title="Security and audit"
            subtitle="Control staff access, protect secrets, keep public staff signup blocked and monitor account creation."
            cards={[
              { icon: LockKeyhole, label: 'Staff signup', value: 'Blocked', text: 'Doctor/Admin accounts are internal or admin-approved only', status: <StatusPill ok text="Secure" /> },
              { icon: UsersRound, label: 'Users', value: formatNumber(system?.counts?.users), text: 'Accounts in database' },
              { icon: Database, label: 'Database', value: integrations.database?.configured ? 'Connected' : 'Missing', text: 'MongoDB connection env status', status: <StatusPill ok={integrations.database?.configured} text={integrations.database?.configured ? 'Ready' : 'Missing'} /> },
            ]}
            actions={['Review users', 'Create staff from server script', 'Rotate passwords', 'Audit access']}
          />
        );
      case 'integrations':
        return (
          <WorkbenchPanel
            eyebrow="System integrations"
            title="Cloudinary, email and database"
            subtitle="Document upload uses backend Cloudinary credentials. The browser never receives your API secret."
            cards={[
              { icon: Cloud, label: 'Cloudinary', value: integrations.cloudinary?.cloudName || 'Not set', text: 'Doctor documents upload through /api/uploads/doctor-documents', status: <StatusPill ok={integrations.cloudinary?.configured} text={integrations.cloudinary?.configured ? 'Configured' : 'Missing'} /> },
              { icon: Bell, label: 'Email', value: integrations.email?.configured ? 'Enabled' : 'Disabled', text: 'Doctor approval emails and report notifications', status: <StatusPill ok={integrations.email?.configured} text={integrations.email?.configured ? 'Ready' : 'Missing'} /> },
              { icon: Database, label: 'MongoDB', value: integrations.database?.configured ? 'Ready' : 'Missing', text: 'Primary database configuration', status: <StatusPill ok={integrations.database?.configured} text={integrations.database?.configured ? 'Ready' : 'Missing'} /> },
            ]}
            actions={['Test doctor application upload', 'Check server env', 'Restart backend after env change', 'Review Cloudinary folder']}
          />
        );
      case 'settings':
        return <LabSettings />;
      default:
        return <BookingManager />;
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex h-screen w-full overflow-hidden bg-slate-50">
      <aside className="hidden w-72 flex-col border-r border-slate-100 bg-white p-5 shadow-xl lg:flex">
        <div className="mb-8 flex items-center gap-3 rounded-[22px] bg-slate-950 p-4 text-white">
          <div className="rounded-2xl bg-[#009494] p-2.5">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight">HealthOps Pro</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">Admin command</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-xs font-black uppercase tracking-[0.08em] transition ${
                  active ? 'bg-[#009494] text-white shadow-lg shadow-teal-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button type="button" onClick={onLogout} className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-rose-500 transition hover:bg-rose-50">
          <LogOut size={17} /> Logout
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-20 items-center justify-between border-b border-slate-100 bg-white/90 px-5 backdrop-blur md:px-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Admin panel</p>
            <h2 className="mt-1 text-xl font-black text-slate-800 md:text-2xl">{activeItem?.label || 'Dashboard'}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={loadAdminData} className="grid h-10 w-10 cursor-pointer place-items-center rounded-2xl bg-slate-50 text-slate-500 transition hover:bg-[#009494] hover:text-white">
              <RefreshCw size={18} />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-black uppercase tracking-widest text-slate-800">Administrator</p>
              <p className="text-[10px] font-bold text-slate-400">Operations access</p>
            </div>
          </div>
        </header>

        <div className="border-b border-slate-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-black ${activeTab === item.id ? 'bg-[#009494] text-white' : 'bg-slate-100 text-slate-500'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto pb-24 lg:pb-0">
          {renderContent()}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-[650] border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_30px_rgba(15,23,42,0.06)] lg:hidden">
        <div className="grid grid-cols-5 px-1 pt-1">
          {navItems.filter((item) => ['overview', 'bookings', 'callbacks', 'doctors', 'settings'].includes(item.id)).map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className="relative flex cursor-pointer flex-col items-center gap-0.5 py-2">
                <span className={`grid h-9 w-9 place-items-center rounded-full ${active ? 'bg-teal-50 text-[#009494]' : 'text-slate-400'}`}>
                  <Icon size={20} />
                </span>
                <span className={`text-[10px] font-semibold ${active ? 'text-[#009494]' : 'text-slate-500'}`}>{item.mobile}</span>
                {active && <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-[#009494]" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

function StethoscopeIcon(props) {
  return <UsersRound {...props} />;
}

export default AdminDashboard;
