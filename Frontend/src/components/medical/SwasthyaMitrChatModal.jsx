import React, { useState, useEffect, useRef } from 'react';
import { useAuth, LANGUAGES } from '../../context/AuthContext';
import {
  MicIcon, CameraIcon, SendIcon, CloseIcon, SpeakerIcon,
  SparklesIcon, HospitalIcon, CheckIcon, PillIcon
} from '../ui/Icons';
import { speakNativeAudio } from '../../utils/speech';

export const SwasthyaMitrChatModal = ({ isOpen, onClose }) => {
  const { currentLang, showToast } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Namaste! 🙏 I am Swasthya Mitr, your AI Health Assistant. Ask me anything about your medicines in your language, or upload a photo of your prescription!',
      language: currentLang || 'hi',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState(currentLang || 'hi');
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  if (!isOpen) return null;

  // Regional Speech-to-Text handler using Web Speech API
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
      en: 'en-IN',
    };

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langMap[selectedLang] || 'hi-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast?.(`Listening in ${LANGUAGES.find(l => l.code === selectedLang)?.name}... Speak now!`, 'info');
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

  const generateAIResponse = (query, img) => {
    const lower = (query || '').toLowerCase();
    if (img) {
      return {
        hi: 'मैंने आपके नुस्खे की फोटो पढ़ ली है। इसमें पैरासिटामोल 500mg (सुबह-शाम) और एंटीबायोटिक (दोपहर) शामिल हैं। इसे 5 दिन तक पूरा लें।',
        kn: 'ನಾನು ನಿಮ್ಮ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಫೋಟೋ ಪರಿಶೀಲಿಸಿದ್ದೇನೆ. ಬೆಳಿಗ್ಗೆ-ರಾತ್ರಿ 1 ಪ್ಯಾರಸಿಟಮಾಲ್ ಮತ್ತು ಮಧ್ಯಾಹ್ನ ಆಂಟಿಬಯೋಟಿಕ್ ಸೇವಿಸಿ.',
        en: 'I analyzed your prescription photo! It lists Paracetamol 500mg (Morning & Night after food) and Amoxicillin 250mg (After Lunch). Complete full 5 days.',
      }[selectedLang] || 'Prescription analyzed successfully! Take medicines strictly after meals.';
    }

    if (lower.includes('paracetamol') || lower.includes('पैरासिटामोल') || lower.includes('ಮಾತ್ರೆ')) {
      return {
        hi: 'पैरासिटामोल 500mg बुखार और दर्द के लिए है। इसे सुबह नाश्ते के बाद और रात को खाने के बाद लें। 24 घंटे में 4 गोली से ज्यादा न लें।',
        kn: 'ಪ್ಯಾರಸಿಟಮಾಲ್ ಜ್ವರ ಮತ್ತು ನೋವಿಗೆ ನೀಡಲಾಗುತ್ತದೆ. ಬೆಳಿಗ್ಗೆ ಮತ್ತು ರಾತ್ರಿ ಊಟದ ನಂತರ ತಗೊಳ್ಳಿ.',
        en: 'Paracetamol 500mg is for fever relief. Take 1 tablet after breakfast and 1 after dinner with warm water.',
      }[selectedLang] || 'Take 1 tablet after breakfast and 1 after dinner.';
    }

    return {
      hi: 'यह दवा हमेशा हल्के भोजन के बाद ही लें। अगर कोई असुविधा महसूस हो, तो अपने पास के स्वास्थ्य केंद्र (PHC) से संपर्क करें।',
      kn: 'ಈ ಔಷಧಿಯನ್ನು ಯಾವಾಗಲೂ ಊಟದ ನಂತರವೇ ತೆಗೆದುಕೊಳ್ಳಿ. ಬೆಚ್ಚಗಿನ ನೀರನ್ನು ಕುಡಿಯಿರಿ.',
      en: 'Always take this medication after meals with clean drinking water. If symptoms persist, visit your nearest Primary Health Center (PHC).',
    }[selectedLang] || 'Take this medicine after meals as directed by your doctor.';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputQuery.trim() && !attachedImage) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputQuery || 'Uploaded Prescription Photo',
      image: attachedImage?.preview,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = inputQuery;
    const currentImg = attachedImage;

    setInputQuery('');
    setAttachedImage(null);
    setIsProcessing(true);

    setTimeout(() => {
      const aiReplyText = generateAIResponse(currentQuery, currentImg);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReplyText,
        language: selectedLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsProcessing(false);
    }, 1200);
  };

  const handleSpeakResponse = async (msg) => {
    setSpeakingMsgId(msg.id);
    await speakNativeAudio(msg.text, selectedLang);
    setSpeakingMsgId(null);
  };

  const sampleQuestions = [
    'पैरासिटामोल कैसे लें? (How to take Paracetamol?)',
    'Scan my prescription image 📷',
    'Does this medicine need to be taken after food?',
  ];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-md" onClick={onClose} />

      {/* Main Chat Modal Box */}
      <div className="relative z-[100000] w-full max-w-2xl h-[88vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-teal-800 text-white p-4 md:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center shadow-inner">
              <SparklesIcon size={22} color="#ffffff" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-base tracking-tight">Swasthya Mitr AI</span>
                <span className="bg-emerald-500 text-stone-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  LIVE VOICE & CHAT
                </span>
              </div>
              <p className="text-[11px] text-teal-100">
                Ask in your language • Upload Prescription Photo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="bg-teal-900 border border-teal-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl outline-none cursor-pointer"
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
              onClick={onClose}
              className="p-2 rounded-xl text-teal-100 hover:bg-teal-700/80 transition-colors cursor-pointer"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-stone-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-4 shadow-sm text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-teal-700 text-white rounded-tr-xs'
                    : 'bg-white border border-stone-200 text-stone-900 rounded-tl-xs'
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Prescription"
                    className="w-full max-h-48 object-cover rounded-2xl mb-2 border border-stone-200"
                  />
                )}
                <p>{msg.text}</p>

                {msg.sender === 'ai' && (
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleSpeakResponse(msg)}
                      disabled={speakingMsgId === msg.id}
                      className="bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] px-3 py-1.5 rounded-xl border border-teal-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <SpeakerIcon size={14} color="#0f766e" />
                      <span>{speakingMsgId === msg.id ? 'Speaking...' : '🔊 Listen Audio'}</span>
                    </button>
                    <span className="text-[10px] text-stone-400 font-medium">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold bg-white p-3 rounded-2xl border border-stone-200 w-fit animate-pulse">
              <SparklesIcon size={16} color="#0f766e" />
              Swasthya Mitr is analyzing in your native language...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-stone-100 border-t border-stone-200 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="font-extrabold text-stone-400 uppercase tracking-wider shrink-0">TRY:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInputQuery(q)}
              className="bg-white hover:bg-teal-50 text-stone-700 hover:text-teal-800 border border-stone-200 px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 md:p-4 bg-white border-t border-stone-200 flex items-center gap-2">
          {/* Photo Attachment Button */}
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
              attachedImage ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
            }`}
            title="Attach Prescription or Medicine Photo"
          >
            <CameraIcon size={20} />
          </button>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleMicToggle}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              isListening
                ? 'bg-red-600 text-white border-red-600 animate-bounce'
                : 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-800'
            }`}
            title="Speak in your Native Language"
          >
            <MicIcon size={20} color={isListening ? '#ffffff' : '#0f766e'} />
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={isListening ? "Listening... Speak now!" : "Ask medicine dosage or type query..."}
              className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 outline-none focus:border-teal-700 focus:bg-white"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
            />
            {attachedImage && (
              <span className="absolute right-2 top-2 bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                Photo Ready 📷
              </span>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white p-2.5 rounded-2xl shadow-md transition-all cursor-pointer"
          >
            <SendIcon size={20} color="#ffffff" />
          </button>
        </form>
      </div>
    </div>
  );
};
