import React, { useState } from 'react';
import { DocumentIcon, SpeakerIcon } from '../../../shared/icons/Icons';
import { LANGUAGES } from '../../../shared/context/AuthContext';
import { speakNativeAudio } from '../../../shared/utils/speech';

export const PrescriptionDetailModal = ({ item, prescription, onClose, onDelete, showToast }) => {
  const activeItem = item || prescription;
  const [speaking, setSpeaking] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!activeItem) return null;

  const title = activeItem.title || activeItem.original_filename || 'Prescription Document';
  const languageCode = activeItem.languageCode || activeItem.language || 'hi';
  const langObj = LANGUAGES.find((l) => l.code === languageCode) || { name: 'Hindi', native: 'हिंदी' };
  const originalText = activeItem.extractedText || activeItem.text_content || activeItem.extracted_text || activeItem.original_text || '';
  const translatedText = activeItem.translatedText || activeItem.translated_text || activeItem.simplified_text || activeItem.simplified_summary || originalText;
  const imagePreview = activeItem.imagePreview || activeItem.original_file || activeItem.file || activeItem.file_url || null;
  const createdAt = activeItem.timestamp ? new Date(activeItem.timestamp).toLocaleDateString() : (activeItem.created_at ? new Date(activeItem.created_at).toLocaleDateString() : 'Today');

  const handleAudioPlayback = async () => {
    if (speaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    if (!translatedText.trim()) {
      showToast?.('No translated instructions available for audio.', 'warning');
      return;
    }

    setSpeaking(true);
    showToast?.(`Playing audio in ${langObj.native} (${langObj.name})...`, 'info');

    try {
      await speakNativeAudio(translatedText, languageCode);
    } catch (err) {
      console.warn('Playback error:', err);
    } finally {
      setSpeaking(false);
    }
  };

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDelete?.(item);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-stone-900 dark:text-slate-100 transition-colors">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-stone-50/50 dark:bg-slate-900/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-[#0B4F42] dark:text-teal-300 flex items-center justify-center shrink-0">
              <DocumentIcon size={20} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B4F42] dark:text-teal-400 block">
                PRESCRIPTION DETAILS
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white truncate">
                {title}
              </h2>
              <div className="text-xs text-stone-500 dark:text-slate-400">
                {langObj.native} ({langObj.name}) • Uploaded {createdAt}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-500 dark:text-slate-300 font-bold flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        {/* MODAL BODY (SPLIT VIEW) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT: ORIGINAL UPLOADED IMAGE PREVIEW */}
          <div className="space-y-3 bg-stone-50 dark:bg-slate-950 p-4 rounded-2xl border border-stone-200 dark:border-slate-800 flex flex-col">
            <div className="flex items-center justify-between text-xs font-extrabold text-stone-600 dark:text-slate-400 uppercase tracking-wider">
              <span>Original Uploaded Image</span>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => setShowFullImage(!showFullImage)}
                  className="text-xs text-[#0B4F42] dark:text-teal-400 font-bold hover:underline cursor-pointer"
                >
                  {showFullImage ? '🔍 Standard View' : '🔍 Full Screen'}
                </button>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center min-h-[220px] max-h-[360px] bg-stone-200/50 dark:bg-slate-900 rounded-xl overflow-hidden relative border border-stone-200 dark:border-slate-800">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={title}
                  className={`object-contain max-h-full max-w-full ${showFullImage ? 'w-full h-full' : ''}`}
                />
              ) : (
                <div className="text-center p-6 text-stone-400 dark:text-slate-500 space-y-2">
                  <DocumentIcon size={36} className="mx-auto text-stone-400 dark:text-slate-600" />
                  <div className="text-xs font-semibold">No Image File Attached</div>
                </div>
              )}
            </div>

            {originalText && (
              <div className="text-xs font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-stone-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-stone-500 dark:text-slate-400 text-[10px] uppercase">Extracted Doctor Shorthand:</div>
                <div className="text-stone-800 dark:text-slate-200 whitespace-pre-wrap font-sans text-xs leading-relaxed max-h-48 overflow-y-auto">{originalText}</div>
              </div>
            )}
          </div>

          {/* RIGHT: SIMPLIFIED TRANSLATION & AUDIO GUIDANCE */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="bg-[#F0FDF4] dark:bg-teal-950/40 border border-[#bbf7d0] dark:border-teal-800/80 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#bbf7d0] dark:border-teal-800/80 pb-2">
                  <span className="text-xs font-extrabold text-[#0B4F42] dark:text-teal-300 uppercase tracking-widest">
                    REGIONAL TRANSLATION ({langObj.native})
                  </span>
                  <span className="bg-teal-100 dark:bg-teal-900/60 text-[#0B4F42] dark:text-teal-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    AI Simplified
                  </span>
                </div>

                <p className="text-sm sm:text-base text-stone-800 dark:text-slate-100 font-semibold leading-relaxed">
                  {translatedText}
                </p>
              </div>

              {/* VOICE AUDIO PLAYER */}
              <div className="bg-stone-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-stone-200 dark:border-slate-700 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <SpeakerIcon size={16} className="text-[#0B4F42] dark:text-teal-400" />
                    <span>Spoken Voice Guidance</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-slate-400">
                    Listen to instructions in {langObj.name}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAudioPlayback}
                  className="bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <SpeakerIcon size={14} color="#fff" />
                  <span>{speaking ? 'Pause Audio' : 'Play Audio'}</span>
                </button>
              </div>

              {/* REMINDERS AUTO-SYNC STATUS BADGE */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 p-3.5 rounded-xl flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold">
                  <span>✓ Reminders Synced to Schedule</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Active</span>
              </div>
            </div>

            {/* DELETE CONTROL BAR */}
            <div className="pt-4 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between gap-3">
              {confirmDelete ? (
                <div className="flex items-center gap-2 w-full bg-red-50 dark:bg-red-950/60 p-2.5 rounded-xl border border-red-200 dark:border-red-800">
                  <span className="text-xs font-bold text-red-700 dark:text-red-300 flex-1">
                    Delete prescription permanently?
                  </span>
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-300 font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 px-3 py-2 rounded-xl border border-red-200 dark:border-red-900/60 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🗑️ Delete Prescription</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-800 dark:text-slate-200 font-bold text-xs px-5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailModal;
