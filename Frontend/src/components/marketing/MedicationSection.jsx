import React, { useState } from 'react';
import { PillIcon } from '../../shared/icons/Icons';

export const MedicationSection = () => {
  const [schedule, setSchedule] = useState([
    { id: 1, slot: 'Morning', med: 'Paracetamol 500 mg', detail: '1 tablet after breakfast (PC)', taken: true },
    { id: 2, slot: 'Afternoon', med: 'Cough Syrup', detail: '2 teaspoons after lunch (PC)', taken: false },
    { id: 3, slot: 'Night', med: 'Paracetamol 500 mg', detail: '1 tablet after dinner (HS)', taken: false },
  ]);

  const toggleSlot = (id) => {
    setSchedule(schedule.map(s => s.id === id ? { ...s, taken: !s.taken } : s));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 space-y-12 md:space-y-16 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          INTERACTIVE MEDICATION SCHEDULE
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          Make medication schedules easier to understand.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          Organizing complex prescriptions into clean morning, afternoon, and bedtime dosage slots.
        </p>
      </div>

      <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-md max-w-4xl mx-auto space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 dark:border-slate-800 pb-5">
          <div>
            <h3 className="font-bold text-xl text-stone-900 dark:text-white flex items-center gap-2.5">
              <PillIcon size={24} className="text-[#0B4F42] dark:text-teal-400" /> Today's Medication Timeline
            </h3>
            <p className="text-sm text-stone-500 dark:text-slate-400 mt-0.5">Tap a dose slot to test marking as taken or pending</p>
          </div>
          <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-extrabold px-3.5 py-1 rounded-full border border-amber-300 dark:border-amber-800">
            DEMO DATA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schedule.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleSlot(item.id)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-4 flex flex-col justify-between ${
                item.taken
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 shadow-xs'
                  : 'bg-[#FDFBF7] dark:bg-slate-900 border-stone-200 dark:border-slate-800 hover:border-[#0F766E] dark:hover:border-teal-500 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-3 py-1 rounded-lg">
                  {item.slot}
                </span>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                  item.taken ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-200' : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200'
                }`}>
                  {item.taken ? '✓ Taken' : '○ Pending'}
                </span>
              </div>

              <div>
                <div className="font-bold text-base sm:text-lg text-stone-900 dark:text-white">{item.med}</div>
                <div className="text-sm text-stone-600 dark:text-slate-300 mt-1 leading-relaxed">{item.detail}</div>
              </div>

              <div className="pt-3 border-t border-stone-200/60 dark:border-slate-800 text-xs font-bold text-[#0F766E] dark:text-teal-300">
                {item.taken ? 'Tap to mark pending' : 'Tap to mark taken →'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MedicationSection;
