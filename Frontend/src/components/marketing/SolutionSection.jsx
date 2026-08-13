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
    <section id="solutions" className="scroll-mt-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-20 md:py-24 space-y-12 md:space-y-16 bg-white dark:bg-[#161F30] rounded-3xl border border-stone-200/80 dark:border-slate-800 shadow-sm my-12 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-[#F0FDF4] dark:bg-teal-950/60 border border-[#bbf7d0] dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          CORE PRODUCT SOLUTIONS
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          Turning medical information into something people can understand.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          Swasthya Sanchar AI combines document intelligence, medical information extraction, language simplification, regional-language translation and voice assistance into one communication layer between healthcare providers and patients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {capabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <div
              key={idx}
              className="bg-[#FDFBF7] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-8 rounded-3xl space-y-4 hover:border-[#0F766E] dark:hover:border-teal-500 transition-all hover:shadow-md"
            >
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/60 rounded-2xl flex items-center justify-center text-[#0F766E] dark:text-teal-300">
                <Icon size={24} className="text-[#0B4F42] dark:text-teal-300" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-stone-900 dark:text-white">{cap.title}</h3>
              <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 leading-relaxed">{cap.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SolutionSection;
