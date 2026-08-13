import React from 'react';
import { CheckIcon, CloseIcon } from '../../shared/icons/Icons';

export const DifferentiationSection = () => {
  const comparisons = [
    { feature: 'Focus Area', generic: 'General chat & generic answers', swasthya: 'Prescription-focused communication & extraction' },
    { feature: 'Language Processing', generic: 'English-first text responses', swasthya: '22+ Indian regional languages & spoken voice TTS' },
    { feature: 'Accessibility', generic: 'Text-heavy typing interface', swasthya: 'Voice-first 1-tap audio playback for zero-literacy' },
    { feature: 'Ecosystem Support', generic: 'Individual patient-only chat', swasthya: 'Integrated Patient + ASHA Worker + Doctor + Caregiver hub' },
    { feature: 'Medication Safety', generic: 'Generic web advice', swasthya: 'Preserves exact prescription dosage, timing & duration' },
  ];

  return (
    <section id="difference" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 space-y-12 md:space-y-16 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          PURPOSE-BUILT PRODUCT
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          Not another generic healthcare chatbot.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          Swasthya Sanchar AI is designed specifically around the communication gap that exists between healthcare instructions and patient understanding.
        </p>
      </div>

      <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base">
            <thead>
              <tr className="bg-stone-100 dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-200 font-extrabold">
                <th className="py-5 px-6">Capability & Feature</th>
                <th className="py-5 px-6 text-stone-500 dark:text-slate-400">Generic Chatbots</th>
                <th className="py-5 px-6 text-[#0F766E] dark:text-teal-300 bg-teal-50/60 dark:bg-teal-950/60">Swasthya Sanchar AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-slate-800 font-semibold text-stone-800 dark:text-slate-200">
              {comparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="py-5 px-6 font-bold text-stone-900 dark:text-white">{row.feature}</td>
                  <td className="py-5 px-6 text-stone-500 dark:text-slate-400 flex items-center gap-2.5">
                    <CloseIcon size={18} color="#9ca3af" />
                    <span>{row.generic}</span>
                  </td>
                  <td className="py-5 px-6 text-[#0F766E] dark:text-teal-300 bg-teal-50/30 dark:bg-teal-950/40 font-bold flex items-center gap-2.5">
                    <CheckIcon size={18} className="text-[#0B4F42] dark:text-teal-400" />
                    <span>{row.swasthya}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DifferentiationSection;
