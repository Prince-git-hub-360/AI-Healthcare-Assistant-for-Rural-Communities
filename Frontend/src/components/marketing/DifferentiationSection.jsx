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
    <section id="difference" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          PURPOSE-BUILT PRODUCT
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          Not another generic healthcare chatbot.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          Swasthya Sanchar AI is designed specifically around the communication gap that exists between healthcare instructions and patient understanding.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-stone-100 border-b border-stone-200 text-stone-700 font-extrabold">
                <th className="py-4 px-6">Capability & Feature</th>
                <th className="py-4 px-6 text-stone-500">Generic Chatbots</th>
                <th className="py-4 px-6 text-[#0F766E] bg-teal-50/60">Swasthya Sanchar AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-semibold text-stone-800">
              {comparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-stone-900">{row.feature}</td>
                  <td className="py-4 px-6 text-stone-500 flex items-center gap-2">
                    <CloseIcon size={16} color="#9ca3af" />
                    <span>{row.generic}</span>
                  </td>
                  <td className="py-4 px-6 text-[#0F766E] bg-teal-50/30 font-bold flex items-center gap-2">
                    <CheckIcon size={16} color="#0F766E" />
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
