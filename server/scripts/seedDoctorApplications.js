const mongoose = require('mongoose');
require('dotenv').config();

const DoctorApplication = require('../models/DoctorApplication');

const mockApplications = [
  {
    fullName: 'Dr. Rohan Malhotra',
    email: 'rohan.malhotra@mockmed.in',
    phone: '9876543210',
    specialization: 'General Medicine / Family Physician',
    experienceYears: 8,
    medicalRegistrationNumber: 'MCI-142857',
    councilName: 'Delhi Medical Council',
    highestDegree: 'MBBS, MD (Internal Medicine)',
    clinicName: 'Care & Cure Clinic',
    clinicAddress: 'Care & Cure Clinic, Greater Kailash Part 1, New Delhi - 110048',
    city: 'New Delhi',
    documents: [
      { name: 'rohan_mci_certificate.pdf', url: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf', type: 'application/pdf', provider: 'mock' },
      { name: 'rohan_md_degree.jpg', url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', type: 'image/jpeg', provider: 'mock' },
    ],
    documentsUrl: 'rohan_mci_certificate.pdf, rohan_md_degree.jpg',
    status: 'PENDING',
  },
  {
    fullName: 'Dr. Ananya Iyer',
    email: 'ananya.iyer@healthmail.com',
    phone: '9123456789',
    specialization: 'Pediatrics (Child Specialist)',
    experienceYears: 5,
    medicalRegistrationNumber: 'KMC-90812',
    councilName: 'Karnataka Medical Council',
    highestDegree: 'MBBS, DCH (Diploma in Child Health)',
    clinicName: 'Little Angels Clinic',
    clinicAddress: 'Little Angels Clinic, Indiranagar, Bengaluru, Karnataka - 560038',
    city: 'Bengaluru',
    documents: [
      { name: 'ananya_kmc_2021.pdf', url: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf', type: 'application/pdf', provider: 'mock' },
      { name: 'mbbs_provisional_iyer.pdf', url: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf', type: 'application/pdf', provider: 'mock' },
    ],
    documentsUrl: 'ananya_kmc_2021.pdf, mbbs_provisional_iyer.pdf',
    status: 'PENDING',
  },
  {
    fullName: 'Dr. Sarfaraz Ahmed',
    email: 's.ahmed.cardio@mockhospital.org',
    phone: '9988776655',
    specialization: 'Cardiology (Heart Specialist)',
    experienceYears: 12,
    medicalRegistrationNumber: 'MMC-55432',
    councilName: 'Maharashtra Medical Council',
    highestDegree: 'MBBS, MD, DM (Cardiology)',
    clinicName: 'Metro Heart Institute',
    clinicAddress: 'Metro Heart Institute, Bandra West, Mumbai, Maharashtra - 400050',
    city: 'Mumbai',
    documents: [
      { name: 'dm_cardio_degree_ahmed.pdf', url: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf', type: 'application/pdf', provider: 'mock' },
      { name: 'mmc_registration_active.pdf', url: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf', type: 'application/pdf', provider: 'mock' },
    ],
    documentsUrl: 'dm_cardio_degree_ahmed.pdf, mmc_registration_active.pdf',
    status: 'PENDING',
  },
];

async function seedDoctorApplications() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');

  await mongoose.connect(process.env.MONGO_URI);

  for (const application of mockApplications) {
    await DoctorApplication.findOneAndUpdate(
      {
        $or: [
          { email: application.email },
          { medicalRegistrationNumber: application.medicalRegistrationNumber },
        ],
      },
      application,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
  }

  console.log(`${mockApplications.length} mock doctor applications seeded.`);
}

seedDoctorApplications()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
