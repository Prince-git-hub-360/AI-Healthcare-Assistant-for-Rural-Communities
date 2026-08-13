import React from 'react';
import { HospitalIcon, BrainIcon } from '../../shared/icons/Icons';

export const AboutSection = () => {
  return (
    <section id="about" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 space-y-12 md:space-y-16 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          ABOUT SWASTHYA SANCHAR AI
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          Healthcare information should be understandable to everyone.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          Swasthya Sanchar AI is a healthcare technology initiative focused on improving communication between healthcare providers, frontline ASHA workers, and underserved rural communities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/60 text-[#0F766E] dark:text-teal-300 rounded-2xl flex items-center justify-center font-bold">
            <HospitalIcon size={26} className="text-[#0B4F42] dark:text-teal-300" />
          </div>
          <h3 className="font-bold text-xl text-stone-900 dark:text-white">The Rural Communication Gap</h3>
          <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed">
            Healthcare access is not only about reaching a doctor. It is also about understanding what the doctor says, understanding the prescription, knowing when to take medicines, and being able to ask for help when something is unclear.
          </p>
        </div>

        <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/60 text-[#0F766E] dark:text-teal-300 rounded-2xl flex items-center justify-center font-bold">
            <BrainIcon size={26} className="text-[#0B4F42] dark:text-teal-300" />
          </div>
          <h3 className="font-bold text-xl text-stone-900 dark:text-white">The AI Communication Bridge</h3>
          <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed">
            Swasthya Sanchar AI acts as a human-centric communication bridge using OCR, Medical NLP, and language translation to ensure patients receive spoken audio instructions in their native language.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
