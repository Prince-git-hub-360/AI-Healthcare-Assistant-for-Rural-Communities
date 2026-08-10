import React, { useState } from 'react';
import { useAuth, LANGUAGES } from '../../shared/context/AuthContext';
import { HospitalIcon, MenuIcon, CloseIcon, TranslateIcon, DocumentIcon, ClockIcon, PhoneIcon, UserIcon } from '../../shared/icons/Icons';
import { ROUTES, navigateTo, getRoleDefaultRoute } from '../../utils/routes';

export const AppNavbar = ({ currentPath, onNavigate, onOpenChat }) => {
  const { user, logout, currentLang, updateLanguage } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const role = user?.role || 'patient';
  const roleEmoji = {
    doctor: '👨‍⚕️ Doctor',
    healthcare_worker: '👩‍⚕️ ASHA Worker',
    caregiver: '👨‍👩‍👧 Caregiver',
    patient: '👵 Patient',
  }[role] || '👵 Patient';

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
    <header className="sticky top-0 z-50 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-stone-200 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-8">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNav(defaultDashboardRoute)}
        >
          <div className="w-10 h-10 bg-teal-800 text-white rounded-xl flex items-center justify-center relative shadow-sm">
            <HospitalIcon size={20} color="#ffffff" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#fdfbf7] animate-pulse" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-base text-stone-900 tracking-tight block leading-none">
              Swasthya Sanchar
            </span>
            <span className="text-[9px] font-extrabold text-teal-800 tracking-wider uppercase block mt-1">
              AUTHENTICATED PORTAL
            </span>
          </div>
        </div>

        {/* Desktop Application Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-stone-100/80 border border-stone-200/80 p-1 rounded-2xl">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-200/70 hover:text-teal-800'
                }`}
              >
                <Icon size={16} color={isActive ? '#ffffff' : '#0f766e'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
            >
              <span>💬 Ask AI</span>
            </button>
          )}

          {/* Language Selector */}
          <select
            className="bg-white border border-stone-200 text-stone-800 text-xs font-semibold px-2 py-1.5 rounded-xl cursor-pointer outline-none hover:border-teal-700"
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

          {/* Hamburger Side Drawer Button */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="bg-stone-100 hover:bg-stone-200 border border-stone-200 p-2 rounded-xl text-stone-800 cursor-pointer flex items-center gap-1 font-bold text-xs shadow-xs"
            aria-label="Open Application Menu"
          >
            <MenuIcon size={20} />
          </button>
        </div>
      </div>

      {/* SIDE DRAWER MODAL */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative z-[100000] bg-white w-80 h-screen p-6 shadow-2xl flex flex-col justify-between border-l border-stone-200 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-stone-200 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-700 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                    {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-stone-900">{user?.first_name || user?.username || 'User'}</div>
                    <div className="text-[10px] text-teal-700 font-bold">{roleEmoji}</div>
                  </div>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 text-sm font-bold cursor-pointer"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              <div className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-3">
                APPLICATION NAVIGATION
              </div>

              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'text-stone-700 hover:bg-stone-100 hover:text-teal-800'
                      }`}
                    >
                      <Icon size={18} color={isActive ? '#ffffff' : '#0f766e'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200">
              <button
                onClick={handleSignOut}
                className="w-full bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-600 font-bold text-xs py-3 rounded-xl border border-stone-200 transition-colors cursor-pointer text-center"
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

export default AppNavbar;
