import React, { useState, useEffect } from 'react';
import { useAuth, LANGUAGES } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';
import {
  DocumentIcon, TranslateIcon, SpeakerIcon, ClockIcon, PhoneIcon, PillIcon,
  UserIcon, SparklesIcon, ActivityIcon, ChevronDownIcon, CheckIcon, ShieldIcon
} from '../../../../shared/icons/Icons';
import { speakNativeAudio } from '../../../../shared/utils/speech';
import { EmergencySOS } from '../../components/EmergencySOS';

/* ─── tiny SVG ring/progress component ─── */
const ProgressRing = ({ pct = 0, size = 88, stroke = 8 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={pct === 100 ? '#059669' : '#E2A233'}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
};

/* ─── Dose slot indicator ─── */
const DoseSlot = ({ label, time, taken }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-black transition-all ${
      taken
        ? 'bg-emerald-500 border-emerald-500 text-white'
        : 'bg-white dark:bg-slate-800 border-stone-300 dark:border-slate-600 text-slate-400'
    }`}>
      {taken ? '✓' : '○'}
    </div>
    <span className="text-[9px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{time}</span>
  </div>
);

/* ─── Quick prompt chip ─── */
const PromptChip = ({ text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-[11px] font-semibold bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full px-3 py-1.5 hover:border-[#E2A233] hover:text-[#8A5B00] dark:hover:text-[#E2A233] transition-all cursor-pointer whitespace-nowrap shadow-2xs"
  >
    {text}
  </button>
);

/* ─── Vital card ─── */
const VitalCard = ({ label, value, unit, status, color }) => {
  const colorMap = {
    emerald: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
    sky: 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60',
    amber: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
    slate: 'text-slate-700 dark:text-slate-300 bg-stone-50 dark:bg-slate-800/60 border-stone-200 dark:border-slate-700',
  };
  return (
    <div className={`rounded-xl border p-3 space-y-1.5 shadow-2xs ${colorMap[color] || colorMap.slate}`}>
      <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-70">{label}</div>
      <div className="text-sm font-black text-slate-900 dark:text-white">
        {value} <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{unit}</span>
      </div>
      <div className="text-[10px] font-bold flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
        {status}
      </div>
    </div>
  );
};

/* ─── Service tile ─── */
const ServiceTile = ({ icon, label, sub, onClick, danger = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer group space-y-2 ${
      danger
        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-950/60'
        : 'bg-stone-50 dark:bg-slate-800/80 border-stone-200 dark:border-slate-700 hover:bg-[#FFF7E6] hover:border-[#E2A233] dark:hover:bg-[#2A1F0A] dark:hover:border-[#E2A233]'
    }`}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${
      danger ? 'bg-rose-100 dark:bg-rose-900/60' : 'bg-[#FFF3D0] dark:bg-[#2A1F0A]'
    }`}>
      {icon}
    </div>
    <div>
      <div className={`text-xs font-extrabold ${danger ? 'text-rose-900 dark:text-rose-200' : 'text-slate-900 dark:text-white'}`}>{label}</div>
      <div className={`text-[10px] font-medium mt-0.5 ${danger ? 'text-rose-700 dark:text-rose-300' : 'text-slate-500 dark:text-slate-400'}`}>{sub}</div>
    </div>
  </button>
);

/* ═══════════════════════════════════════════════════════════════ */
/*  PATIENT HOME PAGE                                              */
/* ═══════════════════════════════════════════════════════════════ */
export const PatientHomePage = ({ setCurrentView, onOpenChat }) => {
  const {
    user, currentLang, updateLanguage, showToast,
    largeText, highContrast, voiceReminders,
    toggleLargeText, toggleHighContrast, toggleVoiceReminders
  } = useAuth();

  const [reminders, setReminders] = useState([]);
  const [medicalDocuments, setMedicalDocuments] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [playingGreeting, setPlayingGreeting] = useState(false);

  const userName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username || 'Prince';

  /* ── time-of-day greeting ── */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  /* ── data loading ── */
  const loadData = async () => {
    setLoadingReminders(true);
    try {
      const [remData, docsData] = await Promise.allSettled([
        api.getReminders(),
        api.getMedicalDocuments(),
      ]);

      if (remData.status === 'fulfilled') {
        const rawList = Array.isArray(remData.value) ? remData.value : remData.value?.results || [];
        if (rawList.length > 0) {
          const mapped = rawList.map((r) => {
            let timeVal = r.scheduled_time || r.time || '';
            if (timeVal.includes(':') && !timeVal.includes(' AM') && !timeVal.includes(' PM')) {
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
              scheduled_time: timeVal || '08:00 AM',
              instructions: r.instructions || r.notes || r.dosage_note || 'Take 1 tablet with water after food',
              is_taken: r.is_taken || r.dose_status === 'taken',
            };
          });
          setReminders(mapped);
        } else {
          setReminders([]);
        }
      }

      if (docsData.status === 'fulfilled') {
        const docList = Array.isArray(docsData.value) ? docsData.value : docsData.value?.results || [];
        setMedicalDocuments(docList);
      }
    } catch {
      setReminders([]);
      setMedicalDocuments([]);
    }
    setLoadingReminders(false);
  };

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('swasthya_reminders_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('swasthya_reminders_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [user]);

  const toggleReminderStatus = async (id, currentStatus) => {
    const nextStatus = !currentStatus;
    try {
      await api.toggleReminder(id, nextStatus);
    } catch {}

    // Update local reminders state
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, is_taken: nextStatus } : r)));

    // Synchronize pillbox day_0 completion state
    try {
      const savedPillbox = JSON.parse(localStorage.getItem('swasthya_pillbox_day_taken') || '{}');
      savedPillbox[`day_0_rem_${id}`] = nextStatus;
      localStorage.setItem('swasthya_pillbox_day_taken', JSON.stringify(savedPillbox));
    } catch {}

    showToast?.(nextStatus ? 'Dose marked as completed! ✓' : 'Dose marked as pending ○', 'success');
    window.dispatchEvent(new Event('swasthya_reminders_updated'));
    window.dispatchEvent(new Event('storage'));
  };

  const playWelcomeAudio = async (text) => {
    setPlayingGreeting(true);
    const greetingText = text || ({
      hi: `नमस्ते ${userName} जी! स्वास्थ संचार में आपका स्वागत है।`,
      kn: `ನಮಸ್ಕಾರ ${userName} ಅವರೇ! ಸ್ವಾಸ್ಥ್ಯ ಸಂಚಾರ್‌ಗೆ ಸ್ವಾಗತ.`,
      en: `${greeting} ${userName}! Here is your health summary for today.`,
      te: `నమస్కారం ${userName}! స్వాస్థ్య సంచార్‌కి స్వాగతం.`,
      ta: `வணக்கம் ${userName}! ஸ்வாஸ்த்யா சஞ்சாருக்கு வரவேற்கிறோம்.`,
    }[currentLang || 'hi'] || `Namaste ${userName}! Welcome to Swasthya Sanchar.`);
    await speakNativeAudio(greetingText, currentLang || 'hi');
    setPlayingGreeting(false);
  };

  /* ── derived values ── */
  const completedCount = reminders.filter(r => r.is_taken).length;
  const totalCount = reminders.length;
  const pendingCount = totalCount - completedCount;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;
  const nextDose = reminders.find(r => !r.is_taken) || reminders[0];
  const activeLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  /* ── slot labels for progress ring ── */
  const slotLabels = ['Morn.', 'Aftn.', 'Night'];

  /* ── today date ── */
  const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F17] min-h-screen font-sans text-slate-900 dark:text-slate-100 pb-28 transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto space-y-5 px-0.5">

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 1 — COMPACT HEADER ROW
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/70 dark:border-slate-800 pb-4">
          {/* Greeting */}
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#D97706] dark:text-[#E2A233] mb-0.5">{todayStr}</div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {greeting}, {userName} 👋
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Your personal healthcare assistant is ready.</p>
          </div>

          {/* Status row */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Dose status pill */}
            <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold border ${
              pendingCount > 0
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${pendingCount > 0 ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
              {pendingCount > 0 ? `${pendingCount} dose pending` : 'All doses taken'}
            </div>

            {/* ASHA pill */}
            <div className="bg-[#E2A233]/12 border border-[#E2A233]/35 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[#8A5B00] dark:text-[#E2A233]">
              📅 ASHA: Tomorrow
            </div>

            {/* ABHA pill */}
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              ✓ ABHA Active
            </div>

            {/* Language selector */}
            <select
              value={currentLang}
              onChange={(e) => updateLanguage(e.target.value)}
              className="bg-white dark:bg-slate-800 border-2 border-[#E2A233]/70 text-slate-900 dark:text-white font-extrabold text-[11px] rounded-lg px-2.5 py-1.5 cursor-pointer outline-none focus:ring-2 focus:ring-[#E2A233]/50 shadow-2xs"
              title="Change Language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.flag} {lang.native}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 1.5 — 4-COLOR QUICK ACTION SHORTCUTS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Prescription AI (Indigo) */}
          <button
            type="button"
            onClick={() => setCurrentView?.('translate')}
            className="group bg-indigo-50/70 hover:bg-indigo-100/80 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 p-3.5 rounded-2xl flex items-center gap-3 transition-all text-left shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              📷
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">AI VISION</span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate block">Prescription AI</span>
            </div>
          </button>

          {/* Daily Pillbox (Amber) */}
          <button
            type="button"
            onClick={() => setCurrentView?.('reminders')}
            className="group bg-amber-50/70 hover:bg-amber-100/80 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 p-3.5 rounded-2xl flex items-center gap-3 transition-all text-left shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              💊
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider block">DAILY DOSE</span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate block">Pillbox Reminders</span>
            </div>
          </button>

          {/* Health Vault (Teal) */}
          <button
            type="button"
            onClick={() => setCurrentView?.('medical_vault')}
            className="group bg-teal-50/70 hover:bg-teal-100/80 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800/60 p-3.5 rounded-2xl flex items-center gap-3 transition-all text-left shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0B4F42] text-white flex items-center justify-center text-lg font-black shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              📂
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-teal-700 dark:text-teal-400 uppercase tracking-wider block">ABDM VAULT</span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate block">Health Records</span>
            </div>
          </button>

          {/* Emergency 108 / 112 (Rose) */}
          <button
            type="button"
            onClick={() => setCurrentView?.('emergency')}
            className="group bg-rose-50/70 hover:bg-rose-100/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 p-3.5 rounded-2xl flex items-center gap-3 transition-all text-left shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              🚨
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider block">24x7 SOS</span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate block">Emergency Care</span>
            </div>
          </button>

        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 2 — HERO DOSE + PROGRESS RING
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* LEFT: Medication Hero Card */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 border-l-[4px] border-l-[#E2A233] rounded-2xl shadow-sm overflow-hidden transition-colors">
            {/* Card header */}
            <div className="px-5 pt-5 pb-3.5 border-b border-stone-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#FFF3D0] dark:bg-[#2A1F0A] rounded-lg flex items-center justify-center">
                  <PillIcon size={15} className="text-[#E2A233]" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#D97706] dark:text-[#E2A233]">Today's Priority Dose</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Next Scheduled Medication</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCurrentView?.('reminders')}
                className="text-[11px] font-extrabold text-[#D97706] dark:text-[#E2A233] hover:underline cursor-pointer"
              >
                View Schedule →
              </button>
            </div>

            {/* Dose body */}
            <div className="p-5">
              {reminders.length > 0 && nextDose ? (
                <div className="space-y-4">
                  {/* Time + Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-3 py-1.5 shadow-2xs">
                      <span className="text-sm">⏰</span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">{nextDose.scheduled_time}</span>
                    </div>
                    <span className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg ${
                      nextDose.is_taken
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300'
                    }`}>
                      {nextDose.is_taken ? '✓ Dose Completed' : '○ Pending'}
                    </span>
                  </div>

                  {/* Medicine name */}
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{nextDose.medication_name}</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1 leading-relaxed">{nextDose.instructions}</p>
                  </div>

                  {/* CTA row */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => toggleReminderStatus(nextDose.id, nextDose.is_taken)}
                      className={`flex items-center gap-2 text-sm font-extrabold px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer ${
                        nextDose.is_taken
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-[#E2A233] hover:bg-[#c88d28] text-slate-950 hover:shadow-md'
                      }`}
                    >
                      {nextDose.is_taken ? (
                        <><CheckIcon size={16} /> Marked as Taken</>
                      ) : (
                        <><PillIcon size={16} className="text-slate-900" /> Mark as Taken</>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => playWelcomeAudio()}
                      disabled={playingGreeting}
                      className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 border border-stone-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-60"
                    >
                      <SpeakerIcon size={15} />
                      {playingGreeting ? 'Playing…' : `Listen (${activeLangObj.native})`}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-2xl shadow-xs">
                    💊
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      No Active Prescriptions Added Yet
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                      Scan your doctor's slip to automatically extract medicines and set vernacular audio pillbox alarms.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setCurrentView?.('translate')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>📷 Scan Prescription Slip</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentView?.('reminders')}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      <span>+ Add Medicine</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Progress Ring + Dose Slots */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 flex flex-col items-center justify-center gap-4 transition-colors">
            <div className="text-center">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Daily Compliance</div>
              {/* Ring */}
              <div className="relative inline-flex items-center justify-center">
                <ProgressRing pct={pct} size={96} stroke={9} />
                <div className="absolute text-center">
                  <div className="text-xl font-black text-slate-900 dark:text-white">{pct}%</div>
                  <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Done</div>
                </div>
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                {completedCount} of {totalCount} doses taken
              </div>
            </div>

            {/* Dose slot pills */}
            <div className="flex items-center justify-center gap-4 w-full pt-2 border-t border-stone-100 dark:border-slate-800">
              {reminders.slice(0, 3).map((r, i) => (
                <DoseSlot
                  key={r.id}
                  label={slotLabels[i] || `Dose ${i + 1}`}
                  time={r.scheduled_time}
                  taken={r.is_taken}
                />
              ))}
            </div>

            {/* Full schedule CTA */}
            <button
              type="button"
              onClick={() => setCurrentView?.('reminders')}
              className="w-full text-center text-[11px] font-extrabold text-[#D97706] dark:text-[#E2A233] hover:underline cursor-pointer mt-1"
            >
              Manage Full Schedule →
            </button>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 3 — SWASTHYA GYAN KENDRA LAUNCH BANNER
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-gradient-to-r from-[#0B4F42] via-[#0D5C4D] to-[#0A3D32] border border-teal-800/60 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center gap-2">
              <span className="bg-teal-400/20 text-teal-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-teal-400/30">
                📚 Swasthya Gyan Kendra
              </span>
              <span className="text-[10px] font-bold text-teal-200/80">
                14 Organs • Multi-Lingual Audio
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              Learn How Your Body Works &amp; Prevent Illness
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed font-medium">
              Explore your heart, lungs, liver, diabetes care, and maternal health in your own mother tongue with spoken voice guidance and healthy rural nutrition.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
            <button
              type="button"
              onClick={() => setCurrentView?.('health_map')}
              className="bg-[#E2A233] hover:bg-[#c88d28] text-slate-950 text-xs sm:text-sm font-black py-3 px-6 rounded-2xl transition-all transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>📚 Open Health Knowledge Hub</span>
              <span>→</span>
            </button>
          </div>

        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 4 — AI ASSISTANT + VITALS (50/50)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* AI Assistant Card */}
          <div className="bg-gradient-to-br from-[#0B4F42] to-[#0A3D32] border border-[#0B4F42] rounded-2xl p-5 shadow-sm space-y-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shadow-sm">
                <SparklesIcon size={20} className="text-[#E2A233]" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 mb-0.5">Swasthya AI</div>
                <div className="text-sm font-bold text-white">Ask Your Health Assistant</div>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed font-medium">
              Get instant answers about your prescriptions, dosages, symptoms, or anything health-related — in your language.
            </p>

            {/* Quick prompt chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                '💊 What is Amoxicillin for?',
                '🍽️ Can I take after food?',
                '⚠️ Any side effects?',
                '🌡️ I have a fever — help',
              ].map((prompt) => (
                <PromptChip
                  key={prompt}
                  text={prompt}
                  onClick={() => {
                    if (onOpenChat) onOpenChat(prompt);
                    else setCurrentView?.('chat');
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (onOpenChat) onOpenChat();
                else setCurrentView?.('chat');
              }}
              className="w-full bg-[#E2A233] hover:bg-[#c88d28] text-slate-950 text-sm font-extrabold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <SparklesIcon size={16} className="text-slate-950" />
              Chat with Swasthya AI
            </button>
          </div>

          {/* Vitals Snapshot Card */}
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
            <div className="px-5 pt-4 pb-3 border-b border-stone-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ActivityIcon size={16} className="text-[#D97706] dark:text-[#E2A233]" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">Health Vitals</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-lg">
                ● All Normal
              </span>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Updated 2 hours ago by ASHA Sister</p>
              <div className="grid grid-cols-2 gap-2.5">
                <VitalCard label="Blood Pressure" value="120/80" unit="mmHg" status="Normal" color="slate" />
                <VitalCard label="Blood Sugar" value="110" unit="mg/dL" status="Normal" color="emerald" />
                <VitalCard label="Oxygen (SpO₂)" value="98%" unit="72 bpm" status="Normal" color="sky" />
                <VitalCard label="Body Temp" value="98.4 °F" unit="" status="Normal" color="amber" />
              </div>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 5 — RURAL CARE LIFELINE & EMERGENCY
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* 1. 2G IVR Voice Support */}
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl shadow-xs p-4 flex flex-col justify-between space-y-3 transition-colors">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>🌾</span>
                  <span>2G IVR Offline Voice</span>
                </span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md font-extrabold border border-amber-200 dark:border-amber-800">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Automated phone calls &amp; SMS alerts in your village dialect for feature phones without internet.
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast?.('Simulating 2G IVR Voice Call to your phone…', 'info')}
              className="w-full bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer text-center"
            >
              Test 2G IVR Call 📞
            </button>
          </div>

          {/* 2. ASHA Worker Sister Contact */}
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl shadow-xs p-4 flex flex-col justify-between space-y-3 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-2xs">
                👩‍⚕️
              </div>
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">Sunita Sister</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">ASHA Worker • Mandya PHC</div>
                <div className="text-[10px] text-[#D97706] dark:text-[#E2A233] font-bold mt-0.5">Village Visit: Tomorrow</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToast?.('Calling ASHA Sister Sunita at Mandya PHC…', 'info')}
              className="w-full bg-[#E2A233] hover:bg-[#c88d28] text-slate-950 text-xs font-extrabold py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <PhoneIcon size={14} color="#0f172a" />
              <span>Call ASHA Worker</span>
            </button>
          </div>

          {/* 3. Emergency SOS 108 / 112 */}
          <div className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 text-white">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wide flex items-center gap-1">
                  <span>🚨</span>
                  <span>Emergency SOS</span>
                </span>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-md font-black">108 / 112</span>
              </div>
              <p className="text-[11px] text-rose-100 leading-relaxed mt-1 font-medium">
                Instant ambulance dispatch, live GPS hospital locator &amp; snakebite protocols.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView?.('emergency')}
              className="w-full bg-white hover:bg-rose-50 text-rose-700 text-xs font-black py-2 rounded-xl transition-all cursor-pointer text-center shadow-xs"
            >
              Open Emergency Care →
            </button>
          </div>

        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION 6 — ACCESSIBILITY CONTROLS (FOOTER)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 rounded-2xl p-4 transition-colors shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base">♿</span>
              <div>
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">Accessibility Controls</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">1-tap adjustments for elderly &amp; rural users</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Large Text */}
              <button
                type="button"
                onClick={toggleLargeText}
                className={`flex items-center gap-2 text-[11px] font-extrabold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                  largeText
                    ? 'bg-[#E2A233]/20 border-[#E2A233] text-[#8A5B00] dark:text-[#E2A233]'
                    : 'bg-stone-50 dark:bg-slate-800 border-stone-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#E2A233]'
                }`}
              >
                🔍 Large Text <span className="opacity-60">{largeText ? 'ON' : 'OFF'}</span>
              </button>

              {/* High Contrast */}
              <button
                type="button"
                onClick={toggleHighContrast}
                className={`flex items-center gap-2 text-[11px] font-extrabold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                  highContrast
                    ? 'bg-[#E2A233]/20 border-[#E2A233] text-[#8A5B00] dark:text-[#E2A233]'
                    : 'bg-stone-50 dark:bg-slate-800 border-stone-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#E2A233]'
                }`}
              >
                👁️ High Contrast <span className="opacity-60">{highContrast ? 'ON' : 'OFF'}</span>
              </button>

              {/* Voice Alerts */}
              <button
                type="button"
                onClick={toggleVoiceReminders}
                className={`flex items-center gap-2 text-[11px] font-extrabold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                  voiceReminders
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                    : 'bg-stone-50 dark:bg-slate-800 border-stone-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                }`}
              >
                🔊 Voice Alerts <span className="opacity-60">{voiceReminders ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
    <EmergencySOS showToast={showToast} onSosSent={(sosData) => {
      console.log('SOS triggered:', sosData);
    }} />
  </>
);
};

export default PatientHomePage;
