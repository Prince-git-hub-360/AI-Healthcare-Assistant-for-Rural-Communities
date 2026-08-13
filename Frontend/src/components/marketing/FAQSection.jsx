import React, { useState } from 'react';
import { ChevronDownIcon } from '../../shared/icons/Icons';

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'Does Swasthya Sanchar AI replace doctors?',
      a: 'No. Swasthya Sanchar AI is a communication and understanding assistant. It is designed to help patients understand prescriptions and doctor notes. It does not provide medical diagnoses or replace qualified medical professionals.',
    },
    {
      q: 'Which languages can it support?',
      a: 'The platform supports 22+ Indian regional languages including Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Gujarati, Malayalam, and English, with spoken voice audio playback.',
    },
    {
      q: 'Can it understand prescriptions?',
      a: 'Yes. Uploaded prescription images are processed using Optical Character Recognition (OCR) and specialized medical NLP to extract medicine names, dosages, frequencies, and durations.',
    },
    {
      q: 'How does voice guidance work?',
      a: 'Extracted prescription explanations are converted into native text-to-speech (TTS) audio with 1-tap playback, allowing low-literacy users to listen to their instructions.',
    },
    {
      q: 'How is patient information protected?',
      a: 'Patient data is protected using role-based access control, secure storage, and strict privacy guardrails so that health records remain private.',
    },
  ];

  return (
    <section id="faq" className="scroll-mt-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-20 md:py-24 space-y-12 md:space-y-16 bg-white dark:bg-[#161F30] rounded-3xl border border-stone-200/80 dark:border-slate-800 shadow-sm my-12 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          Everything you need to know about Swasthya Sanchar AI.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          Clear answers to common questions about our healthcare communication platform.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-[#FDFBF7] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl overflow-hidden transition-all shadow-xs hover:border-[#0F766E] dark:hover:border-teal-500"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-base sm:text-lg text-stone-900 dark:text-white cursor-pointer gap-4"
              >
                <span>{faq.q}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon size={20} className="text-[#0B4F42] dark:text-teal-400" />
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed border-t border-stone-200/60 dark:border-slate-800 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
