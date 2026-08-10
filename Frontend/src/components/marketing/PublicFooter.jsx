import React from 'react';
import { HospitalIcon } from '../../shared/icons/Icons';
import { ROUTES, navigateTo } from '../../utils/routes';

export const PublicFooter = ({ onNavigate }) => {
  const handleNav = (targetPath, sectionId) => {
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <footer className="bg-stone-950 text-stone-400 py-12 px-4 md:px-8 border-t border-stone-800 font-sans text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* BRAND COLUMN */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'home')}>
            <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white">
              <HospitalIcon size={18} color="#fff" />
            </div>
            <span className="font-extrabold text-white text-base">Swasthya Sanchar AI</span>
          </div>
          <p className="text-stone-400 text-xs leading-relaxed">
            AI-powered healthcare communication assistant for rural and underserved communities.
          </p>
        </div>

        {/* COLUMN 1: PRODUCT */}
        <div>
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-3">Product</h4>
          <ul className="space-y-2">
            <li><button onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'patients')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">For Patients</button></li>
            <li><button onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'asha-workers')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">For ASHA Workers</button></li>
            <li><button onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'doctors')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">For Doctors</button></li>
            <li><button onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'solutions')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">For Caregivers</button></li>
          </ul>
        </div>

        {/* COLUMN 2: TECHNOLOGY */}
        <div>
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-3">Technology</h4>
          <ul className="space-y-2">
            <li><button onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'ai-technology')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">OCR & Medical NLP</button></li>
            <li><button onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'ai-technology')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">LLM Simplification</button></li>
            <li><button onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'ai-technology')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">Multilingual Voice</button></li>
            <li><button onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'safety')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">Responsible AI</button></li>
          </ul>
        </div>

        {/* COLUMN 3: COMPANY & SAFETY */}
        <div>
          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-3">Company & Safety</h4>
          <ul className="space-y-2">
            <li><button onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'about')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">About Us</button></li>
            <li><button onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'safety')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">Safety & Disclaimers</button></li>
            <li><button onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'safety')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">Privacy Safeguards</button></li>
            <li><button onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'about')} className="hover:text-teal-400 transition-colors text-left cursor-pointer">Contact Team</button></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-stone-500 text-[11px]">
        <div>© 2026 Swasthya Sanchar AI. Built for Rural Healthcare Communication.</div>
        <div>Team Change_The_World • PES University</div>
      </div>
    </footer>
  );
};

export default PublicFooter;
