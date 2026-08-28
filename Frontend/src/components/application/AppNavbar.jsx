import React, { useState, useRef, useEffect } from 'react';
import { useAuth, LANGUAGES } from '../../shared/context/AuthContext';
import {
  HospitalIcon, MenuIcon, CloseIcon, TranslateIcon, DocumentIcon,
  ClockIcon, PhoneIcon, UserIcon, SparklesIcon, MoonIcon, SunIcon, ShieldIcon
} from '../../shared/icons/Icons';
import { ROUTES, navigateTo, getRoleDefaultRoute } from '../../utils/routes';
import SwasthyaLogo from '../branding/SwasthyaLogo';

/* ─── small icon-only nav item used in sidebar ─── */
const NavItem = ({ icon: Icon, label, active, danger, badge, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150 cursor-pointer group ${
      danger
        ? active
          ? 'bg-rose-600 text-white shadow-sm'
          : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
        : active
          ? 'bg-[#0B4F42] text-white shadow-sm'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    <Icon
      size={18}
      color={danger ? (active ? '#ffffff' : '#dc2626') : (active ? '#ffffff' : '#64748b')}
      className="shrink-0"
    />
    <span className="flex-1 truncate text-[13px]">{label}</span>
    {badge && (
      <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md shrink-0 ${
        danger ? 'bg-white/20 text-white' : 'bg-[#E2A233]/20 text-[#8A5B00]'
      }`}>
        {badge}
      </span>
    )}
  </button>
);

/* ─── nav section label ─── */
const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 pt-2 pb-1 select-none">
    {children}
  </p>
);

export const AppNavbar = ({ currentPath, onNavigate, onOpenChat }) => {
  const { user, logout, currentLang, updateLanguage, theme, toggleTheme } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const role = user?.role || 'patient';
  const roleLabel = {
    doctor: 'Doctor',
    healthcare_worker: 'ASHA Worker',
    caregiver: 'Caregiver',
    patient: 'Patient',
  }[role] || 'Patient';

  const defaultDashboardRoute = getRoleDefaultRoute(role);

  // Close popover on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNav = (path) => {
    setMobileDrawerOpen(false);
    setProfileMenuOpen(false);
    if (onNavigate) onNavigate(path);
    else navigateTo(path);
  };

  const handleSignOut = () => {
    setMobileDrawerOpen(false);
    setProfileMenuOpen(false);
    logout();
    navigateTo(ROUTES.PUBLIC.HOME);
  };

  const isActive = (id) => {
    if (currentPath === id) return true;
    if (id === defaultDashboardRoute && (currentPath === '/app/patient/dashboard' || currentPath === '/app/patient/care')) return true;
    return false;
  };

  const userName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username || 'Prince Kumar';
  const userInitial = userName.charAt(0).toUpperCase();

  /* ─── nav structure ─── */
  const navSections = [
    {
      label: 'Overview',
      items: [
        { id: defaultDashboardRoute, label: 'Home', icon: HospitalIcon },
      ],
    },
    {
      label: 'My Care',
      items: [
        { id: ROUTES.APP.PATIENT.REMINDERS, label: 'Medications & Reminders', icon: ClockIcon },
        { id: ROUTES.APP.PATIENT.HEALTH_VAULT, label: 'Health Records', icon: DocumentIcon },
      ],
    },
    {
      label: 'AI Tools',
      items: [
        { id: ROUTES.APP.PATIENT.TRANSLATE, label: 'Translate Prescription', icon: TranslateIcon },
      ],
    },
    {
      label: 'Emergency',
      items: [
        { id: ROUTES.APP.PATIENT.EMERGENCY, label: 'Emergency Care', icon: PhoneIcon, danger: true, badge: 'SOS' },
      ],
    },
  ];

  /* ─── Sidebar JSX (shared between desktop & mobile) ─── */
  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div
        className="px-4 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 cursor-pointer shrink-0"
        onClick={() => handleNav(defaultDashboardRoute)}
      >
        <SwasthyaLogo variant={theme === 'dark' ? 'dark' : 'light'} height={36} />
        {mobile && (
          <button
            onClick={(e) => { e.stopPropagation(); setMobileDrawerOpen(false); }}
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <CloseIcon size={18} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 min-h-0">
        {navSections.map((section) => (
          <div key={section.label}>
            <SectionLabel>{section.label}</SectionLabel>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.id)}
                  danger={item.danger}
                  badge={item.badge}
                  onClick={() => handleNav(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom profile block */}
      <div className="shrink-0 border-t border-slate-100 dark:border-slate-800 p-3 relative" ref={mobile ? undefined : profileMenuRef}>

        {/* Profile Popup — elegant SaaS style */}
        {profileMenuOpen && (
          <div className="absolute bottom-full mb-2 left-2 right-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* User identity header */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-[#0B4F42] text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{userName}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  {roleLabel}
                </div>
              </div>
            </div>

            {/* Menu actions */}
            <div className="p-2 space-y-0.5">
              <button
                type="button"
                onClick={() => handleNav(ROUTES.APP.PATIENT.PROFILE)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
              >
                <UserIcon size={16} color={theme === 'dark' ? '#cbd5e1' : '#64748b'} />
                View Profile & Settings
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
              >
                {theme === 'dark'
                  ? <SunIcon size={16} color="#cbd5e1" />
                  : <MoonIcon size={16} color="#64748b" />
                }
                {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 p-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Profile & Direct Sign Out Footer */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className={`flex-1 min-w-0 flex items-center gap-2.5 px-2.5 py-2 rounded-xl border transition-all cursor-pointer ${
              profileMenuOpen
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
            }`}
          >
            <div className="w-8 h-8 bg-[#0B4F42] text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0 text-left flex-1">
              <div className="text-[13px] font-bold text-slate-900 dark:text-white truncate leading-tight">{userName}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{roleLabel}</div>
            </div>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: profileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Visible 1-Click Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            className="p-2.5 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-colors cursor-pointer shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          DESKTOP SIDEBAR (≥1024px) — Clean White/Dark
      ═══════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[248px] bg-white dark:bg-[#0B0F17] border-r border-slate-200 dark:border-slate-800 z-40 flex-col font-sans select-none shadow-sm overflow-x-hidden transition-colors duration-200">
        <SidebarContent />
      </aside>

      {/* ═══════════════════════════════════════════════════
          MOBILE TOPBAR (<1024px)
      ═══════════════════════════════════════════════════ */}
      <header className="flex lg:hidden sticky top-0 z-40 bg-white dark:bg-[#0B0F17] border-b border-slate-200 dark:border-slate-800 py-3 px-4 items-center justify-between shadow-sm transition-colors duration-200">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNav(defaultDashboardRoute)}
        >
          <SwasthyaLogo variant={theme === 'dark' ? 'dark' : 'light'} height={32} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="border border-slate-200 p-2 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
            aria-label="Open menu"
          >
            <MenuIcon size={20} />
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════
          MOBILE DRAWER
      ═══════════════════════════════════════════════════ */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[99999] flex justify-start">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative z-[100000] bg-white dark:bg-[#0B0F17] w-72 h-screen shadow-2xl border-r border-slate-200 dark:border-slate-800 overflow-hidden font-sans transition-colors duration-200">
            <SidebarContent mobile />
          </div>
        </div>
      )}
    </>
  );
};

export default AppNavbar;
