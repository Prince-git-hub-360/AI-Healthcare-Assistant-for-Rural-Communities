import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';

export const CaregiverDashboardPage = ({ setCurrentView }) => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-extrabold text-stone-900 tracking-tight mb-2">
          Caregiver Family Adherence Hub
        </h2>
        <p className="text-xs text-stone-600 mb-6">
          Monitoring medication compliance for registered family members.
        </p>

        <div className="bg-teal-50 border border-teal-200 p-6 rounded-2xl text-stone-900 mb-4">
          <div className="font-bold text-sm text-teal-900 mb-1">👴 Patient: Ramesh Kumar (Father)</div>
          <div className="text-xs text-stone-700">Today's Adherence: 2 of 3 doses taken (66%)</div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboardPage;
