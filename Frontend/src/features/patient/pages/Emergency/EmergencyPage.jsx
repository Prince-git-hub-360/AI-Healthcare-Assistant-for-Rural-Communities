import React, { useState } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { PhoneIcon, HospitalIcon, AlertIcon, ShieldIcon, CheckIcon, SpeakerIcon } from '../../../../shared/icons/Icons';
import { speakNativeAudio } from '../../../../shared/utils/speech';

export const EmergencyPage = () => {
  const { currentLang, showToast } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState('snakebite');
  const [playingTopicAudio, setPlayingTopicAudio] = useState(false);

  const firstAidGuides = {
    snakebite: {
      title: 'Snakebite Emergency Response',
      steps: [
        'Keep the victim calm and still to slow venom spread.',
        'Immobilize the bitten limb below heart level.',
        'Do NOT cut the wound or attempt to suck out venom.',
        'Transport immediately to nearest PHC with Anti-Snake Venom (ASV).'
      ]
    },
    burns: {
      title: 'Thermal & Chemical Burn Relief',
      steps: [
        'Cool the burn under clean running water for 10-15 minutes.',
        'Do NOT apply ice, oil, butter, or paste to raw burn skin.',
        'Cover loosely with a clean, dry cloth or bandage.',
        'Seek urgent medical help at the nearest health center.'
      ]
    },
    fever: {
      title: 'High Fever & Convulsions',
      steps: [
        'Sponge forehead, neck, and arms with room-temperature water.',
        'Give Paracetamol 500mg as prescribed by doctor.',
        'Ensure continuous fluid intake (ORS, water, coconut water).',
        'If fever exceeds 102°F or seizures occur, go to clinic.'
      ]
    },
    cardiac: {
      title: 'Chest Pain / Heart Attack Emergency',
      steps: [
        'Have person sit down in comfortable upright position.',
        'Loosen tight clothing around neck and waist.',
        'Call 108 Emergency Ambulance immediately.',
        'If person loses consciousness, begin CPR chest compressions.'
      ]
    }
  };

  const playFirstAidAudio = async () => {
    setPlayingTopicAudio(true);
    const guide = firstAidGuides[selectedTopic];
    const textToSpeak = `${guide.title}. ${guide.steps.join('. ')}`;
    if (showToast) showToast(`Reading ${guide.title} aloud in native voice...`, 'info');
    await speakNativeAudio(textToSpeak, currentLang || 'hi');
    setPlayingTopicAudio(false);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-6 space-y-6 font-sans text-stone-900 dark:text-slate-100 transition-colors">
      {/* Emergency Call Header */}
      <div className="bg-red-50 dark:bg-[#161F30] border border-red-200/80 dark:border-red-900/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            <PhoneIcon size={22} color="#ffffff" />
          </div>
          <div className="space-y-0.5">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              24/7 EMERGENCY ASSISTANCE
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-red-950 dark:text-red-100 tracking-tight">
              National Health Emergency Hotline
            </h1>
            <p className="text-xs text-red-900/80 dark:text-red-300 font-medium">
              Instant connection to 108 Rural Ambulance & Primary Health Response
            </p>
          </div>
        </div>

        <a
          href="tel:108"
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-xs transition-colors text-center flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <PhoneIcon size={16} color="#ffffff" />
          <span>Call 108 Emergency Now</span>
        </a>
      </div>

      {/* First-Aid Guidance in Local Language */}
      <div className="bg-white dark:bg-[#161F30] border border-stone-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <AlertIcon size={20} className="text-[#0B4F42] dark:text-teal-400" />
            <span>Instant First-Aid Guidance</span>
          </h2>

          <button
            onClick={playFirstAidAudio}
            disabled={playingTopicAudio}
            className="border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-800 dark:text-slate-200 text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <SpeakerIcon size={14} />
            <span>{playingTopicAudio ? 'Reading Aloud...' : 'Listen Audio First-Aid'}</span>
          </button>
        </div>

        {/* Topic Tabs */}
        <div className="flex flex-wrap gap-2 pb-1">
          <button
            onClick={() => setSelectedTopic('snakebite')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedTopic === 'snakebite'
                ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-xs'
                : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700'
            }`}
          >
            🐍 Snakebite
          </button>
          <button
            onClick={() => setSelectedTopic('burns')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedTopic === 'burns'
                ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-xs'
                : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700'
            }`}
          >
            🔥 Burns
          </button>
          <button
            onClick={() => setSelectedTopic('fever')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedTopic === 'fever'
                ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-xs'
                : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700'
            }`}
          >
            🤒 High Fever
          </button>
          <button
            onClick={() => setSelectedTopic('cardiac')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedTopic === 'cardiac'
                ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-xs'
                : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700'
            }`}
          >
            🫀 Chest Pain
          </button>
        </div>

        {/* Guide Content */}
        <div className="bg-stone-50/80 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 p-4 rounded-xl space-y-3">
          <h3 className="font-bold text-stone-900 dark:text-white text-sm">
            {firstAidGuides[selectedTopic].title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {firstAidGuides[selectedTopic].steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-white dark:bg-slate-900 p-3 rounded-lg border border-stone-200/80 dark:border-slate-800 text-xs text-stone-800 dark:text-slate-200 shadow-xs">
                <div className="w-5 h-5 bg-[#0B4F42] dark:bg-teal-600 text-white font-bold rounded-md flex items-center justify-center shrink-0 text-[11px]">
                  {idx + 1}
                </div>
                <div className="font-normal leading-relaxed pt-0.5">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nearby Primary Health Centres Directory */}
      <div className="bg-white dark:bg-[#161F30] border border-stone-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-3.5 transition-colors">
        <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-slate-800 pb-3">
          <HospitalIcon size={20} className="text-[#0B4F42] dark:text-teal-400" />
          <span>Nearby Primary Health Facilities</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-stone-50/80 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 p-3.5 rounded-xl space-y-2">
            <div>
              <h4 className="font-bold text-stone-900 dark:text-white text-xs">Mandya Primary Health Centre #4</h4>
              <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">Main Road, Mandya District • 2.4 km away</p>
            </div>
            <div className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">Available: 24/7 Casualty, ASV Antivenom, Maternity Ward</div>
            <a href="tel:08232220101" className="inline-flex items-center gap-1.5 bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors">
              <span>📞 Call Health Centre</span>
            </a>
          </div>

          <div className="bg-stone-50/80 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 p-3.5 rounded-xl space-y-2">
            <div>
              <h4 className="font-bold text-stone-900 dark:text-white text-xs">Hassan General Referral Hospital</h4>
              <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">B.M. Road, Hassan • 8.1 km away</p>
            </div>
            <div className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">Available: ICU Support, Emergency Surgery, Oxygen Bank</div>
            <a href="tel:08172230202" className="inline-flex items-center gap-1.5 bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors">
              <span>📞 Call Referral Hospital</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
