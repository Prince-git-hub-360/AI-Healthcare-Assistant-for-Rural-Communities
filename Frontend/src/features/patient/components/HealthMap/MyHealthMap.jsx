import React, { useState, useMemo, useEffect } from 'react';
import { useAuth, LANGUAGES } from '../../../../shared/context/AuthContext';
import { SparklesIcon, SpeakerIcon, PillIcon, CheckIcon, AlertIcon, DocumentIcon } from '../../../../shared/icons/Icons';
import { speakNativeAudio, stopNativeAudio } from '../../../../shared/utils/speech';

// Anatomical Health Systems mapped accurately to the frontal clinical body
const HEALTH_AREAS = [
  {
    id: 'neuro',
    name: 'Head & Nerves',
    nativeName: { hi: 'सिर और तंत्रिकाएं', bn: 'মাথা ও স্নায়ু', te: 'తల & నరాలు', ta: 'தலை & நரம்புகள்', kn: 'ತಲೆ ಮತ್ತು ನರಗಳು', mr: 'डोके आणि नसा' },
    icon: '🧠',
    top: '8%',
    left: '50%',
    color: '#0284C7', // Sky Blue
    accentBg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/80 text-sky-900 dark:text-sky-200',
    keywords: ['benfomate', 'neuropathy', 'headache', 'migraine', 'nerve', 'brain', 'sleep', 'paracetamol', 'fever', 'stress', 'pain', 'neuro'],
    description: 'Neurological care, cognitive clarity, headache relief, and central nervous wellness.',
    clinicalAdvice: 'Ensure 7-8 hours of restful sleep, drink plenty of clean water, and take nerve supplements consistently after meals.'
  },
  {
    id: 'pulmonary',
    name: 'Lungs & Breathing',
    nativeName: { hi: 'फेफड़े और श्वसन', bn: 'ফুসফুস ও শ্বাসপ্রশ্বাস', te: 'ఊపిరితిత్తులు & శ్వాస', ta: 'நுரையீரல் & சுவாசம்', kn: 'ಶ್ವಾಸಕೋಶ ಮತ್ತು ಉಸಿರಾಟ', mr: 'फुफ्फुसे आणि श्वसन' },
    icon: '🫁',
    top: '23%',
    left: '43%',
    color: '#06B6D4', // Cyan
    accentBg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/80 text-cyan-900 dark:text-cyan-200',
    keywords: ['lung', 'cough', 'asthma', 'inhaler', 'ambroxol', 'chest', 'breath', 'oxygen', 'spo2', 'bronchial', 'respiratory', 'cold', 'mucus'],
    description: 'Respiratory capacity, bronchial ease, oxygenation, and seasonal lung protection.',
    clinicalAdvice: 'Keep living spaces ventilated. Inhale steam during seasonal weather transitions and avoid dust exposure.'
  },
  {
    id: 'cardio',
    name: 'Heart & Circulation',
    nativeName: { hi: 'हृदय और रक्तचाप', bn: 'হৃদয় ও রক্তচাপ', te: 'గుండె & రక్త ప్రసరణ', ta: 'இதயம் & ரத்த ஓட்டம்', kn: 'ಹೃದಯ ಮತ್ತು ರಕ್ತಪರಿಚಲನೆ', mr: 'हृदय आणि रक्तदाब' },
    icon: '❤️',
    top: '27%',
    left: '52%',
    color: '#E11D48', // Rose / Red
    accentBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200',
    keywords: ['relicard', 'dalstep', 'blood pressure', 'bp', 'heart', 'cardio', 'atorvastatin', 'amlodipine', 'telmisartan', 'cardiac', 'pulse', 'cholesterol', 'vascular'],
    description: 'Cardiovascular strength, arterial blood flow, and healthy blood pressure regulation.',
    clinicalAdvice: 'Maintain a low-sodium diet, take prescribed cardiac doses at fixed morning hours, and do gentle daily walking.'
  },
  {
    id: 'digestive',
    name: 'Stomach & Digestion',
    nativeName: { hi: 'पेट और पाचन तंत्र', bn: 'পেট ও পরিপাকতন্ত্র', te: 'పొట్ట & జీర్ణవ్యవస్థ', ta: 'വയிறு & செரிமானம்', kn: 'ಹೊಟ್ಟೆ ಮತ್ತು ಜೀರ್ಣಕ್ರಿಯೆ', mr: 'पोट आणि पचनसंस्था' },
    icon: '🫄',
    top: '36%',
    left: '50%',
    color: '#D97706', // Amber
    accentBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200',
    keywords: ['stomach', 'pantocid', 'antacid', 'digestion', 'acidity', 'gas', 'liver', 'metformin', 'sugar', 'food', 'gut', 'palm oil', 'ulcer', 'gastric', 'reflux'],
    description: 'Digestive balance, gastric mucosal comfort, metabolic support, and gut microbiome health.',
    clinicalAdvice: 'Take gastro-resistant pills 30 minutes before breakfast. Drink warm water and eat regular, fiber-rich meals.'
  },
  {
    id: 'skeletal',
    name: 'Joints & Bones',
    nativeName: { hi: 'हड्डियां और जोड़', bn: 'হাড় ও জয়েন্ট', te: 'ఎముకలు & కీళ్ళు', ta: 'எலும்புகள் & மூட்டுகள்', kn: 'ಮೂಳೆಗಳು ಮತ್ತು ಕೀಲುಗಳು', mr: 'हाडे आणि सांधे' },
    icon: '🦴',
    top: '67%',
    left: '45%',
    color: '#64748B', // Slate
    accentBg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200',
    keywords: ['palsium', 'calcium', 'vitamin d', 'bone', 'joint', 'knee', 'spine', 'back', 'arthritis', 'calcitonin', 'ortho', 'pain', 'cartilage', 'fracture', 'osteo'],
    description: 'Bone mineral density, spinal stability, joint flexibility, and everyday pain-free mobility.',
    clinicalAdvice: 'Take calcium supplements with milk or after lunch. Enjoy 15 minutes of early morning sunlight for natural Vitamin D.'
  },
  {
    id: 'dermal',
    name: 'Skin & Surface Care',
    nativeName: { hi: 'त्वचा और बाह्य देखभाल', bn: 'ত্বক ও স্কিন কেয়ার', te: 'చర్మం & సంరక్షణ', ta: 'தோல் & பராமரிப்பு', kn: 'ಚರ್ಮ ಮತ್ತು ರಕ್ಷಣೆ', mr: 'त्वचा आणि बाह्य काळजी' },
    icon: '🧴',
    top: '46%',
    left: '28%',
    color: '#10B981', // Emerald
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200',
    keywords: ['skin', 'cream', 'gel', 'lotion', 'clindac', 'retiglow', 'tenovate', 'acne', 'scar', 'derma', 'ointment', 'serum', 'cetaphil', 'kojiglo', 'rash', 'dermatology'],
    description: 'Dermal protection, soothing skin barriers, scar reduction, and topical hygiene.',
    clinicalAdvice: 'Apply medicated creams on clean, dry skin with gentle upward strokes. Avoid harsh direct sun exposure after application.'
  }
];

