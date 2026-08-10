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
    <section id="home" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-12 pb-16">
      <div className="text-center max-w-4xl mx-auto mb-12">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 bg-[#F0FDF4] border border-[#bbf7d0] px-4 py-1.5 rounded-full text-xs font-bold text-[#0F766E] tracking-wide mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-pulse" />
          <span>AI-POWERED HEALTHCARE COMMUNICATION FOR RURAL COMMUNITIES</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1C1917] tracking-tight leading-[1.15] mb-6">
          Every patient deserves to understand their own{' '}
          <span className="text-[#0F766E] italic font-serif">prescription.</span>
        </h1>

        {/* Supporting text */}
        <p className="text-base sm:text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Complex medical instructions should not become a barrier to safe healthcare.
          Swasthya Sanchar AI helps transform prescriptions, medical documents and healthcare instructions into simpler, regional-language explanations with voice assistance.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={handlePrimary}
            className="w-full sm:w-auto bg-[#EA580C] hover:bg-[#cc4f0b] text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Try Swasthya Sanchar</span>
            <ArrowRightIcon size={18} color="#fff" />
          </button>

          <button
            onClick={handleSecondary}
            className="w-full sm:w-auto bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold text-sm px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlayIcon size={16} color="#0F766E" />
            <span>See How It Works</span>
          </button>
        </div>

        {/* Trust Indicators (Responsible Wording) */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-stone-600">
          <span className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-full shadow-xs">
            <CheckIcon size={14} color="#15803d" /> Safety-Focused AI Design
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-full shadow-xs">
            <CheckIcon size={14} color="#15803d" /> Human Verification Supported
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-full shadow-xs">
            <CheckIcon size={14} color="#15803d" /> Multilingual Support (22+ Languages)
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-full shadow-xs">
            <CheckIcon size={14} color="#15803d" /> Voice-First Accessibility
          </span>
        </div>
      </div>

      {/* Hero Visual Product Flow Diagram */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-xl max-w-5xl mx-auto">
        <div className="text-center text-xs font-extrabold text-[#0F766E] uppercase tracking-widest mb-6">
          INTELLIGENT HEALTHCARE COMMUNICATION PIPELINE
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 relative">
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center space-y-2">
            <div className="w-10 h-10 bg-teal-100 text-[#0F766E] rounded-xl flex items-center justify-center mx-auto font-bold">
              <DocumentIcon size={20} color="#0F766E" />
            </div>
            <div className="text-xs font-extrabold text-stone-900">Doctor Rx</div>
            <div className="text-[11px] text-stone-500">Unclear Doctor Note</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center space-y-2">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto font-bold">
              <BrainIcon size={20} color="#1d4ed8" />
            </div>
            <div className="text-xs font-extrabold text-stone-900">AI Extraction</div>
            <div className="text-[11px] text-stone-500">Dosage & Frequency</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center space-y-2">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto font-bold">
              <HeartIcon size={20} color="#15803d" />
            </div>
            <div className="text-xs font-extrabold text-stone-900">Simplification</div>
            <div className="text-[11px] text-stone-500">Easy Instructions</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center space-y-2">
            <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mx-auto font-bold">
              <TranslateIcon size={20} color="#7e22ce" />
            </div>
            <div className="text-xs font-extrabold text-stone-900">Regional Translation</div>
            <div className="text-[11px] text-stone-500">Hindi, Kannada, etc.</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center space-y-2">
            <div className="w-10 h-10 bg-orange-100 text-[#EA580C] rounded-xl flex items-center justify-center mx-auto font-bold">
              <SpeakerIcon size={20} color="#EA580C" />
            </div>
            <div className="text-xs font-extrabold text-stone-900">Voice Guidance</div>
            <div className="text-[11px] text-stone-500">Spoken Audio Playback</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
