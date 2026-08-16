import React, { useState } from 'react';
import { useAuth, LANGUAGES } from '../../../../shared/context/AuthContext';
import { HospitalIcon, MenuIcon, CloseIcon, TranslateIcon, DocumentIcon, ClockIcon, PhoneIcon, UserIcon } from '../../../../shared/icons/Icons';

export const PatientNavbar = ({ currentView, setCurrentView, onOpenChat }) => {
  const { user, logout, currentLang, updateLanguage } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const roleEmoji = '👵 Patient';

  const navItems = [
    { id: 'dashboard', label: 'Care Hub', icon: HospitalIcon },
    { id: 'translate', label: 'Translate Rx', icon: TranslateIcon },
    { id: 'medical_vault', label: 'Health Vault', icon: DocumentIcon },
    { id: 'reminders', label: 'Reminders', icon: ClockIcon },
    { id: 'emergency', label: '108 SOS', icon: PhoneIcon },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-8">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer min-h-[44px] py-1"
          onClick={() => setCurrentView('dashboard')}
        >
          <div className="w-10 h-10 bg-teal-700 text-white rounded-xl flex items-center justify-center relative shadow-sm">
            <HospitalIcon size={20} color="#ffffff" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
          </div>
          <div>
            <span className="font-heading font-extrabold text-base text-slate-900 dark:text-white tracking-tight block leading-none">
              Swasthya Sanchar
            </span>
            <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-400 tracking-wider uppercase block mt-1">
              PATIENT PORTAL
            </span>
          </div>
        </div>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 p-1.5 rounded-2xl">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700 hover:text-teal-800 dark:hover:text-teal-300'
                }`}
              >
                <Icon size={18} color={isActive ? '#ffffff' : '#0f766e'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* AI Voice & Chat Trigger Button */}
          <button
            onClick={onOpenChat}
            className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2.5 min-h-[44px] rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="text-sm">💬</span>
            <span>Ask AI</span>
          </button>

          {/* Language Selector */}
          <select
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold px-3 py-2.5 min-h-[44px] rounded-xl cursor-pointer outline-none hover:border-teal-700 dark:hover:border-teal-400"
            value={currentLang}
            onChange={(e) => updateLanguage(e.target.value)}
            aria-label="Language Selector"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>

          {/* Hamburger Side Menu Button */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 p-2.5 min-h-[44px] min-w-[44px] rounded-xl text-slate-800 dark:text-slate-200 cursor-pointer flex items-center justify-center shadow-xs"
            aria-label="Open Navigation Menu"
          >
            <MenuIcon size={22} />
          </button>
        </div>
      </div>

      {/* HAMBURGER SIDE DRAWER MODAL */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative z-[100000] bg-white dark:bg-slate-900 w-80 h-screen p-6 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-teal-700 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-xs">
                    {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">{user?.first_name || user?.username || 'User'}</div>
                    <div className="text-[10px] text-teal-700 dark:text-teal-400 font-bold">{roleEmoji}</div>
                  </div>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                PATIENT NAVIGATION
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl font-bold text-xs text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-800 dark:hover:text-teal-300'
                      }`}
                    >
                      <Icon size={18} color={isActive ? '#ffffff' : '#0f766e'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Sign Out */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                  setCurrentView('landing');
                }}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 font-bold text-xs py-3 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-center"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PatientNavbar;
