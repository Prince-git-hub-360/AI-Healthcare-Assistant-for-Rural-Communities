import React, { useState } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { 
  HospitalIcon, PhoneIcon, MicIcon, SparklesIcon, 
  ClockIcon, DocumentIcon 
} from '../../../../shared/icons/Icons';
import { DoctorTeleChatModal } from '../../components/DoctorTeleChatModal';

export const AshaCoordinationPage = () => {
  const { showToast } = useAuth();
  const [showChatModal, setShowChatModal] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0B3B74] dark:text-sky-400 tracking-wider">
            <HospitalIcon size={16} />
            <span>Primary Health Center • Frontline Tele-Coordination</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            PHC समन्वय (Mandya PHC #2 Coordination Hub)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Direct Line to Medical Officer Dr. Vikram Sharma, Supply Requisitions &amp; Clinical Reviews
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:+918232224411"
            className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-2"
          >
            <PhoneIcon size={14} />
            <span>Call PHC Desk</span>
          </a>

          <button
            onClick={() => setShowChatModal(true)}
            className="px-5 py-2.5 bg-[#0B3B74] hover:bg-[#0B3B74]/90 text-white text-xs font-black rounded-2xl flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>💬</span>
            <span>Open Tele-Chat with MO</span>
          </button>
        </div>
      </div>

      {/* Main Grid: MO Profile Card & Supply Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Medical Officer & Active Communications */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Medical Officer Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <img
                src="/images/doctor_sharma.jpg"
                alt="Dr. Vikram Sharma"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Dr. Vikram Sharma
                  </h3>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    ON DUTY (OPD ROOM 3)
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  Medical Officer (MBBS, DCH) • Mandya PHC #2
                </div>
                <div className="text-[11px] text-[#0B3B74] dark:text-sky-300 font-mono mt-0.5">
                  KMC Reg: #68412 • In-Charge: Gejjalagere Sub-Center
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                <div className="text-lg font-black text-[#0B3B74] dark:text-sky-300">3</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Referrals Pending</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                <div className="text-lg font-black text-emerald-600">2</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Rx Reviewed</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                <div className="text-lg font-black text-amber-600">10:45 AM</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Last Contact</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900 text-xs space-y-1.5">
              <div className="font-extrabold text-[#0B3B74] dark:text-sky-300">
                📢 Latest Notice from Dr. Vikram Sharma:
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                "Special NCD screening drive on Thursday at Gejjalagere Gram Panchayat. Please prioritize checking BP for all citizens above 45 years and update their ABHA cards."
              </p>
            </div>
          </div>

          {/* Clinical Discussion Stream */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Case Tele-Notes
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">Meena Devi (ANC 32w)</span>
                  <span className="text-[10px] text-slate-400">10:15 AM</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Doctor: "Approved her ultrasound referral. Advised daily IFA tablet and bed rest."
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">Lakshmi Devi (BP 150/95)</span>
                  <span className="text-[10px] text-slate-400">Yesterday</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Doctor: "Titrated Amlodipine to 5mg OD. Recheck BP in 3 days during home visit."
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Weekly PHC Schedule & Field Kit Stock */}
        <div className="space-y-6">
          
          {/* PHC Duty & Meeting Schedule */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Weekly PHC Schedule
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between font-medium">
                <span>📅 Wednesday (Tomorrow)</span>
                <span className="font-bold text-[#0B3B74] dark:text-sky-300">VHND Immunization</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between font-medium">
                <span>📅 Thursday</span>
                <span className="font-bold text-amber-600">NCD Screening Camp</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between font-medium">
                <span>📅 Saturday</span>
                <span className="font-bold text-emerald-600">Weekly ASHA Review</span>
              </div>
            </div>
          </div>

          {/* Sub-Center Medicine Kit Supply */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Field Medicine Kit Stock
              </h3>
              <button 
                onClick={() => showToast('📦 Supply requisition submitted to Mandya PHC pharmacist!', 'success')}
                className="text-[11px] font-bold text-[#0B3B74] dark:text-sky-400 hover:underline cursor-pointer"
              >
                + Request Stock
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span>🔴 IFA Red Tablets (Pregnancy)</span>
                <span className="font-black text-emerald-600">48 Strips (OK)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span>🟡 Metformin 500mg (Jan Aushadhi)</span>
                <span className="font-black text-amber-600">12 Strips (Low)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span>🟢 ORS Sachets &amp; Zinc</span>
                <span className="font-black text-emerald-600">60 Packs (OK)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span>🔵 Paracetamol 500mg</span>
                <span className="font-black text-emerald-600">30 Strips (OK)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {showChatModal && (
        <DoctorTeleChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
        />
      )}

    </div>
  );
};

export default AshaCoordinationPage;
