import React, { useState } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { 
  HospitalIcon, PlusIcon, SearchIcon, CheckIcon, AlertIcon, 
  SpeakerIcon, ShieldIcon, ClockIcon, DocumentIcon, PhoneIcon,
  SparklesIcon, UserIcon, HeartIcon, ActivityIcon, ArrowRightIcon,
  QrCodeIcon
} from '../../../../shared/icons/Icons';
import { ROUTES } from '../../../../utils/routes';
import { AbhaRegistrationModal } from '../../components/AbhaRegistrationModal';
import { RecordVitalsModal } from '../../components/RecordVitalsModal';
import { CreateReferralModal } from '../../components/CreateReferralModal';
import { VisitRouteMapModal } from '../../components/VisitRouteMapModal';
import { DoctorTeleChatModal } from '../../components/DoctorTeleChatModal';
import { UploadDocumentModal } from '../../components/UploadDocumentModal';
import { PatientDetailModal } from '../../components/PatientDetailModal';

export const AshaDashboardPage = ({ setCurrentView }) => {
  const { user, showToast } = useAuth();
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [selectedPatientData, setSelectedPatientData] = useState(null);
  const [showPatientDetailModal, setShowPatientDetailModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showRecordVitalsModal, setShowRecordVitalsModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showRouteMapModal, setShowRouteMapModal] = useState(false);
  const [showDoctorChatModal, setShowDoctorChatModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);

  // Priority Patients matching the exact image
  const priorityPatients = [
    {
      id: 1,
      name: 'Lakshmi Devi',
      ageGender: '54 / F',
      village: 'Gejjalagere',
      reason: 'BP Follow-up Overdue by 2 days',
      priority: 'HIGH',
      priorityColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      avatar: '/images/savithri_devi.jpg',
      abhaId: '12-3456-7890-1122',
      phone: '+91 98765 00222',
      vitals: { bp: '168/104', sugar: '130 mg/dL', pulse: '78 bpm' }
    },
    {
      id: 2,
      name: 'Ravi Kumar',
      ageGender: '60 / M',
      village: 'Gejjalagere',
      reason: 'Medication Follow-up',
      priority: 'MEDIUM',
      priorityColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      avatar: '/images/manjunath_gowda.jpg',
      abhaId: '12-3456-7890-3344',
      phone: '+91 91743 44321',
      vitals: { bp: '134/86', sugar: '165 mg/dL', pulse: '72 bpm' }
    },
    {
      id: 3,
      name: 'Meena Devi',
      ageGender: '28 / F',
      village: 'Gejjalagere',
      reason: 'ANC Follow-up Due Tomorrow',
      priority: 'HIGH',
      priorityColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      avatar: '/images/vijay_lakshmi.jpg',
      abhaId: '12-3456-7890-2233',
      phone: '+91 97172 18344',
      vitals: { bp: '118/76', hb: '9.4 g/dL', weight: '58 kg' }
    }
  ];

  // Recent Activity matching the image (Expanded for complete daily log)
  const recentActivities = [
    { time: '10:30 AM', icon: '✔️', title: 'Home Visit Completed', desc: 'Lakshmi Devi - BP Follow-up & Diet Counseling', village: 'Gejjalagere' },
    { time: '09:45 AM', icon: '💊', title: 'Medication Handover', desc: 'Ravi Kumar - Jan Aushadhi Metformin 500mg', village: 'Gejjalagere' },
    { time: '09:15 AM', icon: '👤', title: 'PHC Referral Created', desc: 'Meena Devi - 32-Week ANC Ultrasound Checkup', village: 'Gejjalagere' },
    { time: '08:45 AM', icon: '📄', title: 'Lab Report Uploaded', desc: 'Sunil Kumar - Fasting Blood Sugar 118 mg/dL', village: 'Gejjalagere' },
    { time: '08:15 AM', icon: '💉', title: 'Immunization Reminder', desc: 'Kamala Bai - DPT Booster Due Today', village: 'Gejjalagere' },
    { time: '07:45 AM', icon: '🎒', title: 'Field Medical Kit Prepared', desc: 'Cold-chain carrier & BP apparatus calibrated', village: 'Gejjalagere' },
  ];

  // Today's Visit Plan timeline (Expanded 6-stop route)
  const visitPlan = [
    { step: 'Start', title: 'Sister Sunita Bai (ASHA Home)', subtitle: 'Doorstep Kit Ready', time: '08:30 AM', color: 'bg-emerald-500' },
    { step: '1', title: 'Lakshmi Devi (House #14)', subtitle: 'Stage-2 BP Follow-up', time: '09:00 AM', color: 'bg-[#0B3B74]' },
    { step: '2', title: 'Ravi Kumar (House #42)', subtitle: 'Metformin Refill & Adherence', time: '10:00 AM', color: 'bg-[#0B3B74]' },
    { step: '3', title: 'Meena Devi (House #88)', subtitle: 'ANC Checkup & IFA Tablets', time: '11:00 AM', color: 'bg-[#0B3B74]' },
    { step: '4', title: 'Kamala Bai (House #102)', subtitle: 'Child UIP Immunization', time: '12:00 PM', color: 'bg-[#0B3B74]' },
    { step: '📍', title: 'Mandya PHC #2', subtitle: 'Return & Report to Dr. Vikram', time: '01:00 PM', color: 'bg-slate-700' },
  ];

  const handleOpenPatient = (p) => {
    setSelectedPatientData({
      patient_id: p.id,
      full_name: p.name,
      abha_id: p.abhaId,
      phone_number: p.phone,
      village: p.village,
      age: parseInt(p.ageGender) || 45,
      gender: p.ageGender.includes('F') ? 'Female' : 'Male',
      blood_group: 'B +ve',
      chronic_conditions: p.reason,
      adherence_rate: '92%',
      triage_badge: p.priority === 'HIGH' ? 'high_risk' : 'stable',
      ai_summary: {
        overview: `${p.name}, ${p.ageGender} from ${p.village}. Status: ${p.reason}`,
        adherence_rate: '92%',
        red_flags: [p.reason],
        recent_vitals: p.vitals,
      }
    });
    setShowPatientDetailModal(true);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* GREETING BANNER */}
      <div className="space-y-0.5">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>नमस्कार, Sunita Bai</span>
          <span>👋</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Here is your field work overview for today.
        </p>
      </div>

      {/* 5 TOP METRIC STATS CARDS (EXACT HORIZONTAL GRID) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* 1. Visits Due Today */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0B3B74] dark:text-sky-300 flex items-center justify-center text-xl shrink-0">
            🏠
          </div>
          <div className="leading-tight">
            <div className="text-2xl font-black text-slate-900 dark:text-white">12</div>
            <div className="text-[11px] font-bold text-slate-500">Visits Due Today</div>
          </div>
        </div>

        {/* 2. High Priority Patients */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-xl shrink-0">
            ⚠️
          </div>
          <div className="leading-tight">
            <div className="text-2xl font-black text-rose-600">3</div>
            <div className="text-[11px] font-bold text-slate-500">High Priority Patients</div>
          </div>
        </div>

        {/* 3. ANC / PNC Follow-ups */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center text-xl shrink-0">
            🤰
          </div>
          <div className="leading-tight">
            <div className="text-2xl font-black text-purple-700 dark:text-purple-300">2</div>
            <div className="text-[11px] font-bold text-slate-500">ANC / PNC Follow-ups</div>
          </div>
        </div>

        {/* 4. Immunizations Due */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-xl shrink-0">
            💉
          </div>
          <div className="leading-tight">
            <div className="text-2xl font-black text-amber-600">5</div>
            <div className="text-[11px] font-bold text-slate-500">Immunizations Due</div>
          </div>
        </div>

        {/* 5. Medication Follow-ups */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all col-span-2 sm:col-span-1">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            💊
          </div>
          <div className="leading-tight">
            <div className="text-2xl font-black text-emerald-600">4</div>
            <div className="text-[11px] font-bold text-slate-500">Medication Follow-ups</div>
          </div>
        </div>

      </div>

      {/* TWO-COLUMN GRID BELOW STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (7 COLS): PRIORITY PATIENTS, ACTIVITIES, PLAN */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CARD 1: आज के प्राथमिक मरीज़ (Today's Priority Patients) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                आज के प्राथमिक मरीज़ <span className="text-slate-400 font-bold">(Today's Priority Patients)</span>
              </h2>
              <button 
                onClick={() => {
                  window.history.pushState({}, '', ROUTES.APP.ASHA.PATIENTS);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="text-xs font-bold text-[#0B3B74] dark:text-sky-400 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2.5 px-4">Patient Name</th>
                    <th className="py-2.5 px-3">Age/Sex</th>
                    <th className="py-2.5 px-3">Village</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3 text-center">Priority</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                  {priorityPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={p.avatar} 
                            alt={p.name} 
                            style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
                            className="rounded-full object-cover border border-slate-200 shrink-0" 
                          />
                          <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.ageGender}</td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{p.village}</td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium min-w-[180px]">{p.reason}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${p.priorityColor}`}>
                          {p.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenPatient(p)}
                          className="bg-[#0B3B74] hover:bg-[#072448] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer whitespace-nowrap"
                        >
                          View Patient
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-[11px] text-slate-500 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
              <span>ℹ️</span>
              <span>कृपया समय पर फॉलो-अप करें और मरीजों की स्थिति अपडेट रखें।</span>
            </div>
          </div>

          {/* CARD 2: RECENT ACTIVITY & TODAY'S VISIT PLAN (PHYSICALLY TALL & BIG BOXES TO FILL SPACE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            
            {/* 2A. Recent Activity (हाल की गतिविधि) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[380px]">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  हाल की गतिविधि <span className="text-slate-400 font-bold">(Recent Activity)</span>
                </h3>
                <button 
                  onClick={() => {
                    if (showToast) showToast('📋 Full field activity log is synchronized with Mandya PHC', 'info');
                  }}
                  className="text-xs font-bold text-[#0B3B74] dark:text-sky-400 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-around py-3 space-y-3">
                {recentActivities.slice(0, 4).map((act, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 text-xs p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold text-slate-400 shrink-0 mt-0.5">{act.time}</span>
                      <div className="leading-tight">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                          <span>{act.icon}</span>
                          <span>{act.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-1">{act.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 border border-slate-200/60 dark:border-slate-700">
                      {act.village}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>🔄 Real-time Doorstep Activity</span>
                <span className="text-emerald-600 font-bold">● Active Sync</span>
              </div>
            </div>

            {/* 2B. Today's Visit Plan (आज का दौरा कार्यक्रम) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    आज का दौरा कार्यक्रम <span className="text-slate-400 font-bold">(Today's Visit Plan)</span>
                  </h3>
                  <button 
                    onClick={() => setShowRouteMapModal(true)}
                    className="text-xs font-bold text-[#0B3B74] dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    View Map
                  </button>
                </div>

                <div className="py-3 space-y-3.5">
                  {visitPlan.slice(0, 5).map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full ${step.color} text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-2xs`}>
                          {step.step}
                        </span>
                        <div className="leading-tight">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">{step.title}</span>
                          {step.subtitle && <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{step.subtitle}</span>}
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-500 font-bold">{step.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRouteMapModal(true)}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0B3B74] dark:text-sky-300 text-xs font-black py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs mt-2"
              >
                <span>🗺️</span>
                <span>Open Route Map</span>
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (5 COLS): QUICK ACTIONS, VILLAGE SUMMARY, PHC */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* CARD 1: त्वरित कार्य (Quick Actions) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              त्वरित कार्य <span className="text-slate-400 font-bold">(Quick Actions)</span>
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddPatientModal(true)}
                className="bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="text-xl text-[#0B3B74]">➕</span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Add Patient</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.history.pushState({}, '', ROUTES.APP.ASHA.FOLLOW_UPS);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="text-xl text-emerald-600">🏠</span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Start Home Visit</span>
              </button>

              <button
                type="button"
                onClick={() => setShowScannerModal(true)}
                className="bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700 hover:border-purple-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="text-xl text-purple-600">📈</span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Record Vitals</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (showToast) showToast('📤 Uploading document to ABDM Health Vault', 'info');
                }}
                className="bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="text-xl text-[#0B3B74]">📤</span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Upload Document</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (showToast) showToast('👥 Creating Referral to Mandya PHC', 'info');
                }}
                className="bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="text-xl text-[#0B3B74]">👥</span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Create Referral</span>
              </button>

              <a
                href="tel:108"
                className="bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="text-xl text-rose-600">📞</span>
                <span className="text-[11px] font-black text-rose-700 dark:text-rose-300">Emergency 108</span>
              </a>
            </div>
          </div>

          {/* CARD 2: मेरा क्षेत्र स्वास्थ्य सारांश (Village Health Summary) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-black text-slate-900 dark:text-white">
                मेरा क्षेत्र स्वास्थ्य सारांश <span className="text-slate-400 font-bold">(Village Health Summary)</span>
              </h3>
              <span className="text-[10px] font-bold text-[#0B3B74] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                Gejjalagere
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                <div className="text-base text-blue-600">👥</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">428</div>
                <div className="text-[9px] font-bold text-slate-500 leading-tight">कुल पंजीकृत मरीज़<br/>(Total Registered)</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                <div className="text-base text-amber-500">⚠️</div>
                <div className="text-lg font-black text-amber-600">24</div>
                <div className="text-[9px] font-bold text-slate-500 leading-tight">उच्च जोखिम मरीज़<br/>(High Risk)</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                <div className="text-base text-purple-600">🤰</div>
                <div className="text-lg font-black text-purple-700 dark:text-purple-300">8</div>
                <div className="text-[9px] font-bold text-slate-500 leading-tight">गर्भवती महिलाएं<br/>(ANC/PNC)</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                <div className="text-base text-emerald-600">👶</div>
                <div className="text-lg font-black text-emerald-600">19</div>
                <div className="text-[9px] font-bold text-slate-500 leading-tight">बच्चे (0-5 वर्ष)<br/>(Children 0-5 yrs)</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                <div className="text-base text-purple-600">💉</div>
                <div className="text-lg font-black text-purple-600">9</div>
                <div className="text-[9px] font-bold text-slate-500 leading-tight">टीकाकरण लंबित<br/>(Immunization Due)</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                <div className="text-base text-blue-700">👵</div>
                <div className="text-lg font-black text-blue-700 dark:text-sky-300">14</div>
                <div className="text-[9px] font-bold text-slate-500 leading-tight">वरिष्ठ नागरिक (60+)<br/>(Elderly 60+)</div>
              </div>
            </div>
          </div>

          {/* CARD 3: PHC समन्वय (PHC Coordination) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-black text-slate-900 dark:text-white">
                PHC समन्वय <span className="text-slate-400 font-bold">(PHC Coordination)</span>
              </h3>
              <span className="text-[10px] font-bold text-[#0B3B74] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                Mandya PHC #2
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="leading-tight">
                  <div className="text-xl font-black text-amber-600">3</div>
                  <div className="text-[10px] font-bold text-slate-500">लंबित रेफरल<br/>(Pending Referrals)</div>
                </div>

                <div className="leading-tight">
                  <div className="text-xl font-black text-blue-600">2</div>
                  <div className="text-[10px] font-bold text-slate-500">डॉक्टर समीक्षा लंबित<br/>(Doctor Reviews)</div>
                </div>
              </div>

              <div className="text-right space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500">MO: Dr. Vikram Sharma</div>
                <a
                  href="tel:+919876500999"
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1 shadow-xs"
                >
                  <PhoneIcon size={12} />
                  <span>Contact PHC</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold">
              <button 
                onClick={() => {
                  window.history.pushState({}, '', ROUTES.APP.ASHA.FOLLOW_UPS);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="text-[#0B3B74] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Referrals</span>
                <span>➔</span>
              </button>
              <button 
                onClick={() => setShowDoctorChatModal(true)}
                className="text-[#0B3B74] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Send Message</span>
                <span>➔</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ALL INTERACTIVE FIELD MODALS */}
      <AbhaRegistrationModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onRegisterSuccess={(newCitizen) => {
          if (showToast) showToast(`✅ Registered ${newCitizen.full_name} under ABDM!`, 'success');
        }}
        showToast={showToast}
      />

      <RecordVitalsModal
        isOpen={showRecordVitalsModal}
        onClose={() => setShowRecordVitalsModal(false)}
        showToast={showToast}
      />

      <CreateReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        showToast={showToast}
      />

      <VisitRouteMapModal
        isOpen={showRouteMapModal}
        onClose={() => setShowRouteMapModal(false)}
        showToast={showToast}
      />

      <DoctorTeleChatModal
        isOpen={showDoctorChatModal}
        onClose={() => setShowDoctorChatModal(false)}
        showToast={showToast}
      />

      <UploadDocumentModal
        isOpen={showUploadDocModal}
        onClose={() => setShowUploadDocModal(false)}
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

export default AshaDashboardPage;
