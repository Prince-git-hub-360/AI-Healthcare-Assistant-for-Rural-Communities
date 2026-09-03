import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { healthcareWorkerApi } from '../../../../services/api/healthcareWorker';
import { GovtHeaderBanner } from '../../../../components/layout/GovtHeaderBanner';
import { 
  HospitalIcon, PlusIcon, SearchIcon, CheckIcon, AlertIcon, 
  SpeakerIcon, ShieldIcon, ClockIcon, DocumentIcon, PhoneIcon,
  SparklesIcon, UserIcon, HeartIcon, ActivityIcon, ArrowRightIcon
} from '../../../../shared/icons/Icons';
import { speakNativeAudio } from '../../../../shared/utils/speech';
import { DoctorPrescriptionWizard } from '../../components/DoctorPrescriptionWizard';

export const DoctorDashboardPage = ({ initialTab = 'queue', currentPath }) => {
  const { user, showToast } = useAuth();
  
  // Dashboard primary view tab: 'queue', 'directory', 'asha', 'red_flags'
  const [activeMainTab, setActiveMainTab] = useState(initialTab === 'prescriptions' || initialTab === 'asha' ? 'asha' : initialTab);
  const [triageFilter, setTriageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize activeMainTab on prop change
  useEffect(() => {
    if (initialTab) {
      setActiveMainTab(initialTab === 'prescriptions' || initialTab === 'asha' ? 'asha' : initialTab);
    }
  }, [initialTab, currentPath]);
  
  // Rx Modal State
  const [showRxModal, setShowRxModal] = useState(false);
  const [useStepWizard, setUseStepWizard] = useState(false);
  const [rxPatient, setRxPatient] = useState(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('diabetes');
  const [isPlayingRxVoice, setIsPlayingRxVoice] = useState(false);
  const [rxLanguage, setRxLanguage] = useState('kn');
  const [isRecordingDictation, setIsRecordingDictation] = useState(false);
  const [doctorDictationNotes, setDoctorDictationNotes] = useState('');

  // Printable Sun/Moon Chart Modal
  const [showPrintChartModal, setShowPrintChartModal] = useState(false);
  const [printPatient, setPrintPatient] = useState(null);

  // Full 360° ABHA History Modal State
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyPatient, setHistoryPatient] = useState(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState('pillbox');
  const [isPlayingPatientAudio, setIsPlayingPatientAudio] = useState(false);

  // ASHA Pending Approvals State
  const [ashaQueue, setAshaQueue] = useState([
    {
      id: 'ASHA-401',
      ashaName: 'Sunita Bai (Mandya Sector 2)',
      patientName: 'Gopal Gowda',
      age: 64,
      gender: 'Male',
      phone: '+91 98765 00444',
      village: 'Mandya Catchment #4',
      scannedDate: 'Today, 10:15 AM',
      extractedRx: 'Tab Amlodipine 5mg — 0-0-1 (30 days) HS',
      confidence: '96%',
      status: 'pending',
    },
    {
      id: 'ASHA-402',
      ashaName: 'Kavitha M. (Hassan Rural)',
      patientName: 'Ramu Naik',
      age: 42,
      gender: 'Male',
      phone: '+91 98765 00555',
      village: 'Hassan North Block',
      scannedDate: 'Today, 09:30 AM',
      extractedRx: 'Cap Amoxicillin 500mg — 1-1-1 (5 days) PC',
      confidence: '92%',
      status: 'pending',
    }
  ]);

  // Master Patient Directory with Full 360° History & ABDM Profiles
  const [opdPatients, setOpdPatients] = useState([
    {
      id: 'OPD-101',
      name: 'Lakshmi Devi Amma',
      phone: '+91 98765 00222',
      abhaId: '91-3310-8812-4011',
      age: 58,
      gender: 'Female',
      village: 'Mandya Sector 2',
      district: 'Mandya',
      state: 'Karnataka',
      bloodGroup: 'O +ve',
      ashaWorker: 'Sunita Devi (+91 98123 45678)',
      emergencyContact: 'Ramesh (Son) • +91 98765 11223',
      complaint: 'Severe dizziness & blurry vision for 2 days',
      vitals: { bp: '168/104 mmHg', pulse: '88 bpm', spo2: '97%', temp: '98.4°F', sugar: '178 mg/dL' },
      triage: 'high_risk',
      chronic: 'Type-2 Diabetes • Stage-2 Hypertension',
      allergies: 'No Known Drug Allergies',
      contraindication: 'Stage-2 Hypertension crisis (168/104). Avoid NSAIDs / High Sodium.',
      adherenceRate: '94%',
      waitingTime: '12 mins',
      status: 'waiting',
      pillbox: [
        { name: 'Metformin 500mg (Generic)', schedule: '☀️ Morning • 🌙 Night', takenToday: true, totalDays: 30, remaining: 18 },
        { name: 'Amlodipine 5mg (Generic)', schedule: '🌙 Bedtime Only', takenToday: true, totalDays: 30, remaining: 22 },
      ],
      prescriptions: [
        {
          id: 'RX-2026-08',
          date: '14 Aug 2026',
          doctor: 'Dr. Vikram Sharma, MBBS',
          facility: 'PHC Mandya Sub-Center',
          medicines: 'Metformin 500mg (1-0-1), Amlodipine 5mg (0-0-1)',
          instructionsKn: 'ಬೆಳಿಗ್ಗೆ ಮತ್ತು ರಾತ್ರಿ ಊಟಕ್ಕೆ ಮುಂಚೆ 1 ಮಾತ್ರೆ ನೀರಿನೊಂದಿಗೆ ಸೇವಿಸಿ.',
          status: 'Active',
          savings: '₹151 Saved (Jan Aushadhi)'
        }
      ],
      vitalsTimeline: [
        { date: 'Today (02 Sep)', bp: '168/104 mmHg', sugar: '178 mg/dL', weight: '68 kg', notes: 'Dizziness reported at triage' },
        { date: '14 Aug 2026', bp: '155/95 mmHg', sugar: '162 mg/dL', weight: '69 kg', notes: 'Low sodium dietary counsel' },
      ],
      organs: [
        { name: 'Heart & Blood Vessels', icon: '🫀', status: 'High Pressure Stress', tip: 'Cut salt intake below 1 teaspoon daily' },
        { name: 'Pancreas (Insulin)', icon: '🩸', status: 'Insulin Resistance', tip: 'Eat whole ragi mudde instead of polished white rice' },
      ]
    },
    {
      id: 'OPD-102',
      name: 'Sunita Bai',
      phone: '+91 98765 00333',
      abhaId: '91-5521-1109-8833',
      age: 27,
      gender: 'Female',
      village: 'Hassan Rural',
      district: 'Hassan',
      state: 'Karnataka',
      bloodGroup: 'A +ve',
      ashaWorker: 'Kavitha M. (+91 98765 44332)',
      emergencyContact: 'Manjunath (Husband) • +91 98765 22334',
      complaint: '3rd Trimester ANC Checkup • Extreme fatigue',
      vitals: { bp: '118/76 mmHg', pulse: '82 bpm', spo2: '99%', hb: '8.2 g/dL' },
      triage: 'high_risk',
      chronic: 'High Risk Pregnancy (32 Weeks) • Moderate Anemia',
      allergies: 'Penicillin Sensitivity',
      contraindication: 'Moderate Anemia (Hb 8.2 g/dL). Free IFA Red Tablets & Calcium booster indicated.',
      adherenceRate: '88%',
      waitingTime: '18 mins',
      status: 'waiting',
      pillbox: [
        { name: 'IFA Red Iron Tablet (Govt Free)', schedule: '🌤️ Afternoon After Food', takenToday: true, totalDays: 100, remaining: 42 },
        { name: 'Calcium Carbonate 500mg', schedule: '☀️ Morning After Breakfast', takenToday: true, totalDays: 100, remaining: 50 },
      ],
      prescriptions: [
        {
          id: 'RX-ANC-03',
          date: '20 Jul 2026',
          doctor: 'Dr. Anita Desai, MD',
          facility: 'Hassan Community Health Center',
          medicines: 'IFA Red Tablet + Calcium 500mg (Daily)',
          instructionsKn: 'ಮಧ್ಯಾಹ್ನ ಊಟದ ನಂತರ 1 ಕೆಂಪು ಕಬ್ಬಿಣದ ಮಾತ್ರೆ ಮತ್ತು ಬೆಳಿಗ್ಗೆ 1 ಕ್ಯಾಲ್ಸಿಯಂ ಮಾತ್ರೆ ಸೇವಿಸಿ.',
          status: 'Active',
          savings: '100% Free Govt Supply'
        }
      ],
      vitalsTimeline: [
        { date: 'Today (02 Sep)', bp: '118/76 mmHg', hb: '8.2 g/dL', weight: '59 kg', notes: 'Fundal height 32cm, FHR 142 bpm' }
      ],
      organs: [
        { name: 'Maternal & Fetal Placenta', icon: '🤰', status: '32 Weeks Gestation', tip: 'Take daily green leafy vegetables, jaggery, and drumstick leaves' }
      ]
    },
    {
      id: 'OPD-103',
      name: 'Prince Kumar',
      phone: '+91 90088 02105',
      abhaId: '91-4820-9921-7740',
      age: 19,
      gender: 'Male',
      village: 'Electronic City Rural',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      bloodGroup: 'B +ve',
      ashaWorker: 'Sunita Devi (+91 98123 45678)',
      emergencyContact: 'S. Kumar (Father) • +91 90088 02106',
      complaint: 'Seasonal wheezing & morning chest tightness',
      vitals: { bp: '122/80 mmHg', pulse: '76 bpm', spo2: '98%', temp: '98.6°F' },
      triage: 'stable',
      chronic: 'Bronchial Asthma (Mild)',
      allergies: 'Dust & Cold Fog Sensitivity',
      contraindication: 'Avoid Beta-blockers. Salbutamol Inhaler maintenance indicated.',
      adherenceRate: '96%',
      waitingTime: '24 mins',
      status: 'waiting',
      pillbox: [
        { name: 'Salbutamol MDI Inhaler 100mcg', schedule: '2 Puffs SOS / Morning', takenToday: true, totalDays: 60, remaining: 34 }
      ],
      prescriptions: [
        {
          id: 'RX-2026-06',
          date: '10 Jun 2026',
          doctor: 'Dr. Vikram Sharma, MBBS',
          facility: 'PHC Electronic City Sub-Center',
          medicines: 'Salbutamol Inhaler 100mcg + Montelukast 10mg',
          instructionsKn: 'ಉಸಿರಾಟ ತೊಂದರೆ ಇದ್ದಾಗ ಇನ್ಹೇಲರ್ ಬಳಸಿ.',
          status: 'Active',
          savings: '₹210 Saved (Jan Aushadhi)'
        }
      ],
      vitalsTimeline: [
        { date: 'Today (02 Sep)', bp: '122/80 mmHg', spo2: '98%', weight: '65 kg', notes: 'Mild wheezing on auscultation' }
      ],
      organs: [
        { name: 'Lungs & Bronchi', icon: '🫁', status: 'Airway Hyperreactivity', tip: 'Use steam inhalation and avoid cold morning fog' }
      ]
    },
    {
      id: 'OPD-104',
      name: 'Gopal Gowda',
      phone: '+91 98765 00444',
      abhaId: '91-7711-2299-6611',
      age: 64,
      gender: 'Male',
      village: 'Mandya Catchment #4',
      district: 'Mandya',
      state: 'Karnataka',
      bloodGroup: 'AB +ve',
      ashaWorker: 'Sunita Devi (+91 98123 45678)',
      emergencyContact: 'Chenna Gowda (Brother) • +91 98765 77889',
      complaint: 'Routine Monthly BP & Diabetes Refill Due',
      vitals: { bp: '138/88 mmHg', pulse: '74 bpm', spo2: '98%', temp: '98.2°F' },
      triage: 'review',
      chronic: 'Hypertension • Metformin Due',
      allergies: 'No Known Drug Allergies',
      contraindication: 'Check Renal Function & Serum Creatinine every 6 months.',
      adherenceRate: '85%',
      waitingTime: '30 mins',
      status: 'waiting',
      pillbox: [
        { name: 'Amlodipine 5mg (Jan Aushadhi)', schedule: '🌙 1 Bedtime (HS)', takenToday: true, totalDays: 30, remaining: 4 }
      ],
      prescriptions: [
        {
          id: 'RX-2026-08',
          date: '01 Aug 2026',
          doctor: 'Dr. Anita Desai, MD',
          facility: 'PHC Mandya Catchment #4',
          medicines: 'Tab Amlodipine 5mg + Metformin 500mg',
          status: 'Refills Due',
          savings: '₹140 Saved (Jan Aushadhi)'
        }
      ],
      vitalsTimeline: [
        { date: 'Today (02 Sep)', bp: '138/88 mmHg', pulse: '74 bpm', weight: '72 kg', notes: 'Monthly refill due' }
      ],
      organs: [
        { name: 'Kidneys & Filtration', icon: '🫘', status: 'Stable', tip: 'Drink minimum 2.5 litres clean boiled water daily' }
      ]
    },
    {
      id: 'OPD-105',
      name: 'Ramu Naik',
      phone: '+91 98765 00555',
      abhaId: '91-6633-1199-8822',
      age: 42,
      gender: 'Male',
      village: 'Hassan North Block',
      district: 'Hassan',
      state: 'Karnataka',
      bloodGroup: 'O +ve',
      ashaWorker: 'Kavitha M. (+91 98765 44332)',
      emergencyContact: 'Parvathi (Wife) • +91 98765 33445',
      complaint: 'Acute fever, throat infection & productive cough',
      vitals: { bp: '124/82 mmHg', pulse: '86 bpm', spo2: '97%', temp: '101.2°F' },
      triage: 'stable',
      chronic: 'Acute Bacterial Pharyngitis',
      allergies: 'No Known Drug Allergies',
      contraindication: 'Take full 5-day antibiotic course. Stay well hydrated.',
      adherenceRate: '90%',
      waitingTime: '35 mins',
      status: 'waiting',
      pillbox: [
        { name: 'Amoxyclav 625mg (Jan Aushadhi)', schedule: '☀️ 1 Morning • 🌙 1 Night (5 Days)', takenToday: true, totalDays: 5, remaining: 3 }
      ],
      prescriptions: [
        {
          id: 'RX-2026-09',
          date: '02 Sep 2026',
          doctor: 'Dr. Vikram Sharma, MBBS',
          facility: 'PHC Mandya District',
          medicines: 'Tab Amoxyclav 625mg + Paracetamol 650mg',
          status: 'Active',
          savings: '₹162 Saved (Jan Aushadhi)'
        }
      ],
      vitalsTimeline: [
        { date: 'Today (02 Sep)', bp: '124/82 mmHg', pulse: '86 bpm', temp: '101.2°F', weight: '68 kg', notes: 'Fever & throat congestion' }
      ],
      organs: [
        { name: 'Throat & Upper Airway', icon: '🗣️', status: 'Inflamed', tip: 'Warm salt water gargle 3 times daily' }
      ]
    }
  ]);

  const clinicalPresets = {
    diabetes: {
      name: 'Type-2 Diabetes Management',
      brandedName: 'Glucophage 500mg (Branded)',
      brandedPrice: 185,
      genericName: 'Metformin Hydrochloride 500mg (Jan Aushadhi)',
      genericPrice: 34,
      savings: 151,
      pct: '81%',
      scheduleSun: '1 Tablet Before Breakfast',
      scheduleMoon: '1 Tablet Before Dinner',
      instructions: 'Take 1 tablet morning and night before food with water.',
      kannada: 'ಬೆಳಿಗ್ಗೆ ಮತ್ತು ರಾತ್ರಿ ಊಟಕ್ಕೆ ಮುಂಚೆ 1 ಮಾತ್ರೆ ನೀರಿನೊಂದಿಗೆ ಸೇವಿಸಿ.',
      hindi: 'सुबह और रात को खाना खाने से पहले 1-1 गोली पानी के साथ लें।'
    },
    hypertension: {
      name: 'Hypertension / High BP Care',
      brandedName: 'Norvasc 5mg (Branded)',
      brandedPrice: 145,
      genericName: 'Amlodipine Besylate 5mg (Jan Aushadhi)',
      genericPrice: 22,
      savings: 123,
      pct: '85%',
      scheduleSun: '— No Morning Dose —',
      scheduleMoon: '1 Tablet at Bedtime (HS)',
      instructions: 'Take 1 tablet daily at bedtime. Limit salt intake.',
      kannada: 'ಪ್ರತಿದಿನ ರಾತ್ರಿ ಮಲಗುವ ಮುನ್ನ 1 ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ. ಉಪ್ಪನ್ನು ಕಡಿಮೆ ಮಾಡಿ.',
      hindi: 'रोजाना रात को सोते समय 1 गोली लें। खाने में नमक कम करें।'
    },
    infection: {
      name: 'Acute Bacterial Infection & Fever',
      brandedName: 'Augmentin 625 Duo (Branded)',
      brandedPrice: 224,
      genericName: 'Amoxyclav 625mg Generic (Jan Aushadhi)',
      genericPrice: 62,
      savings: 162,
      pct: '72%',
      scheduleSun: '1 Tablet After Breakfast',
      scheduleMoon: '1 Tablet After Dinner',
      instructions: 'Take 1 tablet morning and night after food for full 5 days.',
      kannada: 'ಬೆಳಿಗ್ಗೆ ಮತ್ತು ರಾತ್ರಿ ಊಟದ ನಂತರ 1 ಮಾತ್ರೆ 5 ದಿನಗಳ ಕಾಲ ಪೂರ್ತಿ ತೆಗೆದುಕೊಳ್ಳಿ.',
      hindi: 'सुबह और रात को खाना खाने के बाद 1-1 गोली लें। 5 दिन का कोर्स पूरा करें।'
    },
    anc: {
      name: 'Maternal Nutrition (ANC 3rd Trimester)',
      brandedName: 'Autrin / Shelcal 500 (Branded)',
      brandedPrice: 195,
      genericName: 'IFA Red Tablet + Calcium 500mg (Govt Free Supply)',
      genericPrice: 0,
      savings: 195,
      pct: '100% Free',
      scheduleSun: '1 Calcium 500mg (Morning)',
      scheduleMoon: '1 Red IFA Iron Tablet (Afternoon)',
      instructions: 'Take 1 Calcium in morning and 1 Red Iron tablet in afternoon after food.',
      kannada: 'ಮಧ್ಯಾಹ್ನ ಊಟದ ನಂತರ 1 ಕೆಂಪು ಕಬ್ಬಿಣದ ಮಾತ್ರೆ ಮತ್ತು ಬೆಳಿಗ್ಗೆ 1 ಕ್ಯಾಲ್ಸಿಯಂ ಮಾತ್ರೆ ಸೇವಿಸಿ.',
      hindi: 'दोपहर में 1 लाल आयरन की गोली और सुबह 1 कैल्शियम की गोली लें।'
    }
  };
  const activePreset = clinicalPresets[selectedDiagnosis];

  // Universal Search Filter (Matches Name, Phone, 14-Digit ABHA ID, Village)
  const cleanQuery = searchQuery.trim().toLowerCase().replace(/[-+\s]/g, '');
  const filteredPatients = opdPatients.filter(p => {
    const matchesFilter = triageFilter === 'all' || p.triage === triageFilter;
    const cleanPhone = p.phone.replace(/[-+\s]/g, '');
    const cleanAbha = p.abhaId.replace(/[-+\s]/g, '');
    const cleanName = p.name.toLowerCase();
    const cleanVillage = p.village.toLowerCase();

    const matchesSearch = !cleanQuery || 
                          cleanPhone.includes(cleanQuery) ||
                          cleanAbha.includes(cleanQuery) ||
                          cleanName.includes(cleanQuery) ||
                          cleanVillage.includes(cleanQuery);
    return matchesFilter && matchesSearch;
  });

  const handleOpenRxWriter = (patient) => {
    setRxPatient(patient);
    setDoctorDictationNotes('');
    if (patient.chronic.includes('Diabetes')) setSelectedDiagnosis('diabetes');
    else if (patient.chronic.includes('Pregnancy')) setSelectedDiagnosis('anc');
    else if (patient.chronic.includes('Hypertension')) setSelectedDiagnosis('hypertension');
    else setSelectedDiagnosis('infection');
    setShowRxModal(true);
  };

  const handleOpenHistory = async (patient) => {
    setHistoryPatient(patient);
    setActiveHistoryTab('pillbox');
    setShowHistoryModal(true);

    try {
      const liveData = await healthcareWorkerApi.lookupPatientByAbha(patient.abhaId);
      if (liveData && liveData.prescriptions && liveData.prescriptions.length > 0) {
        setHistoryPatient(prev => ({
          ...prev,
          prescriptions: [
            ...liveData.prescriptions.map(rx => ({
              id: `RX-LIVE-${rx.id}`,
              date: rx.date || 'Today (Uploaded)',
              doctor: rx.doctor_name || 'Patient Self-Upload / ASHA',
              facility: 'ABDM Health Locker Sync',
              medicines: Array.isArray(rx.medicines) 
                ? rx.medicines.map(m => typeof m === 'object' ? `${m.name} (${m.dosage || ''})` : m).join(', ')
                : (rx.diagnosis || 'Uploaded Prescription'),
              instructionsKn: rx.instructions_kn || 'ಬೆಳಿಗ್ಗೆ ಮತ್ತು ರಾತ್ರಿ ಮಾತ್ರೆಯನ್ನು ಸರಿಯಾಗಿ ಸೇವಿಸಿ.',
              status: 'Live Synced',
              savings: 'Jan Aushadhi Active'
            })),
            ...(prev?.prescriptions || [])
          ],
          documents: liveData.documents || prev?.documents || []
        }));
      }
    } catch (err) {
      // Offline / cached state fallback
    }
  };

  const handleOpenPrintChart = (patient) => {
    setPrintPatient(patient);
    setShowPrintChartModal(true);
  };

  const handleApproveAshaRx = (id) => {
    setAshaQueue(prev => prev.filter(item => item.id !== id));
    if (showToast) showToast('✅ Prescription Digitally Signed & Approved to Patient ABHA Vault', 'success');
  };

  const handleSignAndIssueRx = () => {
    setShowRxModal(false);
    if (showToast) {
      showToast(`✅ Rx issued for ${rxPatient.name} with Jan Aushadhi generic savings of ₹${activePreset.savings}!`, 'success');
    }
    setOpdPatients(prev => prev.map(p => p.id === rxPatient.id ? { ...p, status: 'completed' } : p));
  };

  const handleDispatchWhatsAppAudio = (patient) => {
    if (showToast) {
      showToast(`📲 Audio guidance dispatched to ${patient.name} (${patient.phone}) via WhatsApp & 2G IVR!`, 'success');
    }
  };

  const playRxVernacularVoice = async () => {
    if (isPlayingRxVoice) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingRxVoice(false);
      return;
    }
    setIsPlayingRxVoice(true);
    const textToSpeak = rxLanguage === 'kn' ? activePreset.kannada : activePreset.hindi;
    await speakNativeAudio(textToSpeak, rxLanguage);
    setIsPlayingRxVoice(false);
  };

  const playHistoryVernacularVoice = async (text, lang = 'kn') => {
    if (isPlayingPatientAudio) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingPatientAudio(false);
      return;
    }
    setIsPlayingPatientAudio(true);
    await speakNativeAudio(text, lang);
    setIsPlayingPatientAudio(false);
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* 🏛️ 3 OFFICIAL GOVERNMENT LOGOS HEADER BANNER */}
      <GovtHeaderBanner 
        subtitle="Swasthya Sanchar Clinical OPD & Tele-Consultation Hub | नैदानिक ओपीडी एवं टेली-परामर्श केंद्र"
        showSisterProfile={false}
        rightCustomBadge={
          <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 p-1.5 pr-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#0B3B74] text-white flex items-center justify-center font-black text-xs border-2 border-sky-400 shadow-xs">
              👨‍⚕️ DR
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-black text-slate-900 dark:text-white">Dr. Vikram Sharma</div>
              <div className="text-[10px] text-[#0B3B74] dark:text-sky-400 font-bold">Medical Officer (MBBS, MD)</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400">Mandya PHC #2 • KMC-58291</div>
            </div>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">

      {/* 🇮🇳 CLINICAL SESSION SUB-HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        <div className="p-6 md:p-8 bg-gradient-to-r from-[#072448] via-[#0B3B74] to-[#0D4B8F] text-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black bg-white/20 border border-white/30 text-white uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                🏛️ MoHFW • National Health Mission
              </span>
              <span className="bg-[#FF9933] text-stone-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                ABDM Mandya PHC #2
              </span>
              <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                ● Live Clinical Session
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Swasthya Sanchar Clinical OPD &amp; Tele-Consultation Hub
            </h1>
            <p className="text-xs text-blue-100/90 font-medium max-w-2xl">
              Medical Officer: <strong className="text-white">Dr. Vikram Sharma, MBBS, MD (Reg: KMC-58291-KA)</strong>  
              <br className="hidden sm:inline" />
              Attached Facility: <strong className="text-white">Mandya #2 Primary Health Centre (Supervising 3 ASHA Cadres)</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Universal Search Input */}
            <div className="relative min-w-[240px]">
              <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search Mobile or ABHA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-200/60 pl-10 pr-8 py-2.5 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF9933]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/60 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => { setRxPatient(opdPatients[0]); setUseStepWizard(true); setShowRxModal(true); }}
              className="bg-[#00875A] hover:bg-emerald-600 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/40 whitespace-nowrap"
            >
              <PlusIcon size={18} />
              <span>+ Digital Rx Wizard</span>
            </button>
          </div>
        </div>

        {/* CLINICAL VIEW SELECTOR TABS */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center gap-3 overflow-x-auto">
          {[
            { id: 'queue', label: '🏥 Live Patient OPD Queue', count: opdPatients.filter(p => p.status === 'waiting').length },
            { id: 'asha', label: '📋 ASHA Prescription Verifications', count: ashaQueue.filter(a => a.status === 'pending').length },
            { id: 'directory', label: '📇 ABDM Patient Dossiers', count: opdPatients.length },
            { id: 'red_flags', label: '🚨 Clinical Red Flags & Emergencies', count: 3 },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMainTab(tab.id)}
              className={`text-xs font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeMainTab === tab.id
                  ? 'bg-[#0B3B74] text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeMainTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SLIM 4-KPI COMPACT METRIC STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's OPD</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">14 <span className="text-xs font-normal text-slate-400">/ 24</span></div>
          </div>
          <span className="text-2xl">👥</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950 p-3.5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Red Flags</div>
            <div className="text-xl font-black text-rose-600 mt-0.5">3 <span className="text-xs font-normal text-rose-400">Critical</span></div>
          </div>
          <span className="text-2xl animate-pulse">🚨</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-950 p-3.5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">ASHA Field Scans</div>
            <div className="text-xl font-black text-amber-600 mt-0.5">{ashaQueue.length} <span className="text-xs font-normal text-amber-400">Pending</span></div>
          </div>
          <span className="text-2xl">👩‍⚕️</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-950 p-3.5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Jan Aushadhi Savings</div>
            <div className="text-xl font-black text-emerald-600 mt-0.5">₹4,280</div>
          </div>
          <span className="text-2xl">💰</span>
        </div>
      </div>

      {/* 3. CLEAN WORKSPACE WITH TOP TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveMainTab('queue')}
            className={`text-xs font-black px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'queue'
                ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>📋 Live OPD Queue</span>
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {filteredPatients.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('directory')}
            className={`text-xs font-black px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'directory'
                ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🗂️ All Patients &amp; Profiles</span>
            <span className="bg-teal-700 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {opdPatients.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('asha')}
            className={`text-xs font-black px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'asha'
                ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>👩‍⚕️ ASHA Field Scans</span>
            <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {ashaQueue.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('red_flags')}
            className={`text-xs font-black px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'red_flags'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
            }`}
          >
            <span>🚨 Critical Red Flags (3)</span>
          </button>
        </div>

        {/* Priority Sub-Filters for Queue */}
        {activeMainTab === 'queue' && (
          <div className="flex items-center gap-1 text-xs">
            {['all', 'high_risk', 'review', 'stable'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setTriageFilter(tab)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  triageFilter === tab
                    ? 'bg-slate-900 dark:bg-slate-700 text-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'high_risk' ? '🔴 High Risk' : tab === 'review' ? '🟡 Review' : '🟢 Stable'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. MAIN CONTENT AREA (Clean, Focused, Uncluttered) */}
      
      {/* TAB 1: LIVE OPD QUEUE */}
      {activeMainTab === 'queue' && (
        <div className="space-y-3">
          {filteredPatients.map((patient) => {
            const isHighRisk = patient.triage === 'high_risk';
            return (
              <div 
                key={patient.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 transition-all space-y-3 ${
                  isHighRisk 
                    ? 'border-rose-300 dark:border-rose-900/60 shadow-xs'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isHighRisk 
                        ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200' 
                        : 'bg-teal-100 dark:bg-teal-900 text-[#0B4F42] dark:text-teal-200'
                    }`}>
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {patient.name}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          ({patient.age}y • {patient.gender})
                        </span>
                        {isHighRisk && (
                          <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">
                            CRITICAL TRIAGE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 flex-wrap mt-0.5">
                        <span>📱 <strong>{patient.phone}</strong></span>
                        <span>•</span>
                        <span>ABHA: <strong>{patient.abhaId}</strong></span>
                        <span>•</span>
                        <span>{patient.village}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-lg">
                      ⏱️ Waiting: {patient.waitingTime}
                    </span>
                  </div>
                </div>

                {/* Complaint, Safety Warning, and Vitals Strip */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    🩺 <strong className="text-slate-900 dark:text-white">Complaint:</strong> {patient.complaint}
                  </div>

                  {patient.contraindication && (
                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800 p-2 rounded-lg text-[11px] font-bold text-amber-900 dark:text-amber-200 flex items-start gap-1.5">
                      <span>🛡️</span>
                      <span><strong>Safety Alert:</strong> {patient.contraindication}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                      patient.vitals.bp.includes('168') 
                        ? 'bg-rose-100 text-rose-700 border-rose-300'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}>
                      🩸 BP: {patient.vitals.bp}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      💓 Pulse: {patient.vitals.pulse}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      🫁 SpO2: {patient.vitals.spo2}
                    </span>
                    {patient.vitals.hb && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                        🩸 Hb: {patient.vitals.hb}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleOpenHistory(patient)}
                      className="text-xs font-black text-[#0B4F42] dark:text-teal-300 hover:underline cursor-pointer"
                    >
                      📂 Open 360° ABHA Dossier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenPrintChart(patient)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      🖨️ Sun/Moon Chart
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDispatchWhatsAppAudio(patient)}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      📲 WhatsApp Audio
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenRxWriter(patient)}
                    className="bg-[#0B4F42] hover:bg-teal-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>✍️ Prescribe Rx →</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: ALL PATIENTS MASTER DIRECTORY & ABDM PROFILES (Doctor 360 View) */}
      {activeMainTab === 'directory' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>🗂️ Master ABDM Patient Directory</span>
                <span className="bg-teal-100 dark:bg-teal-950 text-[#0B4F42] dark:text-teal-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {filteredPatients.length} Total Patients
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Browse complete patient histories, past prescriptions, lab reports, and Ayushman ABHA profiles
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="pb-3">Patient &amp; ABHA ID</th>
                  <th className="pb-3">Village &amp; Blood Group</th>
                  <th className="pb-3">Diagnosed Conditions</th>
                  <th className="pb-3">Assigned ASHA</th>
                  <th className="pb-3 text-right">Medical Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5">
                      <div className="font-black text-slate-900 dark:text-white text-xs">{p.name} ({p.age}y • {p.gender})</div>
                      <div className="text-[10px] text-slate-500 font-mono">📱 {p.phone} • {p.abhaId}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{p.village}</div>
                      <div className="text-[10px] text-rose-600 font-bold">🩸 {p.bloodGroup}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{p.chronic}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="text-[11px] text-teal-700 dark:text-teal-300 font-medium">{p.ashaWorker}</span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenHistory(p)}
                        className="bg-[#0B4F42] hover:bg-teal-700 text-white font-black px-3.5 py-1.5 rounded-xl text-[11px] cursor-pointer shadow-xs transition-all"
                      >
                        📂 View Full 360° History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ASHA FIELD SCANS */}
      {activeMainTab === 'asha' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl">
            <h3 className="text-sm font-black text-amber-900 dark:text-amber-200">
              👩‍⚕️ ASHA Field Prescription Approvals Feed
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
              Prescriptions scanned in remote villages awaiting doctor verification &amp; digital signature
            </p>
          </div>

          {ashaQueue.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300">
              ✅ All ASHA village slips signed and verified!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ashaQueue.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">{item.patientName} ({item.age}y)</div>
                      <div className="text-[11px] text-slate-500 font-mono">📱 {item.phone} • Scanned by {item.ashaName}</div>
                    </div>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md">
                      {item.confidence} OCR Match
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono text-teal-800 dark:text-teal-300">
                    📝 {item.extractedRx}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApproveAshaRx(item.id)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckIcon size={14} color="#fff" />
                    <span>Approve &amp; Sign to Patient ABHA</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CRITICAL RED FLAGS */}
      {activeMainTab === 'red_flags' && (
        <div className="space-y-3">
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-4 rounded-2xl">
            <h3 className="text-sm font-black text-rose-900 dark:text-rose-200">
              🚨 Rural Critical Red-Flag Patient Monitor
            </h3>
            <p className="text-xs text-rose-800 dark:text-rose-300 mt-0.5">
              Patients requiring immediate clinical priority due to severe vitals or pregnancy risk
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-rose-300 dark:border-rose-900 space-y-2">
              <div className="font-black text-slate-900 dark:text-white flex items-center justify-between">
                <span>🔴 Lakshmi Devi Amma (Mandya)</span>
                <span className="text-rose-600 font-mono font-bold">BP 168/104</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Severe Stage-2 Hypertension crisis with dizzy spells. Priority consultation needed.
              </p>
              <button
                type="button"
                onClick={() => { setActiveMainTab('queue'); handleOpenRxWriter(opdPatients[0]); }}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Immediate Priority Consult →
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-300 dark:border-amber-900 space-y-2">
              <div className="font-black text-slate-900 dark:text-white flex items-center justify-between">
                <span>🟡 Sunita Bai (Hassan)</span>
                <span className="text-amber-600 font-mono font-bold">Hb 8.2 g/dL</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                3rd Trimester pregnancy with moderate anemia. Requires urgent IFA booster and calcium.
              </p>
              <button
                type="button"
                onClick={() => { setActiveMainTab('queue'); handleOpenRxWriter(opdPatients[1]); }}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Immediate Priority Consult →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RX MODAL — GUIDED 5-STEP WIZARD */}
      {showRxModal && rxPatient && useStepWizard && (
        <DoctorPrescriptionWizard 
          patient={rxPatient} 
          onCancel={() => { setUseStepWizard(false); setShowRxModal(false); }} 
          onSave={() => { setUseStepWizard(false); handleSignAndIssueRx(); }} 
          showToast={showToast} 
        />
      )}

      {/* RX MODAL — QUICK PRESET WRITER */}
      {showRxModal && rxPatient && !useStepWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#0B4F42] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    ✍️ DIGITAL RX WRITER &amp; JAN AUSHADHI MATCHER
                  </span>
                  <button
                    type="button"
                    onClick={() => setUseStepWizard(true)}
                    className="text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
                  >
                    📋 5-Step Wizard Mode →
                  </button>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  Prescribe for {rxPatient.name}
                </h3>
              </div>
              <button 
                onClick={() => { setShowRxModal(false); setUseStepWizard(false); }}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Safety Alert */}
            {rxPatient.contraindication && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 p-2.5 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200">
                🛡️ <strong>Safety Alert:</strong> {rxPatient.contraindication}
              </div>
            )}

            {/* Diagnosis Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                Select Clinical Protocol:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'diabetes', label: '🩺 Type-2 Diabetes' },
                  { id: 'hypertension', label: '🩸 Hypertension (BP)' },
                  { id: 'infection', label: '💊 Bacterial Infection' },
                  { id: 'anc', label: '🤰 Maternal Care (ANC)' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDiagnosis(d.id)}
                    className={`p-3 rounded-xl text-xs font-black text-left border transition-all cursor-pointer ${
                      selectedDiagnosis === d.id
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-[#0B4F42] dark:text-teal-300 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Jan Aushadhi Savings Matcher */}
            <div className="bg-gradient-to-r from-emerald-950 to-teal-950 text-white p-4 rounded-2xl border border-teal-700/60 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black text-teal-300 uppercase">
                <span>💰 PM Jan Aushadhi Generic Match</span>
                <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md">Save {activePreset.pct}!</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[10px] text-slate-300">Branded:</div>
                  <div className="font-bold text-rose-300 line-through">{activePreset.brandedName} (₹{activePreset.brandedPrice})</div>
                </div>
                <div>
                  <div className="text-[10px] text-teal-300">Jan Aushadhi Generic:</div>
                  <div className="font-black text-emerald-400">{activePreset.genericName} (₹{activePreset.genericPrice})</div>
                </div>
              </div>
            </div>

            {/* Vernacular Voice Preview */}
            <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span>🗣️ Patient Voice Preview:</span>
                <select
                  value={rxLanguage}
                  onChange={(e) => setRxLanguage(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 text-xs font-bold px-2 py-1 rounded-lg"
                >
                  <option value="kn">🇮🇳 Kannada (ಕನ್ನಡ)</option>
                  <option value="hi">🇮🇳 Hindi (हिंदी)</option>
                </select>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200">
                {rxLanguage === 'kn' ? activePreset.kannada : activePreset.hindi}
              </p>
              <button
                type="button"
                onClick={playRxVernacularVoice}
                className="bg-[#0B4F42] hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <SpeakerIcon size={14} color="#fff" />
                <span>{isPlayingRxVoice ? 'Playing...' : '🔊 Test Patient Audio'}</span>
              </button>
            </div>

            {/* Action */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRxModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignAndIssueRx}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckIcon size={14} color="#fff" />
                <span>Digitally Sign &amp; Push to ABHA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT CHART MODAL */}
      {showPrintChartModal && printPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-950 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border-4 border-[#0B4F42]">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h3 className="text-base font-black text-slate-950">GOVERNMENT PRIMARY HEALTH CENTRE (PHC)</h3>
                  <p className="text-[11px] text-slate-600 font-bold">PM Jan Aushadhi Visual Wall Chart</p>
                </div>
              </div>
              <button onClick={() => setShowPrintChartModal(false)} className="text-slate-500 font-bold cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl space-y-1">
                <div className="text-3xl">☀️</div>
                <div className="text-xs font-black text-amber-950 uppercase">Morning (ಬೆಳಿಗ್ಗೆ)</div>
                <div className="text-xs font-bold text-amber-900 bg-white p-2 rounded-xl border border-amber-200">
                  {clinicalPresets[selectedDiagnosis].scheduleSun}
                </div>
              </div>

              <div className="bg-indigo-50 border-2 border-indigo-300 p-4 rounded-2xl space-y-1">
                <div className="text-3xl">🌙</div>
                <div className="text-xs font-black text-indigo-950 uppercase">Night (ರಾತ್ರಿ)</div>
                <div className="text-xs font-bold text-indigo-900 bg-white p-2 rounded-xl border border-indigo-200">
                  {clinicalPresets[selectedDiagnosis].scheduleMoon}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => { window.print(); setShowPrintChartModal(false); }}
                className="bg-[#0B4F42] hover:bg-teal-700 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                🖨️ Print Physical Chart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL 360° ABDM PATIENT DOSSIER MODAL */}
      {showHistoryModal && historyPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="bg-[#0B4F42] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  🗂️ ABDM 360° PATIENT MEDICAL DOSSIER
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {historyPatient.name} ({historyPatient.age}y • {historyPatient.gender})
                </h3>
                <p className="text-xs text-slate-500 font-mono">📱 {historyPatient.phone} • ABHA: {historyPatient.abhaId}</p>
              </div>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 5 Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
              {[
                { id: 'pillbox', label: '💊 Active 5-Day Pillbox' },
                { id: 'prescriptions', label: '📄 Prescriptions & OCR' },
                { id: 'vitals_lab', label: '🩺 Vitals & Labs' },
                { id: 'abha_card', label: '🪪 Digital ABHA Card' },
                { id: 'gyan', label: '🫀 3D Organ Health' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveHistoryTab(tab.id)}
                  className={`text-xs font-black px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeHistoryTab === tab.id
                      ? 'bg-[#0B4F42] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content per Tab */}
            {activeHistoryTab === 'pillbox' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {historyPatient.pillbox.map((med, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="font-black text-xs text-slate-900 dark:text-white">💊 {med.name}</div>
                    <div className="text-[11px] text-slate-500">{med.schedule}</div>
                    <div className="text-[11px] font-bold text-emerald-600">Doses Left: {med.remaining} • Taken on Time</div>
                  </div>
                ))}
              </div>
            )}

            {activeHistoryTab === 'prescriptions' && (
              <div className="space-y-3">
                {historyPatient.prescriptions.map((rx, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="font-black text-xs text-slate-900 dark:text-white flex items-center justify-between">
                      <span>📝 {rx.id}</span>
                      <span className="text-[10px] font-mono text-slate-400">{rx.date}</span>
                    </div>
                    <div className="text-xs text-teal-800 dark:text-teal-300 font-mono bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200">
                      {rx.medicines}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeHistoryTab === 'vitals_lab' && (
              <div className="space-y-2">
                {historyPatient.vitalsTimeline.map((v, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-black text-slate-900 dark:text-white">{v.date}</div>
                      <div className="text-slate-500 text-[11px]">{v.notes}</div>
                    </div>
                    <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">🩸 {v.bp}</span>
                  </div>
                ))}
              </div>
            )}

            {activeHistoryTab === 'abha_card' && (
              <div className="max-w-sm mx-auto bg-gradient-to-br from-teal-950 to-slate-900 text-white p-5 rounded-2xl border border-teal-500 space-y-3">
                <div className="text-xs font-black uppercase text-teal-300">Ayushman Bharat ABDM Card</div>
                <div className="text-sm font-black">{historyPatient.name}</div>
                <div className="text-xs font-mono text-teal-200">{historyPatient.abhaId}</div>
                <div className="text-[11px] text-slate-300">Blood: {historyPatient.bloodGroup} • {historyPatient.village}</div>
              </div>
            )}

            {activeHistoryTab === 'gyan' && (
              <div className="grid grid-cols-2 gap-3">
                {historyPatient.organs.map((organ, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-2xl">{organ.icon}</span>
                    <div className="font-black text-xs text-slate-900 dark:text-white">{organ.name}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">{organ.tip}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="bg-slate-900 text-white text-xs font-bold px-5 py-2 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default DoctorDashboardPage;
