import React, { useState } from 'react';
import { useAuth, LANGUAGES } from '../../context/AuthContext';
import { HospitalIcon, ShieldIcon, MenuIcon, CloseIcon, TranslateIcon, DocumentIcon, ClockIcon, PhoneIcon, UserIcon } from '../ui/Icons';

export const HeaderAuth = ({ currentView, setCurrentView }) => {
  const { user, logout, currentLang, updateLanguage } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const roleEmoji = {
    patient: '👵 Patient',
    healthcare_worker: '👩‍⚕️ Doctor / ASHA',
    doctor: '👨‍⚕️ Doctor',
    caregiver: '👨‍👩‍👧 Caregiver',
  }[user?.role || 'patient'] || '👵 Patient';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Care Hub', icon: HospitalIcon },
    { id: 'translate', label: 'AI Prescription Translator', icon: TranslateIcon },
    { id: 'medical_vault', label: 'Medical Vault & Records', icon: DocumentIcon },
    { id: 'reminders', label: 'Medication Reminders', icon: ClockIcon },
    { id: 'emergency', label: 'Emergency Help (108)', icon: PhoneIcon },
    { id: 'profile', label: 'Profile & ABHA Health ID', icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-stone-200 py-3 px-4 md:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setCurrentView('dashboard')}
        >
          <div className="w-9 h-9 bg-teal-700 text-white rounded-xl flex items-center justify-center relative shadow-sm">
            <HospitalIcon size={20} color="#ffffff" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#fdfbf7] animate-pulse"></span>
          </div>
          <div>
            <span className="font-heading font-extrabold text-base text-stone-900 tracking-tight block leading-none">
              Swasthya Sanchar
            </span>
            <span className="text-[9px] font-extrabold text-teal-700 tracking-wider uppercase block mt-1">
              AI HEALTHCARE PORTAL
            </span>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* ABHA Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full text-[11px] font-bold text-teal-800">
            <ShieldIcon size={14} color="#0f766e" />
            <span>ABHA: {user?.profile?.abha_number || 'VERIFIED'}</span>
          </div>

          {/* Language Selector */}
          <select
            className="bg-white border border-stone-200 text-stone-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer outline-none hover:border-teal-700"
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

          {/* Hamburger Side Menu Button (3 Lines ☰) */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="bg-stone-100 hover:bg-stone-200 border border-stone-200 p-2 rounded-xl text-stone-800 cursor-pointer flex items-center gap-1 font-bold text-xs shadow-xs"
            aria-label="Open Navigation Menu"
          >
            <MenuIcon size={20} />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </div>

      {/* 🍔 HAMBURGER SIDE DRAWER MODAL */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end">
          {/* Solid Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Solid White Side Drawer Container */}
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
                PORTAL NAVIGATION
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

            {/* Footer Sign Out */}
            <div className="pt-6 border-t border-stone-200">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                  setCurrentView('landing');
                }}
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
