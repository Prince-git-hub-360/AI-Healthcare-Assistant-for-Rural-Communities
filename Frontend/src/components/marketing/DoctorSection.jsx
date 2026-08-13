import React from 'react';

export const DoctorSection = () => {
  const doctorSteps = [
    'Doctor Prescribes',
    'Patient Receives Rx',
    'AI Simplifies Instructions',
    'Regional Audio Guidance',
    'Medication Support',
    'Follow-up Care',
  ];

  return (
    <section id="doctors" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 space-y-12 md:space-y-16 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          CLINIC & PHC DOCTOR INTEGRATION
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          Help patients understand medical instructions after they leave the clinic.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          Extending clinical instructions into the patient’s home through automated regional language audio and structured medication schedules.
        </p>
      </div>

      {/* Doctor Workflow Pipeline */}
      <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-8 rounded-3xl space-y-4 transition-colors">
        <div className="text-xs font-extrabold text-stone-500 dark:text-slate-400 uppercase tracking-widest text-center">
          CONTINUUM OF CARE WORKFLOW
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 text-center text-sm font-bold text-stone-800 dark:text-slate-200">
          {doctorSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white px-4 py-2 rounded-xl shadow-xs">
                {step}
              </div>
              {idx < doctorSteps.length - 1 && <span className="text-[#0F766E] dark:text-teal-400 font-extrabold text-base">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Doctor Portal Preview */}
      <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-md space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/60 text-[#0F766E] dark:text-teal-300 rounded-2xl flex items-center justify-center text-xl font-bold">
              👨‍⚕️
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-stone-900 dark:text-white">PHC Clinical Portal Preview</h3>
              <p className="text-sm text-stone-500 dark:text-slate-400">Designed to support better understanding and follow-up</p>
            </div>
          </div>
          <span className="bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-stone-200 dark:border-slate-700 uppercase">
            CONCEPT PREVIEW
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm font-bold text-stone-700 dark:text-slate-200">
          <div className="bg-[#FDFBF7] dark:bg-slate-900 p-5 rounded-2xl border border-stone-200 dark:border-slate-800 space-y-1.5">
            <div className="text-xs text-stone-500 dark:text-slate-400 font-bold uppercase">Patient Directory</div>
            <div className="text-stone-900 dark:text-white font-extrabold text-base">Mandya Sub-Center</div>
          </div>

          <div className="bg-[#FDFBF7] dark:bg-slate-900 p-5 rounded-2xl border border-stone-200 dark:border-slate-800 space-y-1.5">
            <div className="text-xs text-stone-500 dark:text-slate-400 font-bold uppercase">Prescription Vault</div>
            <div className="text-stone-900 dark:text-white font-extrabold text-base">Digitized Rx Notes</div>
          </div>

          <div className="bg-[#FDFBF7] dark:bg-slate-900 p-5 rounded-2xl border border-stone-200 dark:border-slate-800 space-y-1.5">
            <div className="text-xs text-stone-500 dark:text-slate-400 font-bold uppercase">Language Audio</div>
            <div className="text-[#0F766E] dark:text-teal-300 font-extrabold text-base">Auto-Generated TTS</div>
          </div>

          <div className="bg-[#FDFBF7] dark:bg-slate-900 p-5 rounded-2xl border border-stone-200 dark:border-slate-800 space-y-1.5">
            <div className="text-xs text-stone-500 dark:text-slate-400 font-bold uppercase">Follow-Up Status</div>
            <div className="text-emerald-700 dark:text-emerald-400 font-extrabold text-base">ASHA Synced</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;
