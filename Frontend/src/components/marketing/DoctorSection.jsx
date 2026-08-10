import React from 'react';
import { HospitalIcon, CheckIcon } from '../../shared/icons/Icons';

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
    <section id="doctors" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          CLINIC & PHC DOCTOR INTEGRATION
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          Help patients understand medical instructions after they leave the clinic.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          Extending clinical instructions into the patient’s home through automated regional language audio and structured medication schedules.
        </p>
      </div>

      {/* Doctor Workflow Pipeline */}
      <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl">
        <div className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest text-center mb-4">
          CONTINUUM OF CARE WORKFLOW
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs font-bold text-stone-800">
          {doctorSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-white border border-stone-300 px-3 py-1.5 rounded-xl shadow-xs">
                {step}
              </div>
              {idx < doctorSteps.length - 1 && <span className="text-[#0F766E] font-extrabold">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Doctor Portal Preview */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 text-[#0F766E] rounded-xl flex items-center justify-center font-bold">
              👨‍⚕️
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900">PHC Clinical Portal Preview</h3>
              <p className="text-xs text-stone-500">Designed to support better understanding and follow-up</p>
            </div>
          </div>
          <span className="bg-stone-100 text-stone-600 text-[10px] font-extrabold px-3 py-1 rounded-full border border-stone-200 uppercase">
            CONCEPT PREVIEW
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-stone-700">
          <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-stone-200 space-y-1">
            <div className="text-[10px] text-stone-400 uppercase">Patient Directory</div>
            <div className="text-stone-900 font-extrabold text-sm">Mandya Sub-Center</div>
          </div>

          <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-stone-200 space-y-1">
            <div className="text-[10px] text-stone-400 uppercase">Prescription Vault</div>
            <div className="text-stone-900 font-extrabold text-sm">Digitized Rx Notes</div>
          </div>

          <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-stone-200 space-y-1">
            <div className="text-[10px] text-stone-400 uppercase">Language Audio</div>
            <div className="text-[#0F766E] font-extrabold text-sm">Auto-Generated TTS</div>
          </div>

          <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-stone-200 space-y-1">
            <div className="text-[10px] text-stone-400 uppercase">Follow-Up Status</div>
            <div className="text-emerald-700 font-extrabold text-sm">ASHA Synced</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;
