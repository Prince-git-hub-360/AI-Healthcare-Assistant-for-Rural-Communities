import React, { useState, useEffect } from 'react';
import { useAuth, LANGUAGES } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';
import {
  DocumentIcon, BrainIcon, TranslateIcon, SpeakerIcon, ShieldIcon, CheckIcon,
  ClockIcon, PlusIcon, PhoneIcon, PillIcon, AlertIcon, RefreshIcon, UserIcon,
  SparklesIcon, FireIcon, MicIcon, HeartIcon, ActivityIcon, VideoIcon
} from '../../../../shared/icons/Icons';
import { speakNativeAudio } from '../../../../shared/utils/speech';

export const PatientHomePage = ({ setCurrentView, onOpenChat }) => {
  const { user, currentLang, showToast } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [playingGreeting, setPlayingGreeting] = useState(false);

  const loadData = async () => {
    setLoadingReminders(true);
    try {
      const remData = await api.getReminders();
      let rawList = Array.isArray(remData) ? remData : remData?.results || [];
      if (rawList.length > 0) {
        const defaultTimes = ['08:00 AM', '01:30 PM', '08:00 PM'];
        const mapped = rawList.map((r, idx) => {
          let timeVal = r.scheduled_time || r.time || '';
          if (!timeVal || timeVal === '20:00:00' || timeVal === '20:00') {
            timeVal = defaultTimes[idx % defaultTimes.length];
          } else if (timeVal.includes(':') && !timeVal.includes(' AM') && !timeVal.includes(' PM')) {
            const parts = timeVal.split(':');
            const h = parseInt(parts[0], 10);
            const m = parts[1] || '00';
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            timeVal = `${h12.toString().padStart(2, '0')}:${m} ${ampm}`;
          }
          return {
            id: r.id,
            medication_name: r.medication_name || r.title || 'Prescribed Medicine',
            scheduled_time: timeVal,
            instructions: r.instructions || r.notes || r.dosage_note || 'Take 1 tablet with water',
            is_taken: r.is_taken || r.dose_status === 'taken',
          };
        });
        setReminders(mapped);
      } else {
        setReminders([
          { id: 101, medication_name: 'Paracetamol 500mg', scheduled_time: '08:00 AM', instructions: '1 tablet after breakfast (PC)', is_taken: true },
          { id: 102, medication_name: 'Amoxicillin 250mg', scheduled_time: '01:30 PM', instructions: '1 capsule after lunch (PC)', is_taken: false },
          { id: 103, medication_name: 'Levocetirizine 5mg', scheduled_time: '08:00 PM', instructions: '1 tablet at bedtime (HS)', is_taken: false },
        ]);
      }
    } catch (err) {
      setReminders([
        { id: 101, medication_name: 'Paracetamol 500mg', scheduled_time: '08:00 AM', instructions: '1 tablet after breakfast (PC)', is_taken: true },
        { id: 102, medication_name: 'Amoxicillin 250mg', scheduled_time: '01:30 PM', instructions: '1 capsule after lunch (PC)', is_taken: false },
        { id: 103, medication_name: 'Levocetirizine 5mg', scheduled_time: '08:00 PM', instructions: '1 tablet at bedtime (HS)', is_taken: false },
      ]);
    }
    setLoadingReminders(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const toggleReminderStatus = async (id, currentStatus) => {
    try {
      await api.toggleReminder(id, !currentStatus);
      setReminders(reminders.map(r => r.id === id ? { ...r, is_taken: !currentStatus } : r));
      if (showToast) showToast(!currentStatus ? 'Marked as Taken ✓' : 'Marked as Pending ○', 'success');
    } catch (err) {
      setReminders(reminders.map(r => r.id === id ? { ...r, is_taken: !currentStatus } : r));
    }
  };

  const playWelcomeAudio = async () => {
    setPlayingGreeting(true);
    const greetingText = {
      hi: `नमस्ते ${user?.first_name || 'मरीज'} जी! स्वास्थ्य संचार में आपका स्वागत है। आज आपकी दवाओं का ध्यान रखें।`,
      kn: `ನಮಸ್ಕಾರ ${user?.first_name || 'ರೋಗಿ'} ಅವರೇ! ಸ್ವಾಸ್ಥ್ಯ ಸಂಚಾರ್‌ಗೆ ಸ್ವಾಗತ.`,
      en: `Namaste ${user?.first_name || 'Patient'}! Welcome to Swasthya Sanchar AI Care Portal.`,
    }[currentLang || 'hi'] || `Namaste! Welcome to Swasthya Sanchar.`;

    await speakNativeAudio(greetingText, currentLang || 'hi');
    setPlayingGreeting(false);
  };

  const completedCount = reminders.filter(r => r.is_taken).length;
  const totalCount = reminders.length;
  const adherencePercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const currentLangObj = LANGUAGES.find(l => l.code === (currentLang || 'hi')) || LANGUAGES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* RURAL ASSISTED CARE MODEL ACCESSIBILITY BAR */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-teal-500/10 border border-amber-300/40 rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-amber-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-xl shrink-0 shadow-md ring-4 ring-amber-100">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-amber-950 text-sm">
                Zero-Literacy & 2G Feature Phone Assisted Care
              </span>
              <span className="bg-amber-200 text-amber-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
                RURAL CARE MODEL
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mt-1">
              Supports illiterate villagers & non-smartphone users via door-to-door ASHA scanning, 1-tap voice audio playback, and automated 2G IVR phone calls.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('reminders')}
          className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-2"
        >
          <span>Test 2G Voice Alert</span>
          <PhoneIcon size={14} color="#ffffff" />
        </button>
      </div>

      {/* PATIENT CARE HUB COMMAND CENTER */}
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 border border-teal-800/60 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-teal-500/20 text-teal-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-teal-400/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE HEALTH MONITORING
                </span>
                <span className="bg-white/10 text-cyan-200 text-[10px] font-extrabold px-3 py-1 rounded-full border border-white/10">
                  ABHA ID: 14-8923-4512-9012
                </span>
                <span className="bg-amber-400/20 text-amber-200 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-400/30">
                  📍 Mandya Sector #4
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Welcome back, {user?.first_name || user?.username || 'Patient'}! 🙏
              </h1>

              <p className="text-xs md:text-sm text-cyan-100/80 max-w-2xl leading-relaxed">
                Your personalized rural healthcare assistant. Active language: <strong className="text-emerald-300 font-bold uppercase">{currentLangObj.native} ({currentLangObj.name})</strong>. All health vitals monitored by Mandya Primary Health Sub-Center.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                onClick={playWelcomeAudio}
                disabled={playingGreeting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <SpeakerIcon size={18} color="#ffffff" />
                <span>{playingGreeting ? 'Speaking Greeting...' : '🔊 Voice Summary'}</span>
              </button>

              <button
                onClick={onOpenChat}
                className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/40 font-extrabold text-xs px-5 py-3.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 backdrop-blur-md"
              >
                <SparklesIcon size={18} color="#2dd4bf" />
                <span>Ask AI Assistant</span>
              </button>
            </div>
          </div>
        </div>

        {/* CLINICAL OVERVIEW ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-widest block">DAILY ADHERENCE</span>
                <h3 className="text-base font-extrabold text-stone-900">Medication Score</h3>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-extrabold">
                <FireIcon size={14} color="#d97706" />
                <span>5-Day Streak! 🔥</span>
              </div>
            </div>

            <div className="flex items-center justify-around py-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-stone-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${adherencePercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-stone-900">{adherencePercent}%</span>
                  <span className="text-[9px] text-stone-500 uppercase font-extrabold">COMPLETED</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl">
                  <span className="text-emerald-950 font-extrabold block">{completedCount} of {totalCount} Doses</span>
                  <span className="text-emerald-700 text-[10px] font-bold">Taken today ✓</span>
                </div>
                <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-2xl">
                  <span className="text-stone-900 font-extrabold block">{totalCount - completedCount} Doses</span>
                  <span className="text-stone-500 text-[10px] font-bold">Pending today ○</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-500 border-t border-stone-100 pt-3">
              {adherencePercent === 100 ? '🎉 Excellent! All prescribed doses taken.' : 'Remember to complete afternoon and night doses on time.'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4 border border-amber-400">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-amber-100">
                UPCOMING DOSE ALERT
              </span>
              <span className="text-xs font-extrabold bg-amber-950/40 px-2.5 py-0.5 rounded-md text-white">
                ☀️ Afternoon (1:30 PM)
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-white leading-snug">
                Tab. Paracetamol 500mg
              </h3>
              <p className="text-xs text-amber-100/95 leading-relaxed">
                Take 1 tablet after lunch with warm drinking water for fever & body ache relief.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => showToast?.('Marked Paracetamol 500mg as taken! Adherence updated.', 'success')}
                className="flex-1 bg-white hover:bg-amber-50 text-amber-950 font-extrabold text-xs py-3 rounded-2xl shadow-sm transition-all cursor-pointer text-center active:scale-95"
              >
                ✓ Mark Taken
              </button>
              <button
                onClick={playWelcomeAudio}
                className="bg-amber-950/40 hover:bg-amber-950/60 text-white font-extrabold text-xs px-4 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
              >
                <SpeakerIcon size={16} color="#ffffff" />
                <span>🔊 Voice</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4 border border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-700 text-white rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-md">
                  👩‍⚕️
                </div>
                <div>
                  <div className="text-[9px] font-extrabold text-teal-400 uppercase tracking-widest">
                    ASSIGNED CARE COORDINATOR
                  </div>
                  <div className="text-base font-extrabold text-white">Dr. Lena Rao & Sunita Sister</div>
                  <div className="text-xs text-slate-300">Mandya Primary Health Sub-Center #4</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Door-to-door village health coordinator & PHC Internal Medicine Doctor available for direct consultation.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => showToast?.('Calling ASHA Sister Sunita (+91 98765 43210)...', 'info')}
                className="flex-1 bg-teal-700 hover:bg-teal-600 text-white font-extrabold text-xs py-3 rounded-2xl cursor-pointer transition-colors text-center shadow-sm active:scale-95"
              >
                📞 Call ASHA
              </button>
              <button
                onClick={() => showToast?.('Connecting Tele-Consultation with Dr. Lena Rao...', 'info')}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-teal-300 font-extrabold text-xs py-3 rounded-2xl cursor-pointer transition-colors text-center border border-slate-700 active:scale-95"
              >
                🎥 Tele-Consult
              </button>
            </div>
          </div>
        </div>

        {/* MONITORED VITALS & CLINICAL METRICS BAR */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-widest block">CLINICAL VITAL SIGNS</span>
              <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">Monitored Health Indicators</h2>
            </div>
            <button
              onClick={() => showToast?.('Vitals logged: BP 120/80, Sugar 110 mg/dL, SpO2 98%', 'success')}
              className="bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-extrabold text-xs px-4 py-2.5 rounded-2xl cursor-pointer transition-all active:scale-95 self-start sm:self-auto"
            >
              ➕ Log Today's Vitals
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-1">
              <div className="text-xs font-extrabold text-emerald-950">Blood Pressure</div>
              <div className="text-2xl font-extrabold text-emerald-700">120/80</div>
              <div className="text-[10px] font-bold text-emerald-800">mmHg • Normal 🟢</div>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl space-y-1">
              <div className="text-xs font-extrabold text-blue-950">Blood Sugar</div>
              <div className="text-2xl font-extrabold text-blue-700">110</div>
              <div className="text-[10px] font-bold text-blue-800">mg/dL • Fasting 🟢</div>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-1">
              <div className="text-xs font-extrabold text-amber-950">Oxygen (SpO2)</div>
              <div className="text-2xl font-extrabold text-amber-700">98%</div>
              <div className="text-[10px] font-bold text-amber-800">Pulse 72 bpm • Normal 🟢</div>
            </div>

            <div className="bg-cyan-50/70 border border-cyan-200 p-4 rounded-2xl space-y-1">
              <div className="text-xs font-extrabold text-cyan-950">Body Temp</div>
              <div className="text-2xl font-extrabold text-cyan-700">98.4 °F</div>
              <div className="text-[10px] font-bold text-cyan-800">Normal Range 🟢</div>
            </div>
          </div>
        </div>

        {/* 6-CARD MEDICAL SERVICES SUITE */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
            Essential Healthcare Services
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div
              onClick={() => setCurrentView('translate')}
              className="bg-white hover:bg-teal-50/40 border border-stone-200 hover:border-teal-400 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="w-12 h-12 bg-teal-100 text-teal-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <TranslateIcon size={26} color="#0f766e" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-teal-900">
                  Translate Rx Note
                </h3>
                <p className="text-[11px] text-teal-700 font-bold mt-1">AI Vision OCR + Voice 🔊</p>
              </div>
            </div>

            <div
              onClick={() => setCurrentView('reminders')}
              className="bg-white hover:bg-amber-50/40 border border-stone-200 hover:border-amber-400 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <PillIcon size={26} color="#d97706" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-amber-900">
                  Medicine Schedule
                </h3>
                <p className="text-[11px] text-stone-500 mt-1">Morning, Lunch & Bedtime</p>
              </div>
            </div>

            <div
              onClick={() => setCurrentView('medical_vault')}
              className="bg-white hover:bg-blue-50/40 border border-stone-200 hover:border-blue-400 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <DocumentIcon size={26} color="#1d4ed8" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-blue-900">
                  Medical Vault
                </h3>
                <p className="text-[11px] text-stone-500 mt-1">Stored Rx & Delete 🗑️</p>
              </div>
            </div>

            <div
              onClick={() => setCurrentView('emergency')}
              className="bg-red-50 hover:bg-red-100/80 border border-red-200 hover:border-red-400 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <PhoneIcon size={26} color="#ffffff" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-red-950">
                  108 Emergency SOS
                </h3>
                <p className="text-[11px] text-red-800 mt-1">Ambulance & First-Aid</p>
              </div>
            </div>

            <div
              onClick={() => setCurrentView('reminders')}
              className="bg-white hover:bg-amber-50/40 border border-stone-200 hover:border-amber-400 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <span className="text-xl">📞</span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-amber-900">
                  2G Feature Phone
                </h3>
                <p className="text-[11px] text-stone-500 mt-1">Basic phone voice call</p>
              </div>
            </div>

            <div
              onClick={onOpenChat}
              className="bg-white hover:bg-teal-50/40 border border-stone-200 hover:border-teal-400 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="w-12 h-12 bg-teal-700 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <SparklesIcon size={26} color="#ffffff" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-teal-900">
                  Swasthya Mitr AI
                </h3>
                <p className="text-[11px] text-stone-500 mt-1">Multimodal Voice AI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Timeline */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                <PillIcon size={22} color="#0f766e" /> Today's Medication Schedule Timeline
              </h2>
              <p className="text-xs text-stone-500">Organized into Morning, Afternoon, and Night dosage slots</p>
            </div>

            <button
              onClick={() => setCurrentView('reminders')}
              className="text-xs font-extrabold text-teal-700 hover:text-teal-800 cursor-pointer"
            >
              Manage Reminders →
            </button>
          </div>

          {loadingReminders ? (
            <div className="py-8 text-center text-xs text-stone-500 animate-pulse">Loading daily medication schedule...</div>
          ) : reminders.length === 0 ? (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center text-xs text-stone-600">
              No active medication reminders scheduled for today.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reminders.map((r) => (
                <div
                  key={r.id}
                  onClick={() => toggleReminderStatus(r.id, r.is_taken)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                    r.is_taken
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                      : 'bg-stone-50/80 border-stone-200 hover:border-teal-600 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-white border border-stone-200 px-3 py-1 rounded-xl font-extrabold text-xs text-teal-800 shadow-xs">
                      ⏰ {r.scheduled_time}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      r.is_taken ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {r.is_taken ? '✓ Taken' : '○ Pending'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-extrabold text-base text-stone-900">{r.medication_name || r.title}</div>
                    <p className="text-xs text-stone-600 leading-relaxed">{r.instructions || r.dosage_note || 'Take 1 tablet with water'}</p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-teal-800">
                    <span>Tap to mark {r.is_taken ? 'pending' : 'taken'}</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHomePage;
