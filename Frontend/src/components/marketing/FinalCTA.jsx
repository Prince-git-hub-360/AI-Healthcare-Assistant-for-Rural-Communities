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
    <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16">
      <div className="bg-[#0F766E] text-white rounded-3xl p-8 md:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="bg-teal-600/60 border border-teal-400/40 text-teal-200 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            START USING SWASTHYA SANCHAR AI
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Healthcare shouldn't be difficult to understand.
          </h2>
          <p className="text-sm md:text-base text-teal-100/90 leading-relaxed">
            Let's make every prescription clearer and every healthcare instruction more accessible to rural communities.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
          <button
            onClick={handlePrimary}
            className="w-full sm:w-auto bg-[#EA580C] hover:bg-[#cc4f0b] text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRightIcon size={18} color="#fff" />
          </button>

          <button
            onClick={handleSecondary}
            className="w-full sm:w-auto bg-teal-800/80 hover:bg-teal-800 text-teal-100 border border-teal-600 font-bold text-sm px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlayIcon size={16} color="#2dd4bf" />
            <span>Explore How It Works</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
