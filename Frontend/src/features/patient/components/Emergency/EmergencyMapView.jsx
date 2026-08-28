import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom SVG Icons for Healthcare Facilities
const createCustomIcon = (emoji, bgColor) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: white;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        ${emoji}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
};

const userIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div style="position: relative; width: 32px; height: 32px;">
      <div style="
        position: absolute;
        inset: 0;
        background-color: #3b82f6;
        opacity: 0.4;
        border-radius: 50%;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        position: absolute;
        inset: 4px;
        background-color: #2563eb;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const hospitalIcon = createCustomIcon('🏥', '#e11d48');
const phcIcon = createCustomIcon('🩺', '#0d9488');
const pharmacyIcon = createCustomIcon('💊', '#d97706');
const bloodBankIcon = createCustomIcon('🩸', '#9f1239');
const defaultIcon = createCustomIcon('🚑', '#4f46e5');

const getFacilityMarkerIcon = (facilityType) => {
  const t = (facilityType || '').toUpperCase();
  if (t === 'HOSPITAL') return hospitalIcon;
  if (t === 'PHC' || t === 'CHC' || t === 'CLINIC') return phcIcon;
  if (t === 'PHARMACY') return pharmacyIcon;
  if (t === 'BLOOD_BANK') return bloodBankIcon;
  return defaultIcon;
};

// Component to dynamically re-center map view on user location update
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 13, { animate: true });
    }
  }, [center, map]);
  return null;
};

export const EmergencyMapView = ({ userLocation, facilities = [], selectedFacility, onSelectFacility }) => {
  const defaultCenter = [12.5244, 76.8958]; // Default Karnataka rural sector
  const mapCenter = userLocation?.latitude && userLocation?.longitude
    ? [userLocation.latitude, userLocation.longitude]
    : defaultCenter;

  return (
    <div className="relative w-full h-[380px] md:h-[450px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 z-10">
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={mapCenter} />

        {/* CURRENT USER GPS MARKER */}
        {userLocation?.latitude && userLocation?.longitude && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
            <Popup>
              <div className="font-sans text-xs p-1">
                <span className="font-black text-blue-600 uppercase block">📍 YOU ARE HERE</span>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  GPS Coordinates: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* HEALTHCARE FACILITY MARKERS */}
        {facilities.map((fac, idx) => {
          if (!fac.latitude || !fac.longitude) return null;
          const icon = getFacilityMarkerIcon(fac.facility_type);

          return (
            <Marker
              key={fac.id || idx}
              position={[fac.latitude, fac.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectFacility && onSelectFacility(fac),
              }}
            >
              <Popup>
                <div className="font-sans text-xs space-y-2 p-1 min-w-[200px]">
                  <div>
                    <span className="bg-teal-100 text-teal-800 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                      {fac.type || fac.facility_type}
                    </span>
                    <h4 className="font-black text-slate-900 text-sm mt-1">{fac.name}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{fac.address}</p>
                  </div>

                  <div className="bg-slate-100 p-2 rounded-xl text-[11px] space-y-0.5">
                    <div className="font-bold text-slate-800">
                      📏 Straight-line: {fac.straight_line_km || fac.distance_km} km
                    </div>
                    {fac.driving_km && (
                      <div className="font-extrabold text-teal-700">
                        🚗 Driving: {fac.driving_km} km (~{fac.driving_time_mins} mins)
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1.5 pt-1">
                    <a
                      href={`tel:${fac.phone || '108'}`}
                      className="flex-1 bg-teal-700 text-white font-bold text-[11px] py-1.5 rounded-lg text-center no-underline"
                    >
                      📞 Call Facility
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-slate-900 text-white font-bold text-[11px] py-1.5 rounded-lg text-center no-underline"
                    >
                      🧭 Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default EmergencyMapView;
