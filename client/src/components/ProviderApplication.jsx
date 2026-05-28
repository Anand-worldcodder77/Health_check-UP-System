import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, FileText, ShieldCheck, Stethoscope, UploadCloud, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../services/apiConfig';
import { isCloudinaryConfigured, uploadToCloudinary } from '../services/cloudinaryUpload';

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  specialization: '',
  medicalRegistrationNumber: '',
  councilName: '',
  highestDegree: '',
  experienceYears: '',
  clinicName: '',
  clinicAddress: '',
  city: '',
  documentsUrl: '',
  documents: [],
};

const ProviderApplication = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(null);

  const updateField = (field, value) => {
    setError('');
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    if (!formData.fullName.trim()) return 'Full name is required.';
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) return 'Valid email is required.';
    if (!/^\d{10}$/.test(formData.phone.trim())) return 'Valid 10 digit phone is required.';
    if (!formData.specialization.trim()) return 'Specialization is required.';
    if (!formData.medicalRegistrationNumber.trim()) return 'Medical registration number is required.';
    if (!formData.councilName.trim()) return 'Medical council name is required.';
    if (!formData.highestDegree.trim()) return 'Highest degree is required.';
    if (!formData.clinicAddress.trim()) return 'Clinic or hospital address is required.';
    if (!formData.city.trim()) return 'City is required.';
    return '';
  };

  const handleDocumentUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (!isCloudinaryConfigured()) {
      setError('Cloudinary upload is not available right now. Paste document links below or try again later.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const uploadedDocs = await Promise.all(files.map(uploadToCloudinary));
      setFormData((current) => ({
        ...current,
        documents: [...current.documents, ...uploadedDocs],
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removeDocument = (url) => {
    setFormData((current) => ({
      ...current,
      documents: current.documents.filter((doc) => doc.url !== url),
    }));
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/doctor-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Application failed');
      setSubmitted(data.application);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-2xl items-center">
          <div className="w-full rounded-[28px] border border-emerald-100 bg-white p-8 text-center shadow-xl shadow-slate-200/70">
            <CheckCircle2 className="mx-auto text-emerald-600" size={54} />
            <h1 className="mt-5 text-3xl font-black text-slate-900">Application submitted</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
              Your provider application is now in admin verification. Our team will review your registration details and contact you.
            </p>
            <p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
              Status: {submitted.status}
            </p>
            <Link to="/auth" className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#009494] px-6 text-sm font-black text-white">
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <main className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="hidden rounded-[28px] bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-white text-[#009494]">
                <Stethoscope size={24} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-100">Provider onboarding</p>
                <p className="text-xs font-semibold text-white/55">Verification before access</p>
              </div>
            </div>
            <Link to="/auth" className="inline-flex h-10 items-center gap-2 rounded-lg bg-white/10 px-3 text-sm font-bold text-white/80">
              <ArrowLeft size={17} /> Login
            </Link>
          </div>

          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-teal-50">
              <ShieldCheck size={15} /> Admin reviewed
            </p>
            <h1 className="text-4xl font-black leading-tight">Apply to join the verified doctor network.</h1>
            <div className="mt-6 grid gap-3">
              {['Medical registration number', 'Council and specialization', 'Degree and document upload', 'Clinic and city details'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-bold text-white/75">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <form onSubmit={submitApplication} className="w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 md:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#009494]">Doctor application</p>
                <h2 className="mt-2 text-3xl font-black text-slate-900">Verification details</h2>
                <p className="mt-2 text-sm font-semibold text-slate-500">Submit your professional details. Admin approval is required before login access.</p>
              </div>
              <Link to="/auth" className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 lg:hidden">
                <ArrowLeft size={18} />
              </Link>
            </div>

            {error && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}

            <div className="grid gap-3 md:grid-cols-2">
              <input value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="Full name *" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Email *" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={formData.phone} maxLength={10} onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))} placeholder="Mobile number *" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={formData.specialization} onChange={(e) => updateField('specialization', e.target.value)} placeholder="Specialization *" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={formData.medicalRegistrationNumber} onChange={(e) => updateField('medicalRegistrationNumber', e.target.value)} placeholder="Medical registration number *" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={formData.councilName} onChange={(e) => updateField('councilName', e.target.value)} placeholder="Medical council name *" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={formData.highestDegree} onChange={(e) => updateField('highestDegree', e.target.value)} placeholder="Highest degree *" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={formData.experienceYears} onChange={(e) => updateField('experienceYears', e.target.value.replace(/\D/g, ''))} placeholder="Experience years" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={formData.city} onChange={(e) => updateField('city', e.target.value)} placeholder="City *" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={formData.clinicName} onChange={(e) => updateField('clinicName', e.target.value)} placeholder="Clinic / hospital name" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494]" />
              <input value={formData.clinicAddress} onChange={(e) => updateField('clinicAddress', e.target.value)} placeholder="Clinic / hospital address *" className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#009494] md:col-span-2" />
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 md:col-span-2">
                <FileText size={18} className="text-slate-400" />
                <input value={formData.documentsUrl} onChange={(e) => updateField('documentsUrl', e.target.value)} placeholder="Document links / drive URLs optional" className="h-11 min-w-0 flex-1 bg-transparent text-sm font-bold outline-none" />
              </div>
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 md:col-span-2">
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
                  <UploadCloud className="text-[#009494]" size={24} />
                  <span className="text-sm font-black text-slate-800">
                    {uploading ? 'Uploading documents...' : 'Upload degree / ID / registration files'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    PDF, JPG, PNG. Files upload securely through the backend.
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,image/*"
                    onChange={handleDocumentUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                {formData.documents.length > 0 && (
                  <div className="mt-4 grid gap-2">
                    {formData.documents.map((doc) => (
                      <div key={doc.url} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-600">
                        <a href={doc.url} target="_blank" rel="noreferrer" className="min-w-0 truncate text-[#009494]">
                          {doc.name}
                        </a>
                        <button type="button" onClick={() => removeDocument(doc.url)} className="grid h-7 w-7 place-items-center rounded-md bg-slate-100 text-slate-500">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button disabled={loading} className="mt-5 h-11 w-full rounded-lg bg-[#009494] text-sm font-black uppercase tracking-[0.08em] text-white disabled:bg-slate-300">
              {loading ? 'Submitting...' : 'Submit for verification'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ProviderApplication;
