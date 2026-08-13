import React from 'react';
import { BrainIcon, DocumentIcon, TranslateIcon, SpeakerIcon, ShieldIcon } from '../../shared/icons/Icons';

export const TechnologySection = () => {
  const pipeline = [
    'Document Image',
    'OCR Vision',
    'Medical Extraction',
    'NLP Processing',
    'LLM Simplification',
    'Regional Translation',
    'Text-to-Speech',
    'Patient Guidance',
  ];

  const cards = [
    { title: 'OCR & Vision Intelligence', desc: 'Extract handwritten and printed text from prescription images.', icon: DocumentIcon },
    { title: 'Medical NLP', desc: 'Identify critical clinical entities like medicine names, dosages, and timing.', icon: BrainIcon },
    { title: 'Information Extraction', desc: 'Isolate meal requirements (before/after food) and course duration.', icon: ShieldIcon },
    { title: 'LLM Simplification', desc: 'Use Gemini & Groq LLMs to rewrite medical jargon into simple language.', icon: BrainIcon },
    { title: 'Multilingual Translation', desc: 'Translate explanations into 22+ regional Indian languages.', icon: TranslateIcon },
    { title: 'Text-to-Speech (TTS)', desc: 'Generate clear spoken audio guidance for low-literacy users.', icon: SpeakerIcon },
  ];

  return (
    <section id="ai-technology" className="scroll-mt-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-20 md:py-24 space-y-12 md:space-y-16 bg-white dark:bg-[#161F30] rounded-3xl border border-stone-200/80 dark:border-slate-800 shadow-sm my-12 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          AI PIPELINE ARCHITECTURE
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          AI built around healthcare communication.
        </h2>
        <p className="text-base sm:text-lg text-[#525252] dark:text-slate-300 leading-relaxed">
          Powered by vision OCR, Groq LLM inference acceleration, specialized medical information extraction, and native voice synthesis.
        </p>
      </div>

      {/* Pipeline Diagram */}
      <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-8 rounded-3xl space-y-4 transition-colors">
        <div className="text-xs font-extrabold text-stone-500 dark:text-slate-400 uppercase tracking-widest text-center">
          END-TO-END PROCESSING PIPELINE
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 text-center text-sm font-bold text-stone-800 dark:text-slate-200">
          {pipeline.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white px-4 py-2 rounded-xl shadow-xs">
                {step}
              </div>
              {idx < pipeline.length - 1 && <span className="text-[#0F766E] dark:text-teal-400 font-extrabold text-base">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 6 Tech Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="bg-[#FDFBF7] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-8 rounded-3xl space-y-4 hover:border-[#0F766E] dark:hover:border-teal-500 transition-all hover:shadow-md">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/60 text-[#0F766E] dark:text-teal-300 rounded-2xl flex items-center justify-center">
                <Icon size={24} className="text-[#0B4F42] dark:text-teal-300" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-stone-900 dark:text-white">{c.title}</h3>
              <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed">{c.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TechnologySection;
