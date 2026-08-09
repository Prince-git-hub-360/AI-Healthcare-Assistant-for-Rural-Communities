import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Register } from '../components/auth/Register';
import { Login } from '../components/auth/Login';
import { MedicalDocuments } from '../components/medical/MedicalDocuments';
import {
  DocumentIcon, BrainIcon, TranslateIcon, SpeakerIcon, ShieldIcon, CheckIcon,
  LockIcon, ChevronDownIcon, PlayIcon, PauseIcon, PhoneIcon, PillIcon,
  ClockIcon, ArrowRightIcon, PlusIcon, HospitalIcon, AlertIcon, RefreshIcon
} from '../components/ui/Icons';
import { speakNativeAudio } from '../utils/speech';

export const HomePage = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('landing');
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });

  // Interactive Demo States
  const [demoTab, setDemoTab] = useState('simplified'); // 'original' | 'simplified' | 'error'
  const [demoLang, setDemoLang] = useState('hi'); // 'hi' | 'kn' | 'ta' | 'te' | 'mr'
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [emailWaitlist, setEmailWaitlist] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  // Interactive Medication Schedule State
  const [meds, setMeds] = useState([
    { id: 1, name: 'Paracetamol 500mg (1 tablet after breakfast)', time: '08:00 AM', taken: true },
    { id: 2, name: 'Amoxicillin 250mg (1 capsule after lunch)', time: '01:00 PM', taken: false },
    { id: 3, name: 'Vitamin D3 (1 tablet at bedtime)', time: '08:00 PM', taken: false },
  ]);

  // Interactive FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleMed = (id) => {
    setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const handleVoiceToggle = () => {
    if (!isPlayingVoice) {
      setIsPlayingVoice(true);
      const textToSpeak = `${sampleTranslations[demoLang].med1}. ${sampleTranslations[demoLang].med2}`;
      speakNativeAudio(textToSpeak, demoLang).then(() => {
        setIsPlayingVoice(false);
      });
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
    }
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModal({ open: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ open: false, mode: 'login' });
  };

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (emailWaitlist.trim()) {
      setWaitlistSubmitted(true);
      setTimeout(() => setWaitlistSubmitted(false), 4000);
      setEmailWaitlist('');
    }
  };

  // Sample Translations for 22+ Languages Interactive Demo Switcher
  const sampleTranslations = {
    hi: {
      med1: 'पैरासिटामोल 500mg: सुबह 1 गोली और रात को 1 गोली खाने के बाद 5 दिनों के लिए लें।',
      med2: 'कफ सिरप: दिन में 3 बार 2 चम्मच लें।',
      voiceText: 'सुबह के नाश्ते के बाद एक गोली और रात के खाने के बाद एक गोली लें।'
    },
    kn: {
      med1: 'ಪ್ಯಾರಸಿಟಮಾಲ್ 500mg: ಬೆಳಿಗ್ಗೆ 1 ಮಾತ್ರೆ ಮತ್ತು ರಾತ್ರಿ 1 ಮಾತ್ರೆ ಊಟದ ನಂತರ 5 ದಿನಗಳ ಕಾಲ ತೆಗೆದುಕೊಳ್ಳಿ.',
      med2: 'ಕೆಮ್ಮಿನ ಸಿಲಪ್: ದಿನಕ್ಕೆ 3 ಬಾರಿ 2 ಚಮಚ ತೆಗೆದುಕೊಳ್ಳಿ.',
      voiceText: 'ಬೆಳಗಿನ ಉಪಾಹಾರದ ನಂತರ ಒಂದು ಮಾತ್ರೆ ಮತ್ತು ರಾತ್ರಿಯ ಊಟದ ನಂತರ ಒಂದು ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ.'
    },
    ta: {
      med1: 'பாரசிட்டமால் 500mg: காலை 1 மாத்திரை மற்றும் இரவு 1 மாத்திரை உணவுக்கு பின் 5 நாட்களுக்கு சாப்பிடவும்.',
      med2: 'இருமல் மருந்து: ஒரு நாளைக்கு 3 முறை 2 தேக்கரண்டி எடுக்கவும்.',
      voiceText: 'காலை உணவுக்குப் பிறகு ஒரு மாத்திரையும் இரவு உணவுக்குப் பிறகு ஒரு மாத்திரையும் சாப்பிடுங்கள்.'
    },
    te: {
      med1: 'పారాసిటమాల్ 500mg: ఉదయం 1 మాత్ర మరియు రాత్రి 1 మాత్ర భోజనం తర్వాత 5 రోజులు తీసుకోండి.',
      med2: 'దగ్గు సిరప్: రోజుకు 3 సార్లు 2 చెంచాలు తీసుకోండి.',
      voiceText: 'ఉదయం అల్పాహారం తర్వాత ఒక మాత్ర మరియు రాత్రి భోజనం తర్వాత ఒక మాత్ర తీసుకోండి.'
    },
    mr: {
      med1: 'पॅरासिटामॉल 500mg: सकाळी १ गोळी आणि रात्री १ गोळी जेवणानंतर ५ दिवस घ्या.',
      med2: 'खोकल्याचे औषध: दिवसातून ३ वेळा २ चमचे घ्या.',
      voiceText: 'सकाळच्या नाश्त्यानंतर एक गोळी आणि रात्रीच्या जेवणानंतर एक गोळी घ्या.'
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-900 antialiased">
      {/* 🌐 Sticky Public Navigation */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} openAuthModal={openAuthModal} />

      <main className="flex-1">
        {/* Render Authenticated App Views if Triggered */}
        {currentView === 'medical_documents' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <button 
              onClick={() => setCurrentView('landing')} 
              className="mb-6 border border-teal-700 text-teal-700 hover:bg-teal-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer"
            >
              ← Return to Product Homepage
            </button>
            <MedicalDocuments />
          </div>
        )}

        {currentView === 'landing' && (
          <>
            {/* 🌟 HERO SECTION MATCHING EMERGENT.SH SCREENSHOT EXACTLY */}
            <section id="hero" className="max-w-6xl mx-auto px-4 pt-12 pb-20 text-center">
              {/* Eyebrow Pill Badge */}
              <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full text-xs font-bold text-teal-800 tracking-wide mb-8 shadow-xs">
                <span>✨</span>
                <span>AI HEALTHCARE COMMUNICATION FOR RURAL COMMUNITIES</span>
              </div>

              {/* Display Headline with Accent Serif 'prescription.' */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
                Every patient deserves to understand their own{' '}
                <span className="font-accent-serif text-teal-700 text-5xl sm:text-6xl md:text-7xl font-normal italic tracking-normal">
                  prescription.
                </span>
              </h1>

              {/* Hero Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed mb-10">
                Bridging the gap between rural patients and medical care. We instantly convert complex prescriptions and doctor notes into simple explanations in <strong className="text-stone-900 font-bold">22+ Indian regional languages</strong> and voice.
              </p>

              {/* Hero CTAs matching screenshot */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <button
                  onClick={() => openAuthModal('register')}
                  className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Get Started Free <ArrowRightIcon size={18} />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('prescription-intelligence');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold text-base px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlayIcon size={16} color="var(--color-primary)" /> See Live Demo
                </button>
              </div>

              {/* Security Guardrail Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-stone-500">
                <span className="flex items-center gap-1.5 text-stone-600">
                  <CheckIcon size={16} color="#15803d" /> HIPAA-Aligned Security
                </span>
                <span className="flex items-center gap-1.5 text-stone-600">
                  <CheckIcon size={16} color="#15803d" /> Zero Hallucination Safety Guardrails
                </span>
              </div>
            </section>

            {/* 🏢 HEALTHCARE STANDARDS & ECOSYSTEM PARTNERS */}
            <div className="bg-white border-y border-stone-200 py-10 px-4 text-center shadow-xs">
              <div className="text-xs font-extrabold text-teal-800 uppercase tracking-widest mb-6">
                HEALTHCARE ECOSYSTEM & NATIONAL DIGITAL STANDARDS
              </div>
              <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-8">
                <div className="bg-[#fdfbf7] border border-stone-200 px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-xs hover:border-teal-700 transition-colors">
                  <ShieldIcon size={20} color="#0f766e" />
                  <span className="font-extrabold text-xs text-stone-900">National Health Authority (NHA)</span>
                </div>

                <div className="bg-[#fdfbf7] border border-stone-200 px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-xs hover:border-teal-700 transition-colors">
                  <HospitalIcon size={20} color="#0f766e" />
                  <span className="font-extrabold text-xs text-stone-900">Ayushman Bharat Digital Mission (ABDM)</span>
                </div>

                <div className="bg-[#fdfbf7] border border-stone-200 px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-xs hover:border-teal-700 transition-colors">
                  <PillIcon size={20} color="#0f766e" />
                  <span className="font-extrabold text-xs text-stone-900">Rural Primary Health Centres (PHC)</span>
                </div>

                <div className="bg-[#fdfbf7] border border-stone-200 px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-xs hover:border-teal-700 transition-colors">
                  <LockIcon size={20} color="#0f766e" />
                  <span className="font-extrabold text-xs text-stone-900">DPDP Act 2023 Encrypted Vault</span>
                </div>
              </div>
            </div>

            {/* 📄 INTERACTIVE PRESCRIPTION DEMO (LIVE DEMO) */}
            <section id="prescription-intelligence" className="max-w-6xl mx-auto px-4 py-20">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-extrabold text-teal-700 uppercase tracking-wider block mb-2">
                  INTERACTIVE DEMO
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
                  From prescription to understanding in seconds.
                </h2>
                <p className="text-stone-600 text-base md:text-lg">
                  Test how Swasthya Sanchar AI converts doctor notes into simplified regional audio explanations in 22+ languages.
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  {/* Tabs */}
                  <div className="flex border-b border-stone-200 mb-6 gap-2">
                    <button
                      className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 cursor-pointer ${
                        demoTab === 'original' ? 'border-teal-700 text-teal-700' : 'border-transparent text-stone-500 hover:text-stone-800'
                      }`}
                      onClick={() => setDemoTab('original')}
                    >
                      Original Doctor Note
                    </button>
                    <button
                      className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 cursor-pointer ${
                        demoTab === 'simplified' ? 'border-teal-700 text-teal-700' : 'border-transparent text-stone-500 hover:text-stone-800'
                      }`}
                      onClick={() => setDemoTab('simplified')}
                    >
                      ✨ Simplified Patient View
                    </button>
                    <button
                      className={`pb-3 px-4 font-bold text-xs transition-all border-b-2 cursor-pointer ${
                        demoTab === 'error' ? 'border-amber-600 text-amber-700' : 'border-transparent text-stone-400 hover:text-amber-700'
                      }`}
                      onClick={() => setDemoTab('error')}
                    >
                      ⚠️ Test Fallback Error
                    </button>
                  </div>

                  {demoTab === 'original' && (
                    <div className="bg-stone-100 border-l-4 border-teal-700 p-6 rounded-xl font-mono text-sm text-stone-900 leading-relaxed shadow-inner">
                      <p className="font-bold text-stone-900 mb-2">Doctor Rx Note:</p>
                      <p>Tab. Paracetamol 500mg — 1-0-1 (PC) x 5 days</p>
                      <p>Syr. Cough Care 10ml — TDS x 3 days</p>
                      <p className="italic mt-2 text-stone-600">Note: Drink warm water & rest.</p>
                    </div>
                  )}

                  {demoTab === 'simplified' && (
                    <div className="bg-teal-50/70 border border-teal-200 p-6 rounded-2xl">
                      {/* Language Switcher Pills */}
                      <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-teal-100">
                        <span className="text-xs font-bold text-stone-600">Select Language:</span>
                        <button
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            demoLang === 'hi' ? 'bg-teal-700 text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                          }`}
                          onClick={() => setDemoLang('hi')}
                        >
                          हिंदी (Hindi)
                        </button>
                        <button
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            demoLang === 'kn' ? 'bg-teal-700 text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                          }`}
                          onClick={() => setDemoLang('kn')}
                        >
                          ಕನ್ನಡ (Kannada)
                        </button>
                        <button
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            demoLang === 'ta' ? 'bg-teal-700 text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                          }`}
                          onClick={() => setDemoLang('ta')}
                        >
                          தமிழ் (Tamil)
                        </button>
                        <button
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            demoLang === 'te' ? 'bg-teal-700 text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                          }`}
                          onClick={() => setDemoLang('te')}
                        >
                          తెలుగు (Telugu)
                        </button>
                        <button
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            demoLang === 'mr' ? 'bg-teal-700 text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                          }`}
                          onClick={() => setDemoLang('mr')}
                        >
                          मराठी (Marathi)
                        </button>
                      </div>

                      <p className="font-bold text-stone-900 text-base mb-3 leading-relaxed">
                        💊 {sampleTranslations[demoLang].med1}
                      </p>
                      <p className="font-bold text-stone-900 text-base mb-6 leading-relaxed">
                        🥄 {sampleTranslations[demoLang].med2}
                      </p>

                      <button
                        onClick={handleVoiceToggle}
                        className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <SpeakerIcon size={20} color="#ffffff" />
                        {isPlayingVoice ? 'Pause Audio ⏸' : '🔊 Listen to Audio Guidance'}
                      </button>
                    </div>
                  )}

                  {demoTab === 'error' && (
                    <div className="bg-stone-100 border border-stone-300 p-6 rounded-2xl text-stone-900">
                      <div className="flex items-center gap-2 font-bold text-base mb-2 text-teal-800">
                        <AlertIcon size={20} color="#0f766e" /> OCR Ambiguity Flagged
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed mb-4">
                        Prescription handwriting in line 2 could not be verified with 99%+ confidence. Swasthya Sanchar AI retains the original doctor document and routes it to your assigned local ASHA worker for human review before issuing audio guidance.
                      </p>
                      <button 
                        onClick={() => setDemoTab('simplified')}
                        className="border border-teal-700 text-teal-800 font-bold px-4 py-2 rounded-lg text-xs hover:bg-teal-50 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <RefreshIcon size={14} /> Re-try Scan Verification
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl">
                    <div className="flex gap-3 items-start">
                      <ShieldIcon size={28} color="var(--color-primary)" />
                      <div>
                        <h4 className="font-bold text-stone-900 text-base mb-2">
                          Medical Safety & Zero Hallucination Guardrails
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          Swasthya Sanchar AI uses specialized Medical NLP trained specifically on prescription terminology. It preserves original dosage schedules and does not generate unverified medical diagnoses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 🔄 HOW IT WORKS SECTION */}
            <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-16">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-extrabold text-teal-700 uppercase tracking-wider block mb-2">
                  HOW IT WORKS
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
                  Four simple steps to healthcare clarity
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-teal-100 text-teal-800 font-extrabold rounded-xl flex items-center justify-center mb-4">1</div>
                  <h3 className="font-bold text-stone-900 text-lg mb-2">Upload Prescription</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">Snap a photo of any doctor note, discharge report, or health document.</p>
                </div>

                <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-teal-100 text-teal-800 font-extrabold rounded-xl flex items-center justify-center mb-4">2</div>
                  <h3 className="font-bold text-stone-900 text-lg mb-2">AI Medical Extraction</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">OCR and Specialized NLP parse active medicines, dosages, and timing rules.</p>
                </div>

                <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-teal-100 text-teal-800 font-extrabold rounded-xl flex items-center justify-center mb-4">3</div>
                  <h3 className="font-bold text-stone-900 text-lg mb-2">Regional Simplification</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">Gemini LLM translates medical jargon into plain words in 22+ languages.</p>
                </div>

                <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-teal-100 text-teal-800 font-extrabold rounded-xl flex items-center justify-center mb-4">4</div>
                  <h3 className="font-bold text-stone-900 text-lg mb-2">Spoken Audio Guidance</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">Patients listen to clear voice audio instructions and receive dosage alerts.</p>
                </div>
              </div>
            </section>

            {/* 👥 SOLUTIONS / BUILT FOR RURAL INDIA */}
            <section id="ecosystem" className="max-w-6xl mx-auto px-4 py-16">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-extrabold text-teal-700 uppercase tracking-wider block mb-2">
                  BUILT FOR RURAL INDIA
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
                  Empowering every stakeholder in the care loop
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
                  <div className="text-3xl mb-3">👵</div>
                  <h3 className="font-bold text-stone-900 text-lg mb-2">For Patients</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    "You shouldn't need a medical degree to know when to take your medicine." Listen to clear spoken instructions in your dialect.
                  </p>
                </div>

                <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
                  <div className="text-3xl mb-3">👩‍⚕️</div>
                  <h3 className="font-bold text-stone-900 text-lg mb-2">For ASHA Workers</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    "Manage more community patients without more paperwork." Digitally track patient adherence during home visits.
                  </p>
                </div>

                <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
                  <div className="text-3xl mb-3">👨‍⚕️</div>
                  <h3 className="font-bold text-stone-900 text-lg mb-2">For Doctors</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    "Ensure your medical advice is understood after patients leave your clinic." Digitized prescriptions reduce treatment drop-offs.
                  </p>
                </div>

                <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
                  <div className="text-3xl mb-3">👨‍👩‍👧</div>
                  <h3 className="font-bold text-stone-900 text-lg mb-2">For Caregivers</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    "Stay alerted when your loved ones miss critical doses." Receive automated notifications for medication refills.
                  </p>
                </div>
              </div>
            </section>

            {/* 💻 HIGH-FIDELITY LAPTOP BROWSER MOCKUP (ASHA PORTAL) */}
            <section id="asha-portal" className="max-w-6xl mx-auto px-4 py-16">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="text-xs font-extrabold text-teal-700 uppercase tracking-wider block mb-2">
                  ENTERPRISE HEALTHCARE PORTAL
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
                  Supporting frontline workers with field-ready tools
                </h2>
              </div>

              <div className="laptop-mockup-frame">
                <div className="flex items-center gap-2 mb-4 pl-2">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                  <span className="text-xs text-slate-400 ml-3">https://asha.swasthya-sanchar.ai/portal/phc-4</span>
                </div>

                <div className="bg-white rounded-xl p-6 text-stone-900 shadow-md">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-200">
                    <div>
                      <h3 className="font-extrabold text-lg text-stone-900">ASHA Field Portal — Primary Health Centre #4</h3>
                      <p className="text-xs text-stone-500">Community Patient Records & Medication Monitoring</p>
                    </div>
                    <button 
                      onClick={() => openAuthModal('register')}
                      className="bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-teal-800 transition-colors cursor-pointer shadow-xs"
                    >
                      + Register Field Patient
                    </button>
                  </div>

                  {/* High-Impact Field Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-teal-50/70 border border-teal-200 p-4 rounded-xl text-center">
                      <div className="text-2xl font-extrabold text-teal-800">42</div>
                      <div className="text-xs font-bold text-stone-700 mt-0.5">Active Community Patients</div>
                    </div>
                    <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-center">
                      <div className="text-2xl font-extrabold text-amber-700">6</div>
                      <div className="text-xs font-bold text-stone-700 mt-0.5">Pending Home Visits</div>
                    </div>
                    <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl text-center">
                      <div className="text-2xl font-extrabold text-emerald-800">94.8%</div>
                      <div className="text-xs font-bold text-stone-700 mt-0.5">Voice Guidance Adherence</div>
                    </div>
                  </div>

                  {/* Sample Patient Health Monitoring Table */}
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                    <div className="text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-3">Live Field Patient Records</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase">
                            <th className="pb-2">Patient Name</th>
                            <th className="pb-2">Village / Gram</th>
                            <th className="pb-2">Language</th>
                            <th className="pb-2">Active Medicine</th>
                            <th className="pb-2">Adherence</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                          <tr>
                            <td className="py-2.5 font-bold text-stone-900">Ramesh Kumar</td>
                            <td className="py-2.5 text-stone-600">Mandya Gram</td>
                            <td className="py-2.5 font-bold text-teal-800">ಕನ್ನಡ (Kannada)</td>
                            <td className="py-2.5 text-stone-700">Paracetamol 500mg (1-0-1)</td>
                            <td className="py-2.5"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">✓ 95% Taken</span></td>
                          </tr>
                          <tr>
                            <td className="py-2.5 font-bold text-stone-900">Lakshmi Devi</td>
                            <td className="py-2.5 text-stone-600">Hassan Village</td>
                            <td className="py-2.5 font-bold text-teal-800">हिंदी (Hindi)</td>
                            <td className="py-2.5 text-stone-700">Amoxicillin 250mg</td>
                            <td className="py-2.5"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">✓ 88% Taken</span></td>
                          </tr>
                          <tr>
                            <td className="py-2.5 font-bold text-stone-900">Sunita Bai</td>
                            <td className="py-2.5 text-stone-600">Rampur Gram</td>
                            <td className="py-2.5 font-bold text-teal-800">मराठी (Marathi)</td>
                            <td className="py-2.5 text-stone-700">Hypertension Care</td>
                            <td className="py-2.5"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">⚠ Visit Due</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ❓ EXPANDABLE FAQ ACCORDION */}
            <section className="max-w-4xl mx-auto px-4 py-16">
              <div className="text-center mb-12">
                <span className="text-xs font-extrabold text-teal-700 uppercase tracking-wider block mb-2">
                  FREQUENTLY ASKED QUESTIONS
                </span>
                <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                  Everything you need to know about Swasthya Sanchar AI
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
                  <button 
                    className="w-full flex justify-between items-center text-left font-bold text-stone-900 text-base cursor-pointer"
                    onClick={() => toggleFaq(0)}
                  >
                    Does Swasthya Sanchar AI replace doctors?
                    <ChevronDownIcon size={20} />
                  </button>
                  {openFaq === 0 && (
                    <p className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600 leading-relaxed">
                      No. Swasthya Sanchar AI is a communication and translation assistance tool. It preserves original doctor prescriptions and does not generate autonomous clinical diagnoses.
                    </p>
                  )}
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
                  <button 
                    className="w-full flex justify-between items-center text-left font-bold text-stone-900 text-base cursor-pointer"
                    onClick={() => toggleFaq(1)}
                  >
                    Which Indian languages are supported?
                    <ChevronDownIcon size={20} />
                  </button>
                  {openFaq === 1 && (
                    <p className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600 leading-relaxed">
                      Swasthya Sanchar AI supports 22+ regional Indian languages including Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Gujarati, and Malayalam with text and natural voice synthesis.
                    </p>
                  )}
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
                  <button 
                    className="w-full flex justify-between items-center text-left font-bold text-stone-900 text-base cursor-pointer"
                    onClick={() => toggleFaq(2)}
                  >
                    How is patient medical data protected?
                    <ChevronDownIcon size={20} />
                  </button>
                  {openFaq === 2 && (
                    <p className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600 leading-relaxed">
                      All health records are stored in PostgreSQL relational databases with Role-Based Access Control (RBAC) and encrypted REST APIs.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* 🎯 FINAL CTA BANNER */}
            <section className="max-w-6xl mx-auto px-4 py-12">
              <div className="bg-gradient-to-r from-teal-800 to-teal-900 rounded-3xl p-10 md:p-16 text-center text-white shadow-xl">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
                  Healthcare shouldn't be difficult to understand.
                </h2>
                <p className="text-teal-100 text-base md:text-lg max-w-2xl mx-auto mb-8">
                  Let's make every prescription clearer, every instruction more accessible, and every rural patient more empowered.
                </p>

                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-orange-200 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  Join the Early Access Waitlist <ArrowRightIcon size={18} />
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      {/* 💼 PURE CORPORATE FOOTER */}
      <footer className="bg-stone-900 text-stone-400 py-16 px-4 md:px-10 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-700 text-white rounded-lg flex items-center justify-center">
                <HospitalIcon size={18} color="#ffffff" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">Swasthya Sanchar AI</span>
            </div>
            <p className="text-stone-400 leading-relaxed mb-4">
              Multilingual AI-Powered Healthcare Communication Assistant dedicated to bridging health literacy barriers for rural and underserved communities.
            </p>

            <form onSubmit={handleWaitlistSubmit} className="mt-4">
              <div className="font-bold text-white mb-2">Get Product Updates:</div>
              <div className="flex gap-2">
                <input
                  type="email"
                  className="bg-stone-800 border border-stone-700 text-white px-3 py-2 rounded-lg text-xs outline-none flex-1"
                  placeholder="Enter work email"
                  value={emailWaitlist}
                  onChange={(e) => setEmailWaitlist(e.target.value)}
                  required
                />
                <button type="submit" className="border border-stone-600 text-white px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer">
                  Subscribe
                </button>
              </div>
              {waitlistSubmitted && (
                <div className="text-teal-400 mt-2">✓ Thank you for subscribing!</div>
              )}
            </form>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Product Solutions</h4>
            <ul className="flex flex-col gap-2">
              <li><a href="#ecosystem" className="hover:text-teal-400 transition-colors">For Patients</a></li>
              <li><a href="#asha-portal" className="hover:text-teal-400 transition-colors">For ASHA Workers</a></li>
              <li><a href="#ecosystem" className="hover:text-teal-400 transition-colors">For Doctors & Clinics</a></li>
              <li><a href="#ecosystem" className="hover:text-teal-400 transition-colors">For Caregivers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Technology</h4>
            <ul className="flex flex-col gap-2">
              <li><a href="#how-it-works" className="hover:text-teal-400 transition-colors">OCR & Medical NLP Pipeline</a></li>
              <li><a href="#prescription-intelligence" className="hover:text-teal-400 transition-colors">Gemini LLM Simplification</a></li>
              <li><a href="#prescription-intelligence" className="hover:text-teal-400 transition-colors">Multilingual Voice TTS</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Company</h4>
            <ul className="flex flex-col gap-2">
              <li><button onClick={() => setCurrentView('about')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">About Us</button></li>
              <li><a href="#prescription-intelligence" className="hover:text-teal-400 transition-colors">Trust & Safety</a></li>
              <li><a href="#prescription-intelligence" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-stone-500 text-[11px]">
          <div>© 2026 Swasthya Sanchar AI. All rights reserved. Built for Rural Healthcare Communication.</div>
          <div>Enterprise REST APIs & Multilingual Voice Assistance.</div>
        </div>
      </footer>

      {/* 🔐 AUTHENTICATION MODAL */}
      {authModal.open && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4" onClick={closeAuthModal}>
          <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-10 max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 w-8 h-8 bg-stone-100 text-stone-600 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors cursor-pointer" onClick={closeAuthModal}>
              ✕
            </button>

            {authModal.mode === 'login' ? (
              <Login setCurrentView={setCurrentView} closeAuthModal={closeAuthModal} />
            ) : (
              <Register setCurrentView={setCurrentView} closeAuthModal={closeAuthModal} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
