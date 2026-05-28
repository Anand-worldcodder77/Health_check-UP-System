import { useEffect, useState } from 'react';
import { popularTests } from '../data/siteContent';
import {
  mapPopularTestToSearchItem,
  normalizeSearchResults,
  searchCatalog,
} from '../services/catalogApi';

const defaultResults = popularTests.slice(0, 6).map(mapPopularTestToSearchItem);

export function useCatalogSearch(query, { enabled = true, debounceMs = 400 } = {}) {
  const [results, setResults] = useState(defaultResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const trimmed = query.trim();

    if (!trimmed) {
      setResults(defaultResults);
      setLoading(false);
      setError(null);
      return undefined;
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await searchCatalog(trimmed);
        setResults(normalizeSearchResults(data));
      } catch (err) {
        setError(err.message || 'Search unavailable');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, enabled, debounceMs]);

  return { results, loading, error };
}

export default useCatalogSearch;
