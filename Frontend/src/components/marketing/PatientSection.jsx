import React from 'react';
import { DocumentIcon, SpeakerIcon, PillIcon, TranslateIcon, PhoneIcon } from '../../shared/icons/Icons';

export const PatientSection = () => {
  return (
    <section id="patients" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          ZERO-LITERACY ACCESSIBLE DESIGN
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          Designed for patients who should not need a medical degree to use it.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          High-contrast touch targets, native audio playback, and visual icons engineered for users with limited digital or language literacy.
        </p>
      </div>

      {/* Realistic Mobile Application Mockup */}
      <div className="max-w-md mx-auto bg-stone-900 rounded-[40px] p-4 shadow-2xl border-4 border-stone-800">
        <div className="bg-[#FDFBF7] rounded-[32px] p-6 space-y-6 text-stone-900">
          {/* Mobile Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-[#0F766E] uppercase tracking-widest block">SWASTHYA SANCHAR</span>
              <h4 className="text-base font-extrabold text-stone-900">Good Morning 👋</h4>
            </div>
            <span className="bg-teal-100 text-[#0F766E] text-[10px] font-extrabold px-2.5 py-1 rounded-full">
              🇮🇳 ಕನ್ನಡ (Kannada)
            </span>
          </div>

          {/* Large Accessibility Touch Targets */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0F766E] text-white p-4 rounded-2xl text-center space-y-2 cursor-pointer shadow-md">
              <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center mx-auto">
                <DocumentIcon size={18} color="#fff" />
              </div>
              <div className="font-extrabold text-xs">📄 Upload Rx</div>
            </div>

            <div className="bg-[#EA580C] text-white p-4 rounded-2xl text-center space-y-2 cursor-pointer shadow-md">
              <div className="w-8 h-8 bg-orange-700 rounded-xl flex items-center justify-center mx-auto">
                <SpeakerIcon size={18} color="#fff" />
              </div>
              <div className="font-extrabold text-xs">🔊 Listen Audio</div>
            </div>

            <div className="bg-white border border-stone-300 p-4 rounded-2xl text-center space-y-2 cursor-pointer shadow-xs">
              <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto font-bold">
                <PillIcon size={18} color="#d97706" />
              </div>
              <div className="font-extrabold text-xs text-stone-900">💊 Today Meds</div>
            </div>

            <div className="bg-white border border-stone-300 p-4 rounded-2xl text-center space-y-2 cursor-pointer shadow-xs">
              <div className="w-8 h-8 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto font-bold">
                <PhoneIcon size={18} color="#dc2626" />
              </div>
              <div className="font-extrabold text-xs text-red-700">🚑 108 SOS</div>
            </div>
          </div>

          {/* Sample Patient Medication Card */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-emerald-950">
              <span>Paracetamol 500 mg</span>
              <span className="bg-emerald-200 text-emerald-900 text-[10px] px-2 py-0.5 rounded-full">5 Days</span>
            </div>
            <div className="text-xs text-emerald-800 font-bold space-y-0.5">
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
