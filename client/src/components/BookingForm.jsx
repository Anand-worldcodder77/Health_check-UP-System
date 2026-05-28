import React, { useState } from 'react';
import { CalendarDays, CheckCircle2, Clock, MapPin, Phone, User } from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

const BookingForm = ({ packageName, onClose }) => {
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: 'Male',
    address: '',
    city: '',
    pincode: '',
    preferredDate: new Date().toISOString().slice(0, 10),
    preferredTime: '08:00 AM - 10:00 AM',
  });

  const updateField = (field, value) => {
    setError('');
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Patient name is required.';
    if (!/^\d{10}$/.test(formData.phone)) return 'Valid 10 digit mobile number is required.';
    if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) return 'Valid email address is required.';
    if (!formData.age || Number(formData.age) <= 0) return 'Valid age is required.';
    if (!formData.address.trim()) return 'Complete address is required.';
    if (!formData.city.trim()) return 'City is required.';
    if (!/^\d{6}$/.test(formData.pincode)) return 'Valid 6 digit pincode is required.';
    if (!formData.preferredDate) return 'Preferred date is required.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      userName: formData.name.trim(),
      userEmail: formData.email.trim(),
      userPhone: formData.phone,
      selectedPackage: packageName || 'Health Package',
      age: Number(formData.age),
      gender: formData.gender,
      address: `${formData.address.trim()}, ${formData.city.trim()} - ${formData.pincode}`,
      status: 'Confirmed',
      bookingDate: new Date(formData.preferredDate),
      slot: {
        date: new Date(formData.preferredDate),
        timeWindow: formData.preferredTime,
      },
      collectionAddress: {
        tag: 'Home',
        fullAddress: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode,
      },
      patients: [{
        patientName: formData.name.trim(),
        age: Number(formData.age),
        gender: formData.gender,
      }],
    };

    try {
      const response = await fetch(`${API_BASE}/api/bookings/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Booking failed');
      setSubmitted(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <CheckCircle2 size={54} className="mx-auto mb-4 text-emerald-500" />
        <h2 className="text-xl font-black text-[var(--hc-text)]">Booking Confirmed</h2>
        <p className="mt-2 text-sm font-semibold text-[var(--hc-muted)]">
          Booking ID: {submitted.bookingId || submitted._id}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-[var(--hc-brand)] py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--hc-brand-text)]"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--hc-accent)]">Home collection</p>
      <h2 className="mt-1 text-2xl font-black text-[var(--hc-text)]">Book checkup</h2>
      <p className="mb-6 mt-2 text-sm font-semibold text-[var(--hc-muted)]">{packageName || 'Health Package'}</p>

      {error && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.12em] text-[var(--hc-muted)]">Patient name *</span>
          <div className="flex items-center rounded-lg border border-[var(--hc-border)] bg-[var(--hc-soft)] px-4 focus-within:border-[var(--hc-accent)]">
            <User size={17} className="text-[var(--hc-muted)]" />
            <input value={formData.name} onChange={(e) => updateField('name', e.target.value)} className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm font-bold outline-none" />
          </div>
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.12em] text-[var(--hc-muted)]">Mobile *</span>
          <div className="flex items-center rounded-lg border border-[var(--hc-border)] bg-[var(--hc-soft)] px-4 focus-within:border-[var(--hc-accent)]">
            <Phone size={17} className="text-[var(--hc-muted)]" />
            <input value={formData.phone} maxLength={10} onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))} className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm font-bold outline-none" />
          </div>
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.12em] text-[var(--hc-muted)]">Email</span>
          <input value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full rounded-lg border border-[var(--hc-border)] bg-[var(--hc-soft)] px-4 py-3.5 text-sm font-bold outline-none focus:border-[var(--hc-accent)]" />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.12em] text-[var(--hc-muted)]">Age *</span>
          <input value={formData.age} onChange={(e) => updateField('age', e.target.value.replace(/\D/g, ''))} className="w-full rounded-lg border border-[var(--hc-border)] bg-[var(--hc-soft)] px-4 py-3.5 text-sm font-bold outline-none focus:border-[var(--hc-accent)]" />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.12em] text-[var(--hc-muted)]">Gender *</span>
          <select value={formData.gender} onChange={(e) => updateField('gender', e.target.value)} className="w-full rounded-lg border border-[var(--hc-border)] bg-[var(--hc-soft)] px-4 py-3.5 text-sm font-bold outline-none focus:border-[var(--hc-accent)]">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.12em] text-[var(--hc-muted)]">Address *</span>
          <div className="flex items-start rounded-lg border border-[var(--hc-border)] bg-[var(--hc-soft)] px-4 focus-within:border-[var(--hc-accent)]">
            <MapPin size={17} className="mt-4 text-[var(--hc-muted)]" />
            <textarea value={formData.address} onChange={(e) => updateField('address', e.target.value)} className="min-h-20 min-w-0 flex-1 resize-none bg-transparent px-3 py-3.5 text-sm font-bold outline-none" />
          </div>
        </label>

        <input value={formData.city} onChange={(e) => updateField('city', e.target.value)} placeholder="City *" className="rounded-lg border border-[var(--hc-border)] bg-[var(--hc-soft)] px-4 py-3.5 text-sm font-bold outline-none focus:border-[var(--hc-accent)]" />
        <input value={formData.pincode} maxLength={6} onChange={(e) => updateField('pincode', e.target.value.replace(/\D/g, ''))} placeholder="Pincode *" className="rounded-lg border border-[var(--hc-border)] bg-[var(--hc-soft)] px-4 py-3.5 text-sm font-bold outline-none focus:border-[var(--hc-accent)]" />

        <label>
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-[var(--hc-muted)]"><CalendarDays size={14} /> Date *</span>
          <input type="date" value={formData.preferredDate} onChange={(e) => updateField('preferredDate', e.target.value)} className="w-full rounded-lg border border-[var(--hc-border)] bg-[var(--hc-soft)] px-4 py-3.5 text-sm font-bold outline-none focus:border-[var(--hc-accent)]" />
        </label>

        <label>
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-[var(--hc-muted)]"><Clock size={14} /> Time *</span>
          <select value={formData.preferredTime} onChange={(e) => updateField('preferredTime', e.target.value)} className="w-full rounded-lg border border-[var(--hc-border)] bg-[var(--hc-soft)] px-4 py-3.5 text-sm font-bold outline-none focus:border-[var(--hc-accent)]">
            <option>06:00 AM - 08:00 AM</option>
            <option>08:00 AM - 10:00 AM</option>
            <option>12:00 PM - 02:00 PM</option>
            <option>02:00 PM - 04:00 PM</option>
          </select>
        </label>

        <button type="submit" disabled={loading} className="sm:col-span-2 rounded-lg bg-[var(--hc-brand)] py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--hc-brand-text)] transition hover:opacity-90 disabled:opacity-50">
          {loading ? 'Saving booking...' : 'Confirm booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
