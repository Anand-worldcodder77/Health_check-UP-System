import React from 'react';
import { Truck, Headset, Zap, MapPin, Users, HeartHandshake } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    { id: '01', title: "Free & On-time Sample Collection", icon: <Truck size={32} />, desc: "Home collection at your comfort." },
    { id: '02', title: "Free Report Counselling", icon: <Headset size={32} />, desc: "Expert guidance on your results." },
    { id: '03', title: "Fast & Accurate Test Reports", icon: <Zap size={32} />, desc: "Get results within 24 hours." },
    { id: '04', title: "Presence in 250+ Cities", icon: <MapPin size={32} />, desc: "Widest network across India." },
    { id: '05', title: "2500+ Phlebotomists", icon: <Users size={32} />, desc: "Largest fleet of experts." },
    { id: '06', title: "85 Lakh+ Satisfied Customers", icon: <HeartHandshake size={32} />, desc: "Trust of millions." },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-black text-[#009494] mb-16 tracking-tight">
          Why Choose <span className="text-[#FF6F61]">Healthians</span>
        </h2>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
          {features.map((f) => (
            <div key={f.id} className="group flex flex-col items-center">
              <div className="relative mb-6">
                <span className="absolute -top-4 -left-6 text-4xl font-black text-gray-100 italic group-hover:text-teal-50 transition-colors">
                  {f.id}
                </span>
                <div className="relative z-10 p-5 bg-teal-50 text-[#009494] rounded-2xl group-hover:bg-[#009494] group-hover:text-white transition-all duration-300 shadow-sm">
                  {f.icon}
                </div>
              </div>
              <h4 className="text-[13px] font-black leading-tight text-gray-700 uppercase tracking-tighter">
                {f.title}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;