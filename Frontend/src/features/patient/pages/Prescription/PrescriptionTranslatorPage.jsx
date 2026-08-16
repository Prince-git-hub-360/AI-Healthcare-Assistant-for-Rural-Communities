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
} from '../../../../shared/icons/Icons';
import { speakNativeAudio } from '../../../../shared/utils/speech';
import { PrescriptionDetailModal } from '../../components/PrescriptionDetailModal';
import { DeletePrescriptionModal } from '../../components/DeletePrescriptionModal';

export const PrescriptionTranslatorPage = ({ setCurrentView }) => {
  const { currentLang, updateLanguage, showToast } = useAuth();

  const [convertText, setConvertText] = useState('');
  const [convertLang, setConvertLang] = useState(currentLang || 'hi');
  const [translatedResult, setTranslatedResult] = useState('');
  const [converting, setConverting] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
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
        title: doc.title || doc.original_filename || 'Prescription',
        extractedText: doc.text_content || doc.extracted_text || '',
        translatedText: doc.translated_text || doc.simplified_summary || doc.text_content || '',
        languageCode: doc.language || 'hi',
        languageNative: LANGUAGES.find((l) => l.code === (doc.language || 'hi'))?.native || 'हिंदी',
        languageName: LANGUAGES.find((l) => l.code === (doc.language || 'hi'))?.name || 'Hindi',
        imagePreview: doc.file || doc.original_file || null,
        timestamp: doc.created_at || doc.uploaded_at || new Date().toISOString(),
      }));

      // Merge and remove duplicates by title/text
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
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
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
    showToast?.(`Playing audio in ${langObj.native} (${langObj.name})...`, 'info');

    try {
      await speakNativeAudio(textToSpeak, langToUse);
    } catch (err) {
      console.warn('Voice playback error:', err);
    } finally {
      setSpeaking(false);
    }
  };

  // File Upload Handling (STRICTLY NO AUTOMATIC VOICE PLAYBACK)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // CRITICAL REQUIREMENT: Stop any playing audio before upload
    if (speaking) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setSpeaking(false);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setConverting(true);
    showToast?.(`Analyzing ${file.name}...`, 'info');

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
      showToast?.(`Prescription processed successfully!`, 'success');

      // Preserve prescription in history
      saveToHistory({
        id: res?.id || Date.now().toString(),
        title: file.name,
        extractedText: extracted,
        translatedText: finalOutput,
        text_content: extracted,
        translated_text: finalOutput,
        simplified_text: finalOutput,
        languageCode: convertLang,
        languageName: selectedLanguage.name,
        languageNative: selectedLanguage.native,
        imagePreview: previewUrl,
        timestamp: new Date().toISOString(),
      });

      // Notify Reminders tab to synchronize auto-generated alarms
      window.dispatchEvent(new Event('swasthya_reminders_updated'));

      // CRITICAL REQUIREMENT: DO NOT AUTO-PLAY VOICE AFTER UPLOAD!
    } catch (err) {
      console.error('File upload error:', err);
      showToast?.('Failed to process prescription file. Try entering text manually.', 'error');
    } finally {
      setConverting(false);
    }
  };

  // View prescription in dedicated modal
  const handleViewHistoryItem = (item) => {
    if (speaking) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setSpeaking(false);
    }
    setSelectedDetailItem(item);
  };

  const [deleteTargetItem, setDeleteTargetItem] = useState(null);

  // Trigger safety delete modal
  const handleDeleteHistoryItem = (item) => {
    setDeleteTargetItem(item);
  };

  // Perform confirmed deletion
  const confirmDeletePrescription = async () => {
    if (!deleteTargetItem) return;
    const item = deleteTargetItem;
    const rxId = item.id || item.document_id;
    const rxTitle = item.title;

    try {
      if (item.id) {
        await api.deleteMedicalDocument(item.id);
      }
    } catch (err) {
      console.warn('API delete error:', err);
    }

    // Cascade delete associated reminders from local storage and trigger global sync
    try {
      const savedReminders = JSON.parse(localStorage.getItem('swasthya_medication_reminders') || '[]');
      const filteredReminders = savedReminders.filter(
        (r) => r.prescription_id !== rxId && r.prescription_title !== rxTitle && (!rxTitle || !r.medication_name.includes(rxTitle))
      );
      localStorage.setItem('swasthya_medication_reminders', JSON.stringify(filteredReminders));
      window.dispatchEvent(new Event('swasthya_reminders_updated'));
    } catch (e) {
      console.warn('Failed to cascade delete reminders:', e);
    }
    window.dispatchEvent(new Event('swasthya_reminders_updated'));

    setHistoryItems((prev) => {
      const updated = prev.filter((h) => h.id !== item.id && h.title !== item.title);
      try {
        localStorage.setItem('swasthya_rx_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update local rx history:', e);
      }
      return updated;
    });

    setDeleteTargetItem(null);
    if (selectedDetailItem?.id === item.id) setSelectedDetailItem(null);
    showToast?.(`Prescription "${item.title || 'Record'}" & associated reminders deleted.`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* PAGE HEADER & PREFERRED LANGUAGE SELECTION */}
      <div className="bg-emerald-50/70 dark:bg-slate-900 border border-emerald-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-800 dark:text-teal-300 bg-white/90 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 px-3.5 py-1 rounded-full inline-block shadow-2xs">
            PATIENT • TRANSLATE RX
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Understand your prescription
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Upload a prescription and receive simple, easy-to-understand instructions in your preferred language.
          </p>
        </div>

        {/* Preferred Language Form Control */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xs space-y-1.5 md:w-72 shrink-0 transition-colors">
          <label className="text-[10px] font-extrabold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
            Preferred language
          </label>

          <div className="relative">
            <select
              value={convertLang}
              onChange={(e) => handleLangChange(e.target.value)}
              className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 min-h-[44px] pr-8 text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer focus:outline-none focus:border-teal-700"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.native} ({lang.name})
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400">
              <ChevronDownIcon size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD WORKSPACE */}
      <div id="translate-main-workspace" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (~45%): YOUR PRESCRIPTION */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition-colors">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <DocumentIcon size={20} className="text-teal-700 dark:text-teal-400" />
                <span>Your Prescription</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                Upload a clear photo or scan of your prescription.
              </p>
            </div>

            {/* Upload Dropzone */}
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-700 dark:hover:border-teal-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-teal-50/50 dark:hover:bg-slate-800/80 rounded-2xl p-8 text-center space-y-3 cursor-pointer transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mx-auto flex items-center justify-center shadow-2xs">
                  <CloudUploadIcon size={24} />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Drag and drop or click to upload
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  JPG, PNG or PDF (Max 5MB)
                </div>
              </div>
            ) : null}

            {/* Uploaded Prescription Preview Area */}
            {imagePreview && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Uploaded Prescription</span>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setConvertText('');
                      setTranslatedResult('');
                    }}
                    className="text-rose-600 dark:text-rose-400 font-bold hover:underline min-h-[44px] flex items-center cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 p-2 flex items-center justify-center max-h-72">
                  <img src={imagePreview} alt="Uploaded Prescription" className="object-contain max-h-68 w-full rounded-lg" />
                </div>

                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                  <span>Prescription processed</span>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs py-3 px-4 min-h-[44px] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>⬆ Upload another prescription</span>
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Manual text input toggle & preset samples */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="text-xs text-teal-700 dark:text-teal-400 hover:underline font-bold min-h-[44px] flex items-center cursor-pointer"
                >
                  {showManualInput ? 'Hide manual text input' : 'Type doctor instructions manually'}
                </button>
              </div>

              {showManualInput && (
                <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                  <textarea
                    rows={8}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 text-xs text-slate-900 dark:text-slate-100 focus:border-teal-700 outline-none font-mono leading-relaxed whitespace-pre-wrap min-h-[160px]"
                    value={convertText}
                    onChange={(e) => setConvertText(e.target.value)}
                    placeholder="Type doctor instructions or scanned prescription text..."
                  />
                  <button
                    type="button"
                    onClick={handleConvert}
                    disabled={converting}
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-3 min-h-[44px] rounded-xl transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    {converting ? 'Processing...' : 'Translate Instructions'}
                  </button>
                </div>
              )}

              {/* Sample Prescriptions */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">Samples:</span>
                <button
                  type="button"
                  onClick={async () => {
                    const sampleText =
                      'आपको चक्कर और बेचैनी की शिकायत है। आपका रक्त शर्करा का स्तर बहुत कम है। डॉक्टर ने आपको 10 मिलीलीटर 5% डेक्सट्रोज का इंजेक्शन तुरंत लेने की सलाह दी है। इसके अलावा, आपको पर्याप्त मात्रा में तरल पदार्थ पीने और 2 पैकेट ओआरएस का सेवन करने की सलाह दी गई है।';
                    setConvertText(sampleText);
                    setTranslatedResult(sampleText);
                    saveToHistory({
                      id: Date.now().toString(),
                      title: 'Sample Prescription',
                      extractedText: sampleText,
                      translatedText: sampleText,
                      languageCode: convertLang,
                      languageName: selectedLanguage.name,
                      languageNative: selectedLanguage.native,
                      timestamp: new Date().toISOString(),
                    });
                  }}
                  className="bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-teal-800 dark:text-teal-300 border border-emerald-200 dark:border-slate-700 font-bold px-3 py-1.5 min-h-[44px] rounded-xl transition-colors cursor-pointer flex items-center"
                >
                  Hypoglycemia Sample
                </button>
              </div>
            </div>

            {/* Processing Loading Status */}
            {converting && (
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-extrabold">
                  <SparklesIcon size={18} className="animate-spin text-teal-700 dark:text-teal-400" />
                  <span>Processing prescription...</span>
                </div>
                <div className="space-y-1 pl-6 text-xs text-slate-700 dark:text-slate-300 font-bold">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <CheckIcon size={14} color="#059669" />
                    <span>Extracting text</span>
                  </div>
                  <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-teal-700 dark:bg-teal-400" />
                    <span>Translating into {selectedLanguage.native}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (~55%): TRANSLATION & GUIDANCE */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. TRANSLATED INSTRUCTIONS CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <TranslateIcon size={20} className="text-teal-700 dark:text-teal-400" />
                <span>Translated Instructions</span>
              </h2>

              <span className="bg-teal-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-2xs">
                <span>{selectedLanguage.flag}</span>
                <span>{selectedLanguage.native}</span>
              </span>
            </div>

            {/* Instruction Explanation Box */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-5 text-emerald-950 dark:text-emerald-100 text-sm sm:text-base leading-relaxed font-semibold whitespace-pre-wrap min-h-[140px] shadow-2xs">
              {translatedResult ||
                'आपको चक्कर और बेचैनी की शिकायत है। आपका रक्त शर्करा का स्तर बहुत कम है। डॉक्टर ने आपको 10 मिलीलीटर 5% डेक्सट्रोज का इंजेक्शन तुरंत लेने की सलाह दी है। इसके अलावा, आपको पर्याप्त मात्रा में तरल पदार्थ पीने और 2 पैकेट ओआरएस का सेवन करने की सलाह दी गई है।'}
            </div>
          </div>

          {/* 2. VOICE GUIDANCE CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
            <div className="space-y-0.5">
              <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <SpeakerIcon size={20} className="text-teal-700 dark:text-teal-400" />
                <span>Voice Guidance</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Tap the button below to listen to your translated prescription.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              <button
                type="button"
                onClick={() => handleSpeakToggle()}
                className={`font-bold text-xs px-6 py-3 min-h-[44px] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                  speaking
                    ? 'bg-rose-600 border border-rose-600 text-white animate-pulse'
                    : 'bg-teal-700 hover:bg-teal-800 text-white'
                }`}
              >
                <span>{speaking ? '⏸ Stop' : `▶ Listen in ${selectedLanguage.native}`}</span>
              </button>

              {/* Audio Waveform Graphic */}
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">
                <span>{speaking ? '0:14 / 1:02' : '0:00 / 1:02'}</span>
                <div className="flex items-center gap-0.5 h-4">
                  {[40, 70, 30, 90, 50, 80, 40, 60, 100, 50, 30, 70, 90, 40, 60, 30].map((h, i) => (
                    <span
                      key={i}
                      className={`w-0.5 rounded-full ${speaking ? 'bg-teal-700 dark:bg-teal-400 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. IMPORTANT INFORMATION WARNING BOX */}
          <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-2xl p-4.5 flex items-start gap-3.5 text-amber-950 dark:text-amber-100 shadow-2xs">
            <AlertIcon size={22} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-extrabold text-amber-950 dark:text-amber-100">Important Information</div>
              <p className="text-amber-900 dark:text-amber-200 leading-relaxed font-semibold">
                Some information may be unclear.<br />
                Please verify unclear instructions with an ASHA worker or healthcare professional.
              </p>
            </div>
          </div>

          {/* 4. REMINDERS CARD */}
          <div className="bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-2xs transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 flex items-center justify-center shrink-0 shadow-2xs">
                <ClockIcon size={20} />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-sky-950 dark:text-sky-100">Want help remembering?</div>
                <p className="text-[11px] text-sky-900 dark:text-sky-300 font-medium">
                  Create reminders for each medicine and receive notifications when it is time.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView?.('reminders')}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-3 min-h-[44px] rounded-xl shrink-0 cursor-pointer flex items-center gap-2 transition-colors shadow-xs"
            >
              <span>📅 Create Reminders</span>
            </button>
          </div>

        </div>
      </div>

      {/* ================================================== */}
      {/* 3. PRESCRIPTION HISTORY SECTION (COMPACT LIST)     */}
      {/* ================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HistoryIcon size={20} className="text-teal-700 dark:text-teal-400" />
              <span>Prescription History</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
              Your previously uploaded and translated prescriptions.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {historyItems.length === 0 ? (
            <div className="text-xs text-slate-500 dark:text-slate-500 py-4 text-center font-medium">
              No saved prescription history yet.
            </div>
          ) : (
            historyItems.map((item) => (
              <div
                key={item.id || item.timestamp}
                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex items-center justify-between gap-4 transition-all hover:border-teal-700 dark:hover:border-teal-400 shadow-2xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center justify-center shrink-0">
                    <DocumentIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      📄 {item.title || 'Prescription Document'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {item.languageNative || item.languageName || 'Hindi'} • {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Today'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleViewHistoryItem(item)}
                    className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 min-h-[44px] px-3 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowRightIcon size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
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
