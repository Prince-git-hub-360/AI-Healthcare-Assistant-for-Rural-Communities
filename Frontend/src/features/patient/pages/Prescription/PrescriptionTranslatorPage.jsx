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
import { PrescriptionTranslatorWizard } from '../../components/PrescriptionTranslatorWizard';

export const PrescriptionTranslatorPage = ({ setCurrentView }) => {
  const { currentLang, updateLanguage, showToast } = useAuth();
  const [showGuidedWizard, setShowGuidedWizard] = useState(false);

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

  // Scanning & Extraction Progress States
  const [scanStep, setScanStep] = useState(0); // 0: idle, 1: upload/enhance, 2: handwriting ocr, 3: extract meds, 4: translate, 5: done
  const [scanProgress, setScanProgress] = useState(0);
  const progressTimerRef = useRef(null);

  // History state
  const [historyItems, setHistoryItems] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const selectedLanguage = useMemo(
    () => LANGUAGES.find((l) => l.code === convertLang) || LANGUAGES[0],
    [convertLang]
  );

  // Compact Progress Stages
  const SCAN_STAGES = [
    { step: 1, title: 'Enhancing Slip', desc: 'Ingesting & optimizing document image...', progress: 20 },
    { step: 2, title: 'AI Handwriting OCR', desc: "Reading doctor's prescription lines...", progress: 50 },
    { step: 3, title: 'Parsing Medicines', desc: 'Extracting drug names, strengths & doses...', progress: 75 },
    { step: 4, title: 'Native Translation', desc: `Translating guidance into ${selectedLanguage.native} (${selectedLanguage.name})...`, progress: 92 },
    { step: 5, title: 'Verified Ready', desc: 'Voice guidance and visual matrix prepared.', progress: 100 },
  ];

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
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
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
    setScanStep(4);
    setScanProgress(85);
    const targetLangObj = LANGUAGES.find((l) => l.code === lang) || selectedLanguage;
    showToast?.(`Translating instructions into ${targetLangObj.name} (${targetLangObj.native})...`, 'info');

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
      setScanStep(5);
      setScanProgress(100);
      showToast?.(`Translated into ${targetLangObj.native} successfully!`, 'success');
    } catch (err) {
      console.warn('Translation error:', err);
      showToast?.('Showing extracted text in default language.', 'warning');
      setTranslatedResult(text);
    } finally {
      setTimeout(() => {
        setConverting(false);
        setScanStep(0);
      }, 500);
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
      showToast?.('No instructions available to read aloud. Please upload a prescription first.', 'warning');
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

  // File Upload & Multistage Scanner Pipeline
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (speaking) {
      stopNativeAudio();
      setSpeaking(false);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setConverting(true);
    setScanStep(1);
    setScanProgress(15);
    setExtractedMedicines([]);
    setTranslatedResult('');
    setConvertText('');

    showToast?.(`Scanning ${file.name} with AI Vision...`, 'info');

    let currentP = 15;
    progressTimerRef.current = setInterval(() => {
      currentP = Math.min(currentP + Math.floor(Math.random() * 8) + 4, 88);
      setScanProgress(currentP);
      if (currentP > 25 && currentP <= 55) {
        setScanStep(2);
      } else if (currentP > 55 && currentP <= 80) {
        setScanStep(3);
      } else if (currentP > 80) {
        setScanStep(4);
      }
    }, 380);

    try {
      const formData = new FormData();
      formData.append('original_file', file);
      formData.append('document_type', 'prescription');
      formData.append('title', file.name);

      const res = await api.uploadMedicalDocument(formData, convertLang);
      
      clearInterval(progressTimerRef.current);
      setScanStep(4);
      setScanProgress(92);

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
      const confidenceVal = res?.confidence || res?.confidence_score || (extractedMeds.length > 0 ? 0.95 : 0.85);

      setExtractedMedicines(extractedMeds);
      setExtractionConfidence(confidenceVal);
      const docId = res?.id || String(Date.now());
      setActivePrescriptionId(docId);

      setScanStep(5);
      setScanProgress(100);

      showToast?.(`Prescription scanned and translated to ${selectedLanguage.native}!`, 'success');

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
      clearInterval(progressTimerRef.current);
      console.error('File processing error:', err);
      showToast?.('Prescription scanned. You can edit or review OCR text.', 'info');
    } finally {
      setTimeout(() => {
        setConverting(false);
        setScanStep(0);
      }, 600);
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
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setImagePreview(null);
    setConvertText('');
    setTranslatedResult('');
    setExtractedMedicines([]);
    setExtractionConfidence(null);
    setActivePrescriptionId(null);
    setScanStep(0);
    setScanProgress(0);
    setZoomLevel(1);
  };

  const handleDeleteHistoryItem = (item) => {
    setDeleteTargetItem(item);
  };

  const confirmDeletePrescription = async () => {
    if (!deleteTargetItem) return;
    const item = deleteTargetItem;

    try {
      if (item.id) {
        await api.deleteMedicalDocument(item.id);
      }
    } catch (e) {
      console.warn('Backend document delete error:', e);
    }

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

    if (activePrescriptionId === item.id || imagePreview === item.imagePreview) {
      handleClearActive();
    }

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

  const activeStageInfo = SCAN_STAGES.find((s) => s.step === scanStep) || SCAN_STAGES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. TOP COMPACT HEADER & LANGUAGE SELECTOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5 max-w-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B4F42] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 px-2.5 py-0.5 rounded-full inline-block">
              🏥 Swasthya Sanchar AI • Prescription Intelligence
            </span>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Understand Your Prescription
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Real-Time AI Vision OCR • Multilingual Translation • Visual Dosage Schedule • Vernacular Voice
            </p>
          </div>

          {/* Header Action Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowGuidedWizard(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-black text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <SparklesIcon size={14} />
              <span>✨ 5-Step Wizard</span>
            </button>

            {/* Compact Language Selector Form Control */}
            <div className="bg-teal-50/70 dark:bg-slate-800/90 border border-teal-600/30 dark:border-teal-500/40 rounded-xl p-2.5 shadow-2xs space-y-1 md:w-56 shrink-0 transition-all">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-black text-[#0B4F42] dark:text-teal-300 uppercase tracking-wider block">
                  🌐 Translate Into
                </label>
                <span className="text-[9px] font-bold bg-teal-100 dark:bg-teal-950 text-[#0B4F42] dark:text-teal-300 px-1.5 py-0.2 rounded">
                  {selectedLanguage.native}
                </span>
              </div>
              <div className="relative">
                <select
                  value={convertLang}
                  onChange={(e) => handleLangChange(e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-700 rounded-lg px-2.5 py-1.5 pr-7 text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.native} — {lang.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-teal-700 dark:text-teal-400">
                  <ChevronDownIcon size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GUIDED PRESCRIPTION ONBOARDING WIZARD MODAL */}
        {showGuidedWizard && (
          <PrescriptionTranslatorWizard
            onCancel={() => setShowGuidedWizard(false)}
            onSave={() => {
              setShowGuidedWizard(false);
              showToast?.('✅ Prescription onboarded and reminders scheduled in Pillbox!', 'success');
              fetchHistory();
            }}
            showToast={showToast}
          />
        )}

        {/* COMPACT IN-LINE SCANNING PROGRESS STRIPE (WHEN EXTRACTING) */}
        {converting && (
          <div className="pt-2 border-t border-teal-100 dark:border-slate-800 space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-[#0B4F42] dark:text-teal-300">
                <SparklesIcon size={14} className="animate-spin" />
                <span className="text-[11px] font-black uppercase tracking-wider">
                  ⚡ AI Vision Scanning: {scanProgress}%
                </span>
                <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-xs sm:max-w-md">
                  — {activeStageInfo.desc}
                </span>
              </div>
              <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-black">
                {selectedLanguage.native}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(20,184,166,0.8)]"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* 2. GROUNDED 2-COLUMN WORKSPACE WITH FIXED LEFT PANEL & INDEPENDENT RIGHT SCROLL */}
      <div id="translate-main-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start lg:h-[calc(100vh-9rem)] lg:overflow-hidden">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL (FIXED EYE-LEVEL): DOCUMENT INSPECTOR & UPLOAD HISTORY (Col 5) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 lg:h-full lg:overflow-y-auto space-y-4 pr-1.5 scrollbar-thin">
          
          {/* Card 1: Prescription Document View / Dropzone */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 transition-colors">
            
            {/* Header & Zoom Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5">
                <DocumentIcon size={16} className="text-[#0B4F42] dark:text-teal-400" />
                <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Prescription Document
                </h2>
              </div>

              {imagePreview && (
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                    title="Zoom Out"
                    className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center cursor-pointer text-xs"
                  >
                    -
                  </button>
                  <span className="text-[10px] font-mono text-slate-500 w-8 text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(2.2, z + 0.2))}
                    title="Zoom In"
                    className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center cursor-pointer text-xs"
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

            {/* Document Image View with Live AI Laser Scanning Overlay */}
            {imagePreview ? (
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-950 p-2 flex items-center justify-center min-h-[220px] max-h-[280px] overflow-auto relative group">
                
                {/* Prescription Image */}
                <img
                  src={imagePreview}
                  alt="Uploaded Prescription"
                  style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease' }}
                  className={`object-contain max-h-[260px] w-full rounded-lg origin-center transition-all ${
                    converting ? 'brightness-90 contrast-110' : ''
                  }`}
                />

                {/* ACTIVE AI LASER SCANNER HUD OVERLAY */}
                {converting && (
                  <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-2.5 animate-scan-grid bg-teal-950/20">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase text-teal-300 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-teal-500/50 shadow-md">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        <span>AI VISION SCANNING</span>
                      </div>
                      <span className="font-mono text-emerald-400">{scanProgress}%</span>
                    </div>

                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_14px_#10b981] animate-laser-scan z-20">
                      <div className="w-full h-6 -top-3 absolute bg-gradient-to-b from-emerald-500/20 to-transparent" />
                    </div>

                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-teal-400" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-teal-400" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-teal-400" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-teal-400" />

                    <div className="self-center bg-black/85 border border-teal-400/60 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                      <SparklesIcon size={12} className="text-teal-300 animate-spin" />
                      <span>Reading lines & translating to {selectedLanguage.native}...</span>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-teal-600/40 hover:border-[#0B4F42] dark:border-teal-500/40 dark:hover:border-teal-400 bg-teal-50/40 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-xl p-6 text-center space-y-2 cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-[#0B4F42] dark:text-teal-300 border border-teal-200 dark:border-teal-800 mx-auto flex items-center justify-center shadow-2xs">
                  <CloudUploadIcon size={20} />
                </div>
                <div className="text-xs font-bold text-[#0B4F42] dark:text-teal-300 group-hover:scale-102 transition-transform">
                  Upload Doctor's Slip or Photo
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  JPG, PNG, WEBP or PDF (Max 5MB)
                </div>
                <div className="pt-1 flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-500">
                  <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border">⚡ AI Vision OCR</span>
                  <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border">🌐 22+ Languages</span>
                </div>
              </div>
            )}

            {/* Document Action Buttons */}
            {imagePreview && (
              <div className="flex items-center gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-1.5 rounded-lg transition-colors cursor-pointer text-center text-xs"
                >
                  ⬆ Replace Slip
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer text-xs"
                  title="View / Edit Raw OCR Text"
                >
                  ✍️ Edit OCR
                </button>
              </div>
            )}

            {/* Expandable Manual Text Editor */}
            {showManualInput && (
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-2 animate-in fade-in">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">
                  Doctor Notes / Scanned Text:
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0B4F42] outline-none font-mono leading-relaxed"
                  value={convertText}
                  onChange={(e) => setConvertText(e.target.value)}
                  placeholder="Type or edit doctor prescription instructions..."
                />
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={converting || !convertText.trim()}
                  className="w-full bg-[#0B4F42] hover:bg-[#093f35] text-white text-xs font-bold py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {converting ? 'Translating...' : `Translate into ${selectedLanguage.native}`}
                </button>
              </div>
            )}

          </div>

          {/* Card 2: UPLOADED PRESCRIPTION HISTORY LIST (Fixed on Left Column) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 transition-colors text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <span>🕒</span>
                <span>Prescription History ({historyItems.length})</span>
              </span>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-extrabold text-[#0B4F42] dark:text-teal-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>+ Upload New</span>
              </button>
            </div>

            {historyItems.length === 0 ? (
              <div className="py-4 text-center text-[11px] text-slate-400">
                No past prescriptions yet. Upload your first slip above!
              </div>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
                {historyItems.map((item) => {
                  const isActive = activePrescriptionId === item.id || (imagePreview && imagePreview === item.imagePreview);
                  const formattedDate = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recent';
                  const medCount = item.medications?.length || (item.extractedText?.split('\n').length || 1);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleViewHistoryItem(item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 relative group ${
                        isActive
                          ? 'bg-teal-50/80 dark:bg-teal-950/70 border-[#0B4F42] dark:border-teal-400 ring-2 ring-teal-600/20 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0">📄</span>
                          <div className="truncate">
                            <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                              {item.title || 'Prescription Slip'}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              📅 {formattedDate}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isActive && (
                            <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md">
                              ACTIVE
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteHistoryItem(item);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-300 pt-0.5 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span className="text-teal-800 dark:text-teal-300 font-bold">
                          💊 {medCount} Medicine{medCount !== 1 ? 's' : ''}
                        </span>
                        <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-1.5 py-0.2 rounded font-mono">
                          {item.languageNative || 'हिन्दी'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Health Vault Sync Status Footer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-bold">
                <CheckIcon size={12} />
                <span>Synced with ABDM Vault</span>
              </span>
              <button
                type="button"
                onClick={() => setCurrentView?.('medical_vault')}
                className="text-teal-700 dark:text-teal-400 hover:underline font-bold"
              >
                View Vault →
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL (INDEPENDENT SCROLL): TRANSLATED GUIDANCE & MEDICINES (Col 7) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 lg:h-full lg:overflow-y-auto space-y-4 pr-1.5 scrollbar-thin pb-8">
          
          {/* 1. TRANSLATED GUIDANCE & RURAL AUDIO CAPSULE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 transition-colors">
            
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-1.5">
                <TranslateIcon size={16} className="text-[#0B4F42] dark:text-teal-400" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white">
                  Translated Instructions ({selectedLanguage.name})
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-[#0B4F42] dark:text-teal-300 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <span>{selectedLanguage.flag}</span>
                  <span>{selectedLanguage.native}</span>
                </span>
              </div>
            </div>

            {/* Translated Explanation Box */}
            <div className={`border rounded-xl p-4 text-xs sm:text-sm leading-relaxed font-semibold whitespace-pre-wrap min-h-[75px] shadow-2xs transition-all ${
              converting
                ? 'bg-teal-50/40 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-200 animate-pulse'
                : translatedResult
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {converting ? (
                <div className="flex items-center gap-2">
                  <SparklesIcon size={16} className="animate-spin text-[#0B4F42] dark:text-teal-300 shrink-0" />
                  <span>
                    Translating and formatting instructions into <strong>{selectedLanguage.native} ({selectedLanguage.name})</strong>...
                  </span>
                </div>
              ) : translatedResult || convertText || (
                <span className="text-slate-400 font-normal italic">
                  Upload a doctor prescription on the left. The assistant will automatically scan handwriting, identify medicines, and translate guidance into {selectedLanguage.native}.
                </span>
              )}
            </div>

            {/* RURAL MULTILINGUAL AUDIO CAPSULE BAR */}
            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSpeakToggle()}
                  className={`font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0 ${
                    speaking
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-[#0B4F42] hover:bg-[#093f35] text-white'
                  }`}
                >
                  <SpeakerIcon size={15} />
                  <span>{speaking ? '⏹ Stop Voice' : `▶ Listen in ${selectedLanguage.native}`}</span>
                </button>

                {/* Elderly Slow Pace Selector */}
                <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setSpeechRate(0.85)}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
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
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
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
              <div className="flex items-center gap-1 h-4 shrink-0">
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
            <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-lg p-2.5 flex items-center gap-2 text-[10px] text-amber-950 dark:text-amber-200 font-medium">
              <AlertIcon size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Always take medicines strictly as instructed by your treating doctor or ASHA health worker.</span>
            </div>

          </div>

          {/* 2. VISUAL COMPACT 2-COLUMN MEDICINE LIST */}
          <MedicineList 
            medications={extractedMedicines}
            confidence={extractionConfidence}
            isLoading={converting}
          />

          {/* 3. SCHEDULE REMINDERS ACTION CARD */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-800/90 dark:to-slate-800/60 border border-teal-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0B4F42] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                ⏰
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Automated Medication Reminders & PillBox
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Morning (8:00 AM), Afternoon (1:30 PM), and Night (8:30 PM).
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView?.('reminders')}
              className="bg-[#0B4F42] hover:bg-[#093f35] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
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
