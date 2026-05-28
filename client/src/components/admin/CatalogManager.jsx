import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, FlaskConical, Loader2, PackagePlus, RefreshCw, Save, Search } from 'lucide-react';
import { API_BASE } from '../../services/apiConfig';

const emptyTest = {
  name: '',
  code: '',
  category: '',
  sampleType: 'Blood',
  price: '',
  mrp: '',
  discountPercent: '',
  turnaroundTime: 24,
  isActive: true,
};

const emptyPackage = {
  title: '',
  category: '',
  shortDescription: '',
  price: '',
  discountedPrice: '',
  testCount: '',
  reportTimeHours: 24,
  availablePincodes: '',
  isBestSeller: false,
  isActive: true,
};

const numberOrZero = (value) => Number(value || 0);

const CatalogManager = () => {
  const [activeTab, setActiveTab] = useState('packages');
  const [packages, setPackages] = useState([]);
  const [tests, setTests] = useState([]);
  const [packageForm, setPackageForm] = useState(emptyPackage);
  const [testForm, setTestForm] = useState(emptyTest);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadCatalog = async () => {
    setLoading(true);
    setMessage('');
    try {
      const [packageRes, testRes] = await Promise.all([
        fetch(`${API_BASE}/api/catalog/packages?includeInactive=true`),
        fetch(`${API_BASE}/api/catalog/tests?includeInactive=true`),
      ]);
      const [packageJson, testJson] = await Promise.all([packageRes.json(), testRes.json()]);
      if (!packageRes.ok) throw new Error(packageJson.error || 'Packages load failed');
      if (!testRes.ok) throw new Error(testJson.error || 'Tests load failed');
      setPackages(packageJson.data || []);
      setTests(testJson.data || []);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const filteredItems = useMemo(() => {
    const list = activeTab === 'packages' ? packages : tests;
    const search = query.trim().toLowerCase();
    if (!search) return list;
    return list.filter((item) => (
      `${item.title || item.name} ${item.code || ''} ${item.category || ''}`.toLowerCase().includes(search)
    ));
  }, [activeTab, packages, query, tests]);

  const saveTest = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        ...testForm,
        price: numberOrZero(testForm.price),
        mrp: numberOrZero(testForm.mrp),
        discountPercent: numberOrZero(testForm.discountPercent),
        turnaroundTime: numberOrZero(testForm.turnaroundTime),
      };
      const response = await fetch(`${API_BASE}/api/catalog/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Test save failed');
      setTests((current) => [data.data, ...current]);
      setTestForm(emptyTest);
      setMessage('Test added to live catalog.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const savePackage = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        ...packageForm,
        price: numberOrZero(packageForm.price),
        discountedPrice: numberOrZero(packageForm.discountedPrice),
        testCount: numberOrZero(packageForm.testCount),
        reportTimeHours: numberOrZero(packageForm.reportTimeHours),
        availablePincodes: packageForm.availablePincodes.split(',').map((item) => item.trim()).filter(Boolean),
      };
      const response = await fetch(`${API_BASE}/api/catalog/packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Package save failed');
      setPackages((current) => [data.data, ...current]);
      setPackageForm(emptyPackage);
      setMessage('Package added to live catalog.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (type, item, updates) => {
    setMessage('');
    try {
      const endpoint = type === 'package' ? 'packages' : 'tests';
      const response = await fetch(`${API_BASE}/api/catalog/${endpoint}/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || 'Update failed');
      if (type === 'package') {
        setPackages((current) => current.map((entry) => entry._id === item._id ? data.data : entry));
      } else {
        setTests((current) => current.map((entry) => entry._id === item._id ? data.data : entry));
      }
      setMessage('Catalog updated.');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="p-5 md:p-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Catalog control</p>
          <h2 className="mt-2 text-3xl font-black text-slate-800">Tests, packages, price and discount</h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
            Premium platforms keep this under Admin/Lab control: tests, package pricing, discount, report timing, active status and pincode availability.
          </p>
        </div>
        <button onClick={loadCatalog} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-black uppercase tracking-[0.08em] text-slate-600 shadow-sm transition hover:bg-[#009494] hover:text-white">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        {[
          ['Active packages', packages.filter((item) => item.isActive).length, PackagePlus],
          ['Inactive packages', packages.filter((item) => !item.isActive).length, PackagePlus],
          ['Active tests', tests.filter((item) => item.isActive).length, FlaskConical],
          ['Inactive tests', tests.filter((item) => !item.isActive).length, FlaskConical],
        ].map(([label, value, Icon]) => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <Icon className="text-[#009494]" size={20} />
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {message && (
        <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
          {message}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button onClick={() => setActiveTab('packages')} className={`rounded-xl px-4 py-3 text-xs font-black uppercase tracking-[0.08em] ${activeTab === 'packages' ? 'bg-[#009494] text-white' : 'bg-slate-50 text-slate-500'}`}>Package</button>
            <button onClick={() => setActiveTab('tests')} className={`rounded-xl px-4 py-3 text-xs font-black uppercase tracking-[0.08em] ${activeTab === 'tests' ? 'bg-[#009494] text-white' : 'bg-slate-50 text-slate-500'}`}>Test</button>
          </div>

          {activeTab === 'packages' ? (
            <form onSubmit={savePackage} className="space-y-3">
              <input required value={packageForm.title} onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })} placeholder="Package title" className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={packageForm.category} onChange={(e) => setPackageForm({ ...packageForm, category: e.target.value })} placeholder="Category e.g. Pregnancy" className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <textarea value={packageForm.shortDescription} onChange={(e) => setPackageForm({ ...packageForm, shortDescription: e.target.value })} placeholder="Short description" className="min-h-20 w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <div className="grid grid-cols-2 gap-3">
                <input required value={packageForm.price} onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value.replace(/\D/g, '') })} placeholder="MRP" className="h-11 rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
                <input required value={packageForm.discountedPrice} onChange={(e) => setPackageForm({ ...packageForm, discountedPrice: e.target.value.replace(/\D/g, '') })} placeholder="Offer price" className="h-11 rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
                <input value={packageForm.testCount} onChange={(e) => setPackageForm({ ...packageForm, testCount: e.target.value.replace(/\D/g, '') })} placeholder="Test count" className="h-11 rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
                <input value={packageForm.reportTimeHours} onChange={(e) => setPackageForm({ ...packageForm, reportTimeHours: e.target.value.replace(/\D/g, '') })} placeholder="Report hours" className="h-11 rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              </div>
              <input value={packageForm.availablePincodes} onChange={(e) => setPackageForm({ ...packageForm, availablePincodes: e.target.value })} placeholder="Pincodes comma separated, blank = all" className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <button disabled={saving} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#009494] text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-slate-950 disabled:bg-slate-300">
                <Save size={16} /> {saving ? 'Saving...' : 'Create package'}
              </button>
            </form>
          ) : (
            <form onSubmit={saveTest} className="space-y-3">
              <input required value={testForm.name} onChange={(e) => setTestForm({ ...testForm, name: e.target.value })} placeholder="Test name" className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input required value={testForm.code} onChange={(e) => setTestForm({ ...testForm, code: e.target.value.toUpperCase().replace(/\s/g, '') })} placeholder="Code e.g. CBC" className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={testForm.category} onChange={(e) => setTestForm({ ...testForm, category: e.target.value })} placeholder="Category" className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={testForm.sampleType} onChange={(e) => setTestForm({ ...testForm, sampleType: e.target.value })} placeholder="Sample type" className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <div className="grid grid-cols-2 gap-3">
                <input value={testForm.mrp} onChange={(e) => setTestForm({ ...testForm, mrp: e.target.value.replace(/\D/g, '') })} placeholder="MRP" className="h-11 rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
                <input value={testForm.price} onChange={(e) => setTestForm({ ...testForm, price: e.target.value.replace(/\D/g, '') })} placeholder="Offer price" className="h-11 rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
                <input value={testForm.discountPercent} onChange={(e) => setTestForm({ ...testForm, discountPercent: e.target.value.replace(/\D/g, '') })} placeholder="Discount %" className="h-11 rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
                <input value={testForm.turnaroundTime} onChange={(e) => setTestForm({ ...testForm, turnaroundTime: e.target.value.replace(/\D/g, '') })} placeholder="Report hours" className="h-11 rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              </div>
              <button disabled={saving} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#009494] text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-slate-950 disabled:bg-slate-300">
                <Save size={16} /> {saving ? 'Saving...' : 'Create test'}
              </button>
            </form>
          )}
        </div>

        <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={17} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search catalog..." className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 pl-11 pr-4 text-sm font-bold outline-none focus:border-[#009494] md:w-80" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">{filteredItems.length} items</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-16 text-sm font-bold text-slate-400"><Loader2 className="animate-spin" /> Loading catalog...</div>
          ) : (
            <div className="grid gap-3">
              {filteredItems.map((item) => {
                const isPackage = activeTab === 'packages';
                const mrp = isPackage ? item.price : item.mrp;
                const offer = isPackage ? item.discountedPrice : item.price;
                const discount = mrp && offer ? Math.round(((mrp - offer) / mrp) * 100) : item.discountPercent;
                return (
                  <article key={item._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black text-slate-900">{item.title || item.name}</h3>
                          {item.isActive ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-black text-emerald-700">LIVE</span> : <span className="rounded-full bg-slate-200 px-3 py-1 text-[9px] font-black text-slate-500">HIDDEN</span>}
                          {item.isBestSeller && <span className="rounded-full bg-amber-50 px-3 py-1 text-[9px] font-black text-amber-700">BESTSELLER</span>}
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-500">{item.category || 'No category'} | Report {item.reportTimeHours || item.turnaroundTime || 24} hrs</p>
                        <p className="mt-2 text-sm font-black text-slate-900">Rs. {offer || 0} <span className="text-xs font-bold text-slate-400 line-through">Rs. {mrp || 0}</span> <span className="text-emerald-600">{discount || 0}% off</span></p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => updateItem(isPackage ? 'package' : 'test', item, { isActive: !item.isActive })} className="rounded-xl bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-slate-700 transition hover:bg-[#009494] hover:text-white">
                          {item.isActive ? 'Hide' : 'Publish'}
                        </button>
                        {isPackage && (
                          <button onClick={() => updateItem('package', item, { isBestSeller: !item.isBestSeller })} className="rounded-xl bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-amber-700 transition hover:bg-amber-500 hover:text-white">
                            Bestseller
                          </button>
                        )}
                        <button onClick={() => {
                          const nextPrice = window.prompt('New offer price', offer || '');
                          if (nextPrice) updateItem(isPackage ? 'package' : 'test', item, isPackage ? { discountedPrice: Number(nextPrice) } : { price: Number(nextPrice) });
                        }} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#009494]">
                          <CheckCircle2 size={14} /> Update price
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogManager;
