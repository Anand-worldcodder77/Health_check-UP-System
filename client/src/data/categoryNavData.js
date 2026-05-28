import { packageData } from './packageData';

export const categoryNavItems = [
  {
    id: 'full-body',
    label: 'Full Body Checkup',
    dataKey: 'Full Body Checkup',
    whyTitle: 'Why Full Body Checkups Matter:',
    whyPoints: [
      'Detect silent health risks early',
      'Monitor vital organs in one visit',
      'Save time with combined test panels',
    ],
  },
  {
    id: 'heart',
    label: 'Heart',
    dataKey: 'Heart',
    whyTitle: 'Why Heart Checkups Matter:',
    whyPoints: [
      'High cholesterol often has no symptoms',
      'Early cardiac markers prevent emergencies',
      'Track blood pressure & lipid trends',
    ],
  },
  {
    id: 'cancer',
    label: 'Cancer',
    dataKey: 'Full Body Checkup',
    packageFilter: (pkg) => /cancer|screening|women|senior/i.test(pkg.name + pkg.includes),
    whyTitle: 'Why Cancer Checkups Matter:',
    whyPoints: [
      'Early signs are often silent',
      'Screening improves treatment outcomes',
      'Know your risk before symptoms appear',
    ],
  },
  {
    id: 'thyroid',
    label: 'Thyroid',
    dataKey: 'Thyroid',
    whyTitle: 'Why Thyroid Checkups Matter:',
    whyPoints: [
      'Thyroid imbalance affects weight & mood',
      'TSH screening is quick and affordable',
      'Hormone control prevents long-term issues',
    ],
  },
  {
    id: 'diabetes',
    label: 'Diabetes',
    dataKey: 'Diabetes',
    whyTitle: 'Why Diabetes Checkups Matter:',
    whyPoints: [
      'High sugar harms silently',
      'HbA1c tracks 3-month sugar control',
      'Early control prevents organ damage',
    ],
  },
  {
    id: 'pregnancy',
    label: 'Pregnancy',
    dataKey: 'Diabetes',
    packageFilter: (pkg) => /gestational|pregnancy|women/i.test(pkg.name + pkg.includes),
    fallbackDataKey: 'Full Body Checkup',
    whyTitle: 'Why Pregnancy Checkups Matter:',
    whyPoints: [
      'Monitor mother and baby health safely',
      'Detect gestational diabetes early',
      'Essential vitamins & infection screens',
    ],
  },
  {
    id: 'allergy',
    label: 'Allergy/Intolerance',
    dataKey: 'Allergy',
    whyTitle: 'Why Allergy Tests Matter:',
    whyPoints: [
      'Identify food & environmental triggers',
      'Reduce chronic sneezing & skin issues',
      'Personalized avoidance plans work better',
    ],
  },
  {
    id: 'hormone',
    label: 'Hormone',
    dataKey: 'Thyroid',
    packageFilter: (pkg) => /hormone|thyroid|metabolic/i.test(pkg.name + pkg.includes),
    whyTitle: 'Why Hormone Checkups Matter:',
    whyPoints: [
      'Hormones control energy & metabolism',
      'Imbalance affects fertility & mood',
      'Regular tests guide correct treatment',
    ],
  },
  {
    id: 'dna',
    label: 'DNA Test',
    dataKey: 'STD',
    isNew: true,
    whyTitle: 'Why DNA Tests Matter:',
    whyPoints: [
      'Accurate infection & genetic screening',
      'Early detection protects your family',
      'Confidential reports from NABL labs',
    ],
  },
];

export function getPackagesForCategory(navItem, limit = 3) {
  let pool = packageData.filter((pkg) => pkg.category === navItem.dataKey);

  if (navItem.packageFilter) {
    const filtered = pool.filter(navItem.packageFilter);
    if (filtered.length) pool = filtered;
  }

  if (pool.length < limit && navItem.fallbackDataKey) {
    const fallback = packageData.filter((pkg) => pkg.category === navItem.fallbackDataKey);
    pool = [...pool, ...fallback];
  }

  return pool.slice(0, limit);
}

export function getPackagePricing(pkg) {
  const offerPrice = pkg.price;
  const mrp = Math.round(offerPrice * 3.33);
  const discount = Math.round(((mrp - offerPrice) / mrp) * 100);
  return { offerPrice, mrp, discount };
}
