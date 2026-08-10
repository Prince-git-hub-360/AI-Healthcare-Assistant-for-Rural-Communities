import React from 'react';
import { DocumentIcon, BrainIcon, TranslateIcon, SpeakerIcon, PillIcon, UserIcon } from '../../shared/icons/Icons';

export const SolutionSection = () => {
  const capabilities = [
    {
      icon: DocumentIcon,
      title: 'Prescription Understanding',
      desc: 'Convert complex prescription details into structured, easy-to-read instructions.',
    },
    {
      icon: BrainIcon,
      title: 'Medical Document Simplification',
      desc: 'Transform medical terminology into everyday regional language explanations.',
    },
    {
      icon: TranslateIcon,
      title: 'Regional Language Support',
      desc: 'Present healthcare information in the user’s preferred native language (22+ Indian languages).',
    },
    {
      icon: SpeakerIcon,
      title: 'Voice Guidance',
      desc: 'Allow patients to listen to instructions in native speech audio instead of relying on text.',
    },
    {
      icon: PillIcon,
      title: 'Medication Assistance',
      desc: 'Organize medication schedules with clear morning, lunch, and bedtime dosage slots.',
    },
    {
      icon: UserIcon,
      title: 'Healthcare Worker Support',
      desc: 'Empower frontline ASHA workers to scan prescriptions and assist villagers during field visits.',
    },
  ];

  return (
    <section id="solutions" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-12 bg-white rounded-3xl border border-stone-200 shadow-xs my-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-[#F0FDF4] border border-[#bbf7d0] px-3.5 py-1 rounded-full">
          CORE PRODUCT SOLUTIONS
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          Turning medical information into something people can understand.
        </h2>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          Swasthya Sanchar AI combines document intelligence, medical information extraction, language simplification, regional-language translation and voice assistance into one communication layer between healthcare providers and patients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <div
              key={idx}
              className="bg-[#FDFBF7] border border-stone-200 p-6 rounded-2xl space-y-3 hover:border-[#0F766E] transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-[#0F766E]">
                <Icon size={22} color="#0F766E" />
              </div>
              <h3 className="font-extrabold text-base text-stone-900">{cap.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{cap.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SolutionSection;
