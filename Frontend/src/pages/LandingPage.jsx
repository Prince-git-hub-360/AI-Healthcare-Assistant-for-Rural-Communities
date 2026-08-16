import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRightIcon, PlayIcon, CheckIcon, DocumentIcon, BrainIcon, SpeakerIcon, 
  HeartIcon, SparklesIcon, PhoneIcon, QrCodeIcon, BellIcon, CalendarIcon, 
  ShieldIcon, TranslateIcon, AlertIcon, CloseIcon, ChevronDownIcon, HospitalIcon, 
  PillIcon, UserIcon, ClockIcon, ChevronLeftIcon 
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
    { name: 'Telugu', code: 'te', sample: 'ఉదయం 1 మాత్ర (ఆహారం తర్వాత), సాయంత్రம் 1 మాత్ర' },
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

  // Testimonials Carousel Auto-Rotate State
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    {
      quote: "Swasthya Sanchar allows our ASHA team to explain complex prescriptions to villagers in their native Kannada dialect within seconds during house visits.",
      author: "Kavitha M.",
      role: "Frontline ASHA Worker, Mandya District",
      badge: "ASHA Worker"
    },
    {
      quote: "My elderly parents can now press one single button on their phone to hear dosage timings in clear Hindi audio. It gives our family total peace of mind.",
      author: "Rajesh Sharma",
      role: "Family Caregiver, Kanpur Rural",
      badge: "Caregiver"
    },
    {
      quote: "Patients adhere to multi-day antibiotic courses much better when provided with visual 5-day treatment pillboxes and spoken regional instructions.",
      author: "Dr. Arisudan Rao",
      role: "Primary Health Centre Physician, Chittoor",
      badge: "PHC Doctor"
    }
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  // FAQ Accordion State (Only ONE open at a time)
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const faqs = [
    { q: 'Is Swasthya Sanchar AI free for rural patients?', a: 'Yes. Swasthya Sanchar AI is free for patients and frontline ASHA workers to ensure accessible rural healthcare communication.' },
    { q: 'What happens if doctor handwriting cannot be read?', a: 'If prescription handwriting is unclear or torn, the system flags the confidence level and prompts an ASHA worker or doctor for 1-tap verification.' },
    { q: 'Which regional languages are supported?', a: 'The platform supports 22+ Indian languages including Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Gujarati, Malayalam, and English with spoken voice audio.' },
    { q: 'How is patient medical data handled and protected?', a: 'Patient health data is encrypted and managed with role-based access control conforming to Ayushman Bharat Digital Mission (ABDM) privacy standards.' },
    { q: 'Can healthcare workers verify unclear information?', a: 'Yes. Primary Health Centre doctors and ASHA field workers have a dedicated portal to review, edit, and confirm digitized prescriptions anytime.' }
  ];

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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      
      {/* 1. TOP UTILITY BAR (Scrolls away normally) */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-3 sm:px-6 font-sans transition-colors relative z-40 overflow-hidden">
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

      {/* 2. STICKY MAIN NAVBAR (Position sticky top-0 z-50) */}
      <PublicNavbar onNavigate={onNavigate} />

      {/* MAIN LANDING CONTENT */}
      <main className="flex-1 space-y-12 sm:space-y-16 py-6 sm:py-8">
        
        {/* HERO SECTION */}
        <section id="home" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans transition-colors relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
              <div className="inline-flex items-center gap-2 gradient-badge-emerald px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wide shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#059669] dark:bg-teal-400 animate-pulse shrink-0" />
                <span className="font-display">AI-POWERED RURAL HEALTHCARE PLATFORM</span>
              </div>

              {/* Preserved Verbatim Motto */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Every patient deserves to understand their own{' '}
                <span className="text-[#0F766E] dark:text-teal-400 italic font-accent-serif font-normal">prescription.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Complex medical notes should never become a barrier to safe rural healthcare. Swasthya Sanchar AI converts doctor handwriting into simple regional audio guidance and visual treatment schedules.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  onClick={handleRegisterClick}
                  className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#095650] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
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

              {/* Interactive Quick Prescription Scanner Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
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

            {/* Preserved Verbatim Doctor Image */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-xl group max-w-lg mx-auto lg:max-w-none">
                <img
                  src="/images/hero-doctor.jpg"
                  alt="Professional Indian Doctor in Rural Healthcare Clinic"
                  className="w-full h-[340px] sm:h-[420px] lg:h-[460px] object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="absolute -top-3 right-2 sm:-right-2 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/80 p-2.5 sm:p-3 rounded-xl shadow-xl flex items-center gap-2.5 z-20">
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

              <div className="absolute -bottom-3 left-2 sm:-left-2 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/80 p-2.5 sm:p-3 rounded-xl shadow-xl flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shrink-0">
                  <HeartIcon size={16} color="#d97706" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white font-display leading-tight">💊 Visual 5-Day Pillbox</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">Morning ☀️ Taken ✓</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* TRUST LIGHT TINTED BAND */}
        <div className="bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80 py-4 px-4 sm:px-6 font-sans">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2">🏥 Primary Health Centre Verified</span>
            <span className="flex items-center gap-2">🗣️ 22+ Native Dialects Audio</span>
            <span className="flex items-center gap-2">⚡ Accelerated Groq Vision OCR</span>
            <span className="flex items-center gap-2">🔒 Ayushman Bharat (ABDM) Data Standards</span>
          </div>
        </div>

        {/* NEW DARK NAVY STATS BAND */}
        <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-1">PLATFORM METRICS</span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">Improving Healthcare Access Across Rural Districts</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              {[
                { label: 'Primary Health Centres Piloting', value: '40+' },
                { label: 'Regional Languages Supported', value: '22+' },
                { label: 'Prescriptions Translated', value: '9,600+' },
                { label: 'Fewer Missed Doses', value: '31%' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-teal-400 mb-1">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (Connected Step Path Visual) */}
        <section id="how-it-works" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest">
              CONNECTED PRODUCT WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              From Prescription to Understanding
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              A 6-step communication journey built to help rural patients follow clinical instructions safely.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
            {[
              { step: '01', title: 'Upload', desc: 'Upload prescription image.', icon: DocumentIcon },
              { step: '02', title: 'Understand', desc: 'Medical OCR parses notes.', icon: BrainIcon },
              { step: '03', title: 'Translate', desc: 'Translates to regional language.', icon: TranslateIcon },
              { step: '04', title: 'Listen', desc: 'Plays spoken audio instructions.', icon: SpeakerIcon },
              { step: '05', title: 'Remember', desc: 'Organizes 5-day pillbox slots.', icon: ClockIcon },
              { step: '06', title: 'Act', desc: 'Receives dose reminders & SOS.', icon: BellIcon },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="bg-white dark:bg-[#161F30] border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl space-y-2 flex flex-col justify-between shadow-xs hover:border-[#0F766E] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F766E] dark:text-teal-300 bg-teal-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {s.step}
                    </span>
                    <Icon size={16} className="text-[#0B4F42] dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{s.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CORE PRODUCT SOLUTIONS */}
        <section id="solutions" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest">
              CORE PRODUCT SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Turning Medical Jargon into Everyday Clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: DocumentIcon, title: 'Prescription OCR Scanner', desc: 'Convert complex doctor handwriting into structured plain-text instructions.' },
              { icon: SpeakerIcon, title: '12+ Voice Audio Engines', desc: 'Spoken voice playback in Hindi, Tamil, Telugu, Bengali, Kannada & Marathi.' },
              { icon: PillIcon, title: 'Visual Treatment Schedule', desc: 'Organizes morning, lunch, and bedtime dosage slots with 1-tap tracking.' },
            ].map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/60 rounded-xl flex items-center justify-center text-[#0F766E]">
                    <Icon size={20} className="text-[#0B4F42] dark:text-teal-300" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{cap.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* PRESCRIPTION DEMO */}
        <section id="prescription-demo" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">ORIGINAL DOCTOR NOTE</span>
                <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">SAMPLE</span>
              </div>
              <div className="font-mono text-xs text-slate-800 dark:text-slate-200 space-y-2 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white">Rx Note:</div>
                <div>1. Tab. Paracetamol 500mg — 1-0-1 × 5 days (PC)</div>
                <div>2. Syrup Cough & Cold — 2 tsp TDS</div>
              </div>
            </div>

            <div className="bg-[#F0FDF4] dark:bg-teal-950/40 border border-[#bbf7d0] dark:border-teal-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#bbf7d0] dark:border-teal-800/80 pb-2">
                <span className="text-xs font-bold text-[#0F766E] dark:text-teal-300 uppercase tracking-wider">SWASTHYA SANCHAR TRANSLATION</span>
                <select
                  value={demoLang}
                  onChange={(e) => setDemoLang(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-[#bbf7d0] dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold px-3 py-1 rounded-xl cursor-pointer"
                >
                  <option value="hi">🇮🇳 Hindi (हिंदी)</option>
                  <option value="kn">🇮🇳 Kannada (ಕನ್ನಡ)</option>
                  <option value="ta">🇮🇳 Tamil (தமிழ்)</option>
                  <option value="te">🇮🇳 Telugu (తెలుగు)</option>
                  <option value="mr">🇮🇳 Marathi (मराठी)</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-[#bbf7d0] dark:border-slate-800 space-y-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">💊 Paracetamol 500 mg</div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold">{demoTranslations[demoLang].med1}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-[#bbf7d0] dark:border-slate-800 space-y-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">🥄 Cough Syrup</div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold">{demoTranslations[demoLang].med2}</p>
                </div>
              </div>

              <button
                onClick={playDemoAudio}
                className="bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <SpeakerIcon size={14} color="#fff" />
                <span>{isPlayingDemoVoice ? 'Speaking...' : '🔊 Listen Native Audio'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section id="difference" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="text-center max-w-3xl mx-auto mb-6 space-y-2">
            <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest">
              PURPOSE-BUILT PRODUCT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Not Another Generic Healthcare Chatbot
            </h2>
          </div>

          <div className="bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-extrabold">
                  <th className="py-3 px-4">Capability & Feature</th>
                  <th className="py-3 px-4 text-slate-500">Generic Chatbots</th>
                  <th className="py-3 px-4 text-[#0F766E] dark:text-teal-300 bg-teal-50/60 dark:bg-teal-950/60">Swasthya Sanchar AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {[
                  { feature: 'Focus Area', generic: 'General chat & generic answers', swasthya: 'Prescription-focused communication & extraction' },
                  { feature: 'Language Processing', generic: 'English-first text responses', swasthya: '22+ Indian regional languages & spoken voice TTS' },
                  { feature: 'Accessibility', generic: 'Text-heavy typing interface', swasthya: 'Voice-first 1-tap audio playback for zero-literacy' },
                  { feature: 'Ecosystem Support', generic: 'Individual patient-only chat', swasthya: 'Integrated Patient + ASHA Worker + Doctor + Caregiver hub' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{row.feature}</td>
                    <td className="py-3 px-4 text-slate-500 flex items-center gap-1.5"><CloseIcon size={14} color="#9ca3af" /> {row.generic}</td>
                    <td className="py-3 px-4 text-[#0F766E] dark:text-teal-300 bg-teal-50/30 dark:bg-teal-950/40 font-bold flex items-center gap-1.5"><CheckIcon size={14} className="text-[#0B4F42] dark:text-teal-400" /> {row.swasthya}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3-COLUMN CONSOLIDATED AUDIENCE SECTION */}
        <section id="care-chain" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest">
              ECOSYSTEM INTEGRATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built for Everyone in the Care Chain
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Connecting patients, frontline ASHA workers, and healthcare providers seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs hover:border-[#0F766E] transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-[#0F766E] flex items-center justify-center font-bold text-xl">👤</div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Patients</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Prescriptions converted to plain regional text, 1-tap spoken audio, and 5-day visual treatment schedules.
              </p>
            </div>

            <div className="bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs hover:border-[#0F766E] transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 flex items-center justify-center font-bold text-xl">👩‍⚕️</div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">ASHA Workers</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Door-to-door patient registry, prescription scanning tools, and visit follow-up dashboards for village health workers.
              </p>
            </div>

            <div className="bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs hover:border-[#0F766E] transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 flex items-center justify-center font-bold text-xl">🩺</div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Clinics & Doctors</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Extend clinical instructions into patient homes with verified digital records and post-consultation tracking.
              </p>
            </div>
          </div>
        </section>

        {/* SAFETY & GOVERNANCE (3 Accent Cards) */}
        <section id="safety" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest">
              RESPONSIBLE AI & GOVERNANCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Safety Guardrails & Medical Compliance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                <CheckIcon size={18} />
                <span>Zero Dosage Hallucination</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Strict medical extraction guardrails ensure parsed dosage, frequency, and duration exactly mirror the doctor's note.
              </p>
            </div>

            <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                <ShieldIcon size={18} />
                <span>Human-in-the-Loop</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                ASHA workers and doctors can review, verify, and confirm parsed treatment plans whenever handwriting is ambiguous.
              </p>
            </div>

            <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                <AlertIcon size={18} />
                <span>ABDM Privacy & Security</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Role-based access control and encrypted storage conforming to national digital health standards.
              </p>
            </div>
          </div>
        </section>

        {/* DARK NAVY TESTIMONIALS CAROUSEL */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">COMMUNITY TESTIMONIALS</span>
              <span className="text-xs text-slate-400 font-semibold">{activeTestimonial + 1} of {testimonials.length}</span>
            </div>

            <div className="min-h-[120px] flex flex-col justify-center space-y-3">
              <p className="text-base sm:text-lg font-medium text-slate-200 italic leading-relaxed">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div>
                <div className="font-bold text-white text-sm">{testimonials[activeTestimonial].author}</div>
                <div className="text-xs text-teal-400">{testimonials[activeTestimonial].role}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {/* Carousel Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeTestimonial === idx ? 'w-6 bg-teal-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Keyboard Accessible Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white cursor-pointer transition-colors"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeftIcon size={16} />
                </button>
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white cursor-pointer transition-colors"
                  aria-label="Next Testimonial"
                >
                  <ChevronDownIcon size={16} className="-rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-2xs">
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer gap-3"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDownIcon size={18} className={`text-[#0F766E] dark:text-teal-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="bg-[#0B4F42] dark:bg-slate-900 border border-teal-800/40 dark:border-slate-800 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl mx-auto space-y-4 relative z-10">
              <span className="bg-teal-600/60 dark:bg-teal-950/80 border border-teal-400/40 text-teal-100 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-block">
                START USING SWASTHYA SANCHAR AI
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Healthcare Should Be Easy to Understand
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
              <button
                onClick={handleRegisterClick}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0B4F42] font-bold text-sm sm:text-base px-7 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Get Started Free</span>
                <ArrowRightIcon size={18} className="text-[#0B4F42]" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER (Compact, Non-Bloated) */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-10 pb-8 px-4 sm:px-6 lg:px-8 font-sans text-xs transition-colors">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                  SS
                </div>
                <span className="font-bold text-white text-base">Swasthya Sanchar AI</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Healthcare communication made easier to understand for rural communities.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Product</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => handleNavClick('prescription-demo')} className="hover:text-teal-300 transition-colors">Translate Prescription</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-teal-300 transition-colors">Medication Reminders</button></li>
                <li><button onClick={() => handleNavClick('care-chain')} className="hover:text-teal-300 transition-colors">Health Vault</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">For Care</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => handleNavClick('care-chain')} className="hover:text-teal-300 transition-colors">Patients</button></li>
                <li><button onClick={() => handleNavClick('care-chain')} className="hover:text-teal-300 transition-colors">ASHA Workers</button></li>
                <li><button onClick={() => handleNavClick('care-chain')} className="hover:text-teal-300 transition-colors">Doctors</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Support</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => handleNavClick('faq')} className="hover:text-teal-300 transition-colors">Help & FAQ</button></li>
                <li><a href="tel:108" className="hover:text-teal-300 transition-colors">Emergency 108</a></li>
                <li><button onClick={() => handleNavClick('safety')} className="hover:text-teal-300 transition-colors">Privacy & Terms</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
            <div>© 2026 Swasthya Sanchar. Accessible healthcare communication for everyone.</div>
            <div className="flex items-center gap-3">
              <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
              <span>•</span>
              <span className="hover:text-slate-300 cursor-pointer">Terms</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
