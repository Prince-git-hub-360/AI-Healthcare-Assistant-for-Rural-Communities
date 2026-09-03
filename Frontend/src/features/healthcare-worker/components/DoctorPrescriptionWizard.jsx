import React, { useState } from 'react';
import { PlusIcon, TrashIcon, CheckIcon, AlertIcon } from '../../../shared/icons/Icons';

/**
 * DoctorPrescriptionWizard Component
 * 
 * Step-by-step wizard for creating patient prescriptions:
 * 1. Patient Selection
 * 2. Diagnosis Entry
 * 3. Medicine Entry (repeating)
 * 4. Duration & Special Instructions
 * 5. Confirmation & Print
 */

export const DoctorPrescriptionWizard = ({ patient, onCancel, onSave, showToast }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [duration, setDuration] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Current medicine form state
  const [currentMedicine, setCurrentMedicine] = useState({
    name: '',
    strength: '',
    form: 'tablet',
    dosage: '1',
    frequency: 'once_daily',
    timing: 'morning',
    mealTiming: 'after_meal',
    duration: '5',
  });

  const commonMedicines = [
    'Metformin 500mg',
    'Amlodipine 5mg',
    'Lisinopril 10mg',
    'Atorvastatin 20mg',
    'Aspirin 75mg',
    'Omeprazole 20mg',
    'Amoxicillin 500mg',
    'Paracetamol 500mg',
    'Ibuprofen 400mg',
  ];

  const forms = ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops'];
  const frequencies = [
    { key: 'once_daily', label: '0-0-1 (Once Daily)' },
    { key: 'twice_daily', label: '1-0-1 (Twice Daily)' },
    { key: 'three_times', label: '1-1-1 (Thrice Daily)' },
    { key: 'morning_evening', label: '1-0-0 + 0-0-1 (Morning & Evening)' },
    { key: 'as_needed', label: 'As Needed (SOS)' },
  ];

  const mealTimings = [
    { key: 'before_meal', label: '🍽️ Before Food (AC)' },
    { key: 'after_meal', label: '🍽️ After Food (PC)' },
    { key: 'with_meal', label: '🍽️ With Food' },
    { key: 'on_empty_stomach', label: '⏰ On Empty Stomach' },
  ];

  const addMedicine = () => {
    if (!currentMedicine.name || !currentMedicine.strength) {
      showToast?.('Please enter medicine name and strength', 'error');
      return;
    }

    const medicineDisplay = `${currentMedicine.name} ${currentMedicine.strength} — ${currentMedicine.dosage} ${currentMedicine.form} ${frequencies.find(f => f.key === currentMedicine.frequency)?.label || ''}`;

    setMedicines([...medicines, { ...currentMedicine, display: medicineDisplay }]);
    setCurrentMedicine({
      name: '',
      strength: '',
      form: 'tablet',
      dosage: '1',
      frequency: 'once_daily',
      timing: 'morning',
      mealTiming: 'after_meal',
      duration: '5',
    });

    showToast?.(`✓ Medicine added: ${currentMedicine.name}`, 'success');
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const canProceedToNext = () => {
    if (currentStep === 1) return true; // Patient already selected
    if (currentStep === 2) return diagnosis.trim() !== '';
    if (currentStep === 3) return medicines.length > 0;
    if (currentStep === 4) return duration.trim() !== '';
    return true;
  };

  const handleNext = () => {
    if (canProceedToNext()) {
      setCurrentStep(currentStep + 1);
    } else {
      showToast?.('Please complete this step before proceeding', 'error');
    }
  };

  const handleSave = async () => {
    const prescriptionData = {
      patientId: patient?.id,
      patientName: patient?.name,
      diagnosis,
      medicines,
      duration,
      specialInstructions,
      createdDate: new Date().toISOString(),
    };

    if (onSave) {
      await onSave(prescriptionData);
    }

    showToast?.('✓ Prescription saved successfully', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-800 dark:to-emerald-800 p-6 text-white sticky top-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black">📝 Prescription Wizard</h2>
            <button
              type="button"
              onClick={onCancel}
              className="text-white/70 hover:text-white text-2xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === currentStep
                      ? 'bg-white text-teal-600 scale-110 shadow-lg'
                      : step < currentStep
                      ? 'bg-emerald-400 text-white'
                      : 'bg-white/30 text-white'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 5 && <div className={`h-1 flex-1 rounded-full ${step < currentStep ? 'bg-emerald-400' : 'bg-white/30'}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Step labels */}
          <div className="text-xs font-bold text-white/80 mt-3 space-y-1">
            <div>
              {currentStep === 1 && '👤 PATIENT INFO'}
              {currentStep === 2 && '🏥 DIAGNOSIS'}
              {currentStep === 3 && '💊 ADD MEDICINES'}
              {currentStep === 4 && '⏱️ DURATION & NOTES'}
              {currentStep === 5 && '✅ REVIEW & CONFIRM'}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-5">
          
          {/* STEP 1: PATIENT INFO */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Patient Name</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{patient?.name}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Age & Gender</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{patient?.age} yrs, {patient?.gender}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Phone</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{patient?.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">ABHA ID</div>
                    <div className="text-sm font-black text-teal-600 dark:text-teal-300">{patient?.abhaId}</div>
                  </div>
                </div>
              </div>

              {patient?.allergies && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-4 flex items-start gap-3">
                  <AlertIcon size={20} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-rose-900 dark:text-rose-200">⚠️ Allergies</div>
                    <div className="text-sm font-medium text-rose-800 dark:text-rose-300">{patient?.allergies}</div>
                  </div>
                </div>
              )}

              {patient?.contraindication && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4">
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">🚫 Clinical Contraindications</div>
                  <div className="text-sm font-medium text-amber-800 dark:text-amber-300">{patient?.contraindication}</div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: DIAGNOSIS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Chief Complaint & Diagnosis *
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g., Type-2 Diabetes Mellitus — Uncontrolled + Stage-2 Hypertension + Anemia"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4">
                <div className="text-xs font-bold text-blue-900 dark:text-blue-200">💡 TIP</div>
                <div className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                  Be specific with the diagnosis. Include comorbidities and severity level (e.g., "Controlled", "Uncontrolled").
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ADD MEDICINES */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Medicine Input Form */}
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Add Medicine</div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Medicine Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Metformin"
                      value={currentMedicine.name}
                      onChange={(e) => setCurrentMedicine({ ...currentMedicine, name: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Strength *</label>
                    <input
                      type="text"
                      placeholder="e.g., 500mg"
                      value={currentMedicine.strength}
                      onChange={(e) => setCurrentMedicine({ ...currentMedicine, strength: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Form</label>
                    <select
                      value={currentMedicine.form}
                      onChange={(e) => setCurrentMedicine({ ...currentMedicine, form: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {forms.map((form) => (
                        <option key={form} value={form}>
                          {form}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g., 1 or 2"
                      value={currentMedicine.dosage}
                      onChange={(e) => setCurrentMedicine({ ...currentMedicine, dosage: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Frequency *</label>
                    <select
                      value={currentMedicine.frequency}
                      onChange={(e) => setCurrentMedicine({ ...currentMedicine, frequency: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {frequencies.map((freq) => (
                        <option key={freq.key} value={freq.key}>
                          {freq.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Meal Timing</label>
                    <select
                      value={currentMedicine.mealTiming}
                      onChange={(e) => setCurrentMedicine({ ...currentMedicine, mealTiming: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {mealTimings.map((timing) => (
                        <option key={timing.key} value={timing.key}>
                          {timing.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Duration (days)</label>
                    <input
                      type="number"
                      placeholder="e.g., 30"
                      value={currentMedicine.duration}
                      onChange={(e) => setCurrentMedicine({ ...currentMedicine, duration: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addMedicine}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <PlusIcon size={16} /> Add Medicine
                </button>
              </div>

              {/* Added Medicines List */}
              {medicines.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Added Medicines ({medicines.length})</div>
                  {medicines.map((med, idx) => (
                    <div key={idx} className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{med.name} {med.strength}</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          {med.dosage} {med.form} • {frequencies.find(f => f.key === med.frequency)?.label} • {med.duration} days
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedicine(idx)}
                        className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 ml-3 shrink-0 cursor-pointer"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: DURATION & NOTES */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Treatment Duration (Total course in days) *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 30 days or 5 days antibiotic course"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Special Instructions & Warnings (Optional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., Avoid NSAIDs • Monitor BP daily • Follow up in 2 weeks • Avoid alcohol"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & CONFIRM */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white">📋 Prescription Summary</div>

                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Patient</div>
                    <div className="font-black text-slate-900 dark:text-white">{patient?.name} • {patient?.age}y • {patient?.phone}</div>
                  </div>

                  <div className="border-t border-teal-200 dark:border-teal-800 pt-2">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Diagnosis</div>
                    <div className="font-medium text-slate-900 dark:text-white">{diagnosis}</div>
                  </div>

                  <div className="border-t border-teal-200 dark:border-teal-800 pt-2">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Medicines ({medicines.length})</div>
                    <div className="space-y-1 mt-1">
                      {medicines.map((med, idx) => (
                        <div key={idx} className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          • {med.name} {med.strength} — {med.dosage} {med.form} {frequencies.find(f => f.key === med.frequency)?.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {specialInstructions && (
                    <div className="border-t border-teal-200 dark:border-teal-800 pt-2">
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Special Instructions</div>
                      <div className="font-medium text-slate-900 dark:text-white">{specialInstructions}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-start gap-3">
                <CheckIcon size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">✓ Ready to Save</div>
                  <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mt-1">
                    Click "Save & Print" to finalize this prescription. The patient will receive SMS+WhatsApp reminders with medicine details.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-6 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-3 min-h-[44px] text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              >
                ← Previous
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="px-4 py-3 min-h-[44px] text-xs font-bold bg-teal-600 dark:bg-teal-700 text-white rounded-xl hover:bg-teal-700 dark:hover:bg-teal-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-3 min-h-[44px] text-xs font-bold bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-800 transition-colors cursor-pointer flex items-center gap-2"
              >
                <CheckIcon size={16} /> Save & Print
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescriptionWizard;
