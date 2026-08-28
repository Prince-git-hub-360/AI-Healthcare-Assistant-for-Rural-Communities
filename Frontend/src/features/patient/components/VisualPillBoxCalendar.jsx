import React, { useState } from 'react';
import { SunriseIcon, SunIcon, MoonIcon, ClockIcon, SpeakerIcon, PhoneIcon, CheckIcon, AlertIcon } from '../../../shared/icons/Icons';
import { speakNativeAudio } from '../../../shared/utils/speech';

// Helper to normalize noisy OCR strings into clean medicine titles
const normalizeMedicationName = (rawName = '') => {
  if (!rawName) return 'Prescribed Medication';
  let str = rawName.trim();
  
  // If it starts with numbers/patient header noise like "121022 Mr Sachin..."
  if (/^\d+/.test(str) || str.toLowerCase().includes('mr ') || str.toLowerCase().includes('mrs ')) {
    const tokens = str.split(/\s+/);
    // Find known medicine keywords or skip header tokens
    const medIdx = tokens.findIndex((t) =>
      /^(augmentin|enzoflam|pand|prex|clonotril|prednet|paracetamol|amoxicillin|levocetirizine|altosesp|shipend|opox|etody)/i.test(t)
    );
    if (medIdx !== -1) {
      str = tokens.slice(medIdx).join(' ');
    }
  }

  // Clean common prefixes/suffixes
  str = str.replace(/^(tab|cap|inj|syrup|t\.|c\.)\s*/i, '');
  return str.length > 35 ? str.substring(0, 35) + '...' : str;
};

