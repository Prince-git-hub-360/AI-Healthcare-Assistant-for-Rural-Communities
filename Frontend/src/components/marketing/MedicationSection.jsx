import React, { useState } from 'react';
import { PillIcon, CheckIcon, ClockIcon } from '../../shared/icons/Icons';

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
    <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          INTERACTIVE MEDICATION SCHEDULE
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          Make medication schedules easier to understand.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          Organizing complex prescriptions into clean morning, afternoon, and bedtime dosage slots.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-md max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <PillIcon size={20} color="#0F766E" /> Today's Medication Timeline
            </h3>
            <p className="text-xs text-stone-500">Tap a dose slot to test marking as taken or pending</p>
          </div>
          <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-300">
            DEMO DATA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schedule.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleSlot(item.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                item.taken
                  ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                  : 'bg-[#FDFBF7] border-stone-200 hover:border-[#0F766E]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0F766E] bg-white border border-stone-200 px-2.5 py-0.5 rounded-lg">
                  {item.slot}
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  item.taken ? 'bg-emerald-200 text-emerald-950' : 'bg-amber-100 text-amber-900'
                }`}>
                  {item.taken ? '✓ Taken' : '○ Pending'}
                </span>
              </div>

              <div>
                <div className="font-extrabold text-sm text-stone-900">{item.med}</div>
                <div className="text-xs text-stone-600 mt-1 leading-relaxed">{item.detail}</div>
              </div>

              <div className="pt-2 border-t border-stone-200/60 text-[11px] font-bold text-[#0F766E]">
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
