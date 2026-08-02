import React, { useState, useEffect } from 'react';
import { useAuth, LANGUAGES } from '../../context/AuthContext';
import { api } from '../../api/api';

export const ProfileDashboard = () => {
  const { user, token, showToast, refreshProfile, updateLanguage } = useAuth();
  const [editing, setEditing] = useState(false);
  const [refreshingToken, setRefreshingToken] = useState(false);

  const profile = user?.profile || {};

  const [editForm, setEditForm] = useState({
    preferred_language: profile.preferred_language || 'hi',
    gender: profile.gender || 'M',
    date_of_birth: profile.date_of_birth || '',
    age: profile.age || '',
    phone_number: profile.phone_number || '',
    village_or_town: profile.village_or_town || '',
    district: profile.district || '',
    state: profile.state || '',
    pincode: profile.pincode || '',
    emergency_contact_name: profile.emergency_contact_name || '',
    emergency_contact_phone: profile.emergency_contact_phone || '',
  });

  useEffect(() => {
    setEditForm({
      preferred_language: profile.preferred_language || 'hi',
      gender: profile.gender || 'M',
      date_of_birth: profile.date_of_birth || '',
      age: profile.age || '',
      phone_number: profile.phone_number || '',
      village_or_town: profile.village_or_town || '',
      district: profile.district || '',
      state: profile.state || '',
      pincode: profile.pincode || '',
      emergency_contact_name: profile.emergency_contact_name || '',
      emergency_contact_phone: profile.emergency_contact_phone || '',
    });
  }, [profile]);

  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  const editCalculatedAge = calculateAge(editForm.date_of_birth);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editForm,
        age: editForm.age ? parseInt(editForm.age) : editCalculatedAge,
      };
      await api.updateProfile(payload);
      await refreshProfile();
      showToast('Profile updated successfully!', 'success');
      setEditing(false);
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    }
  };

  const handleRefreshJWT = async () => {
    setRefreshingToken(true);
    try {
      const refreshTok = localStorage.getItem('refresh_token');
      if (!refreshTok) throw new Error('No refresh token found.');
      const res = await api.refreshToken(refreshTok);
      localStorage.setItem('access_token', res.access);
      showToast('JWT Access Token refreshed successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Token refresh failed.', 'error');
    } finally {
      setRefreshingToken(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ width: '100%', maxWidth: '900px' }}>
      <div className="profile-grid">
        {/* AVATAR & QUICK BADGE CARD */}
        <div className="glass-card avatar-card">
          <div className="avatar-circle">
            {profile.role === 'healthcare_worker' ? '🩺' : '👨‍🌾'}
          </div>
          <h2 style={{ fontSize: '22px' }}>
            {user.first_name} {user.last_name}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 12px 0' }}>
            @{user.username}
          </p>

          <span className={`badge ${profile.role === 'healthcare_worker' ? 'worker' : 'patient'}`}>
            {profile.role_display || profile.role || 'Patient'}
          </span>

          <div style={{ marginTop: '24px', textAlign: 'left' }}>
            <div className="detail-row">
              <span className="label">Primary Language:</span>
              <span className="value">
                {LANGUAGES.find((l) => l.code === profile.preferred_language)?.flag}{' '}
                {profile.language_display || profile.preferred_language}
              </span>
            </div>

            <div className="detail-row">
              <span className="label">Gender:</span>
              <span className="value">{profile.gender_display || profile.gender || 'Not Specified'}</span>
            </div>

            <div className="detail-row">
              <span className="label">Date of Birth:</span>
              <span className="value">{profile.date_of_birth || 'Not Specified'}</span>
            </div>

            <div className="detail-row">
              <span className="label">Calculated Age:</span>
              <span className="value" style={{ color: '#2dd4bf' }}>
                {profile.calculated_age ? `${profile.calculated_age} Years` : profile.age ? `${profile.age} Years` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* DETAILED INFORMATION & ACTIONS CARD */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px' }}>Rural Health Profile Details</h3>
            <button className="btn-secondary" onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : '✏️ Edit Profile'}
            </button>
          </div>

          {!editing ? (
            <div>
              <div className="detail-row">
                <span className="label">Mobile Phone Number:</span>
                <span className="value">{profile.phone_number || 'Not provided'}</span>
              </div>

              <div className="detail-row">
                <span className="label">Village / Town:</span>
                <span className="value">{profile.village_or_town || 'Not Specified'}</span>
              </div>

              <div className="detail-row">
                <span className="label">District (PHC Mapping):</span>
                <span className="value" style={{ color: '#6ee7b7' }}>
                  {profile.district || 'Not Specified'}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">State & PIN:</span>
                <span className="value">
                  {profile.state || 'Not Specified'} {profile.pincode ? `(PIN: ${profile.pincode})` : ''}
                </span>
              </div>

              {/* Emergency Contact Highlight Box */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                <h4 style={{ color: '#fca5a5', fontSize: '14px', marginBottom: '8px' }}>
                  🚨 Emergency Relative Contact
                </h4>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>
                  {profile.emergency_contact_name || 'Relative Guardian'} — {profile.emergency_contact_phone || '+91 9876500222'}
                </p>
              </div>

              {/* JWT Session Manager */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.25)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: '#2dd4bf', fontSize: '13px' }}>JWT Security Session Active</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Token: {token ? `${token.substring(0, 24)}...` : 'None'}</p>
                  </div>
                  <button className="btn-secondary" onClick={handleRefreshJWT} disabled={refreshingToken}>
                    {refreshingToken ? 'Refreshing...' : '🔄 Refresh JWT'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT PROFILE FORM */
            <form onSubmit={handleUpdate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Preferred Language</label>
                  <select
                    className="input-field"
                    value={editForm.preferred_language}
                    onChange={(e) => setEditForm({ ...editForm, preferred_language: e.target.value })}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name} ({l.native})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    className="input-field"
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  >
                    <option value="M">Male (पुरुष)</option>
                    <option value="F">Female (महिला)</option>
                    <option value="O">Other (अन्य)</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer Not To Say</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Date of Birth (DOB)</label>
                  <input
                    type="date"
                    className="input-field"
                    value={editForm.date_of_birth}
                    onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Approx. Age (Years)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="e.g. 30"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  />
                </div>
              </div>

              {editCalculatedAge !== null && (
                <div className="age-preview-box" style={{ marginBottom: '16px' }}>
                  <span>📅 Calculated Age from DOB:</span>
                  <strong>{editCalculatedAge} Years Old</strong>
                </div>
              )}

              <div className="form-group">
                <label>Mobile Phone Number</label>
                <input
                  type="text"
                  className="input-field"
                  value={editForm.phone_number}
                  onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Village / Town</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.village_or_town}
                    onChange={(e) => setEditForm({ ...editForm, village_or_town: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>District</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.district}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Uttar Pradesh"
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>PIN Code</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 261001"
                    value={editForm.pincode}
                    onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Emergency Contact Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.emergency_contact_name}
                    onChange={(e) => setEditForm({ ...editForm, emergency_contact_name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Phone</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.emergency_contact_phone}
                    onChange={(e) => setEditForm({ ...editForm, emergency_contact_phone: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                Save Profile Updates
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
