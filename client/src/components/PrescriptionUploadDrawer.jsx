import React, { useState } from 'react';
import { FileUp, Loader2, MapPin, Package, Phone, User, X } from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

const emptyForm = {
  userName: '',
  userEmail: '',
  userPhone: '',
  selectedPackage: 'Prescription Based Tests',
  address: '',
};

const PrescriptionUploadDrawer = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState(() => ({
    ...emptyForm,
    userName: user?.name || '',
    userEmail: user?.email || '',
    userPhone: user?.phone || '',
  }));
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setMessage('');
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleFile = (selectedFile) => {
    setMessage('');
    setFile(selectedFile || null);
    if (selectedFile) setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const submitPrescription = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Prescription file required hai.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const uploadForm = new FormData();
      uploadForm.append('image', file);

      const uploadResponse = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: uploadForm,
      });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadData.error || uploadData.message || 'Prescription upload failed');

      const bookingResponse = await fetch(`${API_BASE}/api/bookings/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          customer: user?._id || user?.id,
          prescription: uploadData.imageUrl,
          status: 'Pending',
          bookingDate: new Date(),
        }),
      });

      const bookingData = await bookingResponse.json();
      if (!bookingResponse.ok) throw new Error(bookingData.error || bookingData.message || 'Booking create failed');

      setMessage('Prescription uploaded and booking created successfully.');
      setFile(null);
      setPreviewUrl('');
      setTimeout(() => {
        onClose();
        window.location.href = '/dashboard';
      }, 800);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[700] flex justify-end bg-slate-950/40 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white p-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Upload Rx</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">Prescription booking</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Upload prescription and our team will confirm the required tests.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-900 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submitPrescription} className="space-y-4 p-5">
          {message && (
            <div className={`rounded-2xl p-4 text-sm font-bold ${message.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {message}
            </div>
          )}

          <label className="block cursor-pointer rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-[#009494]">
            <input type="file" accept="image/*,.pdf" onChange={(event) => handleFile(event.target.files?.[0])} className="hidden" />
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#009494] shadow-sm">
              <FileUp size={25} />
            </div>
            <p className="mt-4 text-sm font-black text-slate-800">{file ? file.name : 'Select prescription file'}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">PDF, JPG, PNG accepted</p>
            {previewUrl && file?.type?.startsWith('image/') && <img src={previewUrl} alt="Prescription preview" className="mx-auto mt-4 max-h-44 rounded-2xl object-contain" />}
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-300" size={16} />
              <input required value={formData.userName} onChange={(e) => updateField('userName', e.target.value)} placeholder="Patient name" className="h-11 w-full rounded-2xl border border-slate-100 bg-slate-50 pl-11 pr-4 text-sm font-bold outline-none focus:border-[#009494]" />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-slate-300" size={16} />
              <input required value={formData.userPhone} onChange={(e) => updateField('userPhone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Mobile number" className="h-11 w-full rounded-2xl border border-slate-100 bg-slate-50 pl-11 pr-4 text-sm font-bold outline-none focus:border-[#009494]" />
            </div>
            <div className="relative md:col-span-2">
              <Package className="absolute left-4 top-3.5 text-slate-300" size={16} />
              <input required value={formData.selectedPackage} onChange={(e) => updateField('selectedPackage', e.target.value)} placeholder="Test/package requested" className="h-11 w-full rounded-2xl border border-slate-100 bg-slate-50 pl-11 pr-4 text-sm font-bold outline-none focus:border-[#009494]" />
            </div>
            <div className="relative md:col-span-2">
              <MapPin className="absolute left-4 top-3.5 text-slate-300" size={16} />
              <textarea required value={formData.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Collection address" className="min-h-24 w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold outline-none focus:border-[#009494]" />
            </div>
          </div>

          <button disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#009494] text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-slate-950 disabled:cursor-wait disabled:opacity-60">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <FileUp size={16} />} Submit prescription
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionUploadDrawer;
