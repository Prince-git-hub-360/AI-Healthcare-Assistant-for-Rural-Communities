import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';
import { DocumentIcon, ShieldIcon, PlusIcon, ArrowRightIcon } from '../../../../shared/icons/Icons';
import { PrescriptionDetailModal } from '../../components/PrescriptionDetailModal';

export const HealthVaultPage = () => {
  const { currentLang, showToast } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('prescription');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDetailDoc, setSelectedDetailDoc] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await api.getMedicalDocuments();
      if (Array.isArray(data)) setDocuments(data);
      else if (data?.results) setDocuments(data.results);
    } catch (err) {
      setDocuments([
        { id: 1, title: 'Discharge Summary — General Hospital', document_type: 'discharge_summary', created_at: '2026-08-01', simplified_summary: 'Take Paracetamol 500mg after breakfast for 5 days. Drink warm water.', abha_tagged: true },
        { id: 2, title: 'Prescription Note — Dr. Anita Verma', document_type: 'prescription', created_at: '2026-08-05', simplified_summary: 'Amoxicillin 250mg capsule once after lunch. Complete full 3 days.', abha_tagged: true },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      if (showToast) showToast('Please provide document title and select a file.', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('document_type', documentType);
    formData.append('original_file', file);
    formData.append('target_language', currentLang);

    try {
      await api.uploadMedicalDocument(formData, currentLang);
      if (showToast) showToast('Medical document uploaded & saved to vault!', 'success');
      setTitle('');
      setFile(null);
      setShowUploadModal(false);
      fetchDocs();
    } catch (err) {
      if (showToast) showToast('Could not save document. Please try again.', 'error');
    }
    setUploading(false);
  };

  const handleDelete = async (docId) => {
    try {
      await api.deleteMedicalDocument(docId);
    } catch (err) {
      console.warn('Backend delete document warning:', err);
    }

    // Cascade delete linked reminders from LocalStorage
    try {
      const savedReminders = JSON.parse(localStorage.getItem('swasthya_medication_reminders') || '[]');
      const filteredReminders = savedReminders.filter((r) => r.prescription_id !== docId && r.doc_id !== docId);
      localStorage.setItem('swasthya_medication_reminders', JSON.stringify(filteredReminders));
      window.dispatchEvent(new Event('swasthya_reminders_updated'));
    } catch (e) {
      console.warn('Cascade delete error:', e);
    }

    setDocuments((prev) => prev.filter((d) => (d.id || d.document_id) !== docId));
    if (showToast) showToast('Prescription record & associated reminders deleted.', 'info');
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-6 space-y-6 font-sans text-stone-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#161F30] border border-stone-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="space-y-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0B4F42] dark:text-teal-400">
            DIGITAL HEALTH VAULT
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            <DocumentIcon size={24} className="text-[#0B4F42] dark:text-teal-400" />
            <span>Stored Patient Records</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 font-normal">
            Access your uploaded doctor prescriptions and discharge summaries.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-medium text-xs py-2 px-3.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <PlusIcon size={16} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl space-y-4 font-sans text-stone-900 dark:text-slate-100">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">Upload Prescription Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-stone-400 hover:text-stone-700 dark:hover:text-slate-200 text-sm font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300">Document Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Verma Prescription Note"
                  className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 text-xs rounded-lg px-3 py-2 outline-none focus:border-[#0B4F42]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300">Category</label>
                <select
                  className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 text-xs rounded-lg px-3 py-2 outline-none focus:border-[#0B4F42] cursor-pointer"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  <option value="prescription">Prescription Note</option>
                  <option value="discharge_summary">Discharge Summary</option>
                  <option value="lab_report">Lab Diagnostic Report</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300">Select File (Image / PDF) *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="w-full text-xs text-stone-600 dark:text-slate-300 bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg p-2 cursor-pointer"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-medium text-xs py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Save to Vault'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stored Health Records List */}
      <div className="bg-white dark:bg-[#161F30] border border-stone-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-4 transition-colors">
        <h2 className="text-base font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-slate-800 pb-3">
          Prescription History ({documents.length})
        </h2>

        {loading ? (
          <div className="py-8 text-center text-xs text-stone-500 dark:text-slate-400 animate-pulse">Loading medical vault documents...</div>
        ) : documents.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500 dark:text-slate-400">No medical records stored in vault yet.</div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-stone-50/80 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/60 rounded-xl p-4 transition-colors space-y-2.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-xs text-stone-900 dark:text-white">{doc.title}</h3>
                    <div className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">
                      Uploaded: {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Recently'} • Type: <span className="uppercase font-medium">{doc.document_type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDetailDoc(doc)}
                      className="border border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/60 text-[#0B4F42] dark:text-teal-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRightIcon size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="border border-stone-300 dark:border-slate-700 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/40 text-stone-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Delete Prescription"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-3 rounded-lg text-xs text-stone-800 dark:text-slate-200 leading-relaxed font-normal">
                  <span className="font-semibold text-[#0B4F42] dark:text-teal-400">Simplified Instructions:</span> {doc.translated_text || doc.simplified_summary || doc.text_content || 'Take medicines strictly as instructed by your doctor.'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DEDICATED PRESCRIPTION DETAIL MODAL */}
      {selectedDetailDoc && (
        <PrescriptionDetailModal
          item={selectedDetailDoc}
          onClose={() => setSelectedDetailDoc(null)}
          onDelete={(itemToDelete) => {
            handleDelete(itemToDelete.id);
            setSelectedDetailDoc(null);
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default HealthVaultPage;
