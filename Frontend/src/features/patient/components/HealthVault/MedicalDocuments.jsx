import React, { useState, useEffect } from 'react';
import { useAuth, LANGUAGES } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';
import { speakNativeAudio } from '../../../../shared/utils/speech';

export const MedicalDocuments = () => {
  const { user, showToast } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    document_type: 'prescription',
    language: user?.profile?.preferred_language || 'hi',
    file: null,
  });

  // Inspection Drawer & Audio Language State
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [selectedAudioLang, setSelectedAudioLang] = useState(user?.profile?.preferred_language || 'hi');
  const [activeTranslation, setActiveTranslation] = useState('');
  const [translatingDoc, setTranslatingDoc] = useState(false);

  useEffect(() => {
    if (selectedDoc) {
      const initialLang = selectedDoc.language || user?.profile?.preferred_language || 'hi';
      setSelectedAudioLang(initialLang);
      setActiveTranslation(selectedDoc.translated_text || selectedDoc.simplified_text || '');
    } else {
      setActiveTranslation('');
    }
  }, [selectedDoc, user]);

  const handleLanguageChange = async (newLang) => {
    setSelectedAudioLang(newLang);
    if (!selectedDoc) return;
    const textToTranslate = selectedDoc.text_content || selectedDoc.title;
    if (!textToTranslate) return;

    setTranslatingDoc(true);
    try {
      const res = await api.textToSpeech(textToTranslate, newLang);
      if (res && (res.translated_text || res.text)) {
        setActiveTranslation(res.translated_text || res.text);
      }
    } catch (err) {
      console.warn('Live translation error:', err);
    } finally {
      setTranslatingDoc(false);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await api.getMedicalDocuments();
      setDocuments(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch medical documents.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) {
      showToast('Please enter a document title.', 'error');
      return;
    }
    if (!uploadForm.file) {
      showToast('Please select a file to upload.', 'error');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('document_type', uploadForm.document_type);
      formData.append('language', uploadForm.language);
      formData.append('original_file', uploadForm.file);

      await api.uploadMedicalDocument(formData);
      showToast('Medical document uploaded successfully!', 'success');
      setShowUploadModal(false);
      setUploadForm({
        title: '',
        document_type: 'prescription',
        language: user?.profile?.preferred_language || 'hi',
        file: null,
      });
      fetchDocuments();
    } catch (err) {
      showToast(err.message || 'Failed to upload document.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this medical record?')) return;
    try {
      await api.deleteMedicalDocument(docId);
      showToast('Medical record deleted.', 'info');
      if (selectedDoc?.id === docId) setSelectedDoc(null);
      fetchDocuments();
    } catch (err) {
      showToast(err.message || 'Failed to delete record.', 'error');
    }
  };

  const handleSpeakText = async (text, langCode = selectedAudioLang) => {
    if (!text || !text.trim()) {
      showToast('No extracted text available to read aloud.', 'error');
      return;
    }
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    const success = await speakNativeAudio(text, langCode);
    if (!success) {
      showToast('Unable to play voice audio for this language in your browser.', 'error');
    }
    setSpeaking(false);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesTab = activeTab === 'all' || doc.document_type === activeTab;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.text_content && doc.text_content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const getDocTypeBadge = (type) => {
    switch (type) {
      case 'prescription':
        return { label: '💊 Prescription', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'discharge_summary':
        return { label: '🏥 Discharge Summary', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' };
      case 'medical_report':
        return { label: '📋 Medical Report', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
      default:
        return { label: '📄 Document', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' };
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1000px' }}>
      {/* HEADER BAR & STATS */}
      <div
        className="glass-card"
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>Medical Vault & Prescriptions</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Store, digitize, and review prescriptions, discharge cards, and lab reports with AI OCR & translation.
          </p>
        </div>

        <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setShowUploadModal(true)}>
          ➕ Upload Record
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px' }}>📄</span>
          <h4 style={{ fontSize: '20px', margin: '4px 0 2px 0' }}>{documents.length}</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Records</p>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px' }}>💊</span>
          <h4 style={{ fontSize: '20px', margin: '4px 0 2px 0', color: '#10b981' }}>
            {documents.filter((d) => d.document_type === 'prescription').length}
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Prescriptions</p>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px' }}>🏥</span>
          <h4 style={{ fontSize: '20px', margin: '4px 0 2px 0', color: '#3b82f6' }}>
            {documents.filter((d) => d.document_type === 'discharge_summary').length}
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Discharge Summaries</p>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px' }}>📋</span>
          <h4 style={{ fontSize: '20px', margin: '4px 0 2px 0', color: '#f59e0b' }}>
            {documents.filter((d) => d.document_type === 'medical_report').length}
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lab Reports</p>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Records' },
            { id: 'prescription', label: '💊 Prescriptions' },
            { id: 'discharge_summary', label: '🏥 Discharge Summaries' },
            { id: 'medical_report', label: '📋 Lab Reports' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`btn-secondary ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                borderColor: activeTab === tab.id ? '#2dd4bf' : 'rgba(255,255,255,0.1)',
                background: activeTab === tab.id ? 'rgba(20, 184, 166, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                color: activeTab === tab.id ? '#2dd4bf' : '#e2e8f0',
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="input-field"
          placeholder="🔍 Search documents or medication text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '280px', margin: 0 }}
        />
      </div>

      {/* DOCUMENT CARDS GRID */}
      {loading ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading medical records...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>📂 No medical records found</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Upload your prescriptions, discharge cards, or test reports to digitize them.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredDocs.map((doc) => {
            const badge = getDocTypeBadge(doc.document_type);
            return (
              <div
                key={doc.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '20px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: badge.color,
                        background: badge.bg,
                        border: `1px solid ${badge.color}40`,
                      }}
                    >
                      {badge.label}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {new Date(doc.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#ffffff' }}>{doc.title}</h3>

                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Uploaded by: <strong style={{ color: '#e2e8f0' }}>{doc.uploaded_by || 'Patient'}</strong>
                  </p>

                  {doc.text_content && (
                    <div
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#94a3b8',
                        marginBottom: '16px',
                        maxHeight: '60px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {doc.text_content.substring(0, 100)}...
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <button
                    className="btn-secondary"
                    style={{ flex: 1, fontSize: '12px' }}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    🔍 Read & Inspect
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ borderColor: '#ef4444', color: '#fca5a5', padding: '8px 12px' }}
                    onClick={() => handleDelete(doc.id)}
                    title="Delete record"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px' }}>Upload Medical Record</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label>Document Title <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Sitapur PHC Prescription or Blood Report"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Document Category</label>
                  <select
                    className="input-field"
                    value={uploadForm.document_type}
                    onChange={(e) => setUploadForm({ ...uploadForm, document_type: e.target.value })}
                  >
                    <option value="prescription">💊 Prescription</option>
                    <option value="discharge_summary">🏥 Discharge Summary</option>
                    <option value="medical_report">📋 Lab Report</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Document Language</label>
                  <select
                    className="input-field"
                    value={uploadForm.language}
                    onChange={(e) => setUploadForm({ ...uploadForm, language: e.target.value })}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Select File (Image or PDF) <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  className="input-field"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={uploading}>
                  {uploading ? 'Uploading & Processing...' : 'Upload Record 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECTION & READ MODAL */}
      {selectedDoc && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{selectedDoc.title}</h3>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: getDocTypeBadge(selectedDoc.document_type).color,
                    background: getDocTypeBadge(selectedDoc.document_type).bg,
                  }}
                >
                  {getDocTypeBadge(selectedDoc.document_type).label}
                </span>
              </div>

              <button
                onClick={() => {
                  if (speaking) window.speechSynthesis.cancel();
                  setSelectedDoc(null);
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '22px', cursor: 'pointer' }}
              >
                ✖
              </button>
            </div>

            {selectedDoc.original_file && (
              <div
                style={{
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.25)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '13px', color: '#2dd4bf' }}>📎 Attached Original Document File</span>
                <a
                  href={selectedDoc.original_file}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ textDecoration: 'none', fontSize: '12px' }}
                >
                  ⬇️ Open / Download File
                </a>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--text-muted)' }}>📄 Extracted Text Content (AI OCR)</h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    className="input-field"
                    style={{ width: 'auto', padding: '4px 8px', fontSize: '12px', margin: 0 }}
                    value={selectedAudioLang}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    title="Choose Language for Translation & Voice"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn-demo"
                    onClick={() => handleSpeakText(activeTranslation || selectedDoc.translated_text || selectedDoc.text_content, selectedAudioLang)}
                    style={{ padding: '4px 12px', fontSize: '12px', fontWeight: '600' }}
                  >
                    {speaking ? '⏸️ Stop Audio' : '🔊 Play Audio'}
                  </button>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: '#e2e8f0',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  border: '1px solid rgba(255,255,255,0.1)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {selectedDoc.text_content || 'No text extracted yet or OCR processing in progress.'}
              </div>
            </div>

            {(activeTranslation || selectedDoc.translated_text || translatingDoc) && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', color: '#2dd4bf', marginBottom: '8px' }}>
                  🌐 AI Regional Guidance ({LANGUAGES.find((l) => l.code === selectedAudioLang)?.name || selectedAudioLang})
                </h4>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: '#6ee7b7',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}
                >
                  {translatingDoc ? '⏳ Translating prescription into selected language...' : (activeTranslation || selectedDoc.translated_text)}
                </div>
              </div>
            )}

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  if (speaking) window.speechSynthesis.cancel();
                  setSelectedDoc(null);
                }}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalDocuments;
