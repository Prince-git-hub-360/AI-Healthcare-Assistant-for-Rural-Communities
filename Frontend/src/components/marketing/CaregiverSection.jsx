import React from 'react';
import { ClockIcon, HeartIcon } from '../../shared/icons/Icons';

export const CaregiverSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-20 md:py-24 space-y-12 md:space-y-16 bg-white dark:bg-[#161F30] rounded-3xl border border-stone-200/80 dark:border-slate-800 shadow-sm my-12 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          FAMILY CAREGIVER SUPPORT
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          Keep families informed when patients need support.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          Enabling sons, daughters, and family caregivers to monitor elderly parents’ daily medication adherence remotely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center max-w-4xl mx-auto">
        {/* Features List */}
        <div className="space-y-5">
          <div className="flex items-start gap-4 bg-[#FDFBF7] dark:bg-slate-900 p-6 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xs transition-colors">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/60 text-[#0F766E] dark:text-teal-300 rounded-2xl flex items-center justify-center font-bold flex-shrink-0">
              <ClockIcon size={22} className="text-[#0B4F42] dark:text-teal-300" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base sm:text-lg text-stone-900 dark:text-white">Medication Reminders</h4>
              <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed">Automated morning, lunch, and dinner dose notifications.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-[#FDFBF7] dark:bg-slate-900 p-6 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xs transition-colors">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 rounded-2xl flex items-center justify-center font-bold flex-shrink-0">
              <HeartIcon size={22} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base sm:text-lg text-stone-900 dark:text-white">Missed-Dose Awareness</h4>
              <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed">Alert caregivers when an elderly family member skips a dose.</p>
            </div>
          </div>
        </div>

        {/* Caregiver Notification Example Card */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 shadow-xl border border-stone-800 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <span className="text-xs font-extrabold text-teal-400 uppercase tracking-widest">
              CAREGIVER DOSE ALERT
            </span>
            <span className="bg-amber-400 text-stone-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              PRODUCT CONCEPT
            </span>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-bold text-stone-400">👵 Patient: Ramesh Kumar (Father)</div>
            <div className="text-xl font-extrabold text-white">Paracetamol 500 mg</div>
            <div className="flex items-center justify-between text-sm pt-2">
              <span className="text-teal-300 font-semibold">Scheduled: 8:00 PM (Night Dose)</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg font-bold">Upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaregiverSection;
