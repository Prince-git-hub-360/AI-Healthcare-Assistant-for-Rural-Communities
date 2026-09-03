import React, { useState } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { 
  HospitalIcon, UserIcon, PhoneIcon, CheckIcon, 
  SparklesIcon, PlusIcon, DocumentIcon 
} from '../../../../shared/icons/Icons';
import { CreateReferralModal } from '../../components/CreateReferralModal';

export const AshaReferralsPage = () => {
  const { showToast } = useAuth();
  const [filter, setFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [referrals, setReferrals] = useState([
    {
      id: 'REF-2026-081',
      patient_name: 'Meena Devi',
      age_gender: '28 / F',
      village: 'Gejjalagere',
      referred_to: 'Dr. Vikram Sharma, MBBS',
      facility: 'Mandya PHC #2',
      reason: '32-Week Gestational High BP (142/94) & Routine ANC Ultrasound Requisition',
      urgency: 'HIGH',
      status: 'UNDER_REVIEW',
      status_label: '🟡 Under Doctor Review',
      created_at: 'Today, 09:15 AM',
      ambulance_108: false,
    },
    {
      id: 'REF-2026-079',
      patient_name: 'Ramesh Gowda',
      age_gender: '62 / M',
      village: 'Gejjalagere',
      referred_to: 'Cardiology Specialist OPD',
      facility: 'Mandya District Hospital',
      reason: 'Persistent chest tightness & uncontrolled systolic hypertension (>170 mmHg)',
      urgency: 'EMERGENCY',
      status: 'AMBULANCE_DISPATCHED',
      status_label: '🔴 108 Ambulance Dispatched',
      created_at: 'Yesterday, 04:30 PM',
      ambulance_108: true,
    },
    {
      id: 'REF-2026-074',
      patient_name: 'Savitri Bai',
      age_gender: '48 / F',
      village: 'Gejjalagere',
      referred_to: 'Dr. Vikram Sharma, MBBS',
      facility: 'Mandya PHC #2',
      reason: 'Uncontrolled Fasting Blood Sugar (210 mg/dL) requiring insulin dose titration',
      urgency: 'MEDIUM',
      status: 'APPROVED',
      status_label: '🟢 Doctor Approved & Rx Issued',
      created_at: '28 Aug 2026',
      ambulance_108: false,
    },
  ]);

  const filteredReferrals = referrals.filter((r) => {
    if (filter === 'PENDING') return r.status === 'UNDER_REVIEW';
    if (filter === 'APPROVED') return r.status === 'APPROVED';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0B3B74] dark:text-sky-400 tracking-wider">
            <HospitalIcon size={16} />
            <span>National Health Mission • Secondary Care Referral Network</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            रेफरल प्रबंधन (PHC &amp; Hospital Referrals)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Official ABDM Fast-Track Referral Slips to Mandya PHC #2 &amp; District Hospitals
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-[#0B3B74] hover:bg-[#0B3B74]/90 text-white text-xs font-black rounded-2xl flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <PlusIcon size={16} />
          <span>+ Create PHC Referral Slip</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs w-fit">
        {['ALL', 'PENDING', 'APPROVED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === f
                ? 'bg-[#0B3B74] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            {f === 'ALL' ? `All Referrals (${referrals.length})` : f === 'PENDING' ? 'Pending Review (1)' : 'Doctor Approved (1)'}
          </button>
        ))}
      </div>

      {/* Referral Slips List */}
      <div className="space-y-4">
        {filteredReferrals.map((ref) => (
          <div
            key={ref.id}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#0B3B74] dark:text-sky-300 flex items-center justify-center font-black text-sm">
                  📄
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {ref.patient_name}
                    </h3>
                    <span className="font-mono text-xs text-slate-400 font-bold">({ref.id})</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {ref.age_gender} • {ref.village} • Created: {ref.created_at}
                  </div>
                </div>
              </div>

              <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-fit">
                {ref.status_label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl space-y-1.5 text-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Clinical Reason for Referral:</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {ref.reason}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl space-y-1.5 text-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Referred Facility &amp; Doctor:</div>
                <div className="font-bold text-[#0B3B74] dark:text-sky-300">
                  {ref.referred_to}
                </div>
                <div className="text-[11px] text-slate-500">
                  🏥 {ref.facility} • ABDM Fast-Track Token Generated
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Government of Karnataka • Health &amp; Family Welfare Department</span>
              </div>

              <button
                onClick={() => showToast(`📄 Printing official referral slip ${ref.id}...`, 'info')}
                className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <span>🖨️ Print Referral Slip</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreateReferralModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

    </div>
  );
};

export default AshaReferralsPage;
