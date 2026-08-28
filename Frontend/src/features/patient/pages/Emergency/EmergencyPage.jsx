import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { PhoneIcon, HospitalIcon, AlertIcon, ShieldIcon, CheckIcon, SpeakerIcon, MapPinIcon, RefreshIcon } from '../../../../shared/icons/Icons';
import { speakNativeAudio } from '../../../../shared/utils/speech';
import { api } from '../../../../services/api';
import useDeviceLocation from '../../hooks/useDeviceLocation';
import EmergencyMapView from '../../components/Emergency/EmergencyMapView';
import EmergencySosModal from '../../components/Emergency/EmergencySosModal';

export const EmergencyPage = () => {
  const { currentLang, showToast } = useAuth();
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
  const [searchRadiusKm, setSearchRadiusKm] = useState(5);

  const firstAidGuides = {
    snakebite: {
      title: 'Snakebite Emergency Protocol',
      icon: '🐍',
      steps: [
        'Keep the victim calm and strictly still to slow venom circulation through bloodstream.',
        'Immobilize the bitten limb below heart level. Apply a splint if available.',
        'Remove rings, tight clothes, or shoes before swelling develops.',
        'Clean wound gently with clean water. DO NOT cut skin or suck venom.',
        'Transport immediately to nearest PHC with Anti-Snake Venom (ASV).'
      ]
    },
    cpr: {
      title: 'Cardiopulmonary Resuscitation (CPR)',
      icon: '🫀',
      steps: [
        'Place victim flat on their back on a firm surface.',
        'Interlock fingers in center of chest between nipples.',
        'Push hard and fast (100-120 compressions/min) until 108 ambulance arrives.',
        'Allow chest to rise completely between compressions.'
      ]
    },
    burns: {
      title: 'Thermal & Scald Burn Relief',
      icon: '🔥',
      steps: [
        'Cool the burn under clean running tap water for 10-15 minutes immediately.',
        'Do NOT apply ice, oil, toothpaste, or butter to raw burn skin.',
        'Cover loosely with a clean dry cloth or sterile bandage.',
        'Seek medical evaluation at nearest health centre.'
      ]
    },
    fever: {
      title: 'High Fever & Convulsions',
      icon: '🤒',
      steps: [
        'Sponge forehead, neck, and armpits with room-temperature water.',
        'Give Paracetamol 500mg as prescribed by doctor.',
        'Ensure continuous fluid intake (ORS, water, coconut water).',
        'If fever exceeds 102°F or seizures occur, visit PHC clinic.'
      ]
    },
    bleeding: {
      title: 'Severe Trauma & Uncontrolled Bleeding',
      icon: '🩸',
      steps: [
        'Apply firm, continuous direct pressure on wound using a clean cloth.',
        'Elevate the injured limb above heart level if no fracture is suspected.',
        'Do NOT remove cloth if soaked; layer another clean cloth over it.',
        'Rush to nearest District Hospital Trauma Centre.'
      ]
    },
    choking: {
      title: 'Choking Emergency (Heimlich Maneuver)',
      icon: '😮‍💨',
      steps: [
        'Stand behind person, wrap arms around waist.',
        'Make a fist above navel, grasp with other hand.',
        'Perform quick inward and upward abdominal thrusts until object dislodges.'
      ]
    },
    poisoning: {
      title: 'Pesticide & Chemical Poisoning',
      icon: '⚠️',
      steps: [
        'Remove contaminated clothing immediately and wash skin with soap and water.',
        'Do NOT induce vomiting unless instructed by Poison Control.',
        'Bring the chemical container to the hospital for antidote identification.',
        'Call Poison Helpline 1066 or rush to nearest CHC/Hospital.'
      ]
    },
    heatstroke: {
      title: 'Heatstroke & Dehydration',
      icon: '☀️',
      steps: [
        'Move person into shade or a cool ventilated room immediately.',
        'Cool body by splashing cold water or applying wet towels.',
        'Sip Oral Rehydration Solution (ORS) or salt-sugar water slowly if conscious.',
        'Seek urgent medical evaluation at nearest clinic.'
      ]
    }
  };

  const fetchNearbyFacilities = useCallback(async () => {
    setLoadingFacilities(true);
    console.log(`[FRONTEND GPS LOG] Fetching Facilities. Lat: ${latitude}, Lon: ${longitude}, Category: ${activeFacilityFilter}, Limit: ${resultLimit}`);
    try {
      const params = {
        limit: resultLimit,
        radius_km: 5
      };
      if (latitude) params.latitude = latitude;
      if (longitude) params.longitude = longitude;
      if (activeFacilityFilter !== 'ALL') params.type = activeFacilityFilter;

      const res = await api.getNearbyFacilities(params);
      if (res && Array.isArray(res.facilities)) {
        setFacilitiesList(res.facilities);
        if (res.search_radius_km) setSearchRadiusKm(res.search_radius_km);
        console.log(`[FRONTEND GIS RESPONSE] Found ${res.facilities.length} facilities within ${res.search_radius_km || 5} km radius.`);
      }
    } catch (err) {
      console.error('[FRONTEND GIS ERROR]', err);
      showToast?.('Nearby healthcare search is temporarily unavailable.', 'info');
      setFacilitiesList([]);
    } finally {
      setLoadingFacilities(false);
    }
  }, [latitude, longitude, activeFacilityFilter, resultLimit, showToast]);

  useEffect(() => {
    fetchNearbyFacilities();
  }, [fetchNearbyFacilities]);

  const handleRefreshLocation = () => {
    reacquireGPS();
    showToast?.('Acquiring fresh GPS fix & querying OpenStreetMap GIS...', 'info');
    setTimeout(() => {
      fetchNearbyFacilities();
    }, 1500);
  };

  const playFirstAidAudio = async () => {
    setPlayingTopicAudio(true);
    const guide = firstAidGuides[selectedTopic];
    const textToSpeak = `${guide.title}. ${guide.steps.join('. ')}`;
    if (showToast) showToast(`Reading ${guide.title} aloud in native voice...`, 'info');
    await speakNativeAudio(textToSpeak, currentLang || 'hi');
    setPlayingTopicAudio(false);
  };

  const getCategoryLabel = () => {
    switch (activeFacilityFilter) {
      case 'HOSPITAL': return 'hospitals';
      case 'CLINIC': return 'clinics & medical centres';
      case 'PHARMACY': return 'pharmacies';
      case 'BLOOD_BANK': return 'blood banks';
      default: return 'healthcare facilities';
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-6 space-y-6 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* REAL DEVICE GPS LOCATION STATUS BANNER */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-blue-600/30 border border-blue-400/40 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 shadow-sm">
            <MapPinIcon size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                gpsStatus === 'ACTIVE'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : gpsStatus === 'LOW_ACCURACY'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {gpsStatus === 'ACTIVE' ? '🟢 LIVE GPS ACTIVE' : gpsStatus === 'LOW_ACCURACY' ? '🟡 LOW ACCURACY GPS' : '🔴 GPS DENIED / OFFLINE'}
              </span>
              {accuracy && (
                <span className="text-[10px] font-mono text-slate-400">
                  ±{Math.round(accuracy)}m Accuracy
                </span>
              )}
            </div>

            <h2 className="text-base font-extrabold text-white mt-1">
              {latitude && longitude
                ? `GPS: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`
                : 'Acquiring Real Device GPS Coordinates...'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {gpsLastUpdated ? `Last updated: ${gpsLastUpdated}` : gpsError || 'Browser location permission active'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={handleRefreshLocation}
            className="flex-1 md:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshIcon size={16} />
            <span>Re-acquire GPS</span>
          </button>

          <button
            type="button"
            onClick={() => setSosModalOpen(true)}
            className="flex-1 md:flex-initial bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <AlertIcon size={16} color="#ffffff" />
            <span>Emergency SOS 🚨</span>
          </button>
        </div>
      </div>

      {/* QUICK HELPLINES BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <a href="tel:112" className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-4 rounded-2xl flex flex-col items-center text-center space-y-1 hover:bg-rose-100 transition-colors shadow-2xs">
          <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase">NATIONAL SOS</span>
          <span className="text-xl font-black text-rose-950 dark:text-rose-100">112</span>
          <span className="text-[10px] font-semibold text-rose-800 dark:text-rose-300">Unified Emergency Response</span>
        </a>

        <a href="tel:108" className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 p-4 rounded-2xl flex flex-col items-center text-center space-y-1 hover:bg-teal-100 transition-colors shadow-2xs">
          <span className="text-[10px] font-black text-teal-700 dark:text-teal-400 uppercase">RURAL AMBULANCE</span>
          <span className="text-xl font-black text-teal-950 dark:text-teal-100">108</span>
          <span className="text-[10px] font-semibold text-teal-800 dark:text-teal-300">Dial 108 Direct Helpline</span>
        </a>

        <a href="tel:104" className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl flex flex-col items-center text-center space-y-1 hover:bg-amber-100 transition-colors shadow-2xs">
          <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase">HEALTH ADVICE</span>
          <span className="text-xl font-black text-amber-950 dark:text-amber-100">104</span>
          <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300">State Doctor Advice</span>
        </a>

        <a href="tel:1066" className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 p-4 rounded-2xl flex flex-col items-center text-center space-y-1 hover:bg-indigo-100 transition-colors shadow-2xs">
          <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase">POISON HELPLINE</span>
          <span className="text-xl font-black text-indigo-950 dark:text-indigo-100">1066</span>
          <span className="text-[10px] font-semibold text-indigo-800 dark:text-indigo-300">Chemical & Pesticide Advice</span>
        </a>
      </div>

      {/* INTERACTIVE LEAFLET MAP VIEW */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HospitalIcon size={22} className="text-teal-700 dark:text-teal-400" />
              <span>Interactive Care Navigation Map</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {facilitiesList.length} {getCategoryLabel()} found within {searchRadiusKm} km radius
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Show max:</span>
            <select
              value={resultLimit}
              onChange={(e) => setResultLimit(Number(e.target.value))}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl text-slate-900 dark:text-white outline-none"
            >
              <option value={10}>10 Facilities</option>
              <option value={20}>20 Facilities</option>
              <option value={50}>50 Facilities (Max)</option>
            </select>
          </div>
        </div>

        <EmergencyMapView
          userLocation={location}
          facilities={facilitiesList}
          selectedFacility={selectedFacility}
          onSelectFacility={(fac) => setSelectedFacility(fac)}
        />
      </div>

      {/* FACILITY CATEGORY FILTERS & REAL DISTANCE SEARCH RESULTS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Real Nearby Healthcare Discovery
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              OpenStreetMap GIS spatial node query (node + way + relation) • Both public & private providers
            </p>
          </div>

          {/* FACILITY TYPE FILTER TABS */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'All Facilities' },
              { id: 'HOSPITAL', label: '🏥 Hospitals' },
              { id: 'CLINIC', label: '🩺 Clinics / PHC / CHC' },
              { id: 'PHARMACY', label: '💊 Pharmacies' },
              { id: 'BLOOD_BANK', label: '🩸 Blood Banks' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFacilityFilter(tab.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeFacilityFilter === tab.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* REAL FACILITY RESULTS GRID */}
        {loadingFacilities ? (
          <div className="py-12 text-center text-xs text-slate-500 font-bold animate-pulse">
            Querying OpenStreetMap GIS spatial nodes (node + way + relation) around your location...
          </div>
        ) : facilitiesList.length === 0 ? (
          /* TRUTHFUL HONEST EMPTY STATE */
          <div className="py-12 text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              🔍
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              No mapped {getCategoryLabel()} found within {searchRadiusKm} km radius.
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              OpenStreetMap GIS has no mapped {getCategoryLabel()} in this exact geographic sector. Try switching categories or dial 112 / 108 for immediate medical assistance.
            </p>
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 bg-rose-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm mt-2"
            >
              <PhoneIcon size={16} color="#ffffff" />
              <span>Dial 112 National Emergency Hotline</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilitiesList.map((fac, idx) => (
              <div
                key={fac.id || idx}
                className={`bg-slate-50 dark:bg-slate-800/70 border p-5 rounded-2xl space-y-3.5 shadow-2xs transition-all ${
                  selectedFacility?.id === fac.id
                    ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/30 dark:bg-teal-950/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-teal-500'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-teal-100 dark:bg-teal-900/80 text-teal-800 dark:text-teal-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      {fac.type || fac.facility_type}
                    </span>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mt-1.5">{fac.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{fac.address}</p>
                    {fac.operator && (
                      <p className="text-[10px] text-slate-400 mt-0.5">Operator: {fac.operator}</p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      {fac.straight_line_km || fac.distance_km} km
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold block">Straight line</span>
                  </div>
                </div>

                {/* DISTANCE & ESTIMATED ROAD TRAVEL BADGE */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    🚗 Estimated Road Travel:
                  </span>
                  <span className="font-black text-teal-700 dark:text-teal-400">
                    {fac.driving_km ? `${fac.driving_km} km (~${fac.driving_time_mins} mins driving)` : `${fac.distance_km} km`}
                  </span>
                </div>

                {/* SERVICES BADGES */}
                <div className="flex flex-wrap gap-1.5">
                  {fac.services?.map((srv, sIdx) => (
                    <span key={sIdx} className="bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                      {srv}
                    </span>
                  ))}
                  {fac.emergency_info && (
                    <span className="bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {fac.emergency_info}
                    </span>
                  )}
                </div>

                {/* DATA PROVENANCE BADGE & ACTIONS */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
                  <span className={`font-bold px-2 py-0.5 rounded-md ${
                    fac.data_provenance === 'LIVE_OSM'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                  }`}>
                    PROVENANCE: {fac.data_provenance || 'LIVE_OSM'}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={fac.phone && fac.phone !== 'Phone not available' ? `tel:${fac.phone}` : '#'}
                      onClick={(e) => {
                        if (!fac.phone || fac.phone === 'Phone not available') {
                          e.preventDefault();
                          showToast?.('Phone number not mapped in OpenStreetMap directory.', 'info');
                        }
                      }}
                      className={`inline-flex items-center gap-1 font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-2xs ${
                        fac.phone && fac.phone !== 'Phone not available'
                          ? 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <PhoneIcon size={14} color="currentColor" />
                      <span>{fac.phone && fac.phone !== 'Phone not available' ? 'Call' : 'No Phone'}</span>
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Map →</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-[11px] text-slate-400 italic">
          ℹ️ Truthfulness Disclaimer: Facility locations are queried live from OpenStreetMap GIS. Swasthya Sanchar AI does not claim unverified ICU or bed availability without direct phone confirmation.
        </p>
      </div>

      {/* VERIFIED FIRST-AID PROTOCOLS SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertIcon size={22} className="text-teal-700 dark:text-teal-400" />
              <span>Verified Emergency First-Aid Protocols</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Spoken Audio Read-Aloud in Regional Language (Hindi, Telugu, Kannada, Tamil, Marathi)
            </p>
          </div>

          <button
            onClick={playFirstAidAudio}
            disabled={playingTopicAudio}
            className="border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-2.5 min-h-[44px] rounded-xl transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 shrink-0"
          >
            <SpeakerIcon size={16} />
            <span>{playingTopicAudio ? 'Reading Aloud...' : 'Listen Native Audio First-Aid'}</span>
          </button>
        </div>

        {/* TOPIC SELECTION TABS */}
        <div className="flex flex-wrap gap-2 pb-1">
          {Object.keys(firstAidGuides).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedTopic(key)}
              className={`px-3.5 py-2.5 min-h-[44px] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTopic === key
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{firstAidGuides[key].icon}</span>
              <span>{firstAidGuides[key].title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* SELECTED FIRST AID GUIDE BOX */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <span>{firstAidGuides[selectedTopic].icon}</span>
              <span>{firstAidGuides[selectedTopic].title}</span>
            </h4>
            <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              VERIFIED PROTOCOL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {firstAidGuides[selectedTopic].steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 shadow-2xs">
                <div className="w-6 h-6 bg-teal-700 text-white font-extrabold rounded-lg flex items-center justify-center shrink-0 text-xs shadow-2xs">
                  {idx + 1}
                </div>
                <div className="font-medium leading-relaxed pt-0.5">{step}</div>
              </div>
            ))}
          </div>
        </div>
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
