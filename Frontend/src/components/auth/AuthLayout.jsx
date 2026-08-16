import React from 'react';
import { PublicNavbar } from '../marketing/PublicNavbar';
import { HospitalIcon, CheckIcon, ShieldIcon } from '../../shared/icons/Icons';

export const AuthLayout = ({ children, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <PublicNavbar onNavigate={onNavigate} />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl bg-white dark:bg-[#161F30] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* DESKTOP 40% BRAND SIDE PANEL (Hidden on Mobile) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#042F2E] via-[#0B4F42] to-[#0F766E] text-white p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                  <HospitalIcon size={22} color="#2dd4bf" />
                </div>
                <span className="font-display font-extrabold text-xl text-white tracking-tight">
                  Swasthya Sanchar <span className="text-teal-300 font-normal">AI</span>
                </span>
              </div>

              <h3 className="font-display text-2xl font-extrabold tracking-tight leading-snug pt-2">
                Healthcare communication made easier to understand.
              </h3>

              <p className="text-xs text-teal-100/80 leading-relaxed">
                Bridging prescription literacy and language barriers across rural India with Groq-accelerated AI and spoken voice guidance.
              </p>
            </div>

            <div className="space-y-3 relative z-10 pt-6 border-t border-teal-700/50">
              {[
                '22+ Regional Languages with Native Voice TTS',
                '99% Accurate Optical Prescription Extraction',
                '5-Day Visual Pillbox & Caregiver Reminders',
                'ABHA Digital Health Card & Record Vault',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-teal-100 font-semibold">
                  <span className="w-4 h-4 rounded-full bg-teal-500/30 text-teal-300 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-teal-300/70 pt-4 flex items-center gap-1.5 relative z-10">
              <ShieldIcon size={14} className="text-teal-400" />
              <span>HIPAA & ABHA Compliant Healthcare Platform</span>
            </div>
          </div>

          {/* RIGHT 60% FORM CONTENT CONTAINER */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white dark:bg-[#161F30]">
            {children}
          </div>

        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