export const MyHealthMap = ({ reminders = [], medicalDocuments = [], onOpenChat }) => {
  const { currentLang, showToast } = useAuth();
  const [selectedAreaId, setSelectedAreaId] = useState('cardio');
  const [speaking, setSpeaking] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Synchronize both Prescriptions (reminders) and Medical Records (health documents)
  const healthAreaContext = useMemo(() => {
    const contextMap = {};
    HEALTH_AREAS.forEach((area) => {
      contextMap[area.id] = {
        medications: [],
        documents: [],
      };
    });

    // 1. Map active prescribed medications
    reminders.forEach((r) => {
      const name = (r.medication_name || r.name || '').toLowerCase();
      const note = (r.instructions || r.notes || '').toLowerCase();
      const combined = `${name} ${note}`;

      let matched = false;
      HEALTH_AREAS.forEach((area) => {
        if (area.keywords.some((kw) => combined.includes(kw))) {
          contextMap[area.id].medications.push(r);
          matched = true;
        }
      });

      if (!matched && contextMap.digestive) {
        contextMap.digestive.medications.push(r);
      }
    });

    // 2. Map health records, lab reports & discharge summaries
    medicalDocuments.forEach((doc) => {
      const text = `${doc.title || ''} ${doc.text_content || doc.extracted_text || ''} ${doc.simplified_text || ''}`.toLowerCase();
      
      let matched = false;
      HEALTH_AREAS.forEach((area) => {
        if (area.keywords.some((kw) => text.includes(kw))) {
          contextMap[area.id].documents.push(doc);
          matched = true;
        }
      });
    });

    return contextMap;
  }, [reminders, medicalDocuments]);

  const activeArea = useMemo(
    () => HEALTH_AREAS.find((a) => a.id === selectedAreaId) || HEALTH_AREAS[2],
    [selectedAreaId]
  );

  const activeContext = healthAreaContext[activeArea.id] || { medications: [], documents: [] };
  const totalActiveMeds = activeContext.medications.length;
  const totalActiveDocs = activeContext.documents.length;

  const handleSpeakGuidance = async () => {
    if (speaking) {
      stopNativeAudio();
      setSpeaking(false);
      return;
    }

    const areaName = activeArea.nativeName[currentLang] || activeArea.name;
    let textToSpeak = `${areaName}. ${activeArea.description} ${activeArea.clinicalAdvice}`;
    
    if (activeContext.medications.length > 0) {
      const medList = activeContext.medications.map((m) => m.medication_name).join(', ');
      textToSpeak += ` Active prescription medicines: ${medList}.`;
    }

    setSpeaking(true);
    showToast?.(`Playing audio for ${areaName}...`, 'info');
    try {
      await speakNativeAudio(textToSpeak, currentLang || 'hi');
    } catch {}
    setSpeaking(false);
  };

  const handleConsultAI = (topic = null) => {
    const prompt = topic
      ? `Regarding my ${activeArea.name}: ${topic}`
      : `I have a question about my ${activeArea.name} and my care plan. Please explain simply in my native language without making clinical diagnoses.`;

    if (onOpenChat) {
      onOpenChat(prompt);
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('swasthya:open_ai_assistant', {
          detail: { prompt, area: activeArea.name, medications: activeContext.medications }
        })
      );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6 transition-colors font-sans">
      
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#0B4F42] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 px-3 py-0.5 rounded-full inline-block">
              🗺️ My Health Map • Swasthya Body Guide
            </span>
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              Clinical Context Map
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Interactive Health Map & Care Areas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Touch any anatomical health area to understand your prescriptions, care schedule, and guidance.
          </p>
        </div>

        {/* Live Records Sync Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl px-3 py-1.5 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Prescriptions & Records Synced</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN VISUAL WORKSPACE: HERO ANATOMY (LEFT) + CLEAN CONTEXT PANEL (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT: PREMIUM CLINICAL ANATOMICAL VISUALIZATION (HERO CENTERPIECE) (Col 5) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          
          <div className="w-full bg-gradient-to-b from-slate-50 via-white to-teal-50/30 dark:from-slate-800/50 dark:via-slate-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 relative flex flex-col items-center justify-center shadow-xs min-h-[440px] overflow-hidden">
            
            {/* Top Helper Badge */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full shadow-2xs">
              👆 Touch an area to inspect
            </div>

            {/* REALISTIC CLINICAL ANATOMY RENDER WITH INTEGRATED HOTSPOTS */}
            <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-[3/4] flex items-center justify-center select-none">
              
              {/* Clinical High-Res Anatomical Body Illustration */}
              <img
                src="/assets/anatomy/clinical_human_anatomy.jpg"
                alt="Clinical Human Anatomical Map"
                className="w-full h-full object-contain rounded-2xl drop-shadow-md transition-opacity duration-500"
                style={{ opacity: imgLoaded ? 1 : 0.9 }}
                onLoad={() => setImgLoaded(true)}
              />

              {/* ANATOMICAL HOTSPOT NODES WITH GLOWING HALOS */}
              {HEALTH_AREAS.map((area) => {
                const isSelected = selectedAreaId === area.id;
                const areaContext = healthAreaContext[area.id] || { medications: [], documents: [] };
                const hasCareData = areaContext.medications.length > 0 || areaContext.documents.length > 0;

                return (
                  <div
                    key={area.id}
                    onClick={() => setSelectedAreaId(area.id)}
                    style={{ top: area.top, left: area.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                    title={`${area.name} (${area.nativeName[currentLang] || area.name})`}
                  >
                    {/* Glowing Pulse Ring for Active Care Areas */}
                    {hasCareData && (
                      <span
                        style={{ borderColor: area.color }}
                        className={`absolute inset-0 rounded-full border-2 animate-ping opacity-75 ${
                          isSelected ? 'scale-150' : 'scale-125'
                        }`}
                      />
                    )}

                    {/* Outer Hotspot Circle with Hover Pop */}
                    <div
                      style={{
                        backgroundColor: isSelected ? area.color : '#FFFFFF',
                        borderColor: area.color,
                        boxShadow: isSelected ? `0 0 15px ${area.color}` : '0 2px 6px rgba(0,0,0,0.15)'
                      }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-black transition-all duration-200 group-hover:scale-115 ${
                        isSelected ? 'ring-4 ring-teal-500/30' : ''
                      }`}
                    >
                      <span className="drop-shadow-xs">{area.icon}</span>
                    </div>

                    {/* Mini Indicator Pill on Active Selection */}
                    {isSelected && (
                      <div
                        style={{ backgroundColor: area.color }}
                        className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap shadow-md pointer-events-none"
                      >
                        {area.name.split(' ')[0]}
                      </div>
                    )}
                  </div>
                );
              })}

            </div>

            {/* Quick Horizontal Selector Bar (Thumb Friendly) */}
            <div className="w-full flex items-center justify-center gap-1.5 flex-wrap pt-3 border-t border-slate-100 dark:border-slate-800 mt-2 z-10">
              {HEALTH_AREAS.map((area) => {
                const isSelected = selectedAreaId === area.id;
                const areaContext = healthAreaContext[area.id] || { medications: [], documents: [] };
                const hasMeds = areaContext.medications.length > 0;

                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => setSelectedAreaId(area.id)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                      isSelected
                        ? 'bg-[#0B4F42] text-white ring-2 ring-teal-600/30 font-black'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{area.icon}</span>
                    <span>{area.name.split(' ')[0]}</span>
                    {hasMeds && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT: SPACIOUS, CLEAN CONTEXTUAL INFORMATION PANEL (Col 7)               */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 space-y-5 transition-all shadow-xs">
            
            {/* 1. Header Row: Area Name + Vernacular Label + Care Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div 
                  style={{ backgroundColor: `${activeArea.color}20`, borderColor: activeArea.color }}
                  className="w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shadow-xs shrink-0"
                >
                  {activeArea.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0B4F42] dark:text-teal-400">
                      Related Health Area
                    </span>
                    <span className="bg-teal-50 dark:bg-teal-950 text-[#0B4F42] dark:text-teal-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                      {activeArea.nativeName[currentLang] || activeArea.nativeName.hi}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                    {activeArea.name}
                  </h3>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-2xs ${
                totalActiveMeds > 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                {totalActiveMeds > 0 
                  ? `● ${totalActiveMeds} Prescribed Medicine${totalActiveMeds > 1 ? 's' : ''}` 
                  : '○ Routine Care Area'}
              </span>
            </div>

            {/* 2. Synced Prescriptions & Schedules */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <PillIcon size={15} className="text-[#0B4F42] dark:text-teal-400" />
                  <span>Prescription &amp; Dosage Schedule:</span>
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {totalActiveMeds} active
                </span>
              </div>

              {totalActiveMeds > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeContext.medications.map((med, idx) => (
                    <div 
                      key={idx}
                      className="bg-white dark:bg-slate-900 border border-teal-200/80 dark:border-slate-700 rounded-2xl p-3.5 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                          {med.medication_name}
                        </h4>
                        <span className="bg-teal-50 dark:bg-teal-950 text-[#0B4F42] dark:text-teal-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800 shrink-0">
                          {med.scheduled_time || 'Daily'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                        {med.instructions || 'Take 1 dose as advised by your doctor after food.'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/90 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Health area not identified from active prescriptions. General wellness guidelines apply.
                </div>
              )}
            </div>

            {/* 3. Synced Health Records & Clinical Documents (If Available) */}
            {totalActiveDocs > 0 && (
              <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-700">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <DocumentIcon size={14} className="text-teal-600 dark:text-teal-400" />
                  <span>Synced Medical Records &amp; Doctor Notes:</span>
                </span>
                <div className="space-y-1.5">
                  {activeContext.documents.map((doc, idx) => (
                    <div 
                      key={idx}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                        📄 {doc.title || 'Clinical Document'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Verified'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Clinical Care & Rural Recommendation */}
            <div className="bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/90 dark:border-teal-800/80 rounded-2xl p-4 space-y-1 text-xs text-teal-950 dark:text-teal-100 leading-relaxed font-medium">
              <div className="font-extrabold text-[#0B4F42] dark:text-teal-300 flex items-center gap-1.5">
                <span>💡</span>
                <span>Doctor &amp; ASHA Care Recommendation:</span>
              </div>
              <p>{activeArea.clinicalAdvice}</p>
            </div>

            {/* 5. Clean Action Buttons: Vernacular Audio & Swasthya AI Dialogue */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSpeakGuidance}
                disabled={speaking}
                className="flex-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-extrabold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs disabled:opacity-60"
              >
                <SpeakerIcon size={16} />
                <span>{speaking ? 'Playing Audio...' : `🔊 Listen in ${LANGUAGES.find((l) => l.code === currentLang)?.native || 'English'}`}</span>
              </button>

              <button
                type="button"
                onClick={() => handleConsultAI()}
                className="flex-1 bg-[#0B4F42] hover:bg-[#093f35] text-white text-xs font-black py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <SparklesIcon size={16} className="text-teal-300" />
                <span>💬 Ask Swasthya AI About {activeArea.name.split(' ')[0]}</span>
              </button>
            </div>

            {/* Quick Context Question Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                `Why am I taking this medicine?`,
                `Should I take it before or after food?`,
                `Any dietary precautions?`,
              ].map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleConsultAI(q)}
                  className="text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#0B4F42] text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MyHealthMap;
