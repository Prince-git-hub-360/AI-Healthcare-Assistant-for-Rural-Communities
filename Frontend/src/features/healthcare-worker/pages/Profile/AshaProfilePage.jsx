import React, { useState } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { 
  ShieldIcon, PhoneIcon, CheckIcon, QrCodeIcon, 
  HospitalIcon, SparklesIcon, DocumentIcon,
  ClockIcon, UserIcon, HeartIcon, ActivityIcon 
} from '../../../../shared/icons/Icons';
import { GovtHeaderBanner } from '../../../../components/layout/GovtHeaderBanner';

export const AshaProfilePage = ({ setCurrentView }) => {
  const { user, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('accreditation'); // 'accreditation', 'assignments', 'achievements'

  const ashaDetails = {
    name: 'Sister Sunita Bai',
    nameRegional: 'ಸುನೀತಾ ಬಾಯಿ (सुनीता बाई)',
    roleTitle: 'Accredited Social Health Activist (ASHA) Sister',
    registrationId: 'ASHA-KA-8821',
    assignedPhc: 'Mandya Primary Health Centre #2',
    catchmentVillage: 'Gejjalagere, Mandya District',
    blockTaluk: 'Maddur Taluk',
    district: 'Mandya (Karnataka)',
    phone: '+91 98765 00111',
    experienceYears: '7+ Years of Dedicated Field Service',
    languages: 'Kannada (Native), Hindi (Fluent), English (Working)',
    stats: {
      householdsCovered: '1,248',
      immunizationRate: '98.4%',
      doorstepVisits: '480',
      ancMothersTracked: '42',
      highRiskRecoveries: '28',
    },
    certifications: [
      'MoHFW Certified Maternal & Child Health (RCH) Counselor',
      'National Health Mission (NHM) NCD Screening Specialist',
      'Nikshay TB Direct Observation Treatment (DOTS) Facilitator',
      'Ayushman Bharat ABDM Field Enumerator Badge'
    ]
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 🇮🇳 OFFICIAL GOVERNMENT ACCREDITATION BADGE CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        <div className="p-6 md:p-8 bg-gradient-to-r from-[#072448] via-[#0B3B74] to-[#0D4B8F] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black bg-white/20 border border-white/30 text-white uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                🏛️ MoHFW • National Health Mission
              </span>
              <span className="bg-[#FF9933] text-stone-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Accredited Frontline Cadre
              </span>
              <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                ✓ Active Licensure
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Swasthya Sanchar Frontline Health Accreditation
            </h1>
            <p className="text-xs text-blue-100/90 font-medium max-w-2xl">
              Official Government Portal for Frontline ASHA Sister Profile, Catchment Area Accreditation, and Verified Service Badges.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-3 rounded-2xl">
            <div className="text-right">
              <div className="text-xs font-black text-white">{ashaDetails.name}</div>
              <div className="text-[10px] text-sky-200 font-mono">ID: {ashaDetails.registrationId}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center font-black text-white text-sm">
              SB
            </div>
          </div>
        </div>

        {/* PROFILE TAB SWITCHER */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center gap-3 overflow-x-auto">
          {[
            { id: 'accreditation', label: '🪪 Official ID & Accreditation Card' },
            { id: 'assignments', label: '📍 Catchment & PHC Assignments' },
            { id: 'achievements', label: '🏆 Service Milestones & Certifications' },
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
      {/* TAB 1: OFFICIAL ASHA IDENTITY & ACCREDITATION CARD           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'accreditation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* DIGITAL ASHA IDENTITY CARD (Official Badge Mockup Structure) */}
          <div className="lg:col-span-2 bg-gradient-to-b from-teal-900 via-[#0B4F42] to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-600/40 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-700/60 pb-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏛️</span>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-teal-300">
                    Government of Karnataka • Health &amp; Family Welfare
                  </div>
                  <h2 className="text-lg font-black text-white">
                    Official ASHA Identity &amp; Accreditation Card
                  </h2>
                </div>
              </div>
              <span className="bg-[#FF9933] text-stone-950 text-[10px] font-black px-3 py-1 rounded-full uppercase self-start sm:self-auto">
                Accredited 2026
              </span>
            </div>

            {/* Profile Row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
                  alt="Sister Sunita Bai"
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white/90 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-md">
                  <CheckIcon size={14} />
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {ashaDetails.name}
                  </h3>
                  <div className="text-xs font-bold text-teal-200">
                    {ashaDetails.nameRegional}
                  </div>
                  <div className="text-xs font-black text-amber-300 uppercase tracking-wide mt-1">
                    {ashaDetails.roleTitle}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <div className="text-[10px] text-teal-200 font-bold uppercase">Registration ID</div>
                    <div className="font-mono font-black text-white">{ashaDetails.registrationId}</div>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <div className="text-[10px] text-teal-200 font-bold uppercase">Assigned PHC</div>
                    <div className="font-black text-white truncate">{ashaDetails.assignedPhc}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-teal-500/30 text-center">
                <div className="text-xl font-black text-teal-300">{ashaDetails.stats.householdsCovered}</div>
                <div className="text-[10px] font-bold text-slate-300">Households (घर)</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-teal-500/30 text-center">
                <div className="text-xl font-black text-emerald-400">{ashaDetails.stats.immunizationRate}</div>
                <div className="text-[10px] font-bold text-slate-300">Immunization Rate</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-teal-500/30 text-center">
                <div className="text-xl font-black text-amber-300">{ashaDetails.stats.doorstepVisits}</div>
                <div className="text-[10px] font-bold text-slate-300">Doorstep Visits</div>
              </div>
            </div>

            {/* Official Digital Signature & Verification Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-teal-700/60 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">
                  Official Verification Signature
                </div>
                <div className="font-serif italic text-base text-amber-200">
                  Dr. Vikram Sharma, Medical Officer
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  Digitally Authenticated: PHC Mandya #2 • ABDM Node 88192
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl text-slate-900 shadow-md">
                <QrCodeIcon size={36} className="text-slate-900" />
                <div className="text-[10px] font-bold leading-tight">
                  <div>Scan for</div>
                  <div className="text-emerald-700 font-black">ABDM Verification</div>
                </div>
              </div>
            </div>

          </div>

          {/* SIDEBAR: CONTACT & ACCREDITATION INFO */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📋 Official Credentials</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">Village Catchment Area</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{ashaDetails.catchmentVillage}</div>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">Block / Taluka &amp; District</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{ashaDetails.blockTaluk}, {ashaDetails.district}</div>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">Vernacular Language Proficiency</div>
                  <div className="font-bold text-[#0B3B74] dark:text-sky-400">{ashaDetails.languages}</div>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">Official Field Contact</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{ashaDetails.phone}</div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-3xl p-6 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                <span>🛡️ ABDM Interoperability Badge</span>
              </div>
              <p className="text-[11px] text-emerald-900 dark:text-emerald-200 font-medium">
                Accredited to create ABHA cards, record longitudinal vitals, and synchronize doorstep medicine delivery with Dr. Vikram Sharma at Mandya PHC #2.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: CATCHMENT & PHC ASSIGNMENTS                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'assignments' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>📍 Active Catchment Sectors &amp; Assigned Doctors</span>
            </h3>
            <p className="text-xs text-slate-500">
              Administrative jurisdiction under Mandya District Health Mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/70 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-wider bg-teal-100 text-[#0B4F42] px-2 py-0.5 rounded-md inline-block">
                Assigned Sector 1
              </div>
              <div className="font-black text-sm text-slate-900 dark:text-white">North Colony &amp; School Zone</div>
              <div className="text-xs text-slate-500">420 Households • 12 ANC Mothers</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/70 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md inline-block">
                Assigned Sector 2
              </div>
              <div className="font-black text-sm text-slate-900 dark:text-white">Main Market &amp; Gram Panchayat</div>
              <div className="text-xs text-slate-500">480 Households • 14 High-Risk NCD</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/70 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md inline-block">
                Assigned Sector 3
              </div>
              <div className="font-black text-sm text-slate-900 dark:text-white">Farmland &amp; Canal Belt</div>
              <div className="text-xs text-slate-500">348 Households • 9 Child Immunizations</div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: ACHIEVEMENTS & CERTIFICATIONS                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'achievements' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🏆 National Health Mission Certifications</span>
            </h3>
            <p className="text-xs text-slate-500">
              Accredited field competencies verified by Mandya District Health Authority
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ashaDetails.certifications.map((cert, idx) => (
              <div 
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                  ✓
                </div>
                <div>
                  <div className="font-black text-xs text-slate-900 dark:text-white">{cert}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Authorized by Ministry of Health &amp; Family Welfare</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AshaProfilePage;
