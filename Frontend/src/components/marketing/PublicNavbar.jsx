import React, { useState, useEffect } from 'react';
import { HospitalIcon, MenuIcon, CloseIcon, UserIcon, ArrowRightIcon } from '../../shared/icons/Icons';
import { useAuth, LANGUAGES } from '../../shared/context/AuthContext';
import { ROUTES, navigateTo } from '../../utils/routes';

export const PublicNavbar = ({ onNavigate }) => {
  const { currentLang, updateLanguage } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const navLinks = [
    { label: 'Home', sectionId: 'home' },
    { label: 'How It Works', sectionId: 'how-it-works' },
    { label: 'Solutions', sectionId: 'solutions' },
    { label: 'AI Technology', sectionId: 'ai-technology' },
    { label: 'For Patients', sectionId: 'patients' },
    { label: 'For ASHA Workers', sectionId: 'asha-workers' },
    { label: 'For Doctors', sectionId: 'doctors' },
    { label: 'About', sectionId: 'about' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'shadow-sm bg-[#FDFBF7]/95 backdrop-blur-md' : 'bg-[#FDFBF7]'} border-b border-[#E7E5E4]`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between">
        {/* LEFT: Brand Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'home')}
        >
          <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm">
            <HospitalIcon size={20} color="#fff" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-base text-[#1C1917] tracking-tight leading-none">
              Swasthya Sanchar AI
            </div>
            <div className="text-[10px] font-bold text-[#0F766E] tracking-wider uppercase mt-0.5">
              Rural Healthcare Assistant
            </div>
          </div>
        </div>

        {/* CENTER: Marketing Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-bold">
          {navLinks.map((link) => {
            const isActive = activeSection === link.sectionId;
            return (
              <button
                key={link.sectionId}
                onClick={() => handleNav(ROUTES.PUBLIC.HOME, link.sectionId)}
                className={`transition-colors cursor-pointer ${
                  isActive ? 'text-[#0F766E] font-extrabold border-b-2 border-[#0F766E] pb-0.5' : 'text-stone-600 hover:text-[#0F766E]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Language Selector & Auth CTAs */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white border border-[#E7E5E4] rounded-xl px-2.5 py-1 text-xs">
            <select
              value={currentLang}
              onChange={(e) => updateLanguage(e.target.value)}
              className="bg-transparent font-semibold text-stone-800 outline-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Login Button (Secondary CTA) */}
          <button 
            onClick={() => handleNav(ROUTES.AUTH.LOGIN)} 
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-stone-800 hover:text-[#0F766E] hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200"
          >
            <UserIcon size={16} color="#0F766E" />
            <span>Login</span>
          </button>

          {/* Get Started Button (Primary CTA - Warm Coral) */}
          <button 
            onClick={() => handleNav(ROUTES.AUTH.REGISTER)} 
            className="inline-flex items-center gap-1.5 bg-[#EA580C] hover:bg-[#cc4f0b] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRightIcon size={14} color="#fff" />
          </button>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 bg-white rounded-xl border border-[#E7E5E4] text-stone-800 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE RESPONSIVE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E7E5E4] p-5 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.sectionId}
              onClick={() => handleNav(ROUTES.PUBLIC.HOME, link.sectionId)}
              className="w-full text-left font-bold text-xs text-stone-800 py-2 border-b border-stone-100"
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 flex flex-col gap-2">
            <button 
              onClick={() => handleNav(ROUTES.AUTH.LOGIN)} 
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-900 py-2.5 rounded-xl font-bold text-xs text-center border border-stone-300"
            >
              Sign In
            </button>
            <button 
              onClick={() => handleNav(ROUTES.AUTH.REGISTER)} 
              className="w-full bg-[#EA580C] hover:bg-[#cc4f0b] text-white py-2.5 rounded-xl font-bold text-xs text-center shadow-md"
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
