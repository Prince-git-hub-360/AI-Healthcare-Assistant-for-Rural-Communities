import React from 'react';
import { BrainIcon, DocumentIcon, TranslateIcon, SpeakerIcon, ShieldIcon, CheckIcon } from '../../shared/icons/Icons';

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
    <section id="ai-technology" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12 bg-white rounded-3xl border border-stone-200 shadow-xs my-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          AI PIPELINE ARCHITECTURE
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          AI built around healthcare communication.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          Powered by vision OCR, Groq LLM inference acceleration, specialized medical information extraction, and native voice synthesis.
        </p>
      </div>

      {/* Pipeline Diagram */}
      <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl">
        <div className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest text-center mb-4">
          END-TO-END PROCESSING PIPELINE
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs font-bold text-stone-800">
          {pipeline.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-white border border-stone-300 px-3 py-1.5 rounded-xl shadow-xs">
                {step}
              </div>
              {idx < pipeline.length - 1 && <span className="text-[#0F766E] font-extrabold">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 6 Tech Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="bg-[#FDFBF7] border border-stone-200 p-6 rounded-2xl space-y-2 hover:border-[#0F766E] transition-all">
              <div className="w-10 h-10 bg-teal-100 text-[#0F766E] rounded-xl flex items-center justify-center">
                <Icon size={20} color="#0F766E" />
              </div>
              <h3 className="font-extrabold text-sm text-stone-900">{c.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{c.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TechnologySection;
