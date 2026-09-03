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
import SwasthyaLogo from '../components/branding/SwasthyaLogo';

// 🚀 Smooth Scroll-Triggered Animated Number Counter
const AnimatedStat = ({ endValue, suffix = '', prefix = '', decimals = 0, duration = 1800 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.15 }
    );

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth Cubic Ease-Out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeOut * endValue;
      setCount(currentVal);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [hasStarted, endValue, duration]);

  return (
    <span ref={domRef} className="inline-block tabular-nums">
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
};

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

  // Prescription Demo Multi-Case Clinical Datasets
  const [demoCase, setDemoCase] = useState('fever');
  const [demoLang, setDemoLang] = useState('hi');
  const [isPlayingDemoVoice, setIsPlayingDemoVoice] = useState(false);
  const demoCasesData = {
    fever: {
      id: 'fever',
      title: '🧒 Childhood Fever & Cough',
      doctorNote: ['1. Syrup Paracetamol 120mg/5ml — 5ml TDS (3 days)', '2. Syrup Amox Clav 228mg — 3.5ml BD (5 days)'],
      hi: {
        med1: 'पैरासिटामोल सिरप: दिन में 3 बार 5ml (1 चम्मच) बुखार में दें।',
        med2: 'एंटीबायोटिक सिरप: सुबह और रात 3.5ml खाने के बाद 5 दिन तक पूरा पिलाएं।'
      },
      kn: {
        med1: 'ಪ್ಯಾರಸಿಟಮಾಲ್ ಸಿರಪ್: ಜ್ವರ ಬಂದಾಗ ದಿನಕ್ಕೆ 3 ಬಾರಿ 5ml (1 ಚಮಚ) ಕುಡಿಸಿ.',
        med2: 'ಆಂಟಿಬಯೋಟಿಕ್ ಸಿರಪ್: ಬೆಳಿಗ್ಗೆ ಮತ್ತು ರಾತ್ರಿ 3.5ml ಊಟದ ನಂತರ 5 ದಿನ ನೀಡಿ.'
      },
      ta: {
        med1: 'பாரசிட்டமால் சிரப்: காய்ச்சலுக்கு ஒரு நாளைக்கு 3 முறை 5ml கொடுக்கவும்.',
        med2: 'ஆன்டிபயாடிக் சிரப்: காலை மற்றும் இரவு உணவுக்கு பின் 3.5ml கொடுக்கவும்.'
      },
      te: {
        med1: 'పారాసిటమాల్ సిరప్: జ్వరానికి రోజుకు 3 సార్లు 5ml ఇవ్వండి.',
        med2: 'యాంటీబయాటిక్ సిరప్: ఉదయం మరియు రాత్రి భోజనం తర్వాత 3.5ml ఇవ్వండి.'
      },
      mr: {
        med1: 'पॅरासिटामॉल सिरप: तापासाठी दिवसातून ३ वेळा ५ml (१ चमचा) द्या.',
        med2: 'अँटीबायोटिक सिरप: सकाळी व रात्री जेवणानंतर ३.५ml ५ दिवस पूर्ण पाजा.'
      }
    },
    diabetes: {
      id: 'diabetes',
      title: '👴 Elderly Diabetes & High BP',
      doctorNote: ['1. Tab Metformin 500mg — 1-0-1 (30 days) AC', '2. Tab Amlodipine 5mg — 0-0-1 (30 days) HS'],
      hi: {
        med1: 'मेटफॉर्मिन 500mg (शुगर): सुबह और शाम खाने से पहले 1 गोली लें।',
        med2: 'एम्लोडिपाइन 5mg (बीपी): रोज रात को सोते समय 1 गोली लें।'
      },
      kn: {
        med1: 'ಮೆಟ್‌ಫಾರ್ಮಿನ್ 500mg (ಸಕ್ಕರೆ): ಬೆಳಿಗ್ಗೆ ಮತ್ತು ಸಂಜೆ ಊಟಕ್ಕೆ ಮುಂಚೆ 1 ಮಾತ್ರೆ.',
        med2: 'ಆಮ್ಲೋಡಿಪೈನ್ 5mg (ರಕ್ತದೊತ್ತಡ): ರಾತ್ರಿ ಮಲಗುವ ಮುನ್ನ 1 ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ.'
      },
      ta: {
        med1: 'மெட்ஃபோர்மின் 500mg (சர்க்கரை): காலை மற்றும் மாலை உணவுக்கு முன் 1 மாத்திரை.',
        med2: 'ஆம்லோடிபைன் 5mg (ரத்த அழுத்தம்): இரவு தூங்கும் முன் 1 மாத்திரை.'
      },
      te: {
        med1: 'మెట్‌ఫಾರ್మిన్ 500mg (షుగర్): ఉదయం మరియు సాయంత్రం భోజనానికి ముందు 1 మాత్ర.',
        med2: 'ఆమ్లోడిపైన్ 5mg (బీపీ): రాత్రి పడుకునే ముందు 1 మాత్ర తీసుకోండి.'
      },
      mr: {
        med1: 'मेटफॉर्मिन ५००mg (शुगर): सकाळी व संध्याकाळी जेवणापूर्वी १ गोळी घ्या.',
        med2: 'अम्लोडिपाइन ५mg (बीपी): रोज रात्री झोपताना १ गोळी घ्या.'
      }
    },
    maternal: {
      id: 'maternal',
      title: '🤰 Maternal Pregnancy Care (ANC)',
      doctorNote: ['1. Tab IFA (Iron & Folic Acid) — 0-1-0 (90 days) PC', '2. Tab Calcium 500mg — 1-0-0 (90 days) PC'],
      hi: {
        med1: 'आयरन फोलिक एसिड (IFA): दोपहर के भोजन के बाद 1 लाल गोली पानी से लें।',
        med2: 'कैल्शियम 500mg: सुबह नाश्ते के बाद 1 गोली लें (दूध या पानी के साथ)।'
      },
      kn: {
        med1: 'ಕಬ್ಬಿಣದ ಮಾತ್ರೆ (IFA): ಮಧ್ಯಾಹ್ನ ಊಟದ ನಂತರ 1 ಕೆಂಪು ಮಾತ್ರೆ ನೀರಿನೊಂದಿಗೆ ಸೇವಿಸಿ.',
        med2: 'ಕ್ಯಾಲ್ಸಿಯಂ 500mg: ಬೆಳಿಗ್ಗೆ ಉಪಹಾರದ ನಂತರ 1 ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ.'
      },
      ta: {
        med1: 'இரும்புச்சத்து மாத்திரை (IFA): மதிய உணவுக்கு பின் 1 சிவப்பு மாத்திரை.',
        med2: 'கால்சியம் 500mg: காலை உணவுக்கு பின் 1 மாத்திரை எடுக்கவும்.'
      },
      te: {
        med1: 'ఐరన్ ఫోలిక్ యాసిడ్ (IFA): మధ్యాహ్నం భோజనం తర్వాత 1 ఎరుపు మాత్ర.',
        med2: 'కాల్షియం 500mg: ఉదయం అల్పాహారం తర్వాత 1 మాత్ర తీసుకోండి.'
      },
      mr: {
        med1: 'आयर्न फॉलिक ॲसिड (IFA): दुपारच्या जेवणानंतर १ लाल गोळी पाण्यासोबत घ्या.',
        med2: 'कॅल्शियम ५००mg: सकाळी नाश्त्यानंतर १ गोळी दुधासोबत/पाण्यासोबत घ्या.'
      }
    }
  };
  const currentDemoCase = demoCasesData[demoCase];
  const currentTranslation = currentDemoCase[demoLang] || currentDemoCase.hi;

  // 2G IVR Feature Phone Simulation State
  const [ivrCalling, setIvrCalling] = useState(false);
  const [ivrMessage, setIvrMessage] = useState('Dial 1800-RURAL-CARE to test');

  // Interactive Generic Medicine Savings Calculator State
  const [savingsCategory, setSavingsCategory] = useState('antibiotic');
  const medicineSavingsData = {
    antibiotic: {
      category: 'Bacterial Infections & Fever',
      branded: 'Augmentin 625 Duo (Branded)',
      brandedPrice: 224,
      generic: 'Amoxyclav 625 Generic (Jan Aushadhi)',
      genericPrice: 62,
      saving: 162,
      pct: '72%',
      note: 'Exact same chemical bio-equivalent strength.'
    },
    diabetes: {
      category: 'Type 2 Diabetes (Monthly Dose)',
      branded: 'Glucophage 500mg (Branded)',
      brandedPrice: 185,
      generic: 'Metformin Hydrochloride 500mg',
      genericPrice: 34,
      saving: 151,
      pct: '81%',
      note: 'Certified by Bureau of Pharma PSUs of India (BPPI).'
    },
    bp: {
      category: 'Hypertension / High BP (Monthly)',
      branded: 'Norvasc 5mg (Branded)',
      brandedPrice: 145,
      generic: 'Amlodipine Besylate 5mg',
      genericPrice: 22,
      saving: 123,
      pct: '85%',
      note: 'Saves ₹1,476 per year for rural senior citizens.'
    },
    pain: {
      category: 'Fever & Joint Pain',
      branded: 'Dolo 650 Tablet (Branded)',
      brandedPrice: 38,
      generic: 'Paracetamol 650mg Generic',
      genericPrice: 12,
      saving: 26,
      pct: '68%',
      note: 'Same fast relief at 1/3rd the cost.'
    }
  };
  const activeSavings = medicineSavingsData[savingsCategory];

  // 3D Gyan Kendra Organ Teaser State
  const [activeTeaserOrgan, setActiveTeaserOrgan] = useState('heart');
  const [isPlayingOrganAudio, setIsPlayingOrganAudio] = useState(false);
  const teaserOrgans = {
    heart: {
      name: 'Heart & Blood Pressure',
      icon: '🫀',
      native: 'हृदय और रक्त परिसंचरण',
      benchmark: '120/80 mmHg',
      tip: 'Cut down daily salt (namak) and take brisk morning walks.',
      voiceText: 'हृदय शरीर के सभी अंगों को रक्त पहुंचाता है। रोज 30 मिनट टहलें और कम नमक खाएं।'
    },
    lungs: {
      name: 'Lungs & Respiration',
      icon: '🫁',
      native: 'फेफड़े और श्वसन तंत्र',
      benchmark: '98% SpO2 (Normal)',
      tip: 'Avoid chulha smoke & dust. Practice deep breathing.',
      voiceText: 'फेफड़े हमें ताजी हवा देते हैं। धूल-धुएं और चूल्हे के धुएं से बचें।'
    },
    sugar: {
      name: 'Pancreas & Diabetes',
      icon: '🩺',
      native: 'अग्न्याशय और शुगर नियंत्रण',
      benchmark: '70-110 mg/dL',
      tip: 'Replace white sugar with pure jaggery and millets.',
      voiceText: 'मीठा और तला भोजन कम करें, जवार और बाजरा खाएं।'
    },
    mother: {
      name: 'Maternal & Child Care',
      icon: '🤰',
      native: 'मातृ एवं शिशु स्वास्थ्य',
      benchmark: '4 Mandatory ANC Visits',
      tip: 'Regular Iron-Folic Acid tablets & institutional hospital delivery.',
      voiceText: 'गर्भावस्था में पोषण, आयरन और फोलिक एसिड की गोली जरूर लें।'
    }
  };
  const currentTeaserOrgan = teaserOrgans[activeTeaserOrgan];

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
      const textToSpeak = `${currentTranslation.med1} ${currentTranslation.med2}`;
      await speakNativeAudio(textToSpeak, demoLang);
      setIsPlayingDemoVoice(false);
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingDemoVoice(false);
    }
  };

  const simulateIvrCall = async () => {
    if (ivrCalling) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIvrCalling(false);
      setIvrMessage('Call Disconnected');
      return;
    }
    setIvrCalling(true);
    setIvrMessage('📞 Calling Toll-Free 1800-RURAL-CARE...');
    setTimeout(async () => {
      setIvrMessage('🟢 Connected: Playing IVR Prescription Audio in Hindi...');
      const msg = "नमस्ते। स्वास्थ्य संचार में आपका स्वागत है। आपकी दवा की खुराक: सुबह 1 गोली और रात को 1 गोली खाने के बाद लें।";
      await speakNativeAudio(msg, 'hi');
      setIvrCalling(false);
      setIvrMessage('✅ IVR Call Completed (Zero Internet Needed)');
    }, 1200);
  };

  const playOrganTeaserAudio = async (text) => {
    if (isPlayingOrganAudio) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingOrganAudio(false);
      return;
    }
    setIsPlayingOrganAudio(true);
    try {
      await speakNativeAudio(text || currentTeaserOrgan.voiceText, 'hi');
    } catch {}
    setIsPlayingOrganAudio(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/8 via-[#F8FAFC] to-[#F8FAFC] dark:from-teal-950/30 dark:via-[#0B0F17] dark:to-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      
      {/* 1. FIXED TOP PUBLIC NAVBAR (Always visible across all scrolls) */}
      <PublicNavbar onNavigate={onNavigate} />

      {/* MAIN LANDING CONTENT (With top padding to clear fixed navbar) */}
      <main className="flex-1 space-y-12 sm:space-y-16 pt-16 sm:pt-20 pb-8">
        
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
                    <span>22+ Languages</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-3 left-2 sm:-left-2 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/80 p-2.5 sm:p-3 rounded-xl shadow-xl flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shrink-0">
                  <HeartIcon size={16} color="#d97706" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white font-display leading-tight">💊 Smart Visual Pillbox</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">Morning ☀️ &amp; Night 🌙 Dose Alert</div>
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

        {/* NEW DYNAMIC STATS BAND WITH LIVE METRICS & ECG PULSE */}
        <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors relative overflow-hidden">
          
          {/* Subtle ECG Heartbeat Pulse Line Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
            <svg className="w-full h-24 stroke-teal-400 fill-none" viewBox="0 0 1200 100" preserveAspectRatio="none">
              <path d="M0,50 L300,50 L320,20 L340,80 L360,35 L380,65 L400,50 L700,50 L720,10 L740,90 L760,30 L780,70 L800,50 L1200,50" strokeWidth="2" strokeDasharray="6 6" className="animate-pulse" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
              <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live PHC Network • 42 Districts Connected</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                Transforming Rural Healthcare Across India
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              {[
                { label: 'Primary Health Centres Piloting', val: 42, suffix: '+', decimals: 0, sub: 'Across 6 States' },
                { label: 'Regional Languages & Dialects', val: 22, suffix: '+', decimals: 0, sub: 'Native Voice Synthesized' },
                { label: 'Prescriptions Translated', val: 9840, suffix: '+', decimals: 0, sub: '100% Doctor Verified' },
                { label: 'Clinical OCR Accuracy', val: 99.4, suffix: '%', decimals: 1, sub: 'Accelerated Vision OCR' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-slate-800/85 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 p-5 sm:p-6 rounded-2xl transition-all duration-300 shadow-md group">
                  <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-400 group-hover:scale-105 transition-transform mb-1">
                    <AnimatedStat endValue={stat.val} suffix={stat.suffix} decimals={stat.decimals} duration={1800} />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-200">{stat.label}</div>
                  <div className="text-[10px] text-teal-300/80 font-medium mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (Connected Step Path Visual with Glowing Step Line) */}
        <section id="how-it-works" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans relative">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest">
              CONNECTED PRODUCT WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              From Doctor's Slip to Everyday Understanding
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              A seamless 6-step communication journey designed for rural patients and elderly citizens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
            {[
              { step: '01', title: 'Upload Slip', desc: 'Capture doctor slip via smartphone or ASHA tablet.', icon: DocumentIcon },
              { step: '02', title: 'Vision OCR', desc: 'AI extracts medicines, dosage frequency & days.', icon: BrainIcon },
              { step: '03', title: 'Translate', desc: 'Translates to mother tongue with simple vernacular terms.', icon: TranslateIcon },
              { step: '04', title: 'Native Audio', desc: 'Clear spoken voice instructions for non-readers.', icon: SpeakerIcon },
              { step: '05', title: 'Smart Pillbox', desc: 'Auto-schedules morning, lunch & night dosage slots.', icon: ClockIcon },
              { step: '06', title: '2G Voice / SOS', desc: 'Offline IVR calls & 108 emergency ambulance dispatch.', icon: BellIcon },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="bg-white dark:bg-[#161F30] border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 p-4 rounded-2xl space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0F766E] dark:text-teal-300 bg-teal-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-teal-200/60 dark:border-slate-700">
                      Step {s.step}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={16} className="text-[#0B4F42] dark:text-teal-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* INTERACTIVE JAN AUSHADHI GENERIC MEDICINE SAVINGS CALCULATOR */}
        <section className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white border border-teal-700/50 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-teal-800/80 pb-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="bg-[#E2A233] text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                    💰 COST SAVINGS ENGINE
                  </span>
                  <span className="text-teal-200 text-xs font-bold">PM Jan Aushadhi Integration</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Calculate Medicine Savings for Rural Families
                </h2>
                <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed font-medium">
                  Swasthya Sanchar AI automatically matches expensive doctor-branded prescriptions with 100% bio-equivalent Jan Aushadhi generic medicines.
                </p>
              </div>

              {/* Category Selector Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'antibiotic', label: '💊 Antibiotics' },
                  { id: 'diabetes', label: '🩺 Diabetes' },
                  { id: 'bp', label: '🩸 High BP' },
                  { id: 'pain', label: '🩹 Fever & Pain' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSavingsCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      savingsCategory === tab.id
                        ? 'bg-[#E2A233] text-slate-950 shadow-md scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Comparison Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
              
              {/* Branded Medicine */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl space-y-2">
                <div className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Expensive Market Price</div>
                <div className="text-base font-black text-white">{activeSavings.branded}</div>
                <div className="text-2xl font-black text-rose-300">₹{activeSavings.brandedPrice}</div>
                <div className="text-[10px] text-slate-300">Commercial Brand MRP</div>
              </div>

              {/* Jan Aushadhi Generic Match */}
              <div className="bg-teal-900/60 backdrop-blur-md border-2 border-teal-400/60 p-5 rounded-2xl space-y-2">
                <div className="text-[10px] font-bold text-teal-300 uppercase tracking-widest flex items-center gap-1">
                  <span>✓ Jan Aushadhi Match</span>
                </div>
                <div className="text-base font-black text-white">{activeSavings.generic}</div>
                <div className="text-2xl font-black text-emerald-400">₹{activeSavings.genericPrice}</div>
                <div className="text-[10px] text-teal-200/90">{activeSavings.note}</div>
              </div>

              {/* Instant Savings Badge */}
              <div className="bg-emerald-500 text-slate-950 p-5 rounded-2xl space-y-1.5 text-center shadow-lg">
                <div className="text-xs font-black uppercase tracking-wider">Direct Family Savings</div>
                <div className="text-4xl font-black tracking-tight">₹{activeSavings.saving}</div>
                <div className="text-xs font-extrabold bg-slate-950 text-white py-1 px-3 rounded-full inline-block">
                  Save {activeSavings.pct} of Costs!
                </div>
                <div className="text-[10px] font-bold pt-1">
                  100% Chemically Equal • Govt Certified
                </div>
              </div>

            </div>

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
              { icon: SpeakerIcon, title: '22+ Voice Audio Engines', desc: 'Spoken voice playback in Hindi, Tamil, Telugu, Bengali, Kannada & Marathi.' },
              { icon: PillIcon, title: 'Visual Treatment Schedule', desc: 'Organizes morning, lunch, and bedtime dosage slots with 1-tap tracking.' },
            ].map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-3 hover:border-teal-500 transition-colors">
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

        {/* PRESCRIPTION DEMO WITH 3 CLINICAL CASES & AUDIO EQUALIZER */}
        <section id="prescription-demo" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-[#0F766E] dark:text-teal-300 uppercase tracking-widest">
                LIVE INTERACTIVE PLAYGROUND
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Try Doctor Handwriting Translation
              </h2>
            </div>

            {/* 3 Clinical Case Switcher Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'fever', label: '🧒 Child Fever' },
                { id: 'diabetes', label: '👴 Elderly Diabetes & BP' },
                { id: 'maternal', label: '🤰 Maternal Care' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setDemoCase(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    demoCase === c.id
                      ? 'bg-[#0B4F42] text-white shadow-md scale-105'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Original Doctor Note */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  ORIGINAL DOCTOR PRESCRIPTION SLIP
                </span>
                <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                  {currentDemoCase.title}
                </span>
              </div>
              <div className="font-mono text-xs text-slate-800 dark:text-slate-200 space-y-2 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white">Rx Doctor Notes:</div>
                {currentDemoCase.doctorNote.map((line, idx) => (
                  <div key={idx} className="text-teal-900 dark:text-teal-200 font-semibold">{line}</div>
                ))}
              </div>
              <div className="text-[10px] text-slate-500 italic">
                Simulating actual handwriting extracted with Groq Accelerated Vision OCR.
              </div>
            </div>

            {/* Right: AI Translated Spoken Output */}
            <div className="bg-[#F0FDF4] dark:bg-teal-950/40 border border-[#bbf7d0] dark:border-teal-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#bbf7d0] dark:border-teal-800/80 pb-2">
                <span className="text-xs font-bold text-[#0F766E] dark:text-teal-300 uppercase tracking-wider">
                  VERNACULAR PATIENT GUIDANCE
                </span>
                <select
                  value={demoLang}
                  onChange={(e) => setDemoLang(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-[#bbf7d0] dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold px-3 py-1 rounded-xl cursor-pointer shadow-2xs"
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
                  <div className="font-bold text-xs text-slate-900 dark:text-white">💊 Medicine 1:</div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold">{currentTranslation.med1}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-[#bbf7d0] dark:border-slate-800 space-y-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">💊 Medicine 2:</div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold">{currentTranslation.med2}</p>
                </div>
              </div>

              {/* Audio Playback with Dancing Equalizer Bars */}
              <button
                type="button"
                onClick={playDemoAudio}
                className="bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer w-full"
              >
                {isPlayingDemoVoice ? (
                  <div className="flex items-end gap-1 h-4">
                    <span className="w-1 bg-emerald-300 rounded-full animate-pulse h-3" />
                    <span className="w-1 bg-teal-200 rounded-full animate-bounce h-4" />
                    <span className="w-1 bg-emerald-300 rounded-full animate-pulse h-2" />
                    <span className="w-1 bg-teal-200 rounded-full animate-bounce h-4" />
                  </div>
                ) : (
                  <SpeakerIcon size={14} color="#fff" />
                )}
                <span>{isPlayingDemoVoice ? '🔊 Playing Native Vernacular Audio...' : '🔊 Listen Native Audio'}</span>
              </button>
            </div>

          </div>

          {/* 🌟 2-COLUMN BOTTOM EXTENSION: 2G FEATURE PHONE IVR + PRINTABLE WALL CHART */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* 1. 2G Feature Phone Offline IVR Voice Call Simulator */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    📞 2G FEATURE PHONE IVR
                  </span>
                  <span className="text-[11px] text-slate-400">Zero Internet / Offline</span>
                </div>
                <h3 className="text-lg font-black text-white">
                  No Smartphone? Dial 1800-RURAL-CARE
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Villagers with basic ₹1,000 keypad phones receive automated voice calls in their dialect reading medicine timings.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-[11px] font-mono text-teal-400 flex items-center justify-between">
                  <span>STATUS:</span>
                  <span>{ivrMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={simulateIvrCall}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📞 {ivrCalling ? 'Disconnect Mock Call' : 'Test 2G Voice Call Simulation'}</span>
                </button>
              </div>
            </div>

            {/* 2. 1-Page Printable Sun ☀️ & Moon 🌙 Wall Chart */}
            <div className="bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    🖨️ PRINTABLE WALL CHART
                  </span>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">1-Click PDF Generation</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Visual Wall Poster for Grandparents
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  ASHA workers print a simple chart with Sun ☀️ and Moon 🌙 icons to stick on the village wall.
                </p>
              </div>

              <div className="bg-amber-50/70 dark:bg-slate-900 p-3.5 rounded-2xl border border-amber-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">☀️ 🌙</div>
                  <div className="text-xs">
                    <div className="font-extrabold text-slate-900 dark:text-white">Visual 5-Day Dose Grid</div>
                    <div className="text-[10px] text-slate-500">Includes medicine color, photo &amp; meals</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavClick('prescription-demo')}
                  className="bg-slate-900 dark:bg-teal-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer shrink-0 hover:bg-slate-800"
                >
                  Preview PDF ↗
                </button>
              </div>
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

        {/* 🌟 INTERACTIVE 3D SWASTHYA GYAN KENDRA ORGAN SHOWCASE */}
        <section className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="bg-white dark:bg-[#161F30] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="bg-[#0B4F42] text-teal-200 border border-teal-500/30 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                    📚 SWASTHYA GYAN KENDRA
                  </span>
                  <span className="text-teal-700 dark:text-teal-300 text-xs font-bold">14 Organs • Multi-Dialect Audio</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Visual 3D Human Anatomy for Non-Literate Citizens
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Helping rural patients understand how their organs work, recognize dangerous red-flag warning symptoms, and follow healthy Indian nutrition.
                </p>
              </div>

              {/* 4 Organ Selectors */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'heart', label: '🫀 Heart & BP' },
                  { id: 'lungs', label: '🫁 Lungs & Asthma' },
                  { id: 'sugar', label: '🩺 Pancreas & Sugar' },
                  { id: 'mother', label: '🤰 Maternal Care' },
                ].map((org) => (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => setActiveTeaserOrgan(org.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      activeTeaserOrgan === org.id
                        ? 'bg-[#0B4F42] text-white shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {org.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Organ Interactive Showcase Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 dark:bg-slate-900/60 p-5 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl text-center space-y-3 shadow-inner">
                <div className="text-6xl animate-bounce duration-1000">{currentTeaserOrgan.icon}</div>
                <div className="text-lg font-black text-white">{currentTeaserOrgan.name}</div>
                <div className="text-xs font-bold text-teal-400 bg-teal-950/80 border border-teal-500/40 px-3 py-1 rounded-full">
                  {currentTeaserOrgan.native}
                </div>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 dark:border-slate-800 pb-3">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Normal Benchmark</div>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {currentTeaserOrgan.benchmark}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => playOrganTeaserAudio(currentTeaserOrgan.voiceText)}
                    className="bg-[#0B4F42] hover:bg-teal-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <SpeakerIcon size={14} color="#fff" />
                    <span>{isPlayingOrganAudio ? 'Speaking Audio...' : '🔊 Listen Spoken Guidance'}</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                    <span>🥗</span>
                    <span>Desi Rural Health &amp; Prevention Advice:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    {currentTeaserOrgan.tip}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Available in 11 Indian Languages</span>
                  <button
                    type="button"
                    onClick={() => handleNavClick('care-chain')}
                    className="text-[#0F766E] dark:text-teal-400 font-black hover:underline cursor-pointer"
                  >
                    Open Full 14-Organ Knowledge Hub →
                  </button>
                </div>
              </div>

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

      {/* FOOTER (Compact, Sleek & Modern) */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 font-sans text-xs transition-colors">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* 1. COMPACT 4-COLUMN FOOTER NAVIGATION */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <SwasthyaLogo variant="dark" height={38} />
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Empowering rural citizens to understand prescriptions with AI vision &amp; spoken vernacular audio.
              </p>
              <div className="flex items-center gap-1.5 text-[9px] text-teal-400 font-bold">
                <span>✓ ABDM Compliant</span>
                <span>•</span>
                <span>✓ PM-JAY Integrated</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-extrabold text-white uppercase text-[10px] tracking-wider">Solutions</h4>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li><button onClick={() => handleNavClick('prescription-demo')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">Prescription AI</button></li>
                <li><button onClick={() => handleNavClick('home')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">Smart Pillbox</button></li>
                <li><button onClick={() => handleNavClick('care-chain')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">Health Vault</button></li>
                <li><button onClick={() => handleNavClick('care-chain')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">3D Gyan Kendra</button></li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-extrabold text-white uppercase text-[10px] tracking-wider">Stakeholders</h4>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li><button onClick={() => handleNavClick('care-chain')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">Rural Patients</button></li>
                <li><button onClick={() => handleNavClick('care-chain')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">ASHA Workers</button></li>
                <li><button onClick={() => handleNavClick('care-chain')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">PHC Doctors</button></li>
                <li><button onClick={() => handleNavClick('care-chain')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">Gram Panchayats</button></li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-extrabold text-white uppercase text-[10px] tracking-wider">24x7 Emergency</h4>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <a href="tel:112" className="bg-rose-600/90 hover:bg-rose-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">📞 112</a>
                <a href="tel:108" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded text-[10px]">🚑 108</a>
                <a href="tel:104" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded text-[10px]">🩺 104</a>
              </div>
              <div className="text-[10px] text-slate-500 pt-1">
                Toll-free rural emergency ambulance &amp; triage.
              </div>
            </div>
          </div>

          {/* 2. SINGLE-LINE MULTILINGUAL & COPYRIGHT STRIP */}
          <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[10px]">
            <div>© 2026 Swasthya Sanchar AI • Built for Indian Rural Healthcare</div>
            <div className="flex items-center gap-1 text-slate-400">
              <span>हिन्दी</span> • <span>ಕನ್ನಡ</span> • <span>తెలుగు</span> • <span>தமிழ்</span> • <span>मराठी</span> • <span>বাংলা</span> • <span>English</span>
            </div>
            <div className="flex items-center gap-3">
              <span onClick={() => handleNavClick('safety')} className="hover:text-slate-300 cursor-pointer">Privacy</span>
              <span>•</span>
              <span onClick={() => handleNavClick('safety')} className="hover:text-slate-300 cursor-pointer">Terms</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
