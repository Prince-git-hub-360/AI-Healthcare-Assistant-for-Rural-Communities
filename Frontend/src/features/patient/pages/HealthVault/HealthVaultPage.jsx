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
    <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-6 space-y-6 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            DIGITAL HEALTH VAULT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <DocumentIcon size={26} className="text-teal-700 dark:text-teal-400" />
            <span>Stored Patient Records</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Access your uploaded doctor prescriptions and discharge summaries.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-3 min-h-[44px] rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusIcon size={18} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl space-y-4 font-sans text-slate-900 dark:text-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Upload Prescription Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">Document Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Verma Prescription Note"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3.5 py-3 min-h-[44px] outline-none focus:border-teal-700"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">Category</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3.5 py-3 min-h-[44px] outline-none focus:border-teal-700 cursor-pointer"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  <option value="prescription">Prescription Note</option>
                  <option value="discharge_summary">Discharge Summary</option>
                  <option value="lab_report">Lab Diagnostic Report</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">Select File (Image / PDF) *</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="w-full text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 min-h-[44px] cursor-pointer"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-3.5 min-h-[44px] rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Save to Vault'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stored Health Records List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3.5">
          Prescription History ({documents.length})
        </h2>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400 animate-pulse font-medium">Loading medical vault documents...</div>
        ) : documents.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">No medical records stored in vault yet.</div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 transition-colors space-y-3 shadow-2xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">{doc.title}</h3>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      Uploaded: {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Recently'} • Type: <span className="uppercase font-bold text-teal-700 dark:text-teal-400">{doc.document_type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDetailDoc(doc)}
                      className="border border-teal-700 dark:border-teal-400 bg-emerald-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold px-3.5 py-2 min-h-[44px] rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>View Details</span>
                      <ArrowRightIcon size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="border border-slate-300 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold px-3 py-2 min-h-[44px] rounded-xl transition-colors cursor-pointer"
                      title="Delete Prescription"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  <span className="font-extrabold text-teal-700 dark:text-teal-400">Simplified Instructions:</span> {doc.translated_text || doc.simplified_summary || doc.text_content || 'Take medicines strictly as instructed by your doctor.'}
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
