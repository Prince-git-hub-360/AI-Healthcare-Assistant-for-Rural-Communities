import React from 'react';
import { ArrowRightIcon, PlayIcon } from '../../shared/icons/Icons';
import { ROUTES, navigateTo } from '../../utils/routes';

export const FinalCTA = ({ onNavigate }) => {
  const handlePrimary = () => {
    if (onNavigate) onNavigate(ROUTES.AUTH.REGISTER);
    else navigateTo(ROUTES.AUTH.REGISTER);
  };

  const handleSecondary = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 font-sans transition-colors">
      <div className="bg-[#0B4F42] dark:bg-slate-900 border border-teal-800/40 dark:border-slate-800 text-white rounded-3xl p-10 sm:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-5 relative z-10">
          <span className="bg-teal-600/60 dark:bg-teal-950/80 border border-teal-400/40 dark:border-teal-800 text-teal-100 text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
            START USING SWASTHYA SANCHAR AI
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Healthcare shouldn't be difficult to understand.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-teal-100/95 dark:text-slate-300 leading-relaxed">
            Let's make every prescription clearer and every healthcare instruction more accessible to rural communities.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
          <button
            onClick={handlePrimary}
            className="w-full sm:w-auto bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRightIcon size={18} color="#fff" />
          </button>

          <button
            onClick={handleSecondary}
            className="w-full sm:w-auto bg-teal-800/80 dark:bg-slate-800 hover:bg-teal-800 dark:hover:bg-slate-700 text-teal-100 dark:text-white border border-teal-500/50 dark:border-slate-700 font-bold text-base px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
          >
            <PlayIcon size={16} className="text-teal-400" />
            <span>Explore How It Works</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
