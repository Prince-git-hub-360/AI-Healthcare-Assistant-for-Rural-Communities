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
    <section id="faq" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12 bg-white rounded-3xl border border-stone-200 shadow-xs my-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          Everything you need to know about Swasthya Sanchar AI.
        </h2>
        <p className="text-sm md:text-base text-stone-600">
          Clear answers to common questions about our healthcare communication platform.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-[#FDFBF7] border border-stone-200 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-extrabold text-sm text-stone-900 cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon size={18} color="#0F766E" />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-200/60 pt-3">
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
