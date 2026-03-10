import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packagesData } from '../data';
import { ArrowLeft, Clock, Activity, FileText } from 'lucide-react';

const PackageDetail = ({ onBook }) => {
  const { id } = useParams(); // URL se package ka naam lega
  const navigate = useNavigate();
  const data = packagesData[id];

  if (!data) return <div className="p-20 text-center font-bold">Package not found!</div>;

  return (
    <div className="min-h-screen bg-white p-10 mt-10">
      <button onClick={() => navigate(-1)} className="flex items-center text-[#009494] font-black mb-8">
        <ArrowLeft className="mr-2" /> BACK
      </button>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-5xl font-black text-gray-900 mb-6 uppercase tracking-tighter">{id}</h1>
          <p className="text-gray-500 text-lg font-bold leading-relaxed mb-8">{data.description}</p>
          
          <div className="bg-teal-50 p-6 rounded-[30px] border border-teal-100 mb-8">
            <h3 className="flex items-center font-black text-[#009494] mb-3">
              <Clock className="mr-2" size={20} /> PRE-TEST REQUIREMENTS
            </h3>
            <p className="font-bold text-gray-700">{data.requirements}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 shadow-xl">
          <h3 className="flex items-center font-black text-gray-800 mb-6 text-xl uppercase tracking-widest">
            <Activity className="mr-3 text-[#009494]" /> Included Tests
          </h3>
          <ul className="space-y-4">
            {data.tests.map((test, index) => (
              <li key={index} className="flex items-center font-bold text-gray-600 bg-white p-4 rounded-2xl shadow-sm">
                <FileText size={16} className="mr-3 text-teal-400" /> {test}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => onBook(id)}
            className="w-full bg-[#FF6F61] text-white py-5 rounded-2xl font-black mt-10 text-xl shadow-lg hover:scale-105 transition-all"
          >
            BOOK THIS PACKAGE
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;