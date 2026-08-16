import React, { useState } from 'react';
import { 
  ArrowRightIcon, PlayIcon, CheckIcon, DocumentIcon, BrainIcon, SpeakerIcon, 
  HeartIcon, SparklesIcon, PhoneIcon, QrCodeIcon, BellIcon, CalendarIcon, 
  ShieldIcon, TranslateIcon, AlertIcon, CloseIcon, ChevronDownIcon, HospitalIcon, 
  PillIcon, UserIcon, ClockIcon 
} from '../shared/icons/Icons';
import { ROUTES, navigateTo } from '../utils/routes';
import { speakNativeAudio } from '../shared/utils/speech';
import { PublicNavbar } from '../components/marketing/PublicNavbar';

export const LandingPage = ({ onNavigate }) => {
  // Top Utility Bar State
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const languages = [
    { name: 'Hindi', label: 'हिंदी' },
    { name: 'Bengali', label: 'বাংলা' },
    { name: 'Tamil', label: 'தமிழ்' },
    { name: 'Telugu', label: 'తెలుగు' },
    { name: 'Marathi', label: 'मराठी' },
    { name: 'Kannada', label: 'ಕನ್ನಡ' },
    { name: 'English', label: 'English' },
  ];

  // Hero Prescription Demo State
  const [heroSample, setHeroSample] = useState('Paracetamol');
  const [isPlayingHeroDemo, setIsPlayingHeroDemo] = useState(false);
  const samplePrescriptions = {
    'Paracetamol': {
      raw: 'Tab Paracetamol 500mg - 1-0-1 (3 days) PC',
      parsed: 'Take 1 pill morning & night after food. (3 Days)',
      hindi: 'सुबह और रात को खाने के बाद 1-1 गोली लें। (3 दिन)',
    },
    'Amoxicillin': {
      raw: 'Cap Amoxicillin 250mg - 1-1-1 (5 days) PC',
      parsed: 'Take 1 capsule morning, noon & night after food.',
      hindi: 'सुबह, दोपहर और रात को खाने के बाद 1-1 कैप्सूल लें।',
    },
    'Metformin': {
      raw: 'Tab Metformin 500mg - 1-0-1 (7 days) AC',
      parsed: 'Take 1 pill morning & night before food.',
      hindi: 'सुबह और शाम को खाने से पहले 1-1 गोली लें।',
    },
  };
  const currentHeroSample = samplePrescriptions[heroSample];

  // Bento Audio Player State
  const [bentoLanguage, setBentoLanguage] = useState('Hindi');
  const [isPlayingBentoAudio, setIsPlayingBentoAudio] = useState(false);
  const bentoLanguages = [
    { name: 'Hindi', code: 'hi', sample: 'सुबह 1 गोली (खाना खाने के बाद), शाम 1 गोली' },
    { name: 'Bengali', code: 'bn', sample: 'সকালে ১টি ট্যাবলেট (খাবারের পর), সন্ধ্যায় ১টি ট্যাবলেট' },
    { name: 'Tamil', code: 'ta', sample: 'காலை 1 மாத்திரை (உணவுக்கு பின்), மாலை 1 மாத்திரை' },
    { name: 'Telugu', code: 'te', sample: 'ఉదయం 1 మాత్ర (ఆహారం తర్వాత), సాయంత్రం 1 మాత్ర' },
    { name: 'Marathi', code: 'mr', sample: 'सकाळी १ गोळी (जेवणानंतर), संध्याकाळी १ गोळी' },
    { name: 'Kannada', code: 'kn', sample: 'ಬೆಳಿಗ್ಗೆ 1 ಮಾತ್ರೆ (ಊಟದ ನಂತರ), ಸಂಜೆ 1 ಮಾತ್ರೆ' },
  ];
  const currentBentoLang = bentoLanguages.find((l) => l.name === bentoLanguage) || bentoLanguages[0];

  // Prescription Demo Section State
  const [demoLang, setDemoLang] = useState('hi');
  const [isPlayingDemoVoice, setIsPlayingDemoVoice] = useState(false);
  const demoTranslations = {
    hi: { med1: 'पैरासिटामोल 500mg: सुबह 1 गोली और रात को 1 गोली खाने के बाद 5 दिनों के लिए लें।', med2: 'कफ सिरप: दिन में 3 बार 2 चम्मच लें।' },
    kn: { med1: 'ಪ್ಯಾರಸಿಟಮಾಲ್ 500mg: ಬೆಳಿಗ್ಗೆ 1 ಮಾತ್ರೆ ಮತ್ತು ರಾತ್ರಿ 1 ಮಾತ್ರೆ ಊಟದ ನಂತರ 5 ದಿನಗಳ ಕಾಲ ತೆಗೆದುಕೊಳ್ಳಿ.', med2: 'ಕೆಮ್ಮಿನ ಸಿರಪ್: ದಿನಕ್ಕೆ 3 ಬಾರಿ 2 ಚಮಚ ತೆಗೆದುಕೊಳ್ಳಿ.' },
    ta: { med1: 'பாரசிட்டமால் 500mg: காலை 1 மாத்திரை மற்றும் இரவு 1 மாத்திரை உணவுக்கு பின் 5 நாட்களுக்கு சாப்பிடவும்.', med2: 'இருமல் மருந்து: ஒரு நாளைக்கு 3 முறை 2 தேக்கரண்டி எடுக்கவும்.' },
    te: { med1: 'పారాసిటమాల్ 500mg: ఉదయం 1 మాత్ర మరియు రాత్రి 1 మాత్ర భోజనం తర్వాత 5 రోజులు తీసుకోండి.', med2: 'దగ్గు సిరప్: రోజుకు 3 సార్లు 2 చెంచాలు తీసుకోండి.' },
    mr: { med1: 'पॅरासिटामॉल 500mg: सकाळी १ गोळी आणि रात्री १ गोळी जेवणानंतर ५ दिवस घ्या.', med2: 'खोकल्याचे औषध: दिवसातून ३ वेळा २ चमचे घ्या.' },
  };

  // Medication Schedule Demo State
  const [schedule, setSchedule] = useState([
    { id: 1, slot: 'Morning', med: 'Paracetamol 500 mg', detail: '1 tablet after breakfast (PC)', taken: true },
    { id: 2, slot: 'Afternoon', med: 'Cough Syrup', detail: '2 teaspoons after lunch (PC)', taken: false },
    { id: 3, slot: 'Night', med: 'Paracetamol 500 mg', detail: '1 tablet after dinner (HS)', taken: false },
  ]);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Helper Navigation Handlers
  const handleNavClick = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else if (onNavigate) onNavigate(ROUTES.PUBLIC.HOME, sectionId);
    else navigateTo(ROUTES.PUBLIC.HOME);
  };

  const handleRegisterClick = () => {
    if (onNavigate) onNavigate(ROUTES.AUTH.REGISTER);
    else navigateTo(ROUTES.AUTH.REGISTER);
  };

  const playHeroAudio = () => {
    setIsPlayingHeroDemo(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentHeroSample.hindi);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingHeroDemo(false);
      utterance.onerror = () => setIsPlayingHeroDemo(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingHeroDemo(false), 2500);
    }
  };

  const playBentoAudio = () => {
    setIsPlayingBentoAudio(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentBentoLang.sample);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingBentoAudio(false);
      utterance.onerror = () => setIsPlayingBentoAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingBentoAudio(false), 2500);
    }
  };

  const playDemoAudio = async () => {
    if (!isPlayingDemoVoice) {
      setIsPlayingDemoVoice(true);
      const textToSpeak = `${demoTranslations[demoLang].med1}. ${demoTranslations[demoLang].med2}`;
      await speakNativeAudio(textToSpeak, demoLang);
      setIsPlayingDemoVoice(false);
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingDemoVoice(false);
    }
  };

  const toggleMedicationSlot = (id) => {
    setSchedule(schedule.map(s => s.id === id ? { ...s, taken: !s.taken } : s));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      
      {/* 1. TOP UTILITY HELPLINE & LANGUAGE BAR */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-3 sm:px-6 font-sans transition-colors relative z-50 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium w-full sm:w-auto justify-between sm:justify-start">
            <span className="flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold animate-pulse shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              24/7 HELPLINE
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <a href="tel:1800787254" className="flex items-center gap-1.5 hover:text-teal-300 transition-colors text-[11px] sm:text-xs">
              <PhoneIcon size={13} className="text-teal-400 shrink-0" />
              <span>Emergency SOS: <strong className="text-white">1800-RURAL-HEALTH</strong></span>
            </a>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-hidden">
            <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0 hidden md:inline">Regional Audio:</span>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto py-0.5">
              {languages.map((lang) => (
                <button
                  key={lang.name}
                  onClick={() => setSelectedLanguage(lang.name)}
                  className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md transition-all cursor-pointer shrink-0 ${
                    selectedLanguage === lang.name
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PUBLIC NAVIGATION BAR */}
      <PublicNavbar onNavigate={onNavigate} />

      {/* MAIN LANDING CONTENT */}
      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section id="home" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8 sm:pb-12 font-sans transition-colors relative overflow-hidden">
          <div className="absolute top-4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-400/20 dark:bg-teal-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-teal-400/15 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mb-6 sm:mb-8">
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
              <div className="inline-flex items-center gap-2 gradient-badge-emerald px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wide shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#059669] dark:bg-teal-400 animate-pulse shrink-0" />
                <span className="font-display">AI-POWERED RURAL HEALTHCARE PLATFORM</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Every patient deserves to understand their own{' '}
                <span className="text-[#0F766E] dark:text-teal-400 italic font-accent-serif font-normal">prescription.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Complex medical notes should never become a barrier to safe rural healthcare. Swasthya Sanchar AI converts doctor handwriting into simple regional audio guidance and visual 5-day treatment schedules.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  onClick={handleRegisterClick}
                  className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#095650] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl shadow-lg shadow-emerald-900/15 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Try Swasthya Sanchar</span>
                  <ArrowRightIcon size={18} color="#fff" />
                </button>

                <button
                  onClick={() => handleNavClick('bento-features')}
                  className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:border-slate-300"
                >
                  <PlayIcon size={16} className="text-[#0F766E] dark:text-teal-400" />
                  <span>Explore Features</span>
                </button>
              </div>

              {/* Interactive Quick Prescription Scanner Widget */}
              <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-900/5 space-y-3 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">
                    <SparklesIcon size={15} color="#0F766E" className="shrink-0" />
                    <span>Test Live Prescription Scanner</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 dark:bg-teal-950 text-[#0F766E] dark:text-teal-300 px-2 py-0.5 rounded-full font-bold shrink-0">Try Demo</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {Object.keys(samplePrescriptions).map((key) => (
                    <button
                      key={key}
                      onClick={() => setHeroSample(key)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                        heroSample === key
                          ? 'bg-[#0F766E] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
                  <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono gap-1">
                    <span className="truncate">Doctor Note: <i>{currentHeroSample.raw}</i></span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">100% Parsed</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {currentHeroSample.parsed}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs text-[#0F766E] dark:text-teal-300 font-semibold leading-tight">{currentHeroSample.hindi}</span>
                    <button
                      onClick={playHeroAudio}
                      className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#095650] text-white text-[11px] font-bold px-3 py-1 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95 shadow-xs shrink-0"
                    >
                      <SpeakerIcon size={12} color="#fff" />
                      <span>{isPlayingHeroDemo ? 'Playing Audio...' : 'Listen Audio'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/80 dark:border-slate-800 shadow-xl group max-w-lg mx-auto lg:max-w-none">
                <img
                  src="/images/hero-doctor.jpg"
                  alt="Professional Indian Doctor in Rural Healthcare Clinic"
                  className="w-full h-[340px] sm:h-[420px] lg:h-[460px] object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="absolute -top-3 right-2 sm:-right-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-purple-200 dark:border-purple-900/80 p-2.5 sm:p-3 rounded-xl shadow-xl flex items-center gap-2.5 card-hover-effect z-20">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold shrink-0">
                  <SpeakerIcon size={16} color="#7e22ce" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white font-display leading-tight">🎙️ Regional Voice Engine</div>
                  <div className="text-[10px] text-purple-700 dark:text-purple-300 font-medium flex items-center gap-1 mt-0.5">
                    <span>12+ Languages</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-3 left-2 sm:-left-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-amber-200 dark:border-amber-900/80 p-2.5 sm:p-3 rounded-xl shadow-xl flex items-center gap-2.5 card-hover-effect z-20">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shrink-0">
                  <HeartIcon size={16} color="#d97706" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white font-display leading-tight">💊 Visual 5-Day Pillbox</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">Morning ☀️ Taken ✓</div>
                </div>
              </div>

              <div className="absolute bottom-4 right-2 sm:right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-teal-200 dark:border-teal-900/80 p-2 rounded-xl shadow-md flex items-center gap-1.5 card-hover-effect z-20">
                <span className="text-amber-500 font-bold text-xs sm:text-sm">⭐ 4.9/5</span>
                <span className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-300 font-semibold">ASHA Approved</span>
              </div>
            </div>
          </div>
        </section>

        {/* FLOATING 4-CARD SERVICE FEATURE STRIP */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-30 font-sans mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { id: 'prescription-demo', icon: <DocumentIcon size={22} color="#0F766E" />, badgeBg: 'bg-teal-100 dark:bg-teal-950/80', title: 'OCR Rx Scanner', desc: 'Transforms handwritten doctor notes to plain text.', color: 'border-teal-200 dark:border-teal-800/80' },
              { id: 'bento-features', icon: <SpeakerIcon size={22} color="#7e22ce" />, badgeBg: 'bg-purple-100 dark:bg-purple-950/80', title: '12+ Voice Engines', desc: 'Audio instructions in Hindi, Tamil, Bengali & more.', color: 'border-purple-200 dark:border-purple-800/80' },
              { id: 'patients', icon: <QrCodeIcon size={22} color="#1d4ed8" />, badgeBg: 'bg-blue-100 dark:bg-blue-950/80', title: 'ABHA Health Vault', desc: 'Instant digital ID card with scannable QR code.', color: 'border-blue-200 dark:border-blue-800/80' },
              { id: 'safety', icon: <BellIcon size={22} color="#e11d48" />, badgeBg: 'bg-rose-100 dark:bg-rose-950/80', title: 'Caregiver SOS', desc: 'Real-time SMS & push alerts for missed doses.', color: 'border-rose-200 dark:border-rose-800/80' },
            ].map((item) => (
              <div
                key={item.title}
                onClick={() => handleNavClick(item.id)}
                className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border ${item.color} rounded-2xl p-5 shadow-xl shadow-slate-900/5 card-hover-effect cursor-pointer flex flex-col justify-between group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl ${item.badgeBg} flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform duration-200`}>
                    {item.icon}
                  </div>
                  <span className="text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    <ArrowRightIcon size={16} />
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0F766E] dark:group-hover:text-teal-400 transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BENTO GRID SHOWCASE */}
        <section id="bento-features" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 gradient-badge-emerald px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#059669] dark:bg-teal-400" />
              <span>ADVANCED RURAL HEALTHCARE CAPABILITIES</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Designed for Clarity, Accessibility, and Trust
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Bridging the gap between complex doctor instructions and rural patient comprehension through visual pillboxes, voice guidance, and ABHA digital health records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-900/5 card-hover-effect flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-[#0F766E] dark:text-teal-300 flex items-center justify-center mb-4 shadow-xs">
                  <DocumentIcon size={22} color="#0F766E" />
                </div>
                <span className="text-[11px] font-bold text-[#0F766E] dark:text-teal-400 uppercase tracking-wider block mb-1 font-display">Module 01</span>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
                  AI Prescription OCR & Simplification Engine
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed max-w-xl">
                  Doctor handwriting is automatically scanned and tokenized. Complex medical terms are converted into clear instructions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 sm:p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Original Prescription Note</div>
                  <div className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-amber-50 dark:bg-amber-950/40 p-2 rounded border border-amber-200/60 dark:border-amber-800/60 italic leading-relaxed">
                    "Tab Metformin 500mg - 1 BD PC (7 days)"<br/>
                    "Tab Amoxicillin 250mg - 1 TDS PC (5 days)"
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-emerald-200 dark:border-teal-800/80 shadow-2xs">
                  <div className="text-[10px] font-bold text-[#0F766E] dark:text-teal-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <CheckIcon size={13} color="#0F766E" /> AI Parsed Instructions
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
                    <div className="flex items-center justify-between bg-emerald-50 dark:bg-teal-950/60 px-2 py-1 rounded font-semibold">
                      <span>Metformin (500mg)</span>
                      <span className="text-[10px] bg-emerald-200 dark:bg-teal-800 text-[#0F766E] dark:text-teal-200 px-1.5 py-0.5 rounded font-bold">2x Daily (After Food)</span>
                    </div>
                    <div className="flex items-center justify-between bg-emerald-50 dark:bg-teal-950/60 px-2 py-1 rounded font-semibold">
                      <span>Amoxicillin (250mg)</span>
                      <span className="text-[10px] bg-emerald-200 dark:bg-teal-800 text-[#0F766E] dark:text-teal-200 px-1.5 py-0.5 rounded font-bold">3x Daily (After Food)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-900/5 card-hover-effect flex flex-col justify-between relative">
              <div>
                <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-4 shadow-xs">
                  <SpeakerIcon size={22} color="#7e22ce" />
                </div>
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block mb-1 font-display">Module 02</span>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">12+ Regional Voice Engines</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">Provides spoken voice instructions for patients with low literacy skills.</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 space-y-2.5">
                <div className="flex flex-wrap gap-1">
                  {bentoLanguages.slice(0, 4).map((lang) => (
                    <button
                      key={lang.name}
                      onClick={() => setBentoLanguage(lang.name)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        bentoLanguage === lang.name ? 'bg-purple-700 text-white shadow-xs' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-50'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-bold text-purple-700 dark:text-purple-400 uppercase">Spoken Audio ({bentoLanguage})</div>
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{currentBentoLang.sample}</div>
                  </div>
                  <button onClick={playBentoAudio} className="w-8 h-8 rounded-lg bg-purple-700 hover:bg-purple-800 text-white flex items-center justify-center flex-shrink-0 cursor-pointer transition-transform active:scale-95 shadow-xs">
                    {isPlayingBentoAudio ? (
                      <span className="flex items-center gap-0.5">
                        <span className="w-1 h-2.5 bg-white animate-wave-bar" />
                        <span className="w-1 h-2.5 bg-white animate-wave-bar animation-delay-200" />
                      </span>
                    ) : (
                      <PlayIcon size={13} color="#fff" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST & IMPACT STATS */}
        <div className="bg-slate-900 text-white border-y border-slate-800 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 text-center">
              {[
                { label: 'Regional Languages', value: '12+', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800' },
                { label: 'Prescription OCR Accuracy', value: '99%', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' },
                { label: 'Visual Pillbox Tracking', value: '5-Day', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' },
                { label: 'Emergency SOS Response', value: '24/7', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' },
              ].map((item, idx) => (
                <div key={idx} className={`${item.bg} border p-3.5 sm:p-4 rounded-2xl transition-transform hover:-translate-y-1`}>
                  <div className={`font-display text-2xl sm:text-3xl font-extrabold ${item.color} leading-none mb-1`}>{item.value}</div>
                  <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROBLEM / HEALTHCARE CHALLENGE */}
        <section id="problem" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-4 py-1.5 rounded-full inline-block">
              THE REAL HEALTHCARE CHALLENGE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              A prescription is only useful when a patient can understand it.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
              For many rural and underserved patients, the primary barrier is not simply reaching a clinic—it is making sense of instructions after leaving the doctor’s office.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { id: '01', title: 'Difficult Handwriting', desc: 'Doctor prescriptions may contain handwriting, abbreviations and medical terminology that are difficult for patients to interpret.' },
              { id: '02', title: 'Language Barriers', desc: 'Healthcare instructions may not be available in the regional language patients understand most comfortably.' },
              { id: '03', title: 'Low Health Literacy', desc: 'Patients may recognize a medicine but still be unsure about exact dosage, timing, duration or special meal instructions.' },
              { id: '04', title: 'Missed Medication & Follow-Up', desc: 'Without clear guidance, patients frequently miss doses or discontinue treatments prematurely.' },
            ].map((c) => (
              <div key={c.id} className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden">
                <span className="text-3xl font-extrabold text-stone-300 dark:text-slate-600 block">{c.id}</span>
                <h3 className="font-bold text-lg text-stone-900 dark:text-white">{c.title}</h3>
                <p className="text-sm text-stone-600 dark:text-slate-300 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SOLUTIONS SECTION */}
        <section id="solutions" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 bg-white dark:bg-[#161F30] rounded-3xl border border-stone-200/80 dark:border-slate-800 shadow-sm my-4 sm:my-6 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-[#F0FDF4] dark:bg-teal-950/60 border border-[#bbf7d0] dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
              CORE PRODUCT SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              Turning medical information into something people can understand.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
              Swasthya Sanchar AI combines document intelligence, medical information extraction, language simplification, regional-language translation and voice assistance into one communication layer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: DocumentIcon, title: 'Prescription Understanding', desc: 'Convert complex prescription details into structured, easy-to-read instructions.' },
              { icon: BrainIcon, title: 'Medical Document Simplification', desc: 'Transform medical terminology into everyday regional language explanations.' },
              { icon: TranslateIcon, title: 'Regional Language Support', desc: 'Present healthcare information in the user’s preferred native language (22+ Indian languages).' },
              { icon: SpeakerIcon, title: 'Voice Guidance', desc: 'Allow patients to listen to instructions in native speech audio instead of relying on text.' },
              { icon: PillIcon, title: 'Medication Assistance', desc: 'Organize medication schedules with clear morning, lunch, and bedtime dosage slots.' },
              { icon: UserIcon, title: 'Healthcare Worker Support', desc: 'Empower frontline ASHA workers to scan prescriptions and assist villagers during field visits.' },
            ].map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="bg-[#FDFBF7] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 rounded-3xl space-y-3 hover:border-[#0F766E] dark:hover:border-teal-500 transition-all hover:shadow-md">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/60 rounded-xl flex items-center justify-center text-[#0F766E] dark:text-teal-300">
                    <Icon size={20} className="text-[#0B4F42] dark:text-teal-300" />
                  </div>
                  <h3 className="font-bold text-lg text-stone-900 dark:text-white">{cap.title}</h3>
                  <p className="text-sm text-stone-600 dark:text-slate-300 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
              CONNECTED PRODUCT WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              From prescription to understanding.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
              A seamless 7-step communication pipeline designed to bridge the gap between doctor notes and patient comprehension.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 relative">
            {[
              { num: '01', title: 'Upload', desc: 'Patient or ASHA worker uploads a prescription or medical document image.', icon: DocumentIcon },
              { num: '02', title: 'Extract', desc: 'OCR & medical NLP extract text and key medical information.', icon: BrainIcon },
              { num: '03', title: 'Understand', desc: 'Identify medicine names, dosage, timing, duration and meal instructions.', icon: HeartIcon },
              { num: '04', title: 'Simplify', desc: 'Convert complex medical jargon into easy-to-understand explanations.', icon: BrainIcon },
              { num: '05', title: 'Translate', desc: 'Translate explanation into the patient’s preferred regional language.', icon: TranslateIcon },
              { num: '06', title: 'Listen', desc: 'Generate clear text-to-speech audio guidance for low-literacy users.', icon: SpeakerIcon },
              { num: '07', title: 'Remember', desc: 'Organize dosage schedules and reminder notifications.', icon: ClockIcon },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 p-4 rounded-2xl space-y-2 flex flex-col justify-between shadow-xs hover:border-[#0F766E] dark:hover:border-teal-500 transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 bg-teal-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                      {s.num}
                    </span>
                    <Icon size={16} className="text-[#0B4F42] dark:text-teal-400" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white">{s.title}</h3>
                    <p className="text-[11px] text-stone-600 dark:text-slate-300 leading-tight">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PRESCRIPTION DEMO */}
        <section id="prescription-demo" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto space-y-3">
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

          <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-6 relative overflow-hidden transition-colors">
            <div className="bg-stone-50 dark:bg-slate-900 border border-stone-300 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-extrabold text-stone-600 dark:text-slate-400 uppercase tracking-wider">ORIGINAL DOCTOR NOTE</span>
                <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">SAMPLE DATA</span>
              </div>
              <div className="font-mono text-sm text-slate-800 dark:text-slate-200 space-y-2 bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-stone-200 dark:border-slate-700 shadow-2xs">
                <div className="font-bold text-stone-900 dark:text-white">Rx:</div>
                <div>1. Tab. Paracetamol 500mg — 1-0-1 × 5 days (PC)</div>
                <div>2. Syrup Cough & Cold — 2 tsp TDS</div>
                <div className="text-xs text-stone-500 dark:text-slate-400 italic border-t border-stone-100 dark:border-slate-700 pt-2">Note: Drink warm water. Rest for 3 days.</div>
              </div>
            </div>

            <div className="bg-[#F0FDF4] dark:bg-teal-950/40 border border-[#bbf7d0] dark:border-teal-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#bbf7d0] dark:border-teal-800/80 pb-2">
                <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-wider">SWASTHYA SANCHAR EXPLANATION</span>
                <select
                  value={demoLang}
                  onChange={(e) => setDemoLang(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-[#bbf7d0] dark:border-slate-700 text-stone-900 dark:text-white text-xs font-bold px-3 py-1 rounded-xl cursor-pointer outline-none shadow-xs"
                >
                  <option value="hi">🇮🇳 Hindi (हिंदी)</option>
                  <option value="kn">🇮🇳 Kannada (ಕನ್ನಡ)</option>
                  <option value="ta">🇮🇳 Tamil (தமிழ்)</option>
                  <option value="te">🇮🇳 Telugu (తెలుగు)</option>
                  <option value="mr">🇮🇳 Marathi (मराठी)</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-[#bbf7d0] dark:border-slate-800 shadow-2xs space-y-1">
                  <div className="font-bold text-sm text-stone-900 dark:text-white">💊 Paracetamol 500 mg</div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-slate-200 leading-relaxed font-semibold">{demoTranslations[demoLang].med1}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-[#bbf7d0] dark:border-slate-800 shadow-2xs space-y-1">
                  <div className="font-bold text-sm text-stone-900 dark:text-white">🥄 Cough Syrup</div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-slate-200 leading-relaxed font-semibold">{demoTranslations[demoLang].med2}</p>
                </div>
              </div>

              <button
                onClick={playDemoAudio}
                className="w-full sm:w-auto bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <SpeakerIcon size={16} color="#fff" />
                <span>{isPlayingDemoVoice ? 'Speaking Audio...' : '🔊 Listen to Audio Guidance'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* PURPOSE-BUILT DIFFERENTIATION TABLE */}
        <section id="difference" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
              PURPOSE-BUILT PRODUCT
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              Not another generic healthcare chatbot.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
              Swasthya Sanchar AI is designed specifically around the communication gap between healthcare instructions and patient understanding.
            </p>
          </div>

          <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-100 dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-200 font-extrabold">
                    <th className="py-4 px-5">Capability & Feature</th>
                    <th className="py-4 px-5 text-stone-500 dark:text-slate-400">Generic Chatbots</th>
                    <th className="py-4 px-5 text-[#0F766E] dark:text-teal-300 bg-teal-50/60 dark:bg-teal-950/60">Swasthya Sanchar AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-slate-800 font-medium text-stone-800 dark:text-slate-200">
                  {[
                    { feature: 'Focus Area', generic: 'General chat & generic answers', swasthya: 'Prescription-focused communication & extraction' },
                    { feature: 'Language Processing', generic: 'English-first text responses', swasthya: '22+ Indian regional languages & spoken voice TTS' },
                    { feature: 'Accessibility', generic: 'Text-heavy typing interface', swasthya: 'Voice-first 1-tap audio playback for zero-literacy' },
                    { feature: 'Ecosystem Support', generic: 'Individual patient-only chat', swasthya: 'Integrated Patient + ASHA Worker + Doctor + Caregiver hub' },
                    { feature: 'Medication Safety', generic: 'Generic web advice', swasthya: 'Preserves exact prescription dosage, timing & duration' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-4 px-5 font-bold text-stone-900 dark:text-white">{row.feature}</td>
                      <td className="py-4 px-5 text-stone-500 dark:text-slate-400 flex items-center gap-2">
                        <CloseIcon size={16} color="#9ca3af" />
                        <span>{row.generic}</span>
                      </td>
                      <td className="py-4 px-5 text-[#0F766E] dark:text-teal-300 bg-teal-50/30 dark:bg-teal-950/40 font-bold flex items-center gap-2">
                        <CheckIcon size={16} className="text-[#0B4F42] dark:text-teal-400" />
                        <span>{row.swasthya}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* AI PIPELINE ARCHITECTURE */}
        <section id="ai-technology" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 bg-white dark:bg-[#161F30] rounded-3xl border border-stone-200/80 dark:border-slate-800 shadow-sm my-4 sm:my-6 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
              AI PIPELINE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              AI built around healthcare communication.
            </h2>
            <p className="text-base sm:text-lg text-[#525252] dark:text-slate-300 leading-relaxed">
              Powered by vision OCR, Groq LLM inference acceleration, specialized medical information extraction, and native voice synthesis.
            </p>
          </div>

          <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 rounded-3xl space-y-3 transition-colors">
            <div className="text-xs font-extrabold text-stone-500 dark:text-slate-400 uppercase tracking-widest text-center">END-TO-END PROCESSING PIPELINE</div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs font-bold text-stone-800 dark:text-slate-200">
              {['Document Image', 'OCR Vision', 'Medical Extraction', 'NLP Processing', 'LLM Simplification', 'Regional Translation', 'Text-to-Speech', 'Patient Guidance'].map((step, idx, arr) => (
                <React.Fragment key={idx}>
                  <div className="bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-white px-3 py-1.5 rounded-lg shadow-2xs">
                    {step}
                  </div>
                  {idx < arr.length - 1 && <span className="text-[#0F766E] dark:text-teal-400 font-extrabold text-sm">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* FOR PATIENTS */}
        <section id="patients" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
              ZERO-LITERACY ACCESSIBLE DESIGN
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              Designed for patients who should not need a medical degree to use it.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
              High-contrast touch targets, native audio playback, and visual icons engineered for users with limited digital literacy.
            </p>
          </div>
        </section>

        {/* FOR ASHA WORKERS */}
        <section id="asha-workers" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 bg-white dark:bg-[#161F30] rounded-3xl border border-stone-200/80 dark:border-slate-800 shadow-sm my-4 sm:my-6 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
              FRONTLINE HEALTHCARE WORKER PLATFORM
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              Built for the people who already serve the community.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
              ASHA workers act as an assisted-access bridge for villagers who struggle to use smartphones or interpret medical documents independently.
            </p>
          </div>
        </section>

        {/* FOR DOCTORS */}
        <section id="doctors" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
              CLINIC & PHC DOCTOR INTEGRATION
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              Help patients understand medical instructions after they leave the clinic.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
              Extending clinical instructions into the patient’s home through automated regional language audio and structured medication schedules.
            </p>
          </div>
        </section>

        {/* RESPONSIBLE AI & SAFETY */}
        <section id="safety" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 bg-white dark:bg-[#161F30] rounded-3xl border border-stone-200/80 dark:border-slate-800 shadow-sm my-4 sm:my-6 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
              RESPONSIBLE AI & GOVERNANCE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              AI that assists. Humans remain in control.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
              Engineered with safety guardrails to improve healthcare understanding without replacing clinical decision-making.
            </p>
          </div>

          <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-5 flex items-start gap-3.5 text-xs sm:text-sm text-amber-950 dark:text-amber-200 transition-colors">
            <AlertIcon size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold text-amber-950 dark:text-amber-100">Medical Disclaimer:</strong> Swasthya Sanchar AI is a communication and understanding assistant. It does not replace qualified healthcare professionals.
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 bg-white dark:bg-[#161F30] rounded-3xl border border-stone-200/80 dark:border-slate-800 shadow-sm my-4 sm:my-6 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              Everything you need to know about Swasthya Sanchar AI.
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              { q: 'Does Swasthya Sanchar AI replace doctors?', a: 'No. Swasthya Sanchar AI is a communication and understanding assistant designed to help patients understand prescriptions. It does not replace medical professionals.' },
              { q: 'Which languages can it support?', a: 'The platform supports 22+ Indian regional languages including Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Gujarati, Malayalam, and English, with spoken voice audio playback.' },
              { q: 'Can it understand prescriptions?', a: 'Yes. Uploaded prescription images are processed using Optical Character Recognition (OCR) and specialized medical NLP to extract medicine names, dosages, frequencies, and durations.' },
              { q: 'How is patient information protected?', a: 'Patient data is protected using role-based access control, secure storage, and strict privacy guardrails so that health records remain private.' },
            ].map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="bg-[#FDFBF7] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-xs">
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer gap-3"
                  >
                    <span>{faq.q}</span>
                    <ChevronDownIcon size={18} className={`text-[#0B4F42] dark:text-teal-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 font-sans transition-colors">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-4 py-1.5 rounded-full inline-block">
              ABOUT SWASTHYA SANCHAR AI
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              Healthcare information should be understandable to everyone.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 dark:text-slate-300 leading-relaxed">
              Swasthya Sanchar AI is a healthcare technology initiative focused on improving communication between healthcare providers, frontline ASHA workers, and underserved rural communities.
            </p>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 font-sans transition-colors">
          <div className="bg-[#0B4F42] dark:bg-slate-900 border border-teal-800/40 dark:border-slate-800 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden transition-colors">
            <div className="max-w-3xl mx-auto space-y-4 relative z-10">
              <span className="bg-teal-600/60 dark:bg-teal-950/80 border border-teal-400/40 dark:border-teal-800 text-teal-100 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-block">
                START USING SWASTHYA SANCHAR AI
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Healthcare shouldn't be difficult to understand.
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
              <button
                onClick={handleRegisterClick}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0B4F42] font-bold text-sm sm:text-base px-7 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRightIcon size={18} className="text-[#0B4F42]" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold text-xs">
              SS
            </div>
            <span className="font-bold text-white text-sm">Swasthya Sanchar AI</span>
          </div>
          <div>© {new Date().getFullYear()} Swasthya Sanchar AI. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
