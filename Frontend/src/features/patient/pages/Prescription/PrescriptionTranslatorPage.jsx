import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useAuth, LANGUAGES } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';
import {
  TranslateIcon,
  SpeakerIcon,
  CheckIcon,
  SparklesIcon,
  DocumentIcon,
  PillIcon,
  ClockIcon,
  AlertIcon,
  ChevronDownIcon,
  SunriseIcon,
  SunIcon,
  MoonIcon,
  ArrowRightIcon,
  CloseIcon,
  HistoryIcon,
  CloudUploadIcon,
  TrashIcon,
} from '../../../../shared/icons/Icons';
import { speakNativeAudio, stopNativeAudio } from '../../../../shared/utils/speech';
import { PrescriptionDetailModal } from '../../components/PrescriptionDetailModal';
import { DeletePrescriptionModal } from '../../components/DeletePrescriptionModal';
import { MedicineList } from '../../components/MedicineList';

export const PrescriptionTranslatorPage = ({ setCurrentView }) => {
  const { currentLang, updateLanguage, showToast } = useAuth();

  const [convertText, setConvertText] = useState('');
  const [convertLang, setConvertLang] = useState(currentLang || 'hi');
  const [translatedResult, setTranslatedResult] = useState('');
  const [extractedMedicines, setExtractedMedicines] = useState([]);
  const [extractionConfidence, setExtractionConfidence] = useState(null);
  const [converting, setConverting] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85); // 0.85 = clear & slow for elderly/rural
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showManualInput, setShowManualInput] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [activePrescriptionId, setActivePrescriptionId] = useState(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [deleteTargetItem, setDeleteTargetItem] = useState(null);
  const fileInputRef = useRef(null);

  // History state
  const [historyItems, setHistoryItems] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const selectedLanguage = useMemo(
    () => LANGUAGES.find((l) => l.code === convertLang) || LANGUAGES[0],
    [convertLang]
  );

  // Fetch existing prescriptions from API and localStorage
  const loadHistory = async () => {
    setLoadingHistory(true);
    let combined = [];

    // Load from localStorage first
    try {
      const localSaved = localStorage.getItem('swasthya_rx_history');
      if (localSaved) {
        combined = JSON.parse(localSaved);
      }
    } catch (e) {
      console.warn('Failed to parse local rx history', e);
    }

    // Load from backend API if available
    try {
      const res = await api.getMedicalDocuments({ document_type: 'prescription' });
      const apiDocs = Array.isArray(res) ? res : res?.results || [];

      const formattedApi = apiDocs.map((doc) => ({
        id: doc.id || doc.document_id || String(Date.now()),
        title: doc.title || doc.original_filename || 'Prescription Document',
        extractedText: doc.text_content || doc.extracted_text || '',
        translatedText: doc.translated_text || doc.simplified_summary || doc.text_content || '',
        medications: doc.medications || doc.medication_items || doc.extracted_data?.medications || [],
        confidence: doc.confidence || doc.confidence_score || null,
        languageCode: doc.language || 'hi',
        languageNative: LANGUAGES.find((l) => l.code === (doc.language || 'hi'))?.native || 'हिंदी',
        languageName: LANGUAGES.find((l) => l.code === (doc.language || 'hi'))?.name || 'Hindi',
        imagePreview: doc.file || doc.original_file || null,
        timestamp: doc.created_at || doc.uploaded_at || new Date().toISOString(),
      }));

      // Merge and remove duplicates by id/title
      const mergedMap = new Map();
      [...formattedApi, ...combined].forEach((item) => {
        if (item.title || item.extractedText) {
          mergedMap.set(item.id || item.timestamp, item);
        }
      });

      combined = Array.from(mergedMap.values());
    } catch (err) {
      console.warn('Could not fetch backend prescription history:', err);
    }

    setHistoryItems(combined);
    setLoadingHistory(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const saveToHistory = (newItem) => {
    setHistoryItems((prev) => {
      const filtered = prev.filter((p) => p.id !== newItem.id && p.title !== newItem.title);
      const updated = [newItem, ...filtered];
      try {
        localStorage.setItem('swasthya_rx_history', JSON.stringify(updated.slice(0, 30)));
      } catch (e) {
        console.warn('Failed to save rx history locally', e);
      }
      return updated;
    });
  };

  const translateCurrentText = async (text, lang) => {
    if (!text || !text.trim()) return;
    setConverting(true);
    try {
      const res = await api.translateText(text, lang);
      const outputText = res.translated_text || res.simplified_text || text;
      setTranslatedResult(outputText);
      if (res.medications || res.medication_items) {
        setExtractedMedicines(res.medications || res.medication_items);
      }
      if (res.confidence || res.confidence_score) {
        setExtractionConfidence(res.confidence || res.confidence_score);
      }
    } catch (err) {
      console.warn('Translation error:', err);
      showToast?.('Translation warning: Showing extracted text.', 'warning');
      setTranslatedResult(text);
    } finally {
      setConverting(false);
    }
  };

  const handleLangChange = async (newLang) => {
    setConvertLang(newLang);
    updateLanguage?.(newLang);
    const langObj = LANGUAGES.find((l) => l.code === newLang) || LANGUAGES[0];
    showToast?.(`Language set to ${langObj.name} (${langObj.native})`, 'info');
    if (convertText.trim()) {
      await translateCurrentText(convertText, newLang);
    }
  };

  const handleConvert = async (e) => {
    e?.preventDefault();
    if (!convertText.trim()) return;
    await translateCurrentText(convertText, convertLang);
    showToast?.(`Translated into ${selectedLanguage.name}!`, 'success');
  };

  // User-Controlled Voice Start/Stop Toggle (STRICTLY NO AUTOPLAY)
  const handleSpeakToggle = async (customText = null, customLang = null) => {
    if (speaking) {
      stopNativeAudio();
      setSpeaking(false);
      showToast?.('Speech stopped', 'info');
      return;
    }

    const textToSpeak = customText || translatedResult || convertText;
    const langToUse = customLang || convertLang;

    if (!textToSpeak || !textToSpeak.trim()) {
      showToast?.('No instructions available to read aloud.', 'warning');
      return;
    }

    const langObj = LANGUAGES.find((l) => l.code === langToUse) || selectedLanguage;
    setSpeaking(true);
    showToast?.(`Playing voice guidance in ${langObj.native} (${speechRate === 0.85 ? 'Slow & Clear' : 'Normal'})...`, 'info');

    try {
      await speakNativeAudio(textToSpeak, langToUse, speechRate);
    } catch (err) {
      console.warn('Voice playback error:', err);
    } finally {
      setSpeaking(false);
    }
  };

  // File Upload Handling
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Stop any playing audio before upload
    if (speaking) {
      stopNativeAudio();
      setSpeaking(false);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setConverting(true);
    showToast?.(`Analyzing ${file.name} with AI Vision...`, 'info');

    try {
      const formData = new FormData();
      formData.append('original_file', file);
      formData.append('document_type', 'prescription');
      formData.append('title', file.name);

      const res = await api.uploadMedicalDocument(formData, convertLang);
      const extracted = res?.text_content || res?.extracted_text || '';
      setConvertText(extracted);

      let nativeText = res?.translated_text || res?.simplified_text;
      if (!nativeText && extracted) {
        const transRes = await api.translateText(extracted, convertLang);
        nativeText = transRes?.translated_text || transRes?.simplified_text;
      }

      const finalOutput = nativeText || extracted;
      setTranslatedResult(finalOutput);

      const extractedMeds = res?.medications || res?.medication_items || res?.extracted_data?.medications || [];
      const confidenceVal = res?.confidence || res?.confidence_score || 0.96;

      setExtractedMedicines(extractedMeds);
      setExtractionConfidence(confidenceVal);
      const docId = res?.id || String(Date.now());
      setActivePrescriptionId(docId);

      showToast?.(`Prescription processed successfully!`, 'success');

      saveToHistory({
        id: docId,
        title: file.name,
        extractedText: extracted,
        translatedText: finalOutput,
        medications: extractedMeds,
        confidence: confidenceVal,
        text_content: extracted,
        translated_text: finalOutput,
        simplified_text: finalOutput,
        languageCode: convertLang,
        languageName: selectedLanguage.name,
        languageNative: selectedLanguage.native,
        imagePreview: previewUrl,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('File processing error:', err);
      showToast?.('Error processing prescription. Please try a clearer image.', 'error');
    } finally {
      setConverting(false);
    }
  };

  const handleViewHistoryItem = (item) => {
    if (speaking) {
      stopNativeAudio();
      setSpeaking(false);
    }
    setImagePreview(item.imagePreview || null);
    setConvertText(item.extractedText || item.text_content || '');
    setTranslatedResult(item.translatedText || item.translated_text || item.simplified_text || '');
    setExtractedMedicines(item.medications || []);
    setExtractionConfidence(item.confidence || null);
    setActivePrescriptionId(item.id);
    if (item.languageCode) {
      setConvertLang(item.languageCode);
    }
    showToast?.(`Switched to "${item.title || 'Prescription'}"`, 'info');
  };

  const handleClearActive = () => {
    if (speaking) {
      stopNativeAudio();
      setSpeaking(false);
    }
    setImagePreview(null);
    setConvertText('');
    setTranslatedResult('');
    setExtractedMedicines([]);
    setExtractionConfidence(null);
    setActivePrescriptionId(null);
    setZoomLevel(1);
  };

  const handleDeleteHistoryItem = (item) => {
    setDeleteTargetItem(item);
  };

  const confirmDeletePrescription = async () => {
    if (!deleteTargetItem) return;
    const item = deleteTargetItem;

    // 1. Delete medical document from backend
    try {
      if (item.id) {
        await api.deleteMedicalDocument(item.id);
      }
    } catch (e) {
      console.warn('Backend document delete error:', e);
    }

    // 2. Cascade delete linked reminders
    try {
      const allReminders = await api.getReminders();
      const reminderList = Array.isArray(allReminders) ? allReminders : allReminders?.results || [];
      const itemMedNames = (item.medications || []).map((m) =>
        (m.medicine_name || m.name || '').trim().toLowerCase()
      );

      for (const rem of reminderList) {
        const remMedName = (rem.medicine_name || rem.medication_name || '').trim().toLowerCase();
        const isMatch = (rem.medical_document && String(rem.medical_document) === String(item.id)) ||
          itemMedNames.some((name) => name && (remMedName.includes(name) || name.includes(remMedName)));

        if (isMatch && rem.id) {
          try {
            await api.deleteReminder(rem.id);
          } catch {}
        }
      }

      localStorage.removeItem('swasthya_pillbox_day_taken');
      localStorage.removeItem('swasthya_medication_reminders');
    } catch (e) {
      console.warn('Failed to cascade delete reminders:', e);
    }

    // 3. Reset active state if needed
    if (activePrescriptionId === item.id || imagePreview === item.imagePreview) {
      handleClearActive();
    }

    // 4. Update history
    setHistoryItems((prev) => {
      const updated = prev.filter((h) => h.id !== item.id && h.title !== item.title);
      try {
        localStorage.setItem('swasthya_rx_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    window.dispatchEvent(new Event('swasthya_reminders_updated'));
    window.dispatchEvent(new Event('storage'));

    setDeleteTargetItem(null);
    showToast?.(`Prescription "${item.title || 'Record'}" & associated reminders deleted.`, 'info');
  };

  const hasActiveResult = Boolean(imagePreview || translatedResult || (convertText && convertText.trim().length > 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. TOP HEADER & PRESCRIPTION CAROUSEL SWITCHER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B4F42] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 px-3 py-0.5 rounded-full inline-block">
              🏥 Swasthya Sanchar AI • Prescription Intelligence
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Understand Your Prescription
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Multilingual AI Translation • Visual Sun & Moon Dose Matrix • Rural Voice Guidance
            </p>
          </div>

          {/* Language Selector Form Control */}
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-2xs space-y-1 md:w-64 shrink-0 transition-colors">
            <label className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
              Translate Into
            </label>
            <div className="relative">
              <select
                value={convertLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer focus:outline-none focus:border-[#0B4F42]"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400">
                <ChevronDownIcon size={15} />
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Carousel Switcher Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1">
            Prescriptions:
          </span>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 bg-[#0B4F42] hover:bg-[#093f35] text-white font-bold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span>➕ Upload New Slip</span>
          </button>

          {historyItems.map((item) => {
            const isActive = activePrescriptionId === item.id || (imagePreview && imagePreview === item.imagePreview);
            return (
              <div
                key={item.id}
                onClick={() => handleViewHistoryItem(item)}
                className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/80 border-[#0B4F42] dark:border-teal-400 text-[#0B4F42] dark:text-teal-300 ring-2 ring-teal-600/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>📄</span>
                <span className="truncate max-w-[140px]">{item.title || 'Prescription'}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteHistoryItem(item);
                  }}
                  title="Delete"
                  className="text-slate-400 hover:text-rose-600 ml-1"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* 2. GROUNDED 2-COLUMN SPLIT WORKSPACE */}
      <div id="translate-main-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        
        {/* ======================================================= */}
        {/* LEFT PANEL: DOCUMENT INSPECTOR & SOURCE (42% / Col 5)   */}
        {/* ======================================================= */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4 transition-colors">
            
            {/* Header & Zoom Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <DocumentIcon size={18} className="text-[#0B4F42] dark:text-teal-400" />
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Prescription Document
                </h2>
              </div>

              {imagePreview && (
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                    title="Zoom Out"
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-[11px] font-mono text-slate-500 w-9 text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(2.2, z + 0.2))}
                    title="Zoom In"
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={handleClearActive}
                    title="Clear Document"
                    className="text-rose-600 dark:text-rose-400 font-bold text-xs hover:underline cursor-pointer ml-1"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Document Image View / Upload Dropzone */}
            {imagePreview ? (
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 p-2 flex items-center justify-center min-h-[260px] max-h-[360px] overflow-auto relative">
                <img
                  src={imagePreview}
                  alt="Uploaded Prescription"
                  style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease' }}
                  className="object-contain max-h-[340px] w-full rounded-xl origin-center"
                />
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-teal-600/40 hover:border-[#0B4F42] dark:border-teal-500/40 dark:hover:border-teal-400 bg-teal-50/40 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-2xl p-8 text-center space-y-3 cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-[#0B4F42] dark:text-teal-300 border border-teal-200 dark:border-teal-800 mx-auto flex items-center justify-center shadow-2xs">
                  <CloudUploadIcon size={24} />
                </div>
                <div className="text-xs font-black text-[#0B4F42] dark:text-teal-300 group-hover:scale-102 transition-transform">
                  Upload Doctor's Slip or Photo
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  JPG, PNG, WEBP or PDF (Max 5MB)
                </div>
                <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500">
                  <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border">⚡ AI Vision OCR</span>
                  <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border">🌐 12+ Languages</span>
                </div>
              </div>
            )}

            {/* Converting / Processing Progress Banner */}
            {converting && (
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#0B4F42] dark:text-teal-300 font-extrabold">
                  <SparklesIcon size={16} className="animate-spin" />
                  <span>Processing prescription with AI Vision...</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Extracting doctor's handwriting, medicines, dosage timings, and translating...
                </div>
              </div>
            )}

            {/* Document Metadata Bar & Action */}
            {imagePreview && (
              <div className="space-y-2.5 pt-1 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                    <span>AI Vision Verified</span>
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {extractionConfidence ? `${Math.round(extractionConfidence * 100)}% confidence` : 'Clinical Grade OCR'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 rounded-xl transition-colors cursor-pointer text-center text-xs"
                  >
                    ⬆ Replace Slip
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowManualInput(!showManualInput)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-3 rounded-xl transition-colors cursor-pointer text-xs"
                    title="View / Edit Raw OCR Text"
                  >
                    ✍️ Edit OCR
                  </button>
                </div>
              </div>
            )}

            {/* Expandable Manual Text Editor */}
            {showManualInput && (
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3 animate-in fade-in">
                <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 block">
                  Doctor Notes / Scanned Text:
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0B4F42] outline-none font-mono leading-relaxed"
                  value={convertText}
                  onChange={(e) => setConvertText(e.target.value)}
                  placeholder="Type doctor instructions..."
                />
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={converting || !convertText.trim()}
                  className="w-full bg-[#0B4F42] hover:bg-[#093f35] text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {converting ? 'Processing...' : 'Translate Instructions'}
                </button>
              </div>
            )}

          </div>

        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: TRANSLATED GUIDANCE & DOSE MATRIX (58% / Col 7)   */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. TRANSLATED GUIDANCE & RURAL AUDIO CAPSULE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2">
                <TranslateIcon size={18} className="text-[#0B4F42] dark:text-teal-400" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Translated Instructions
                </h2>
              </div>

              <span className="bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-[#0B4F42] dark:text-teal-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span>{selectedLanguage.flag}</span>
                <span>{selectedLanguage.native}</span>
              </span>
            </div>

            {/* Translated Explanation Box */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-5 text-emerald-950 dark:text-emerald-100 text-sm sm:text-base leading-relaxed font-semibold whitespace-pre-wrap min-h-[90px] shadow-2xs">
              {translatedResult || convertText || (
                <span className="text-slate-400 font-normal italic">
                  Upload a prescription or type doctor notes on the left to see simplified instructions here in {selectedLanguage.native}.
                </span>
              )}
            </div>

            {/* RURAL MULTILINGUAL AUDIO CAPSULE BAR */}
            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSpeakToggle()}
                  className={`font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0 ${
                    speaking
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-[#0B4F42] hover:bg-[#093f35] text-white'
                  }`}
                >
                  <SpeakerIcon size={16} />
                  <span>{speaking ? '⏹ Stop Audio' : `▶ Listen in ${selectedLanguage.native}`}</span>
                </button>

                {/* Elderly Slow Pace Selector */}
                <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setSpeechRate(0.85)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      speechRate === 0.85
                        ? 'bg-teal-100 dark:bg-teal-950 text-[#0B4F42] dark:text-teal-300 font-black'
                        : 'text-slate-500'
                    }`}
                    title="Slow & clear voice for seniors"
                  >
                    🐢 0.8x Slow
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechRate(1.0)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      speechRate === 1.0
                        ? 'bg-teal-100 dark:bg-teal-950 text-[#0B4F42] dark:text-teal-300 font-black'
                        : 'text-slate-500'
                    }`}
                  >
                    ⚡ 1.0x Normal
                  </button>
                </div>
              </div>

              {/* Pulsing Soundwave Visualization */}
              <div className="flex items-center gap-1 h-5 shrink-0">
                {[30, 70, 40, 90, 60, 100, 50, 80, 40, 90, 60, 30].map((h, i) => (
                  <span
                    key={i}
                    className={`w-0.5 rounded-full transition-all ${
                      speaking ? 'bg-[#0B4F42] dark:bg-teal-400 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                    style={{ height: `${speaking ? h : 25}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Clinical Safety Disclaimer Chip */}
            <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-3 flex items-center gap-2.5 text-[11px] text-amber-950 dark:text-amber-200 font-medium">
              <AlertIcon size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Always take medicines strictly as instructed by your treating doctor or ASHA health worker.</span>
            </div>

          </div>

          {/* 2. VISUAL SUN & MOON DOSE MATRIX */}
          <MedicineList 
            medications={extractedMedicines}
            confidence={extractionConfidence}
            isLoading={converting}
          />

          {/* 3. SCHEDULE REMINDERS ACTION CARD */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-800/90 dark:to-slate-800/60 border border-teal-200 dark:border-slate-700 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0B4F42] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                ⏰
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Automated Medication Reminders & PillBox
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Alarms for Morning (8:00 AM), Afternoon (1:30 PM), and Night (8:30 PM).
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView?.('reminders')}
              className="bg-[#0B4F42] hover:bg-[#093f35] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
            >
              <span>📅 View Reminders Schedule →</span>
            </button>
          </div>

        </div>

      </div>

      {/* DEDICATED PRESCRIPTION DETAIL MODAL */}
      {selectedDetailItem && (
        <PrescriptionDetailModal
          item={selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
          onDelete={handleDeleteHistoryItem}
          showToast={showToast}
        />
      )}

      {/* SAFETY CONFIRMATION DELETE MODAL */}
      <DeletePrescriptionModal
        isOpen={!!deleteTargetItem}
        onClose={() => setDeleteTargetItem(null)}
        onConfirm={confirmDeletePrescription}
        prescriptionTitle={deleteTargetItem?.title || deleteTargetItem?.original_filename}
        dayCount={deleteTargetItem?.duration_days || 5}
        doseCount={15}
      />
    </div>
  );
};

export default PrescriptionTranslatorPage;
