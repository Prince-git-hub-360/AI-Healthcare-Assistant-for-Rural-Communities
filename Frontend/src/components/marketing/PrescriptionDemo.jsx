import React, { useState } from 'react';
import { SpeakerIcon, AlertIcon } from '../../shared/icons/Icons';
import { speakNativeAudio } from '../../shared/utils/speech';

export const PrescriptionDemo = () => {
  const [demoLang, setDemoLang] = useState('hi');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const sampleTranslations = {
    hi: {
      med1: 'पैरासिटामोल 500mg: सुबह 1 गोली और रात को 1 गोली खाने के बाद 5 दिनों के लिए लें।',
      med2: 'कफ सिरप: दिन में 3 बार 2 चम्मच लें।',
    },
    kn: {
      med1: 'ಪ್ಯಾರಸಿಟಮಾಲ್ 500mg: ಬೆಳಿಗ್ಗೆ 1 ಮಾತ್ರೆ ಮತ್ತು ರಾತ್ರಿ 1 ಮಾತ್ರೆ ಊಟದ ನಂತರ 5 ದಿನಗಳ ಕಾಲ ತೆಗೆದುಕೊಳ್ಳಿ.',
      med2: 'ಕೆಮ್ಮಿನ ಸಿರಪ್: ದಿನಕ್ಕೆ 3 ಬಾರಿ 2 ಚಮಚ ತೆಗೆದುಕೊಳ್ಳಿ.',
    },
    ta: {
      med1: 'பாரசிட்டமால் 500mg: காலை 1 மாத்திரை மற்றும் இரவு 1 மாத்திரை உணவுக்கு பின் 5 நாட்களுக்கு சாப்பிடவும்.',
      med2: 'இருமல் மருந்து: ஒரு நாளைக்கு 3 முறை 2 தேக்கரண்டி எடுக்கவும்.',
    },
    te: {
      med1: 'పారాసిటమాల్ 500mg: ఉదయం 1 మాత్ర మరియు రాత్రి 1 మాత్ర భోజనం తర్వాత 5 రోజులు తీసుకోండి.',
      med2: 'దగ్గు సిరప్: రోజుకు 3 సార్లు 2 చెంచాలు తీసుకోండి.',
    },
    mr: {
      med1: 'पॅरासिटामॉल 500mg: सकाळी १ गोळी आणि रात्री १ गोळी जेवणानंतर ५ दिवस घ्या.',
      med2: 'खोकल्याचे औषध: दिवसातून ३ वेळा २ चमचे घ्या.',
    },
  };

  const handleVoiceToggle = async () => {
    if (!isPlayingVoice) {
      setIsPlayingVoice(true);
      const textToSpeak = `${sampleTranslations[demoLang].med1}. ${sampleTranslations[demoLang].med2}`;
      await speakNativeAudio(textToSpeak, demoLang);
      setIsPlayingVoice(false);
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
    }
  };

  return (
    <section id="prescription-demo" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full">
          INTERACTIVE DEMONSTRATION
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          See the difference between reading a prescription and understanding it.
        </h2>
        <p className="text-sm md:text-base text-stone-600">
          Test how Swasthya Sanchar AI converts unreadable prescription shorthand into clear regional audio explanations.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative overflow-hidden">
        {/* LEFT: Original Doctor Note */}
        <div className="bg-stone-50 border border-stone-300 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">
              ORIGINAL DOCTOR NOTE
            </span>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
              SAMPLE / DEMONSTRATION DATA
            </span>
          </div>

          <div className="font-mono text-sm text-stone-800 space-y-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <div className="font-bold text-stone-900">Rx:</div>
            <div>1. Tab. Paracetamol 500mg — 1-0-1 × 5 days (PC)</div>
            <div>2. Syrup Cough & Cold — 2 tsp TDS</div>
            <div className="text-xs text-stone-500 italic border-t border-stone-100 pt-2">
              Note: Drink warm water. Rest for 3 days.
            </div>
          </div>
        </div>

        {/* RIGHT: Swasthya Sanchar Explanation */}
        <div className="bg-[#F0FDF4] border border-[#bbf7d0] rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#bbf7d0] pb-3">
            <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-wider">
              SWASTHYA SANCHAR EXPLANATION
            </span>

            {/* Language Selector */}
            <select
              value={demoLang}
              onChange={(e) => setDemoLang(e.target.value)}
              className="bg-white border border-[#bbf7d0] text-stone-900 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer outline-none"
            >
              <option value="hi">🇮🇳 Hindi (हिंदी)</option>
              <option value="kn">🇮🇳 Kannada (ಕನ್ನಡ)</option>
              <option value="ta">🇮🇳 Tamil (தமிழ்)</option>
              <option value="te">🇮🇳 Telugu (తెలుగు)</option>
              <option value="mr">🇮🇳 Marathi (मराठी)</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="bg-white p-4 rounded-xl border border-[#bbf7d0] shadow-xs space-y-1">
              <div className="font-extrabold text-sm text-stone-900">💊 Paracetamol 500 mg</div>
              <p className="text-xs text-stone-700 leading-relaxed font-semibold">
                {sampleTranslations[demoLang].med1}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#bbf7d0] shadow-xs space-y-1">
              <div className="font-extrabold text-sm text-stone-900">🥄 Cough Syrup</div>
              <p className="text-xs text-stone-700 leading-relaxed font-semibold">
                {sampleTranslations[demoLang].med2}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-4">
            <button
              onClick={handleVoiceToggle}
              className="bg-[#EA580C] hover:bg-[#cc4f0b] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <SpeakerIcon size={16} color="#fff" />
              <span>{isPlayingVoice ? 'Speaking Audio...' : '🔊 Listen to Audio Guidance'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-stone-600">
        <AlertIcon size={18} color="#0F766E" />
        <div>
          <strong className="text-stone-900 font-bold">Safety Notice:</strong> AI-generated explanations are intended to support understanding. Always follow the prescribing healthcare professional's instructions.
        </div>
      </div>
    </section>
  );
};

export default PrescriptionDemo;
