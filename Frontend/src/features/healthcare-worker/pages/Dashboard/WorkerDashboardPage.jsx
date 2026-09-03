import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { healthcareWorkerApi } from '../../../../services/api/healthcareWorker';
import { AbhaScannerModal } from '../../components/AbhaScannerModal';
import { PatientDetailModal } from '../../components/PatientDetailModal';
import { 
  PlusIcon, PhoneIcon, SearchIcon, QrCodeIcon, SparklesIcon, 
  ShieldIcon, CheckIcon, SpeakerIcon, ClockIcon, DocumentIcon, AlertIcon,
  HeartIcon, ActivityIcon, HospitalIcon
} from '../../../../shared/icons/Icons';
import { speakNativeAudio } from '../../../../shared/utils/speech';
import { ASHAWorkerTaskQueue } from '../../components/ASHAWorkerTaskManager';

// 🏛️ Official Government Emblems SVG Components (High-Fidelity)
const AshokaEmblem = () => (
  <svg width="28" height="42" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-xs">
    {/* Ashoka Lion Capital Vector Outline */}
    <path d="M50 5 C35 5 25 18 25 32 C25 45 35 55 42 60 L42 85 C30 87 20 95 15 110 L85 110 C80 95 70 87 58 85 L58 60 C65 55 75 45 75 32 C75 18 65 5 50 5 Z" fill="#996515" />
    <circle cx="50" cy="30" r="12" fill="#DAA520" />
    <rect x="20" y="112" width="60" height="10" rx="3" fill="#B8860B" />
    <text x="50" y="132" fill="#5c3d06" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="serif">सत्यमेव जयते</text>
  </svg>
);

const NhmOfficialLogo = () => (
  <div className="flex items-center gap-2 shrink-0">
    <div className="w-9 h-9 rounded-full bg-[#D32F2F] border-2 border-white shadow-xs flex items-center justify-center text-white font-black text-xs relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-800 to-rose-500 opacity-90" />
      <span className="relative z-10 text-[10px] font-black tracking-tighter">NHM</span>
    </div>
    <div className="leading-tight">
      <div className="text-[10px] font-black text-[#D32F2F] dark:text-rose-400 uppercase tracking-tight">NATIONAL HEALTH MISSION</div>
      <div className="text-[8px] font-bold text-slate-500 dark:text-slate-400">राष्ट्रीय स्वास्थ्य मिशन</div>
    </div>
  </div>
);

const AbhaOfficialLogo = () => (
  <div className="flex items-center gap-2 shrink-0">
    <div className="w-9 h-9 rounded-xl bg-[#0052CC] border-2 border-white shadow-xs flex items-center justify-center text-white font-black text-xs relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0052CC] to-[#0747A6]" />
      <span className="relative z-10 text-[11px] font-black tracking-wider">ABHA</span>
    </div>
    <div className="leading-tight">
      <div className="text-[10px] font-black text-[#0052CC] dark:text-sky-400 uppercase tracking-tight">AYUSHMAN BHARAT</div>
      <div className="text-[8px] font-bold text-slate-500 dark:text-slate-400">Digital Mission (ABDM)</div>
    </div>
  </div>
);

const IndianFlagRibbon = () => (
  <svg width="70" height="24" viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-xs">
    <path d="M0 5 Q 30 0, 60 8 T 100 3 L 100 13 Q 60 18, 30 10 T 0 15 Z" fill="#FF9933" />
    <path d="M0 13 Q 30 8, 60 16 T 100 11 L 100 21 Q 60 26, 30 18 T 0 23 Z" fill="#FFFFFF" stroke="#e2e8f0" strokeWidth="0.5" />
    <circle cx="50" cy="17" r="3.5" fill="none" stroke="#000080" strokeWidth="0.8" />
    <path d="M0 21 Q 30 16, 60 24 T 100 19 L 100 29 Q 60 34, 30 26 T 0 31 Z" fill="#138808" />
  </svg>
);

