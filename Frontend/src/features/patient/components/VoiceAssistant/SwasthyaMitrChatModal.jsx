import React, { useState, useEffect, useRef } from 'react';
import { useAuth, LANGUAGES } from '../../../../shared/context/AuthContext';
import {
  MicIcon, CameraIcon, SendIcon, CloseIcon, SpeakerIcon,
  SparklesIcon, PillIcon
} from '../../../../shared/icons/Icons';
import { speakNativeAudio, stopNativeAudio } from '../../../../shared/utils/speech';
import { api } from '../../../../services/api';

export const SwasthyaMitrChatModal = ({ isOpen, onClose, initialMedicine = null }) => {
  const { currentLang, showToast } = useAuth();
  
  const [selectedMedicine, setSelectedMedicine] = useState(initialMedicine);
  const [selectedLang, setSelectedLang] = useState(currentLang || 'hi');
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop audio when modal closes or unmounts
  useEffect(() => {
    if (!isOpen) {
      stopNativeAudio();
      setSpeakingMsgId(null);
    }
    return () => {
      stopNativeAudio();
    };
  }, [isOpen]);

  const handleCloseModal = () => {
    stopNativeAudio();
    setSpeakingMsgId(null);
    onClose();
  };

  // Sync initial medicine when passed as prop
  useEffect(() => {
    if (initialMedicine) {
      setSelectedMedicine(initialMedicine);
    }
  }, [initialMedicine]);

  // Initial welcome message setup based on selected medicine & language
  useEffect(() => {
    if (!isOpen) return;

    const langName = LANGUAGES.find(l => l.code === selectedLang)?.name || 'your language';
    
    let welcomeText = `Namaste! 🙏 I am Swasthya Mitr, your AI Medicine Assistant. Ask me anything about your medicines in ${langName}!`;
    if (selectedMedicine && selectedMedicine.name) {
      welcomeText = `Namaste! 🙏 I am ready to answer your questions about **${selectedMedicine.name}** (${selectedMedicine.dosage || 'Prescribed dose'} • ${selectedMedicine.frequency || 'As directed'}). What would you like to know?`;
    }

    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: welcomeText,
        language: selectedLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [isOpen, selectedMedicine, selectedLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  if (!isOpen) return null;

  const handleMicToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast?.('Voice input is not supported in this browser. Please type your query.', 'error');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const langMap = {
      hi: 'hi-IN',
      kn: 'kn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      gu: 'gu-IN',
      pa: 'pa-IN',
      ml: 'ml-IN',
      en: 'en-IN',
    };

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langMap[selectedLang] || 'hi-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        const lObj = LANGUAGES.find(l => l.code === selectedLang);
        showToast?.(`Listening in ${lObj ? lObj.name : selectedLang}... Speak now!`, 'info');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast?.('Could not capture voice. Please try again.', 'error');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      showToast?.('Voice recording error. Please type your message.', 'error');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage({ file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e, directQuery = null) => {
    if (e) e.preventDefault();
    
    const queryToUse = directQuery || inputQuery;
    if (!queryToUse.trim() && !attachedImage) return;

    const currentImg = attachedImage;
    const currentText = queryToUse.trim();

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: currentText || 'Uploaded Prescription Photo',
      image: currentImg?.preview,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setAttachedImage(null);
    setIsProcessing(true);

    let aiAnswerText = '';

    try {
      // 1. If photo attached, analyze prescription document first
      if (currentImg?.file) {
        showToast?.('Scanning prescription photo with AI OCR...', 'info');
        const formData = new FormData();
        formData.append('original_file', currentImg.file);
        formData.append('document_type', 'prescription');
        formData.append('title', currentImg.file.name);

        const ocrRes = await api.uploadMedicalDocument(formData);
        if (ocrRes?.simplified_text || ocrRes?.text_content) {
          aiAnswerText = `📷 **Prescription Photo Analysis:**\n\n` + (ocrRes.simplified_text || ocrRes.text_content);
        }
      }

      // 2. Query Swasthya Mitr Gemini AI Assistant Backend
      if (!aiAnswerText) {
        const langObj = LANGUAGES.find(l => l.code === selectedLang);
        const languageName = langObj ? langObj.name : 'English';

        // Prepare conversation history
        const convHistory = messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          text: m.text
        }));

        const payload = {
          question: currentText || 'Please explain this prescription medicine.',
          medicine: selectedMedicine ? {
            name: selectedMedicine.name || selectedMedicine.medicine_name || '',
            medicine_name: selectedMedicine.name || selectedMedicine.medicine_name || '',
            dosage: selectedMedicine.dosage || selectedMedicine.strength || '',
            frequency: selectedMedicine.frequency || selectedMedicine.timing || '',
            duration: selectedMedicine.duration || '',
            instructions: selectedMedicine.instructions || '',
            prescription_context: selectedMedicine.prescription_context || ''
          } : null,
          language: languageName,
          conversation_history: convHistory
        };

        const response = await api.queryMedicineAssistant(payload);
        
        if (response && response.answer) {
          aiAnswerText = response.answer;
        } else {
          aiAnswerText = "I'm unable to retrieve information right now. Please check your prescription or consult your doctor.";
        }
      }
    } catch (err) {
      console.error("AI Assistant API error:", err);
      aiAnswerText = "I'm unable to connect to the AI assistant right now. Please try again or consult your doctor/pharmacist.";
    } finally {
      setIsProcessing(false);
    }

    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: aiAnswerText,
      language: selectedLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleToggleSpeech = async (msg) => {
    if (speakingMsgId === msg.id) {
      stopNativeAudio();
      setSpeakingMsgId(null);
      return;
    }

    stopNativeAudio();
    setSpeakingMsgId(msg.id);
    await speakNativeAudio(msg.text, selectedLang);
    setSpeakingMsgId(null);
  };

  // Dynamic suggestion chips based on whether medicine is selected
  const medicineQuestions = selectedMedicine ? [
    `What is ${selectedMedicine.name} used for?`,
    `When should I take ${selectedMedicine.name}?`,
    `Should I take it before or after food?`,
    `What are the common side effects?`,
    `What should I do if I miss a dose?`,
  ] : [
    'What is Sizodon Plus used for?',
    'When should I take my prescription medicine?',
    'Should Paracetamol be taken after food?',
    'What happens if I miss a dose?',
  ];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-6">
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md" onClick={handleCloseModal} />

      <div className="relative z-[100000] w-full max-w-2xl h-[90vh] max-h-[750px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden font-sans transition-colors">
        
        {/* HEADER BAR */}
        <div className="bg-[#0F766E] text-white p-4 md:p-4.5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-teal-600/90 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
              <SparklesIcon size={22} color="#ffffff" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-base tracking-tight truncate">Swasthya Mitr AI</h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  MEDICINE ASSISTANT
                </span>
              </div>
              <p className="text-[11px] text-teal-100 truncate">
                Prescription-Aware • Multilingual Gemini AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* GLOBAL STOP AUDIO BUTTON WHEN SPEAKING */}
            {speakingMsgId && (
              <button
                type="button"
                onClick={() => {
                  stopNativeAudio();
                  setSpeakingMsgId(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer animate-pulse"
                title="Stop speech playback immediately"
              >
                <span>🛑 Stop Audio</span>
              </button>
            )}

            {/* LANGUAGE SELECTOR */}
            <select
              className="bg-teal-900/90 border border-teal-700/80 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl outline-none cursor-pointer hover:bg-teal-900"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleCloseModal}
              className="p-2 rounded-xl text-teal-100 hover:bg-teal-700/80 transition-colors cursor-pointer"
              title="Close Assistant"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        {/* ACTIVE SELECTED MEDICINE BADGE / CONTEXT BANNER */}
        {selectedMedicine && selectedMedicine.name && (
          <div className="bg-teal-50 dark:bg-teal-950/80 border-b border-teal-200 dark:border-teal-900/80 px-4 py-2.5 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-teal-200 dark:bg-teal-800 text-teal-900 dark:text-teal-100 flex items-center justify-center text-xs shrink-0 font-bold">
                💊
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-teal-200 truncate">
                    {selectedMedicine.name}
                  </span>
                  {selectedMedicine.dosage && (
                    <span className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {selectedMedicine.dosage}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium truncate">
                  {[selectedMedicine.frequency, selectedMedicine.duration].filter(Boolean).join(' • ') || 'Prescription Context Active'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedMedicine(null)}
              className="text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-white underline shrink-0 cursor-pointer"
              title="Switch to general health assistant mode"
            >
              Clear Context
            </button>
          </div>
        )}

        {/* CHAT MESSAGES BODY */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/70 dark:bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-3xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0F766E] text-white rounded-tr-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Prescription"
                    className="w-full max-h-48 object-cover rounded-2xl mb-2.5 border border-slate-200 dark:border-slate-700"
                  />
                )}
                
                {/* Formatted Text with basic Markdown line breaks & bold text */}
                <div className="space-y-1.5 whitespace-pre-wrap">
                  {msg.text.split('\n').map((line, lIdx) => (
                    <p key={lIdx}>{line}</p>
                  ))}
                </div>

                {msg.sender === 'ai' && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleToggleSpeech(msg)}
                      className={`font-bold text-[11px] px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                        speakingMsgId === msg.id
                          ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 animate-pulse shadow-xs'
                          : 'bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                      }`}
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <span className="w-2 h-2 rounded-xs bg-white inline-block animate-ping"></span>
                          <span>🛑 Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <SpeakerIcon size={14} color="#0F766E" />
                          <span>🔊 Listen Voice</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* THINKING INDICATOR */}
          {isProcessing && (
            <div className="flex items-center gap-2.5 text-xs text-teal-800 dark:text-teal-300 font-bold bg-teal-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-teal-200 dark:border-slate-700 w-fit animate-pulse shadow-2xs">
              <SparklesIcon size={18} className="animate-spin text-[#0F766E] dark:text-teal-400" />
              <span>Swasthya Mitr is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK CONTEXTUAL SUGGESTION CHIPS */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
          <span className="font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
            SUGGESTED:
          </span>
          {medicineQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(null, q)}
              className="bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-200 hover:text-teal-900 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* INPUT FORM */}
        <form onSubmit={(e) => handleSendMessage(e)} className="p-3 md:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
              attachedImage 
                ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-900 dark:text-amber-200' 
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Attach Prescription or Medicine Photo"
          >
            <CameraIcon size={20} />
          </button>

          <button
            type="button"
            onClick={handleMicToggle}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              isListening
                ? 'bg-red-600 text-white border-red-600 animate-bounce'
                : 'bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 dark:hover:bg-teal-900 border-teal-200 dark:border-teal-800 text-[#0F766E] dark:text-teal-300'
            }`}
            title="Speak in your Native Language"
          >
            <MicIcon size={20} color={isListening ? '#ffffff' : '#0F766E'} />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={
                isListening 
                  ? "Listening... Speak now!" 
                  : selectedMedicine 
                    ? `Ask about ${selectedMedicine.name}...` 
                    : "Ask medicine question or type query..."
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#0F766E] dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-900"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isProcessing}
            />
            {attachedImage && (
              <span className="absolute right-2 top-2 bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                Photo Ready 📷
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isProcessing || (!inputQuery.trim() && !attachedImage)}
            className="bg-[#0F766E] hover:bg-teal-700 disabled:opacity-50 text-white p-2.5 rounded-2xl shadow-md transition-all cursor-pointer active:scale-95"
          >
            <SendIcon size={20} color="#ffffff" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SwasthyaMitrChatModal;
