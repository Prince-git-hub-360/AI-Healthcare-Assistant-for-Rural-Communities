import React, { useState } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { ShieldIcon, HeartIcon, PhoneIcon, MapPinIcon, QrCodeIcon, CheckIcon } from '../../shared/icons/Icons';

export const AbhaCardView = ({ card, compact = false, showActions = true }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const displayName = card?.full_name || user?.first_name || (user?.username && !/^\d+$/.test(user.username) ? user.username : 'Prince Kumar');
  const displayAbhaId = card?.abha_id || user?.profile?.abha_id || user?.abha_id || '91-4820-9921-7740';
  const displayDob = card?.date_of_birth || user?.profile?.date_of_birth || (user?.profile?.age ? `Age ${user.profile.age} yrs` : '05/10/2007');
  const displayGender = card?.gender || (user?.profile?.gender === 'F' ? 'Female / महिला' : 'Male / पुरुष');
  const displayBlood = card?.blood_group || user?.profile?.blood_group || 'B +ve';
  const displayPhone = card?.phone_number || user?.profile?.phone_number || '+91 9008802105';
  const displayVillage = card?.village_or_town || user?.profile?.village_or_town || 'Electronic City';
  const displayDistrict = card?.district || user?.profile?.district || 'Bengaluru';
  const displayState = card?.state || user?.profile?.state || 'Karnataka';
  const displayPin = card?.pincode || user?.profile?.pincode || '560100';

  const handleCopyAbha = () => {
    navigator.clipboard?.writeText(displayAbhaId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-3 font-sans print:max-w-none print:m-0">
      {/* ABDM Physical Card Container */}
      <div className="bg-white dark:bg-[#131b2c] border-2 border-sky-600/40 dark:border-sky-500/40 rounded-3xl shadow-xl overflow-hidden text-slate-800 dark:text-slate-100 relative transition-all">
        
        {/* Top Header: Indian Tricolor + National Health Authority */}
        <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-5 py-3.5 border-b border-sky-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Indian Flag Strip */}
            <div className="w-4.5 h-6 rounded-xs overflow-hidden shadow-xs flex flex-col shrink-0 border border-slate-300 dark:border-slate-600">
              <div className="flex-1 bg-[#FF9933]" />
              <div className="flex-1 bg-white relative flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#000080]" />
              </div>
              <div className="flex-1 bg-[#138808]" />
            </div>

            <div>
              <div className="text-[11px] font-black text-slate-900 dark:text-white tracking-wider uppercase leading-tight">
                NATIONAL HEALTH AUTHORITY
              </div>
              <div className="text-[9.5px] font-bold text-sky-800 dark:text-sky-300">
                Ayushman Bharat Digital Mission (ABDM)
              </div>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-xs" title="Official Verified ABDM Health ID">
            <ShieldIcon size={18} />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
          {/* Left Details */}
          <div className="space-y-2.5 flex-1 min-w-0">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight leading-snug">
                {displayName}
              </h3>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 font-mono font-extrabold text-xs">
                <span>ABHA ID:</span>
                <span className="tracking-wide">{displayAbhaId}</span>
              </div>
            </div>

            <div className="text-[11.5px] space-y-1.5 text-slate-700 dark:text-slate-200 font-medium">
              <div className="flex items-center gap-2">
                <span><strong>DOB:</strong> {displayDob}</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span><strong>Gender:</strong> {displayGender}</span>
              </div>

              {displayBlood && (
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold">
                  <HeartIcon size={13} className="shrink-0" />
                  <span>Blood Group: {displayBlood}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                <PhoneIcon size={13} className="shrink-0 text-slate-400" />
                <span>{displayPhone}</span>
              </div>

              <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                <MapPinIcon size={13} className="shrink-0 text-slate-400 mt-0.5" />
                <span className="truncate">{displayVillage}, {displayDistrict}, {displayState} - {displayPin}</span>
              </div>
            </div>
          </div>

          {/* Right QR Box */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white dark:bg-slate-900 p-2 rounded-2xl border-2 border-slate-900 dark:border-sky-400/50 shadow-inner flex items-center justify-center relative">
              <QrCodeIcon size={80} className="text-slate-950 dark:text-white" />
              {/* Center Emblem Dot */}
              <div className="absolute w-4 h-4 rounded-full bg-emerald-600 border border-white flex items-center justify-center text-[7px] text-white font-bold">
                ✓
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1.5">
              SCAN AT PHC
            </span>
          </div>
        </div>

        {/* Card Footer Strip */}
        <div className="bg-sky-50/80 dark:bg-slate-900/90 px-5 py-2 border-t border-sky-100 dark:border-slate-800 text-center">
          <p className="text-[10px] font-bold text-sky-800 dark:text-sky-300 tracking-wide">
            Digital Health Card • Official Healthcare Record (ABDM)
          </p>
        </div>
      </div>

      {/* Action Controls (Hidden in Print) */}
      {showActions && (
        <div className="flex items-center justify-between gap-2 px-1 print:hidden">
          <button
            type="button"
            onClick={handleCopyAbha}
            className="flex-1 py-2 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <CheckIcon size={14} className="text-emerald-600" />
                <span className="text-emerald-600">Copied ABHA ID!</span>
              </>
            ) : (
              <>
                <span className="text-slate-400">📋</span>
                <span>Copy ABHA ID</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2 px-3 bg-[#0B4F42] hover:bg-[#093f35] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>🖨️</span>
            <span>Print / Save PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AbhaCardView;
