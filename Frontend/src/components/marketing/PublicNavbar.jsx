import React, { useState, useEffect, useRef } from 'react';
import { HospitalIcon, MenuIcon, CloseIcon, UserIcon, ArrowRightIcon, ChevronDownIcon } from '../../shared/icons/Icons';
import { ROUTES, navigateTo } from '../../utils/routes';
import { useAuth } from '../../shared/context/AuthContext';

export const PublicNavbar = ({ onNavigate }) => {
  const { theme, toggleTheme } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [solutionsMobileOpen, setSolutionsMobileOpen] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSolutionsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // IntersectionObserver for active section highlighting
  useEffect(() => {
    const sectionIds = [
      'home', 'problem', 'solutions', 'how-it-works', 'prescription-demo',
      'difference', 'ai-technology', 'patients', 'asha-workers', 'doctors',
      'safety', 'faq', 'about'
    ];

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNav = (targetPath, sectionId) => {
    setMobileMenuOpen(false);
    setSolutionsDropdownOpen(false);
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(sectionId);
        return;
      }
    }

    if (onNavigate) {
      onNavigate(targetPath, sectionId);
    } else {
      navigateTo(targetPath);
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const solutionItems = [
    { label: 'For Patients', sectionId: 'patients', icon: '👤', desc: 'Prescriptions, Audio & Reminders' },
    { label: 'For ASHA Workers', sectionId: 'asha-workers', icon: '👩‍⚕️', desc: 'Village Patient Registry & Visits' },
    { label: 'For Doctors', sectionId: 'doctors', icon: '🩺', desc: 'Digital Consultations & Records' },
  ];

  const isSolutionsActive = ['solutions', 'patients', 'asha-workers', 'doctors'].includes(activeSection);

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-200 font-sans ${scrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-slate-800/80 shadow-xs' : 'bg-white dark:bg-slate-900 border-b border-stone-200/80 dark:border-slate-800/80'}`}>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* LEFT: Brand Logo & Title */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer" 
          onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'home')}
        >
          <div className="w-8 h-8 rounded-lg bg-[#0B4F42] flex items-center justify-center text-white shadow-xs flex-shrink-0">
            <HospitalIcon size={18} color="#fff" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-sm sm:text-base text-stone-900 dark:text-white tracking-tight block leading-none">
              Swasthya Sanchar
            </span>
            <span className="text-[10px] font-semibold text-[#0B4F42] dark:text-teal-400 tracking-wider uppercase block mt-0.5">
              Rural Healthcare Assistant
            </span>
          </div>
        </div>

        {/* CENTER: Compact Startup Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-stone-700 dark:text-slate-200">
          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'home')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'home'
                ? 'text-[#0B4F42] dark:text-teal-300 font-bold border-b-2 border-[#0B4F42] dark:border-teal-400'
                : 'hover:text-[#0B4F42] dark:hover:text-teal-300'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'how-it-works')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'how-it-works'
                ? 'text-[#0B4F42] dark:text-teal-300 font-bold border-b-2 border-[#0B4F42] dark:border-teal-400'
                : 'hover:text-[#0B4F42] dark:hover:text-teal-300'
            }`}
          >
            How It Works
          </button>

          {/* Solutions Dropdown Trigger */}
          <div 
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setSolutionsDropdownOpen(true)}
            onMouseLeave={() => setSolutionsDropdownOpen(false)}
          >
            <button
              onClick={() => {
                setSolutionsDropdownOpen(!solutionsDropdownOpen);
                handleNav(ROUTES.PUBLIC.HOME, 'solutions');
              }}
              className={`flex items-center gap-1 transition-colors cursor-pointer py-1 ${
                isSolutionsActive
                  ? 'text-[#0B4F42] dark:text-teal-300 font-bold border-b-2 border-[#0B4F42] dark:border-teal-400'
                  : 'hover:text-[#0B4F42] dark:hover:text-teal-300'
              }`}
            >
              <span>Solutions</span>
              <ChevronDownIcon size={12} className={`transition-transform duration-200 ${solutionsDropdownOpen ? 'rotate-180 text-[#0B4F42] dark:text-teal-300' : ''}`} />
            </button>

            {/* Dropdown Floating Card */}
            {solutionsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-[#161F30] border border-stone-200/80 dark:border-slate-800 rounded-xl shadow-xl p-1.5 space-y-0.5 z-50">
                {solutionItems.map((item) => (
                  <button
                    key={item.sectionId}
                    onClick={() => handleNav(ROUTES.PUBLIC.HOME, item.sectionId)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-stone-50 dark:hover:bg-slate-800 flex items-start gap-2.5 transition-colors cursor-pointer group"
                  >
                    <span className="text-sm shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-stone-900 dark:text-white group-hover:text-[#0B4F42] dark:group-hover:text-teal-300">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-slate-400 leading-tight">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'ai-technology')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'ai-technology'
                ? 'text-[#0B4F42] dark:text-teal-300 font-bold border-b-2 border-[#0B4F42] dark:border-teal-400'
                : 'hover:text-[#0B4F42] dark:hover:text-teal-300'
            }`}
          >
            AI Technology
          </button>

          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'about')}
            className={`transition-colors cursor-pointer py-1 ${
              activeSection === 'about'
                ? 'text-[#0B4F42] dark:text-teal-300 font-bold border-b-2 border-[#0B4F42] dark:border-teal-400'
                : 'hover:text-[#0B4F42] dark:hover:text-teal-300'
            }`}
          >
            About
          </button>
        </nav>

        {/* RIGHT: Auth & Theme CTAs */}
        <div className="flex items-center gap-2">
          {/* 1-Tap Landing Page Theme Toggle */}
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

          {/* Login Button (Secondary CTA) */}
          <button 
            onClick={() => handleNav(ROUTES.AUTH.LOGIN)} 
            className="hidden md:inline-flex items-center gap-1.5 border border-stone-300 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-200 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <UserIcon size={14} className="text-[#0B4F42] dark:text-teal-400" />
            <span>Login</span>
          </button>

          {/* Get Started Button (Primary CTA) */}
          <button 
            onClick={() => handleNav(ROUTES.AUTH.REGISTER)} 
            className="inline-flex items-center gap-1.5 bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-medium px-4 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRightIcon size={13} color="#fff" />
          </button>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 rounded-lg text-stone-700 dark:text-slate-300 cursor-pointer text-xs"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE RESPONSIVE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-stone-200 dark:border-slate-800 p-4 space-y-2 shadow-2xl transition-colors">
          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'home')}
            className="w-full text-left font-semibold text-xs text-stone-800 dark:text-slate-200 py-2 border-b border-stone-100 dark:border-slate-800"
          >
            Home
          </button>

          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'how-it-works')}
            className="w-full text-left font-semibold text-xs text-stone-800 dark:text-slate-200 py-2 border-b border-stone-100 dark:border-slate-800"
          >
            How It Works
          </button>

          {/* Mobile Solutions Collapsible Sub-menu */}
          <div className="border-b border-stone-100 dark:border-slate-800 py-1 space-y-1">
            <button
              onClick={() => setSolutionsMobileOpen(!solutionsMobileOpen)}
              className="w-full flex items-center justify-between font-semibold text-xs text-stone-800 dark:text-slate-200 py-1"
            >
              <span className="text-[#0B4F42] dark:text-teal-400">Solutions</span>
              <ChevronDownIcon size={12} className={`transition-transform duration-200 ${solutionsMobileOpen ? 'rotate-180' : ''}`} />
            </button>

            {solutionsMobileOpen && (
              <div className="pl-3 space-y-1 pt-1">
                {solutionItems.map((item) => (
                  <button
                    key={item.sectionId}
                    onClick={() => handleNav(ROUTES.PUBLIC.HOME, item.sectionId)}
                    className="w-full text-left text-xs font-normal text-stone-600 dark:text-slate-400 hover:text-[#0B4F42] dark:hover:text-teal-300 py-1.5 flex items-center gap-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'ai-technology')}
            className="w-full text-left font-semibold text-xs text-stone-800 dark:text-slate-200 py-2 border-b border-stone-100 dark:border-slate-800"
          >
            AI Technology
          </button>

          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'about')}
            className="w-full text-left font-semibold text-xs text-stone-800 dark:text-slate-200 py-2 border-b border-stone-100 dark:border-slate-800"
          >
            About
          </button>

          <div className="pt-2 flex flex-col gap-2">
            <button 
              onClick={() => handleNav(ROUTES.AUTH.LOGIN)} 
              className="w-full bg-stone-50 dark:bg-slate-800 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-800 dark:text-slate-200 py-2 rounded-lg font-semibold text-xs text-center border border-stone-200 dark:border-slate-700 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => handleNav(ROUTES.AUTH.REGISTER)} 
              className="w-full bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white py-2 rounded-lg font-medium text-xs text-center shadow-xs transition-colors"
            >
              Get Started Free →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
