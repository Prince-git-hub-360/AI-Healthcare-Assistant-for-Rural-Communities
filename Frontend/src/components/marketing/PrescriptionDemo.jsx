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
    <section id="prescription-demo" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 space-y-10 font-sans transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
          INTERACTIVE DEMONSTRATION
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
          See the difference between reading a prescription and understanding it.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
          Test how Swasthya Sanchar AI converts unreadable prescription shorthand into clear regional audio explanations.
        </p>
      </div>

      <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative overflow-hidden transition-colors">
        {/* LEFT: Original Doctor Note */}
        <div className="bg-stone-50 dark:bg-slate-900 border border-stone-300 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-extrabold text-stone-600 dark:text-slate-400 uppercase tracking-wider">
              ORIGINAL DOCTOR NOTE
            </span>
            <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800">
              SAMPLE / DEMONSTRATION DATA
            </span>
          </div>

          <div className="font-mono text-base sm:text-lg text-stone-800 dark:text-slate-200 space-y-3 bg-white dark:bg-slate-800/80 p-5 rounded-xl border border-stone-200 dark:border-slate-700 shadow-xs">
            <div className="font-bold text-stone-900 dark:text-white">Rx:</div>
            <div>1. Tab. Paracetamol 500mg — 1-0-1 × 5 days (PC)</div>
            <div>2. Syrup Cough & Cold — 2 tsp TDS</div>
            <div className="text-sm text-stone-500 dark:text-slate-400 italic border-t border-stone-100 dark:border-slate-700 pt-3">
              Note: Drink warm water. Rest for 3 days.
            </div>
          </div>
        </div>

        {/* RIGHT: Swasthya Sanchar Explanation */}
        <div className="bg-[#F0FDF4] dark:bg-teal-950/40 border border-[#bbf7d0] dark:border-teal-800/80 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#bbf7d0] dark:border-teal-800/80 pb-3">
            <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-wider">
              SWASTHYA SANCHAR EXPLANATION
            </span>

            {/* Demo Language Selector */}
            <select
              value={demoLang}
              onChange={(e) => setDemoLang(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-[#bbf7d0] dark:border-slate-700 text-stone-900 dark:text-white text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl cursor-pointer outline-none shadow-xs"
            >
              <option value="hi">🇮🇳 Hindi (हिंदी)</option>
              <option value="kn">🇮🇳 Kannada (ಕನ್ನಡ)</option>
              <option value="ta">🇮🇳 Tamil (தமிழ்)</option>
              <option value="te">🇮🇳 Telugu (తెలుగు)</option>
              <option value="mr">🇮🇳 Marathi (मराठी)</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[#bbf7d0] dark:border-slate-800 shadow-xs space-y-1.5">
              <div className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-white">💊 Paracetamol 500 mg</div>
              <p className="text-sm sm:text-base text-stone-700 dark:text-slate-200 leading-relaxed font-semibold">
                {sampleTranslations[demoLang].med1}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[#bbf7d0] dark:border-slate-800 shadow-xs space-y-1.5">
              <div className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-white">🥄 Cough Syrup</div>
              <p className="text-sm sm:text-base text-stone-700 dark:text-slate-200 leading-relaxed font-semibold">
                {sampleTranslations[demoLang].med2}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-4">
            <button
              onClick={handleVoiceToggle}
              className="bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <SpeakerIcon size={18} color="#fff" />
              <span>{isPlayingVoice ? 'Speaking Audio...' : '🔊 Listen to Audio Guidance'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-5 flex items-start gap-3.5 text-sm text-stone-600 dark:text-slate-300">
        <AlertIcon size={20} className="text-[#0B4F42] dark:text-teal-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-stone-900 dark:text-white font-bold">Safety Notice:</strong> AI-generated explanations are intended to support understanding. Always follow the prescribing healthcare professional's instructions.
        </div>
      </div>
    </section>
  );
};

export default PrescriptionDemo;