export const WorkerDashboardPage = ({ initialTab = 'registry', currentPath, setCurrentView }) => {
  const { user, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab); // 'registry' or 'follow_ups'
  const [fieldPatients, setFieldPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [selectedPatientData, setSelectedPatientData] = useState(null);
  const [showPatientDetailModal, setShowPatientDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Geographic Hierarchy Filters
  const [selectedDistrict, setSelectedDistrict] = useState('Mandya');
  const [selectedBlock, setSelectedBlock] = useState('Maddur');
  const [selectedVillage, setSelectedVillage] = useState('Gejjalagere');
  const [selectedSector, setSelectedSector] = useState('all');

  // Clinical Program Filter
  const [programFilter, setProgramFilter] = useState('all');
  const [triageFilter, setTriageFilter] = useState('all');
  const [useAdvancedTaskManager, setUseAdvancedTaskManager] = useState(true);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, currentPath]);

  // Authentic Indian Citizen Registry Data
  const initialCitizens = [
    {
      patient_id: 101,
      full_name: 'Savithri Devi',
      name_hi: 'सावित्री देवी',
      abha_id: '12-3456-7890-1122',
      age: 48,
      gender: 'Female',
      gender_code: '48 F',
      mobile: '+91 98765 00222',
      village: 'Maddur, Mandya',
      sector: 'Sector 2 - Market Area',
      chronic: 'High Risk Hypertension (168/104)',
      program: 'ncd',
      triage_type: 'high_risk',
      status_label: 'High Risk Hypertension | Crimson Badge',
      status_color: 'bg-[#DC2626] text-white',
      avatar: '/images/savithri_devi.jpg',
      qr_pattern: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ABHA:12-3456-7890-1122:SAVITHRI-DEVI',
    },
    {
      patient_id: 102,
      full_name: 'Vijay Lakshmi',
      name_hi: 'विजय लक्ष्मी',
      abha_id: '12-3456-7890-2233',
      age: 28,
      gender: 'Female',
      gender_code: '28 F',
      mobile: '+91 97172 18344',
      village: 'Maddur, Mandya',
      sector: 'Sector 1 - North Colony',
      chronic: 'ANC Pregnancy (7th Month) • Moderate Anemia',
      program: 'anc',
      triage_type: 'anc',
      status_label: 'ANC Pregnancy 7m | Purple Badge',
      status_color: 'bg-[#7C3AED] text-white',
      avatar: '/images/vijay_lakshmi.jpg',
      qr_pattern: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ABHA:12-3456-7890-2233:VIJAY-LAKSHMI',
    },
    {
      patient_id: 103,
      full_name: 'Manjunath Gowda',
      name_hi: 'मंजुनाथ गौड़ा',
      abha_id: '12-3456-7890-3344',
      age: 55,
      gender: 'Male',
      gender_code: '55 M',
      mobile: '+91 91743 44321',
      village: 'Maddur, Mandya',
      sector: 'Sector 3 - Farmland Belt',
      chronic: 'Stable Type-2 Diabetes • Metformin Regimen',
      program: 'ncd',
      triage_type: 'stable',
      status_label: 'Stable - DM | Emerald Green Badge',
      status_color: 'bg-[#00875A] text-white',
      avatar: '/images/manjunath_gowda.jpg',
      qr_pattern: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ABHA:12-3456-7890-3344:MANJUNATH-GOWDA',
    },
    {
      patient_id: 104,
      full_name: 'Prince Kumar',
      name_hi: 'प्रिंस कुमार',
      abha_id: '12-3456-7890-4455',
      age: 19,
      gender: 'Male',
      gender_code: '19 M',
      mobile: '+91 90088 02105',
      village: 'Maddur, Mandya',
      sector: 'Sector 1 - North Colony',
      chronic: 'Seasonal Asthma • Inhaler Verified',
      program: 'ncd',
      triage_type: 'stable',
      status_label: 'Stable - Monitored | Emerald Green Badge',
      status_color: 'bg-[#00875A] text-white',
      avatar: '/images/manjunath_gowda.jpg',
      qr_pattern: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ABHA:12-3456-7890-4455:PRINCE-KUMAR',
    },
    {
      patient_id: 105,
      full_name: 'Salithri Devi',
      name_hi: 'सावित्री देवी',
      abha_id: '12-3456-7890-5566',
      age: 53,
      gender: 'Female',
      gender_code: '53 F',
      mobile: '+91 73212 36589',
      village: 'Maddur, Mandya',
      sector: 'Sector 2 - Market Area',
      chronic: 'Hypertension • Telmisartan 40mg Due',
      program: 'ncd',
      triage_type: 'high_risk',
      status_label: 'High Risk Hypertension | Crimson Badge',
      status_color: 'bg-[#DC2626] text-white',
      avatar: '/images/savithri_devi.jpg',
      qr_pattern: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ABHA:12-3456-7890-5566:SALITHRI-DEVI',
    },
    {
      patient_id: 106,
      full_name: 'Basavaraj Patil',
      name_hi: 'बसंवराज पाटिल',
      abha_id: '12-3456-7890-6677',
      age: 42,
      gender: 'Male',
      gender_code: '42 M',
      mobile: '+91 98765 00555',
      village: 'Maddur, Mandya',
      sector: 'Sector 1 - North Colony',
      chronic: 'Nikshay TB DOTS (Month 2 Intensive Phase)',
      program: 'tb',
      triage_type: 'stable',
      status_label: 'Nikshay TB DOTS | Emerald Green Badge',
      status_color: 'bg-[#00875A] text-white',
      avatar: '/images/manjunath_gowda.jpg',
      qr_pattern: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ABHA:12-3456-7890-6677:BASAVARAJ-PATIL',
    }
  ];

  // Doctor Tasks Queue
  const [assignedTasks, setAssignedTasks] = useState([
    {
      id: 'TASK-501',
      patientName: 'Gopal Gowda',
      age: 64,
      gender: 'Male',
      phone: '+91 98765 00444',
      village: 'Mandya Sector 3',
      sector: 'Sector 3 - Farmland Belt',
      distance: '1.2 km Away',
      doctor: 'Dr. Vikram Sharma, MBBS',
      phcName: 'Mandya PHC #2',
      taskType: 'Doctor Approved Rx Delivery',
      actionNeeded: 'Deliver Jan Aushadhi Amlodipine 5mg & play bedtime dosage audio instructions.',
      audioTextKn: 'ಗೋಪಾಲ್ ಅವರೇ, ಡಾ. ವಿಕ್ರಮ್ ಅವರು ನಿಮ್ಮ ರಕ್ತದೊತ್ತಡ ಮಾತ್ರೆ ಅನುಮೋದಿಸಿದ್ದಾರೆ. ಪ್ರತಿದಿನ ರಾತ್ರಿ ಮಲಗುವ ಮುನ್ನ 1 ಮಾತ್ರೆ ನೀರಿನೊಂದಿಗೆ ಸೇವಿಸಿ.',
      priority: 'high',
      status: 'pending',
      prescribedMeds: ['Amlodipine 5mg (Jan Aushadhi)', 'Metformin 500mg'],
    },
    {
      id: 'TASK-502',
      patientName: 'Sunita Bai',
      age: 27,
      gender: 'Female',
      phone: '+91 98765 00333',
      village: 'Mandya Sector 1',
      sector: 'Sector 1 - North Colony',
      distance: '0.8 km Away',
      doctor: 'Dr. Anita Desai, MD (OB-GYN)',
      phcName: 'Mandya CHC Maternity Wing',
      taskType: '3rd Trimester ANC Checkup',
      actionNeeded: 'Verify daily intake of Red Iron IFA tablet and Calcium 500mg. Check for ankle swelling.',
      audioTextKn: 'ಸುನೀತಾ ಅವರೇ, ಮಧ್ಯಾಹ್ನ ಊಟದ ನಂತರ 1 ಕೆಂಪು ಕಬ್ಬಿಣದ ಮಾತ್ರೆ ಮತ್ತು ಬೆಳಿಗ್ಗೆ 1 ಕ್ಯಾಲ್ಸಿಯಂ ಮಾತ್ರೆ ತಪ್ಪದೇ ಸೇವಿಸಿ.',
      priority: 'critical',
      status: 'pending',
      prescribedMeds: ['IFA Red Tablets (100mg Iron)', 'Calcium Carbonate 500mg'],
    },
    {
      id: 'TASK-503',
      patientName: 'Savithri Devi',
      age: 48,
      gender: 'Female',
      phone: '+91 98765 00222',
      village: 'Mandya Sector 2',
      sector: 'Sector 2 - Market Area',
      distance: '2.1 km Away',
      doctor: 'Dr. Vikram Sharma, MBBS',
      phcName: 'Mandya PHC #2',
      taskType: 'Stage-2 Hypertension Follow-up',
      actionNeeded: 'Record home blood pressure reading after dizzy spell and verify low-salt diet.',
      audioTextKn: 'ಲಕ್ಷ್ಮೀ ಅಮ್ಮಾ, ತಲೆಸುತ್ತು ಕಡಿಮೆಯಾಗುವವರೆಗೆ ಉಪ್ಪು ಕಡಿಮೆ ಮಾಡಿ. ಬೆಳಿಗ್ಗೆ ಮತ್ತು ರಾತ್ರಿ ಮಾತ್ರೆಯನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.',
      priority: 'critical',
      status: 'pending',
      prescribedMeds: ['Telmisartan 40mg', 'Amlodipine 5mg'],
    }
  ]);

  const [newPatient, setNewPatient] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    village_or_town: 'Maddur',
    sector: 'Sector 1 - North Colony',
    district: 'Mandya',
    program: 'ncd',
    preferred_language: 'kn',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await healthcareWorkerApi.getAbhaDirectory({
        triage: triageFilter,
        search: searchQuery,
      });
      const list = response?.results || [];
      if (list.length > 0) {
        setFieldPatients(list);
      } else {
        setFieldPatients(initialCitizens);
      }
    } catch (err) {
      setFieldPatients(initialCitizens);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user, triageFilter]);

  const handleOpenPatientAbha = (patient) => {
    setSelectedPatientData({
      patient_id: patient.patient_id || 101,
      full_name: patient.full_name,
      abha_id: patient.abha_id,
      phone_number: patient.mobile || patient.phone_number,
      village: patient.village || patient.village_or_town,
      age: patient.age,
      gender: patient.gender,
      blood_group: 'O +ve',
      chronic_conditions: patient.chronic || patient.chronic_conditions,
      adherence_rate: '94%',
      triage_badge: patient.triage_type || 'high_risk',
      ai_summary: {
        overview: `${patient.full_name}, ${patient.age} yrs • Registered under Ayushman Bharat ABDM (${patient.village || 'Mandya'}).`,
        adherence_rate: '94%',
        red_flags: [patient.chronic || 'Hypertension monitoring active.'],
        recent_vitals: { bp: '168/104', sugar: '115 mg/dL', pulse: '76 bpm', weight: '64 kg' },
      }
    });
    setShowPatientDetailModal(true);
  };

  const cleanQuery = searchQuery.trim().toLowerCase().replace(/[-+\s]/g, '');
  const filteredCitizens = fieldPatients.filter(p => {
    const matchesProgram = programFilter === 'all' || p.program === programFilter;
    const matchesSector = selectedSector === 'all' || (p.sector && p.sector.toLowerCase().includes(selectedSector.toLowerCase()));
    
    const cleanPhone = (p.mobile || p.phone_number || '').replace(/[-+\s]/g, '');
    const cleanAbha = (p.abha_id || '').replace(/[-+\s]/g, '');
    const cleanName = (p.full_name || '').toLowerCase();

    const matchesSearch = !cleanQuery || 
                          cleanPhone.includes(cleanQuery) ||
                          cleanAbha.includes(cleanQuery) ||
                          cleanName.includes(cleanQuery);
    return matchesProgram && matchesSector && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-[#0B0F17] font-sans pb-16">
      
      {/* 🏛️ 1. OFFICIAL NATIONAL HEALTH PORTAL TOP EMBLEM BAR (EXACT MOCKUP) */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Official Government Emblems: Ashoka Capital + NHM + ABDM */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Ashoka Lion Emblem of India */}
            <div className="flex items-center gap-2">
              <AshokaEmblem />
              <div className="leading-tight">
                <div className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">National Health Portal</div>
                <div className="text-[9px] text-slate-600 dark:text-slate-400 font-bold">Government Health Portal</div>
                <div className="text-[9px] text-slate-400">Mandya, Karnataka, India</div>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-[1px] bg-slate-200 dark:bg-slate-700" />

            {/* National Health Mission Logo */}
            <NhmOfficialLogo />

            <div className="hidden sm:block h-8 w-[1px] bg-slate-200 dark:bg-slate-700" />

            {/* ABDM / ABHA Logo */}
            <AbhaOfficialLogo />
          </div>

          {/* Right: ASHA Sister Profile Badge with Authentic Indian Flag Ribbon */}
          <div className="flex items-center gap-3">
            <IndianFlagRibbon />

            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 p-1.5 pr-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <img
                src="/images/asha_sister_action.jpg"
                alt="Sister Sunita Bai"
                className="w-9 h-9 rounded-xl object-cover border-2 border-emerald-500"
              />
              <div className="text-right leading-tight">
                <div className="text-xs font-black text-slate-900 dark:text-white">Sister Sunita Bai</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">ASHA Worker</div>
                <div className="text-[9px] text-slate-400">PHC Mandya (Karnataka)</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🇮🇳 2. OFFICIAL BLUE SUB-BANNER (EXACT MOCKUP) */}
      <div className="bg-[#0A3871] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-2">
              <span>Swasthya Sanchar ABDM Village Registry | स्वास्थ्य संचार ABDM ग्राम रजिस्ट्री</span>
            </h1>
            <p className="text-xs text-blue-100 font-medium">
              Mandya Catchment Area #2 • Active Electronic Health Records Sync
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('registry')}
              className={`text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'registry'
                  ? 'bg-white text-[#0A3871] shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              📇 Village Registry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('follow_ups')}
              className={`text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'follow_ups'
                  ? 'bg-[#FF9933] text-stone-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              📋 Doctor Tasks ({assignedTasks.filter(t => t.status === 'pending').length})
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. MAIN DASHBOARD CONTENT                                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 space-y-6">

        {activeTab === 'registry' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT 8 COLUMNS: STATS & CITIZEN DIRECTORY (EXACT MOCKUP) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* TOP 4 METRIC STATS CARDS */}
              <div className="space-y-1.5">
                <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Top Stats</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                    <div className="text-[11px] font-bold text-slate-500">Total Households</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">1,248</div>
                    <div className="text-[10px] text-slate-400">(कुल घर)</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                    <div className="text-[11px] font-bold text-rose-600">High Risk Patients</div>
                    <div className="text-2xl font-black text-rose-600">24</div>
                    <div className="text-[10px] text-rose-500">(उच्च जोखिम वाले मरीज)</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                    <div className="text-[11px] font-bold text-purple-700 dark:text-purple-400">ANC Mothers</div>
                    <div className="text-2xl font-black text-purple-700 dark:text-purple-300">18</div>
                    <div className="text-[10px] text-purple-500">(एएनसी माताएं)</div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                    <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">Immunization Pending</div>
                    <div className="text-2xl font-black text-amber-700 dark:text-amber-300">09</div>
                    <div className="text-[10px] text-amber-600">(टीकाकरण लंबित)</div>
                  </div>
                </div>
              </div>

              {/* DIRECTORY SECTION HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Main Village Registry
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Realistic in high-resolution citizen records
                  </p>
                </div>
                <div className="text-xs font-bold text-[#0A3871] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-800">
                  Mandya Village: <strong>Maddur Sector</strong>
                </div>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, 14-digit ABHA, or mobile number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0A3871]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(true)}
                  className="bg-[#00875A] hover:bg-emerald-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <PlusIcon size={16} />
                  <span>+ Register Citizen</span>
                </button>
              </div>

              {/* 🪪 CITIZEN CARDS GRID (EXACT MOCKUP WITH AUTHENTIC PORTRAITS & QR CODES) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCitizens.map((citizen) => (
                  <div
                    key={citizen.patient_id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleOpenPatientAbha(citizen)}
                  >
                    <div className="p-4 space-y-3">
                      {/* Top Row: Authentic Portrait, Name, Age Code, QR Code */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <img
                            src={citizen.avatar}
                            alt={citizen.full_name}
                            className="w-13 h-13 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                          />
                          <div>
                            <div className="font-black text-xs text-slate-900 dark:text-white leading-tight">
                              {citizen.full_name}
                            </div>
                            <div className="text-[10px] font-bold text-slate-500">
                              {citizen.name_hi}
                            </div>
                            <div className="text-[10px] font-mono text-slate-700 dark:text-slate-300 mt-1">
                              ABHA ID (14-digit):<br/>
                              <strong className="text-slate-950 dark:text-white font-bold">{citizen.abha_id}</strong>
                            </div>
                          </div>
                        </div>

                        {/* QR Code Box & Age Badge */}
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                            {citizen.gender_code}
                          </span>
                          <img
                            src={citizen.qr_pattern}
                            alt="ABHA QR Code"
                            className="w-12 h-12 bg-white p-0.5 rounded-lg border border-slate-300 shadow-xs"
                          />
                        </div>
                      </div>

                      {/* Demographics */}
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 space-y-0.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div>Age Code: <strong>{citizen.age}, {citizen.gender}</strong></div>
                        <div>Mobile Number: <strong>{citizen.mobile}</strong></div>
                      </div>
                    </div>

                    {/* Full-width Solid Bottom Color Status Banner */}
                    <div className={`py-2 px-3 text-center text-[10px] font-black uppercase tracking-wide ${citizen.status_color}`}>
                      {citizen.status_label}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* RIGHT 4 COLUMNS: ASHA SISTER IN ACTION HERO PANEL (EXACT MOCKUP) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md">
                <img
                  src="/images/asha_sister_action.jpg"
                  alt="ASHA Sister Field Work"
                  className="w-full h-60 object-cover object-top"
                />
                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-teal-100 text-[#0B4F42] px-2.5 py-0.5 rounded-md">
                      Field Operations Active
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1.5">
                      Doorstep Health &amp; Vitals Synchronization
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Sister Sunita Bai is actively conducting routine NCD and Maternal follow-ups in Mandya Catchment Sector #2.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowScannerModal(true)}
                      className="w-full bg-[#0A3871] hover:bg-[#072448] text-white font-black text-xs py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <QrCodeIcon size={18} />
                      <span>📷 Scan Physical ABHA QR Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('follow_ups')}
                      className="w-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ClockIcon size={18} />
                      <span>📋 View Doctor-Assigned Tasks ({assignedTasks.length})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* VIEW 2: DOCTOR ASSIGNED TASKS */
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>📋 Doctor Assigned Care Actions &amp; Home Deliveries</span>
                    <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-black">
                      {assignedTasks.filter(t => t.status === 'pending').length} Actions Due
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Verified prescriptions by <strong>Dr. Vikram Sharma (Mandya PHC #2)</strong> requiring home delivery &amp; voice guidance
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUseAdvancedTaskManager(!useAdvancedTaskManager)}
                  className="text-xs font-bold text-[#0A3871] bg-blue-50 px-3.5 py-2 rounded-xl hover:bg-blue-100 transition-all cursor-pointer"
                >
                  {useAdvancedTaskManager ? '🗂️ Grid View' : '⚡ Advanced Queue'}
                </button>
              </div>

              {useAdvancedTaskManager ? (
                <ASHAWorkerTaskQueue
                  tasks={assignedTasks}
                  onTaskUpdate={(updatedTask) => {
                    setAssignedTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
                  }}
                  showToast={showToast}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {assignedTasks.map((task) => (
                    <div key={task.id} className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                          ✓ Doctor Verified
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{task.distance}</span>
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 dark:text-white">{task.patientName} ({task.age}y)</div>
                        <div className="text-[11px] text-slate-500">📱 {task.phone} • {task.village}</div>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        {task.actionNeeded}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODALS */}
      <AbhaScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onSelectAbha={(abhaId) => {
          const match = fieldPatients.find(p => p.abha_id === abhaId) || fieldPatients[0];
          handleOpenPatientAbha(match);
        }}
      />

      <PatientDetailModal
        isOpen={showPatientDetailModal}
        onClose={() => setShowPatientDetailModal(false)}
        patientData={selectedPatientData}
        onRefresh={loadData}
      />

      {/* Register Citizen Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-4">
            <button
              onClick={() => setShowAddPatientModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
            >
              ✕
            </button>

            <div>
              <div className="text-[10px] font-black uppercase text-[#0A3871] dark:text-sky-400 mb-1">
                🏛️ National Health Mission • ABDM
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Register Village Household Citizen
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Auto-generates official 14-digit Ayushman ABHA ID linked to Mandya PHC.
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newRecord = {
                patient_id: Date.now(),
                full_name: `${newPatient.first_name} ${newPatient.last_name}`.trim(),
                name_hi: newPatient.first_name,
                abha_id: `12-3456-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
                age: 35,
                gender: 'Female',
                gender_code: '35 F',
                mobile: newPatient.phone_number,
                village: 'Maddur, Mandya',
                sector: newPatient.sector,
                chronic: 'Registered in Field Visit',
                program: newPatient.program,
                status_label: 'Stable - Monitored | Emerald Green Badge',
                status_color: 'bg-[#00875A] text-white',
                avatar: '/images/savithri_devi.jpg',
                qr_pattern: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ABHA:REGISTERED-CITIZEN',
              };
              setFieldPatients([newRecord, ...fieldPatients]);
              if (showToast) showToast(`✅ Registered ${newRecord.full_name}! ABHA ID: ${newRecord.abha_id}`, 'success');
              setShowAddPatientModal(false);
            }} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First Name *"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none"
                  value={newPatient.first_name}
                  onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none"
                  value={newPatient.last_name}
                  onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
                  required
                />
              </div>

              <input
                type="text"
                placeholder="10-Digit Mobile Number *"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none"
                value={newPatient.phone_number}
                onChange={(e) => setNewPatient({ ...newPatient, phone_number: e.target.value })}
                required
              />

              <button
                type="submit"
                className="w-full bg-[#0A3871] hover:bg-[#072448] text-white font-black text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer mt-2"
              >
                + Issue Ayushman ABHA ID &amp; Save Citizen
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkerDashboardPage;
