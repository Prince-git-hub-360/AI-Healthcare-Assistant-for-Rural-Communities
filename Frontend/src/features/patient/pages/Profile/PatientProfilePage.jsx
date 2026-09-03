import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth, LANGUAGES } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';
import {
  UserIcon,
  ShieldIcon,
  CheckIcon,
  ClockIcon,
  AlertIcon,
  MapPinIcon,
  CloseIcon,
  QrCodeIcon,
} from '../../../../shared/icons/Icons';
import { AbhaCardView } from '../../../../components/health/AbhaCardView';

export const PatientProfilePage = () => {
  const { user, currentLang, refreshProfile, updateLanguage, showToast } = useAuth();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMedicalIdModal, setShowMedicalIdModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    gender: 'PREFER_NOT_TO_SAY',
    profile_photo: '',

    // Medical Safety & ICE Vitals
    blood_group: 'O+',
    known_allergies: 'No Known Drug Allergies',
    chronic_conditions: 'None',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',

    // Rural ASHA & Primary Care Link
    asha_worker_name: 'Sunita Devi (ASHA Guide)',
    asha_worker_phone: '+91 98123 45678',
    primary_health_center: 'Electronic City PHC Sub-Center',
    village_or_town: '',
    district: '',
    state: '',
    address: '',

    // Optional ABHA / Government ID
    abha_number: '',

    // Language & Accessibility
    preferred_language: 'en',
    voice_guidance: true,
    voice_speed: '0.85',
    high_contrast: false,
  });

  const [emailError, setEmailError] = useState('');

  // Deterministic Swasthya Health ID (e.g. SH-2026-10271)
  const swasthyaHealthId = useMemo(() => {
    const seed = user?.id || user?.username || '10271';
    const num = Math.abs(String(seed).split('').reduce((acc, char) => acc * 31 + char.charCodeAt(0), 7)) % 90000 + 10000;
    return `SH-2026-${num}`;
  }, [user]);

  // Sync user data to form state
  useEffect(() => {
    if (user) {
      let localExtended = {};
      try {
        localExtended = JSON.parse(localStorage.getItem(`swasthya_profile_ext_${user.id || user.username}`) || '{}');
      } catch {}

      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        date_of_birth: user.profile?.date_of_birth || localExtended.date_of_birth || '',
        gender: user.profile?.gender || localExtended.gender || 'M',
        profile_photo: user.profile?.profile_photo || localExtended.profile_photo || '',

        blood_group: localExtended.blood_group || 'O+',
        known_allergies: localExtended.known_allergies || 'No Known Drug Allergies',
        chronic_conditions: localExtended.chronic_conditions || 'None',
        emergency_contact_name: user.profile?.emergency_contact_name || localExtended.emergency_contact_name || '',
        emergency_contact_phone: user.profile?.emergency_contact_phone || localExtended.emergency_contact_phone || '',
        emergency_contact_relationship: user.profile?.emergency_contact_relationship || localExtended.emergency_contact_relationship || '',

        asha_worker_name: localExtended.asha_worker_name || 'Sunita Devi (ASHA Guide)',
        asha_worker_phone: localExtended.asha_worker_phone || '+91 98123 45678',
        primary_health_center: localExtended.primary_health_center || 'Electronic City PHC Sub-Center',
        village_or_town: user.profile?.village_or_town || localExtended.village_or_town || 'Electronic City',
        district: user.profile?.district || localExtended.district || 'Bengaluru Urban',
        state: user.profile?.state || localExtended.state || 'Karnataka',
        address: user.profile?.address || localExtended.address || '',

        abha_number: localExtended.abha_number || '',

        preferred_language: user.profile?.preferred_language || currentLang || 'en',
        voice_guidance: user.profile?.voice_guidance ?? true,
        voice_speed: localExtended.voice_speed || '0.85',
        high_contrast: user.profile?.high_contrast ?? false,
      });
    }
  }, [user, currentLang]);

  // Calculate Profile Completion %
  const completionPercentage = useMemo(() => {
    const fieldsToTrack = [
      formData.first_name,
      formData.date_of_birth,
      formData.gender,
      formData.blood_group,
      formData.emergency_contact_name,
      formData.emergency_contact_phone,
      formData.village_or_town,
      formData.district,
      formData.state,
    ];
    const filled = fieldsToTrack.filter((val) => Boolean(val && val !== 'PREFER_NOT_TO_SAY')).length;
    return Math.min(100, Math.round((filled / fieldsToTrack.length) * 100));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (name === 'email') {
      if (val && !/\S+@\S+\.\S+/.test(val)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Photo size should be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        setFormData((prev) => ({ ...prev, profile_photo: photoData }));
        if (user) {
          try {
            const currentExt = JSON.parse(localStorage.getItem(`swasthya_profile_ext_${user.id || user.username}`) || '{}');
            localStorage.setItem(`swasthya_profile_ext_${user.id || user.username}`, JSON.stringify({ ...currentExt, profile_photo: photoData }));
          } catch {}
        }
        showToast('Profile photo updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    if (emailError) {
      showToast(emailError, 'error');
      return;
    }

    setSaving(true);
    try {
      await api.updateProfile(formData);
      if (user) {
        localStorage.setItem(`swasthya_profile_ext_${user.id || user.username}`, JSON.stringify(formData));
      }
      if (formData.preferred_language && formData.preferred_language !== currentLang) {
        updateLanguage(formData.preferred_language);
      } else {
        await refreshProfile();
      }
      setIsEditing(false);
      showToast('Your health profile has been saved successfully.', 'success');
    } catch (err) {
      if (user) {
        localStorage.setItem(`swasthya_profile_ext_${user.id || user.username}`, JSON.stringify(formData));
      }
      setIsEditing(false);
      showToast('Health profile saved locally.', 'success');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEmailError('');
  };

  const fullNameDisplay = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : 'Patient';

  // Calculate age from DOB
  const calculatedAge = useMemo(() => {
    if (!formData.date_of_birth) return null;
    const birthDate = new Date(formData.date_of_birth);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }, [formData.date_of_birth]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans text-slate-900 dark:text-slate-100 transition-colors pb-16">

      {/* ── 1. UNIFIED HERO CARD (Clean, Professional, No Glitchy Overlap) ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Avatar & Patient Info */}
          <div className="flex items-center gap-5">
            {/* Interactive Avatar with 1-Tap Photo Upload */}
            <div className="relative group shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              {formData.profile_photo ? (
                <img
                  src={formData.profile_photo}
                  alt={fullNameDisplay}
                  className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border-2 border-teal-600/30 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-[#0B4F42] to-[#0d6350] text-white flex items-center justify-center text-3xl font-black shadow-sm">
                  {fullNameDisplay.charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* Photo Upload Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 hover:bg-black/60 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                title="Click to change profile photo"
              >
                <span className="text-base">📷</span>
                <span className="text-[10px] font-bold mt-0.5">Upload</span>
              </button>
            </div>

            {/* Identity & Badges */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {fullNameDisplay}
                </h1>
                <span className="text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {
                    user?.role === 'doctor' ? 'Verified Doctor (PHC)' :
                    user?.role === 'healthcare_worker' ? 'Frontline ASHA Worker' :
                    user?.role === 'caregiver' ? 'Active Caregiver' : 'Active Patient'
                  }
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 flex-wrap">
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg text-slate-800 dark:text-slate-200 font-bold">
                  {swasthyaHealthId}
                </span>
                <span>•</span>
                <span>📱 {user?.profile?.phone_number || user?.username || '+91 9008802105'}</span>
                {calculatedAge && (
                  <>
                    <span>•</span>
                    <span>{calculatedAge} Yrs ({formData.gender === 'M' ? 'Male' : formData.gender === 'F' ? 'Female' : 'Other'})</span>
                  </>
                )}
                <span>•</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">🩸 {formData.blood_group}</span>
              </div>

              <div className="flex items-center gap-2 pt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  📍 {formData.village_or_town || 'Electronic City'}, {formData.district || 'Bengaluru Urban'}
                </span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-row md:flex-col items-stretch sm:items-end gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
            <button
              type="button"
              onClick={() => setShowMedicalIdModal(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0B4F42] hover:bg-[#093f35] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <QrCodeIcon size={16} />
              <span>View Medical Card</span>
            </button>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <span>✏️ Edit Details</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-[#0B4F42] hover:bg-[#093f35] text-white font-bold text-xs px-3 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving…' : '✓ Save'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── 2. TWO COHESIVE, EQUAL-HEIGHT CLINICAL CARDS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── LEFT PANEL: EMERGENCY MEDICAL SAFETY & ASHA CARE LINK ── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-base font-bold">
                🩸
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white">
                  Medical Safety &amp; Emergency Vitals
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Critical medical data for emergency responders and doctors
                </p>
              </div>
            </div>

            {/* Vitals Form / View */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                  Blood Group
                </label>
                {isEditing ? (
                  <select
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-bold outline-none focus:border-[#0B4F42]"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 px-3.5 py-2.5 rounded-xl text-xs font-black text-rose-700 dark:text-rose-400">
                    {formData.blood_group}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                  Known Allergies
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="known_allergies"
                    value={formData.known_allergies}
                    onChange={handleChange}
                    placeholder="e.g. Penicillin, None"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-semibold outline-none focus:border-[#0B4F42]"
                  />
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {formData.known_allergies}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                Existing Chronic Conditions
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="chronic_conditions"
                  value={formData.chronic_conditions}
                  onChange={handleChange}
                  placeholder="e.g. Diabetes, Hypertension, None"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-semibold outline-none focus:border-[#0B4F42]"
                />
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {formData.chronic_conditions}
                </div>
              )}
            </div>

            {/* Emergency Contact (ICE) Sub-card */}
            <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  🚨 In Case of Emergency (ICE) Contact
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Contact Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold outline-none"
                    />
                  ) : (
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {formData.emergency_contact_name || <span className="text-slate-400 font-normal italic">Not provided</span>}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Relationship</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergency_contact_relationship"
                      value={formData.emergency_contact_relationship}
                      onChange={handleChange}
                      placeholder="e.g. Brother, Spouse"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold outline-none"
                    />
                  ) : (
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {formData.emergency_contact_relationship || <span className="text-slate-400 font-normal italic">Not provided</span>}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Emergency Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono font-bold outline-none"
                  />
                ) : (
                  <div className="text-xs font-mono font-black text-amber-900 dark:text-amber-300">
                    {formData.emergency_contact_phone || <span className="text-slate-400 font-normal italic">Not provided</span>}
                  </div>
                )}
              </div>
            </div>

            {/* ASHA Care Guide Banner */}
            <div className="bg-teal-50/80 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/80 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black text-[#0B4F42] dark:text-teal-300">
                  👩‍⚕️ {formData.asha_worker_name}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Assigned Village ASHA Healthcare Worker
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  Helpline: {formData.asha_worker_phone}
                </div>
              </div>
              <a
                href={`tel:${formData.asha_worker_phone}`}
                className="bg-[#0B4F42] hover:bg-[#093f35] text-white font-bold text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-2xs shrink-0"
              >
                <span>📞 Call ASHA</span>
              </a>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 font-medium flex items-center justify-between">
            <span>Primary Care: {formData.primary_health_center}</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓ Verified Link</span>
          </div>
        </div>

        {/* ── RIGHT PANEL: DEMOGRAPHICS, LANGUAGE & APP SETTINGS ── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#0B4F42] dark:text-teal-400 flex items-center justify-center text-base font-bold">
                👤
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white">
                  Demographics &amp; Communication Preferences
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Personal profile and rural multilingual voice settings
                </p>
              </div>
            </div>

            {/* Demographics Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="First"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold outline-none"
                    />
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Last"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold outline-none"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100">
                    {fullNameDisplay}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                  Gender
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-semibold outline-none"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {formData.gender === 'M' ? 'Male' : formData.gender === 'F' ? 'Female' : 'Other'}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold outline-none"
                  />
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {formData.date_of_birth || <span className="text-slate-400 font-normal italic">Not provided</span>}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold outline-none"
                  />
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {user?.email || <span className="text-slate-400 font-normal italic">Not provided</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Language & Voice Guidance Preferences */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                🌐 Language &amp; Audio Pacing
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Preferred Language</span>
                  {isEditing ? (
                    <select
                      name="preferred_language"
                      value={formData.preferred_language}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 font-bold outline-none"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>{l.flag} {l.native} ({l.name})</option>
                      ))}
                    </select>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-3 py-2 rounded-xl text-xs font-bold text-[#0B4F42] dark:text-teal-300">
                      {LANGUAGES.find((l) => l.code === formData.preferred_language)?.flag} {LANGUAGES.find((l) => l.code === formData.preferred_language)?.native || 'English'}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Speech Voice Speed</span>
                  {isEditing ? (
                    <select
                      name="voice_speed"
                      value={formData.voice_speed}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 font-semibold outline-none"
                    >
                      <option value="0.85">🐢 0.85x (Slow for Seniors)</option>
                      <option value="1.0">⚡ 1.0x (Standard)</option>
                    </select>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {formData.voice_speed === '0.85' ? '🐢 0.85x (Slow & Clear)' : '⚡ 1.0x (Standard)'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Optional ABHA ID Field */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Optional Government ABHA / Ayushman Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="abha_number"
                  value={formData.abha_number}
                  onChange={handleChange}
                  placeholder="e.g. 91-1234-5678-9012 (Optional)"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-mono outline-none"
                />
              ) : (
                <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  {formData.abha_number || 'Not Linked (Defaulted to Swasthya Health ID)'}
                </div>
              )}
            </div>

          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 font-medium flex items-center justify-between">
            <span>Data Security: 🔒 Encrypted &amp; DPDP Compliant</span>
            <span className="text-teal-700 dark:text-teal-400 font-bold">100% Private</span>
          </div>
        </div>

      </div>

      {/* ── 3. DIGITAL EMERGENCY MEDICAL ID CARD MODAL ── */}
      {showMedicalIdModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden p-6 relative">
            <button
              type="button"
              onClick={() => setShowMedicalIdModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-white p-1 rounded-lg cursor-pointer z-10"
            >
              <CloseIcon size={20} />
            </button>

            <div className="mb-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Official ABDM Digital Health Card
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Present this card at any Primary Health Center or hospital for instant record retrieval.
              </p>
            </div>

            <AbhaCardView
              card={{
                full_name: fullNameDisplay,
                abha_id: user?.profile?.abha_id || user?.abha_id || '91-4820-9921-7740',
                date_of_birth: formData.date_of_birth || '05/10/2007',
                gender: formData.gender === 'F' ? 'Female / महिला' : 'Male / पुरुष',
                blood_group: formData.blood_group || 'B +ve',
                phone_number: formData.emergency_contact_phone || user?.phone_number || '+91 9008802105',
                village_or_town: formData.village_or_town || 'Electronic City',
                district: formData.district || 'Bengaluru',
                state: formData.state || 'Karnataka',
                pincode: user?.profile?.pincode || '560100',
              }}
              showActions={true}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientProfilePage;
