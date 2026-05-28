import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle, Loader2, Phone, RefreshCw, Search, UserRound } from 'lucide-react';
import { API_BASE } from '../../services/apiConfig';

const CallbackLogs = () => {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/admin/callbacks`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load callbacks');
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return logs;
    return logs.filter((log) => `${log.name || ''} ${log.phone || ''} ${log.status || ''}`.toLowerCase().includes(search));
  }, [logs, query]);

  const markResolved = async (id) => {
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/callbacks/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Called' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update callback');
      setLogs((current) => current.map((log) => (
        log._id === id ? data : log
      )));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-5 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800 md:text-3xl">Care callbacks</h2>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Patient enquiries, missed leads and support follow-ups
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search callbacks..."
              className="w-full rounded-2xl border border-slate-100 bg-white py-3 pl-12 pr-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#009494]/20 md:w-72"
            />
          </div>
          <button onClick={loadLogs} className="rounded-2xl border border-slate-100 bg-white p-3 text-slate-400 transition hover:text-[#009494]">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-600">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-[28px] bg-white p-20 font-bold text-slate-400">
          <Loader2 className="animate-spin" /> Loading callback requests...
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLogs.map((log) => (
            <div key={log._id} className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${['Resolved', 'Called'].includes(log.status) ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                    <UserRound size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-800">{log.name || 'Callback request'}</h4>
                    <div className="mt-1 flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Phone size={12} /> {log.phone}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Calendar size={12} /> {new Date(log.createdAt || log.date || Date.now()).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${['Resolved', 'Called'].includes(log.status) ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {log.status || 'Pending'}
                  </span>
                  {!['Resolved', 'Called'].includes(log.status) && (
                    <button onClick={() => markResolved(log._id)} className="rounded-xl bg-emerald-500 p-3 text-white shadow-lg shadow-emerald-100 transition hover:bg-slate-900" title="Mark as called">
                      <CheckCircle size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredLogs.length === 0 && (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-16 text-center font-bold text-slate-400">
          No callback requests at the moment.
        </div>
      )}
    </div>
  );
};

export default CallbackLogs;
