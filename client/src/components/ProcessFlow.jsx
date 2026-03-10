import React from 'react';
import { MousePointerClick, Truck, FlaskConical, FileCheck } from 'lucide-react';

const ProcessFlow = () => {
  const steps = [
    {
      id: "01",
      title: "Book Online",
      desc: "Select your required health package and choose a convenient time slot for home collection.",
      icon: <MousePointerClick className="w-8 h-8 text-blue-600" />,
      color: "bg-blue-50"
    },
    {
      id: "02",
      title: "Sample Collection",
      desc: "Our certified Phlebo arrives at your doorstep following 100% sterilized safety protocols.",
      icon: <Truck className="w-8 h-8 text-orange-600" />,
      color: "bg-orange-50"
    },
    {
      id: "03",
      title: "Advanced Lab Testing",
      desc: "Your sample is processed in our NABL accredited labs using high-precision AI technology.",
      icon: <FlaskConical className="w-8 h-8 text-purple-600" />,
      color: "bg-purple-50"
    },
    {
      id: "04",
      title: "Digital Report",
      desc: "Receive your MD-verified smart reports on WhatsApp and Email within 6 to 24 hours.",
      icon: <FileCheck className="w-8 h-8 text-green-600" />,
      color: "bg-green-50"
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
            How It <span className="text-blue-600">Works</span>
          </h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-500 font-medium">Experience India's most tech-advanced home diagnostic service.</p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-slate-200 -z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 group">
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 flex flex-col items-center text-center h-full">
                
                {/* Step ID Bubble */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-xl group-hover:bg-blue-600 transition-colors">
                  {step.id}
                </div>

                {/* Icon Container */}
                <div className={`${step.color} p-6 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {step.icon}
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;