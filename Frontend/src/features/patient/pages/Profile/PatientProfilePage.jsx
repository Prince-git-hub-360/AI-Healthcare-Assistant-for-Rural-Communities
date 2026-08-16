import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';

export const LANGUAGES_LIST = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
];

export const PatientProfilePage = () => {
  const { user, currentLang, refreshProfile, updateLanguage, showToast } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    gender: 'PREFER_NOT_TO_SAY',
    profile_photo: '',

    preferred_language: 'hi',
    voice_guidance: true,
    voice_speed: 'normal',
    text_size: 'standard',
    high_contrast: false,

    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    caregiver_name: '',
    caregiver_mobile: '',

    state: '',
    district: '',
    village_or_town: '',
    address: '',

    medication_reminders: true,
    missed_medication_alerts: true,
    caregiver_notifications: true,
    healthcare_followup_reminders: true,
    important_healthcare_updates: true,
  });

  const [emailError, setEmailError] = useState('');

  // Sync user data to form state
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        date_of_birth: user.profile?.date_of_birth || '',
        gender: user.profile?.gender || 'PREFER_NOT_TO_SAY',
        profile_photo: user.profile?.profile_photo || '',

        preferred_language: user.profile?.preferred_language || currentLang || 'hi',
        voice_guidance: user.profile?.voice_guidance ?? true,
        voice_speed: user.profile?.voice_speed || 'normal',
        text_size: user.profile?.text_size || 'standard',
        high_contrast: user.profile?.high_contrast ?? false,

        emergency_contact_name: user.profile?.emergency_contact_name || '',
        emergency_contact_phone: user.profile?.emergency_contact_phone || '',
        emergency_contact_relationship: user.profile?.emergency_contact_relationship || '',
        caregiver_name: user.profile?.caregiver_name || '',
        caregiver_mobile: user.profile?.caregiver_mobile || '',

        state: user.profile?.state || '',
        district: user.profile?.district || '',
        village_or_town: user.profile?.village_or_town || '',
        address: user.profile?.address || '',

        medication_reminders: user.profile?.medication_reminders ?? true,
        missed_medication_alerts: user.profile?.missed_medication_alerts ?? true,
        caregiver_notifications: user.profile?.caregiver_notifications ?? true,
        healthcare_followup_reminders: user.profile?.healthcare_followup_reminders ?? true,
        important_healthcare_updates: user.profile?.important_healthcare_updates ?? true,
      });
    }
  }, [user, currentLang]);

  // Calculate Profile Completion %
  const completionPercentage = useMemo(() => {
    const fieldsToTrack = [
      formData.first_name,
      formData.email,
      formData.date_of_birth,
      formData.gender,
      formData.village_or_town,
      formData.district,
      formData.state,
      formData.emergency_contact_name,
      formData.emergency_contact_phone,
    ];
    const filled = fieldsToTrack.filter((val) => Boolean(val && val !== 'PREFER_NOT_TO_SAY')).length;
    const totalPoints = fieldsToTrack.length + 2;
    const currentPoints = filled + 2;
    return Math.min(100, Math.round((currentPoints / totalPoints) * 100));
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profile_photo: reader.result }));
        showToast('Profile photo updated.', 'info');
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
      if (formData.preferred_language && formData.preferred_language !== currentLang) {
        updateLanguage(formData.preferred_language);
      } else {
        await refreshProfile();
      }
      setIsEditing(false);
      showToast('Your profile has been updated successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEmailError('');
    if (user) {
      setFormData((prev) => ({
        ...prev,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        date_of_birth: user.profile?.date_of_birth || '',
        gender: user.profile?.gender || 'PREFER_NOT_TO_SAY',
      }));
    }
  };

  const fullNameDisplay = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : 'Patient';

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-6 space-y-6 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            PATIENT ACCOUNT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Profile & Settings
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Manage your personal information, preferences and accessibility options.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-3 min-h-[44px] rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>✏️ Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs px-4 py-3 min-h-[44px] rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-5 py-3 min-h-[44px] rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

        {/* PROFILE SUMMARY CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors">
          <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5">
            {/* Left: Circular Photo */}
            <div className="relative group">
              {formData.profile_photo ? (
                <img
                  src={formData.profile_photo}
                  alt={fullNameDisplay}
                  className="w-20 h-20 rounded-full object-cover border-2 border-teal-700 dark:border-teal-400 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 bg-teal-700 text-white rounded-full flex items-center justify-center text-3xl font-extrabold shadow-sm">
                  {fullNameDisplay.charAt(0).toUpperCase()}
                </div>
              )}

              {isEditing && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-teal-700 transition-colors text-xs"
                  title="Upload profile photo"
                >
                  📷
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>

            {/* Center: Details */}
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{fullNameDisplay}</h2>
                <span className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Patient
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                @{user?.username || 'username'}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 pt-1">
                <span>📞 {user?.profile?.phone_number || user?.username || '+91 XXXXX XXXXX'}</span>
                <span className="text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1">
                  ✓ Verified
                </span>
              </div>
            </div>
          </div>

          {/* Right: Profile Completion Progress Indicator */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl space-y-2.5 min-w-[260px]">
            <div className="flex justify-between items-center text-xs font-extrabold">
              <span className="text-slate-800 dark:text-slate-200">Profile Completion</span>
              <span className="text-teal-700 dark:text-teal-400 font-extrabold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-700 dark:bg-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              {completionPercentage >= 80 ? 'Your profile is well detailed.' : 'Complete missing fields for better care assistance.'}
            </p>
          </div>
        </div>

        {/* TWO-COLUMN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* 1. PERSONAL INFORMATION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-5 transition-colors">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Personal Information</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Keep your basic information up to date.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Full Name</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-3 min-h-[44px] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-700 font-medium"
                      />
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-3 min-h-[44px] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-700 font-medium"
                      />
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-bold text-slate-900 dark:text-slate-100">
                      {fullNameDisplay}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200">Username</label>
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                      🔒 Read Only
                    </span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value={user?.username || ''}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-3.5 py-3 min-h-[44px] text-xs font-mono font-bold text-slate-600 dark:text-slate-400 cursor-not-allowed outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200">Mobile Number</label>
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                      ✓ Verified
                    </span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value={user?.profile?.phone_number || user?.username || '+91 XXXXX XXXXX'}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-3.5 py-3 min-h-[44px] text-xs font-mono font-bold text-slate-600 dark:text-slate-400 cursor-not-allowed outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        className={`w-full rounded-xl border px-3.5 py-3 min-h-[44px] text-xs text-slate-900 dark:text-slate-100 outline-none transition ${
                          emailError ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-teal-700'
                        }`}
                      />
                      {emailError && <p className="text-[11px] text-rose-600 font-bold mt-1">{emailError}</p>}
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-medium text-slate-900 dark:text-slate-100">
                      {user?.email || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-3 min-h-[44px] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-700"
                      />
                    ) : (
                      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-medium text-slate-900 dark:text-slate-100">
                        {formData.date_of_birth || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Gender</label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-3 min-h-[44px] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-700 cursor-pointer"
                      >
                        <option value="PREFER_NOT_TO_SAY">Prefer Not To Say</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    ) : (
                      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-medium text-slate-900 dark:text-slate-100">
                        {formData.gender === 'M' ? 'Male' : formData.gender === 'F' ? 'Female' : formData.gender === 'O' ? 'Other' : 'Not specified'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. EMERGENCY & CAREGIVER INFORMATION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-5 transition-colors">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Emergency & Caregiver Information</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Add trusted contacts who can assist you when needed.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Emergency Contact Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={handleChange}
                        placeholder="Primary Emergency Contact"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-3 min-h-[44px] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-700 font-medium"
                      />
                    ) : (
                      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-medium text-slate-900 dark:text-slate-100">
                        {formData.emergency_contact_name || 'None listed'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Emergency Contact Mobile</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="emergency_contact_phone"
                        value={formData.emergency_contact_phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-3 min-h-[44px] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-700 font-medium"
                      />
                    ) : (
                      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-medium text-slate-900 dark:text-slate-100">
                        {formData.emergency_contact_phone || 'None listed'}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Relationship</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergency_contact_relationship"
                      value={formData.emergency_contact_relationship}
                      onChange={handleChange}
                      placeholder="e.g. Spouse, Parent, Brother"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-3 min-h-[44px] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-700 font-medium"
                    />
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-medium text-slate-900 dark:text-slate-100">
                      {formData.emergency_contact_relationship || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. LOCATION & ADDRESS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-5 transition-colors">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Location & Address</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Residential details for local clinic follow-ups.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Karnataka / Uttar Pradesh"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-3 min-h-[44px] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-700 font-medium"
                    />
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-medium text-slate-900 dark:text-slate-100">
                      {formData.state || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">District</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="e.g. Mandya District"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-3 min-h-[44px] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-700 font-medium"
                    />
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-medium text-slate-900 dark:text-slate-100">
                      {formData.district || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Village / Town</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="village_or_town"
                      value={formData.village_or_town}
                      onChange={handleChange}
                      placeholder="e.g. Mandya"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-3 min-h-[44px] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-700 font-medium"
                    />
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-medium text-slate-900 dark:text-slate-100">
                      {formData.village_or_town || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* 4. LANGUAGE & ACCESSIBILITY */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 transition-colors">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Language & Accessibility</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Customize Swasthya Sanchar for the way you understand healthcare best.
                </p>
              </div>

              <div className="space-y-5 text-xs">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1.5">Preferred Language</label>
                  {isEditing ? (
                    <select
                      name="preferred_language"
                      value={formData.preferred_language}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-3 min-h-[44px] text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-700 font-bold cursor-pointer"
                    >
                      {LANGUAGES_LIST.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.native} ({l.name})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl font-bold text-teal-800 dark:text-teal-300 flex items-center justify-between">
                      <span>{LANGUAGES_LIST.find((l) => l.code === formData.preferred_language)?.native || formData.preferred_language}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({LANGUAGES_LIST.find((l) => l.code === formData.preferred_language)?.name})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PatientProfilePage;
