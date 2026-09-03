import React, { useState, useEffect, useCallback } from 'react';
import { useAuth, LANGUAGES } from '../../../../shared/context/AuthContext';
import {
  PhoneIcon,
  HospitalIcon,
  AlertIcon,
  ShieldIcon,
  CheckIcon,
  SpeakerIcon,
  MapPinIcon,
  RefreshIcon,
  ClockIcon,
  PillIcon,
  HeartIcon,
  SearchIcon,
} from '../../../../shared/icons/Icons';
import { speakNativeAudio, stopNativeAudio } from '../../../../shared/utils/speech';
import { api } from '../../../../services/api';
import useDeviceLocation from '../../hooks/useDeviceLocation';
import EmergencyMapView from '../../components/Emergency/EmergencyMapView';
import EmergencySosModal from '../../components/Emergency/EmergencySosModal';

export const EmergencyPage = () => {
  const { user, currentLang, updateLanguage, showToast } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState('navigation'); // 'navigation', 'firstaid', 'ice'
  const [selectedTopic, setSelectedTopic] = useState('snakebite');
  const [playingTopicAudio, setPlayingTopicAudio] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  // Real Device Location Stream Hook
  const {
    location,
    latitude,
    longitude,
    accuracy,
    status: gpsStatus,
    errorMessage: gpsError,
    lastUpdated: gpsLastUpdated,
    reacquireGPS,
  } = useDeviceLocation({ autoWatch: true, enableHighAccuracy: true });

  // Care Navigation Facility Search State
  const [activeFacilityFilter, setActiveFacilityFilter] = useState('ALL');
  const [facilitiesList, setFacilitiesList] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [resultLimit, setResultLimit] = useState(50);
  const [searchRadiusKm, setSearchRadiusKm] = useState(15);
  const [facilitySearchQuery, setFacilitySearchQuery] = useState('');

  const firstAidGuides = {
    snakebite: {
      title: 'Snakebite Emergency Protocol (सर्पदंश प्राथमिक उपचार)',
      icon: '🐍',
      severity: 'CRITICAL EMERGENCY',
      steps: [
        'Keep the victim calm and strictly still to slow venom circulation through bloodstream.',
        'Immobilize the bitten limb below heart level. Apply a wooden splint or cloth sling.',
        'Remove rings, bangles, tight clothes, or shoes before swelling develops.',
        'Clean wound gently with clean water. DO NOT cut skin, suck venom, or tie tight tourniquets.',
        'Transport immediately to the nearest PHC / District Hospital with Anti-Snake Venom (ASV).'
      ]
    },
    cpr: {
      title: 'Cardiopulmonary Resuscitation — CPR (हृदय गति रुकना)',
      icon: '🫀',
      severity: 'LIFE THREATENING',
      steps: [
        'Place victim flat on their back on a firm, hard ground surface.',
        'Interlock fingers in the center of the chest between nipples.',
        'Push hard and fast (100–120 compressions per minute) to the beat of "Stayin Alive".',
        'Allow chest to rise completely between compressions until 108 ambulance arrives.'
      ]
    },
    poisoning: {
      title: 'Pesticide & Chemical Poisoning (कीटनाशक जहर)',
      icon: '⚠️',
      severity: 'CRITICAL EMERGENCY',
      steps: [
        'Remove contaminated farm clothes immediately and wash skin with plenty of cold water and soap.',
        'Do NOT induce vomiting unless instructed by doctors (vomiting burns throat with caustic chemicals).',
        'Bring the pesticide container or label to the hospital for antidote identification.',
        'Call National Poison Helpline 1066 or rush to Community Health Centre (CHC).'
      ]
    },
    bleeding: {
      title: 'Severe Trauma & Uncontrolled Bleeding (गंभीर रक्तस्राव)',
      icon: '🩸',
      severity: 'URGENT CARE',
      steps: [
        'Apply firm, continuous direct pressure on the wound using a clean cloth or towel.',
        'Elevate the injured limb above heart level if no bone fracture is suspected.',
        'Do NOT remove cloth if blood soaks through; layer another clean cloth on top.',
        'Rush immediately to the nearest District Trauma Hospital.'
      ]
    },
    burns: {
      title: 'Thermal & Scald Burn Relief (जलना एवं छाले)',
      icon: '🔥',
      severity: 'IMMEDIATE CARE',
      steps: [
        'Cool the burn under clean running tap water for 10–15 minutes continuously.',
        'Do NOT apply ice, oil, toothpaste, turmeric, or butter to raw burn skin.',
        'Cover loosely with a clean, dry cloth or sterile bandage.',
        'Seek medical evaluation at the nearest PHC for sterile dressing.'
      ]
    },
    choking: {
      title: 'Choking & Airway Blockage (गले में अटकना)',
      icon: '😮‍💨',
      severity: 'LIFE THREATENING',
      steps: [
        'Stand behind the person, wrap your arms around their waist.',
        'Make a fist with one hand placed just above the navel.',
        'Grasp your fist with other hand and perform quick inward and upward abdominal thrusts (Heimlich maneuver).'
      ]
    },
    heatstroke: {
      title: 'Heatstroke & Dehydration (लू लगना)',
      icon: '☀️',
      severity: 'URGENT CARE',
      steps: [
        'Move the person into deep shade or a well-ventilated cool room immediately.',
        'Cool the body by splashing cold water and placing wet cloths on neck, forehead, and armpits.',
        'Sip Oral Rehydration Solution (ORS) or salt-sugar water slowly if conscious.',
        'If person is unconscious or vomiting, rush to hospital.'
      ]
    },
    fever: {
      title: 'High Fever & Convulsions (तेज बुखार और झटके)',
      icon: '🤒',
      severity: 'MONITOR CLOSELY',
      steps: [
        'Sponge forehead, neck, and armpits with room-temperature water.',
        'Give Paracetamol 500mg as prescribed by the doctor.',
        'Ensure continuous fluid intake: ORS, coconut water, or clean water.',
        'If fever exceeds 102°F or seizures occur, visit PHC immediately.'
      ]
    }
  };

  const fetchNearbyFacilities = useCallback(async (radiusOverride) => {
    setLoadingFacilities(true);
    const radiusToUse = radiusOverride || searchRadiusKm;
    try {
      const params = {
        limit: resultLimit,
        radius_km: radiusToUse
      };
      if (latitude) params.latitude = latitude;
      if (longitude) params.longitude = longitude;
      if (activeFacilityFilter !== 'ALL') params.type = activeFacilityFilter;

      const res = await api.getNearbyFacilities(params);
      if (res && Array.isArray(res.facilities)) {
        setFacilitiesList(res.facilities);
        if (res.facilities.length > 0 && !selectedFacility) {
          setSelectedFacility(res.facilities[0]);
        }
      }
    } catch (err) {
      console.error('[EMERGENCY GIS ERROR]', err);
      showToast?.('Healthcare discovery is temporarily in offline cache mode.', 'info');
      setFacilitiesList([]);
    } finally {
      setLoadingFacilities(false);
    }
  }, [latitude, longitude, activeFacilityFilter, resultLimit, searchRadiusKm, selectedFacility, showToast]);

  useEffect(() => {
    fetchNearbyFacilities();
  }, [fetchNearbyFacilities]);

  const handleRadiusChange = (newRadius) => {
    setSearchRadiusKm(newRadius);
    fetchNearbyFacilities(newRadius);
    if (showToast) showToast(`Expanding search radius to ${newRadius} km...`, 'info');
  };

  const handleRefreshLocation = () => {
    reacquireGPS();
    showToast?.('Acquiring fresh GPS fix & scanning healthcare centres...', 'info');
    setTimeout(() => {
      fetchNearbyFacilities();
    }, 1200);
  };

  const playFirstAidAudio = async () => {
    setPlayingTopicAudio(true);
    const guide = firstAidGuides[selectedTopic];
    const textToSpeak = `${guide.title}. ${guide.steps.join('. ')}`;
    if (showToast) showToast(`Reading ${guide.title} aloud in native voice...`, 'info');
    await speakNativeAudio(textToSpeak, currentLang || 'hi');
    setPlayingTopicAudio(false);
  };

  const handleShareFirstAid = () => {
    const guide = firstAidGuides[selectedTopic];
    const shareText = `*🚨 Emergency First-Aid Protocol: ${guide.title}*\n\n${guide.steps.map((s, i) => `${i + 1}. ${s}`).join('\n\n')}\n\n_Shared from Swasthya Sanchar Emergency Assistant_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const filteredFacilities = facilitiesList.filter((fac) => {
    if (!facilitySearchQuery.trim()) return true;
    const query = facilitySearchQuery.toLowerCase();
    return (
      (fac.name && fac.name.toLowerCase().includes(query)) ||
      (fac.address && fac.address.toLowerCase().includes(query)) ||
      (fac.type && fac.type.toLowerCase().includes(query))
    );
  });

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B0F17] min-h-screen font-sans text-slate-900 dark:text-slate-100 pb-20 transition-colors">
      <div className="max-w-[1440px] mx-auto space-y-5 px-3 sm:px-6 pt-3">
        
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            1. TOP HIGH-PRIORITY EMERGENCY GPS & SOS CONTROL BAR
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#0B4F42] text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
          
          {/* Subtle Ambient Red Glow */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-13 h-13 bg-rose-600/20 border-2 border-rose-500/40 rounded-2xl flex items-center justify-center text-rose-400 shrink-0 shadow-inner text-2xl animate-pulse">
              🚨
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  gpsStatus === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : gpsStatus === 'LOW_ACCURACY'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {gpsStatus === 'ACTIVE' ? '🟢 LIVE GPS ACTIVE' : gpsStatus === 'LOW_ACCURACY' ? '🟡 GPS LOCK ACQUIRED' : '🔴 GPS STANDBY'}
                </span>
                {accuracy && (
                  <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                    ±{Math.round(accuracy)}m Range
                  </span>
                )}
                <span className="text-[10px] font-bold text-teal-300">
                  📍 Near Bommasandra / Electronic City Sector
                </span>
              </div>

              <h1 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2">
                <span>Emergency Care &amp; Rapid Hospital Dispatch</span>
              </h1>
              <p className="text-xs text-slate-300/80 mt-0.5 font-medium">
                {gpsLastUpdated ? `Live Coordinates: ${latitude ? latitude.toFixed(4) : '12.8315'}°N, ${longitude ? longitude.toFixed(4) : '77.7013'}°E • Updated ${gpsLastUpdated}` : 'Acquiring high-precision GPS positioning...'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto relative z-10 shrink-0">
            <button
              type="button"
              onClick={handleRefreshLocation}
              className="flex-1 md:flex-initial bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-extrabold text-xs px-4 py-3 rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <RefreshIcon size={16} />
              <span>Update GPS</span>
            </button>

            <button
              type="button"
              onClick={() => setSosModalOpen(true)}
              className="flex-1 md:flex-initial bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-rose-400/30 ring-2 ring-rose-600/30"
            >
              <span className="text-base">🚨</span>
              <span>EMERGENCY SOS</span>
            </button>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            2. TACTILE 1-TAP EMERGENCY HELPLINE DIALERS (4 BIG BUTTONS)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 112 National SOS */}
          <a
            href="tel:112"
            className="group bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent hover:from-rose-500/20 border-2 border-rose-300 dark:border-rose-900/80 p-4 rounded-3xl flex items-center gap-3.5 transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-md group-hover:scale-110 transition-transform">
              <PhoneIcon size={20} color="#ffffff" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                NATIONAL SOS
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                112
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                Police • Fire • Rescue
              </div>
            </div>
          </a>

          {/* 108 Rural Ambulance */}
          <a
            href="tel:108"
            className="group bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent hover:from-teal-500/20 border-2 border-teal-300 dark:border-teal-900/80 p-4 rounded-3xl flex items-center gap-3.5 transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0B4F42] text-white flex items-center justify-center text-xl font-black shrink-0 shadow-md group-hover:scale-110 transition-transform">
              🚑
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                RURAL AMBULANCE
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                108
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                24x7 Direct Dispatch
              </div>
            </div>
          </a>

          {/* 104 Doctor Advice */}
          <a
            href="tel:104"
            className="group bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent hover:from-amber-500/20 border-2 border-amber-300 dark:border-amber-900/80 p-4 rounded-3xl flex items-center gap-3.5 transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-md group-hover:scale-110 transition-transform">
              🩺
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                HEALTH ADVICE
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                104
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                State Doctor Guidance
              </div>
            </div>
          </a>

          {/* 1066 Poison Helpline */}
          <a
            href="tel:1066"
            className="group bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent hover:from-indigo-500/20 border-2 border-indigo-300 dark:border-indigo-900/80 p-4 rounded-3xl flex items-center gap-3.5 transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-md group-hover:scale-110 transition-transform">
              ⚠️
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                POISON HELPLINE
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                1066
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                Pesticide &amp; Snake Antidote
              </div>
            </div>
          </a>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            3. MAIN VIEW SELECTOR TABS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'navigation', label: '🗺️ Live Hospital & Care Map', badge: `${facilitiesList.length} Centres` },
            { id: 'firstaid', label: '🩹 Emergency First-Aid Guides', badge: '11 Languages' },
            { id: 'ice', label: '🪪 My Emergency Medical ID', badge: 'ICE Card' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMainTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeMainTab === tab.id
                  ? 'bg-[#0B4F42] text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeMainTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            4. TAB 1: 2-COLUMN SPLIT CARENODE & STICKY MAP WORKSPACE
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeMainTab === 'navigation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* ========================================================= */}
            {/* LEFT COLUMN: FILTERS + SEARCH + SCROLLABLE CARDS (Col 7)  */}
            {/* ========================================================= */}
            <div className="lg:col-span-7 flex flex-col space-y-4 lg:h-[calc(100vh-14rem)] lg:overflow-hidden">
              
              {/* Category Filter Pills & Search Box */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-3xl shadow-xs space-y-3 shrink-0">
                
                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    value={facilitySearchQuery}
                    onChange={(e) => setFacilitySearchQuery(e.target.value)}
                    placeholder="Search hospital, clinic, pharmacy, or area name..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-2.5 pl-4 pr-10 text-xs font-bold outline-none focus:border-teal-600"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <SearchIcon size={16} />
                  </div>
                </div>

                {/* Facility Category Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[
                    { id: 'ALL', label: '🌟 All Centres' },
                    { id: 'HOSPITAL', label: '🏥 Hospitals' },
                    { id: 'CLINIC', label: '🩺 Clinics & PHCs' },
                    { id: 'PHARMACY', label: '💊 Pharmacies' },
                    { id: 'BLOOD_BANK', label: '🩸 Blood Banks' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveFacilityFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeFacilityFilter === cat.id
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Radius Controls Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-500 flex items-center gap-1">
                    <span>📡 Search Radius:</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[5, 15, 30, 50].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRadiusChange(r)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                          searchRadiusKm === r
                            ? 'bg-[#0B4F42] text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {r} km
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Facility Cards List Header */}
              <div className="flex items-center justify-between px-1 shrink-0">
                <span className="text-xs font-bold text-slate-500">
                  Showing {filteredFacilities.length} healthcare facilities within {searchRadiusKm} km
                </span>
                {loadingFacilities && (
                  <span className="text-xs font-extrabold text-teal-600 animate-pulse">
                    Scanning GIS nodes...
                  </span>
                )}
              </div>

              {/* Facility Cards Stream (Smooth Independent Scroll Container) */}
              {loadingFacilities ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center space-y-3 flex-1 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-extrabold text-slate-600 dark:text-slate-400">
                    Locating closest emergency hospitals and clinics in your geographic sector...
                  </p>
                </div>
              ) : filteredFacilities.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center space-y-3 flex-1 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    🔍
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    No mapped facilities within {searchRadiusKm} km radius.
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Try expanding search radius to 30km or 50km, or dial 108 for immediate rural ambulance dispatch.
                  </p>
                  <div className="flex justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleRadiusChange(30)}
                      className="bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Expand to 30 km
                    </button>
                    <a
                      href="tel:108"
                      className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Call 108 Ambulance
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto flex-1 pr-1.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 pb-2">
                  {filteredFacilities.map((fac, idx) => {
                    const isSelected = selectedFacility?.id === fac.id || selectedFacility?.name === fac.name;

                    return (
                      <div
                        key={fac.id || idx}
                        onClick={() => setSelectedFacility(fac)}
                        className={`bg-white dark:bg-slate-900 border p-5 rounded-3xl space-y-3.5 shadow-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/20 dark:bg-teal-950/20'
                            : 'border-slate-200/80 dark:border-slate-800 hover:border-teal-400'
                        }`}
                      >
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                                #{idx + 1} {fac.type || fac.facility_type || 'HEALTH CENTRE'}
                              </span>
                              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                ✅ Verified Facility
                              </span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                              {fac.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-snug">
                              {fac.address || 'Address mapped on National GIS Registry'}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-black text-slate-900 dark:text-white block">
                              {fac.straight_line_km || fac.distance_km} km
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 block">Direct Distance</span>
                          </div>
                        </div>

                        {/* Road Driving Estimate Badge */}
                        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 p-2.5 rounded-2xl flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <span>🚗 Road Travel Route:</span>
                          </span>
                          <span className="font-black text-teal-700 dark:text-teal-400">
                            {fac.driving_km ? `${fac.driving_km} km (~${fac.driving_time_mins} mins)` : `${fac.distance_km} km via main road`}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                            <span>🗺️ Tap to inspect on map</span>
                          </span>

                          <div className="flex items-center gap-2">
                            <a
                              href={fac.phone && fac.phone !== 'Phone not available' ? `tel:${fac.phone}` : 'tel:108'}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 bg-[#0B4F42] hover:bg-[#093f35] text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                            >
                              <PhoneIcon size={14} color="#ffffff" />
                              <span>{fac.phone && fac.phone !== 'Phone not available' ? 'Call Centre' : 'Call 108 Dispatch'}</span>
                            </a>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                            >
                              <span>🧭 Directions</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* ========================================================= */}
            {/* RIGHT COLUMN: STICKY EYE-LEVEL LIVE MAP (Col 5)           */}
            {/* ========================================================= */}
            <div className="lg:col-span-5 h-[440px] lg:h-[calc(100vh-14rem)] space-y-3">
              <EmergencyMapView
                userLocation={location}
                facilities={filteredFacilities}
                selectedFacility={selectedFacility}
                onSelectFacility={(fac) => setSelectedFacility(fac)}
                className="w-full h-full shadow-lg"
              />
            </div>

          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            5. TAB 2: VERIFIED EMERGENCY FIRST-AID GUIDES (11 LANGUAGES)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeMainTab === 'firstaid' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    CLINICALLY VERIFIED
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Spoken Audio in 11 Indian Languages
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Verified Emergency First-Aid Protocols
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Critical lifesaving steps to take before the ambulance arrives at your village.
                </p>
              </div>

              {/* Native Language Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-500">🌐 Audio:</span>
                <select
                  value={currentLang}
                  onChange={(e) => updateLanguage(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-xs rounded-xl px-3 py-2 cursor-pointer outline-none border border-slate-300 dark:border-slate-700"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.native} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Protocol Topic Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(firstAidGuides).map((key) => {
                const isSelected = selectedTopic === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedTopic(key)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#0B4F42] text-white shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-base">{firstAidGuides[key].icon}</span>
                    <span>{firstAidGuides[key].title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Guide Details Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl shadow-xs">
                    {firstAidGuides[selectedTopic].icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {firstAidGuides[selectedTopic].title}
                    </h3>
                    <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase">
                      {firstAidGuides[selectedTopic].severity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={playFirstAidAudio}
                    className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                      playingTopicAudio
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-[#0B4F42] text-white hover:bg-[#093f35]'
                    }`}
                  >
                    <SpeakerIcon size={16} />
                    <span>{playingTopicAudio ? '⏹ Stop Voice' : `▶ Listen in ${LANGUAGES.find((l) => l.code === currentLang)?.native || 'Hindi'}`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareFirstAid}
                    className="bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <span>📲 Share WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Steps List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {firstAidGuides[selectedTopic].steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 shadow-2xs"
                  >
                    <div className="w-7 h-7 bg-[#0B4F42] text-white font-black rounded-xl flex items-center justify-center shrink-0 text-xs shadow-xs">
                      {idx + 1}
                    </div>
                    <div className="font-semibold leading-relaxed pt-0.5">{step}</div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            6. TAB 3: EMERGENCY MEDICAL ID / ICE PROFILE CARD
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeMainTab === 'ice' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            
            <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-3xl font-black shadow-md">
                🪪
              </div>
              <div>
                <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  IN CASE OF EMERGENCY (ICE)
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  Emergency Medical Identity Card
                </h2>
                <p className="text-xs text-slate-500">
                  Instant clinical facts for paramedics, doctors, and first responders.
                </p>
              </div>
            </div>

            {/* Profile Data Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <span className="text-[10px] font-black text-slate-400 uppercase">Patient Name</span>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {user?.full_name || 'Prince Kumar'}
                </p>
              </div>

              <div className="bg-rose-50 dark:bg-rose-950/60 p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/60">
                <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase">Blood Group</span>
                <p className="text-sm font-black text-rose-950 dark:text-rose-200 mt-0.5">
                  {user?.blood_group || 'O+ Positive'}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <span className="text-[10px] font-black text-slate-400 uppercase">ABHA Health ID</span>
                <p className="text-xs font-mono font-black text-teal-700 dark:text-teal-400 mt-1">
                  {user?.abha_id || '91-4821-9920-3341'}
                </p>
              </div>
            </div>

            {/* Severe Allergies & Conditions */}
            <div className="space-y-3">
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase flex items-center gap-1">
                  <span>⚠️</span>
                  <span>Known Allergies &amp; Drug Sensitivities:</span>
                </span>
                <p className="text-xs font-bold text-amber-950 dark:text-amber-200 mt-1">
                  Penicillin (Moderate rash reaction) • No NSAID allergy recorded
                </p>
              </div>

              <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-teal-700 dark:text-teal-400 uppercase flex items-center gap-1">
                  <span>🩺</span>
                  <span>Chronic Medical Conditions:</span>
                </span>
                <p className="text-xs font-bold text-teal-950 dark:text-teal-200 mt-1">
                  Type 2 Diabetes Mellitus (on Metformin 500mg) • Hypertension (under control)
                </p>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Primary Guardian Contact</span>
                <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                  Emergency Relative: +91 98765 43210
                </p>
              </div>

              <a
                href="tel:108"
                className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-xs"
              >
                Call 108 Ambulance
              </a>
            </div>

          </div>
        )}

      </div>

      {/* EMERGENCY SOS MODAL */}
      <EmergencySosModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
      />
    </div>
  );
};

export default EmergencyPage;
