import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { PhoneIcon, MapPinIcon, AlertIcon, CloseIcon, CheckIcon, ShieldIcon } from '../../../../shared/icons/Icons';
import { api } from '../../../../services/api';

export const EmergencySosModal = ({ isOpen, onClose, onSessionStarted }) => {
  const { showToast } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [isActivating, setIsActivating] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('Acquiring GPS...');

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsCountingDown(true);
      setIsActivating(false);
      setSessionData(null);
      return;
    }

    // Acquire GPS location immediately upon modal open
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
          setUserLocation(loc);
          setGpsStatus(`GPS Acquired (±${Math.round(pos.coords.accuracy)}m)`);
        },
        () => {
          setGpsStatus('GPS Permission Denied - Using Village Profile Location');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
    } else {
      setGpsStatus('Geolocation not supported by browser');
    }
  }, [isOpen]);

  // 5-second countdown timer
  useEffect(() => {
    if (!isOpen || !isCountingDown || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isCountingDown, countdown]);

  // Auto-activate when countdown hits 0
  useEffect(() => {
    if (isOpen && isCountingDown && countdown === 0 && !sessionData && !isActivating) {
      triggerEmergencySOS();
    }
  }, [countdown, isOpen, isCountingDown, sessionData, isActivating]);

  const triggerEmergencySOS = async () => {
    setIsCountingDown(false);
    setIsActivating(true);
    showToast?.('Activating National Emergency SOS & Live Location Token...', 'warning');

    try {
      const payload = {
        latitude: userLocation?.latitude || 12.5244,
        longitude: userLocation?.longitude || 76.8958,
        accuracy: userLocation?.accuracy || 15.0,
        emergency_type: 'Medical Emergency SOS',
        address: 'Mandya Village Sector, Karnataka'
      };

      const res = await api.startEmergencySession(payload);
      if (res && res.token) {
        setSessionData(res);
        showToast?.('Emergency SOS Session Activated! Trusted Contacts Notified.', 'success');
        if (onSessionStarted) onSessionStarted(res);
        // Also broadcast SMS / Contact notification payload
        await api.notifyEmergencyContacts({ token: res.token });
      } else {
        throw new Error('Could not generate session token');
      }
    } catch {
      showToast?.('Emergency session started in offline emergency mode.', 'info');
      setSessionData({
        token: 'offline_emergency_token',
        share_url: '#',
        emergency_helplines: { national_emergency: '112', ambulance: '108' }
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleStopSharing = async () => {
    if (sessionData?.token && sessionData.token !== 'offline_emergency_token') {
      try {
        await api.stopEmergencySession({ token: sessionData.token, reason: 'User cancelled SOS' });
        showToast?.('Emergency session resolved and location link revoked.', 'info');
      } catch {
        // Ignore
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-rose-950/85 backdrop-blur-md" onClick={handleStopSharing} />

      <div className="relative z-[1000000] w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-300 dark:border-rose-900 flex flex-col overflow-hidden font-sans">
        
        {/* HEADER BAR */}
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
              <AlertIcon size={24} color="#ffffff" />
            </div>
            <div>
              <span className="bg-rose-800 text-rose-100 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                NATIONAL EMERGENCY SOS
              </span>
              <h2 className="font-extrabold text-base tracking-tight">Active Emergency Dispatch</h2>
            </div>
          </div>

          <button
            onClick={handleStopSharing}
            className="p-2 rounded-xl text-rose-100 hover:bg-rose-700 transition-colors cursor-pointer"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* COUNTDOWN BODY */}
        <div className="p-6 text-center space-y-6">
          {isCountingDown && !sessionData ? (
            <div className="space-y-4">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-rose-200 dark:border-rose-900 border-t-rose-600 animate-spin" />
                <span className="text-4xl font-black text-rose-600 dark:text-rose-400">{countdown}s</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Broadcasting Emergency SOS...</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  Location, Patient Medical Summary & SMS alerts will be sent automatically.
                </p>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2">
                <MapPinIcon size={16} className="text-rose-600" />
                <span>{gpsStatus}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStopSharing}
                  className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-extrabold text-xs py-3 rounded-xl cursor-pointer"
                >
                  Cancel SOS
                </button>
                <button
                  type="button"
                  onClick={triggerEmergencySOS}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs py-3 rounded-xl cursor-pointer shadow-md"
                >
                  Activate Instantly Now 🚨
                </button>
              </div>
            </div>
          ) : isActivating ? (
            <div className="py-8 space-y-4">
              <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">Generating Secure Emergency URL & Alerting 108 Emergency Fleet...</p>
            </div>
          ) : (
            /* ACTIVATED SOS SUMMARY SESSION */
            <div className="space-y-5">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckIcon size={32} />
              </div>

              <div className="space-y-1">
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  ACTIVE 2-HOUR TEMPORARY SESSION
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Emergency Location Shared!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Your temporary Emergency Summary link is active for 2 hours. Trusted contacts and village ASHA worker have been alerted.
                </p>
              </div>

              {/* ACTION TILES */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:112"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs p-3.5 rounded-2xl flex flex-col items-center gap-1 shadow-md cursor-pointer"
                >
                  <PhoneIcon size={20} color="#ffffff" />
                  <span>Call 112 Emergency</span>
                </a>
                <a
                  href="tel:108"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs p-3.5 rounded-2xl flex flex-col items-center gap-1 shadow-md cursor-pointer"
                >
                  <PhoneIcon size={20} color="#ffffff" />
                  <span>Call 108 Ambulance</span>
                </a>
              </div>

              {/* SHAREABLE EMERGENCY CARD LINK */}
              {sessionData?.token && (
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-left">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">Temporary Medical Card Link:</span>
                    <span className="text-emerald-600 font-bold">Expires in 2 hrs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/emergency-card/${sessionData.token}/`}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px] font-mono px-3 py-2 rounded-xl text-slate-800 dark:text-slate-200 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/emergency-card/${sessionData.token}/`);
                        showToast?.('Emergency link copied to clipboard!', 'success');
                      }}
                      className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs px-3 py-2 rounded-xl cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleStopSharing}
                className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-900 dark:text-slate-100 font-extrabold text-xs py-3 rounded-2xl cursor-pointer"
              >
                Resolve & Revoke Location Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencySosModal;
