import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { quickSearches } from '../../data/siteContent';
import useCartStore from '../../store/useCartStore';
import useCatalogSearch from '../../hooks/useCatalogSearch';
import SearchResultsList from './SearchResultsList';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const addItem = useCartStore((state) => state.addItem);
  const { results, loading, error } = useCatalogSearch(query, { enabled: isOpen });

  if (!isOpen) return null;

  const handleAdd = (item) => {
    addItem(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] bg-slate-50 md:hidden">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4">
          <Search size={19} className="text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tests, packages, conditions..."
            className="min-w-0 flex-1 bg-transparent py-4 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-500"
          aria-label="Close search"
        >
          <X size={19} />
        </button>
      </div>

      <div className="px-4 py-5">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-teal-600">Quick searches</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {quickSearches.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQuery(item)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {query.trim() ? 'Search results' : 'Popular tests'}
        </p>
        <SearchResultsList
          results={results}
          loading={loading}
          error={error}
          onAdd={handleAdd}
        />
      </div>
    </div>
  );
};

export default SearchOverlay;
