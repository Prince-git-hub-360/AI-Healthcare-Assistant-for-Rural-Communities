import React from 'react';
import { AlertIcon } from '../../shared/icons/Icons';

export const SafetySection = () => {
  const principles = [
    { num: '1', title: 'Preserve Source Instructions', desc: 'Prescription details, dosage quantities, and timing are strictly matched to the original doctor note.' },
    { num: '2', title: 'Avoid Unsupported Diagnoses', desc: 'The system does not generate unverified medical diagnoses or prescribe new treatments.' },
    { num: '3', title: 'Identify AI-Generated Content', desc: 'All simplified text and audio guidance are clearly demarcated as AI communication assistance.' },
    { num: '4', title: 'Keep Professionals in the Loop', desc: 'Doctors and ASHA workers remain the primary authority for medical consultation and care.' },
    { num: '5', title: 'Protect Patient Information', desc: 'Patient healthcare data is safeguarded through secure access controls and encrypted storage.' },
    { num: '6', title: 'Uncertainty & Verification', desc: 'If a handwritten prescription is unclear, the system encourages professional verification.' },
  ];

  return (
    <section id="safety" className="scroll-mt-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-20 md:py-24 space-y-12 md:space-y-16 bg-white dark:bg-[#161F30] rounded-3xl border border-stone-200/80 dark:border-slate-800 shadow-sm my-12 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          RESPONSIBLE AI & GOVERNANCE
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          AI that assists. Humans remain in control.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          Engineered with safety guardrails to improve healthcare understanding without replacing clinical decision-making.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {principles.map((p) => (
          <div key={p.num} className="bg-[#FDFBF7] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-8 rounded-3xl space-y-3.5 hover:border-[#0F766E] dark:hover:border-teal-500 transition-all hover:shadow-md">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/60 text-[#0F766E] dark:text-teal-300 font-extrabold rounded-2xl flex items-center justify-center text-sm">
              {p.num}
            </div>
            <h3 className="font-bold text-lg sm:text-xl text-stone-900 dark:text-white">{p.title}</h3>
            <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-sm sm:text-base text-amber-950 dark:text-amber-200 transition-colors">
        <AlertIcon size={24} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold text-amber-950 dark:text-amber-100">Medical Disclaimer:</strong> Swasthya Sanchar AI is a communication and understanding assistant. It does not replace qualified healthcare professionals.
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
