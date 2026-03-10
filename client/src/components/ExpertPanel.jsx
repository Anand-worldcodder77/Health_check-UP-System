import React from 'react';
import { Award, Zap, ShieldCheck } from 'lucide-react';

const experts = [
  {
    name: "Dr. Savita Bhardwaj",
    qualification: "MD, Pathology (Gold Medalist)",
    regNo: "MCI-12450",
    specialty: "Advanced Histopathology & Cytology",
    experience: "22+ Years of Clinical Excellence",
    image: "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-with-stethoscope-around-neck-standing-with-folded-arms-isolated-on-white-background_613910-15307.jpg", 
    verified: true,
    description: "Ex-HOD at City Hospital, specializing in early-stage cancer detection through cell analysis."
  },
  {
    name: "Dr. Arpan Mukherjee",
    qualification: "MD, Biochemistry (AIIMS)",
    regNo: "MCI-88921",
    specialty: "Metabolic & Hormonal Disorders",
    experience: "14+ Years Experience",
    image: "https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man-stethoscopes-white-medical-gown-standing-isolated-white-background_613910-15418.jpg", 
    verified: true,
    description: "Expert in Diabetes management and Thyroid function trends using automated AI-Pathology."
  },
  {
    name: "Dr. Neha Kulkarni",
    qualification: "MD, Microbiology",
    regNo: "MCI-55340",
    specialty: "Infectious Diseases & Immunology",
    experience: "10+ Years Experience",
    image: "https://img.freepik.com/free-photo/doctor-offering-medical-assistance_23-2148112836.jpg", 
    verified: true,
    description: "Specializes in Fever Panels, Allergy triggers, and Auto-immune response analysis."
  }
];

const ExpertPanel = () => {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-50 rounded-full blur-[150px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="bg-blue-100 text-blue-700 font-black text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-2 mb-4 uppercase tracking-widest ring-4 ring-blue-50">
            <Award size={16} /> Verified Medical Accuracy
          </div>

          {/* ✅ FIXED HERE */}
          <h2 className="text-4xl md:text-5xl font-black text-slate-950 leading-tight tracking-tighter">
            Reports Reviewed by <br/>
            <span className="text-blue-600">Top MD Pathologists</span>
          </h2>

          <p className="text-slate-600 font-medium text-lg mt-5 leading-relaxed">
            Your health is too precious for compromises. Our expert panel ensures every report meets precise clinical standards.
          </p>
        </div>

        {/* Experts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {experts.map((doctor, index) => (
            <div key={index} className="bg-slate-50 p-8 rounded-[35px] border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
              
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl ring-2 ring-blue-100"
                  />
                  {doctor.verified && (
                    <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1.5 rounded-full border-2 border-white">
                      <ShieldCheck size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-snug">
                    {doctor.name}
                  </h3>
                  <p className="text-blue-600 font-bold text-sm">
                    {doctor.qualification}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-slate-700 bg-white px-4 py-2.5 rounded-xl font-medium text-sm">
                  <Zap size={18} className="text-blue-500" /> Specialist: {doctor.specialty}
                </div>
                <div className="flex items-center gap-3 text-slate-700 bg-white px-4 py-2.5 rounded-xl font-medium text-sm">
                  <Award size={18} className="text-blue-500" /> {doctor.experience}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 text-center">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    Ensuring precision in every sample analyzed. 
                 </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ExpertPanel;