import React, { useState } from 'react';
import { 
  QrCodeIcon, UserIcon, PhoneIcon, CheckIcon, 
  ShieldIcon, SparklesIcon, AlertIcon, HospitalIcon, SearchIcon
} from '../../../shared/icons/Icons';

export const AbhaRegistrationModal = ({ isOpen, onClose, onRegisterSuccess, showToast }) => {
  const [activeMode, setActiveMode] = useState('scan'); // 'scan', 'lookup', 'manual'
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  // Manual & Lookup Form State
  const [formData, setFormData] = useState({
    abhaId: '',
    fullName: '',
    nameHi: '',
    age: '',
    gender: 'Female',
    mobile: '',
    village: 'Gejjalagere',
    sector: 'Sector 1 - North Colony',
    program: 'ncd',
    chronicCondition: '',
  });

  if (!isOpen) return null;

  const handleSimulateQrScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const mockScanned = {
        abhaId: `12-3456-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: 'Kamala Bai',
        nameHi: 'कमला बाई',
        age: '42',
        gender: 'Female',
        mobile: '+91 98451 22890',
        village: 'Gejjalagere',
        sector: 'Sector 2 - Market Area',
        program: 'ncd',
        chronicCondition: 'Stage-1 Hypertension',
      };
      setScannedData(mockScanned);
      setFormData(mockScanned);
      if (showToast) showToast('✅ ABHA QR Code Decoded Successfully!', 'success');
    }, 1200);
  };

  const handleLookupAbha = () => {
    if (!formData.abhaId || formData.abhaId.length < 10) {
      if (showToast) showToast('Please enter a valid 14-digit ABHA ID', 'error');
      return;
    }
    const found = {
      ...formData,
      fullName: 'Ramesh Gowda',
      nameHi: 'रमेश गौड़ा',
      age: '58',
      gender: 'Male',
      mobile: '+91 97412 88321',
      chronicCondition: 'Type-2 Diabetes Regimen',
    };
    setFormData(found);
    if (showToast) showToast('✅ Citizen Profile Fetched from ABDM Registry!', 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCitizen = {
      patient_id: Date.now(),
      full_name: formData.fullName,
      name_hi: formData.nameHi || formData.fullName,
      abha_id: formData.abhaId || `12-3456-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      age: parseInt(formData.age) || 45,
      gender: formData.gender,
      gender_code: `${formData.age || 45} ${formData.gender === 'Female' ? 'F' : 'M'}`,
      mobile: formData.mobile,
      village: `${formData.village}, Mandya`,
      sector: formData.sector,
      chronic: formData.chronicCondition || 'Registered in Doorstep Census',
      program: formData.program,
      status_label: formData.program === 'anc' 
        ? 'ANC Pregnancy | Purple Badge' 
        : formData.program === 'ncd' 
          ? 'NCD Monitored | Emerald Green' 
          : 'Stable Monitored | Green',
      status_color: formData.program === 'anc' ? 'bg-[#7C3AED] text-white' : 'bg-[#00875A] text-white',
      avatar: formData.gender === 'Female' ? '/images/savithri_devi.jpg' : '/images/manjunath_gowda.jpg',
      qr_pattern: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ABHA:${formData.abhaId}`,
    };

    onRegisterSuccess(newCitizen);
    if (showToast) showToast(`✅ Registered ${newCitizen.full_name} under ABDM!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl space-y-5 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white font-black text-sm p-1 rounded-full cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#0B3B74] dark:text-sky-400 tracking-wider">
            <ShieldIcon size={14} color="#0B3B74" />
            <span>National Health Mission • ABDM Registry</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Register Village Citizen &amp; Issue ABHA
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-generate or link official 14-digit Ayushman Bharat ABHA Health Card.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveMode('scan')}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === 'scan'
                ? 'bg-white dark:bg-slate-900 text-[#0B3B74] dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <QrCodeIcon size={14} />
            <span>Scan QR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('lookup')}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === 'lookup'
                ? 'bg-white dark:bg-slate-900 text-[#0B3B74] dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <SearchIcon size={14} />
            <span>ABHA ID</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('manual')}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === 'manual'
                ? 'bg-white dark:bg-slate-900 text-[#0B3B74] dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserIcon size={14} />
            <span>Manual Form</span>
          </button>
        </div>

        {/* MODE 1: LIVE QR SCANNER */}
        {activeMode === 'scan' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-800/50 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-[#0B3B74] dark:text-sky-300 flex items-center justify-center mx-auto text-2xl">
                📷
              </div>
              <div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  Scan Physical Ayushman ABHA QR Card
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Point camera at the QR code on the patient's card to auto-populate all fields.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSimulateQrScan}
                disabled={isScanning}
                className="bg-[#0B3B74] hover:bg-[#072448] text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all inline-flex items-center gap-2"
              >
                {isScanning ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scanning Physical QR Code...</span>
                  </>
                ) : (
                  <>
                    <QrCodeIcon size={16} />
                    <span>Simulate Live Camera Scan</span>
                  </>
                )}
              </button>
            </div>

            {scannedData && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-emerald-800 dark:text-emerald-300">
                  <span className="flex items-center gap-1">
                    <CheckIcon size={14} color="#059669" />
                    <span>Decoded Card: {scannedData.fullName} ({scannedData.age}y)</span>
                  </span>
                  <span className="font-mono text-[10px]">{scannedData.abhaId}</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  📍 {scannedData.village} • 📱 {scannedData.mobile}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: 14-DIGIT ABHA LOOKUP */}
        {activeMode === 'lookup' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Enter 14-Digit Ayushman ABHA ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 12-3456-7890-1122"
                value={formData.abhaId}
                onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
              />
              <button
                type="button"
                onClick={handleLookupAbha}
                className="bg-[#0B3B74] text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {/* MAIN REGISTRATION FORM */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Full Name (English) *</label>
              <input
                type="text"
                placeholder="e.g. Kamala Bai"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">नाम (हिन्दी / ಕನ್ನಡ)</label>
              <input
                type="text"
                placeholder="e.g. कमला बाई"
                value={formData.nameHi}
                onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Age *</label>
              <input
                type="number"
                placeholder="45"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Mobile Number *</label>
              <input
                type="tel"
                placeholder="98765 00111"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Clinical Program *</label>
              <select
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
              >
                <option value="ncd">💊 NCD: BP &amp; Diabetes</option>
                <option value="anc">🤰 Maternal Care (ANC 1-3)</option>
                <option value="tb">🫁 Nikshay: TB DOTS</option>
                <option value="uip">💉 Child Immunization</option>
                <option value="geriatric">👵 Geriatric Care</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Sector / Ward</label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
              >
                <option value="Sector 1 - North Colony">Sector 1 - North Colony</option>
                <option value="Sector 2 - Market Area">Sector 2 - Market Area</option>
                <option value="Sector 3 - Farmland Belt">Sector 3 - Farmland Belt</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Chronic Condition / Notes</label>
            <input
              type="text"
              placeholder="e.g. Hypertension 150/95 • Regular Metformin"
              value={formData.chronicCondition}
              onChange={(e) => setFormData({ ...formData, chronicCondition: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B3B74] hover:bg-[#072448] text-white font-black text-xs py-3 rounded-2xl shadow-md transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            <CheckIcon size={16} color="#fff" />
            <span>Complete ABDM Registration &amp; Save Citizen</span>
          </button>

        </form>

      </div>
    </div>
  );
};

export default AbhaRegistrationModal;
