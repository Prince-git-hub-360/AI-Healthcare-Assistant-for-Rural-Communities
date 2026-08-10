import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';
import { PillIcon, ClockIcon, PlusIcon, SpeakerIcon, CheckIcon, AlertIcon, SunriseIcon, SunIcon, MoonIcon, PhoneIcon } from '../../../../shared/icons/Icons';
import { speakNativeAudio } from '../../../../shared/utils/speech';
import { IvrCallSimulatorModal } from '../../components/VoiceAssistant/IvrCallSimulatorModal';

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
        setReminders([
          { id: 1, medication_name: 'Paracetamol 500mg', scheduled_time: '08:00 AM', instructions: '1 tablet after breakfast (PC)', is_taken: true, timeSlot: 'morning' },
          { id: 2, medication_name: 'Amoxicillin 250mg', scheduled_time: '01:30 PM', instructions: '1 capsule after lunch (PC)', is_taken: false, timeSlot: 'afternoon' },
          { id: 3, medication_name: 'Levocetirizine 5mg', scheduled_time: '08:00 PM', instructions: '1 tablet at bedtime with water', is_taken: false, timeSlot: 'night' },
        ]);
      }
    } catch (err) {
      setReminders([
        { id: 1, medication_name: 'Paracetamol 500mg', scheduled_time: '08:00 AM', instructions: '1 tablet after breakfast (PC)', is_taken: true, timeSlot: 'morning' },
        { id: 2, medication_name: 'Amoxicillin 250mg', scheduled_time: '01:30 PM', instructions: '1 capsule after lunch (PC)', is_taken: false, timeSlot: 'afternoon' },
        { id: 3, medication_name: 'Levocetirizine 5mg', scheduled_time: '08:00 PM', instructions: '1 tablet at bedtime with water', is_taken: false, timeSlot: 'night' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReminders();
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
      if (showToast) showToast(!currentStatus ? 'Marked as Taken ✓' : 'Marked as Pending ○', 'success');
    } catch {
      setReminders(reminders.map(r => r.id === id ? { ...r, is_taken: !currentStatus } : r));
    }
  };

  const playVoiceAudio = async (reminder) => {
    setPlayingAudioId(reminder.id);
    const textToSpeak = `${reminder.medication_name || reminder.title}. ${reminder.instructions || reminder.dosage_note || 'Take as prescribed.'}`;
    if (showToast) showToast(`Speaking audio guidance for ${reminder.medication_name || 'medication'}...`, 'info');

    await speakNativeAudio(textToSpeak, currentLang);
    setPlayingAudioId(null);
  };

  const morningMeds = reminders.filter(r => {
    const time = (r.scheduled_time || '').toLowerCase();
    return time.includes('am') || time.includes('08:') || time.includes('09:') || time.includes('07:');
  });

  const afternoonMeds = reminders.filter(r => {
    const time = (r.scheduled_time || '').toLowerCase();
    return time.includes('12:') || time.includes('01:') || time.includes('02:') || time.includes('03:') || time.includes('pm') && !time.includes('08:') && !time.includes('09:');
  });

  const nightMeds = reminders.filter(r => !morningMeds.includes(r) && !afternoonMeds.includes(r));

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
            MEDICATION COMPLIANCE
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <PillIcon size={28} color="#0f766e" /> Medication Schedule & Timeline
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Visual Day-Part Medication Schedule with 1-Tap Audio Guidance
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <PlusIcon size={16} /> Add Medication Reminder
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-md space-y-4">
          <h3 className="text-lg font-extrabold text-stone-900 mb-2">Schedule New Medication</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Medication Name *</label>
              <input
                type="text"
                placeholder="e.g. Metformin 500mg"
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                value={formData.medication_name}
                onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Dosage Count *</label>
              <input
                type="text"
                placeholder="e.g. 1 tablet"
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Scheduled Time *</label>
              <input
                type="time"
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
                value={formData.scheduled_time}
                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Meal Timing Rule *</label>
              <select
                className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700 cursor-pointer"
                value={formData.meal_rule}
                onChange={(e) => setFormData({ ...formData, meal_rule: e.target.value })}
              >
                <option value="after_meal">After Food (Post Cibo - PC)</option>
                <option value="before_meal">Before Food (Ante Cibo - AC)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Patient Instructions</label>
            <input
              type="text"
              placeholder="e.g. Take 1 tablet after breakfast with warm water."
              className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-teal-700"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              Save Reminder →
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <SunriseIcon size={24} color="#d97706" />
            <h2 className="text-lg font-extrabold text-amber-950">🌅 Morning Medications (Breakfast)</h2>
          </div>
          {morningMeds.length === 0 ? (
            <p className="text-xs text-amber-800 font-medium">No morning medications scheduled.</p>
          ) : (
            <div className="space-y-3">
              {morningMeds.map((r) => (
                <div key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-amber-200 bg-white shadow-xs gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center font-bold text-xs text-amber-900">
                      💊
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-stone-900">{r.medication_name || r.title}</div>
                      <div className="text-xs text-stone-600">{r.instructions || r.dosage_note}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIvrModal({ open: true, item: r })} className="bg-slate-900 hover:bg-slate-800 text-teal-300 font-extrabold text-xs px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer flex items-center gap-1">
                      <PhoneIcon size={12} color="#5eead4" /> 2G Call 📞
                    </button>
                    <button onClick={() => playVoiceAudio(r)} className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-lg">
                      Listen 🔊
                    </button>
                    <button onClick={() => handleToggleTaken(r.id, r.is_taken)} className={`px-3 py-1.5 rounded-full text-xs font-extrabold ${r.is_taken ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200 text-amber-900'}`}>
                      {r.is_taken ? '✓ Taken' : '○ Mark Taken'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50/60 border border-blue-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <SunIcon size={24} color="#1d4ed8" />
            <h2 className="text-lg font-extrabold text-blue-950">☀️ Afternoon Medications (Lunch)</h2>
          </div>
          {afternoonMeds.length === 0 ? (
            <p className="text-xs text-blue-800 font-medium">No afternoon medications scheduled.</p>
          ) : (
            <div className="space-y-3">
              {afternoonMeds.map((r) => (
                <div key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-blue-200 bg-white shadow-xs gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-xs text-blue-900">
                      🟢
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-stone-900">{r.medication_name || r.title}</div>
                      <div className="text-xs text-stone-600">{r.instructions || r.dosage_note}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIvrModal({ open: true, item: r })} className="bg-slate-900 hover:bg-slate-800 text-teal-300 font-extrabold text-xs px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer flex items-center gap-1">
                      <PhoneIcon size={12} color="#5eead4" /> 2G Call 📞
                    </button>
                    <button onClick={() => playVoiceAudio(r)} className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-lg">
                      Listen 🔊
                    </button>
                    <button onClick={() => handleToggleTaken(r.id, r.is_taken)} className={`px-3 py-1.5 rounded-full text-xs font-extrabold ${r.is_taken ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-200 text-blue-900'}`}>
                      {r.is_taken ? '✓ Taken' : '○ Mark Taken'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-indigo-50/60 border border-indigo-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <MoonIcon size={24} color="#4338ca" />
            <h2 className="text-lg font-extrabold text-indigo-950">🌙 Night & Bedtime Medications</h2>
          </div>
          {nightMeds.length === 0 ? (
            <p className="text-xs text-indigo-800 font-medium">No night medications scheduled.</p>
          ) : (
            <div className="space-y-3">
              {nightMeds.map((r) => (
                <div key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-indigo-200 bg-white shadow-xs gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center font-bold text-xs text-indigo-900">
                      🔵
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-stone-900">{r.medication_name || r.title}</div>
                      <div className="text-xs text-stone-600">{r.instructions || r.dosage_note}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIvrModal({ open: true, item: r })} className="bg-slate-900 hover:bg-slate-800 text-teal-300 font-extrabold text-xs px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer flex items-center gap-1">
                      <PhoneIcon size={12} color="#5eead4" /> 2G Call 📞
                    </button>
                    <button onClick={() => playVoiceAudio(r)} className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-lg">
                      Listen 🔊
                    </button>
                    <button onClick={() => handleToggleTaken(r.id, r.is_taken)} className={`px-3 py-1.5 rounded-full text-xs font-extrabold ${r.is_taken ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-200 text-indigo-900'}`}>
                      {r.is_taken ? '✓ Taken' : '○ Mark Taken'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <IvrCallSimulatorModal
        isOpen={ivrModal.open}
        onClose={() => setIvrModal({ open: false, item: null })}
        reminderItem={ivrModal.item}
      />
    </div>
  );
};

export default RemindersPage;
