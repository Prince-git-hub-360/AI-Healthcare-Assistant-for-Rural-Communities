import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';

export const CaregiverDashboardPage = ({ setCurrentView }) => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 text-stone-900 dark:text-slate-100 transition-colors">
      <div className="bg-white dark:bg-[#161F30] border border-stone-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm transition-colors">
        <h2 className="text-xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-2">
          Caregiver Family Adherence Hub
        </h2>
        <p className="text-xs text-stone-600 dark:text-slate-400 mb-6">
          Monitoring medication compliance for registered family members.
        </p>

        <div className="bg-teal-50 dark:bg-slate-800/80 border border-teal-200 dark:border-slate-700 p-6 rounded-2xl text-stone-900 dark:text-white mb-4">
          <div className="font-bold text-sm text-teal-900 dark:text-teal-300 mb-1">👴 Patient: Ramesh Kumar (Father)</div>
          <div className="text-xs text-stone-700 dark:text-slate-300">Today's Adherence: 2 of 3 doses taken (66%)</div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboardPage;
