import React from 'react';
import { ShieldIcon, AlertIcon } from '../../shared/icons/Icons';

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
    <section id="safety" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12 bg-white rounded-3xl border border-stone-200 shadow-xs my-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          RESPONSIBLE AI & GOVERNANCE
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          AI that assists. Humans remain in control.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          Engineered with safety guardrails to improve healthcare understanding without replacing clinical decision-making.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {principles.map((p) => (
          <div key={p.num} className="bg-[#FDFBF7] border border-stone-200 p-6 rounded-2xl space-y-2">
            <div className="w-8 h-8 bg-teal-100 text-[#0F766E] font-extrabold rounded-xl flex items-center justify-center text-xs">
              {p.num}
            </div>
            <h3 className="font-extrabold text-sm text-stone-900">{p.title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-amber-950">
        <AlertIcon size={20} color="#b45309" />
        <div className="leading-relaxed">
          <strong className="font-extrabold">Medical Disclaimer:</strong> Swasthya Sanchar AI is a communication and understanding assistant. It does not replace qualified healthcare professionals.
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
