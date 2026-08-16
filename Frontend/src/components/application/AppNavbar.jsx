import React, { useState } from 'react';
import { useAuth, LANGUAGES } from '../../shared/context/AuthContext';
import {
  HospitalIcon, MenuIcon, CloseIcon, TranslateIcon, DocumentIcon,
  ClockIcon, PhoneIcon, UserIcon, SparklesIcon, MoonIcon, SunIcon
} from '../../shared/icons/Icons';
import { ROUTES, navigateTo, getRoleDefaultRoute } from '../../utils/routes';

export const AppNavbar = ({ currentPath, onNavigate, onOpenChat }) => {
  const { user, logout, currentLang, updateLanguage, theme, toggleTheme } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const role = user?.role || 'patient';
  const roleLabel = {
    doctor: 'Doctor',
    healthcare_worker: 'ASHA Worker',
    caregiver: 'Caregiver',
    patient: 'Patient',
  }[role] || 'Patient';

  const defaultDashboardRoute = getRoleDefaultRoute(role);

  const mainNavItems = [
    { id: defaultDashboardRoute, label: 'Care Hub', icon: HospitalIcon },
    { id: ROUTES.APP.PATIENT.TRANSLATE, label: 'Translate Rx', icon: TranslateIcon },
    { id: ROUTES.APP.PATIENT.HEALTH_VAULT, label: 'Health Vault', icon: DocumentIcon },
    { id: ROUTES.APP.PATIENT.REMINDERS, label: 'Reminders', icon: ClockIcon },
  ];

  const emergencyNavItems = [
    { id: ROUTES.APP.PATIENT.EMERGENCY, label: '108 SOS', icon: PhoneIcon, isEmergency: true },
  ];

  const handleNav = (targetPath) => {
    setMobileDrawerOpen(false);
    if (onNavigate) {
      onNavigate(targetPath);
    } else {
      navigateTo(targetPath);
    }
  };

  const handleSignOut = () => {
    setMobileDrawerOpen(false);
    logout();
    navigateTo(ROUTES.PUBLIC.HOME);
  };

  // Helper to determine if a route is currently active
  const isRouteActive = (routeId) => {
    if (currentPath === routeId) return true;
    if (routeId === defaultDashboardRoute && (currentPath === '/app/patient/dashboard' || currentPath === '/app/patient/care')) return true;
    return false;
  };

  const userName = user?.first_name || user?.username || 'Prince';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FIXED DESKTOP LEFT SIDEBAR (VISIBLE ON DESKTOP: >=1024px)              */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-[#111827] border-r border-stone-200/90 dark:border-slate-800 z-40 flex-col justify-between p-5 font-sans transition-colors duration-200 select-none shadow-xs">
        <div className="space-y-5 overflow-y-auto scrollbar-none pr-1">
          
          {/* BRAND LOGO HEADER */}
          <div
            className="flex items-center gap-3 cursor-pointer pb-2 pt-1 border-b border-stone-100 dark:border-slate-800/80"
            onClick={() => handleNav(defaultDashboardRoute)}
          >
            <div className="w-10 h-10 bg-[#0B4F42] text-white rounded-xl flex items-center justify-center relative shadow-xs shrink-0">
              <HospitalIcon size={20} color="#ffffff" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111827]" />
            </div>
            <div className="min-w-0">
              <span className="font-heading font-black text-base text-stone-900 dark:text-white tracking-tight block leading-tight truncate">
                Swasthya Sanchar
              </span>
              <span className="text-[9px] font-extrabold text-[#0B4F42] dark:text-teal-400 tracking-wider uppercase block mt-0.5">
                HEALTHCARE PORTAL
              </span>
            </div>
          </div>

          {/* PATIENT PROFILE CARD */}
          <div
            onClick={() => handleNav(ROUTES.APP.PATIENT.PROFILE)}
            className="bg-teal-50/60 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-slate-800 border border-teal-100 dark:border-slate-700/80 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all shadow-2xs group"
          >
            <div className="w-10 h-10 bg-[#0B4F42] text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-stone-900 dark:text-white truncate">
                {userName}
              </div>
              <div className="text-[11px] font-bold text-[#0B4F42] dark:text-teal-300">
                {roleLabel}
              </div>
            </div>
          </div>

          {/* MAIN NAVIGATION SECTION */}
          <div className="space-y-1">
            <div className="text-[10px] font-black text-stone-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-1">
              MAIN
            </div>

            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-teal-50 dark:bg-teal-950/80 text-[#0B4F42] dark:text-teal-300 border-l-4 border-[#0B4F42] dark:border-teal-400 shadow-2xs'
                      : 'text-stone-700 dark:text-slate-300 hover:bg-stone-100/80 dark:hover:bg-slate-800/80 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={18} color={active ? '#0B4F42' : (theme === 'dark' ? '#94a3b8' : '#64748b')} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* EMERGENCY SECTION */}
          <div className="space-y-1 pt-1">
            <div className="text-[10px] font-black text-stone-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-1">
              EMERGENCY
            </div>

            {emergencyNavItems.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-l-4 border-rose-600 shadow-2xs'
                      : 'bg-rose-50/60 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 border border-rose-200/60 dark:border-rose-900/40'
                  }`}
                >
                  <Icon size={18} color={active ? '#991b1b' : '#dc2626'} />
                  <span>{item.label}</span>
                  <span className="ml-auto text-[9px] font-black uppercase bg-rose-600 text-white px-1.5 py-0.5 rounded-md">
                    SOS
                  </span>
                </button>
              );
            })}
          </div>

          {/* SUPPORT SECTION */}
          <div className="space-y-1 pt-1">
            <div className="text-[10px] font-black text-stone-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-1">
              SUPPORT
            </div>

            <button
              type="button"
              onClick={onOpenChat}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-left transition-all cursor-pointer bg-teal-50/50 dark:bg-slate-800/60 text-[#0B4F42] dark:text-teal-300 hover:bg-teal-100/60 dark:hover:bg-slate-800 border border-teal-100 dark:border-slate-700/60"
            >
              <SparklesIcon size={18} className="text-[#0B4F42] dark:text-teal-400" />
              <span>Ask AI</span>
            </button>
          </div>

        </div>

        {/* BOTTOM SIDEBAR UTILITIES */}
        <div className="pt-3 border-t border-stone-200/90 dark:border-slate-800 space-y-2.5 shrink-0">
          
          {/* LANGUAGE SELECTOR */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-stone-400 dark:text-slate-500 uppercase tracking-widest px-1 block">
              LANGUAGE
            </label>
            <select
              value={currentLang}
              onChange={(e) => updateLanguage(e.target.value)}
              className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-800 dark:text-slate-200 cursor-pointer outline-none focus:border-[#0B4F42]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.native} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* THEME TOGGLE */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <span className="text-[11px] font-extrabold uppercase text-stone-500 dark:text-slate-400">THEME</span>
            <span className="text-xs font-bold flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 px-2 py-0.5 rounded-lg shadow-2xs">
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </span>
          </button>

          {/* SIGN OUT BUTTON */}
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full bg-stone-100 hover:bg-rose-50 dark:bg-slate-800/80 dark:hover:bg-rose-950/40 text-stone-700 hover:text-rose-700 dark:text-slate-300 dark:hover:text-rose-300 font-bold text-xs py-2 rounded-xl border border-stone-200 dark:border-slate-700/80 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>

        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE TOPBAR (VISIBLE ONLY ON MOBILE/TABLET: <1024px)                  */}
      {/* ========================================================================= */}
      <header className="flex lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-stone-200/90 dark:border-slate-800 py-2.5 px-4 items-center justify-between shadow-xs transition-colors">
        
        {/* Mobile Brand Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => handleNav(defaultDashboardRoute)}
        >
          <div className="w-8 h-8 bg-[#0B4F42] text-white rounded-lg flex items-center justify-center relative shadow-xs">
            <HospitalIcon size={18} color="#ffffff" />
          </div>
          <div>
            <span className="font-heading font-black text-sm text-stone-900 dark:text-white tracking-tight block leading-none">
              Swasthya Sanchar
            </span>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 p-2 rounded-lg text-xs font-semibold text-stone-700 dark:text-slate-200 cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>

          <button
            type="button"
            onClick={onOpenChat}
            className="bg-[#0B4F42] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            <SparklesIcon size={14} />
            <span>AI</span>
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 p-2 rounded-lg text-stone-700 dark:text-slate-300 cursor-pointer"
            aria-label="Open Mobile Menu"
          >
            <MenuIcon size={18} />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MOBILE RESPONSIVE DRAWER (TRIGGERED ON MOBILE/TABLET ONLY)              */}
      {/* ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[99999] flex justify-start">
          <div
            className="fixed inset-0 bg-stone-950/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="relative z-[100000] bg-white dark:bg-slate-900 w-72 h-screen p-5 shadow-2xl flex flex-col justify-between border-r border-stone-200 dark:border-slate-800 overflow-y-auto font-sans transition-colors">
            
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-3 border-b border-stone-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#0B4F42] text-white rounded-lg flex items-center justify-center font-bold text-xs">
                    <HospitalIcon size={18} color="#ffffff" />
                  </div>
                  <span className="font-extrabold text-sm text-stone-900 dark:text-white">Swasthya Sanchar</span>
                </div>

                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <CloseIcon size={18} />
                </button>
              </div>

              {/* Patient Profile Card */}
              <div className="bg-teal-50/60 dark:bg-slate-800/80 border border-teal-100 dark:border-slate-700/80 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-[#0B4F42] text-white rounded-xl flex items-center justify-center font-black text-xs shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                    {userName}
                  </div>
                  <div className="text-[11px] text-[#0B4F42] dark:text-teal-300 font-semibold">
                    {roleLabel}
                  </div>
                </div>
              </div>

              {/* Main Nav Links */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-1">
                  MAIN
                </div>
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-xs text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-xs'
                          : 'text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={18} color={active ? '#ffffff' : (theme === 'dark' ? '#2dd4bf' : '#0B4F42')} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Emergency Section */}
              <div className="space-y-1 pt-1">
                <div className="text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-1">
                  EMERGENCY
                </div>
                {emergencyNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-xs text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40'
                      }`}
                    >
                      <Icon size={18} color={active ? '#ffffff' : '#dc2626'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Support Section */}
              <div className="space-y-1 pt-1">
                <div className="text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-1">
                  SUPPORT
                </div>
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenChat();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-xs text-left transition-all cursor-pointer bg-teal-50/60 dark:bg-slate-800 text-[#0B4F42] dark:text-teal-300"
                >
                  <SparklesIcon size={18} />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>

            {/* Bottom Utilities */}
            <div className="pt-4 border-t border-stone-200 dark:border-slate-800 space-y-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest px-1 block">
                  Language
                </label>
                <select
                  value={currentLang}
                  onChange={(e) => updateLanguage(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 dark:text-slate-200 cursor-pointer outline-none"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.native} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:text-slate-300 dark:hover:text-red-400 font-bold text-xs py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 transition-colors cursor-pointer text-center"
              >
                🚪 Sign Out
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AppNavbar;
