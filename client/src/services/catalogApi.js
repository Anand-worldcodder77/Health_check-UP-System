import { API_BASE } from './apiConfig';

export async function searchCatalog(query) {
  const response = await fetch(
    `${API_BASE}/api/catalog/search?q=${encodeURIComponent(query.trim())}`,
  );

  if (!response.ok) {
    throw new Error('Search failed');
  }

  return response.json();
}

export function mapPopularTestToSearchItem(test) {
  return {
    _id: test.id,
    id: test.id,
    type: 'TEST',
    title: test.name,
    name: test.name,
    category: test.category,
    offerPrice: test.price,
    price: test.price,
    reportTime: test.reportTime,
    tests: test.tests,
  };
}

export function normalizeSearchResults({ tests = [], packages = [] } = {}) {
  const testItems = tests.map((test) => ({
    _id: test._id,
    id: test._id,
    type: 'TEST',
    title: test.name,
    name: test.name,
    category: test.category || 'Lab test',
    code: test.code,
    offerPrice: test.price ?? test.discountedPrice ?? 0,
    price: test.price ?? test.discountedPrice ?? 0,
    reportTime: test.turnaroundTime ? `${test.turnaroundTime} hrs` : '24 hrs',
    tests: 1,
  }));

  const packageItems = packages.map((pkg) => ({
    _id: pkg._id,
    id: pkg._id,
    slug: pkg.slug,
    type: 'PACKAGE',
    title: pkg.title,
    name: pkg.title,
    category: pkg.category || 'Health package',
    offerPrice: pkg.discountedPrice ?? pkg.price ?? 0,
    price: pkg.discountedPrice ?? pkg.price ?? 0,
    reportTime: pkg.reportTimeHours ? `${pkg.reportTimeHours} hrs` : '24 hrs',
    tests: pkg.testCount || 0,
  }));

  return [...testItems, ...packageItems];
}
