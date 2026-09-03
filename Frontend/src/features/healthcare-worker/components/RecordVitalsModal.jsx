import React, { useState } from 'react';
import { ActivityIcon, CheckIcon, AlertIcon, HeartIcon } from '../../../shared/icons/Icons';

export const RecordVitalsModal = ({ isOpen, onClose, onSaveVitals, showToast, defaultPatient = null }) => {
  const [patientName, setPatientName] = useState(defaultPatient?.name || 'Lakshmi Devi');
  const [systolic, setSystolic] = useState('142');
  const [diastolic, setDiastolic] = useState('92');
  const [bloodSugar, setBloodSugar] = useState('148');
  const [sugarType, setSugarType] = useState('Random');
  const [pulse, setPulse] = useState('78');
  const [spo2, setSpo2] = useState('98');
  const [weight, setWeight] = useState('58');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const sysNum = parseInt(systolic) || 0;
  const diaNum = parseInt(diastolic) || 0;
  const isHighBp = sysNum >= 140 || diaNum >= 90;
  const sugarNum = parseInt(bloodSugar) || 0;
  const isHighSugar = sugarNum >= 180;

  const handleSubmit = (e) => {
    e.preventDefault();
    const vitalsRecord = {
      patientName,
      bp: `${systolic}/${diastolic} mmHg`,
      bloodSugar: `${bloodSugar} mg/dL (${sugarType})`,
      pulse: `${pulse} bpm`,
      spo2: `${spo2}%`,
      weight: `${weight} kg`,
      notes,
      isHighBp,
      isHighSugar,
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (onSaveVitals) onSaveVitals(vitalsRecord);
    if (showToast) {
      if (isHighBp || isHighSugar) {
        showToast(`⚠️ Red Flag Vitals Logged for ${patientName}! Alert sent to Dr. Vikram Sharma.`, 'warning');
      } else {
        showToast(`✅ Doorstep Vitals Recorded for ${patientName}!`, 'success');
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-4 my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center text-xl">
            📈
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Record Doorstep Vitals
            </h2>
            <p className="text-xs text-slate-500">
              Mandya Catchment Sector #2 • Auto-Analyzes Clinical Risk
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Select Patient *</label>
            <select
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
            >
              <option value="Lakshmi Devi">Lakshmi Devi (54 / F • Gejjalagere)</option>
              <option value="Ravi Kumar">Ravi Kumar (60 / M • Gejjalagere)</option>
              <option value="Meena Devi">Meena Devi (28 / F • Gejjalagere - ANC)</option>
              <option value="Savithri Devi">Savithri Devi (48 / F • Gejjalagere)</option>
              <option value="Manjunath Gowda">Manjunath Gowda (55 / M • Gejjalagere)</option>
            </select>
          </div>

          {/* Blood Pressure Inputs */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                Blood Pressure (mmHg)
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                isHighBp ? 'bg-rose-100 text-rose-700 font-bold' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isHighBp ? '⚠️ High BP Alert' : '✓ Normal Range'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-bold text-slate-400">Systolic (Top)</label>
                <input
                  type="number"
                  placeholder="120"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-black outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400">Diastolic (Bottom)</label>
                <input
                  type="number"
                  placeholder="80"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-black outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Blood Sugar Inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Blood Sugar (mg/dL)</label>
              <input
                type="number"
                placeholder="110"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Timing</label>
              <select
                value={sugarType}
                onChange={(e) => setSugarType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none"
              >
                <option value="Random">Random (RBS)</option>
                <option value="Fasting">Fasting (FBS)</option>
                <option value="Post-Meal">Post Prandial (PPBS)</option>
              </select>
            </div>
          </div>

          {/* Pulse & SpO2 & Weight */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Pulse (bpm)</label>
              <input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">SpO2 (%)</label>
              <input
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Observation / Field Notes</label>
            <input
              type="text"
              placeholder="e.g. Mild headache reported. Advised low salt diet."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B3B74] hover:bg-[#072448] text-white font-black text-xs py-3 rounded-2xl shadow-md transition-all cursor-pointer mt-2 flex items-center justify-center gap-1.5"
          >
            <CheckIcon size={16} color="#fff" />
            <span>Save Vitals &amp; Sync to Doctor Dashboard</span>
          </button>

        </form>

      </div>
    </div>
  );
};

export default RecordVitalsModal;
