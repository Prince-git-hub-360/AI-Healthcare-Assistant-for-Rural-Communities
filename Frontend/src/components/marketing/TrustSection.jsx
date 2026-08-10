import React from 'react';
import { BrainIcon, TranslateIcon, SpeakerIcon, DocumentIcon, PillIcon, UserIcon } from '../../shared/icons/Icons';

export const TrustSection = () => {
  const items = [
    { title: 'AI-Powered', icon: BrainIcon },
    { title: 'Multilingual', icon: TranslateIcon },
    { title: 'Voice Assistance', icon: SpeakerIcon },
    { title: 'Prescription Understanding', icon: DocumentIcon },
    { title: 'Medication Support', icon: PillIcon },
    { title: 'ASHA Support', icon: UserIcon },
  ];

  return (
    <div className="bg-[#F0FDF4] border-y border-[#bbf7d0] py-8 px-4">
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <div className="text-[11px] font-extrabold text-[#0F766E] uppercase tracking-widest">
          BUILT FOR ACCESSIBLE HEALTHCARE COMMUNICATION
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#bbf7d0] px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs hover:border-[#0F766E] transition-colors"
              >
                <Icon size={16} color="#0F766E" />
                <span className="text-xs font-bold text-stone-800">{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustSection;
