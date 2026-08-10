import React from 'react';
import { ClockIcon, HeartIcon } from '../../shared/icons/Icons';

export const CaregiverSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12 bg-white rounded-3xl border border-stone-200 shadow-xs my-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          FAMILY CAREGIVER SUPPORT
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          Keep families informed when patients need support.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          Enabling sons, daughters, and family caregivers to monitor elderly parents’ daily medication adherence remotely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
        {/* Features List */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-[#FDFBF7] p-4 rounded-2xl border border-stone-200">
            <div className="w-8 h-8 bg-teal-100 text-[#0F766E] rounded-xl flex items-center justify-center font-bold text-xs">
              <ClockIcon size={18} color="#0F766E" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-stone-900">Medication Reminders</h4>
              <p className="text-xs text-stone-600 mt-0.5">Automated morning, lunch, and dinner dose notifications.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#FDFBF7] p-4 rounded-2xl border border-stone-200">
            <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold text-xs">
              <HeartIcon size={18} color="#b45309" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-stone-900">Missed-Dose Awareness</h4>
              <p className="text-xs text-stone-600 mt-0.5">Alert caregivers when an elderly family member skips a dose.</p>
            </div>
          </div>
        </div>

        {/* Caregiver Notification Example Card */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-xl border border-stone-800 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-widest">
              CAREGIVER DOSE ALERT
            </span>
            <span className="bg-amber-400 text-stone-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              PRODUCT CONCEPT
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-stone-400">👵 Patient: Ramesh Kumar (Father)</div>
            <div className="text-base font-extrabold text-white">Paracetamol 500 mg</div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-teal-300">Scheduled: 8:00 PM (Night Dose)</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">Upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaregiverSection;
