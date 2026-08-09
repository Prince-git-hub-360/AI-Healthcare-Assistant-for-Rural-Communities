import React from 'react';
import { ShieldIcon, CheckIcon, UserIcon } from '../ui/Icons';
import { useAuth } from '../../context/AuthContext';

export const AbhaCardWidget = ({ userProfile }) => {
  const { user, showToast } = useAuth();

  const abhaNumber = userProfile?.abha_number || user?.profile?.abha_number || '14-8923-4512-9012';
  const abhaAddress = userProfile?.abha_address || `${(user?.first_name || 'patient').toLowerCase()}@abha`;
  const name = `${user?.first_name || 'Ramesh'} ${user?.last_name || 'Kumar'}`;
  const gender = userProfile?.gender || 'Male';
  const yearOfBirth = userProfile?.dob || '1968';
  const village = userProfile?.village_or_town || user?.profile?.village_or_town || 'Mandya Rural';
  const district = userProfile?.district || user?.profile?.district || 'Mandya District';
  const state = userProfile?.state || user?.profile?.state || 'Karnataka';

  const copyAbhaNumber = () => {
    navigator.clipboard.writeText(abhaNumber);
    if (showToast) showToast('ABHA Number copied to clipboard!', 'success');
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl overflow-hidden bg-white border border-stone-300 shadow-xl font-sans relative">
      {/* 🇮🇳 Official Government Tricolor Top Bar */}
      <div className="h-2.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Official Header */}
      <div className="bg-[#0f2d4a] text-white p-4 sm:p-5 flex items-center justify-between border-b border-teal-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-[#0f2d4a] rounded-xl flex items-center justify-center font-extrabold text-sm shadow-md">
            🇮🇳
          </div>
          <div>
            <div className="text-[10px] font-extrabold tracking-widest uppercase text-teal-300">
              NATIONAL HEALTH AUTHORITY • GOVT OF INDIA
            </div>
            <div className="text-sm sm:text-base font-heading font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>Ayushman Bharat Health Account</span>
              <span className="bg-emerald-500 text-teal-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                ABHA
              </span>
            </div>
          </div>
        </div>

        <div className="w-9 h-9 bg-teal-800/80 rounded-xl flex items-center justify-center border border-teal-500/30">
          <ShieldIcon size={20} color="#5eead4" />
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-stone-50 via-white to-teal-50/30 grid grid-cols-1 sm:grid-cols-[1.2fr_0.8fr] gap-4 items-center">
        {/* Left Demographics & ABHA ID Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-teal-700 text-white rounded-2xl flex items-center justify-center font-heading text-xl font-bold border-2 border-white shadow-md">
              {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'R'}
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base sm:text-lg leading-tight uppercase tracking-tight">
                {name}
              </h3>
              <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                ABHA Address: {abhaAddress}
              </span>
            </div>
          </div>

          <div className="space-y-1 pt-1 text-xs">
            <div className="flex justify-between border-b border-stone-200/60 pb-1">
              <span className="text-stone-500 font-semibold">ABHA Number:</span>
              <span className="font-extrabold text-stone-900 tracking-wider font-mono text-sm">{abhaNumber}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-1">
              <span className="text-stone-500 font-semibold">Gender / YOB:</span>
              <span className="font-bold text-stone-800">{gender} • {yearOfBirth}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-1">
              <span className="text-stone-500 font-semibold">Location:</span>
              <span className="font-bold text-stone-800">{village}, {district}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-semibold">State & EHR Status:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckIcon size={14} color="#047857" /> {state} (Linked)
              </span>
            </div>
          </div>
        </div>

        {/* Right QR Code & Verification Stamp */}
        <div className="flex flex-col items-center justify-center p-4 bg-white border border-stone-200 rounded-2xl shadow-xs text-center space-y-2">
          {/* Simulated Official NHA QR Code */}
          <div className="w-28 h-28 bg-stone-900 p-2 rounded-xl flex items-center justify-center shadow-inner relative group">
            {/* Inner QR pattern lines */}
            <div className="w-full h-full bg-white p-1 rounded-lg grid grid-cols-5 gap-1">
              <div className="bg-stone-900 rounded-xs"></div>
              <div className="bg-stone-900 rounded-xs"></div>
              <div className="bg-stone-200 rounded-xs"></div>
              <div className="bg-stone-900 rounded-xs"></div>
              <div className="bg-stone-900 rounded-xs"></div>
              <div className="bg-stone-200 rounded-xs"></div>
              <div className="bg-teal-700 rounded-xs col-span-3"></div>
              <div className="bg-stone-900 rounded-xs col-span-2"></div>
              <div className="bg-stone-900 rounded-xs"></div>
              <div className="bg-stone-900 rounded-xs col-span-2"></div>
              <div className="bg-stone-900 rounded-xs"></div>
              <div className="bg-stone-900 rounded-xs"></div>
            </div>
            <span className="absolute text-[8px] bg-teal-800 text-white font-extrabold px-1.5 py-0.5 rounded shadow-xs">
              NHA QR
            </span>
          </div>

          <div className="text-[10px] font-extrabold text-stone-600 uppercase tracking-wider">
            SCAN AT PHC / CLINIC
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="bg-stone-100 p-3 px-5 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-[11px]">
          <ShieldIcon size={14} color="#0f766e" />
          <span>Verified under NHA Telemedicine Guidelines 2026</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyAbhaNumber}
            className="bg-white hover:bg-stone-200 text-stone-800 font-bold px-3 py-1.5 rounded-xl border border-stone-300 transition-colors cursor-pointer text-[11px]"
          >
            📋 Copy ABHA ID
          </button>
          <button
            onClick={() => window.print ? window.print() : showToast?.('Downloading Digital ABHA Card...', 'info')}
            className="bg-teal-800 hover:bg-teal-900 text-white font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-[11px] shadow-xs"
          >
            🖨️ Print Card
          </button>
        </div>
      </div>
    </div>
  );
};
