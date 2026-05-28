import React from 'react';
import { careCategories } from '../../data/siteContent';

const CategoryTabs = ({ activeTab, onTabClick, categories = careCategories }) => {
  return (
    <div className="overflow-x-auto border-b border-[var(--hc-border)] pb-4">
      <div className="flex min-w-max items-center gap-2">
        {categories.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabClick(tab)}
            className={`rounded-[12px] px-4 py-2.5 text-sm font-black transition ${
              activeTab === tab
                ? 'bg-[var(--hc-brand)] text-[var(--hc-brand-text)] shadow-lg shadow-black/10'
                : 'bg-[var(--hc-soft)] text-[var(--hc-muted)] hover:text-[var(--hc-text)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
