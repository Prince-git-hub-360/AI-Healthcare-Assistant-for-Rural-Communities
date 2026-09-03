import React, { useState } from 'react';
import { CameraIcon, UploadIcon, CheckIcon, AlertIcon, SparklesIcon, PlusIcon, TrashIcon, ArrowRightIcon } from '../../../shared/icons/Icons';

/**
 * PrescriptionTranslatorWizard Component
 * 
 * Unified workflow for prescription scanning and medication setup:
 * 1. Upload Prescription Image/PDF
 * 2. AI OCR & Extraction Review
 * 3. Add Medicines to Reminders
 * 4. Set Alarm & Notification Preferences
 * 5. Confirm & View Pillbox
 */

export const PrescriptionTranslatorWizard = ({ onCancel, onSave, showToast }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadFileName, setUploadFileName] = useState('');
  
  // OCR Results
  const [ocrResults, setOcrResults] = useState({
    diagnosis: '',
    medicines: [],
    extractedText: '',
    confidence: 0,
  });

  // Medicines to add
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [currentMedicine, setCurrentMedicine] = useState({
    name: '',
    strength: '',
    dosage: '1',
    frequency: 'once_daily',
    mealTiming: 'after_meal',
    duration: '5',
  });

  // Reminders preferences
  const [reminderPrefs, setReminderPrefs] = useState({
    enableAlarm: true,
    enableVoiceReminder: true,
    enableSMS: true,
    enableWhatsApp: true,
    reminderTimeMinutes: 30, // minutes before dose
    language: 'kn', // Kannada
  });

  const frequencies = [
    { key: 'once_daily', label: '0-0-1 (Once Daily)' },
    { key: 'twice_daily', label: '1-0-1 (Twice Daily)' },
    { key: 'three_times', label: '1-1-1 (Thrice Daily)' },
  ];

  const mealTimings = [
    { key: 'before_meal', label: '🍽️ Before Food (AC)' },
    { key: 'after_meal', label: '🍽️ After Food (PC)' },
    { key: 'with_meal', label: '🍽️ With Food' },
    { key: 'on_empty_stomach', label: '⏰ Empty Stomach' },
  ];

  const languages = [
    { key: 'kn', label: '🇮🇳 Kannada' },
    { key: 'hi', label: '🇮🇳 Hindi' },
    { key: 'ta', label: '🇮🇳 Tamil' },
    { key: 'te', label: '🇮🇳 Telugu' },
    { key: 'ml', label: '🇮🇳 Malayalam' },
    { key: 'en', label: '🇬🇧 English' },
  ];

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        showToast?.('File size exceeds 5MB limit', 'error');
        return;
      }

      setUploadedFile(selectedFile);
      setUploadFileName(selectedFile.name);

      // Simulate OCR processing
      setTimeout(() => {
        setOcrResults({
          diagnosis: 'Type-2 Diabetes Mellitus — Uncontrolled',
          medicines: [
            { name: 'Metformin', strength: '500mg', dosage: '1', frequency: 'twice_daily', mealTiming: 'after_meal', duration: '30' },
            { name: 'Amlodipine', strength: '5mg', dosage: '1', frequency: 'once_daily', mealTiming: 'bedtime', duration: '30' },
          ],
          extractedText: 'Prescription from Dr. Sharma, PHC Mandya. Patient to take medicines as prescribed.',
          confidence: 87,
        });
        showToast?.('✓ Prescription scanned successfully!', 'success');
      }, 1500);
    }
  };

  const addMedicine = () => {
    if (!currentMedicine.name || !currentMedicine.strength) {
      showToast?.('Please enter medicine name and strength', 'error');
      return;
    }

    setSelectedMedicines([...selectedMedicines, { ...currentMedicine, id: Date.now() }]);
    setCurrentMedicine({
      name: '',
      strength: '',
      dosage: '1',
      frequency: 'once_daily',
      mealTiming: 'after_meal',
      duration: '5',
    });

    showToast?.(`✓ Added ${currentMedicine.name}`, 'success');
  };

  const removeMedicine = (id) => {
    setSelectedMedicines(selectedMedicines.filter(m => m.id !== id));
  };

  const canProceedToNext = () => {
    if (currentStep === 1) return uploadedFile !== null;
    if (currentStep === 2) return ocrResults.medicines.length > 0 || selectedMedicines.length > 0;
    if (currentStep === 3) return selectedMedicines.length > 0;
    if (currentStep === 4) return true;
    return true;
  };

  const handleNext = () => {
    if (canProceedToNext()) {
      if (currentStep === 2) {
        // Pre-select OCR medicines
        setSelectedMedicines(ocrResults.medicines.map((m, i) => ({ ...m, id: i })));
      }
      setCurrentStep(currentStep + 1);
    } else {
      showToast?.('Please complete this step before proceeding', 'error');
    }
  };

  const handleSave = async () => {
    const prescriptionData = {
      diagnosis: ocrResults.diagnosis,
      medicines: selectedMedicines,
      reminders: reminderPrefs,
      sourceFile: uploadFileName,
      extractedConfidence: ocrResults.confidence,
    };

    if (onSave) {
      await onSave(prescriptionData);
    }

    showToast?.('✓ Medicines added to reminders. View your 5-day pillbox!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-800 dark:to-emerald-800 p-6 text-white sticky top-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black">📸 Prescription Translator</h2>
            <button
              type="button"
              onClick={onCancel}
              className="text-white/70 hover:text-white text-2xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === currentStep
                      ? 'bg-white text-teal-600 scale-110'
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

          <div className="text-xs font-bold text-white/80">
            {currentStep === 1 && '📤 Upload Prescription'}
            {currentStep === 2 && '🤖 AI Extraction Review'}
            {currentStep === 3 && '💊 Add Medicines'}
            {currentStep === 4 && '🔔 Reminder Preferences'}
            {currentStep === 5 && '✅ Confirm & Start'}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-5">
          
          {/* STEP 1: UPLOAD */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-2xl p-8 text-center bg-teal-50/50 dark:bg-teal-950/30 space-y-3 hover:bg-teal-100 dark:hover:bg-teal-950/50 transition-colors">
                <div className="text-5xl">📸</div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Take a photo or upload prescription</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">JPG, PNG, PDF (Max 5MB)</p>

                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                  id="prescription-input"
                  className="hidden"
                />

                <label
                  htmlFor="prescription-input"
                  className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-lg cursor-pointer transition-colors"
                >
                  Choose Image
                </label>
              </div>

              {uploadedFile && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-start gap-3">
                  <CheckIcon size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">✓ Image Uploaded</div>
                    <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mt-1">{uploadFileName}</div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-3.5">
                <div className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-start gap-2">
                  <span className="text-lg mt-0.5">💡</span>
                  <div>
                    <div>Take a clear photo with good lighting</div>
                    <div className="font-normal text-blue-800 dark:text-blue-300 mt-1">Our AI will extract medicine names and dosages automatically</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: OCR REVIEW */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Confidence Score */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-200">🤖 AI Confidence</div>
                  <div className="text-lg font-black text-amber-600 dark:text-amber-400">{ocrResults.confidence}%</div>
                </div>
                <div className="w-full bg-amber-200 dark:bg-amber-900/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 dark:bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${ocrResults.confidence}%` }}
                  />
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-300 mt-2">
                  Please verify extracted information below
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Diagnosis (from OCR)</label>
                <input
                  type="text"
                  value={ocrResults.diagnosis}
                  onChange={(e) => setOcrResults({ ...ocrResults, diagnosis: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Extracted Medicines Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Found {ocrResults.medicines.length} medicines
                </label>
                <div className="space-y-2">
                  {ocrResults.medicines.map((med, idx) => (
                    <div key={idx} className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg p-3">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {med.name} {med.strength}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                        {med.dosage} • {frequencies.find(f => f.key === med.frequency)?.label} • {med.duration} days
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-3.5">
                <div className="text-xs font-bold text-blue-900 dark:text-blue-200">ℹ️ Tip</div>
                <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mt-1">
                  If extraction is inaccurate, you can add/edit medicines in the next step
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ADD/EDIT MEDICINES */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Add Medicine Form */}
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Add/Edit Medicines</div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Medicine name"
                    value={currentMedicine.name}
                    onChange={(e) => setCurrentMedicine({ ...currentMedicine, name: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Strength (e.g. 500mg)"
                    value={currentMedicine.strength}
                    onChange={(e) => setCurrentMedicine({ ...currentMedicine, strength: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none"
                  />
                  <select
                    value={currentMedicine.frequency}
                    onChange={(e) => setCurrentMedicine({ ...currentMedicine, frequency: e.target.value })}
                    className="col-span-2 w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none"
                  >
                    {frequencies.map((f) => (
                      <option key={f.key} value={f.key}>{f.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={addMedicine}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <PlusIcon size={14} /> Add Medicine
                </button>
              </div>

              {/* Selected Medicines */}
              {selectedMedicines.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Selected Medicines ({selectedMedicines.length})</div>
                  {selectedMedicines.map((med) => (
                    <div key={med.id} className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{med.name} {med.strength}</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          {frequencies.find(f => f.key === med.frequency)?.label} • {med.duration} days
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedicine(med.id)}
                        className="text-rose-600 cursor-pointer hover:text-rose-700"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: REMINDER PREFERENCES */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Reminder Language
                </label>
                <select
                  value={reminderPrefs.language}
                  onChange={(e) => setReminderPrefs({ ...reminderPrefs, language: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.key} value={lang.key}>{lang.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Notification Preferences
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'enableAlarm', label: '⏰ Alarm Sound' },
                    { key: 'enableVoiceReminder', label: '🔊 Voice Reminder' },
                    { key: 'enableSMS', label: '📱 SMS Reminder' },
                    { key: 'enableWhatsApp', label: '💬 WhatsApp Reminder' },
                  ].map((pref) => (
                    <label key={pref.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reminderPrefs[pref.key]}
                        onChange={(e) => setReminderPrefs({ ...reminderPrefs, [pref.key]: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{pref.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Reminder Time (before dose)
                </label>
                <select
                  value={reminderPrefs.reminderTimeMinutes}
                  onChange={(e) => setReminderPrefs({ ...reminderPrefs, reminderTimeMinutes: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3"
                >
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                  <option value={60}>1 hour before</option>
                  <option value={120}>2 hours before</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRM */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white">✓ Summary</div>

                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Medicines Added</div>
                    <div className="font-bold text-slate-900 dark:text-white">{selectedMedicines.length}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Reminders</div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {[reminderPrefs.enableAlarm && '⏰ Alarm', reminderPrefs.enableVoiceReminder && '🔊 Voice', reminderPrefs.enableSMS && '📱 SMS', reminderPrefs.enableWhatsApp && '💬 WhatsApp']
                        .filter(Boolean)
                        .join(' • ')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-start gap-3">
                <CheckIcon size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">✓ Ready to Start</div>
                  <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mt-1">
                    Your 5-day visual pillbox will appear on your home screen with dose reminders
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-6 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-3 text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl cursor-pointer"
              >
                ← Back
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="px-4 py-3 text-xs font-bold bg-teal-600 text-white rounded-xl cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                Next <ArrowRightIcon size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-3 text-xs font-bold bg-emerald-600 text-white rounded-xl cursor-pointer flex items-center gap-2"
              >
                <CheckIcon size={16} /> Start Taking Medicines
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionTranslatorWizard;
