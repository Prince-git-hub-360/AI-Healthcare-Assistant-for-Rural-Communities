import React, { useState } from 'react';
import { CloseIcon, QrCodeIcon, SearchIcon, ShieldIcon } from '../../../shared/icons/Icons';

export const AbhaScannerModal = ({ isOpen, onClose, onSelectAbha }) => {
  const [abhaInput, setAbhaInput] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (abhaInput.trim()) {
      onSelectAbha(abhaInput.trim());
      onClose();
    }
  };

  const handleSampleClick = (sampleId) => {
    onSelectAbha(sampleId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in font-sans">
      <div className="bg-white dark:bg-[#131b2c] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-[#0B4F42] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center text-lg font-bold">
              📷
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wide uppercase">ABHA Patient Scanner</h3>
              <p className="text-[10px] text-sky-200">Scan QR or enter 14-digit Ayushman ABHA ID</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Scanner / QR viewfinder simulation */}
          <div className="relative bg-slate-950 rounded-2xl p-6 border-2 border-sky-500/50 flex flex-col items-center justify-center text-center overflow-hidden min-h-[180px]">
            {/* Animated Laser Scanning Line */}
            <div className="absolute inset-x-4 h-0.5 bg-sky-400 shadow-[0_0_12px_#38bdf8] animate-bounce top-1/2 -translate-y-1/2 pointer-events-none" />
            
            {/* Viewfinder Target Box */}
            <div className="w-36 h-36 border-2 border-dashed border-sky-400/80 rounded-2xl flex flex-col items-center justify-center p-2 relative bg-sky-950/20 backdrop-blur-[1px]">
              <QrCodeIcon size={72} className="text-sky-300/70 animate-pulse" />
              <span className="text-[9px] font-black text-sky-300 uppercase tracking-widest mt-1">
                Aim at ABHA Card
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-medium mt-3">
              Point camera at patient's ABDM Digital Health Card QR code
            </p>
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Or Enter 14-Digit ABHA ID / Patient Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={abhaInput}
                onChange={(e) => setAbhaInput(e.target.value)}
                placeholder="e.g. 91-4820-9921-7740 or Prince Kumar"
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-2xl py-3 pl-4 pr-12 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
              />
              <button
                type="submit"
                disabled={!abhaInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer"
              >
                <SearchIcon size={16} />
              </button>
            </div>
          </form>

          {/* Quick Demo Sample Patients */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              ⚡ Quick Demo Sample Patients:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSampleClick('91-4820-9921-7740')}
                className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600">
                  Prince Kumar (19y)
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  91-4820-9921-7740
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSampleClick('91-3310-8812-4011')}
                className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600">
                  Lakshmi Devi (58y)
                </div>
                <div className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">
                  91-3310-8812-4011 (Diabetes)
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AbhaScannerModal;
