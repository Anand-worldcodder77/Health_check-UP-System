import React from 'react';
import { FlaskConical, Package } from 'lucide-react';

const SearchResultsList = ({ results, loading, error, onAdd, emptyMessage = 'No tests or packages found' }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <div className="h-10 w-10 shimmer rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/3 shimmer rounded-full" />
              <div className="h-3 w-1/3 shimmer rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
        {error}. Please try again.
      </p>
    );
  }

  if (!results.length) {
    return (
      <p className="py-4 text-center text-sm font-medium text-slate-500">{emptyMessage}</p>
    );
  }

  return (
    <div className="space-y-1">
      {results.map((item) => {
        const Icon = item.type === 'PACKAGE' ? Package : FlaskConical;
        const priceLabel = item.offerPrice > 0 ? `Rs. ${item.offerPrice}` : 'View details';

        return (
          <article
            key={`${item.type}-${item._id || item.id}`}
            className="flex items-center justify-between gap-3 rounded-lg p-2.5 transition hover:bg-slate-50"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-600">
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <div className="mb-0.5 flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                    {item.type === 'PACKAGE' ? 'Package' : 'Test'}
                  </span>
                </div>
                <h3 className="truncate text-sm font-bold text-slate-900">{item.name || item.title}</h3>
                <p className="text-xs text-slate-500">
                  {item.category} · {priceLabel}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onAdd(item)}
              className="shrink-0 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-teal-700"
            >
              Add
            </button>
          </article>
        );
      })}
    </div>
  );
};

export default SearchResultsList;
