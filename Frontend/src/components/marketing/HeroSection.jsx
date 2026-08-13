import React from 'react';
import { ArrowRightIcon, PlayIcon, CheckIcon, DocumentIcon, BrainIcon, TranslateIcon, SpeakerIcon, HeartIcon } from '../../shared/icons/Icons';
import { ROUTES, navigateTo } from '../../utils/routes';

export const HeroSection = ({ onNavigate }) => {
  const handlePrimary = () => {
    if (onNavigate) onNavigate(ROUTES.AUTH.REGISTER);
    else navigateTo(ROUTES.AUTH.REGISTER);
  };

  const handleSecondary = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-20 font-sans transition-colors">
      <div className="text-center max-w-4xl mx-auto mb-14">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2.5 bg-[#F0FDF4] dark:bg-teal-950/60 border border-[#bbf7d0] dark:border-teal-800/80 px-4.5 py-2 rounded-full text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-300 tracking-wide mb-8 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E] dark:bg-teal-400 animate-pulse" />
          <span>AI-POWERED HEALTHCARE COMMUNICATION FOR RURAL COMMUNITIES</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C1917] dark:text-white tracking-tight leading-[1.12] mb-8">
          Every patient deserves to understand their own{' '}
          <span className="text-[#0F766E] dark:text-teal-400 italic font-accent-serif font-normal">prescription.</span>
        </h1>

        {/* Supporting text */}
        <p className="text-lg sm:text-xl text-stone-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
          Complex medical instructions should not become a barrier to safe healthcare.
          Swasthya Sanchar AI helps transform prescriptions, medical documents and healthcare instructions into simpler, regional-language explanations with voice assistance.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={handlePrimary}
            className="w-full sm:w-auto bg-[#0B4F42] hover:bg-[#07362d] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
          >
            <span>Try Swasthya Sanchar</span>
            <ArrowRightIcon size={18} color="#fff" />
          </button>

          <button
            onClick={handleSecondary}
            className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-stone-50 dark:hover:bg-slate-700 border border-stone-300 dark:border-slate-700 text-stone-800 dark:text-slate-200 font-bold text-base px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
          >
            <PlayIcon size={16} className="text-[#0B4F42] dark:text-teal-400" />
            <span>See How It Works</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-semibold text-stone-700 dark:text-slate-200">
          <span className="flex items-center gap-2 bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 px-4 py-2 rounded-full shadow-xs">
            <CheckIcon size={16} color="#15803d" /> Safety-Focused AI Design
          </span>
          <span className="flex items-center gap-2 bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 px-4 py-2 rounded-full shadow-xs">
            <CheckIcon size={16} color="#15803d" /> Human Verification Supported
          </span>
          <span className="flex items-center gap-2 bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 px-4 py-2 rounded-full shadow-xs">
            <CheckIcon size={16} color="#15803d" /> Multilingual Support (22+ Languages)
          </span>
          <span className="flex items-center gap-2 bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 px-4 py-2 rounded-full shadow-xs">
            <CheckIcon size={16} color="#15803d" /> Voice-First Accessibility
          </span>
        </div>
      </div>

      {/* Hero Visual Product Flow Diagram */}
      <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl max-w-5xl mx-auto transition-colors">
        <div className="text-center text-xs sm:text-sm font-extrabold text-[#0F766E] dark:text-teal-400 uppercase tracking-widest mb-8">
          INTELLIGENT HEALTHCARE COMMUNICATION PIPELINE
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
          <div className="bg-[#FDFBF7] dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 p-5 rounded-2xl text-center space-y-2.5 transition-colors">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/60 text-[#0F766E] dark:text-teal-300 rounded-xl flex items-center justify-center mx-auto font-bold">
              <DocumentIcon size={22} color="#0F766E" />
            </div>
            <div className="text-sm font-extrabold text-stone-900 dark:text-white">Doctor Rx</div>
            <div className="text-xs text-stone-500 dark:text-slate-400">Unclear Doctor Note</div>
          </div>

          <div className="bg-[#FDFBF7] dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 p-5 rounded-2xl text-center space-y-2.5 transition-colors">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-xl flex items-center justify-center mx-auto font-bold">
              <BrainIcon size={22} color="#1d4ed8" />
            </div>
            <div className="text-sm font-extrabold text-stone-900 dark:text-white">AI Extraction</div>
            <div className="text-xs text-stone-500 dark:text-slate-400">Dosage & Frequency</div>
          </div>

          <div className="bg-[#FDFBF7] dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 p-5 rounded-2xl text-center space-y-2.5 transition-colors">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center justify-center mx-auto font-bold">
              <HeartIcon size={22} color="#15803d" />
            </div>
            <div className="text-sm font-extrabold text-stone-900 dark:text-white">Simplification</div>
            <div className="text-xs text-stone-500 dark:text-slate-400">Easy Instructions</div>
          </div>

          <div className="bg-[#FDFBF7] dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 p-5 rounded-2xl text-center space-y-2.5 transition-colors">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 rounded-xl flex items-center justify-center mx-auto font-bold">
              <TranslateIcon size={22} color="#7e22ce" />
            </div>
            <div className="text-sm font-extrabold text-stone-900 dark:text-white">Regional Translation</div>
            <div className="text-xs text-stone-500 dark:text-slate-400">Hindi, Kannada, etc.</div>
          </div>

          <div className="bg-[#FDFBF7] dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 p-5 rounded-2xl text-center space-y-2.5 transition-colors">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/60 text-[#EA580C] dark:text-orange-300 rounded-xl flex items-center justify-center mx-auto font-bold">
              <SpeakerIcon size={22} color="#EA580C" />
            </div>
            <div className="text-sm font-extrabold text-stone-900 dark:text-white">Voice Guidance</div>
            <div className="text-xs text-stone-500 dark:text-slate-400">Spoken Audio Playback</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
