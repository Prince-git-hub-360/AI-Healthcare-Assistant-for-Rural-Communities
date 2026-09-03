import React, { useState } from 'react';
import { DocumentIcon, CheckIcon, SparklesIcon } from '../../../shared/icons/Icons';

export const UploadDocumentModal = ({ isOpen, onClose, showToast }) => {
  const [patientName, setPatientName] = useState('Lakshmi Devi');
  const [docType, setDocType] = useState('Prescription');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  if (!isOpen) return null;

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      if (showToast) showToast(`✅ Document Uploaded & Synced to ${patientName}'s ABDM Health Locker!`, 'success');
      onClose();
    }, 1200);
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
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-[#0B3B74] dark:text-sky-300 flex items-center justify-center text-xl">
            📤
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Upload Health Document
            </h2>
            <p className="text-xs text-slate-500">
              Syncs to National Digital Health Locker (ABDM)
            </p>
          </div>
        </div>

        <form onSubmit={handleSimulateUpload} className="space-y-3 pt-2">
          
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Select Patient *</label>
            <select
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none"
            >
              <option value="Lakshmi Devi">Lakshmi Devi (54 / F • Gejjalagere)</option>
              <option value="Ravi Kumar">Ravi Kumar (60 / M • Gejjalagere)</option>
              <option value="Meena Devi">Meena Devi (28 / F • Gejjalagere)</option>
              <option value="Sunil Kumar">Sunil Kumar (35 / M • Gejjalagere)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Document Category *</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none"
            >
              <option value="Prescription">Doctor Prescription Slip</option>
              <option value="Lab Report">Blood Test / Lab Diagnostic Report</option>
              <option value="ANC Mother Card">Maternal ANC Mother &amp; Child Card (MCP)</option>
              <option value="Discharge Summary">Hospital Discharge Summary</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-800/50 space-y-2">
            <span className="text-2xl">📄</span>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Take Photo of Physical Document or Upload PDF/JPG
            </div>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setUploadedFile(e.target.files[0])}
              className="text-xs text-slate-500 mx-auto block cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-[#0B3B74] hover:bg-[#072448] text-white font-black text-xs py-3 rounded-2xl shadow-md transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading to ABDM Vault...</span>
              </>
            ) : (
              <>
                <CheckIcon size={16} color="#fff" />
                <span>Upload &amp; Attach to Patient Locker</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

export default UploadDocumentModal;
