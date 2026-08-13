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
    <section id="problem" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 space-y-12 md:space-y-16 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-4 py-1.5 rounded-full inline-block">
          THE REAL HEALTHCARE CHALLENGE
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          A prescription is only useful when a patient can understand it.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          For many rural and underserved patients, the primary barrier is not simply reaching a clinic—it is making sense of instructions after leaving the doctor’s office.
        </p>
      </div>

      {/* 4 Problem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {cards.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden"
          >
            <span className="text-3xl font-extrabold text-stone-300 dark:text-slate-600 block">{c.id}</span>
            <h3 className="font-bold text-lg sm:text-xl text-stone-900 dark:text-white">{c.title}</h3>
            <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Visual Consequence Chain */}
      <div className="bg-amber-50/80 dark:bg-[#161F30] border border-amber-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 transition-colors">
        <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-300 font-extrabold text-xs sm:text-sm uppercase tracking-widest">
          <AlertIcon size={20} className="text-amber-600 dark:text-amber-400" />
          <span>VISUAL CONSEQUENCE CHAIN</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="bg-white dark:bg-slate-800 p-4.5 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-xs">
            <div className="text-sm font-bold text-stone-900 dark:text-white">Complex Prescription</div>
            <div className="text-xs text-stone-500 dark:text-slate-400 mt-1">Unclear Handwriting</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4.5 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-xs">
            <div className="text-sm font-bold text-stone-900 dark:text-white">Misunderstanding</div>
            <div className="text-xs text-stone-500 dark:text-slate-400 mt-1">Uncertain Timing</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4.5 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-xs">
            <div className="text-sm font-bold text-stone-900 dark:text-white">Incorrect Dosing</div>
            <div className="text-xs text-stone-500 dark:text-slate-400 mt-1">Missed Meals</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4.5 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-xs">
            <div className="text-sm font-bold text-stone-900 dark:text-white">Reduced Adherence</div>
            <div className="text-xs text-stone-500 dark:text-slate-400 mt-1">Treatment Drop-off</div>
          </div>

          <div className="bg-[#0B4F42] dark:bg-teal-600 text-white p-4.5 rounded-2xl shadow-sm">
            <div className="text-sm font-bold">Swasthya Sanchar Goal</div>
            <div className="text-xs text-teal-100 mt-1">Communication Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
