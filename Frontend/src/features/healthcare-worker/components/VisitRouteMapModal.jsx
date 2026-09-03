import React from 'react';
import { HospitalIcon, CheckIcon, ClockIcon } from '../../../shared/icons/Icons';

export const VisitRouteMapModal = ({ isOpen, onClose, showToast }) => {
  if (!isOpen) return null;

  const waypoints = [
    { id: 1, step: '08:30 AM', name: 'Sister Sunita Bai (ASHA Home)', desc: 'Start point with doorstep medical kit', status: 'completed', distance: '0.0 km' },
    { id: 2, step: '09:00 AM', name: 'Lakshmi Devi (House #14)', desc: 'Stage-2 BP Follow-up & Low Salt Counseling', status: 'current', distance: '0.8 km' },
    { id: 3, step: '10:00 AM', name: 'Ravi Kumar (House #42)', desc: 'Jan Aushadhi Metformin 500mg Delivery', status: 'pending', distance: '1.2 km' },
    { id: 4, step: '11:00 AM', name: 'Meena Devi (House #88)', desc: '32-Week ANC IFA Red Tablets Verification', status: 'pending', distance: '1.8 km' },
    { id: 5, step: '01:00 PM', name: 'Mandya Primary Health Centre #2', desc: 'Return, upload vitals & report to Dr. Vikram Sharma', status: 'destination', distance: '3.5 km' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full relative shadow-2xl space-y-5 my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
        >
          ✕
        </button>

        <div>
          <div className="text-[10px] font-black uppercase text-[#0B3B74] dark:text-sky-400">
            🗺️ Gejjalagere Sector Field Navigation
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Today's Doorstep Visit Route Plan
          </h2>
          <p className="text-xs text-slate-500">
            Optimized route for 12 households • Total Distance: 7.3 km • Estimated Time: 4.5 Hours
          </p>
        </div>

        {/* Visual Map Graphic Representation */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black text-[#0B3B74] dark:text-sky-300 pb-2 border-b border-slate-200 dark:border-slate-700">
            <span>📍 Route Map: Mandya Catchment #2</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">● Active GPS Tracking</span>
          </div>

          <div className="py-3 space-y-3">
            {waypoints.map((wp, idx) => (
              <div key={wp.id} className="flex items-start gap-3 relative">
                {/* Stepper Dot & Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-xs ${
                    wp.status === 'completed' 
                      ? 'bg-emerald-600' 
                      : wp.status === 'current' 
                        ? 'bg-[#0B3B74] ring-4 ring-blue-200' 
                        : 'bg-slate-400'
                  }`}>
                    {wp.status === 'completed' ? '✓' : idx + 1}
                  </div>
                  {idx < waypoints.length - 1 && (
                    <div className="w-0.5 h-7 bg-slate-300 dark:bg-slate-700 my-1" />
                  )}
                </div>

                <div className="flex-1 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">{wp.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{wp.distance}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{wp.desc}</div>
                  <div className="text-[9px] font-bold text-[#0B3B74] dark:text-sky-400 mt-1">⏰ Estimated: {wp.step}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (showToast) showToast('🗺️ GPS Turn-by-Turn Navigation Started for Lakshmi Devi (House #14)!', 'success');
              onClose();
            }}
            className="flex-1 bg-[#0B3B74] hover:bg-[#072448] text-white font-black text-xs py-3 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🚀 Start Turn-by-Turn GPS Navigation</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-4 py-3 rounded-2xl cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default VisitRouteMapModal;
