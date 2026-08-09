import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';
import { PillIcon, ClockIcon, PlusIcon, SpeakerIcon, CheckIcon, AlertIcon } from '../components/ui/Icons';
import { speakNativeAudio } from '../utils/speech';

export const RemindersPage = () => {
  const { currentLang, showToast } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '1 tablet',
    scheduled_time: '08:00',
    meal_rule: 'after_meal', // 'before_meal' | 'after_meal'
    instructions: 'Take 1 tablet after breakfast with water.',
  });

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const data = await api.getReminders();
      if (Array.isArray(data)) setReminders(data);
      else if (data?.results) setReminders(data.results);
    } catch (err) {
      // Fallback local list
      setReminders([
        { id: 1, medication_name: 'Paracetamol 500mg', scheduled_time: '08:00 AM', instructions: '1 tablet after breakfast (PC)', is_taken: true },
        { id: 2, medication_name: 'Amoxicillin 250mg', scheduled_time: '01:00 PM', instructions: '1 capsule after lunch (PC)', is_taken: false },
        { id: 3, medication_name: 'Vitamin D3', scheduled_time: '08:00 PM', instructions: '1 tablet at bedtime with milk', is_taken: false },
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

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
            MEDICATION COMPLIANCE
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <PillIcon size={28} color="#0f766e" /> Medication Reminders Schedule
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Automated alerts in regional languages with spoken voice guidance
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <PlusIcon size={16} /> Add Medication Reminder
        </button>
      </div>

      {/* Add Reminder Form */}
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

      {/* Reminders List */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-stone-900 tracking-tight mb-2">
          Active Reminders List
        </h2>

        {loading ? (
          <div className="py-8 text-center text-xs text-stone-500 animate-pulse">Fetching medication schedule from backend...</div>
        ) : reminders.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500">No active medication reminders configured.</div>
        ) : (
          <div className="space-y-3">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:border-teal-700 transition-all gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl border border-stone-200 flex items-center justify-center font-bold text-xs text-teal-800 shadow-xs">
                    <ClockIcon size={18} color="#0f766e" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-stone-900">{r.medication_name || r.title}</div>
                    <div className="text-xs text-stone-600">{r.instructions || r.dosage_note}</div>
                    <div className="text-[11px] font-semibold text-teal-700 mt-0.5">Time: {r.scheduled_time || '08:00 AM'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    onClick={() => playVoiceAudio(r)}
                    className="bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <SpeakerIcon size={14} color="#0f766e" />
                    {playingAudioId === r.id ? 'Playing Voice...' : 'Listen 🔊'}
                  </button>

                  <button
                    onClick={() => handleToggleTaken(r.id, r.is_taken)}
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold cursor-pointer transition-all ${
                      r.is_taken ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {r.is_taken ? '✓ Taken' : '○ Mark Taken'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
