import React from 'react';
import { DocumentIcon, BrainIcon, HeartIcon, PillIcon, PhoneIcon, ShieldIcon } from '../../shared/icons/Icons';

export const ServicesSection = () => {
  const services = [
    { title: 'Medical Documents', desc: 'Secure storage & OCR translation for lab reports, bills, and hospital discharge summaries.', icon: DocumentIcon },
    { title: 'Prescription Understanding', desc: 'Instant extraction of medicines, dosages, timings, and duration into simple regional audio.', icon: BrainIcon },
    { title: 'Health Education', desc: 'Bite-sized healthcare guidance on hygiene, nutrition, and disease prevention in native languages.', icon: HeartIcon },
    { title: 'Symptom Information', desc: 'Basic non-diagnostic first-aid information and guidance on when to visit the nearest clinic.', icon: ShieldIcon },
    { title: 'Medication Support', desc: 'Personalized daily medication schedules, audio reminders, and ASHA field worker coordination.', icon: PillIcon },
    { title: 'Emergency Information', desc: 'Direct dial connection to 108 National Ambulance & nearby Primary Health Center directory.', icon: PhoneIcon },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          HEALTHCARE SERVICES SUITE
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          One communication layer for multiple healthcare needs.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          Comprehensive healthcare access services built for rural patients, caregivers, and community workers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white border border-stone-200 p-6 rounded-3xl space-y-3 shadow-xs hover:border-[#0F766E] transition-all">
              <div className="w-10 h-10 bg-teal-100 text-[#0F766E] rounded-xl flex items-center justify-center">
                <Icon size={20} color="#0F766E" />
              </div>
              <h3 className="font-extrabold text-base text-stone-900">{s.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;
