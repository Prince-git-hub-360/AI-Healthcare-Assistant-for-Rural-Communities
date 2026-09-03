import React, { useState } from 'react';
import { DocumentIcon, PlusIcon, CheckIcon, AlertIcon, CloudUploadIcon, ArrowRightIcon } from '../../../shared/icons/Icons';

/**
 * HealthVaultUploadWizard Component
 * 
 * Simplified 3-step upload wizard for patient health records:
 * 1. File Selection & Title
 * 2. Classification & Metadata
 * 3. Review & Confirm
 */

export const HealthVaultUploadWizard = ({ onCancel, onSave, showToast }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    documentType: 'prescription',
    hospitalName: '',
    doctorName: '',
    recordDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
  });

  const documentTypes = [
    { key: 'prescription', label: '💊 Prescription', desc: 'Medicine list from doctor' },
    { key: 'diagnostic_report', label: '🔬 Lab Report', desc: 'Blood test, pathology reports' },
    { key: 'radiology_scan', label: '🖼️ Scan/X-Ray', desc: 'CT scan, X-ray, ultrasound' },
    { key: 'discharge_summary', label: '🏥 Hospital Discharge', desc: 'Hospital visit summary' },
    { key: 'immunization', label: '💉 Vaccination', desc: 'Immunization records' },
    { key: 'other', label: '📄 Other', desc: 'Other health documents' },
  ];

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        showToast?.('File size exceeds 10MB limit', 'error');
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFormData({ ...formData, title: selectedFile.name.split('.')[0] });
    }
  };

  const canProceedToNext = () => {
    if (currentStep === 1) return file && formData.title.trim();
    if (currentStep === 2) return formData.documentType && formData.recordDate;
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
    if (onSave) {
      const uploadData = {
        file,
        ...formData,
      };
      await onSave(uploadData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-800 dark:to-emerald-800 p-6 text-white sticky top-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black">📁 Upload Health Record</h2>
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
            {[1, 2, 3].map((step) => (
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
                {step < 3 && <div className={`h-1 flex-1 rounded-full ${step < currentStep ? 'bg-emerald-400' : 'bg-white/30'}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="text-xs font-bold text-white/80 mt-3">
            {currentStep === 1 && '📤 Select File & Title'}
            {currentStep === 2 && '🏷️ Classify Document'}
            {currentStep === 3 && '✅ Review & Upload'}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-5">
          
          {/* STEP 1: FILE SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* File Drop Zone */}
              <div className="border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-2xl p-8 text-center bg-teal-50/50 dark:bg-teal-950/30 space-y-3 hover:bg-teal-100 dark:hover:bg-teal-950/50 transition-colors">
                <div className="text-4xl">📄</div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Drop file here or click to upload</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">PDF, JPG, PNG, DOCX (Max 10MB)</p>

                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
                  className="hidden"
                  id="file-input"
                />

                <label
                  htmlFor="file-input"
                  className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-lg cursor-pointer transition-colors mt-2"
                >
                  Choose File
                </label>
              </div>

              {/* File Preview */}
              {file && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-start gap-3">
                  <CheckIcon size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">✓ File Selected</div>
                    <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mt-1 break-all">
                      {fileName}
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setFileName('');
                    }}
                    className="text-emerald-600 hover:text-emerald-700 cursor-pointer text-lg"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Give this record a title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Diabetes Lab Report Oct 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Tips */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-3.5">
                <div className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-start gap-2">
                  <span className="text-lg mt-0.5">💡</span>
                  <div>
                    <div>Use a clear name like "Blood Test Jan 2024" or "CT Scan Report"</div>
                    <div className="font-normal text-blue-800 dark:text-blue-300 mt-1">This helps you find it later</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CLASSIFICATION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Document Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                  What type of document is this? *
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {documentTypes.map((type) => (
                    <button
                      key={type.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, documentType: type.key })}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        formData.documentType === type.key
                          ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-500 dark:border-teal-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700'
                      }`}
                    >
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{type.label}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Record Date *
                </label>
                <input
                  type="date"
                  value={formData.recordDate}
                  onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Hospital/Doctor Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Hospital/Clinic (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., District Hospital"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Doctor Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dr. Sharma"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Diagnosis/Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Diagnosis/Summary (Optional)
                </label>
                <textarea
                  placeholder="e.g., Type-2 Diabetes, Controlled with Metformin"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white">📋 Record Details</div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Title</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{formData.title}</div>
                  </div>

                  <div className="border-t border-teal-200 dark:border-teal-800 pt-3">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Document Type</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {documentTypes.find(t => t.key === formData.documentType)?.label}
                    </div>
                  </div>

                  <div className="border-t border-teal-200 dark:border-teal-800 pt-3">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Date</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {new Date(formData.recordDate).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </div>
                  </div>

                  {formData.hospitalName && (
                    <div className="border-t border-teal-200 dark:border-teal-800 pt-3">
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Hospital/Clinic</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">{formData.hospitalName}</div>
                    </div>
                  )}

                  {formData.diagnosis && (
                    <div className="border-t border-teal-200 dark:border-teal-800 pt-3">
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Diagnosis</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">{formData.diagnosis}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-start gap-3">
                <CheckIcon size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">✓ Ready to Upload</div>
                  <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mt-1">
                    Your record will be scanned for medical terms and organized automatically. You'll receive SMS+WhatsApp confirmation.
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
                ← Back
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="px-4 py-3 min-h-[44px] text-xs font-bold bg-teal-600 dark:bg-teal-700 text-white rounded-xl hover:bg-teal-700 dark:hover:bg-teal-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ArrowRightIcon size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-3 min-h-[44px] text-xs font-bold bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-800 transition-colors cursor-pointer flex items-center gap-2"
              >
                <CloudUploadIcon size={16} /> Upload & Organize
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthVaultUploadWizard;