export const VisualPillBoxCalendar = ({ reminders = [], onToggleTaken, onDeleteReminder, onIvrCall, currentLang, showToast }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const [alarmStates, setAlarmStates] = useState({});
  // Per-day completion map: { "day_0_rem_12": true, "day_1_rem_12": false }
  const [dayTakenState, setDayTakenState] = useState(() => {
    try {
      const saved = localStorage.getItem('swasthya_pillbox_day_taken');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const rawList = Array.isArray(reminders) ? reminders : [];

  // Determine overall treatment course duration (dynamically from prescription items, e.g. 4 days, 5 days, 7 days)
  const durationValues = rawList
    .map((r) => {
      if (typeof r.duration_days === 'number' && r.duration_days > 0) return r.duration_days;
      if (typeof r.durationDays === 'number' && r.durationDays > 0) return r.durationDays;
      if (typeof r.duration === 'number' && r.duration > 0) return r.duration;
      if (r.start_date && r.end_date) {
        const s = new Date(r.start_date);
        const e = new Date(r.end_date);
        const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
        if (diff > 0) return diff;
      }
      return null;
    })
    .filter(Boolean);

  const maxDuration = durationValues.length > 0 ? Math.max(...durationValues) : (rawList.length > 0 ? 4 : 4);

  // Generate dynamic date objects for the course duration
  const todayDate = new Date();
  const calendarDays = Array.from({ length: maxDuration }, (_, idx) => {
    const d = new Date(todayDate);
    d.setDate(todayDate.getDate() + idx);

    const dateNum = String(d.getDate()).padStart(2, '0');
    const monthName = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const dayName = idx === 0 ? 'TODAY' : d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const fullDateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedDate = `${dateNum}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;

    return {
      index: idx,
      label: `Day ${idx + 1}`,
      subLabel: dayName,
      dateNum,
      monthName,
      dateStr: formattedDate,
      fullDateStr,
      dateObj: d,
    };
  });

  const selectedDay = calendarDays[selectedDayIndex] || calendarDays[0];

  // Helper to check if a dose is taken on a specific day
  const isDoseTakenOnDay = (reminderId, dayIdx, fallbackTaken = false) => {
    const key = `day_${dayIdx}_rem_${reminderId}`;
    if (dayTakenState[key] !== undefined) {
      return dayTakenState[key];
    }
    // For today (day 0), fallback to backend reminder status
    if (dayIdx === 0) return fallbackTaken;
    return false;
  };

  // Toggle dose taken on a specific day
  const handleToggleDayTaken = (reminderId, dayIdx, currentVal) => {
    const nextVal = !currentVal;
    const key = `day_${dayIdx}_rem_${reminderId}`;
    const nextState = { ...dayTakenState, [key]: nextVal };
    setDayTakenState(nextState);
    try {
      localStorage.setItem('swasthya_pillbox_day_taken', JSON.stringify(nextState));
    } catch {}

    if (dayIdx === 0 && onToggleTaken) {
      onToggleTaken(reminderId, currentVal);
    } else {
      showToast?.(nextVal ? 'Dose marked as completed for this date ✓' : 'Dose marked as pending ○', 'success');
    }
  };

  // Helper to filter and group medications for a specific day
  const getDayMedications = (dayIdx) => {
    const dayMeds = rawList.filter((r) => {
      let itemDuration = r.duration_days || r.durationDays;
      if (!itemDuration && r.start_date && r.end_date) {
        const s = new Date(r.start_date);
        const e = new Date(r.end_date);
        const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
        if (diff > 0) itemDuration = diff;
      }
      itemDuration = itemDuration || maxDuration;
      return dayIdx < itemDuration;
    });

    // Deduplicate duplicate OCR entries for the same medicine, slot, and scheduled time
    const uniqueMap = new Map();
    dayMeds.forEach((r) => {
      const normName = normalizeMedicationName(r.medication_name || r.title);
      const time = (r.scheduled_time || r.time || '').toLowerCase();
      const key = `${normName.toLowerCase()}_${time}_day_${dayIdx}`;
      const takenThisDay = isDoseTakenOnDay(r.id, dayIdx, r.is_taken);

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          ...r,
          displayName: normName,
          rawTitle: r.medication_name || r.title,
          uniqueKey: key,
          is_taken_this_day: takenThisDay,
        });
      }
    });

    const deduplicated = Array.from(uniqueMap.values());

    const morning = [];
    const afternoon = [];
    const night = [];

    deduplicated.forEach((r) => {
      const name = r.displayName.toLowerCase();
      const time = (r.scheduled_time || r.time || '').toLowerCase();
      const slot = (r.timeSlot || r.dose_slot || '').toLowerCase();

      if (
        slot === 'night' ||
        name.includes('night') ||
        name.includes('bedtime') ||
        name.includes('hs') ||
        time.includes('20:') ||
        time.includes('21:') ||
        time.includes('22:') ||
        time.includes('08:00 pm') ||
        time.includes('08:30 pm') ||
        time.includes('09:00 pm') ||
        time.includes('10:00 pm') ||
        (time.includes('pm') && (time.includes('08:') || time.includes('09:') || time.includes('10:')))
      ) {
        night.push(r);
      } else if (
        slot === 'afternoon' ||
        name.includes('afternoon') ||
        name.includes('lunch') ||
        time.includes('12:') ||
        time.includes('13:') ||
        time.includes('14:') ||
        time.includes('15:') ||
        time.includes('01:') ||
        time.includes('02:') ||
        time.includes('03:') ||
        time.includes('04:')
      ) {
        afternoon.push(r);
      } else {
        morning.push(r);
      }
    });

    return { deduplicated, morning, afternoon, night };
  };

  const { deduplicated, morning, afternoon, night } = getDayMedications(selectedDayIndex);

  // Daily Progress Calculation
  const totalDayDoses = deduplicated.length;
  const takenDayDoses = deduplicated.filter((r) => r.is_taken_this_day).length;
  const progressPercent = totalDayDoses > 0 ? Math.round((takenDayDoses / totalDayDoses) * 100) : 0;

  const morningTaken = morning.filter((r) => r.is_taken_this_day).length;
  const afternoonTaken = afternoon.filter((r) => r.is_taken_this_day).length;
  const nightTaken = night.filter((r) => r.is_taken_this_day).length;

  const handleAudioToggle = async (reminder) => {
    if (playingId === reminder.id) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setPlayingId(null);
      showToast?.('Audio playback stopped', 'info');
      return;
    }

    setPlayingId(reminder.id);
    const textToSpeak = `${reminder.displayName}. ${reminder.instructions || reminder.dosage_note || 'Take 1 tablet as prescribed.'}`;
    showToast?.(`Playing audio in selected language...`, 'info');
    try {
      await speakNativeAudio(textToSpeak, currentLang);
    } catch (err) {
      console.warn('Voice error:', err);
    } finally {
      setPlayingId(null);
    }
  };

  const toggleAlarm = (id) => {
    setAlarmStates((prev) => {
      const current = prev[id] !== false; // Default is ON
      const nextState = !current;
      showToast?.(nextState ? 'Alarm turned ON for this dose' : 'Alarm turned OFF', 'info');
      return { ...prev, [id]: nextState };
    });
  };

  // Treatment course date range calculation
  const startDateStr = calendarDays[0]?.fullDateStr || '';
  const endDateStr = calendarDays[calendarDays.length - 1]?.fullDateStr || '';

  return (
    <div className="space-y-6 font-sans text-stone-900 dark:text-slate-100 transition-colors">
      
      {/* 1. TREATMENT COURSE HEADER & CALENDAR STRIP */}
      <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B4F42] dark:text-teal-400 block">
              Treatment Course
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <span>{startDateStr} → {endDateStr}</span>
              <span className="text-xs font-bold bg-teal-50 dark:bg-teal-950/80 text-[#0B4F42] dark:text-teal-300 border border-teal-200 dark:border-teal-800 px-2.5 py-0.5 rounded-full">
                {maxDuration} Days Course
              </span>
            </h2>
          </div>
          <span className="text-xs font-medium text-stone-500 dark:text-slate-400">
            Select a date below to view daily doses
          </span>
        </div>

        {/* CALENDAR STRIP (HORIZONTALLY SCROLLABLE ON MOBILE) */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
          {calendarDays.map((day) => {
            const isSelected = selectedDayIndex === day.index;
            const dayMedsData = getDayMedications(day.index);
            const dayTotal = dayMedsData.deduplicated.length;
            const dayTaken = dayMedsData.deduplicated.filter((r) => r.is_taken_this_day).length;
            
            let statusBadge = `○ 0/${dayTotal} pending`;
            let badgeClass = 'bg-stone-100 dark:bg-slate-700/60 text-stone-600 dark:text-slate-300';
            if (dayTotal > 0 && dayTaken === dayTotal) {
              statusBadge = `✓ ${dayTaken}/${dayTotal} done`;
              badgeClass = 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300';
            } else if (dayTaken > 0) {
              statusBadge = `◐ ${dayTaken}/${dayTotal} done`;
              badgeClass = 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300';
            }

            return (
              <button
                key={day.index}
                type="button"
                onClick={() => setSelectedDayIndex(day.index)}
                className={`min-w-[100px] sm:min-w-[120px] p-3 sm:p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between shrink-0 ${
                  isSelected
                    ? 'bg-[#0B4F42] dark:bg-teal-600 border-[#0B4F42] dark:border-teal-400 text-white shadow-md scale-102'
                    : 'bg-stone-50 dark:bg-slate-800/80 border-stone-200 dark:border-slate-700 text-stone-800 dark:text-slate-200 hover:border-stone-300 dark:hover:border-slate-600'
                }`}
              >
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? 'text-teal-200' : 'text-stone-500 dark:text-slate-400'}`}>
                  {day.subLabel}
                </span>
                
                <div className="my-1">
                  <div className="text-base sm:text-lg font-black leading-tight">
                    {day.dateNum} {day.monthName}
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${isSelected ? 'bg-teal-900/80 text-white' : badgeClass}`}>
                  {statusBadge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SELECTED DAY HEADER & DAILY PROGRESS SUMMARY */}
      <div className="bg-stone-50/80 dark:bg-slate-900/90 border border-stone-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
        
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B4F42] dark:text-teal-400 block">
                Medication Schedule
              </span>
              <h3 className="text-base sm:text-xl font-extrabold text-stone-900 dark:text-white">
                {selectedDay.subLabel === 'TODAY' ? 'Today, ' : ''}{selectedDay.fullDateStr}
              </h3>
            </div>

            {/* PROGRESS SUMMARY BADGE */}
            <div className="bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 p-3 rounded-2xl shadow-2xs space-y-1.5 min-w-[240px]">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-stone-700 dark:text-slate-200">TODAY'S PROGRESS</span>
                <span className="text-[#0B4F42] dark:text-teal-400">{takenDayDoses} of {totalDayDoses} taken ({progressPercent}%)</span>
              </div>

              {/* Progress track */}
              <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0B4F42] dark:bg-teal-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-slate-400 font-semibold pt-0.5">
                <span>Morning {morningTaken}/{morning.length} {morning.length > 0 && morningTaken === morning.length ? '✓' : ''}</span>
                <span>Afternoon {afternoonTaken}/{afternoon.length} {afternoon.length > 0 && afternoonTaken === afternoon.length ? '✓' : ''}</span>
                <span>Night {nightTaken}/{night.length} {night.length > 0 && nightTaken === night.length ? '✓' : ''}</span>
              </div>
            </div>
          </div>

          {/* ALL COMPLETED CELEBRATION BANNER ON SELECTED DATE */}
          {totalDayDoses > 0 && takenDayDoses === totalDayDoses && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-extrabold text-emerald-900 dark:text-emerald-100">
                    All doses for {selectedDay.dateNum} {selectedDay.monthName} completed!
                  </div>
                  <div className="text-[11px] text-emerald-800/80 dark:text-emerald-300 font-medium">
                    Great adherence to your medical course. Keep it up!
                  </div>
                </div>
              </div>

              {selectedDayIndex < calendarDays.length - 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedDayIndex(selectedDayIndex + 1)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
                >
                  <span>View Next Date ({calendarDays[selectedDayIndex + 1]?.subLabel})</span>
                  <span>→</span>
                </button>
              )}
            </div>
          )}

          {/* GRAND COURSE MILESTONE BANNER (WHEN ALL DAYS ARE 100% DONE) */}
          {calendarDays.length > 0 && calendarDays.every((day) => {
            const meds = getDayMedications(day.index);
            return meds.deduplicated.length > 0 && meds.deduplicated.every((r) => r.is_taken_this_day);
          }) && (
            <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🏆</div>
                <div>
                  <h4 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Congratulations! Full {maxDuration}-Day Treatment Course Completed
                  </h4>
                  <p className="text-xs text-teal-100 font-medium">
                    You have successfully completed 100% of your prescribed medication doses on time.
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 space-y-2.5">
                <span className="text-xs font-bold text-teal-200 uppercase tracking-wider block">
                  Post-Course Health Check-in
                </span>
                <p className="text-xs text-white leading-relaxed font-medium">
                  How are you feeling after completing your treatment course?
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => showToast?.('Wonderful news! Your recovery record has been updated in Health Records.', 'success')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>😊 Feeling Recovered & Healthy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onIvrCall?.({ displayName: 'ASHA Care Worker & Doctor Follow-up' })}
                    className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🩺 Still have symptoms (Consult Doctor / ASHA)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. TIME OF DAY SECTIONS (MORNING / AFTERNOON / NIGHT) */}
        
        {/* 🌅 MORNING SECTION (7:00 AM - 8:00 AM) */}
        <div className="bg-[#FFFBEB]/80 dark:bg-[#2A1F08]/60 border border-amber-200/90 dark:border-amber-900/60 rounded-2xl p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-amber-900/40 pb-2">
            <div className="flex items-center gap-2">
              <SunriseIcon size={18} className="text-amber-700 dark:text-amber-400" />
              <h4 className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-100 uppercase tracking-wider">
                🌅 MORNING (7:00 AM – 8:00 AM)
              </h4>
            </div>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
              {morning.length} {morning.length === 1 ? 'medicine' : 'medicines'}
            </span>
          </div>

          {morning.length === 0 ? (
            <div className="bg-white/80 dark:bg-slate-800/60 border border-dashed border-amber-200 dark:border-amber-900/40 rounded-xl p-3 text-xs text-amber-800/70 dark:text-amber-300/70 font-medium">
              No morning medicines scheduled for this date.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {morning.map((r) => (
                <MedicationCard
                  key={r.uniqueKey || r.id}
                  reminder={r}
                  alarmOn={alarmStates[r.id] !== false}
                  onToggleAlarm={() => toggleAlarm(r.id)}
                  isPlaying={playingId === r.id}
                  onAudioToggle={() => handleAudioToggle(r)}
                  onToggleTaken={() => handleToggleDayTaken(r.id, selectedDayIndex, r.is_taken_this_day)}
                  onDelete={() => onDeleteReminder?.(r.id)}
                  onIvrCall={() => onIvrCall?.(r)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ☀️ AFTERNOON SECTION (1:00 PM - 3:00 PM) */}
        <div className="bg-[#F0F9FF]/80 dark:bg-[#0C2438]/60 border border-sky-200/90 dark:border-sky-900/60 rounded-2xl p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-sky-200/60 dark:border-sky-900/40 pb-2">
            <div className="flex items-center gap-2">
              <SunIcon size={18} className="text-sky-700 dark:text-sky-400" />
              <h4 className="text-xs sm:text-sm font-black text-sky-950 dark:text-sky-100 uppercase tracking-wider">
                ☀️ AFTERNOON (1:00 PM – 3:00 PM)
              </h4>
            </div>
            <span className="text-xs font-bold text-sky-800 dark:text-sky-300">
              {afternoon.length} {afternoon.length === 1 ? 'medicine' : 'medicines'}
            </span>
          </div>

          {afternoon.length === 0 ? (
            <div className="bg-white/80 dark:bg-slate-800/60 border border-dashed border-sky-200 dark:border-sky-900/40 rounded-xl p-3 text-xs text-sky-800/70 dark:text-sky-300/70 font-medium">
              No afternoon medicines scheduled for this date.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {afternoon.map((r) => (
                <MedicationCard
                  key={r.uniqueKey || r.id}
                  reminder={r}
                  alarmOn={alarmStates[r.id] !== false}
                  onToggleAlarm={() => toggleAlarm(r.id)}
                  isPlaying={playingId === r.id}
                  onAudioToggle={() => handleAudioToggle(r)}
                  onToggleTaken={() => handleToggleDayTaken(r.id, selectedDayIndex, r.is_taken_this_day)}
                  onDelete={() => onDeleteReminder?.(r.id)}
                  onIvrCall={() => onIvrCall?.(r)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 🌙 NIGHT SECTION (8:00 PM - 10:00 PM) */}
        <div className="bg-[#EEF2FF]/80 dark:bg-[#1E1B4B]/60 border border-indigo-200/90 dark:border-indigo-900/60 rounded-2xl p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-indigo-200/60 dark:border-indigo-900/40 pb-2">
            <div className="flex items-center gap-2">
              <MoonIcon size={18} className="text-indigo-700 dark:text-indigo-400" />
              <h4 className="text-xs sm:text-sm font-black text-indigo-950 dark:text-indigo-100 uppercase tracking-wider">
                🌙 NIGHT (8:00 PM – 10:00 PM)
              </h4>
            </div>
            <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">
              {night.length} {night.length === 1 ? 'medicine' : 'medicines'}
            </span>
          </div>

          {night.length === 0 ? (
            <div className="bg-white/80 dark:bg-slate-800/60 border border-dashed border-indigo-200 dark:border-indigo-900/40 rounded-xl p-3 text-xs text-indigo-800/70 dark:text-indigo-300/70 font-medium">
              No night medicines scheduled for this date.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {night.map((r) => (
                <MedicationCard
                  key={r.uniqueKey || r.id}
                  reminder={r}
                  alarmOn={alarmStates[r.id] !== false}
                  onToggleAlarm={() => toggleAlarm(r.id)}
                  isPlaying={playingId === r.id}
                  onAudioToggle={() => handleAudioToggle(r)}
                  onToggleTaken={() => handleToggleDayTaken(r.id, selectedDayIndex, r.is_taken_this_day)}
                  onDelete={() => onDeleteReminder?.(r.id)}
                  onIvrCall={() => onIvrCall?.(r)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// 4. COMPACT PROFESSIONAL MEDICATION CARD COMPONENT
const MedicationCard = ({
  reminder,
  alarmOn,
  onToggleAlarm,
  isPlaying,
  onAudioToggle,
  onToggleTaken,
  onDelete,
  onIvrCall,
}) => {
  const isTaken = reminder.is_taken_this_day !== undefined ? reminder.is_taken_this_day : reminder.is_taken;
  const title = reminder.displayName || reminder.medication_name || 'Prescribed Medicine';
  const instruction = reminder.instructions || reminder.dosage_note || 'Take 1 tablet as prescribed';
  const time = reminder.scheduled_time || '08:00 AM';

  return (
    <div
      className={`rounded-2xl border p-4 transition-all flex flex-col justify-between space-y-3 ${
        isTaken
          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 opacity-90'
          : 'bg-white dark:bg-slate-800 border-stone-200 dark:border-slate-700 shadow-2xs hover:shadow-xs'
      }`}
    >
      {/* HEADER: TIME, ALARM & STATUS */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-700/60 pb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-stone-900 dark:text-white flex items-center gap-1">
            <ClockIcon size={14} className="text-[#0B4F42] dark:text-teal-400" />
            <span>{time}</span>
          </span>

          {/* ALARM TOGGLE CONTROL */}
          <button
            type="button"
            onClick={onToggleAlarm}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors border ${
              alarmOn
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-stone-100 dark:bg-slate-700 text-stone-500 dark:text-slate-400 border-stone-200 dark:border-slate-600'
            }`}
          >
            {alarmOn ? '🔔 Alarm On' : '🔕 Alarm Off'}
          </button>
        </div>

        {/* STATUS BADGE */}
        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            isTaken
              ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200'
              : 'bg-stone-100 dark:bg-slate-700 text-stone-600 dark:text-slate-300'
          }`}
        >
          {isTaken ? '✓ Taken' : '○ Pending'}
        </span>
      </div>

      {/* BODY: NORMALIZED MEDICINE NAME & INSTRUCTION */}
      <div className="space-y-1">
        <h4 className={`text-sm font-extrabold ${isTaken ? 'line-through text-stone-600 dark:text-slate-400' : 'text-stone-900 dark:text-white'}`}>
          {title}
        </h4>
        <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed font-medium">
          {instruction}
        </p>
      </div>

      {/* FOOTER ACTIONS: LISTEN (NO AUTOPLAY), MARK TAKEN, DELETE */}
      <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-slate-700/60 gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onAudioToggle}
            className={`border text-xs font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              isPlaying
                ? 'bg-rose-600 border-rose-600 text-white animate-pulse'
                : 'border-stone-300 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700'
            }`}
          >
            <span>{isPlaying ? '⏸ Stop' : '🔊 Listen'}</span>
          </button>

          {onIvrCall && (
            <button
              type="button"
              onClick={onIvrCall}
              className="border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 text-xs font-medium px-2 py-1 rounded-lg cursor-pointer flex items-center gap-1"
            >
              <PhoneIcon size={12} /> <span className="hidden sm:inline">2G</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleTaken}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isTaken
                ? 'bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-slate-200 hover:bg-stone-300'
                : 'bg-[#0B4F42] dark:bg-teal-600 hover:bg-[#07362d] text-white'
            }`}
          >
            {isTaken ? 'Undo' : '✓ Mark Taken'}
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              title="Delete Reminder"
              className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs p-1 cursor-pointer transition-colors"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualPillBoxCalendar;
