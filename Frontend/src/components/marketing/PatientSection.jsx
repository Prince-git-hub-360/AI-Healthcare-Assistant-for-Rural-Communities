import React from 'react';
import { DocumentIcon, SpeakerIcon, PillIcon, PhoneIcon } from '../../shared/icons/Icons';

export const PatientSection = () => {
  return (
    <section id="patients" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 space-y-12 md:space-y-16 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          ZERO-LITERACY ACCESSIBLE DESIGN
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          Designed for patients who should not need a medical degree to use it.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          High-contrast touch targets, native audio playback, and visual icons engineered for users with limited digital or language literacy.
        </p>
      </div>

      {/* Realistic Mobile Application Mockup */}
      <div className="max-w-md mx-auto bg-stone-900 rounded-[44px] p-4 shadow-2xl border-4 border-stone-800">
        <div className="bg-[#FDFBF7] dark:bg-slate-900 rounded-[36px] p-7 space-y-6 text-stone-900 dark:text-white transition-colors">
          {/* Mobile Header */}
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest block">SWASTHYA SANCHAR</span>
              <h4 className="text-lg font-extrabold text-stone-900 dark:text-white">Good Morning 👋</h4>
            </div>
            <span className="bg-teal-100 dark:bg-teal-900/60 text-[#0F766E] dark:text-teal-300 text-xs font-extrabold px-3 py-1 rounded-full">
              🇮🇳 ಕನ್ನಡ (Kannada)
            </span>
          </div>

          {/* Large Accessibility Touch Targets */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-[#0B4F42] dark:bg-teal-600 text-white p-4.5 rounded-2xl text-center space-y-2 cursor-pointer shadow-md">
              <div className="w-10 h-10 bg-teal-700 rounded-xl flex items-center justify-center mx-auto">
                <DocumentIcon size={20} color="#fff" />
              </div>
              <div className="font-bold text-sm">📄 Upload Rx</div>
            </div>

            <div className="bg-[#EA580C] text-white p-4.5 rounded-2xl text-center space-y-2 cursor-pointer shadow-md">
              <div className="w-10 h-10 bg-orange-700 rounded-xl flex items-center justify-center mx-auto">
                <SpeakerIcon size={20} color="#fff" />
              </div>
              <div className="font-bold text-sm">🔊 Listen Audio</div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 p-4.5 rounded-2xl text-center space-y-2 cursor-pointer shadow-xs">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 rounded-xl flex items-center justify-center mx-auto font-bold">
                <PillIcon size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div className="font-bold text-sm text-stone-900 dark:text-white">💊 Today Meds</div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 p-4.5 rounded-2xl text-center space-y-2 cursor-pointer shadow-xs">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 rounded-xl flex items-center justify-center mx-auto font-bold">
                <PhoneIcon size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="font-bold text-sm text-red-700 dark:text-red-300">🚑 108 SOS</div>
            </div>
          </div>

          {/* Sample Patient Medication Card */}
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between text-sm font-extrabold text-emerald-950 dark:text-emerald-200">
              <span>Paracetamol 500 mg</span>
              <span className="bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs px-2.5 py-0.5 rounded-full">5 Days</span>
            </div>
            <div className="text-sm text-emerald-800 dark:text-emerald-300 font-bold space-y-1">
              <div>☀️ Morning — 1 tablet</div>
              <div>🌙 Night — 1 tablet</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientSection;
