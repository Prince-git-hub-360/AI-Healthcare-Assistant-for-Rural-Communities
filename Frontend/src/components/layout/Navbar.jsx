import React, { useState, useEffect } from 'react';
import { useAuth, LANGUAGES } from '../../context/AuthContext';
import { HospitalIcon, ChevronDownIcon, MenuIcon, CloseIcon, ArrowRightIcon } from '../ui/Icons';

export const Navbar = ({ currentView, setCurrentView, openAuthModal }) => {
  const { currentLang, updateLanguage } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    if (currentView !== 'landing') {
      setCurrentView('landing');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled ? 'bg-[#fdfbf7]/95 backdrop-blur-md shadow-md py-3' : 'bg-[#fdfbf7] py-4'
    } border-b border-stone-200 px-4 md:px-10`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo matching emergent.sh screenshot */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => handleNavClick('hero')}
          tabIndex={0}
          role="button"
          aria-label="Swasthya Sanchar AI Home"
        >
          <div className="w-10 h-10 bg-teal-700 text-white rounded-xl flex items-center justify-center relative shadow-sm group-hover:bg-teal-800 transition-all">
            <HospitalIcon size={22} color="#ffffff" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#fdfbf7] animate-pulse"></span>
          </div>
          <div>
            <span className="font-heading font-extrabold text-lg text-stone-900 tracking-tight block leading-none">
              Swasthya Sanchar
            </span>
            <span className="text-[10px] font-extrabold text-teal-700 tracking-wider uppercase block mt-1">
              AI HEALTHCARE
            </span>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Multilingual Selector - Desktop */}
          <select
            className="hidden lg:block bg-white border border-stone-200 text-stone-800 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer hover:border-teal-600 outline-none transition-colors"
            value={currentLang}
            onChange={(e) => updateLanguage(e.target.value)}
            aria-label="Select Language"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name} ({lang.native})
              </option>
            ))}
          </select>

          <button
            onClick={() => openAuthModal('login')}
            className="hidden md:inline-block text-stone-700 hover:text-teal-700 font-semibold text-sm px-3 py-2 cursor-pointer transition-colors"
          >
            Login
          </button>

          {/* SINGLE CORAL CTA BUTTON */}
          <button
            onClick={() => openAuthModal('register')}
            className="hidden sm:inline-flex bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-orange-200 transition-all items-center gap-2 cursor-pointer"
          >
            Get Started Free <ArrowRightIcon size={16} />
          </button>

          {/* Mobile Hamburger Toggle (Visible on screens < 768px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-stone-900 bg-stone-100 hover:bg-stone-200 p-2 rounded-xl border border-stone-200 cursor-pointer flex items-center justify-center"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-stone-200 flex flex-col gap-3 bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-xs font-bold text-stone-600">Select Language:</span>
            <select
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-lg outline-none"
              value={currentLang}
              onChange={(e) => updateLanguage(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openAuthModal('login');
            }}
            className="w-full text-center bg-stone-100 text-stone-800 font-bold py-3 rounded-xl border border-stone-200 text-sm"
          >
            Sign In to Portal
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openAuthModal('register');
            }}
            className="w-full text-center bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md text-sm"
          >
            Get Started Free →
          </button>
        </div>
      )}
    </header>
  );
};
