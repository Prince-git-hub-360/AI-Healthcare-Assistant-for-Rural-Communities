import React, { useState } from 'react';
import { HospitalIcon, CheckIcon, AlertIcon } from '../../../shared/icons/Icons';

export const CreateReferralModal = ({ isOpen, onClose, onCreateReferral, showToast }) => {
  const [patientName, setPatientName] = useState('Meena Devi');
  const [referredFacility, setReferredFacility] = useState('Mandya PHC #2 (Dr. Vikram Sharma)');
  const [reason, setReason] = useState('ANC 3rd Trimester Ultrasound & Hb Evaluation');
  const [priority, setPriority] = useState('Urgent');
  const [transportNeeded, setTransportNeeded] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const referral = {
      id: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName,
      referredFacility,
      reason,
      priority,
      transportNeeded,
      date: 'Today',
      status: 'Pending Review',
    };

    if (onCreateReferral) onCreateReferral(referral);
    if (showToast) showToast(`✅ PHC Referral Slip Issued for ${patientName}! Dispatched to Dr. Vikram Sharma.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-4 my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-xl">
            🏥
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Create PHC Medical Referral
            </h2>
            <p className="text-xs text-slate-500">
              Direct Referral Slip to Primary Health Centre Medical Officer
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Select Patient *</label>
            <select
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
            >
              <option value="Meena Devi">Meena Devi (28 / F • ANC Pregnancy)</option>
              <option value="Lakshmi Devi">Lakshmi Devi (54 / F • High BP)</option>
              <option value="Ravi Kumar">Ravi Kumar (60 / M • Type-2 DM)</option>
              <option value="Basavaraj Patil">Basavaraj Patil (42 / M • TB DOTS)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Referring Health Facility *</label>
            <select
              value={referredFacility}
              onChange={(e) => setReferredFacility(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
            >
              <option value="Mandya PHC #2 (Dr. Vikram Sharma)">Mandya Primary Health Centre #2 (Dr. Vikram Sharma)</option>
              <option value="CHC Maddur Maternity Wing">Maddur Community Health Centre (CHC)</option>
              <option value="Mandya District Hospital">Mandya District Hospital (Tertiary Care)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Priority *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none"
              >
                <option value="Urgent">🔴 Urgent (High Risk)</option>
                <option value="Normal">🟡 Routine Review</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">108 Transport</label>
              <select
                value={transportNeeded ? 'yes' : 'no'}
                onChange={(e) => setTransportNeeded(e.target.value === 'yes')}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none"
              >
                <option value="yes">🚑 108 Ambulance Needed</option>
                <option value="no">🚶 Self Transport</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Clinical Reason for Referral *</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe symptoms, vital readings, or tests needed..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#0B3B74]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B3B74] hover:bg-[#072448] text-white font-black text-xs py-3 rounded-2xl shadow-md transition-all cursor-pointer mt-2 flex items-center justify-center gap-1.5"
          >
            <CheckIcon size={16} color="#fff" />
            <span>Issue Referral Slip &amp; Alert Doctor</span>
          </button>

        </form>

      </div>
    </div>
  );
};

export default CreateReferralModal;
