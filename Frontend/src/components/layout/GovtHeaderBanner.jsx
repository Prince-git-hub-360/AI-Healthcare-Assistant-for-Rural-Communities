import React from 'react';

// 🇮🇳 Tricolor Ribbon Wave Vector
export const IndianFlagWaveSwoosh = () => (
  <svg width="120" height="42" viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-xs">
    <path d="M0 8 Q 45 0, 85 14 T 140 6 L 140 20 Q 95 28, 55 14 T 0 22 Z" fill="#FF9933" />
    <path d="M0 20 Q 45 12, 85 26 T 140 18 L 140 32 Q 95 40, 55 26 T 0 34 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
    <circle cx="70" cy="27" r="4.5" fill="none" stroke="#000080" strokeWidth="1" />
    <path d="M0 32 Q 45 24, 85 38 T 140 30 L 140 44 Q 95 52, 55 38 T 0 46 Z" fill="#138808" />
  </svg>
);

export const GovtHeaderBanner = ({ 
  subtitle = "Swasthya Sanchar ABDM Village Registry | स्वास्थ्य संचार ABDM ग्राम रजिस्ट्री",
  showSisterProfile = true,
  rightCustomBadge = null
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      
      {/* 🏛️ 1. TOP OFFICIAL GOVERNMENT LOGOS STRIP */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: 3 Official Government Logos (NHA / MoHFW, NHM, Ayushman Bharat PM-JAY) */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          
          {/* Logo 1: National Health Authority & Ministry of Health & Family Welfare (with Ashoka Lion) */}
          <div className="flex items-center gap-2">
            <img
              src="/images/nha_logo.jpg"
              alt="National Health Authority, Ministry of Health and Family Welfare, Government of India"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="hidden sm:block h-9 w-[1.5px] bg-slate-200 dark:bg-slate-700" />

          {/* Logo 2: National Health Mission (NHM) */}
          <div className="flex items-center gap-2">
            <img
              src="/images/nhm_logo.png"
              alt="National Health Mission - राष्ट्रीय स्वास्थ्य मिशन"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="hidden sm:block h-9 w-[1.5px] bg-slate-200 dark:bg-slate-700" />

          {/* Logo 3: Ayushman Bharat PM-JAY */}
          <div className="flex items-center gap-2">
            <img
              src="/images/pmjay_logo.png"
              alt="Ayushman Bharat PM-JAY - प्रधानमंत्री जन आरोग्य योजना"
              className="h-12 w-auto object-contain"
            />
          </div>

        </div>

        {/* Right: Indian Flag Wave + Sister Lakshmi Devi Profile Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <IndianFlagWaveSwoosh />
          </div>

          {rightCustomBadge ? (
            rightCustomBadge
          ) : showSisterProfile ? (
            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 p-1.5 pr-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <img
                src="/images/asha_sister_action.jpg"
                alt="Sister Lakshmi Devi"
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
              <div className="text-left leading-tight">
                <div className="text-xs font-black text-slate-900 dark:text-white">Sister Lakshmi Devi</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">ASHA Worker</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400">PHC Mandya (Karnataka)</div>
              </div>
            </div>
          ) : null}
        </div>

      </div>

      {/* 🇮🇳 2. DEEP BLUE OFFICIAL SUB-BANNER */}
      <div className="bg-[#0B3B74] text-white px-4 md:px-6 py-2.5 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-sm sm:text-base md:text-lg font-black text-white tracking-wide">
            {subtitle}
          </h1>
          <div className="text-[11px] font-bold text-blue-100 flex items-center gap-2">
            <span>Mandya Catchment Area #2</span>
            <span>•</span>
            <span className="text-emerald-300 font-black">● Live ABDM &amp; NHM Sync</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GovtHeaderBanner;
