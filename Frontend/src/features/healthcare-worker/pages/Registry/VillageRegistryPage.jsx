import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { GovtHeaderBanner } from '../../../../components/layout/GovtHeaderBanner';
import { healthcareWorkerApi } from '../../../../services/api/healthcareWorker';
import { AbhaScannerModal } from '../../components/AbhaScannerModal';
import { AbhaRegistrationModal } from '../../components/AbhaRegistrationModal';
import { PatientDetailModal } from '../../components/PatientDetailModal';
import { 
  PlusIcon, PhoneIcon, SearchIcon, QrCodeIcon, SparklesIcon, 
  ShieldIcon, CheckIcon, SpeakerIcon, ClockIcon, DocumentIcon, AlertIcon,
  HeartIcon, ActivityIcon, HospitalIcon
} from '../../../../shared/icons/Icons';

export const VillageRegistryPage = ({ setCurrentView }) => {
  const { user, showToast } = useAuth();
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
    <div className="space-y-6 font-sans">
      
      {/* 1. 4-TIER GEOGRAPHIC HIERARCHY FILTER BAR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <span>🗺️ Geographic Catchment Filter</span>
              <span className="text-[10px] font-medium text-slate-400">(Public Health Hierarchy)</span>
            </span>
            <button 
              type="button" 
              onClick={() => { setSelectedSector('all'); setSelectedVillage('Gejjalagere'); }}
              className="text-[11px] font-bold text-[#0B3B74] dark:text-sky-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">1. District (जिला)</label>
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#0B3B74]"
              >
                <option value="Mandya">Mandya (Karnataka)</option>
                <option value="Hassan">Hassan</option>
                <option value="Mysuru">Mysuru</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">2. Block / Taluk (प्रखंड)</label>
              <select 
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#0B3B74]"
              >
                <option value="Maddur">Maddur Taluk</option>
                <option value="Pandavapura">Pandavapura</option>
                <option value="Malavalli">Malavalli</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">3. Gram Panchayat (ग्राम)</label>
              <select 
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#0B3B74]"
              >
                <option value="Gejjalagere">Gejjalagere (Mandya #2)</option>
                <option value="Besagarahalli">Besagarahalli</option>
                <option value="Shivalli">Shivalli</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">4. Sector / Ward (वार्ड)</label>
              <select 
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#0B3B74]"
              >
                <option value="all">All Wards / Sectors</option>
                <option value="Sector 1">Sector 1 - North Colony</option>
                <option value="Sector 2">Sector 2 - Market Area</option>
                <option value="Sector 3">Sector 3 - Farmland Belt</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. PROGRAM FILTER PILLS & SEARCH BAR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📇 Main Village Registry &amp; Census Directory</span>
                <span className="bg-[#0B3B74] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {filteredCitizens.length} Citizens
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Mandya Village: <strong>Maddur Sector</strong> • Realistic in high-resolution citizen records
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddPatientModal(true)}
              className="bg-[#00875A] hover:bg-emerald-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <PlusIcon size={16} />
              <span>+ Register Household Citizen</span>
            </button>
          </div>

          {/* Clinical Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: '🌐 All Registered Citizens' },
              { id: 'anc', label: '🤰 Maternal Care (ANC 1-3)' },
              { id: 'ncd', label: '💊 NCD: BP & Diabetes' },
              { id: 'tb', label: '🫁 Nikshay: TB DOTS' },
              { id: 'uip', label: '💉 Child Immunization' },
              { id: 'geriatric', label: '👵 Geriatric Care' },
            ].map((prog) => (
              <button
                key={prog.id}
                type="button"
                onClick={() => setProgramFilter(prog.id)}
                className={`text-xs font-black px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                  programFilter === prog.id
                    ? 'bg-[#0B3B74] text-white border-[#0B3B74] shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{prog.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, 14-digit ABHA (12-3456-7890-1122), or mobile number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
            />
          </div>

          {/* 🪪 CITIZEN CARDS GRID (EXACT MOCKUP WITH AUTHENTIC PORTRAITS & QR CODES) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredCitizens.map((citizen) => (
              <div
                key={citizen.patient_id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleOpenPatientAbha(citizen)}
              >
                <div className="p-4 space-y-3">
                  {/* Top Row: Authentic Portrait, Name, Age Code, QR Code */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={citizen.avatar}
                        alt={citizen.full_name}
                        style={{ width: '60px', height: '60px', minWidth: '60px', minHeight: '60px' }}
                        className="rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-black text-xs text-slate-900 dark:text-white leading-tight truncate">
                          {citizen.full_name}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 truncate">
                          {citizen.name_hi}
                        </div>
                        <div className="text-[10px] font-mono text-slate-700 dark:text-slate-300 mt-1">
                          ABHA ID:<br/>
                          <strong className="text-slate-950 dark:text-white font-bold">{citizen.abha_id}</strong>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Box & Age Badge */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                        {citizen.gender_code}
                      </span>
                      <img
                        src={citizen.qr_pattern}
                        alt="ABHA QR Code"
                        style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px' }}
                        className="bg-white p-0.5 rounded-lg border border-slate-300 shadow-xs"
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

      {/* MODALS */}
      <AbhaScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onSelectAbha={(abhaId) => {
          const match = fieldPatients.find(p => p.abha_id === abhaId) || fieldPatients[0];
          handleOpenPatientAbha(match);
        }}
      />

      {/* ALL INTERACTIVE FIELD MODALS */}
      <AbhaRegistrationModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onRegisterSuccess={(newRecord) => {
          setFieldPatients([newRecord, ...fieldPatients]);
        }}
        showToast={showToast}
      />

      <PatientDetailModal
        isOpen={showPatientDetailModal}
        onClose={() => setShowPatientDetailModal(false)}
        patientData={selectedPatientData}
        onRefresh={() => {}}
      />

    </div>
  );
};

export default VillageRegistryPage;
