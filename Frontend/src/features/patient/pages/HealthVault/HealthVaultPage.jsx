import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';
import {
  DocumentIcon,
  ShieldIcon,
  PlusIcon,
  ArrowRightIcon,
  SearchIcon,
  PlayIcon,
  CheckIcon,
  HeartIcon,
  SparklesIcon,
  SpeakerIcon,
} from '../../../../shared/icons/Icons';
import { speakNativeAudio, stopNativeAudio } from '../../../../shared/utils/speech';
import { PrescriptionDetailModal } from '../../components/PrescriptionDetailModal';
import { HealthVaultUploadWizard } from '../../components/HealthVaultUploadWizard';

export const HealthVaultPage = () => {
  const { user, currentLang, showToast } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [useWizardUpload, setUseWizardUpload] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'prescription', 'diagnostic_report', 'discharge_summary', 'radiology_scan', 'immunization'
  const [viewMode, setViewMode] = useState('folders'); // 'folders' | 'timeline'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [playingDocId, setPlayingDocId] = useState(null);

  // Upload modal form state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('prescription');
  const [hospitalName, setHospitalName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const [selectedDetailDoc, setSelectedDetailDoc] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await api.getMedicalDocuments();
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data?.results) list = data.results;

      // STRICTLY REAL DATA: No hardcoded dummy records
      setDocuments(list);
    } catch (err) {
      console.error('Failed to load medical documents:', err);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
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
    formData.append('hospital_name', hospitalName);
    formData.append('doctor_name', doctorName);
    formData.append('record_date', recordDate || new Date().toISOString().split('T')[0]);
    formData.append('diagnosis', diagnosis);
    formData.append('file', file);

    try {
      const res = await api.uploadMedicalDocument(formData);
      if (showToast) showToast('Health record uploaded & categorized successfully!', 'success');
      setShowUploadModal(false);
      resetForm();
      fetchDocs();
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to upload document. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDocumentType('prescription');
    setHospitalName('');
    setDoctorName('');
    setRecordDate('');
    setDiagnosis('');
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to remove this record from your vault?')) return;
    try {
      await api.deleteMedicalDocument(docId);
      if (showToast) showToast('Record removed from vault.', 'info');
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch {
      if (showToast) showToast('Failed to remove record.', 'error');
    }
  };

  const playVoiceSummary = async (doc) => {
    if (playingDocId === doc.id) {
      stopNativeAudio();
      setPlayingDocId(null);
      return;
    }

    const textToSpeak = doc.translated_text || doc.simplified_summary || doc.diagnosis || `${doc.title} at ${doc.hospital_name || 'Hospital'}`;
    setPlayingDocId(doc.id);
    if (showToast) showToast(`Reading record aloud...`, 'info');
    await speakNativeAudio(textToSpeak, currentLang || 'hi');
    setPlayingDocId(null);
  };

  // Filter documents based on Category, Search Query, and Year
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Category filter
      if (activeCategory !== 'all' && doc.document_type !== activeCategory) {
        return false;
      }

      // Year filter
      if (selectedYear !== 'all') {
        const docDate = doc.record_date || doc.created_at;
        if (docDate && !docDate.startsWith(selectedYear)) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = doc.title?.toLowerCase().includes(q);
        const matchesHospital = doc.hospital_name?.toLowerCase().includes(q);
        const matchesDoctor = doc.doctor_name?.toLowerCase().includes(q);
        const matchesDiagnosis = doc.diagnosis?.toLowerCase().includes(q);
        const matchesSummary = doc.simplified_summary?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesHospital && !matchesDoctor && !matchesDiagnosis && !matchesSummary) {
          return false;
        }
      }

      return true;
    });
  }, [documents, activeCategory, selectedYear, searchQuery]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts = {
      all: documents.length,
      prescription: 0,
      diagnostic_report: 0,
      discharge_summary: 0,
      radiology_scan: 0,
      immunization: 0,
    };
    documents.forEach((d) => {
      if (counts[d.document_type] !== undefined) {
        counts[d.document_type]++;
      }
    });
    return counts;
  }, [documents]);

  const getDocTypeIcon = (type) => {
    switch (type) {
      case 'discharge_summary': return '🏥';
      case 'diagnostic_report': return '🧪';
      case 'radiology_scan': return '🩻';
      case 'immunization': return '💉';
      default: return '💊';
    }
  };

  const getDocTypeLabel = (type) => {
    switch (type) {
      case 'discharge_summary': return 'Discharge Summary';
      case 'diagnostic_report': return 'Diagnostic Report';
      case 'radiology_scan': return 'Radiology Scan';
      case 'immunization': return 'Vaccine Record';
      default: return 'Prescription (Rx)';
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-4 px-3 sm:px-6 py-4 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* ── 1. COMPACT & SLEEK HERO HEADER ── */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#0B4F42] text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-teal-500/20 border border-teal-400/40 rounded-2xl flex items-center justify-center text-teal-300 shrink-0 text-xl shadow-inner">
            📂
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                ABDM MEDICAL VAULT
              </span>
              <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                ABHA: {user?.abha_id || '91-2863-6634-3999'}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-white mt-0.5">
              Digital Health Records &amp; Medical Vault
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Categorized OPD Prescriptions, Lab Reports, Hospital Summaries &amp; Scans
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusIcon size={16} />
          <span>Upload Record</span>
        </button>
      </div>

      {/* ── 2. COMPACT SEARCH & CATEGORY FILTER BAR ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 shadow-xs space-y-3">
        
        <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by medicine, diagnosis, lab test, hospital, or doctor..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2 pl-3.5 pr-9 text-xs font-bold outline-none focus:border-teal-600"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon size={15} />
            </div>
          </div>

          {/* Year Filter & View Mode */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="all">📅 All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>

            <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('folders')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'folders'
                    ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Categories
              </button>
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Timeline
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        {viewMode === 'folders' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100 dark:border-slate-800">
            {[
              { id: 'all', label: '🌟 All Records', count: categoryCounts.all },
              { id: 'prescription', label: '💊 Prescriptions (Rx)', count: categoryCounts.prescription },
              { id: 'diagnostic_report', label: '🧪 Lab Reports', count: categoryCounts.diagnostic_report },
              { id: 'discharge_summary', label: '🏥 Discharge Summaries', count: categoryCounts.discharge_summary },
              { id: 'radiology_scan', label: '🩻 Radiology & Scans', count: categoryCounts.radiology_scan },
              { id: 'immunization', label: '💉 Vaccines', count: categoryCounts.immunization },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-[#0B4F42] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                  activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* ── 3. COMPACT & ELEGANT RECORD CARDS DISPLAY ── */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500 animate-pulse">
              Synchronizing medical documents from ABDM vault...
            </p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              📂
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              No health records found in this category
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload your doctor prescriptions, lab test reports, or hospital summaries to organize your medical history.
            </p>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#0B4F42] hover:bg-[#093f35] text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
            >
              <PlusIcon size={14} />
              <span>Upload Health Document</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredDocuments.map((doc) => {
              const formattedDate = doc.record_date || (doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Recent');
              const isPlaying = playingDocId === doc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDetailDoc(doc)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-700 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2.5"
                >
                  {/* Top Row: Icon + Title + Category Badge + Date */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0 border border-slate-200/60 dark:border-slate-700">
                        {getDocTypeIcon(doc.document_type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-sm text-slate-900 dark:text-white truncate">
                            {doc.title}
                          </h3>
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {getDocTypeLabel(doc.document_type)}
                          </span>
                          {doc.is_abnormal && (
                            <span className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                              ⚠️ Abnormal Flags
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                          <strong>{doc.hospital_name || 'Hospital / Health Centre'}</strong> {doc.doctor_name ? `• ${doc.doctor_name}` : ''}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl shrink-0">
                      📅 {formattedDate}
                    </span>
                  </div>

                  {/* Middle Row: 1-line Clinical Diagnosis snippet */}
                  {doc.diagnosis && (
                    <div className="text-xs font-semibold text-teal-900 dark:text-teal-200 bg-teal-50/50 dark:bg-teal-950/30 px-3 py-1.5 rounded-xl border border-teal-200/50 dark:border-teal-900/50 truncate">
                      🩺 <strong>Diagnosis:</strong> {doc.diagnosis}
                    </div>
                  )}

                  {/* Bottom Action Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[10px] font-black text-teal-700 dark:text-teal-400">
                      ✅ ABDM Linked
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playVoiceSummary(doc);
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                          isPlaying
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <SpeakerIcon size={13} />
                        <span>{isPlaying ? 'Stop Audio' : 'Voice'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const shareText = `*📄 Health Record: ${doc.title}*\nHospital: ${doc.hospital_name || 'Health Centre'}\nDate: ${formattedDate}\nDiagnosis: ${doc.diagnosis || 'Standard checkup'}\n\n_Shared from Swasthya Sanchar Health Vault_`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                        }}
                        className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-800 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>📲 Share</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDetailDoc(doc);
                        }}
                        className="px-3.5 py-1.5 bg-[#0B4F42] hover:bg-[#093f35] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <span>View Details</span>
                        <ArrowRightIcon size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(doc.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 4. UPLOAD NEW HEALTH RECORD MODAL (GUIDED 3-STEP WIZARD) ── */}
      {showUploadModal && useWizardUpload && (
        <HealthVaultUploadWizard
          onCancel={() => setShowUploadModal(false)}
          onSave={() => {
            setShowUploadModal(false);
            showToast?.('✅ Record uploaded to your ABHA Health Vault!', 'success');
            fetchDocs();
          }}
          showToast={showToast}
        />
      )}

      {/* ── 4B. UPLOAD NEW HEALTH RECORD MODAL (QUICK FORM) ── */}
      {showUploadModal && !useWizardUpload && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full relative shadow-2xl space-y-4 font-sans text-slate-900 dark:text-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Upload to ABHA Health Vault</h3>
                  <button
                    type="button"
                    onClick={() => setUseWizardUpload(true)}
                    className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded-md hover:bg-teal-100"
                  >
                    ✨ Wizard Mode
                  </button>
                </div>
                <p className="text-xs text-slate-500">Auto-categorized under Ayushman Bharat Digital Mission</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OPD Prescription, Blood Test, X-Ray..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold outline-none focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Document Category</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="prescription">💊 Prescription (OPD Rx)</option>
                    <option value="diagnostic_report">🧪 Diagnostic Lab Report</option>
                    <option value="discharge_summary">🏥 Hospital Discharge Summary</option>
                    <option value="radiology_scan">🩻 Radiology Scan (X-Ray / MRI)</option>
                    <option value="immunization">💉 Immunization Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Record Date</label>
                  <input
                    type="date"
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Hospital / PHC Center</label>
                  <input
                    type="text"
                    placeholder="e.g. Mandya District Hospital"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. R. Verma"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Clinical Diagnosis / Symptoms</label>
                <input
                  type="text"
                  placeholder="e.g. Type-2 Diabetes Routine Checkup"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Upload File (PDF / Image) *</label>
                <input
                  type="file"
                  required
                  accept="image/*,application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-xs font-bold text-slate-600 dark:text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-[#0B4F42] hover:bg-[#093f35] text-white text-xs font-bold px-5 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Upload Record</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 5. PRESCRIPTION & DOCUMENT DETAIL MODAL ── */}
      {selectedDetailDoc && (
        <PrescriptionDetailModal
          item={selectedDetailDoc}
          prescription={selectedDetailDoc}
          showToast={showToast}
          onDelete={(doc) => handleDelete(doc?.id || selectedDetailDoc?.id)}
          onClose={() => setSelectedDetailDoc(null)}
        />
      )}

    </div>
  );
};

export default HealthVaultPage;
