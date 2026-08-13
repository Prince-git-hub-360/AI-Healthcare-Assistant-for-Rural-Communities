import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';
import { PillIcon, ClockIcon, PlusIcon, SpeakerIcon, CheckIcon, AlertIcon, SunriseIcon, SunIcon, MoonIcon, PhoneIcon } from '../../../../shared/icons/Icons';
import { speakNativeAudio } from '../../../../shared/utils/speech';
import { IvrCallSimulatorModal } from '../../components/VoiceAssistant/IvrCallSimulatorModal';
import { VisualPillBoxCalendar } from '../../components/VisualPillBoxCalendar';

export const RemindersPage = () => {
  const { currentLang, showToast } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const [ivrModal, setIvrModal] = useState({ open: false, item: null });

  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '1 tablet',
    scheduled_time: '08:00',
    meal_rule: 'after_meal',
    instructions: 'Take 1 tablet after breakfast with water.',
  });

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const data = await api.getReminders();
      let rawList = Array.isArray(data) ? data : data?.results || [];
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
        setReminders([]);
      }
    } catch (err) {
      setReminders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReminders();
    const handleSync = () => fetchReminders();
    window.addEventListener('swasthya_reminders_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('swasthya_reminders_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createReminder({
        title: formData.medication_name,
        medication_name: formData.medication_name,
        scheduled_time: formData.scheduled_time,
        dosage_note: `${formData.dosage} (${formData.meal_rule === 'after_meal' ? 'After Food - PC' : 'Before Food - AC'})`,
        instructions: formData.instructions,
      });
      if (showToast) showToast('Medication reminder scheduled!', 'success');
      setShowAddForm(false);
      fetchReminders();
    } catch (err) {
      const newItem = {
        id: Date.now(),
        medication_name: formData.medication_name,
        scheduled_time: formData.scheduled_time,
        instructions: `${formData.dosage} — ${formData.instructions}`,
        is_taken: false,
      };
      setReminders([...reminders, newItem]);
      setShowAddForm(false);
      if (showToast) showToast('Medication reminder added locally!', 'info');
    }
  };

  const handleToggleTaken = async (id, currentStatus) => {
    try {
      await api.toggleReminder(id, !currentStatus);
      setReminders(reminders.map(r => r.id === id ? { ...r, is_taken: !currentStatus } : r));
      if (showToast) showToast(!currentStatus ? 'Dose marked as Taken! Moved to Completed list ✓' : 'Marked as Pending ○', 'success');
    } catch {
      setReminders(reminders.map(r => r.id === id ? { ...r, is_taken: !currentStatus } : r));
      if (showToast) showToast(!currentStatus ? 'Dose marked as Taken ✓' : 'Marked as Pending ○', 'info');
    }
  };

  const handleDeleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    if (showToast) showToast('Medication reminder removed.', 'info');
  };

  const playVoiceAudio = async (reminder) => {
    setPlayingAudioId(reminder.id);
    const textToSpeak = `${reminder.medication_name || reminder.title}. ${reminder.instructions || reminder.dosage_note || 'Take as prescribed.'}`;
    if (showToast) showToast(`Speaking audio guidance for ${reminder.medication_name || 'medication'}...`, 'info');

    await speakNativeAudio(textToSpeak, currentLang);
    setPlayingAudioId(null);
  };

  // Separate active pending doses vs completed doses
  const pendingReminders = reminders.filter(r => !r.is_taken);
  const completedReminders = reminders.filter(r => r.is_taken);

  // Strict time-slot classification helper
  const getSlot = (r) => {
    const time = (r.scheduled_time || r.time || '').toLowerCase();
    const name = (r.medication_name || r.title || r.instructions || '').toLowerCase();
    const slot = (r.timeSlot || r.dose_slot || '').toLowerCase();

    // 1. Explicit Night keywords or PM 8-11 times
    if (
      slot === 'night' ||
      name.includes('night') ||
      name.includes('bedtime') ||
      name.includes(' hs') ||
      name.includes('hs ') ||
      time.includes('20:') ||
      time.includes('21:') ||
      time.includes('22:') ||
      time.includes('08:00 pm') ||
      time.includes('08:30 pm') ||
      time.includes('09:00 pm') ||
      time.includes('10:00 pm') ||
      (time.includes('pm') && (time.includes('08:') || time.includes('09:') || time.includes('10:')))
    ) {
      return 'night';
    }

    // 2. Afternoon keywords or PM 12-4 times
    if (
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
      return 'afternoon';
    }

    // 3. Default to morning
    return 'morning';
  };

  const morningMeds = pendingReminders.filter((r) => getSlot(r) === 'morning');
  const afternoonMeds = pendingReminders.filter((r) => getSlot(r) === 'afternoon');
  const nightMeds = pendingReminders.filter((r) => getSlot(r) === 'night');

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-6 space-y-6 font-sans text-stone-900 dark:text-slate-100 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#161F30] border border-stone-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="space-y-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0B4F42] dark:text-teal-400">
            MEDICATION COMPLIANCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            <PillIcon size={24} className="text-[#0B4F42] dark:text-teal-400" />
            <span>Medication Schedule & Reminders</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 font-normal">
            Visual Day-Part Medication Schedule with 1-Tap Audio Guidance
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-medium text-xs py-2 px-3.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <PlusIcon size={16} />
          <span>Add Reminder</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-[#161F30] border border-stone-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-3.5 transition-colors">
          <h3 className="text-base font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-slate-800 pb-2">Schedule New Medication</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300">Medication Name *</label>
              <input
                type="text"
                placeholder="e.g. Metformin 500mg"
                className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 text-xs rounded-lg px-3 py-2 outline-none focus:border-[#0B4F42]"
                value={formData.medication_name}
                onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300">Dosage Count *</label>
              <input
                type="text"
                placeholder="e.g. 1 tablet"
                className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 text-xs rounded-lg px-3 py-2 outline-none focus:border-[#0B4F42]"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300">Scheduled Time *</label>
              <input
                type="time"
                className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 text-xs rounded-lg px-3 py-2 outline-none focus:border-[#0B4F42]"
                value={formData.scheduled_time}
                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300">Meal Timing Rule *</label>
              <select
                className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 text-xs rounded-lg px-3 py-2 outline-none focus:border-[#0B4F42] cursor-pointer"
                value={formData.meal_rule}
                onChange={(e) => setFormData({ ...formData, meal_rule: e.target.value })}
              >
                <option value="after_meal">After Food (Post Cibo - PC)</option>
                <option value="before_meal">Before Food (Ante Cibo - AC)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300">Patient Instructions</label>
            <input
              type="text"
              placeholder="e.g. Take 1 tablet after breakfast with warm water."
              className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 text-xs rounded-lg px-3 py-2 outline-none focus:border-[#0B4F42]"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-slate-400 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-xs cursor-pointer"
            >
              Save Reminder
            </button>
          </div>
        </form>
      )}

      {/* 5-DAY VISUAL PILL BOX CALENDAR GRID (GENERATED ONLY WHEN PRESCRIPTION IS UPLOADED) */}
      {reminders.length > 0 ? (
        <>
          <VisualPillBoxCalendar
            reminders={reminders}
            onToggleTaken={handleToggleTaken}
            onDeleteReminder={handleDeleteReminder}
            onIvrCall={(item) => setIvrModal({ open: true, item })}
            currentLang={currentLang}
            showToast={showToast}
          />

          {/* ACTIVE PENDING DOSES TODAY (AUTOCLEARS AS PATIENT MARKS TAKEN) */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#0B4F42] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-3 py-0.5 rounded-full">
                  🔔 PENDING DOSES TODAY ({pendingReminders.length})
                </span>
              </div>
              <span className="text-xs font-semibold text-stone-500 dark:text-slate-400">
                {completedReminders.length} / {reminders.length} Doses Taken Today
              </span>
            </div>

            {pendingReminders.length === 0 ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-6 text-center space-y-2">
                <div className="text-3xl">🎉</div>
                <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">All Medications Taken for Today!</h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                  Great job keeping up with your health! You have completed all scheduled doses for today. Your adherence record has been logged.
                </p>
              </div>
            ) : (
          <>
            {/* MORNING MEDS */}
            {morningMeds.length > 0 && (
              <div className="bg-amber-50/60 dark:bg-[#161F30] border border-amber-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <SunriseIcon size={20} className="text-amber-600 dark:text-amber-400" />
                  <h2 className="text-base font-semibold text-amber-950 dark:text-amber-200">🌅 Morning Medications ({morningMeds.length} pending)</h2>
                </div>
                <div className="space-y-2.5">
                  {morningMeds.map((r) => {
                    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
                    const end = new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
                    return (
                      <div key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl border border-amber-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/60 rounded-lg flex items-center justify-center font-bold text-xs text-amber-900 dark:text-amber-200 shrink-0">
                            💊
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-stone-900 dark:text-white">{r.medication_name || r.title}</div>
                            <div className="text-[11px] text-stone-500 dark:text-slate-400">{r.instructions || r.dosage_note}</div>
                            <div className="text-[10px] font-bold text-[#0B4F42] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded-full inline-block mt-1">
                              📅 {r.start_date || todayStr} – {r.end_date || end} (5-Day Course)
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => setIvrModal({ open: true, item: r })} className="border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 transition-colors">
                            <PhoneIcon size={12} /> <span>2G Call</span>
                          </button>
                          <button onClick={() => playVoiceAudio(r)} className="border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg cursor-pointer transition-colors">
                            <span>Listen</span>
                          </button>
                          <button onClick={() => handleToggleTaken(r.id, r.is_taken)} className="bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                            Mark Taken ✓
                          </button>
                          <button onClick={() => handleDeleteReminder(r.id)} title="Delete Reminder" className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs p-1 cursor-pointer transition-colors">
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AFTERNOON MEDS */}
            {afternoonMeds.length > 0 && (
              <div className="bg-sky-50/60 dark:bg-[#161F30] border border-sky-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <SunIcon size={20} className="text-sky-600 dark:text-sky-400" />
                  <h2 className="text-base font-semibold text-sky-950 dark:text-sky-200">☀️ Afternoon Medications ({afternoonMeds.length} pending)</h2>
                </div>
                <div className="space-y-2.5">
                  {afternoonMeds.map((r) => {
                    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
                    const end = new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
                    return (
                      <div key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl border border-sky-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/60 rounded-lg flex items-center justify-center font-bold text-xs text-sky-900 dark:text-sky-200 shrink-0">
                            🟢
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-stone-900 dark:text-white">{r.medication_name || r.title}</div>
                            <div className="text-[11px] text-stone-500 dark:text-slate-400">{r.instructions || r.dosage_note}</div>
                            <div className="text-[10px] font-bold text-[#0B4F42] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded-full inline-block mt-1">
                              📅 {r.start_date || todayStr} – {r.end_date || end} (5-Day Course)
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => setIvrModal({ open: true, item: r })} className="border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 transition-colors">
                            <PhoneIcon size={12} /> <span>2G Call</span>
                          </button>
                          <button onClick={() => playVoiceAudio(r)} className="border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg cursor-pointer transition-colors">
                            <span>Listen</span>
                          </button>
                          <button onClick={() => handleToggleTaken(r.id, r.is_taken)} className="bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                            Mark Taken ✓
                          </button>
                          <button onClick={() => handleDeleteReminder(r.id)} title="Delete Reminder" className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs p-1 cursor-pointer transition-colors">
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NIGHT MEDS */}
            {nightMeds.length > 0 && (
              <div className="bg-indigo-50/60 dark:bg-[#161F30] border border-indigo-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <MoonIcon size={20} className="text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-base font-semibold text-indigo-950 dark:text-indigo-200">🌙 Night & Bedtime Medications ({nightMeds.length} pending)</h2>
                </div>
                <div className="space-y-2.5">
                  {nightMeds.map((r) => {
                    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
                    const end = new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
                    return (
                      <div key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl border border-indigo-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/60 rounded-lg flex items-center justify-center font-bold text-xs text-indigo-900 dark:text-indigo-200 shrink-0">
                            🔵
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-stone-900 dark:text-white">{r.medication_name || r.title}</div>
                            <div className="text-[11px] text-stone-500 dark:text-slate-400">{r.instructions || r.dosage_note}</div>
                            <div className="text-[10px] font-bold text-[#0B4F42] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded-full inline-block mt-1">
                              📅 {r.start_date || todayStr} – {r.end_date || end} (5-Day Course)
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => setIvrModal({ open: true, item: r })} className="border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 transition-colors">
                            <PhoneIcon size={12} /> <span>2G Call</span>
                          </button>
                          <button onClick={() => playVoiceAudio(r)} className="border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg cursor-pointer transition-colors">
                            <span>Listen</span>
                          </button>
                          <button onClick={() => handleToggleTaken(r.id, r.is_taken)} className="bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                            Mark Taken ✓
                          </button>
                          <button onClick={() => handleDeleteReminder(r.id)} title="Delete Reminder" className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs p-1 cursor-pointer transition-colors">
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* COMPLETED DOSES TODAY (DAILY ADHERENCE LOG) */}
      {completedReminders.length > 0 && (
        <div className="bg-stone-50 dark:bg-slate-900/90 border border-stone-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <span>✅ COMPLETED TODAY ({completedReminders.length})</span>
            </h3>
            <span className="text-[11px] text-stone-500 dark:text-slate-400">Log saved for caregiver & ASHA tracking</span>
          </div>

          <div className="space-y-2">
            {completedReminders.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-emerald-200/80 dark:border-emerald-900/60 opacity-80 hover:opacity-100 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">✓</span>
                  <div>
                    <div className="font-bold text-xs text-stone-900 dark:text-slate-100 line-through text-stone-500 dark:text-slate-400">
                      {r.medication_name || r.title}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-slate-400">{r.instructions || r.dosage_note}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleTaken(r.id, true)}
                    className="text-[11px] font-semibold text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200 hover:underline cursor-pointer"
                  >
                    Undo (Mark Pending)
                  </button>
                  <button
                    onClick={() => handleDeleteReminder(r.id)}
                    className="text-xs text-red-500 hover:text-red-700 cursor-pointer px-1"
                    title="Delete Reminder"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </>
      ) : (
        <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-[#0B4F42] dark:text-teal-400 flex items-center justify-center mx-auto text-2xl shadow-xs">
            📋
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white">
              No Prescription Schedule Active
            </h3>
            <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed font-medium">
              When a patient uploads a prescription in <strong className="text-[#0B4F42] dark:text-teal-400">Translate Rx</strong> or <strong className="text-[#0B4F42] dark:text-teal-400">Health Vault</strong>, their 5-Day Treatment Calendar & Alarms will be automatically created here.
            </p>
          </div>
        </div>
      )}

      <IvrCallSimulatorModal
        isOpen={ivrModal.open}
        onClose={() => setIvrModal({ open: false, item: null })}
        reminderItem={ivrModal.item}
      />
    </div>
  );
};

export default RemindersPage;
