import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: "Rahul Sharma",
      location: "New Delhi",
      text: "Reports ek dum time par mili aur home collection wala staff bahut professional tha. Best service!",
      rating: 5
    },
    {
      name: "Priya Verma",
      location: "Mumbai",
      text: "HealthChecks ka interface bahut easy hai. Maine Winter Wellness package book kiya tha, kafi affordable hai.",
      rating: 5
    },
    {
      name: "Amit Patel",
      location: "Ahmedabad",
      text: "Cardiac markers test ke liye ye sabse best platform hai. Reports ki accuracy bahut acchi hai.",
      rating: 4
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[#009494] font-black text-xs uppercase tracking-[0.4em] mb-4">Patient Feedback</h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
            TRUSTED BY <span className="text-[#FF6F61]">10,000+</span> HAPPY PATIENTS
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-gray-50 p-10 rounded-[40px] relative group hover:bg-[#009494] transition-all duration-500">
              <Quote className="text-[#009494] group-hover:text-white/20 absolute top-8 right-8" size={40} />
              
              <div className="flex mb-6">
                {[...Array(rev.rating)].map((_, s) => (
                  <Star key={s} size={16} fill="currentColor" className="text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-600 group-hover:text-white font-bold text-lg leading-relaxed mb-8 italic">
                "{rev.text}"
              </p>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#009494] group-hover:bg-white/20 rounded-full flex items-center justify-center text-white font-black">
                  {rev.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="font-black text-gray-900 group-hover:text-white uppercase text-sm tracking-widest">{rev.name}</h4>
                  <p className="text-gray-400 group-hover:text-white/60 text-xs font-bold">{rev.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;