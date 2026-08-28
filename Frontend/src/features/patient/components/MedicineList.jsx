import React from 'react';
import { SparklesIcon } from '../../../shared/icons/Icons';

export const MedicineList = ({ medications = [], confidence = null, isLoading = false, onAskAI = null }) => {
  const hasMedicines = Array.isArray(medications) && medications.length > 0;
  const countLabel = hasMedicines ? `${medications.length} medicine${medications.length > 1 ? 's' : ''} found` : null;

  const handleAskAI = (medicineObj) => {
    if (onAskAI) {
      onAskAI(medicineObj);
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('swasthya:open_ai_assistant', { detail: { medicine: medicineObj } }));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition-colors font-sans">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950 text-[#0F766E] dark:text-teal-300 flex items-center justify-center font-bold text-sm shrink-0">
              💊
            </div>
            <span>Medicines Identified</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
            Review your medicines before creating reminders.
          </p>
        </div>

        {/* DYNAMIC MEDICINE COUNT BADGE */}
        {!isLoading && countLabel && (
          <span className="self-start sm:self-auto bg-emerald-50 dark:bg-teal-950/80 border border-emerald-200 dark:border-teal-800 text-[#0F766E] dark:text-teal-300 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
            {countLabel}
          </span>
        )}
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 text-center space-y-2">
          <SparklesIcon size={20} className="animate-spin text-[#0F766E] dark:text-teal-400 mx-auto" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Identifying medicines...
          </p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !hasMedicines && (
        <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700/80 rounded-xl p-4 text-center space-y-1">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
            No medicines were identified from this prescription.
          </p>
        </div>
      )}

      {/* COMPACT MEDICINE CARDS LIST */}
      {!isLoading && hasMedicines && (
        <div className="space-y-2.5">
          {medications.map((item, idx) => {
            const isObject = typeof item === 'object' && item !== null;
            
            const name = isObject 
              ? (item.medicine_name || item.name || item.medication_name || item.title || item.raw_name || `Medicine #${idx + 1}`)
              : String(item);

            const dosage = isObject ? (item.strength || item.dosage || item.dose || null) : null;
            
            const frequency = isObject 
              ? (item.frequency || item.timing || item.schedule || item.meal_rule || null) 
              : null;

            const duration = isObject 
              ? (item.duration_days ? `${item.duration_days} days` : item.duration || item.instructions || item.notes || item.instruction || null)
              : null;

            const itemConfidence = isObject 
              ? (item.confidence || item.confidence_score || (confidence ? Math.round(confidence * 100) : null))
              : (confidence ? Math.round(confidence * 100) : null);

            const confidenceValue = itemConfidence 
              ? (typeof itemConfidence === 'number' && itemConfidence <= 1 ? Math.round(itemConfidence * 100) : itemConfidence)
              : null;

            const medObject = {
              name,
              medicine_name: name,
              dosage: dosage || '',
              frequency: frequency || '',
              duration: duration || '',
              instructions: isObject ? (item.instructions || item.notes || item.instruction || '') : '',
              prescription_context: isObject ? (item.prescription_context || item.raw_text || '') : ''
            };

            return (
              <div 
                key={idx}
                className="bg-[#F0FDF4]/80 dark:bg-[#07241E]/60 border border-emerald-200/90 dark:border-teal-900/70 rounded-xl p-3 sm:p-3.5 space-y-2 transition-all hover:border-[#0F766E] dark:hover:border-teal-400 shadow-2xs group"
              >
                {/* CARD TOP ROW: MEDICINE NAME & CONFIDENCE & ASK AI BUTTON */}
                <div className="flex items-center justify-between gap-2.5 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm shrink-0">💊</span>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white tracking-tight truncate group-hover:text-[#0F766E] dark:group-hover:text-teal-300 transition-colors">
                      {name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {confidenceValue && (
                      <span className="bg-white/90 dark:bg-slate-800 border border-emerald-200 dark:border-teal-800/80 text-[#0F766E] dark:text-teal-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {confidenceValue}% match
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleAskAI(medObject)}
                      className="bg-[#0F766E] hover:bg-teal-700 active:scale-95 text-white text-[11px] font-extrabold px-3 py-1 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      title={`Ask AI about ${name}`}
                    >
                      <SparklesIcon size={12} color="#ffffff" />
                      <span>Ask AI</span>
                    </button>
                  </div>
                </div>

                {/* COMPACT DETAILS GRID (DOSAGE / FREQUENCY / DURATION) */}
                {(dosage || frequency || duration) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 pt-1 border-t border-emerald-200/60 dark:border-teal-900/40 text-xs">
                    {dosage && (
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-[#0F766E] dark:text-teal-400 uppercase tracking-wider block">
                          DOSAGE
                        </span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {dosage}
                        </p>
                      </div>
                    )}

                    {frequency && (
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-[#0F766E] dark:text-teal-400 uppercase tracking-wider block">
                          FREQUENCY / TIMING
                        </span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {frequency}
                        </p>
                      </div>
                    )}

                    {duration && (
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-[#0F766E] dark:text-teal-400 uppercase tracking-wider block">
                          DURATION / NOTES
                        </span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {duration}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default MedicineList;
