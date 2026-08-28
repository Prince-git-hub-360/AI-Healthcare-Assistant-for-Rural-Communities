import React, { useState, useEffect } from 'react';
import { PhoneIcon, ShieldIcon, AlertIcon, CheckIcon, MapPinIcon, HospitalIcon, PillIcon } from '../../../../shared/icons/Icons';
import { api } from '../../../../services/api';

export const EmergencyPatientCardPage = () => {
  const [token, setToken] = useState('');
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extract token from URL path e.g. /emergency-card/:token/
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const tokenVal = pathParts[pathParts.length - 1];
    setToken(tokenVal);

    if (tokenVal && tokenVal !== 'emergency-card') {
      fetchEmergencyCard(tokenVal);
    } else {
      setLoading(false);
      setError('Invalid or missing emergency session token.');
    }
  }, []);

  const fetchEmergencyCard = async (tokenVal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getEmergencySessionCard(tokenVal);
      if (res && res.patient_summary) {
        setCardData(res);
      } else {
        setError(res?.message || 'This emergency session has expired or been revoked.');
      }
    } catch {
      setError('Emergency session token is expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-extrabold text-sm tracking-wide">Retrieving Consented Emergency Summary Card...</p>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans text-center">
        <div className="w-16 h-16 bg-rose-900/60 text-rose-400 rounded-full flex items-center justify-center mb-4">
          <AlertIcon size={32} />
        </div>
        <h1 className="text-xl font-black mb-2 text-rose-200">Emergency Link Expired or Invalid</h1>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          {error || 'This 2-hour temporary location sharing link has expired or was revoked by the patient.'}
        </p>
        <a
          href="tel:112"
          className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <PhoneIcon size={18} color="#ffffff" />
          <span>Call 112 National Emergency Hotline</span>
        </a>
      </div>
    );
  }

  const { patient_summary, current_medications, live_location, emergency_type } = cardData;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* TOP STATUS BAR */}
        <div className="bg-rose-900/40 border border-rose-600/60 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shrink-0 font-black text-xl shadow-md">
              🚨
            </div>
            <div>
              <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                TEMPORARY EMERGENCY SUMMARY CARD
              </span>
              <h1 className="text-lg font-black text-white mt-1">{emergency_type}</h1>
            </div>
          </div>

          <a
            href="tel:108"
            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
          >
            <PhoneIcon size={18} color="#ffffff" />
            <span>Call 108 Ambulance</span>
          </a>
        </div>

        {/* PATIENT VITAL SUMMARY CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">{patient_summary.name}</h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                {patient_summary.age} Yrs • {patient_summary.gender} • Language: {patient_summary.preferred_language?.toUpperCase()}
              </p>
            </div>
            <div className="bg-rose-950 border border-rose-600/80 px-4 py-2 rounded-2xl text-center">
              <span className="text-[9px] font-bold text-rose-400 block uppercase tracking-wider">BLOOD GROUP</span>
              <span className="text-2xl font-black text-rose-400">{patient_summary.blood_group || 'O+'}</span>
            </div>
          </div>

          {/* VITAL MEDICAL ALERT TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                ⚠️ KNOWN ALLERGIES
              </span>
              <p className="text-xs font-bold text-slate-200">{patient_summary.allergies}</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                🩺 CHRONIC CONDITIONS
              </span>
              <p className="text-xs font-bold text-slate-200">{patient_summary.chronic_conditions}</p>
            </div>
          </div>

          {/* ACTIVE PRESCRIBED MEDICATIONS */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <PillIcon size={16} className="text-teal-400" />
              <span>Current Prescribed Medications</span>
            </h3>

            {current_medications && current_medications.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {current_medications.map((med, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-white block">{med.name}</span>
                      <span className="text-[11px] text-slate-400">{med.dosage}</span>
                    </div>
                    <span className="bg-teal-950 text-teal-300 border border-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {med.frequency}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No active prescriptions listed in patient records.</p>
            )}
          </div>

          {/* EMERGENCY CONTACT DETAILS */}
          <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                🚨 EMERGENCY CONTACT
              </span>
              <span className="text-sm font-extrabold text-white block mt-0.5">
                {patient_summary.emergency_contact_name || 'Primary Emergency Contact'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {patient_summary.emergency_contact_phone || '+91 9876543210'}
              </span>
            </div>

            {patient_summary.emergency_contact_phone && (
              <a
                href={`tel:${patient_summary.emergency_contact_phone}`}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0"
              >
                <PhoneIcon size={16} color="#ffffff" />
                <span>Call Contact</span>
              </a>
            )}
          </div>

          {/* LIVE GPS PIN INFORMATION */}
          {live_location && (
            <div className="bg-teal-950/40 border border-teal-800/80 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-teal-300 flex items-center gap-1">
                  <MapPinIcon size={16} />
                  <span>Consented Patient Geolocation Pin</span>
                </span>
                <span className="text-[10px] text-teal-400 font-mono">
                  Lat: {live_location.latitude}, Long: {live_location.longitude}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{live_location.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${live_location.latitude},${live_location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 hover:text-white underline pt-1"
              >
                <span>Open in Google Maps / GPS Navigation →</span>
              </a>
            </div>
          )}

          {/* FOOTER SAFETY STATEMENT */}
          <div className="pt-2 text-center text-[10px] text-slate-500 font-medium">
            🔒 Consented Emergency Snapshot • Auto-expires in 2 Hours • Swasthya Sanchar AI Platform
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPatientCardPage;
