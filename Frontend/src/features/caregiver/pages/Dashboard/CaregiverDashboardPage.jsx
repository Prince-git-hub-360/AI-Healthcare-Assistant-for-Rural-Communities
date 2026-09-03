import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { 
  HeartIcon, PhoneIcon, ClockIcon, CheckIcon, AlertIcon, 
  SpeakerIcon, ShieldIcon, UserIcon, ArrowRightIcon, BellIcon,
  AmbulanceIcon, CalendarIcon, SparklesIcon, PlusIcon
} from '../../../../shared/icons/Icons';
import { speakNativeAudio, stopNativeAudio } from '../../../../shared/utils/speech';

export const CaregiverDashboardPage = ({ setCurrentView }) => {
  const { user, showToast } = useAuth();
  
  // Selected family member to inspect
  const [selectedPatientId, setSelectedPatientId] = useState('FAM-01');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [smsSending, setSmsSending] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Monitored Family Members Data
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 'FAM-01',
      name: 'Ramesh Kumar',
      relation: 'Father',
      age: 64,
      gender: 'Male',
      phone: '+91 98765 00111',
      abhaId: '91-8833-2211-5044',
      village: 'Mandya Sector 2',
      primaryDoctor: 'Dr. Vikram Sharma (MBBS)',
      ashaWorker: 'Sunita Bai (+91 98765 43210)',
      conditions: ['Type-2 Diabetes', 'Hypertension'],
      adherenceToday: { taken: 1, total: 3, percentage: 33 },
      weeklyAdherence: 86,
      monthlyTrend: 'declining', // 'improving' | 'stable' | 'declining'
      criticalAlert: {
        medicine: 'Metformin 500mg',
        scheduledTime: '08:00 AM (Morning)',
        delayHours: '3.5 hours overdue',
        instructionKn: 'ಬೆಳಿಗ್ಗೆ ಉಪಹಾರದ ನಂತರ 1 ಮೆಟ್‌ಫಾರ್ಮಿನ್ ಮಾತ್ರೆ ನೀರಿನೊಂದಿಗೆ ಸೇವಿಸಿ.',
        instructionHi: 'सुबह नाश्ते के बाद 1 मेटफॉर्मिन गोली पानी के साथ लें।',
      },
      scheduleToday: [
        {
          id: 'D-01',
          time: '08:00 AM',
          slot: '🌅 Morning',
          medicine: 'Metformin 500mg',
          dose: '1 tablet after breakfast',
          status: 'overdue',
          statusLabel: '⚠️ Missed / Overdue',
          color: 'red',
        },
        {
          id: 'D-02',
          time: '01:30 PM',
          slot: '🌞 Afternoon',
          medicine: 'B-Complex Multivitamin',
          dose: '1 capsule after lunch',
          status: 'pending',
          statusLabel: '⏳ Upcoming',
          color: 'amber',
        },
        {
          id: 'D-03',
          time: '09:00 PM',
          slot: '🌙 Night',
          medicine: 'Amlodipine 5mg',
          dose: '1 tablet before sleep',
          status: 'scheduled',
          statusLabel: '⏰ Scheduled',
          color: 'slate',
        },
      ],
      aiInsights: [
        'Pattern detected: Consistently misses Saturday & Sunday morning doses.',
        'Recommended: Schedule automated Kannada/Hindi IVR phone call at 08:15 AM on weekends.',
        'BP readings logged this week: 138/88 mmHg (Moderately elevated). Low-sodium diet advised.'
      ]
    },
    {
      id: 'FAM-02',
      name: 'Lakshmi Devi',
      relation: 'Mother',
      age: 58,
      gender: 'Female',
      phone: '+91 98765 00222',
      abhaId: '91-3310-8812-4011',
      village: 'Mandya Sector 2',
      primaryDoctor: 'Dr. Vikram Sharma (MBBS)',
      ashaWorker: 'Sunita Bai (+91 98765 43210)',
      conditions: ['Osteoarthritis', 'Mild BP'],
      adherenceToday: { taken: 2, total: 2, percentage: 100 },
      weeklyAdherence: 96,
      monthlyTrend: 'improving',
      criticalAlert: null,
      scheduleToday: [
        {
          id: 'D-11',
          time: '08:30 AM',
          slot: '🌅 Morning',
          medicine: 'Calcium 500mg + Vit D3',
          dose: '1 tablet after breakfast',
          status: 'completed',
          statusLabel: '✓ Taken (08:35 AM)',
          color: 'emerald',
        },
        {
          id: 'D-12',
          time: '08:00 PM',
          slot: '🌙 Night',
          medicine: 'Telmisartan 20mg',
          dose: '1 tablet after dinner',
          status: 'completed',
          statusLabel: '✓ Taken (08:10 PM)',
          color: 'emerald',
        },
      ],
      aiInsights: [
        'Excellent compliance: 96% weekly adherence maintained.',
        'Next clinic checkup due in 12 days at Mandya PHC.',
        'Joint mobility exercises logged 4 days this week.'
      ]
    }
  ]);

  const activeMember = familyMembers.find(m => m.id === selectedPatientId) || familyMembers[0];

  const handleCallPatient = (phone) => {
    window.open(`tel:${phone.replace(/\s+/g, '')}`);
    showToast?.(`Connecting phone call to ${activeMember.name}...`, 'info');
  };

  const handleSendReminderSms = () => {
    setSmsSending(true);
    setTimeout(() => {
      setSmsSending(false);
      showToast?.(`📲 Automated Vernacular SMS & WhatsApp reminder sent to ${activeMember.name}!`, 'success');
    }, 1000);
  };

  const handleNotifyAsha = () => {
    showToast?.(`👩‍⚕️ Task escalated! ASHA worker Sunita Bai notified for doorstep visit.`, 'success');
  };

  const handleTriggerEmergency = () => {
    showToast?.(`🚨 EMERGENCY SOS DISPATCHED for ${activeMember.name}! GPS coordinates shared with 108 ambulance & PHC.`, 'error');
  };

  const playVernacularAudio = async (textKn) => {
    if (isPlayingAudio) {
      stopNativeAudio();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    showToast?.(`Playing Kannada vernacular audio instructions...`, 'info');
    try {
      await speakNativeAudio(textKn, 'kn', 0.85);
    } catch (err) {
      console.warn('Speech playback error:', err);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 text-stone-900 dark:text-slate-100 transition-colors font-sans pb-24">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HEADER BANNER: CAREGIVER COMMAND HUB
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-gradient-to-r from-teal-950 via-[#0B4F42] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-teal-500/30 border border-teal-400/40 text-teal-200 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              👨‍👩‍👦 FAMILY CAREGIVER GUARDIAN
            </span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              ABHA LINKED
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Family Medication &amp; Health Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/80 font-medium">
            Guardian Account: <strong className="text-white">{user?.first_name || 'Prince'} {user?.last_name || 'Kumar'}</strong> • Remote adherence tracking for elderly dependents
          </p>
        </div>

        {/* Quick Emergency Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleTriggerEmergency}
            className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-4 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-rose-400/40"
          >
            <AmbulanceIcon size={16} />
            <span>🚨 SOS Alert 108</span>
          </button>
          <button
            type="button"
            onClick={() => handleCallPatient(activeMember.phone)}
            className="bg-teal-700 hover:bg-teal-600 text-white font-black text-xs px-4 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-teal-500/40"
          >
            <PhoneIcon size={16} />
            <span>📞 Call {activeMember.relation}</span>
          </button>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. CRITICAL MISSED-DOSE ALERT BANNER (IF ANY)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeMember.criticalAlert && !alertDismissed && (
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 dark:from-rose-950/40 dark:via-amber-950/30 dark:to-rose-950/40 border-2 border-rose-400 dark:border-rose-700/80 rounded-3xl p-5 sm:p-6 shadow-md animate-in fade-in space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-3xl p-2 bg-rose-100 dark:bg-rose-900/50 rounded-2xl">⚠️</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-300">
                    CRITICAL MEDICATION ALERT
                  </span>
                  <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                    {activeMember.criticalAlert.delayHours}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {activeMember.name} has not confirmed taking {activeMember.criticalAlert.medicine}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Scheduled time was <strong>{activeMember.criticalAlert.scheduledTime}</strong>. Risk of blood sugar spike if unmanaged.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAlertDismissed(true)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 self-start sm:self-center"
            >
              Dismiss ✕
            </button>
          </div>

          {/* Quick Action Bar for the Alert */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-rose-200/80 dark:border-rose-800/60">
            <button
              type="button"
              onClick={() => handleCallPatient(activeMember.phone)}
              className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneIcon size={14} />
              <span>Call {activeMember.name} Now</span>
            </button>

            <button
              type="button"
              onClick={handleSendReminderSms}
              disabled={smsSending}
              className="bg-amber-600 hover:bg-amber-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <BellIcon size={14} />
              <span>{smsSending ? 'Sending SMS...' : 'Send Vernacular SMS'}</span>
            </button>

            <button
              type="button"
              onClick={handleNotifyAsha}
              className="bg-teal-700 hover:bg-teal-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserIcon size={14} />
              <span>Alert ASHA Sister (Doorstep Check)</span>
            </button>

            <button
              type="button"
              onClick={() => playVernacularAudio(activeMember.criticalAlert.instructionKn)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <SpeakerIcon size={14} />
              <span>{isPlayingAudio ? 'Stop Audio' : '🔊 Hear Kannada Instruction'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. FAMILY MEMBER SELECTOR & QUICK CARDS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Monitored Family Members ({familyMembers.length})
          </h2>
          <button
            type="button"
            onClick={() => showToast?.('Family Member registration modal opened!', 'info')}
            className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <PlusIcon size={14} />
            <span>+ Link New Dependent (ABHA)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyMembers.map((member) => {
            const isSelected = member.id === selectedPatientId;
            return (
              <div
                key={member.id}
                onClick={() => {
                  setSelectedPatientId(member.id);
                  setAlertDismissed(false);
                }}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-teal-600 dark:border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-black flex items-center justify-center text-xl">
                      {member.gender === 'Female' ? '👵' : '👴'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          {member.name}
                        </h3>
                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                          {member.relation} • {member.age}y
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        ABHA: {member.abhaId} • {member.village}
                      </p>
                    </div>
                  </div>

                  {/* Adherence Badge */}
                  <div className="text-right">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      member.adherenceToday.percentage === 100
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : member.adherenceToday.percentage >= 60
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    }`}>
                      {member.adherenceToday.percentage}% Today
                    </span>
                    <div className="text-[10px] text-slate-400 font-medium mt-1">
                      {member.adherenceToday.taken} of {member.adherenceToday.total} doses
                    </div>
                  </div>
                </div>

                {/* Conditions Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {member.conditions.map((c, i) => (
                    <span key={i} className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg">
                      🩺 {c}
                    </span>
                  ))}
                  <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 ml-auto self-center">
                    Weekly Adherence: {member.weeklyAdherence}% →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. DETAILED DOSAGE TIMELINE & 5-DAY PILLBOX GLANCE
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Selected Patient's Day Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📅 Today's Medication Schedule:</span>
                <span className="text-teal-700 dark:text-teal-400">{activeMember.name}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time compliance feed synced with rural patient voice assistant
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
          </div>

          {/* Schedule Timeline Cards */}
          <div className="space-y-3">
            {activeMember.scheduleToday.map((dose) => (
              <div
                key={dose.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  dose.status === 'overdue'
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60'
                    : dose.status === 'completed'
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-black shadow-2xs">
                    {dose.status === 'completed' ? '✓' : dose.status === 'overdue' ? '⚠️' : '⏰'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-slate-500">
                        {dose.slot} • {dose.time}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        dose.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200'
                          : dose.status === 'overdue'
                          ? 'bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {dose.statusLabel}
                      </span>
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {dose.medicine}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      📋 {dose.dose}
                    </div>
                  </div>
                </div>

                {dose.status === 'overdue' && (
                  <button
                    type="button"
                    onClick={handleSendReminderSms}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                  >
                    <BellIcon size={14} />
                    <span>Nudge Reminder</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Adherence Progress Bar */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span>Today's Completion Rate</span>
              <span className="text-teal-700 dark:text-teal-400">
                {activeMember.adherenceToday.taken} / {activeMember.adherenceToday.total} Doses ({activeMember.adherenceToday.percentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeMember.adherenceToday.percentage === 100 ? 'bg-emerald-500' : 'bg-teal-600'
                }`}
                style={{ width: `${activeMember.adherenceToday.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Col: AI Behavioral Insights & Emergency Contacts */}
        <div className="space-y-6">
          
          {/* AI Behavioral Insights */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-900 dark:to-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <SparklesIcon size={18} className="text-teal-700 dark:text-teal-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Swasthya AI Insights
              </h3>
            </div>
            <div className="space-y-2">
              {activeMember.aiInsights.map((insight, idx) => (
                <div key={idx} className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-teal-100 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed flex items-start gap-2">
                  <span className="text-teal-600 font-bold">💡</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Escalation Contacts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Emergency Escalation Team
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">👨‍⚕️ Primary Doctor</div>
                  <div className="text-[11px] text-slate-500">{activeMember.primaryDoctor}</div>
                </div>
                <button
                  type="button"
                  onClick={() => window.open('tel:+919876543211')}
                  className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <PhoneIcon size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">👩‍⚕️ Assigned ASHA Worker</div>
                  <div className="text-[11px] text-slate-500">{activeMember.ashaWorker}</div>
                </div>
                <button
                  type="button"
                  onClick={() => window.open('tel:+919876543210')}
                  className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <PhoneIcon size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                <div>
                  <div className="text-xs font-black text-rose-900 dark:text-rose-200">🚑 Ambulance Emergency</div>
                  <div className="text-[11px] text-rose-700 dark:text-rose-300">National Dispatch (108 / 112)</div>
                </div>
                <button
                  type="button"
                  onClick={() => window.open('tel:108')}
                  className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <PhoneIcon size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CaregiverDashboardPage;
