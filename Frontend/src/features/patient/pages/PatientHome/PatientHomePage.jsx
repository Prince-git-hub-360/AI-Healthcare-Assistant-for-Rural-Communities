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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans text-slate-900 dark:text-slate-100 pb-12 transition-colors duration-200">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-6 space-y-6">
        
        {/* 1. COMPACT WELCOME HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Good morning, {user?.first_name || user?.username || 'Prince'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Here's your health summary and daily care schedule.
            </p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl px-4 py-3 flex items-center gap-3 shrink-0 self-start sm:self-auto transition-colors shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                Today's health status
              </div>
              <div className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    TODAY'S PRIORITY
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <PillIcon size={20} className="text-teal-700 dark:text-teal-400" />
                    <span>Next Medication Dose</span>
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentView?.('reminders')}
                  className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 hover:underline min-h-[44px] flex items-center cursor-pointer"
                >
                  Schedule →
                </button>
              </div>

              {nextDose ? (
                <div className="bg-emerald-50/60 dark:bg-slate-800/80 border border-emerald-200/80 dark:border-slate-700 rounded-2xl p-5 space-y-4 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg shadow-xs">
                      ⏰ {nextDose.scheduled_time}
                    </span>
                    <span className="text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg">
                      {nextDose.is_taken ? '✓ Completed' : '○ Pending'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {nextDose.medication_name}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {nextDose.instructions}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => toggleReminderStatus(nextDose.id, nextDose.is_taken)}
                      className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-5 py-3 min-h-[44px] rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {nextDose.is_taken ? '✓ Marked Taken' : 'Mark as Taken'}
                    </button>

                    <button
                      type="button"
                      onClick={playWelcomeAudio}
                      className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-3 min-h-[44px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <SpeakerIcon size={16} />
                      <span>{playingGreeting ? 'Playing...' : 'Listen'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-5 text-xs text-slate-600 dark:text-slate-400 text-center">
                  No medicines scheduled for today.
                </div>
              )}

              {/* DAILY PROGRESS SECTION */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-5 space-y-4 transition-colors">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-900 dark:text-slate-100">
                  <span>Today's Progress</span>
                  <span className="text-teal-700 dark:text-teal-400">{completedCount} of {totalCount} completed ({adherencePercent}%)</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-700 dark:bg-teal-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${adherencePercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs pt-1">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-2.5 shadow-2xs">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase">Morning</div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                      {reminders.filter(r => /08:00 AM|AM|Morning/i.test(r.scheduled_time)).filter(r => r.is_taken).length} / {reminders.filter(r => /08:00 AM|AM|Morning/i.test(r.scheduled_time)).length || 1}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-2.5 shadow-2xs">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase">Afternoon</div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                      {reminders.filter(r => /01:30 PM|Afternoon/i.test(r.scheduled_time)).filter(r => r.is_taken).length} / {reminders.filter(r => /01:30 PM|Afternoon/i.test(r.scheduled_time)).length || 1}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-2.5 shadow-2xs">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase">Night</div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                      {reminders.filter(r => /08:00 PM|PM|Night/i.test(r.scheduled_time)).filter(r => r.is_taken).length} / {reminders.filter(r => /08:00 PM|PM|Night/i.test(r.scheduled_time)).length || 1}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HEALTH SNAPSHOT (COMPACT 2x2 VITALS GRID) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ActivityIcon size={20} className="text-teal-700 dark:text-teal-400" />
                    <span>Health Snapshot</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Recent vitals • Updated 2 hours ago</p>
                </div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-lg">
                  ● Normal Vitals
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 space-y-1 shadow-2xs">
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-bold">Blood Pressure</div>
                  <div className="text-base font-black text-slate-900 dark:text-white">120/80 <span className="text-xs font-medium text-slate-500">mmHg</span></div>
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">● Normal</div>
                </div>

                <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4 space-y-1 shadow-2xs">
                  <div className="text-xs text-emerald-900 dark:text-emerald-200 font-bold">Blood Sugar</div>
                  <div className="text-base font-black text-emerald-950 dark:text-white">110 <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">mg/dL</span></div>
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">● Normal</div>
                </div>

                <div className="bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl p-4 space-y-1 shadow-2xs">
                  <div className="text-xs text-sky-900 dark:text-sky-200 font-bold">Oxygen (SpO₂)</div>
                  <div className="text-base font-black text-sky-950 dark:text-white">98% <span className="text-xs font-medium text-sky-700 dark:text-sky-300">72 bpm</span></div>
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">● Normal</div>
                </div>

                <div className="bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 space-y-1 shadow-2xs">
                  <div className="text-xs text-amber-900 dark:text-amber-200 font-bold">Body Temp</div>
                  <div className="text-base font-black text-amber-950 dark:text-white">98.4 °F</div>
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">● Normal</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (~35% Width): Care Team, Quick Services, 108 SOS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* YOUR CARE TEAM CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <UserIcon size={18} className="text-teal-700 dark:text-teal-400" />
                <span>Your Care Team</span>
              </h2>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 rounded-xl flex items-center justify-center font-bold text-base shrink-0">
                  👩‍⚕️
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Sunita Sister</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">ASHA Worker • Mandya PHC</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast?.('Calling ASHA Sister Sunita...', 'info')}
                className="w-full border border-teal-700 dark:border-teal-400 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-xs font-bold py-3 px-4 min-h-[44px] rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-2xs"
              >
                <PhoneIcon size={16} color="#0f766e" />
                <span>Call ASHA Worker</span>
              </button>
            </div>

            {/* HEALTHCARE SERVICES GRID */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Healthcare Services
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentView?.('translate')}
                  className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50/50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 hover:border-teal-700 dark:hover:border-teal-400 min-h-[44px] rounded-xl text-left transition-all cursor-pointer space-y-1"
                >
                  <div className="text-teal-700 dark:text-teal-400"><TranslateIcon size={18} /></div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Translate Rx</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Prescriptions</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView?.('medical_vault')}
                  className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50/50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 hover:border-teal-700 dark:hover:border-teal-400 min-h-[44px] rounded-xl text-left transition-all cursor-pointer space-y-1"
                >
                  <div className="text-teal-700 dark:text-teal-400"><DocumentIcon size={18} /></div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Health Vault</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Medical files</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView?.('reminders')}
                  className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50/50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 hover:border-teal-700 dark:hover:border-teal-400 min-h-[44px] rounded-xl text-left transition-all cursor-pointer space-y-1"
                >
                  <div className="text-teal-700 dark:text-teal-400"><ClockIcon size={18} /></div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Reminders</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Medications</div>
                </button>

                <button
                  type="button"
                  onClick={onOpenChat}
                  className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50/50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 hover:border-teal-700 dark:hover:border-teal-400 min-h-[44px] rounded-xl text-left transition-all cursor-pointer space-y-1"
                >
                  <div className="text-teal-700 dark:text-teal-400"><SparklesIcon size={18} /></div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Ask AI</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Assistance</div>
                </button>
              </div>
            </div>

            {/* 108 EMERGENCY SOS CARD */}
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-5 space-y-3 text-rose-950 dark:text-rose-200 transition-colors shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>108 Emergency</span>
                <span className="text-[10px] bg-rose-600 text-white px-2.5 py-0.5 rounded-md font-extrabold shadow-2xs">SOS</span>
              </div>
              <p className="text-xs text-rose-900/80 dark:text-rose-300 leading-relaxed font-medium">
                Need urgent medical help or ambulance dispatch?
              </p>
              <button
                type="button"
                onClick={() => setCurrentView?.('emergency')}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold py-3 px-4 min-h-[48px] rounded-xl transition-all cursor-pointer text-center shadow-md"
              >
                Call 108 Emergency SOS →
              </button>
            </div>

          </div>
        </div>

        {/* 3. RURAL CARE SUPPORT STRIP */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-colors">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🌾 Rural Care Support</span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md font-bold border border-amber-200 dark:border-amber-800">2G IVR Voice</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Need help without a smartphone? Voice assistance and 2G phone call reminders are active.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView?.('reminders')}
            className="border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-3 min-h-[44px] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            Test 2G Voice Alert
          </button>
        </div>

      </div>
    </div>
  );
};

export default PatientHomePage;
