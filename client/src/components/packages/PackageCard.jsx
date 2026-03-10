import React from 'react';
import { CalendarDays, AlertTriangle, FileText ,Clock,User, } from 'lucide-react'; // Icons ke liye

const PackageCard = ({ data, onBookNow }) => {
  const { name, tests, price, members, includes, specialNote, features } = data;
  const originalPrice = price * 2; // Demo ke liye discount calculation

  return (
    <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-black text-gray-800 leading-snug w-2/3 group-hover:text-[#009494] transition-colors">{name}</h3>
          <div className="bg-teal-50 text-center px-4 py-2 rounded-xl">
            <div className="text-3xl font-extrabold text-[#009494]">{tests}</div>
            <div className="text-[10px] text-teal-800 font-bold uppercase tracking-widest">Tests</div>
          </div>
        </div>

        <p className="text-gray-500 text-sm font-bold mb-4 italic">{includes}</p>
        
        {specialNote && (
          <div className="bg-orange-50 text-[#FF6F61] text-xs font-bold p-3 rounded-xl mb-4 flex items-center gap-2">
            <AlertTriangle size={16} />
            {specialNote}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-4 mb-5 text-[11px] font-bold text-gray-500">
          <div className="flex items-center gap-2"> <Clock size={16} /> 12 hrs Fasting</div>
          <div className="flex items-center gap-2"> <User size={16} /> Recommended</div>
          <div className="flex items-center gap-2"> <FileText size={16} /> Reports in 16 hrs</div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-3xl font-black text-gray-900">₹{price}</span>
            <span className="text-sm font-bold text-gray-400 line-through ml-2">₹{originalPrice}</span>
            <span className="block text-xs text-gray-400 font-bold">per person</span>
          </div>
          <button className="text-gray-600 bg-gray-100 px-4 py-2 rounded-lg font-bold text-xs">{members} Members ▼</button>
        </div>

        <button 
          onClick={() => onBookNow(name)}
          className="w-full bg-[#009494] text-white py-4 rounded-xl font-black text-sm shadow-md hover:scale-[1.03] transition-all duration-300 uppercase tracking-widest"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default PackageCard;