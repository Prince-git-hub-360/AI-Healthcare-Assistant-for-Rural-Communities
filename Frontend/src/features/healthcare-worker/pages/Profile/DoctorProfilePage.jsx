import React, { useState } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { 
  ShieldIcon, PhoneIcon, CheckIcon, QrCodeIcon, 
  HospitalIcon, SparklesIcon, DocumentIcon,
  ClockIcon, UserIcon, HeartIcon, ActivityIcon 
} from '../../../../shared/icons/Icons';
import { GovtHeaderBanner } from '../../../../components/layout/GovtHeaderBanner';

export const DoctorProfilePage = ({ setCurrentView }) => {
  const { user, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('licensure'); // 'licensure', 'asha_supervision', 'clinical_stats'

  const doctorDetails = {
    name: 'Dr. Vikram Sharma',
    degree: 'MBBS, MD (General Medicine)',
    roleTitle: 'PHC Medical Officer & ABDM Clinical Lead',
    registrationNumber: 'KMC-58291-KA',
    medicalCouncil: 'Karnataka Medical Council / National Medical Commission (NMC)',
    validityDate: '31 Dec 2028',
    assignedPhc: 'Mandya #2 Primary Health Centre',
    district: 'Mandya District (Karnataka)',
    experienceYears: '12+ Years Clinical Practice',
    phone: '+91 98765 00999',
    stats: {
      opdConsultations: '14,200',
      teleConsultations: '820',
      complianceRate: '96.2%',
      prescriptionsIssued: '12,850',
      janAushadhiSavings: '₹18.4 Lakhs Saved',
    },
    assignedAshaWorkers: [
      { name: 'Sister Sunita Bai', id: 'ASHA-KA-8821', sector: 'Sector 1 & 2 (Gejjalagere)', activeCases: 24 },
      { name: 'Sister Kavitha M.', id: 'ASHA-KA-8822', sector: 'Sector 3 (Farmland Belt)', activeCases: 18 },
      { name: 'Sister Meenakshi G.', id: 'ASHA-KA-8823', sector: 'Sector 4 (School Zone)', activeCases: 15 },
    ]
  };

  return (
    <div className="space-y-6 text-stone-900 dark:text-slate-100 font-sans pb-16">
      
      {/* 🏛️ 3 OFFICIAL GOVERNMENT LOGOS HEADER BANNER */}
      <GovtHeaderBanner 
        subtitle="National Medical Commission (NMC) Medical Licensure | राष्ट्रीय चिकित्सा आयोग"
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

      {/* 🇮🇳 OFFICIAL GOVERNMENT TOP BANNER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        <div className="p-6 md:p-8 bg-gradient-to-r from-[#072448] via-[#0B3B74] to-[#0D4B8F] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black bg-white/20 border border-white/30 text-white uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                🏛️ Ministry of Health &amp; Family Welfare (MoHFW)
              </span>
              <span className="bg-[#FF9933] text-stone-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                National Medical Commission (NMC)
              </span>
              <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                ✓ Active Medical Practitioner
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Swasthya Sanchar Medical Officer Credential
            </h1>
            <p className="text-xs text-blue-100/90 font-medium max-w-2xl">
              Official Indian Government portal for PHC Medical Officer profile, National Medical Council registration, and ABDM clinical authorization.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-3 rounded-2xl">
            <div className="text-right">
              <div className="text-xs font-black text-white">{doctorDetails.name}</div>
              <div className="text-[10px] text-sky-200 font-mono">Reg: {doctorDetails.registrationNumber}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center font-black text-white text-sm">
              VS
            </div>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center gap-3 overflow-x-auto">
          {[
            { id: 'licensure', label: '📜 NMC Medical Licensure Card' },
            { id: 'asha_supervision', label: '👩‍⚕️ ASHA Cadre Supervision' },
            { id: 'clinical_stats', label: '📊 Clinical Performance & Jan Aushadhi' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0B3B74] text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: NMC REGISTRATION CARD                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'licensure' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* DIGITAL NMC IDENTITY CARD (Mockup Structure) */}
          <div className="lg:col-span-2 bg-gradient-to-b from-[#0A2E5C] via-[#0B3B74] to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400/40 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-600/60 pb-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏛️</span>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                    National Medical Commission (NMC) • Government of India
                  </div>
                  <h2 className="text-lg font-black text-white">
                    Medical Practitioner Official Registration Card
                  </h2>
                </div>
              </div>
              <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase self-start sm:self-auto">
                Verified Medical Officer
              </span>
            </div>

            {/* Profile Row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80"
                  alt="Dr. Vikram Sharma"
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white/90 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-md">
                  <CheckIcon size={14} />
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {doctorDetails.name}
                  </h3>
                  <div className="text-xs font-bold text-sky-200">
                    {doctorDetails.degree}
                  </div>
                  <div className="text-xs font-black text-amber-300 uppercase tracking-wide mt-1">
                    {doctorDetails.roleTitle}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <div className="text-[10px] text-sky-200 font-bold uppercase">Registration Number</div>
                    <div className="font-mono font-black text-white">{doctorDetails.registrationNumber}</div>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <div className="text-[10px] text-sky-200 font-bold uppercase">Assigned Facility</div>
                    <div className="font-black text-white truncate">{doctorDetails.assignedPhc}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-blue-500/30 text-center">
                <div className="text-xl font-black text-sky-300">{doctorDetails.stats.opdConsultations}</div>
                <div className="text-[10px] font-bold text-slate-300">OPD Consultations</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-blue-500/30 text-center">
                <div className="text-xl font-black text-emerald-400">{doctorDetails.stats.teleConsultations}</div>
                <div className="text-[10px] font-bold text-slate-300">Tele-Consultations</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-blue-500/30 text-center">
                <div className="text-xl font-black text-amber-300">{doctorDetails.stats.complianceRate}</div>
                <div className="text-[10px] font-bold text-slate-300">Treatment Compliance</div>
              </div>
            </div>

            {/* Official Seal & Verification */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-blue-600/60 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">
                  Digital Medical Officer Seal
                </div>
                <div className="font-mono text-sm text-amber-200 font-black">
                  [ SEAL: MANDYA-PHC-2 / DR-SHARMA-58291 ]
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  State Council: {doctorDetails.medicalCouncil}
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl text-slate-900 shadow-md">
                <QrCodeIcon size={36} className="text-slate-900" />
                <div className="text-[10px] font-bold leading-tight">
                  <div>NMC Verified</div>
                  <div className="text-blue-900 font-black">Scan to Authenticate</div>
                </div>
              </div>
            </div>

          </div>

          {/* SIDEBAR: PHC DETAILS */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>🏥 Clinical Jurisdiction</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">Assigned Facility</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{doctorDetails.assignedPhc}</div>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">District &amp; State</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{doctorDetails.district}</div>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">Specialization</div>
                  <div className="font-bold text-[#0B3B74] dark:text-sky-400">General Medicine &amp; Rural Health</div>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">Official Contact</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{doctorDetails.phone}</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-3xl p-6 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#0B3B74] dark:text-sky-300 font-black text-xs">
                <span>🛡️ ABDM Doctor Digital Stamp</span>
              </div>
              <p className="text-[11px] text-blue-900 dark:text-blue-200 font-medium">
                Authorized under Ayushman Bharat Digital Mission to issue signed electronic prescriptions and assign home visits to ASHA workers.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: ASHA CADRE SUPERVISION                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'asha_supervision' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>👩‍⚕️ Supervised Frontline ASHA Workers (Mandya Catchment #2)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Direct digital task coordination and prescription delivery dispatch
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doctorDetails.assignedAshaWorkers.map((asha, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800/70 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">{asha.id}</span>
                  <span className="text-[10px] font-black bg-teal-100 text-[#0B4F42] px-2 py-0.5 rounded-full">
                    {asha.activeCases} Active Cases
                  </span>
                </div>
                <div className="font-black text-sm text-slate-900 dark:text-white">{asha.name}</div>
                <div className="text-xs text-slate-500">{asha.sector}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: CLINICAL PERFORMANCE & JAN AUSHADHI                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'clinical_stats' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>💊 Pradhan Mantri Jan Aushadhi Generic Savings</span>
            </h3>
            <p className="text-xs text-slate-500">
              Financial savings generated for rural families through generic medicine prescribing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 space-y-1">
              <div className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">Total Patient Savings</div>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{doctorDetails.stats.janAushadhiSavings}</div>
              <div className="text-xs text-emerald-600">85% Lower Cost vs Branded</div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-1">
              <div className="text-[10px] font-black uppercase text-[#0B3B74] dark:text-sky-300">Prescriptions Issued</div>
              <div className="text-2xl font-black text-[#0B3B74] dark:text-sky-300">{doctorDetails.stats.prescriptionsIssued}</div>
              <div className="text-xs text-blue-600">100% Digitally Signed</div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/40 p-5 rounded-2xl border border-purple-200 dark:border-purple-900/60 space-y-1">
              <div className="text-[10px] font-black uppercase text-purple-800 dark:text-purple-300">Treatment Compliance</div>
              <div className="text-2xl font-black text-purple-700 dark:text-purple-300">{doctorDetails.stats.complianceRate}</div>
              <div className="text-xs text-purple-600">Verified via 5-Day Pillbox</div>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default DoctorProfilePage;
