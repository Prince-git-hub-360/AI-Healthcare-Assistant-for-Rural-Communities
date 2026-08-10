import React from 'react';
import { HospitalIcon, BrainIcon } from '../../shared/icons/Icons';

export const AboutSection = () => {
  return (
    <section id="about" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          ABOUT SWASTHYA SANCHAR AI
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          Healthcare information should be understandable to everyone.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          Swasthya Sanchar AI is a capstone healthcare technology initiative focused on improving communication between healthcare providers, frontline ASHA workers, and underserved rural communities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-stone-200 p-6 md:p-8 rounded-3xl space-y-3 shadow-xs">
          <div className="w-10 h-10 bg-teal-100 text-[#0F766E] rounded-xl flex items-center justify-center font-bold">
            <HospitalIcon size={22} color="#0F766E" />
          </div>
          <h3 className="font-extrabold text-lg text-stone-900">The Rural Communication Gap</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Healthcare access is not only about reaching a doctor. It is also about understanding what the doctor says, understanding the prescription, knowing when to take medicines, and being able to ask for help when something is unclear.
          </p>
        </div>

        <div className="bg-white border border-stone-200 p-6 md:p-8 rounded-3xl space-y-3 shadow-xs">
          <div className="w-10 h-10 bg-teal-100 text-[#0F766E] rounded-xl flex items-center justify-center font-bold">
            <BrainIcon size={22} color="#0F766E" />
          </div>
          <h3 className="font-extrabold text-lg text-stone-900">The AI Communication Bridge</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Swasthya Sanchar AI acts as a human-centric communication bridge using OCR, Medical NLP, and language translation to ensure patients receive spoken audio instructions in their native language.
          </p>
        </div>
      </div>

      {/* Academic Credits & Team Context */}
      <div className="bg-[#F0FDF4] border border-[#bbf7d0] rounded-3xl p-6 md:p-8 text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] font-extrabold text-[#0F766E] uppercase tracking-widest">
          PROJECT CREDITS & INSTITUTION
        </span>
        <h3 className="text-xl font-extrabold text-[#0F766E]">Team Change_The_World</h3>
        <p className="text-xs text-stone-700 max-w-xl mx-auto leading-relaxed">
          Developed as a capstone innovation project at <strong>PES University</strong> to empower rural patients and frontline healthcare workers across India.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <div className="bg-white border border-[#bbf7d0] px-4 py-2 rounded-xl text-xs font-bold text-stone-900 shadow-xs">
            Nafees Hyder <span className="text-stone-500 font-normal block text-[11px]">Lead AI & NLP Engineer</span>
          </div>
          <div className="bg-white border border-[#bbf7d0] px-4 py-2 rounded-xl text-xs font-bold text-stone-900 shadow-xs">
            Prince Kumar <span className="text-stone-500 font-normal block text-[11px]">Full-Stack Platform Architect</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
