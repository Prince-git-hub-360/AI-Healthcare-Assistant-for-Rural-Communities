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
} from '../../../../shared/icons/Icons';
import { speakNativeAudio } from '../../../../shared/utils/speech';

export const PrescriptionTranslatorPage = ({ setCurrentView }) => {
  const { currentLang, updateLanguage, showToast } = useAuth();

  const [convertText, setConvertText] = useState(
    '1. TAB. LISINOPRIL (10 MG) — 1 Tablet Once Daily\n2. TAB. AMOXICILLIN (500 MG) — 1 Capsule Thrice Daily for 7 Days\n3. TAB. IBUPROFEN (200 MG) — 1 Tablet As Needed for Pain'
  );
  const [convertLang, setConvertLang] = useState(currentLang || 'hi');
  const [translatedResult, setTranslatedResult] = useState('');
  const [converting, setConverting] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const selectedLanguage = useMemo(
    () => LANGUAGES.find((l) => l.code === convertLang) || LANGUAGES[0],
    [convertLang]
  );

  const translateCurrentText = async (text, lang) => {
    if (!text || !text.trim()) return;
    setConverting(true);
    try {
      const res = await api.translateText(text, lang);
      const outputText = res.translated_text || res.simplified_text || text;
      setTranslatedResult(outputText);
    } catch (err) {
      console.warn('Translation error:', err);
      showToast?.('Translation error. Showing original text.', 'warning');
      setTranslatedResult(text);
    } finally {
      setConverting(false);
    }
  };

  // Initial translation on component mount
  useEffect(() => {
    if (convertText.trim() && !translatedResult) {
      translateCurrentText(convertText, convertLang);
    }
  }, []);

  const handleLangChange = async (newLang) => {
    setConvertLang(newLang);
    updateLanguage?.(newLang);
    const langName = LANGUAGES.find((l) => l.code === newLang)?.name || newLang;
    showToast?.(`Language set to ${langName}`, 'info');
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

  const handleSpeak = async () => {
    let nativeTextToSpeak = translatedResult || convertText;
    if (!nativeTextToSpeak) return;

    setSpeaking(true);
    showToast?.(`Playing audio in ${selectedLanguage.name}...`, 'info');
    await speakNativeAudio(nativeTextToSpeak, convertLang);
    setSpeaking(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }

    setConverting(true);
    showToast?.(`Analyzing ${file.name} with Groq AI Vision...`, 'info');

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
      showToast?.(`Extracted & translated into ${selectedLanguage.name}!`, 'success');

      // Auto play native audio
      setSpeaking(true);
      await speakNativeAudio(finalOutput, convertLang);
      setSpeaking(false);
    } catch (err) {
      showToast?.('Failed to process prescription file.', 'error');
    } finally {
      setConverting(false);
    }
  };

  // Structured Medicine Extractor & Formatter
  const structuredMedicines = useMemo(() => {
    const textToParse = translatedResult || convertText || '';
    if (!textToParse.trim()) return [];

    const lines = textToParse
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    return lines.map((line, idx) => {
      const cleanLine = line.replace(/^(\d+[\.\)]\s*|[-•*]\s*)/, '').trim();

      const isMorning = /morning|subah|1-0-0|1-0-1|1-1-1|once daily|twice daily|thrice daily|सुबह|प्रातः/i.test(cleanLine);
      const isAfternoon = /afternoon|dopahar|0-1-0|1-1-1|thrice daily|दोपहर/i.test(cleanLine);
      const isNight = /night|raat|0-0-1|1-0-1|1-1-1|twice daily|thrice daily|bedtime|रात|रात्रि/i.test(cleanLine);
      const isAsNeeded = /as needed|for pain|jab zaroorat ho|zaroorat|दर्द|जरूरत/i.test(cleanLine);

      let title = cleanLine;
      let instruction = '';

      if (cleanLine.includes('—')) {
        const parts = cleanLine.split('—');
        title = parts[0].trim();
        instruction = parts.slice(1).join('—').trim();
      } else if (cleanLine.includes('-')) {
        const parts = cleanLine.split('-');
        title = parts[0].trim();
        instruction = parts.slice(1).join('-').trim();
      }

      return {
        id: idx,
        title: title || cleanLine,
        instruction: instruction || cleanLine,
        raw: cleanLine,
        isMorning,
        isAfternoon,
        isNight,
        isAsNeeded,
      };
    });
  }, [translatedResult, convertText]);

  // Determine current active step
  const activeStep = useMemo(() => {
    if (speaking) return 3;
    if (converting) return 2;
    if (translatedResult && translatedResult.trim()) return 2;
    return 1;
  }, [speaking, converting, translatedResult]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8 font-sans">
      {/* 1. TOP PROGRESS FLOW INDICATOR */}
      <div className="bg-white/80 backdrop-blur-sm border border-stone-200/80 rounded-2xl p-4 md:p-5 shadow-xs">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[
            { step: 1, label: 'Upload' },
            { step: 2, label: 'Understand' },
            { step: 3, label: 'Listen' },
            { step: 4, label: 'Remember' },
          ].map((s, i, arr) => {
            const isCompleted = activeStep > s.step;
            const isCurrent = activeStep === s.step;

            return (
              <React.Fragment key={s.step}>
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#0B4F42] text-white ring-4 ring-[#0B4F42]/15 shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {isCompleted ? <CheckIcon size={14} color="#065f46" /> : s.step}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isCurrent ? 'text-[#0B4F42] font-bold' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>

                {i < arr.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mx-3 transition-colors ${
                      activeStep > s.step ? 'bg-emerald-500' : 'bg-stone-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 2. PAGE HEADER & LANGUAGE SELECTION BAR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-stone-200/60">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#0B4F42]">
            AI-POWERED PRESCRIPTION ASSISTANCE
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            Understand your prescription.
          </h1>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Upload a prescription and get simple instructions in your preferred language — with voice guidance when you need it.
          </p>
        </div>

        {/* Preferred Language Selector */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-3.5 shadow-xs space-y-1 md:w-72 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Preferred language</span>
            <button
              type="button"
              onClick={() => setShowLangModal(true)}
              className="text-[11px] font-bold text-[#0B4F42] hover:underline cursor-pointer"
            >
              All languages
            </button>
          </div>

          <div className="relative">
            <select
              value={convertLang}
              onChange={(e) => handleLangChange(e.target.value)}
              className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-stone-900 cursor-pointer focus:outline-none focus:border-[#0B4F42]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.native} ({lang.name})
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
              <ChevronDownIcon size={16} />
            </div>
          </div>

          <p className="text-[10px] text-stone-500 leading-tight">
            Your explanation and voice guidance will use this language.
          </p>
        </div>
      </div>

      {/* 3. MAIN PRODUCT SPLIT WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANEL: YOUR PRESCRIPTION */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <DocumentIcon size={18} className="text-[#0B4F42]" />
              <span>Your prescription</span>
            </h2>

            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setConvertText('');
                  setTranslatedResult('');
                }}
                className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Upload Dropzone Container */}
          <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-stone-200 max-h-56 bg-stone-900/5 flex items-center justify-center">
                  <img src={imagePreview} alt="Prescription preview" className="object-contain max-h-56 w-full" />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                >
                  Upload another prescription
                </button>
              </div>
            ) : (
              <div className="text-center py-4 px-2 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0B4F42]/10 text-[#0B4F42] mx-auto flex items-center justify-center">
                  <DocumentIcon size={24} />
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-stone-900">Upload prescription</div>
                  <div className="text-[11px] text-stone-500">JPG, PNG or PDF</div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#0B4F42] hover:bg-[#07362d] text-white text-xs font-bold py-3 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Upload Prescription
                </button>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowManualInput(!showManualInput)}
                    className="text-xs text-stone-600 hover:text-[#0B4F42] font-semibold underline cursor-pointer"
                  >
                    Or enter the doctor's instructions manually
                  </button>
                </div>
              </div>
            )}

            {/* Quick Preset Samples */}
            <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs gap-2">
              <span className="text-[11px] font-semibold text-stone-500 shrink-0">Samples:</span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={async () => {
                    const sampleText =
                      '1. TAB. LISINOPRIL (10 MG) — 1 Tablet Once Daily\n2. TAB. AMOXICILLIN (500 MG) — 1 Capsule Thrice Daily for 7 Days\n3. TAB. IBUPROFEN (200 MG) — 1 Tablet As Needed for Pain';
                    setConvertText(sampleText);
                    await translateCurrentText(sampleText, convertLang);
                  }}
                  className="bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  BP & Antibiotic
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const sampleText =
                      '1. Tab. Paracetamol 500mg — 1 Tablet Twice Daily after food for 5 days\n2. Tab. Cetirizine 10mg — 1 Tablet At Bedtime for 3 days';
                    setConvertText(sampleText);
                    await translateCurrentText(sampleText, convertLang);
                  }}
                  className="bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Fever & Cold
                </button>
              </div>
            </div>
          </div>

          {/* Manual Input Area (Collapsible/Togglable) */}
          {showManualInput && (
            <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <label className="text-xs font-bold text-stone-800">Enter doctor's instructions:</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:border-[#0B4F42] outline-none transition font-mono"
                value={convertText}
                onChange={(e) => setConvertText(e.target.value)}
                placeholder="Type or paste prescription text here..."
              />
              <button
                type="button"
                onClick={handleConvert}
                disabled={converting}
                className="w-full bg-stone-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {converting ? 'Processing...' : 'Explain this'}
              </button>
            </div>
          )}

          {/* AI Processing Progress Indicator */}
          {converting && (
            <div className="bg-[#0B4F42]/5 border border-[#0B4F42]/15 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#0B4F42] font-bold">
                <SparklesIcon size={16} className="animate-spin text-[#0B4F42]" />
                <span>Processing prescription...</span>
              </div>
              <div className="space-y-1.5 pl-6 text-[11px]">
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <CheckIcon size={12} color="#059669" />
                  <span>Reading prescription — Document received</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <CheckIcon size={12} color="#059669" />
                  <span>Extracting medicines — Medicines identified</span>
                </div>
                <div className="flex items-center gap-2 text-[#0B4F42] font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B4F42]" />
                  <span>Understanding instructions — Processing</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full border border-stone-300" />
                  <span>Preparing {selectedLanguage.name} explanation — Waiting</span>
                </div>
              </div>
            </div>
          )}

          {/* Collapsible Original OCR Text */}
          <details className="group bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs">
            <summary className="cursor-pointer text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center justify-between list-none select-none">
              <span>View extracted text</span>
              <ChevronDownIcon size={16} className="transition-transform group-open:rotate-180 text-stone-400" />
            </summary>
            <div className="mt-3 pt-3 border-t border-stone-100 text-xs font-mono text-stone-700 whitespace-pre-wrap leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200/60">
              {convertText || 'No text extracted yet.'}
            </div>
          </details>
        </div>

        {/* RIGHT PANEL: YOUR SIMPLIFIED INSTRUCTIONS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <TranslateIcon size={18} className="text-[#0B4F42]" />
              <span>Your instructions</span>
            </h2>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0B4F42]/10 text-[#0B4F42] flex items-center gap-1.5">
              <span>{selectedLanguage.flag}</span>
              <span>{selectedLanguage.native}</span>
            </span>
          </div>

          {/* Instructions Content */}
          {!translatedResult && !converting ? (
            <div className="bg-white border border-stone-200/80 rounded-2xl p-10 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <PillIcon size={24} />
              </div>
              <p className="text-xs md:text-sm font-semibold text-stone-500 max-w-sm mx-auto">
                Upload a prescription to see your instructions here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Structured Medicine Rows */}
              <div className="space-y-3">
                {structuredMedicines.map((med) => (
                  <div
                    key={med.id}
                    className="bg-white border border-stone-200/80 rounded-2xl p-4 md:p-5 shadow-xs hover:border-[#0B4F42]/30 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0B4F42] flex items-center justify-center shrink-0 mt-0.5">
                          <PillIcon size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm md:text-base font-bold text-stone-900">{med.title}</h3>
                          {med.instruction && med.instruction !== med.title && (
                            <p className="text-xs text-stone-600 mt-0.5 font-medium leading-relaxed">
                              {med.instruction}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Schedule Badges */}
                    <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-stone-100">
                      {med.isMorning && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-200/60">
                          <SunriseIcon size={13} className="text-amber-600" />
                          <span>Morning</span>
                        </span>
                      )}
                      {med.isAfternoon && (
                        <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-900 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-sky-200/60">
                          <SunIcon size={13} className="text-sky-600" />
                          <span>Afternoon</span>
                        </span>
                      )}
                      {med.isNight && (
                        <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-900 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-indigo-200/60">
                          <MoonIcon size={13} className="text-indigo-600" />
                          <span>Night</span>
                        </span>
                      )}
                      {med.isAsNeeded && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-900 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-rose-200/60">
                          <AlertIcon size={13} className="text-rose-600" />
                          <span>As needed</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Safety / Verification Warning */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-amber-950">
                <AlertIcon size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold">Some information may be unclear.</div>
                  <div className="text-amber-900/90 font-medium">
                    Please verify unclear instructions with an ASHA worker or healthcare professional.
                  </div>
                </div>
              </div>

              {/* PROMINENT VOICE EXPERIENCE */}
              <div className="bg-white border border-[#0B4F42]/20 rounded-2xl p-5 md:p-6 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                      <SpeakerIcon size={18} className="text-[#0B4F42]" />
                      <span>Voice Guidance</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Tap to hear your prescription instructions spoken aloud.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSpeak}
                    disabled={speaking}
                    className="w-full sm:w-auto bg-[#0B4F42] hover:bg-[#07362d] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                  >
                    <SpeakerIcon size={18} color="#ffffff" />
                    <span>{speaking ? `Speaking in ${selectedLanguage.name}...` : `Listen in ${selectedLanguage.native}`}</span>
                  </button>
                </div>

                {speaking && (
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
                    <div className="flex items-center gap-1 h-5">
                      <span className="w-1 bg-[#0B4F42] animate-wave-bar" />
                      <span className="w-1 bg-[#0B4F42] animate-wave-bar animation-delay-100" />
                      <span className="w-1 bg-[#0B4F42] animate-wave-bar animation-delay-200" />
                      <span className="w-1 bg-[#0B4F42] animate-wave-bar animation-delay-300" />
                    </div>
                    <span className="text-xs font-semibold text-[#0B4F42] animate-pulse">
                      Playing spoken instructions in {selectedLanguage.native} ({selectedLanguage.name})...
                    </span>
                  </div>
                )}
              </div>

              {/* MEDICATION REMINDER CONNECTION */}
              <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                    <ClockIcon size={16} className="text-[#0B4F42]" />
                    <span>Want help remembering?</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Create reminders for each medicine and receive notifications when it is time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentView?.('reminders')}
                  className="w-full sm:w-auto bg-stone-900 hover:bg-black text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Set Medication Reminders</span>
                  <ArrowRightIcon size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COMPACT LANGUAGE SELECTOR MODAL */}
      {showLangModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-extrabold text-stone-900">Select Preferred Language</h3>
              <button
                type="button"
                onClick={() => setShowLangModal(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
              {LANGUAGES.map((lang) => {
                const isSelected = convertLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      handleLangChange(lang.code);
                      setShowLangModal(false);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#0B4F42] text-white border-[#0B4F42] shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold truncate">{lang.native}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-teal-100' : 'text-stone-500'}`}>
                        {lang.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionTranslatorPage;
