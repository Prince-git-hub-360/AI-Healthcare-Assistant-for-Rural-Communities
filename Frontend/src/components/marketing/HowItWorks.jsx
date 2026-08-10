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
    <section id="how-it-works" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          CONNECTED PRODUCT WORKFLOW
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          From prescription to understanding.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          A seamless 7-step communication pipeline designed to bridge the gap between doctor notes and patient comprehension.
        </p>
      </div>

      {/* 7 Connected Steps Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-stone-200 p-4 rounded-2xl space-y-2 flex flex-col justify-between shadow-xs hover:border-[#0F766E] transition-colors relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0F766E] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                  {s.num}
                </span>
                <Icon size={16} color="#0F766E" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-stone-900">{s.title}</h3>
                <p className="text-[11px] text-stone-500 mt-1 leading-normal">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
