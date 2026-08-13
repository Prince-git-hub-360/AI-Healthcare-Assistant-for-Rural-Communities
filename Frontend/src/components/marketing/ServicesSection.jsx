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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 space-y-12 md:space-y-16 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          HEALTHCARE SERVICES SUITE
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          One communication layer for multiple healthcare needs.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          Comprehensive healthcare access services built for rural patients, caregivers, and community workers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 p-8 rounded-3xl space-y-4 shadow-sm hover:shadow-md hover:border-[#0F766E] dark:hover:border-teal-500 transition-all">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/60 text-[#0F766E] dark:text-teal-300 rounded-2xl flex items-center justify-center">
                <Icon size={24} className="text-[#0B4F42] dark:text-teal-300" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-stone-900 dark:text-white">{s.title}</h3>
              <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;
