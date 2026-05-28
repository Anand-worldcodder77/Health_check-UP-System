import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packagesData } from '../data';
import { ArrowLeft, Clock, Activity, FileText } from 'lucide-react';

const PackageDetail = ({ onBook }) => {
  const { id } = useParams(); // URL se package ka naam lega
  const navigate = useNavigate();
  const data = packagesData[id];

  if (!data) return <div className="hc-page p-20 text-center font-bold text-[var(--hc-text)]">Package not found</div>;

  return (
    <div className="hc-page min-h-screen p-8 md:p-14 lg:p-16">
      <button onClick={() => navigate(-1)} className="mb-12 flex items-center font-black text-[var(--hc-accent)]">
        <ArrowLeft className="mr-2" /> BACK
      </button>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-24">
        <div>
          <h1 className="mb-8 text-4xl font-black uppercase leading-tight text-[var(--hc-text)] md:text-5xl lg:text-6xl">{id}</h1>
          <p className="mb-10 text-lg font-bold leading-relaxed text-[var(--hc-muted)]">{data.description}</p>
          
          <div className="mb-10 rounded-[12px] border border-[var(--hc-border)] bg-[var(--hc-surface)] p-8">
            <h3 className="mb-5 flex items-center font-black text-[var(--hc-accent)]">
              <Clock className="mr-3" size={22} /> PRE-TEST REQUIREMENTS
            </h3>
            <p className="font-bold text-[var(--hc-muted)]">{data.requirements}</p>
          </div>
        </div>

        <div className="rounded-[12px] border border-[var(--hc-border)] bg-[var(--hc-surface)] p-8 lg:p-12 shadow-xl">
          <h3 className="mb-8 flex items-center text-xl font-black uppercase tracking-widest text-[var(--hc-text)]">
            <Activity className="mr-4 text-[var(--hc-accent)]" size={24} /> Included Tests
          </h3>
          <ul className="space-y-4">
            {data.tests.map((test, index) => (
              <li key={index} className="flex items-center rounded-[10px] bg-[var(--hc-soft)] p-5 font-bold text-[var(--hc-muted)]">
                <FileText size={18} className="mr-4 text-[var(--hc-accent)]" /> {test}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => onBook(id)}
            className="mt-12 w-full rounded-[10px] bg-[var(--hc-brand)] py-6 text-xl font-black text-[var(--hc-brand-text)] shadow-lg transition-all hover:opacity-90"
          >
            BOOK THIS PACKAGE
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
