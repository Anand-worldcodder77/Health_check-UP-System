import React from 'react';

const categories = [
  "Full Body Checkup", "Fever", "STD", "Vitamins", 
  "Diabetes", "Heart", "Thyroid", "Kidney", "Allergy"
];

const CategoryTabs = ({ activeTab, onTabClick }) => {
  return (
    <div className="flex items-center justify-center space-x-2 py-6 overflow-x-auto no-scrollbar border-b border-gray-100">
      {categories.map((tab, index) => (
        <button
          key={tab}
          onClick={() => onTabClick(tab)}
          className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300
            ${activeTab === tab 
              ? 'bg-[#009494] text-white shadow-lg' 
              : 'bg-white text-gray-700 hover:bg-teal-50 hover:text-[#009494] border border-gray-100'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;