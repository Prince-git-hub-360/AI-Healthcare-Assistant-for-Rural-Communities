import React from 'react';
import { DocumentIcon, BrainIcon, HeartIcon, TranslateIcon, SpeakerIcon, ClockIcon } from '../../shared/icons/Icons';

export const HowItWorks = () => {
  const steps = [
    { num: '01', title: 'Upload', desc: 'Patient or ASHA worker uploads a prescription or medical document image.', icon: DocumentIcon },
    { num: '02', title: 'Extract', desc: 'OCR & medical NLP extract text and key medical information.', icon: BrainIcon },
    { num: '03', title: 'Understand', desc: 'Identify medicine names, dosage, timing, duration and meal instructions.', icon: HeartIcon },
    { num: '04', title: 'Simplify', desc: 'Convert complex medical jargon into easy-to-understand explanations.', icon: BrainIcon },
    { num: '05', title: 'Translate', desc: 'Translate explanation into the patient’s preferred regional language.', icon: TranslateIcon },
    { num: '06', title: 'Listen', desc: 'Generate clear text-to-speech audio guidance for low-literacy users.', icon: SpeakerIcon },
    { num: '07', title: 'Remember', desc: 'Organize dosage schedules and reminder notifications.', icon: ClockIcon },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 space-y-12 md:space-y-16 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          CONNECTED PRODUCT WORKFLOW
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          From prescription to understanding.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          A seamless 7-step communication pipeline designed to bridge the gap between doctor notes and patient comprehension.
        </p>
      </div>

      {/* 7 Connected Steps Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 flex flex-col justify-between shadow-xs hover:border-[#0F766E] dark:hover:border-teal-500 transition-all hover:shadow-md relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 bg-teal-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 px-2.5 py-1 rounded-lg">
                  {s.num}
                </span>
                <Icon size={18} className="text-[#0B4F42] dark:text-teal-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">{s.title}</h3>
                <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
