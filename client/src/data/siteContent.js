import {
  Activity,
  Award,
  BadgeCheck,
  CalendarCheck,
  Clock,
  FileCheck,
  FileText,
  FlaskConical,
  HeartPulse,
  Home,
  MapPin,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react';
import { packageData } from './packageData';

const heroImages = [
  'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504813184591-01574ff81c8d?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2070&auto=format&fit=crop',
];

export const brandDefaults = {
  labName: 'HealthChecks',
  contact: '1800-572-0005',
  address: '123 Health Street, Medical Hub, New Delhi',
  email: 'support@healthchecks.com',
};

export const heroSlides = packageData
  .filter((item) => ['Full Body Checkup', 'Diabetes', 'Heart', 'Thyroid'].includes(item.category))
  .slice(0, 4)
  .map((item, index) => ({
    ...item,
    image: heroImages[index],
    eyebrow: index === 0 ? 'Most booked preventive package' : `${item.category} care`,
    summary: item.includes,
  }));

export const trustStats = [
  { label: 'Accredited labs', value: 'NABL', icon: BadgeCheck },
  { label: 'Smart reports', value: '6-24 hrs', icon: Clock },
  { label: 'Home collection', value: '350+ cities', icon: MapPin },
];

export const careCategories = [...new Set(packageData.map((item) => item.category))];

export const navCategories = careCategories.slice(0, 6).map((category) => ({
  title: category,
  tests: packageData.filter((item) => item.category === category).slice(0, 4),
  desc: `Curated ${category.toLowerCase()} diagnostics with home sample collection and verified reports.`,
}));

export const navLinks = [
  { label: 'Packages', href: '#packages' },
  { label: 'Tests', href: '#popular-tests' },
  { label: 'Process', href: '#process' },
  { label: 'Reports', href: '#reports' },
  { label: 'Support', href: '#support' },
];

export const quickSearches = ['CBC', 'Thyroid', 'Diabetes', 'Lipid profile'];

export const heroServiceRail = [
  { icon: Home, title: 'Home sample', text: 'Trained phlebo visits your doorstep' },
  { icon: CalendarCheck, title: 'Flexible slot', text: 'Morning and evening collection' },
  { icon: FileText, title: 'Smart report', text: 'Digital report with counselling support' },
];

export const processSteps = [
  {
    id: '01',
    title: 'Book Online',
    desc: 'Choose a package and confirm a home collection slot in minutes.',
    icon: Home,
    accent: 'text-[var(--hc-accent)] bg-[var(--hc-soft)]',
  },
  {
    id: '02',
    title: 'Home Collection',
    desc: 'A trained phlebotomist collects the sample with sterile protocols.',
    icon: Truck,
    accent: 'text-[var(--hc-accent)] bg-[var(--hc-soft)]',
  },
  {
    id: '03',
    title: 'Lab Processing',
    desc: 'Samples are processed on calibrated analyzers with clinical controls.',
    icon: FlaskConical,
    accent: 'text-[var(--hc-accent)] bg-[var(--hc-soft)]',
  },
  {
    id: '04',
    title: 'Digital Report',
    desc: 'Receive doctor-reviewed reports on WhatsApp and email.',
    icon: FileCheck,
    accent: 'text-[var(--hc-accent)] bg-[var(--hc-soft)]',
  },
];

export const whyChooseFeatures = [
  { title: 'On-time home collection', icon: Truck, desc: 'Slot-aware visits with trained sample collection staff.' },
  { title: 'Report counselling', icon: HeartPulse, desc: 'Clear guidance after your results are generated.' },
  { title: 'Fast report delivery', icon: Activity, desc: 'Digital reports with practical health indicators.' },
  { title: 'Verified doctors', icon: ShieldCheck, desc: 'Reviewed by experienced pathology professionals.' },
  { title: 'Large care network', icon: Users, desc: 'Collection and support coverage across major cities.' },
  { title: 'Quality protocols', icon: Award, desc: 'Controlled handling from collection to report release.' },
];

export const testimonials = [
  {
    name: 'Rahul Sharma',
    location: 'New Delhi',
    text: 'The booking was smooth, the collector arrived on time, and the report was easy to understand.',
    rating: 5,
  },
  {
    name: 'Priya Verma',
    location: 'Mumbai',
    text: 'I booked a wellness package for my parents. The experience felt professional from start to finish.',
    rating: 5,
  },
  {
    name: 'Amit Patel',
    location: 'Ahmedabad',
    text: 'Good package options and clear pricing. The cardiac panel report reached me the same day.',
    rating: 4,
  },
];

export const popularTests = [
  {
    id: 'cbc',
    name: 'CBC Complete Blood Count',
    category: 'Blood health',
    reportTime: '7 hrs',
    fasting: 'No fasting',
    price: 319,
    mrp: 899,
    tests: 21,
    bestSeller: true,
    rating: '4.9',
  },
  {
    id: 'thyroid',
    name: 'Thyroid Profile Total',
    category: 'Hormone',
    reportTime: '7 hrs',
    fasting: 'No fasting',
    price: 490,
    mrp: 1299,
    tests: 3,
    rating: '4.8',
  },
  {
    id: 'hba1c',
    name: 'HbA1c Diabetes Monitor',
    category: 'Diabetes',
    reportTime: '7 hrs',
    fasting: 'No fasting',
    price: 379,
    mrp: 999,
    tests: 1,
    rating: '4.9',
  },
  {
    id: 'lipid',
    name: 'Lipid Profile',
    category: 'Heart',
    reportTime: '7 hrs',
    fasting: '10 hrs fasting',
    price: 399,
    mrp: 1100,
    tests: 8,
  },
  {
    id: 'lft',
    name: 'Liver Function Test',
    category: 'Liver',
    reportTime: '8 hrs',
    fasting: 'No fasting',
    price: 399,
    mrp: 1050,
    tests: 11,
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D 25-OH',
    category: 'Vitamins',
    reportTime: '24 hrs',
    fasting: 'No fasting',
    price: 990,
    mrp: 2499,
    tests: 1,
  },
  {
    id: 'vitamin-b12',
    name: 'Vitamin B12',
    category: 'Vitamins',
    reportTime: '12 hrs',
    fasting: 'No fasting',
    price: 550,
    mrp: 1400,
    tests: 1,
  },
  {
    id: 'kft',
    name: 'Kidney Function Test (KFT)',
    category: 'Blood health',
    reportTime: '8 hrs',
    fasting: 'No fasting',
    price: 499,
    mrp: 1299,
    tests: 12,
  },
];

export const serviceHighlights = [
  {
    title: 'CAP & NABL aligned labs',
    desc: 'Quality-led diagnostics with controlled sample handling and verified reporting.',
    icon: BadgeCheck,
  },
  {
    title: 'On-time sample collection',
    desc: 'Home collection slots designed for predictable doorstep visits.',
    icon: CalendarCheck,
  },
  {
    title: 'Fast smart reports',
    desc: 'Digital reports with test count, fasting guidance, and report timing upfront.',
    icon: FileText,
  },
  {
    title: 'Report counselling',
    desc: 'Post-report support helps patients understand next steps clearly.',
    icon: ShieldCheck,
  },
];

export const faqs = [
  {
    question: 'How does home sample collection work?',
    answer: 'Choose a package or test, share patient details, and our collection team visits the selected address with sterile equipment.',
  },
  {
    question: 'How fast are reports delivered?',
    answer: 'Most routine tests are delivered digitally within 7 to 24 hours. Larger wellness packages may take longer depending on the test list.',
  },
  {
    question: 'Can I book without a prescription?',
    answer: 'Most preventive health packages and routine blood tests can be booked directly online. Prescription rules may apply for specialized tests.',
  },
  {
    question: 'What should a premium diagnostics site show?',
    answer: 'Clear search, popular tests, trusted labs, sample collection process, report timing, package contents, support access, and FAQs.',
  },
];
