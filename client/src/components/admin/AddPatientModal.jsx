import React, { useState } from 'react';
import { Activity, MapPin, Package, Phone, User, Users, X } from 'lucide-react';
import { API_BASE } from '../../services/apiConfig';

const emptyForm = {
  userName: '',
  userEmail: '',
  userPhone: '',
  selectedPackage: '',
  age: '',
  gender: 'Male',
  address: '',
};

const AddPatientModal = ({ isOpen = true, onClose = () => {}, onSuccess = () => {}, isAdmin = false, mode = 'modal' }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const updateField = (field, value) => {
    setMessage('');
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/bookings/manual-add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Patient add failed');

      setFormData(emptyForm);
      setMessage('Patient entry created successfully.');
      onSuccess(data);
      if (mode !== 'inline') onClose();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const panel = (
    <div className={`w-full overflow-hidden border border-slate-100 bg-white ${mode === 'inline' ? 'rounded-[28px] shadow-sm' : 'max-w-2xl rounded-[32px] shadow-2xl animate-in zoom-in duration-300'}`}>
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 p-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#009494]">Reception entry</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-800">
            {isAdmin ? 'New Patient Entry' : 'Book Test'}
          </h2>
        </div>
        {mode !== 'inline' && (
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100">
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
        {message && (
          <div className={`rounded-xl px-4 py-3 text-sm font-bold md:col-span-2 ${message.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {message}
          </div>
        )}

        <div className="space-y-1">
          <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Patient Name</label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-slate-300" size={16} />
            <input required value={formData.userName} type="text" placeholder="Name" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#009494]" onChange={(e) => updateField('userName', e.target.value)} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</label>
          <div className="relative">
            <Phone className="absolute left-4 top-3.5 text-slate-300" size={16} />
            <input required value={formData.userPhone} type="tel" placeholder="Phone" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#009494]" onChange={(e) => updateField('userPhone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Age</label>
          <div className="relative">
            <Activity className="absolute left-4 top-3.5 text-slate-300" size={16} />
            <input required value={formData.age} type="number" placeholder="Age" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#009494]" onChange={(e) => updateField('age', e.target.value)} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Gender</label>
          <div className="relative">
            <Users className="absolute left-4 top-3.5 text-slate-300" size={16} />
            <select value={formData.gender} className="w-full appearance-none rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#009494]" onChange={(e) => updateField('gender', e.target.value)}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Test Package</label>
          <div className="relative">
            <Package className="absolute left-4 top-3.5 text-slate-300" size={16} />
            <input required value={formData.selectedPackage} type="text" placeholder="Package Name" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#009494]" onChange={(e) => updateField('selectedPackage', e.target.value)} />
          </div>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Address</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 text-slate-300" size={16} />
            <textarea required value={formData.address} rows="3" placeholder="Address" className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#009494]" onChange={(e) => updateField('address', e.target.value)} />
          </div>
        </div>

        <div className="flex gap-4 pt-2 md:col-span-2">
          {mode !== 'inline' && <button type="button" onClick={onClose} className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Cancel</button>}
          <button disabled={saving} type="submit" className="flex-1 rounded-2xl bg-[#009494] py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-teal-100 transition hover:bg-slate-950 disabled:cursor-wait disabled:opacity-60">
            {saving ? 'Saving...' : 'Confirm & Add'}
          </button>
        </div>
      </form>
    </div>
  );

  if (mode === 'inline') return panel;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      {panel}
    </div>
  );
};

export default AddPatientModal;
