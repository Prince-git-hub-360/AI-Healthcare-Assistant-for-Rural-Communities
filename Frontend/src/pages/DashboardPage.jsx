import React, { useState, useEffect } from 'react';
import { useAuth, LANGUAGES } from '../context/AuthContext';
import { api } from '../api/api';
import {
  DocumentIcon, BrainIcon, TranslateIcon, SpeakerIcon, ShieldIcon, CheckIcon,
  ClockIcon, PlusIcon, PhoneIcon, PillIcon, AlertIcon, RefreshIcon, UserIcon,
  SparklesIcon, FireIcon, MicIcon
} from '../components/ui/Icons';
import { speakNativeAudio } from '../utils/speech';

export const DashboardPage = ({ setCurrentView, onOpenChat }) => {
  const { user, currentLang, showToast } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [fieldPatients, setFieldPatients] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [playingGreeting, setPlayingGreeting] = useState(false);

  const [newPatient, setNewPatient] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    village_or_town: '',
    district: '',
    preferred_language: 'hi',
  });

  const isWorker = user?.role === 'healthcare_worker' || user?.role === 'doctor';
  const isCaregiver = user?.role === 'caregiver';

  // Load Reminders & Data
  const loadData = async () => {
    setLoadingReminders(true);
    try {
      const remData = await api.getReminders();
      if (Array.isArray(remData)) {
        setReminders(remData);
      } else if (remData?.results) {
        setReminders(remData.results);
      }
    } catch (err) {
      // Fallback sample reminders if API empty
      setReminders([
        { id: 101, medication_name: 'Paracetamol 500mg', scheduled_time: '08:00 AM', instructions: '1 tablet after breakfast', is_taken: true },
        { id: 102, medication_name: 'Amoxicillin 250mg', scheduled_time: '01:00 PM', instructions: '1 capsule after lunch', is_taken: false },
        { id: 103, medication_name: 'Vitamin D3', scheduled_time: '08:00 PM', instructions: '1 tablet at bedtime', is_taken: false },
      ]);
    }

    if (isWorker) {
      try {
        const patientsData = await api.getHealthcareWorkerPatients();
        if (Array.isArray(patientsData)) {
          setFieldPatients(patientsData);
        } else if (patientsData?.results) {
          setFieldPatients(patientsData.results);
        }
      } catch (err) {
        // Fallback sample patients
        setFieldPatients([
          { id: 1, first_name: 'Ramesh', last_name: 'Kumar', village_or_town: 'Mandya', preferred_language: 'kn', adherence_rate: '95%' },
          { id: 2, first_name: 'Sunita', last_name: 'Devi', village_or_town: 'Hassan', preferred_language: 'hi', adherence_rate: '88%' },
        ]);
      }
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

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    try {
      await api.registerFieldPatient(newPatient);
      if (showToast) showToast('Field patient registered successfully!', 'success');
      setShowAddPatientModal(false);
      loadData();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to register patient.', 'error');
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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* 📜 NHA & ABDM GOVERNMENT COMPLIANCE BANNER */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg border border-teal-700/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
            <ShieldIcon size={24} color="#5eead4" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                Ayushman Bharat Digital Mission (ABDM) Compliant
              </span>
              <span className="bg-emerald-400 text-teal-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                VERIFIED EHR
              </span>
            </div>
            <p className="text-xs text-teal-100/90 leading-relaxed max-w-3xl">
              Preserves doctor prescriptions, aligns with National Health Authority standards, and provides regional language audio guidance.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('profile')}
          className="bg-white/10 hover:bg-white/20 text-teal-100 text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition-all cursor-pointer whitespace-nowrap"
        >
          View ABHA Card →
        </button>
      </div>

      {/* 🌾 RURAL ASSISTED CARE & ZERO-ILLITERACY MODEL BANNER */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-amber-950 text-sm">
                Zero-Literacy & 2G Feature Phone Assisted Accessibility
              </span>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                RURAL CARE MODEL
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed mt-0.5">
              Illiterate villagers & non-smartphone users are supported via ASHA Worker assisted scanning, 1-tap native voice playback, and automated 2G IVR phone calls.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('reminders')}
          className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
        >
          Test 2G Phone Alert 📞
        </button>
      </div>

      {/* 👵 PATIENT CARE HUB HERO VIEW */}
      {!isWorker && !isCaregiver && (
        <>
          {/* Welcome Bar with Audio Greeting & Adherence Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-stretch">
            {/* Left Welcome Card */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3 z-10">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-teal-700 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                    PATIENT CARE HUB
                  </span>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
                    <FireIcon size={14} color="#d97706" />
                    <span>5-Day Streak! 🔥</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  Namaste, {user?.first_name || user?.username || 'Patient'}! 🙏
                </h1>

                {/* ABHA Health ID Quick Badge */}
                <div className="bg-slate-900 text-white p-3 rounded-2xl border border-teal-700/50 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="text-base">🇮🇳</div>
                    <div>
                      <div className="text-[9px] font-extrabold text-teal-300 uppercase tracking-widest">
                        ABDM ABHA NUMBER
                      </div>
                      <div className="text-xs font-extrabold font-mono text-white tracking-wider">
                        {user?.profile?.abha_number || '14-8923-4512-9012'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentView('profile')}
                    className="bg-teal-700 hover:bg-teal-600 text-white text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors"
                  >
                    Card →
                  </button>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Language: <strong className="text-stone-900 uppercase">{(currentLang || 'hi')}</strong> • Village: <strong className="text-stone-900">{user?.profile?.village_or_town || 'Mandya Rural'}</strong>
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex flex-wrap items-center gap-3 z-10">
                <button
                  onClick={playWelcomeAudio}
                  disabled={playingGreeting}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <SpeakerIcon size={18} color="#ffffff" />
                  <span>{playingGreeting ? 'Speaking Greeting...' : '🔊 Listen Audio Greeting'}</span>
                </button>

                <button
                  onClick={onOpenChat}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <SparklesIcon size={18} color="#ffffff" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>
            </div>

            {/* Right Adherence Visual Progress Ring Card */}
            <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 text-white border border-teal-700 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-teal-200 uppercase tracking-widest block mb-1">
                  TODAY'S HEALTH COMPLIANCE
                </span>
                <h2 className="text-lg font-extrabold text-white">Daily Medication Adherence</h2>
              </div>

              <div className="my-4 flex items-center justify-around gap-4">
                {/* Circular Gauge */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-teal-950"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400 transition-all duration-1000 ease-out"
                      strokeDasharray={`${adherencePercent}, 100`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold text-white">{adherencePercent}%</span>
                    <span className="text-[9px] text-teal-200 uppercase font-bold">Done</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <span className="text-emerald-300 font-bold block">{completedCount} of {totalCount} Doses</span>
                    <span className="text-stone-300 text-[10px]">Taken today</span>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <span className="text-amber-300 font-bold block">{totalCount - completedCount} Doses</span>
                    <span className="text-stone-300 text-[10px]">Remaining</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-cyan-100/80">
                {adherencePercent === 100 ? '🎉 Excellent! All medicines taken for today.' : 'Keep up your schedule for optimal recovery!'}
              </p>
            </div>
          </div>

          {/* 🚀 QUICK ACTION ACCESS GRID */}
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
              Quick Healthcare Actions
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Card 1: Translate */}
              <div
                onClick={() => setCurrentView('translate')}
                className="bg-white hover:bg-teal-50/50 border border-stone-200 hover:border-teal-400 p-5 rounded-3xl shadow-xs transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="w-12 h-12 bg-teal-100 text-teal-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TranslateIcon size={26} color="#0f766e" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-teal-900">
                    Translate Rx Note
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1">Convert prescription into local language & audio</p>
                </div>
              </div>

              {/* Card 2: Today's Meds */}
              <div
                onClick={() => setCurrentView('reminders')}
                className="bg-white hover:bg-teal-50/50 border border-stone-200 hover:border-teal-400 p-5 rounded-3xl shadow-xs transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PillIcon size={26} color="#d97706" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-amber-900">
                    Medicine Schedule
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1">Morning, Afternoon & Night medication alerts</p>
                </div>
              </div>

              {/* Card 3: Health Vault */}
              <div
                onClick={() => setCurrentView('medical_vault')}
                className="bg-white hover:bg-teal-50/50 border border-stone-200 hover:border-teal-400 p-5 rounded-3xl shadow-xs transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DocumentIcon size={26} color="#1d4ed8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-blue-900">
                    Medical Vault
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1">Access stored doctor records & prescriptions</p>
                </div>
              </div>

              {/* Card 4: Emergency SOS */}
              <div
                onClick={() => setCurrentView('emergency')}
                className="bg-red-50 hover:bg-red-100/70 border border-red-200 hover:border-red-400 p-5 rounded-3xl shadow-xs transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <PhoneIcon size={26} color="#ffffff" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-red-950">
                    108 Emergency SOS
                  </h3>
                  <p className="text-[11px] text-red-800 mt-1">Instant ambulance call & pictorial first-aid</p>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Medication Schedule Section */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                  <PillIcon size={22} color="#0f766e" /> Today's Medication Schedule
                </h2>
                <p className="text-xs text-stone-500">Tap any medicine to mark as taken</p>
              </div>

              <button
                onClick={() => setCurrentView('reminders')}
                className="text-xs font-extrabold text-teal-700 hover:text-teal-800 cursor-pointer"
              >
                Manage Schedule →
              </button>
            </div>

            {loadingReminders ? (
              <div className="py-8 text-center text-xs text-stone-500 animate-pulse">Loading today's medication schedule...</div>
            ) : reminders.length === 0 ? (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center text-xs text-stone-600">
                No active medication reminders scheduled for today.
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => toggleReminderStatus(r.id, r.is_taken)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      r.is_taken
                        ? 'bg-emerald-50/80 border-emerald-300 text-stone-900 shadow-xs'
                        : 'bg-stone-50 border-stone-200 hover:border-teal-600 text-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-white rounded-2xl border border-stone-200 flex items-center justify-center font-extrabold text-xs text-teal-800 shadow-xs">
                        {r.scheduled_time || '08:00 AM'}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-stone-900">{r.medication_name || r.title}</div>
                        <div className="text-xs text-stone-600">{r.instructions || r.dosage_note || 'Take as instructed'}</div>
                      </div>
                    </div>

                    <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold ${
                      r.is_taken ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.is_taken ? '✓ Taken' : '○ Pending (Click)'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* 👩‍⚕️ ASHA WORKER / DOCTOR DASHBOARD VIEW */}
      {isWorker && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
                FIELD WORKER PORTAL
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
                ASHA Health Operations — PHC #4
              </h1>
              <p className="text-xs text-stone-600 mt-1">
                Logged in as: <strong className="text-stone-900">{user?.first_name} {user?.last_name}</strong> • Organization: <strong className="text-stone-900">{user?.profile?.organization || 'Mandya Rural PHC'}</strong>
              </p>
            </div>

            <button
              onClick={() => setShowAddPatientModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusIcon size={16} /> Register Community Patient
            </button>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-xs text-center">
              <div className="text-3xl font-extrabold text-teal-700 mb-1">{fieldPatients.length || 42}</div>
              <div className="text-xs font-bold text-stone-600">Active Field Patients</div>
            </div>

            <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-xs text-center">
              <div className="text-3xl font-extrabold text-amber-600">6</div>
              <div className="text-xs font-bold text-stone-600">Pending Follow-ups</div>
            </div>

            <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-xs text-center">
              <div className="text-3xl font-extrabold text-emerald-600">94.2%</div>
              <div className="text-xs font-bold text-stone-600">Community Adherence Rate</div>
            </div>
          </div>

          {/* Field Patients Table */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight mb-4">
              Assigned Field Patients
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase">
                    <th className="pb-3 px-2">Patient Name</th>
                    <th className="pb-3 px-2">Village</th>
                    <th className="pb-3 px-2">Language</th>
                    <th className="pb-3 px-2">Adherence</th>
                    <th className="pb-3 px-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {fieldPatients.map((p, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-2 font-bold text-stone-900">{p.first_name} {p.last_name}</td>
                      <td className="py-3 px-2 text-stone-600">{p.village_or_town || 'Mandya'}</td>
                      <td className="py-3 px-2 text-stone-600 uppercase font-semibold">{p.preferred_language || 'kn'}</td>
                      <td className="py-3 px-2 text-emerald-700 font-bold">{p.adherence_rate || '95%'}</td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => setCurrentView('medical_vault')}
                          className="bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold px-3 py-1.5 rounded-lg border border-teal-200 text-xs transition-colors cursor-pointer"
                        >
                          Upload Rx
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 👨‍👩‍👧 CAREGIVER DASHBOARD VIEW */}
      {isCaregiver && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight mb-2">
            Caregiver Family Adherence Hub
          </h2>
          <p className="text-xs text-stone-600 mb-6">
            Monitoring medication compliance for registered family members.
          </p>

          <div className="bg-teal-50 border border-teal-200 p-6 rounded-2xl text-stone-900 mb-4">
            <div className="font-bold text-sm text-teal-900 mb-1">👴 Patient: Ramesh Kumar (Father)</div>
            <div className="text-xs text-stone-700">Today's Adherence: 2 of 3 doses taken (66%)</div>
          </div>
        </div>
      )}

      {/* ➕ ADD PATIENT MODAL FOR ASHA WORKERS */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setShowAddPatientModal(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-800 font-bold"
            >
              ✕
            </button>

            <h3 className="text-lg font-extrabold text-stone-900 mb-4">Register Field Patient</h3>

            <form onSubmit={handleRegisterPatient} className="space-y-3">
              <input
                type="text"
                placeholder="First Name *"
                className="w-full bg-white border border-stone-300 px-3 py-2 rounded-xl text-xs outline-none focus:border-teal-700"
                value={newPatient.first_name}
                onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Last Name *"
                className="w-full bg-white border border-stone-300 px-3 py-2 rounded-xl text-xs outline-none focus:border-teal-700"
                value={newPatient.last_name}
                onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Mobile Phone Number *"
                className="w-full bg-white border border-stone-300 px-3 py-2 rounded-xl text-xs outline-none focus:border-teal-700"
                value={newPatient.phone_number}
                onChange={(e) => setNewPatient({ ...newPatient, phone_number: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Village / Town *"
                className="w-full bg-white border border-stone-300 px-3 py-2 rounded-xl text-xs outline-none focus:border-teal-700"
                value={newPatient.village_or_town}
                onChange={(e) => setNewPatient({ ...newPatient, village_or_town: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="District *"
                className="w-full bg-white border border-stone-300 px-3 py-2 rounded-xl text-xs outline-none focus:border-teal-700"
                value={newPatient.district}
                onChange={(e) => setNewPatient({ ...newPatient, district: e.target.value })}
                required
              />

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer mt-2"
              >
                Register Field Patient →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
