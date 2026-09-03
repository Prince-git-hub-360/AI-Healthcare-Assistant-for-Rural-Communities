import React, { useState } from 'react';
import { PhoneIcon, SpeakerIcon, CheckIcon } from '../../../shared/icons/Icons';

export const DoctorTeleChatModal = ({ isOpen, onClose, showToast }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'doctor', time: '08:45 AM', text: 'Good morning Sister Sunita. Please check Lakshmi Devi BP today. She had dizzy spells yesterday.' },
    { id: 2, sender: 'asha', time: '09:15 AM', text: 'Good morning Dr. Vikram. Visited Lakshmi Devi. BP measured 168/104 mmHg. Given morning Amlodipine 5mg.' },
    { id: 3, sender: 'doctor', time: '09:20 AM', text: 'Noted. Keep her under observation. If headache persists, refer her to Mandya PHC by afternoon.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'asha',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText,
    };
    setMessages([...messages, newMsg]);
    setInputText('');
    if (showToast) showToast('💬 Clinical Update Dispatched to Dr. Vikram Sharma!', 'success');
  };

  const handleVoiceNote = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const voiceMsg = {
        id: Date.now(),
        sender: 'asha',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: '🎙️ [Kannada Voice Note]: "ಡಾಕ್ಟರ್, ಲಕ್ಷ್ಮೀ ಅಮ್ಮ ಅವರ ರಕ್ತದೊತ್ತಡ ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಮತ್ತೆ ಭೇಟಿ ನೀಡುತ್ತೇನೆ."',
      };
      setMessages((prev) => [...prev, voiceMsg]);
      if (showToast) showToast('🎙️ Audio Voice Note Sent to Doctor!', 'success');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full relative shadow-2xl space-y-4 flex flex-col h-[560px] my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0B3B74] text-white flex items-center justify-center text-xs font-black border-2 border-sky-400">
              👨‍⚕️
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Dr. Vikram Sharma, MBBS</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              </div>
              <div className="text-[10px] text-slate-500">Medical Officer • Mandya PHC #2</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+919876500999"
              className="bg-emerald-50 text-emerald-700 p-2 rounded-xl border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
              title="Call Doctor"
            >
              <PhoneIcon size={14} />
            </a>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'asha' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                  m.sender === 'asha'
                    ? 'bg-[#0B3B74] text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-xs'
                }`}
              >
                <div>{m.text}</div>
                <div className={`text-[9px] mt-1 text-right font-mono ${m.sender === 'asha' ? 'text-blue-200' : 'text-slate-400'}`}>
                  {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pre-filled Quick Responses */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            'BP measured high. Review needed.',
            'ANC IFA tablets delivered.',
            'TB DOTS dose supervised.',
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(chip)}
              className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
            >
              + {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleVoiceNote}
            disabled={isRecording}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Record Voice Note"
          >
            <SpeakerIcon size={16} />
          </button>

          <input
            type="text"
            placeholder="Type clinical update for Dr. Sharma..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#0B3B74]"
          />

          <button
            type="submit"
            className="bg-[#0B3B74] hover:bg-[#072448] text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
};

export default DoctorTeleChatModal;
