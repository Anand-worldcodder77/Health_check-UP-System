import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  X,
  XCircle,
} from 'lucide-react';
import { API_BASE } from '../../services/apiConfig';

const statusStyles = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
  UNDER_REVIEW: 'bg-blue-50 text-blue-700 border-blue-100',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-100',
};

const verificationChecks = [
  'Registration number matches medical council record',
  'Doctor legal name matches uploaded certificate',
  'Specialization and highest degree are consistent',
  'Clinic address and city are complete',
  'Documents are readable and not expired',
];

const DoctorVerification = () => {
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [approvalResult, setApprovalResult] = useState(null);
  const [notes, setNotes] = useState({});
  const [selectedApplication, setSelectedApplication] = useState(null);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/doctor-applications?status=${status}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load doctor applications');
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [status]);

  const filteredApplications = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return applications;
    return applications.filter((item) => (
      `${item.fullName} ${item.email} ${item.phone} ${item.specialization} ${item.medicalRegistrationNumber} ${item.councilName}`
        .toLowerCase()
        .includes(search)
    ));
  }, [applications, query]);

  const counters = useMemo(() => ({
    pending: applications.filter((item) => item.status === 'PENDING').length,
    review: applications.filter((item) => item.status === 'UNDER_REVIEW').length,
    approved: applications.filter((item) => item.status === 'APPROVED').length,
    rejected: applications.filter((item) => item.status === 'REJECTED').length,
  }), [applications]);

  const updateStatus = async (application, nextStatus) => {
    const note = notes[application._id] || application.adminNote || '';
    if (nextStatus === 'REJECTED' && !note.trim()) {
      setError('Reject karne ke liye admin note / reason required hai.');
      setSelectedApplication(application);
      return;
    }

    setActionLoading(`${application._id}-${nextStatus}`);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/doctor-applications/${application._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, adminNote: note }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Update failed');
      setApplications((current) => current.map((item) => (item._id === application._id ? data.application : item)));
      setSelectedApplication(data.application);
      if (nextStatus === 'APPROVED') setApprovalResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const resetDoctorPassword = async (application) => {
    const note = notes[application._id] || application.adminNote || 'Temporary password reset by admin.';
    setActionLoading(`${application._id}-RESET_PASSWORD`);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/doctor-applications/${application._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED', adminNote: note, issueTemporaryPassword: true }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Password reset failed');
      setApplications((current) => current.map((item) => (item._id === application._id ? data.application : item)));
      setSelectedApplication(data.application);
      setApprovalResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const renderActionButtons = (application) => (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setSelectedApplication(application)}
        className="cursor-pointer rounded-xl bg-blue-50 px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-blue-700 transition hover:bg-blue-600 hover:text-white"
      >
        Review
      </button>
      <button
        type="button"
        disabled={actionLoading === `${application._id}-APPROVED`}
        onClick={() => updateStatus(application, 'APPROVED')}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:cursor-wait disabled:opacity-60"
      >
        <CheckCircle2 size={16} /> Approve
      </button>
      <button
        type="button"
        disabled={actionLoading === `${application._id}-REJECTED`}
        onClick={() => updateStatus(application, 'REJECTED')}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-rose-700 transition hover:bg-rose-600 hover:text-white disabled:cursor-wait disabled:opacity-60"
      >
        <XCircle size={16} /> Reject
      </button>
      {application.status === 'APPROVED' && (
        <button
          type="button"
          disabled={actionLoading === `${application._id}-RESET_PASSWORD`}
          onClick={() => resetDoctorPassword(application)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#009494] disabled:cursor-wait disabled:opacity-60"
        >
          Reset password
        </button>
      )}
    </div>
  );

  return (
    <div className="p-5 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Live database queue</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-800 md:text-3xl">Doctor verification</h2>
          <p className="mt-1 max-w-3xl text-xs font-bold uppercase leading-5 tracking-[0.16em] text-slate-400">
            Review provider applications, licenses, specialization, clinic details and documents before account activation
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctor, email, license..."
              className="w-full rounded-2xl border border-slate-100 bg-white py-3 pl-12 pr-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#009494]/20 md:w-80"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="cursor-pointer rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold text-slate-500 outline-none">
            {['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((item) => <option key={item}>{item}</option>)}
          </select>
          <button type="button" onClick={loadApplications} className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-3 text-slate-400 transition hover:text-[#009494]">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Pending', counters.pending],
          ['Under review', counters.review],
          ['Approved', counters.approved],
          ['Rejected', counters.rejected],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {error && <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}

      {approvalResult && (
        <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-black text-emerald-800">Doctor account activated</p>
              <p className="mt-1 text-xs font-bold leading-5 text-emerald-700">
                {approvalResult.temporaryPassword
                  ? 'Share these login credentials with the doctor. Password will not be visible after dismiss.'
                  : approvalResult.emailSent ? 'Welcome email has been sent to the doctor.' : 'Email is not configured. Share existing credentials manually or reset password.'}
              </p>
              {approvalResult.temporaryPassword && (
                <div className="mt-3 rounded-xl bg-white p-3 text-xs font-bold text-slate-700">
                  <p>Email: {approvalResult.doctorUser?.email}</p>
                  <p>Temporary password: {approvalResult.temporaryPassword}</p>
                </div>
              )}
            </div>
            <button type="button" onClick={() => setApprovalResult(null)} className="cursor-pointer rounded-xl bg-white px-4 py-2 text-xs font-black text-emerald-700 transition hover:bg-emerald-700 hover:text-white">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-[24px] bg-white p-20 font-bold text-slate-400">
          <Loader2 className="animate-spin" /> Loading applications...
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((application) => (
            <article key={application._id} className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <button type="button" onClick={() => setSelectedApplication(application)} className="flex cursor-pointer gap-4 text-left">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-50 text-[#009494]">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-slate-900">{application.fullName}</h3>
                      <span className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${statusStyles[application.status] || statusStyles.PENDING}`}>
                        {application.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-slate-600">{application.specialization} | {application.experienceYears || 0} yrs</p>
                    <p className="mt-2 text-xs font-bold text-slate-400">{application.medicalRegistrationNumber} | {application.councilName} | {application.city}</p>
                    <p className="mt-1 text-xs font-bold text-slate-400">{application.highestDegree || 'Degree not added'}</p>
                    <p className="mt-1 text-xs font-bold text-slate-400">{application.clinicName || 'Clinic'} | {application.clinicAddress || 'Address not added'}</p>
                    <p className="mt-1 text-xs font-bold text-slate-400">{application.email} | {application.phone}</p>
                  </div>
                </button>

                <div className="min-w-full space-y-2 xl:min-w-[430px]">
                  <input
                    value={notes[application._id] || application.adminNote || ''}
                    onChange={(e) => setNotes((current) => ({ ...current, [application._id]: e.target.value }))}
                    placeholder="Admin note / rejection reason"
                    className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-[#009494]"
                  />
                  {renderActionButtons(application)}
                </div>
              </div>

              {application.documents?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 pl-0 md:pl-16">
                  {application.documents.map((doc) => (
                    <a key={doc.url} href={doc.url} target="_blank" rel="noreferrer" className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-black text-[#009494] transition hover:bg-[#009494] hover:text-white">
                      {doc.name || 'Document'} <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {!loading && filteredApplications.length === 0 && (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-16 text-center font-bold text-slate-400">
          No doctor applications found.
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-x-0 bottom-16 top-0 z-[600] flex justify-end bg-slate-950/20 backdrop-blur-sm lg:bottom-0 lg:left-72">
          <div className="h-full w-full overflow-y-auto bg-white p-5 shadow-2xl md:max-w-5xl md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009494]">Verification review</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">{selectedApplication.fullName}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{selectedApplication.specialization}</p>
              </div>
              <button type="button" onClick={() => setSelectedApplication(null)} className="grid h-11 w-11 cursor-pointer place-items-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-900 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Medical registration', selectedApplication.medicalRegistrationNumber],
                  ['Council', selectedApplication.councilName],
                  ['Highest degree', selectedApplication.highestDegree || '-'],
                  ['Experience', `${selectedApplication.experienceYears || 0} years`],
                  ['Clinic', selectedApplication.clinicName || '-'],
                  ['City', selectedApplication.city || '-'],
                  ['Email', selectedApplication.email],
                  ['Phone', selectedApplication.phone],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="mt-2 text-sm font-bold text-slate-800">{value}</p>
                  </div>
                ))}
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinic address</p>
                  <p className="mt-2 text-sm font-bold text-slate-800">{selectedApplication.clinicAddress || '-'}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="mb-4 flex items-center gap-2">
                  <FileCheck2 className="text-[#009494]" size={20} />
                  <p className="text-sm font-black text-slate-900">Admin verification checklist</p>
                </div>
                <div className="space-y-2">
                  {verificationChecks.map((check) => (
                    <label key={check} className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-600">
                      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#009494]" />
                      {check}
                    </label>
                  ))}
                </div>
                <textarea
                  value={notes[selectedApplication._id] || selectedApplication.adminNote || ''}
                  onChange={(e) => setNotes((current) => ({ ...current, [selectedApplication._id]: e.target.value }))}
                  placeholder="Admin note, registry link, or rejection reason"
                  className="mt-4 min-h-24 w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none focus:border-[#009494]"
                />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Documents</p>
              <div className="flex flex-wrap gap-2">
                {selectedApplication.documents?.length ? selectedApplication.documents.map((doc) => (
                  <a key={doc.url} href={doc.url} target="_blank" rel="noreferrer" className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-[#009494] transition hover:bg-[#009494] hover:text-white">
                    {doc.name || 'Document'} <ExternalLink size={13} />
                  </a>
                )) : <p className="text-sm font-bold text-slate-400">No uploaded documents attached.</p>}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => updateStatus(selectedApplication, 'UNDER_REVIEW')} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-50 px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-blue-700 transition hover:bg-blue-600 hover:text-white">
                <Stethoscope size={16} /> Mark under review
              </button>
              <button type="button" onClick={() => updateStatus(selectedApplication, 'APPROVED')} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-50 px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-emerald-700 transition hover:bg-emerald-600 hover:text-white">
                <CheckCircle2 size={16} /> Approve doctor
              </button>
              {selectedApplication.status === 'APPROVED' && (
                <button type="button" onClick={() => resetDoctorPassword(selectedApplication)} className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#009494]">
                  Reset password
                </button>
              )}
              <button type="button" onClick={() => updateStatus(selectedApplication, 'REJECTED')} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-50 px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-rose-700 transition hover:bg-rose-600 hover:text-white">
                <XCircle size={16} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorVerification;
