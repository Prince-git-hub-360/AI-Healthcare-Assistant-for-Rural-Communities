import React from 'react';

export const AshaSection = () => {
  const workflow = [
    'ASHA Worker',
    'Register Patient',
    'Upload Rx',
    'AI Extraction',
    'Regional Explanation',
    'Voice Guidance',
    'Medication Schedule',
    'Follow-Up Support',
  ];

  return (
    <section id="asha-workers" className="scroll-mt-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-20 md:py-24 space-y-12 md:space-y-16 bg-white dark:bg-[#161F30] rounded-3xl border border-stone-200/80 dark:border-slate-800 shadow-sm my-12 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          FRONTLINE HEALTHCARE WORKER PLATFORM
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          Built for the people who already serve the community.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          ASHA workers act as an assisted-access bridge for villagers who struggle to use smartphones or interpret medical documents independently.
        </p>
      </div>

      {/* ASHA Workflow Pipeline */}
      <div className="bg-[#FDFBF7] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-8 rounded-3xl space-y-4 transition-colors">
        <div className="text-xs font-extrabold text-stone-500 dark:text-slate-400 uppercase tracking-widest text-center">
          DOOR-TO-DOOR ASHA FIELD CARE WORKFLOW
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 text-center text-sm font-bold text-stone-800 dark:text-slate-200">
          {workflow.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white px-4 py-2 rounded-xl shadow-xs">
                {step}
              </div>
              {idx < workflow.length - 1 && <span className="text-[#0F766E] dark:text-teal-400 font-extrabold text-base">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ASHA Dashboard Mockup */}
      <div className="bg-stone-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-stone-800 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-5">
          <div>
            <span className="text-xs font-extrabold text-teal-400 uppercase tracking-widest block">ASHA FIELD PORTAL</span>
            <h3 className="text-2xl font-extrabold text-white">Gram Panchayat Operations Hub</h3>
          </div>
          <span className="bg-amber-400 text-stone-950 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase">
            DEMO DATA
          </span>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-1">
            <div className="text-xs font-extrabold text-stone-400 uppercase">Active Patients</div>
            <div className="text-4xl font-extrabold text-teal-400">42</div>
            <div className="text-sm text-stone-400 pt-1">Mandya Gram Panchayat</div>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-1">
            <div className="text-xs font-extrabold text-stone-400 uppercase">Pending Visits</div>
            <div className="text-4xl font-extrabold text-amber-400">6</div>
            <div className="text-sm text-stone-400 pt-1">Scheduled Home Follow-ups</div>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-1">
            <div className="text-xs font-extrabold text-stone-400 uppercase">Voice Adherence</div>
            <div className="text-4xl font-extrabold text-emerald-400">94.8%</div>
            <div className="text-sm text-stone-400 pt-1">Completed Audio Sessions</div>
          </div>
        </div>

        {/* Sample Patient Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-300">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-extrabold uppercase">
                <th className="pb-4 px-4">Sample Patient</th>
                <th className="pb-4 px-4">Village</th>
                <th className="pb-4 px-4">Language</th>
                <th className="pb-4 px-4">Active Medicine</th>
                <th className="pb-4 px-4">Adherence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 font-medium">
              <tr>
                <td className="py-4 px-4 font-bold text-white">Sample Patient A</td>
                <td className="py-4 px-4">Mandya Sector 2</td>
                <td className="py-4 px-4 text-teal-400 font-bold">Hindi</td>
                <td className="py-4 px-4">Paracetamol 500mg</td>
                <td className="py-4 px-4 text-emerald-400 font-bold">🟢 95% High</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-white">Sample Patient B</td>
                <td className="py-4 px-4">Hassan Rural</td>
                <td className="py-4 px-4 text-teal-400 font-bold">Kannada</td>
                <td className="py-4 px-4">Amoxicillin 250mg</td>
                <td className="py-4 px-4 text-amber-400 font-bold">🟡 70% Due</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AshaSection;
