import React, { useState, useEffect } from 'react';
import { Phone, Calendar, CheckCircle, Clock, Trash2, User } from 'lucide-react';

const CallbackLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Yahan API call aayegi (abhi dummy data dikha raha hoon functionality ke liye)
    setLogs([
      { _id: '1', name: 'Rahul Sharma', phone: '9876543210', date: new Date(), status: 'Pending' },
      { _id: '2', name: 'Amit Verma', phone: '9988776655', date: new Date(), status: 'Resolved' },
    ]);
  }, []);

  const handleResolve = (id) => {
    setLogs(prev => prev.map(log => log._id === id ? { ...log, status: 'Resolved' } : log));
  };

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid gap-6">
        {logs.map((log) => (
          <div key={log._id} className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-50 flex items-center justify-between hover:shadow-md transition-all group">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${log.status === 'Resolved' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                <User size={24} />
              </div>
              
              <div>
                <h4 className="font-black text-slate-800 text-lg">{log.name}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Phone size={12} /> {log.phone}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Calendar size={12} /> {new Date(log.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${log.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                {log.status}
              </span>
              
              <div className="h-10 w-[1px] bg-slate-100 mx-2"></div>

              <div className="flex gap-2">
                {log.status !== 'Resolved' && (
                  <button 
                    onClick={() => handleResolve(log._id)}
                    className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-emerald-100"
                    title="Mark as Called"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {logs.length === 0 && (
        <div className="py-20 text-center text-slate-300 font-bold italic">
          No callback requests at the moment.
        </div>
      )}
    </div>
  );
};

export default CallbackLogs;