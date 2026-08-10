import React from 'react';
import { UserIcon } from '../../shared/icons/Icons';

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
    <section id="asha-workers" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12 bg-white rounded-3xl border border-stone-200 shadow-xs my-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          FRONTLINE HEALTHCARE WORKER PLATFORM
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          Built for the people who already serve the community.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          ASHA workers act as an assisted-access bridge for villagers who struggle to use smartphones or interpret medical documents independently.
        </p>
      </div>

      {/* ASHA Workflow Pipeline */}
      <div className="bg-[#FDFBF7] border border-stone-200 p-6 rounded-2xl">
        <div className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest text-center mb-4">
          DOOR-TO-DOOR ASHA FIELD CARE WORKFLOW
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs font-bold text-stone-800">
          {workflow.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-white border border-stone-300 px-3 py-1.5 rounded-xl shadow-xs">
                {step}
              </div>
              {idx < workflow.length - 1 && <span className="text-[#0F766E] font-extrabold">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ASHA Dashboard Mockup */}
      <div className="bg-stone-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-stone-800 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-widest">ASHA FIELD PORTAL</span>
            <h3 className="text-xl font-extrabold text-white">Gram Panchayat Operations Hub</h3>
          </div>
          <span className="bg-amber-400 text-stone-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
            DEMO DATA
          </span>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl">
            <div className="text-[10px] font-extrabold text-stone-400 uppercase">Active Patients</div>
            <div className="text-3xl font-extrabold text-teal-400 mt-1">42</div>
            <div className="text-xs text-stone-400 mt-0.5">Mandya Gram Panchayat</div>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl">
            <div className="text-[10px] font-extrabold text-stone-400 uppercase">Pending Visits</div>
            <div className="text-3xl font-extrabold text-amber-400 mt-1">6</div>
            <div className="text-xs text-stone-400 mt-0.5">Scheduled Home Follow-ups</div>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl">
            <div className="text-[10px] font-extrabold text-stone-400 uppercase">Voice Adherence</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">94.8%</div>
            <div className="text-xs text-stone-400 mt-0.5">Completed Audio Sessions</div>
          </div>
        </div>

        {/* Sample Patient Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead>
              <tr className="border-b border-stone-800 text-stone-500 font-extrabold uppercase">
                <th className="pb-3 px-3">Sample Patient</th>
                <th className="pb-3 px-3">Village</th>
                <th className="pb-3 px-3">Language</th>
                <th className="pb-3 px-3">Active Medicine</th>
                <th className="pb-3 px-3">Adherence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 font-medium">
              <tr>
                <td className="py-3 px-3 font-bold text-white">Sample Patient A</td>
                <td className="py-3 px-3">Mandya Sector 2</td>
                <td className="py-3 px-3 text-teal-400">Hindi</td>
                <td className="py-3 px-3">Paracetamol 500mg</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">🟢 95% High</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-white">Sample Patient B</td>
                <td className="py-3 px-3">Hassan Rural</td>
                <td className="py-3 px-3 text-teal-400">Kannada</td>
                <td className="py-3 px-3">Amoxicillin 250mg</td>
                <td className="py-3 px-3 text-amber-400 font-bold">🟡 70% Due</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AshaSection;
