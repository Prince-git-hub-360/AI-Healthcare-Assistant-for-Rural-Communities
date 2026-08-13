import React, { useState, useEffect } from 'react';
import { useAuth, LANGUAGES } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';
import {
  DocumentIcon, TranslateIcon, SpeakerIcon, ClockIcon, PhoneIcon, PillIcon,
  UserIcon, SparklesIcon, ActivityIcon, ChevronDownIcon
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
      hi: `नमस्ते ${user?.first_name || 'मरीज'} जी! स्वास्थ संचार में आपका स्वागत है।`,
      kn: `ನಮಸ್ಕಾರ ${user?.first_name || 'ರೋಗಿ'} ಅವರೇ! ಸ್ವಾಸ್ಥ್ಯ ಸಂಚಾರ್‌ಗೆ ಸ್ವಾಗತ.`,
      en: `Good morning ${user?.first_name || 'Patient'}! Here is your health summary for today.`,
    }[currentLang || 'hi'] || `Namaste! Welcome to Swasthya Sanchar.`;

    await speakNativeAudio(greetingText, currentLang || 'hi');
    setPlayingGreeting(false);
  };

  const completedCount = reminders.filter(r => r.is_taken).length;
  const totalCount = reminders.length;
  const adherencePercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const nextDose = reminders.find(r => !r.is_taken) || reminders[0];

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#0B0F17] min-h-screen font-sans text-stone-900 dark:text-slate-100 pb-12 transition-colors duration-200">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-6 space-y-6">
        
        {/* 1. COMPACT WELCOME HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-slate-800/80 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white tracking-tight">
              Good morning, {user?.first_name || user?.username || 'Prince'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 font-normal">
              Here's your health summary for today.
            </p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl px-3.5 py-2 flex items-center gap-2.5 shrink-0 self-start sm:self-auto transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Today's health
              </div>
              <div className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
                {totalCount - completedCount > 0
                  ? `${totalCount - completedCount} action${totalCount - completedCount > 1 ? 's' : ''} remaining`
                  : '✓ All care completed'}
              </div>
            </div>
          </div>
        </div>

        {/* 2. PRIMARY TWO-COLUMN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (~65% Width): Today's Priority, Daily Progress, Health Snapshot */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* TODAY'S PRIORITY / NEXT ACTION CARD */}
            <div className="bg-white dark:bg-[#161F30] border border-stone-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800/80 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0B4F42] dark:text-teal-400">
                    TODAY'S PRIORITY
                  </span>
                  <h2 className="text-base font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                    <PillIcon size={18} className="text-[#0B4F42] dark:text-teal-400" />
                    <span>Next Medication Dose</span>
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentView?.('reminders')}
                  className="text-xs font-medium text-[#0B4F42] dark:text-teal-400 hover:underline cursor-pointer"
                >
                  View today's medication schedule →
                </button>
              </div>

              {nextDose ? (
                <div className="bg-teal-50/50 dark:bg-slate-800/80 border border-teal-100 dark:border-slate-700/80 rounded-xl p-4 space-y-3 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 px-2.5 py-0.5 rounded-md">
                      ⏰ {nextDose.scheduled_time}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      {nextDose.is_taken ? '✓ Completed' : '○ Pending'}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      {nextDose.medication_name}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-slate-300">
                      {nextDose.instructions}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => toggleReminderStatus(nextDose.id, nextDose.is_taken)}
                      className="bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-medium px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      {nextDose.is_taken ? '✓ Marked Taken' : 'Mark as Taken'}
                    </button>

                    <button
                      type="button"
                      onClick={playWelcomeAudio}
                      className="bg-white dark:bg-slate-800 hover:bg-stone-50 dark:hover:bg-slate-700 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <SpeakerIcon size={14} />
                      <span>Listen</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl p-4 text-xs text-stone-500 dark:text-slate-400 text-center">
                  No medicines scheduled for today.
                </div>
              )}

              {/* DAILY PROGRESS SECTION */}
              <div className="bg-stone-50/70 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 rounded-xl p-4 space-y-3 transition-colors">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800 dark:text-slate-200">
                  <span>Today's Progress</span>
                  <span className="text-[#0B4F42] dark:text-teal-400">{completedCount} of {totalCount} completed ({adherencePercent}%)</span>
                </div>

                <div className="w-full bg-stone-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#0B4F42] dark:bg-teal-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${adherencePercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-0.5">
                  <div className="bg-white dark:bg-slate-800/90 border border-stone-200/80 dark:border-slate-700/80 rounded-lg p-2">
                    <div className="text-[10px] text-stone-500 dark:text-slate-400 font-medium">Morning</div>
                    <div className="font-semibold text-stone-900 dark:text-white">
                      {reminders.filter(r => /08:00 AM|AM|Morning/i.test(r.scheduled_time)).filter(r => r.is_taken).length} / {reminders.filter(r => /08:00 AM|AM|Morning/i.test(r.scheduled_time)).length || 1}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800/90 border border-stone-200/80 dark:border-slate-700/80 rounded-lg p-2">
                    <div className="text-[10px] text-stone-500 dark:text-slate-400 font-medium">Afternoon</div>
                    <div className="font-semibold text-stone-900 dark:text-white">
                      {reminders.filter(r => /01:30 PM|Afternoon/i.test(r.scheduled_time)).filter(r => r.is_taken).length} / {reminders.filter(r => /01:30 PM|Afternoon/i.test(r.scheduled_time)).length || 1}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800/90 border border-stone-200/80 dark:border-slate-700/80 rounded-lg p-2">
                    <div className="text-[10px] text-stone-500 dark:text-slate-400 font-medium">Night</div>
                    <div className="font-semibold text-stone-900 dark:text-white">
                      {reminders.filter(r => /08:00 PM|PM|Night/i.test(r.scheduled_time)).filter(r => r.is_taken).length} / {reminders.filter(r => /08:00 PM|PM|Night/i.test(r.scheduled_time)).length || 1}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HEALTH SNAPSHOT (COMPACT 2x2 VITALS GRID) */}
            <div className="bg-white dark:bg-[#161F30] border border-stone-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800/80 pb-3">
                <div>
                  <h2 className="text-base font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                    <ActivityIcon size={18} className="text-[#0B4F42] dark:text-teal-400" />
                    <span>Health Snapshot</span>
                  </h2>
                  <p className="text-[11px] text-stone-500 dark:text-slate-400 font-normal mt-0.5">Recent readings • Updated 2 hours ago</p>
                </div>
                <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 px-2.5 py-0.5 rounded-md">
                  ● Normal
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50/80 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 rounded-xl p-3 space-y-1">
                  <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">Blood Pressure</div>
                  <div className="text-base font-bold text-stone-900 dark:text-white">120/80 <span className="text-xs font-normal text-stone-500 dark:text-slate-400">mmHg</span></div>
                  <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">● Normal</div>
                </div>

                <div className="bg-stone-50/80 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 rounded-xl p-3 space-y-1">
                  <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">Blood Sugar</div>
                  <div className="text-base font-bold text-stone-900 dark:text-white">110 <span className="text-xs font-normal text-stone-500 dark:text-slate-400">mg/dL</span></div>
                  <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">● Normal</div>
                </div>

                <div className="bg-stone-50/80 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 rounded-xl p-3 space-y-1">
                  <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">Oxygen (SpO₂)</div>
                  <div className="text-base font-bold text-stone-900 dark:text-white">98% <span className="text-xs font-normal text-stone-500 dark:text-slate-400">72 bpm</span></div>
                  <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">● Normal</div>
                </div>

                <div className="bg-stone-50/80 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 rounded-xl p-3 space-y-1">
                  <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">Body Temp</div>
                  <div className="text-base font-bold text-stone-900 dark:text-white">98.4 °F</div>
                  <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">● Normal</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (~35% Width): Care Team, Quick Services, 108 SOS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* YOUR CARE TEAM CARD */}
            <div className="bg-white dark:bg-[#161F30] border border-stone-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-3.5 transition-colors">
              <h2 className="text-base font-semibold text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-slate-800/80 pb-3">
                <UserIcon size={18} className="text-[#0B4F42] dark:text-teal-400" />
                <span>Your Care Team</span>
              </h2>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-50 dark:bg-teal-950/60 text-[#0B4F42] dark:text-teal-300 border border-teal-100 dark:border-teal-800/60 rounded-lg flex items-center justify-center font-bold text-base shrink-0">
                  👩‍⚕️
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-stone-900 dark:text-white truncate">Sunita Sister</div>
                  <div className="text-[11px] text-stone-500 dark:text-slate-400 truncate">ASHA Worker • Mandya PHC</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast?.('Calling ASHA Sister Sunita...', 'info')}
                className="w-full bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <PhoneIcon size={14} color="#ffffff" />
                <span>Call ASHA</span>
              </button>
            </div>

            {/* HEALTHCARE SERVICES GRID */}
            <div className="bg-white dark:bg-[#161F30] border border-stone-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-3.5 transition-colors">
              <h2 className="text-base font-semibold text-stone-900 dark:text-white border-b border-stone-100 dark:border-slate-800/80 pb-3">
                Healthcare Services
              </h2>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentView?.('translate')}
                  className="p-2.5 bg-stone-50 dark:bg-slate-800/80 hover:bg-teal-50/50 dark:hover:bg-slate-700/80 border border-stone-200/80 dark:border-slate-700/80 hover:border-[#0B4F42] dark:hover:border-teal-400 rounded-xl text-left transition-all cursor-pointer space-y-1"
                >
                  <div className="text-[#0B4F42] dark:text-teal-400"><TranslateIcon size={16} /></div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-white">Translate Rx</div>
                  <div className="text-[10px] text-stone-500 dark:text-slate-400 leading-tight">Prescriptions</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView?.('medical_vault')}
                  className="p-2.5 bg-stone-50 dark:bg-slate-800/80 hover:bg-teal-50/50 dark:hover:bg-slate-700/80 border border-stone-200/80 dark:border-slate-700/80 hover:border-[#0B4F42] dark:hover:border-teal-400 rounded-xl text-left transition-all cursor-pointer space-y-1"
                >
                  <div className="text-[#0B4F42] dark:text-teal-400"><DocumentIcon size={16} /></div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-white">Health Vault</div>
                  <div className="text-[10px] text-stone-500 dark:text-slate-400 leading-tight">Medical files</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView?.('reminders')}
                  className="p-2.5 bg-stone-50 dark:bg-slate-800/80 hover:bg-teal-50/50 dark:hover:bg-slate-700/80 border border-stone-200/80 dark:border-slate-700/80 hover:border-[#0B4F42] dark:hover:border-teal-400 rounded-xl text-left transition-all cursor-pointer space-y-1"
                >
                  <div className="text-[#0B4F42] dark:text-teal-400"><ClockIcon size={16} /></div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-white">Reminders</div>
                  <div className="text-[10px] text-stone-500 dark:text-slate-400 leading-tight">Medications</div>
                </button>

                <button
                  type="button"
                  onClick={onOpenChat}
                  className="p-2.5 bg-stone-50 dark:bg-slate-800/80 hover:bg-teal-50/50 dark:hover:bg-slate-700/80 border border-stone-200/80 dark:border-slate-700/80 hover:border-[#0B4F42] dark:hover:border-teal-400 rounded-xl text-left transition-all cursor-pointer space-y-1"
                >
                  <div className="text-[#0B4F42] dark:text-teal-400"><SparklesIcon size={16} /></div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-white">Ask AI</div>
                  <div className="text-[10px] text-stone-500 dark:text-slate-400 leading-tight">Assistance</div>
                </button>
              </div>
            </div>

            {/* 108 EMERGENCY SOS CARD */}
            <div className="bg-red-50/60 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 rounded-2xl p-4 space-y-2 text-red-950 dark:text-red-200 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>108 Emergency</span>
                <span className="text-[10px] bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-md font-bold">SOS</span>
              </div>
              <p className="text-xs text-red-900/80 dark:text-red-300 leading-snug">
                Need urgent medical help or ambulance?
              </p>
              <button
                type="button"
                onClick={() => setCurrentView?.('emergency')}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors cursor-pointer text-center"
              >
                Call 108
              </button>
            </div>

          </div>
        </div>

        {/* 3. RURAL CARE SUPPORT STRIP */}
        <div className="bg-white dark:bg-[#161F30] border border-stone-200/80 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs transition-colors">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
              <span>🌾 Rural Care Support</span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md font-medium border border-amber-200 dark:border-amber-800/80">2G IVR Voice</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Need help without a smartphone? Voice assistance and 2G phone support are available.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView?.('reminders')}
            className="border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Test 2G Voice Alert
          </button>
        </div>

      </div>
    </div>
  );
};

export default PatientHomePage;
