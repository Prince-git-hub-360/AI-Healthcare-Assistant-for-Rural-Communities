import React, { useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { ROUTES } from '../../../utils/routes';
import { 
  HospitalIcon, UserIcon, ClockIcon, ActivityIcon, 
  DocumentIcon, PhoneIcon, SparklesIcon
} from '../../../shared/icons/Icons';

export const AshaPortalLayout = ({ currentPath, onNavigate, children }) => {
  const { user, logout, showToast, currentLang, updateLanguage } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLang || 'en');

  const navGroups = [
    {
      label: 'MAIN',
      items: [
        { id: ROUTES.APP.ASHA.DASHBOARD, label: 'Dashboard', icon: HospitalIcon },
      ],
    },
    {
      label: 'FIELD WORK',
      items: [
        { id: ROUTES.APP.ASHA.PATIENTS, label: 'My Patients', icon: UserIcon },
        { id: ROUTES.APP.ASHA.VISITS, label: "Today's Visits", icon: ClockIcon, badge: '12 DUE' },
        { id: ROUTES.APP.ASHA.FOLLOW_UPS, label: 'Follow-ups', icon: ActivityIcon },
      ],
    },
    {
      label: 'PATIENT CARE',
      items: [
        { id: ROUTES.APP.PATIENT.HEALTH_VAULT, label: 'Health Records', icon: DocumentIcon },
        { id: ROUTES.APP.PATIENT.TRANSLATE, label: 'Prescriptions', icon: DocumentIcon },
        { id: ROUTES.APP.ASHA.REFERRALS, label: 'Referrals', icon: HospitalIcon },
      ],
    },
    {
      label: 'COORDINATION',
      items: [
        { id: ROUTES.APP.ASHA.COORDINATION, label: 'PHC Coordination', icon: HospitalIcon, badge: 'PHC #2' },
      ],
    },
    {
      label: 'EMERGENCY',
      items: [
        { id: ROUTES.APP.PATIENT.EMERGENCY, label: 'Emergency Support', icon: PhoneIcon, danger: true, badge: '108' },
      ],
    },
  ];

  const handleNav = (targetPath) => {
    onNavigate(targetPath);
  };

  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    if (updateLanguage) updateLanguage(newLang);
    if (showToast) {
      const langName = newLang === 'kn' ? 'ಕನ್ನಡ (Kannada)' : newLang === 'hi' ? 'हिन्दी (Hindi)' : 'English';
      showToast(`🌐 Interface language changed to ${langName}`, 'info');
    }
  };

  const isActive = (path) => currentPath === path;

  return (
    <div className="h-screen w-full flex flex-col bg-[#F4F7FB] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 font-sans overflow-hidden select-none">
      
      {/* 🏛️ 1. FIXED TOP OFFICIAL GOVERNMENT HEADER (DOES NOT SCROLL) */}
      <header className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs z-30">
        <div className="max-w-[1650px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Government of India (MoHFW) + National Health Mission (Bolder & Larger) */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <img
                src="/images/nha_logo.jpg"
                alt="Government of India - Ministry of Health and Family Welfare"
                style={{ height: '52px' }}
                className="w-auto object-contain drop-shadow-2xs"
              />
            </div>

            <div className="hidden sm:block h-10 w-[1px] bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-2">
              <img
                src="/images/nhm_logo.png"
                alt="National Health Mission"
                style={{ height: '52px' }}
                className="w-auto object-contain drop-shadow-2xs"
              />
            </div>
          </div>

          {/* Center: Swasthya Sanchar AI • ASHA Field Health Portal */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#0B3B74] dark:text-sky-300 tracking-tight">
                Swasthya Sanchar
              </span>
              <span className="text-[11px] font-black bg-emerald-100 text-[#00875A] dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                AI
              </span>
            </div>
            <div className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-wide uppercase mt-0.5">
              ASHA Field Health Portal
            </div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              स्वास्थ्य संचार
            </div>
          </div>

          {/* Right: Clean Digital India Vector Logo + Sunita Bai Profile Pill */}
          <div className="flex items-center gap-4">
            <img
              src="/images/digital_india_logo.svg"
              alt="Digital India - Power To Empower"
              style={{ height: '46px' }}
              className="w-auto object-contain hidden md:block"
            />

            <div 
              onClick={() => handleNav(ROUTES.APP.ASHA.PROFILE)}
              className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 p-1.5 pr-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-all"
            >
              <img
                src="/images/asha_sister_action.jpg"
                alt="Sunita Bai"
                style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
                className="rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
              <div className="text-left leading-tight">
                <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                  <span>Sunita Bai</span>
                  <span className="text-[10px] text-slate-400">⌵</span>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">ASHA Worker</div>
                <div className="text-[9px] text-slate-400 font-mono">ASHA-KA-8821</div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 🇮🇳 2. FIXED DEEP BLUE SUB-HEADER RIBBON (DOES NOT SCROLL) */}
      <div className="shrink-0 bg-[#0B3B74] text-white text-xs font-semibold px-4 sm:px-6 py-2 shadow-xs z-20">
        <div className="max-w-[1650px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">📍</span>
            <span className="font-bold text-white tracking-wide">Mandya PHC #2, Mandya District, Karnataka</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-blue-100">
            <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-lg">
              <span className="text-xs">🌐</span>
              <span className="text-[11px] font-bold">Language:</span>
              <select 
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-white font-black text-xs outline-none cursor-pointer"
              >
                <option value="en" className="text-slate-900">English</option>
                <option value="kn" className="text-slate-900">ಕನ್ನಡ (Kannada)</option>
                <option value="hi" className="text-slate-900">हिन्दी (Hindi)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-300 font-black">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
              <span>Live Sync: 10:42 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. MAIN WORKSPACE: FIXED LEFT SIDEBAR + SCROLLABLE RIGHT AREA */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-row overflow-hidden max-w-[1650px] w-full mx-auto px-4 sm:px-6 py-4 gap-6">
        
        {/* LEFT SIDEBAR (STICKY & INDEPENDENTLY SCROLLABLE) */}
        <aside className="w-[230px] shrink-0 h-full overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 shadow-xs space-y-4 hidden lg:flex flex-col justify-between scrollbar-none">
          <div className="space-y-4">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="text-[9px] font-black text-slate-400 tracking-wider px-3 uppercase">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item, iIdx) => {
                    const active = isActive(item.id);
                    const Icon = item.icon;
                    return (
                      <button
                        key={iIdx}
                        type="button"
                        onClick={() => handleNav(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                          item.danger
                            ? 'text-rose-600 hover:bg-rose-50'
                            : active
                              ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0B3B74] dark:text-sky-300 shadow-xs border-l-4 border-[#0B3B74]'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon size={16} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            item.danger ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            {/* ABDM Ecosystem Card */}
            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl space-y-1 text-left">
              <div className="text-[8px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
                National Digital Health Mission (ABDM) Aligned
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[10px] text-[#0B3B74] dark:text-sky-300">
                <div className="w-4 h-4 rounded bg-[#0B3B74] text-white flex items-center justify-center text-[7px] font-black shrink-0">
                  ABHA
                </div>
                <span className="truncate">Building Digital Health Ecosystem</span>
              </div>
            </div>

            {/* Footer Navigation Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
              <button
                type="button"
                onClick={() => handleNav(ROUTES.APP.ASHA.PROFILE)}
                className="w-full text-left text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                ⚙️ Settings &amp; Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  if (showToast) showToast('ℹ️ Swasthya Sanchar Helpdesk: Call 1800-11-4477', 'info');
                }}
                className="w-full text-left text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                ❓ Help &amp; Support
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  handleNav(ROUTES.AUTH.LOGIN);
                }}
                className="w-full text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 py-1.5 px-3 rounded-lg cursor-pointer"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT CONTAINER (THE ONLY SCROLLABLE PANE) */}
        <main className="flex-1 h-full overflow-y-auto pr-1 pb-16 scrollbar-thin">
          {children}
        </main>

      </div>

      {/* 🏛️ 4. FIXED OFFICIAL BOTTOM FOOTER (DOES NOT SCROLL) */}
      <footer className="shrink-0 bg-[#0B3B74] text-white text-[11px] font-medium py-2 px-4 sm:px-6 shadow-xs z-20">
        <div className="max-w-[1650px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div>© 2026 Government of India • National Health Authority (ABDM) | All Rights Reserved</div>
          <div className="font-mono text-[10px] text-blue-200">Mandya Catchment Zone #2 • Ver: 1.0.0</div>
        </div>
      </footer>

    </div>
  );
};

export default AshaPortalLayout;
