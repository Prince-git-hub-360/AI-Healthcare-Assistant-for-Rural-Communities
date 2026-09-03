import React, { useState } from 'react';

/**
 * EmergencySOS Floating Action Button
 * 
 * Features:
 * - One-tap SOS on short tap
 * - Long-tap (2 sec) for options menu
 * - Persistent on all patient pages
 * - GPS location capture
 * - Auto-notify caregivers and ASHA
 * - Confirmation feedback
 */

export const EmergencySOS = ({ showToast, onSosSent }) => {
  const [sosTriggered, setSOSTriggered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // Get user's current location
  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          },
          () => resolve({ lat: null, lng: null })
        );
      } else {
        resolve({ lat: null, lng: null });
      }
    });
  };

  const handleSOSClick = async () => {
    if (sosTriggered) return;

    const location = await getCurrentLocation();
    setSOSTriggered(true);

    // Call parent callback
    if (onSosSent) {
      onSosSent({
        timestamp: new Date().toISOString(),
        location,
      });
    }

    showToast?.('🚨 SOS ALERT SENT', 'error');

    // Show confirmation modal
    setTimeout(() => {
      setSOSTriggered(false);
    }, 3000);
  };

  const handleMouseDown = () => {
    setStartTime(Date.now());
  };

  const handleMouseUp = () => {
    if (startTime) {
      const pressDuration = Date.now() - startTime;
      if (pressDuration > 2000) {
        // Long press - show menu
        setIsLongPress(true);
        setShowMenu(true);
      } else {
        // Short press - trigger SOS
        handleSOSClick();
      }
      setStartTime(null);
    }
  };

  const handleTouchStart = () => {
    setStartTime(Date.now());
  };

  const handleTouchEnd = () => {
    if (startTime) {
      const pressDuration = Date.now() - startTime;
      if (pressDuration > 2000) {
        setIsLongPress(true);
        setShowMenu(true);
      } else {
        handleSOSClick();
      }
      setStartTime(null);
    }
  };

  return (
    <>
      {/* FLOATING SOS BUTTON */}
      <button
        type="button"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => !isLongPress && handleSOSClick()}
        className={`fixed bottom-6 right-6 z-50 rounded-full shadow-2xl transition-all transform hover:scale-110 ${
          sosTriggered
            ? 'bg-red-600 dark:bg-red-700 animate-pulse scale-125'
            : 'bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800'
        } w-16 h-16 flex items-center justify-center cursor-pointer border-4 border-white dark:border-slate-900`}
        title="TAP for immediate SOS • LONG PRESS for menu"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-black text-white">🆘</div>
          <div className="text-[8px] font-black text-white mt-0.5 tracking-tight">SOS</div>
        </div>
      </button>

      {/* CONFIRMATION MODAL */}
      {sosTriggered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm shadow-2xl space-y-6 animate-in fade-in scale-in">
            <div className="text-center space-y-3">
              <div className="text-5xl">🚨</div>
              <h2 className="text-2xl font-black text-red-600 dark:text-red-400">SOS ALERT SENT</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Emergency alert has been sent to your caregivers and ASHA health worker. Help is on the way.
              </p>
            </div>

            <div className="space-y-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5">📍</span>
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Location Shared</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5">Your GPS coordinates have been sent to emergency contacts</div>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-2 border-t border-red-200 dark:border-red-900/40">
                <span className="text-lg mt-0.5">📞</span>
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Caregivers Notified</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5">Alert message sent to family & ASHA worker</div>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-2 border-t border-red-200 dark:border-red-900/40">
                <span className="text-lg mt-0.5">⏱️</span>
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Timestamp</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5">{new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSOSTriggered(false);
                  setShowMenu(false);
                }}
                className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold text-xs px-4 py-3 rounded-xl transition-colors"
              >
                ✓ Okay
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSOSClick(); // Send another alert
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition-colors"
              >
                🚨 Send Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LONG PRESS OPTIONS MENU */}
      {showMenu && !sosTriggered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm shadow-2xl space-y-4 animate-in fade-in scale-in">
            <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-black text-red-600 dark:text-red-400">EMERGENCY OPTIONS</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Choose how you need help</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                handleSOSClick();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-4 py-4 rounded-xl transition-colors flex items-center gap-3 justify-center"
            >
              <span className="text-2xl">🚨</span>
              <span>Send SOS to Caregivers</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                window.open('tel:108');
              }}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-4 py-4 rounded-xl transition-colors flex items-center gap-3 justify-center"
            >
              <span className="text-2xl">🚑</span>
              <span>Call Ambulance (108)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                showToast?.('Calling your ASHA worker...', 'info');
                window.open('tel:+919876543210'); // Placeholder
              }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-4 py-4 rounded-xl transition-colors flex items-center gap-3 justify-center"
            >
              <span className="text-2xl">👩‍⚕️</span>
              <span>Call ASHA Worker</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                showToast?.('Calling your doctor...', 'info');
                window.open('tel:+919876543211'); // Placeholder
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-4 py-4 rounded-xl transition-colors flex items-center gap-3 justify-center"
            >
              <span className="text-2xl">👨‍⚕️</span>
              <span>Call Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => setShowMenu(false)}
              className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold text-sm px-4 py-4 rounded-xl transition-colors"
            >
              ✕ Close Menu
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencySOS;
