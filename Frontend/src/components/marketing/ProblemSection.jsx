import React from 'react';
import { AlertIcon } from '../../shared/icons/Icons';

export const ProblemSection = () => {
  const cards = [
    {
      id: '01',
      title: 'Difficult Handwriting',
      desc: 'Doctor prescriptions may contain handwriting, abbreviations and medical terminology that are difficult for patients to interpret.',
    },
    {
      id: '02',
      title: 'Language Barriers',
      desc: 'Healthcare instructions may not be available in the regional language patients understand most comfortably.',
    },
    {
      id: '03',
      title: 'Low Health Literacy',
      desc: 'Patients may recognize a medicine but still be unsure about exact dosage, timing, duration or special meal instructions.',
    },
    {
      id: '04',
      title: 'Missed Medication & Follow-Up',
      desc: 'Without clear guidance, patients frequently miss doses or discontinue treatments prematurely.',
    },
  ];

  return (
    <section id="problem" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full">
          THE REAL HEALTHCARE CHALLENGE
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          A prescription is only useful when a patient can understand it.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          For many rural and underserved patients, the primary barrier is not simply reaching a clinic—it is making sense of instructions after leaving the doctor’s office.
        </p>
      </div>

      {/* 4 Problem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-stone-200 p-6 rounded-3xl shadow-xs space-y-3 relative overflow-hidden"
          >
            <span className="text-2xl font-extrabold text-stone-300 block">{c.id}</span>
            <h3 className="font-extrabold text-base text-stone-900">{c.title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Visual Consequence Chain */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-widest">
          <AlertIcon size={18} color="#b45309" />
          <span>VISUAL CONSEQUENCE CHAIN</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs">
            <div className="text-xs font-extrabold text-stone-900">Complex Prescription</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Unclear Handwriting</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs">
            <div className="text-xs font-extrabold text-stone-900">Misunderstanding</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Uncertain Timing</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs">
            <div className="text-xs font-extrabold text-stone-900">Incorrect Dosing</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Missed Meals</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs">
            <div className="text-xs font-extrabold text-stone-900">Reduced Adherence</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Treatment Drop-off</div>
          </div>

          <div className="bg-[#0F766E] text-white p-3.5 rounded-2xl shadow-xs">
            <div className="text-xs font-extrabold">Swasthya Sanchar Goal</div>
            <div className="text-[11px] text-teal-100 mt-0.5">Communication Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
