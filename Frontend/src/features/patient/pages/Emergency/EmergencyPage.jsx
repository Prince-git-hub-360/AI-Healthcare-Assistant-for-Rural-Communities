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
    <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-6 space-y-6 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* Emergency Call Header */}
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-xl shrink-0 shadow-md">
            <PhoneIcon size={24} color="#ffffff" />
          </div>
          <div className="space-y-1">
            <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
              24/7 EMERGENCY ASSISTANCE
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-rose-950 dark:text-rose-100 tracking-tight">
              National Health Emergency Hotline
            </h1>
            <p className="text-xs text-rose-900 dark:text-rose-300 font-semibold">
              Instant connection to 108 Rural Ambulance & Primary Health Response
            </p>
          </div>
        </div>

        <a
          href="tel:108"
          className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-6 py-3.5 min-h-[48px] rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <PhoneIcon size={18} color="#ffffff" />
          <span>Call 108 Emergency Now</span>
        </a>
      </div>

      {/* First-Aid Guidance in Local Language */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertIcon size={22} className="text-teal-700 dark:text-teal-400" />
            <span>Instant First-Aid Guidance</span>
          </h2>

          <button
            onClick={playFirstAidAudio}
            disabled={playingTopicAudio}
            className="border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-2.5 min-h-[44px] rounded-xl transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <SpeakerIcon size={16} />
            <span>{playingTopicAudio ? 'Reading Aloud...' : 'Listen Audio First-Aid'}</span>
          </button>
        </div>

        {/* Topic Tabs */}
        <div className="flex flex-wrap gap-2.5 pb-1">
          <button
            onClick={() => setSelectedTopic('snakebite')}
            className={`px-4 py-2.5 min-h-[44px] text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedTopic === 'snakebite'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            🐍 Snakebite
          </button>
          <button
            onClick={() => setSelectedTopic('burns')}
            className={`px-4 py-2.5 min-h-[44px] text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedTopic === 'burns'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            🔥 Burns
          </button>
          <button
            onClick={() => setSelectedTopic('fever')}
            className={`px-4 py-2.5 min-h-[44px] text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedTopic === 'fever'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            🤒 High Fever
          </button>
          <button
            onClick={() => setSelectedTopic('cardiac')}
            className={`px-4 py-2.5 min-h-[44px] text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedTopic === 'cardiac'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            🫀 Chest Pain
          </button>
        </div>

        {/* Guide Content */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
            {firstAidGuides[selectedTopic].title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {firstAidGuides[selectedTopic].steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 shadow-2xs">
                <div className="w-6 h-6 bg-teal-700 text-white font-extrabold rounded-lg flex items-center justify-center shrink-0 text-xs shadow-2xs">
                  {idx + 1}
                </div>
                <div className="font-medium leading-relaxed pt-0.5">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nearby Primary Health Centres Directory */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <HospitalIcon size={22} className="text-teal-700 dark:text-teal-400" />
          <span>Nearby Primary Health Facilities</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4.5 rounded-2xl space-y-3 shadow-2xs">
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Mandya Primary Health Centre #4</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Main Road, Mandya District • 2.4 km away</p>
            </div>
            <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
              Available: 24/7 Casualty, ASV Antivenom, Maternity Ward
            </div>
            <a href="tel:08232220101" className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2.5 min-h-[44px] rounded-xl transition-all cursor-pointer shadow-sm">
              <span>📞 Call Health Centre</span>
            </a>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4.5 rounded-2xl space-y-3 shadow-2xs">
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">Hassan General Referral Hospital</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">B.M. Road, Hassan • 8.1 km away</p>
            </div>
            <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
              Available: ICU Support, Emergency Surgery, Oxygen Bank
            </div>
            <a href="tel:08172230202" className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2.5 min-h-[44px] rounded-xl transition-all cursor-pointer shadow-sm">
              <span>📞 Call Referral Hospital</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
