import React, { useState } from 'react';
import { PhoneIcon, HospitalIcon, AlertIcon, ShieldIcon, CheckIcon } from '../components/ui/Icons';

export const EmergencyHelpPage = () => {
  const [selectedTopic, setSelectedTopic] = useState('snakebite');

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

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* 🚨 Emergency Call Header */}
      <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <PhoneIcon size={32} color="#ffffff" />
          </div>
          <div>
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              24/7 EMERGENCY ASSISTANCE
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-red-950 tracking-tight mt-1">
              National Health Emergency Hotline
            </h1>
            <p className="text-xs text-red-800 font-semibold mt-0.5">
              Instant connection to 108 Rural Ambulance & Primary Health Response
            </p>
          </div>
        </div>

        <a
          href="tel:108"
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
        >
          <PhoneIcon size={20} color="#ffffff" /> Call 108 Emergency Now
        </a>
      </div>

      {/* 🏥 First-Aid Guidance in Local Language */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-extrabold text-stone-900 tracking-tight mb-4 flex items-center gap-2">
          <AlertIcon size={24} color="#0f766e" /> Instant First-Aid Guidance
        </h2>

        {/* Topic Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-stone-200">
          <button
            onClick={() => setSelectedTopic('snakebite')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedTopic === 'snakebite' ? 'bg-teal-700 text-white shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            🐍 Snakebite
          </button>
          <button
            onClick={() => setSelectedTopic('burns')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedTopic === 'burns' ? 'bg-teal-700 text-white shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            🔥 Burns
          </button>
          <button
            onClick={() => setSelectedTopic('fever')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedTopic === 'fever' ? 'bg-teal-700 text-white shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            🤒 High Fever
          </button>
          <button
            onClick={() => setSelectedTopic('cardiac')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedTopic === 'cardiac' ? 'bg-teal-700 text-white shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            🫀 Chest Pain
          </button>
        </div>

        {/* Guide Content */}
        <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl">
          <h3 className="font-extrabold text-stone-900 text-base mb-4">
            {firstAidGuides[selectedTopic].title}
          </h3>

          <div className="space-y-3">
            {firstAidGuides[selectedTopic].steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-stone-200 text-xs text-stone-800">
                <div className="w-5 h-5 bg-teal-100 text-teal-800 font-extrabold rounded-full flex items-center justify-center flex-shrink-0 text-[11px]">
                  {idx + 1}
                </div>
                <div className="font-semibold leading-relaxed">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🏥 Nearby Primary Health Centres (PHC) Directory */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
          <HospitalIcon size={24} color="#0f766e" /> Nearby Rural Primary Health Facilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl">
            <h4 className="font-bold text-stone-900 text-sm">Mandya Primary Health Centre #4</h4>
            <p className="text-xs text-stone-600 mt-1">Main Road, Mandya District • 2.4 km away</p>
            <div className="text-xs font-semibold text-teal-800 mt-2">Available: 24/7 Casualty, ASV Antivenom, Maternity Ward</div>
            <a href="tel:08232220101" className="inline-block mt-3 bg-teal-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg">
              📞 Call Health Centre
            </a>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl">
            <h4 className="font-bold text-stone-900 text-sm">Hassan General Referral Hospital</h4>
            <p className="text-xs text-stone-600 mt-1">B.M. Road, Hassan • 8.1 km away</p>
            <div className="text-xs font-semibold text-teal-800 mt-2">Available: ICU Support, Emergency Surgery, Oxygen Bank</div>
            <a href="tel:08172230202" className="inline-block mt-3 bg-teal-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg">
              📞 Call Referral Hospital
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
