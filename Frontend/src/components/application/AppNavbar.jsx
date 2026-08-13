import React, { useState } from 'react';
import { useAuth, LANGUAGES } from '../../shared/context/AuthContext';
import { HospitalIcon, MenuIcon, CloseIcon, TranslateIcon, DocumentIcon, ClockIcon, PhoneIcon, UserIcon } from '../../shared/icons/Icons';
import { ROUTES, navigateTo, getRoleDefaultRoute } from '../../utils/routes';

export const AppNavbar = ({ currentPath, onNavigate, onOpenChat }) => {
  const { user, logout, currentLang, updateLanguage, theme, toggleTheme } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const role = user?.role || 'patient';
  const roleLabel = {
    doctor: 'Doctor',
    healthcare_worker: 'ASHA Worker',
    caregiver: 'Caregiver',
    patient: 'Patient',
  }[role] || 'Patient';

  const defaultDashboardRoute = getRoleDefaultRoute(role);

  const navItems = [
    { id: defaultDashboardRoute, label: 'Care Hub', icon: HospitalIcon },
    { id: ROUTES.APP.PATIENT.TRANSLATE, label: 'Translate Rx', icon: TranslateIcon },
    { id: ROUTES.APP.PATIENT.HEALTH_VAULT, label: 'Health Vault', icon: DocumentIcon },
    { id: ROUTES.APP.PATIENT.REMINDERS, label: 'Reminders', icon: ClockIcon },
    { id: ROUTES.APP.PATIENT.EMERGENCY, label: '108 SOS', icon: PhoneIcon },
    { id: ROUTES.APP.PATIENT.PROFILE, label: 'Profile', icon: UserIcon },
  ];

  const handleNav = (targetPath) => {
    setDrawerOpen(false);
    if (onNavigate) {
      onNavigate(targetPath);
    } else {
      navigateTo(targetPath);
    }
  };

  const handleSignOut = () => {
    setDrawerOpen(false);
    logout();
    navigateTo(ROUTES.PUBLIC.HOME);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 backdrop-blur-md border-b border-stone-200 dark:border-slate-800 shadow-xs font-sans transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-2.5 px-4 md:px-8">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => handleNav(defaultDashboardRoute)}
        >
          <div className="w-8 h-8 bg-[#0B4F42] text-white rounded-lg flex items-center justify-center relative shadow-xs">
            <HospitalIcon size={18} color="#ffffff" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-sm text-stone-900 dark:text-white tracking-tight block leading-none">
              Swasthya Sanchar
            </span>
          </div>
        </div>

        {/* Desktop Application Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-stone-50 dark:bg-slate-800/80 border border-stone-200/80 dark:border-slate-700/80 p-1 rounded-xl">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/80 text-[#0B4F42] dark:text-teal-300 border border-teal-200/80 dark:border-teal-800 font-bold'
                    : 'text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700 hover:text-stone-900'
                }`}
              >
                <Icon size={15} color={isActive ? '#0B4F42' : (theme === 'dark' ? '#94a3b8' : '#64748b')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {/* Quick 1-Tap Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle Theme Mode"
          >
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span className="hidden sm:inline text-[11px]">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>

          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="bg-[#0B4F42] hover:bg-[#07362d] text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>💬 Ask AI</span>
            </button>
          )}

          {/* 3-Line Hamburger Drawer Trigger */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 p-1.5 rounded-lg text-stone-700 dark:text-slate-300 cursor-pointer flex items-center justify-center text-xs shadow-xs"
            aria-label="Open Navigation Drawer"
            title="Menu Drawer"
          >
            <MenuIcon size={18} />
          </button>
        </div>
      </div>

      {/* LEFT SIDEBAR DRAWER MODAL */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-start">
          <div
            className="fixed inset-0 bg-stone-950/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative z-[100000] bg-white dark:bg-slate-900 w-72 h-screen p-6 shadow-2xl flex flex-col justify-between border-r border-stone-200 dark:border-slate-800 overflow-y-auto font-sans transition-colors">
            <div className="space-y-6">
              {/* Sidebar Header */}
              <div className="flex justify-between items-center pb-4 border-b border-stone-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#0B4F42] text-white rounded-lg flex items-center justify-center font-bold text-xs">
                    <HospitalIcon size={18} color="#ffffff" />
                  </div>
                  <span className="font-extrabold text-sm text-stone-900 dark:text-white">Swasthya Sanchar</span>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <CloseIcon size={18} />
                </button>
              </div>

              {/* User Profile Overview */}
              <div className="bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/60 text-[#0B4F42] dark:text-teal-300 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                  {user?.first_name ? user.first_name.charAt(0).toUpperCase() : '👤'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                    {user?.first_name || user?.username || 'Prince'}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-slate-400 font-medium">
                    {roleLabel}
                  </div>
                </div>
              </div>

              {/* Main Navigation Links */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2">
                  Navigation
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0B4F42] dark:bg-teal-600 text-white shadow-xs font-bold'
                          : 'text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={18} color={isActive ? '#ffffff' : (theme === 'dark' ? '#2dd4bf' : '#0B4F42')} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Utility Controls at Bottom */}
            <div className="pt-4 border-t border-stone-200 dark:border-slate-800 space-y-3">
              {/* Language Selector */}
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

              {/* Theme Switcher Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <span>Theme Mode</span>
                <span className="text-xs bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                  {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </span>
              </button>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:text-slate-300 dark:hover:text-red-400 font-bold text-xs py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 transition-colors cursor-pointer text-center"
              >
                ↪ Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppNavbar;
