import React, { useState } from 'react';
import { useAuth, LANGUAGES } from '../../context/AuthContext';

export const Register = ({ setCurrentView }) => {
  const { register, loading, showToast } = useAuth();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    role: 'patient',
    gender: 'M',
    date_of_birth: '',
    age: '',
    preferred_language: 'hi',
    phone_number: '',
    village_or_town: '',
    district: '',
    state: '',
    pincode: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    organization: '',
  });

  // Live Calculated Age helper
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date_of_birth') {
      const newAge = calculateAge(value);
      setFormData((prev) => ({
        ...prev,
        date_of_birth: value,
        age: newAge !== null ? String(newAge) : prev.age,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculatedAge = calculateAge(formData.date_of_birth);

  const handleStep1Next = () => {
    if (
      !formData.username.trim() ||
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      if (showToast) showToast('Please fill out all compulsory account fields (*)', 'error');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!formData.role || !formData.gender || !formData.preferred_language || !formData.date_of_birth || !formData.age) {
      if (showToast) showToast('Please fill out all compulsory demographic fields (*)', 'error');
      return;
    }
    if (formData.role === 'healthcare_worker' && !formData.organization.trim()) {
      if (showToast) showToast('Please enter your Hospital / Primary Health Centre (PHC) Name (*)', 'error');
      return;
    }
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic required location fields for all roles
    if (!formData.phone_number.trim() || !formData.district.trim() || !formData.state.trim() || !formData.pincode.trim()) {
      if (showToast) showToast('Please fill out all compulsory location fields (*)', 'error');
      return;
    }

    // Role-specific required fields
    if (formData.role === 'patient' || formData.role === 'caregiver') {
      if (
        !formData.village_or_town.trim() ||
        !formData.emergency_contact_name.trim() ||
        !formData.emergency_contact_phone.trim()
      ) {
        if (showToast) showToast('Please fill out Village/Town and Emergency Relative Contact details (*)', 'error');
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : calculatedAge,
      };
      await register(payload);
      setCurrentView('login');
    } catch {
      // Handled in context toast
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>Healthcare Registration</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Register your profile for personalized rural health guidance. All marked fields are mandatory (<span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>).
          </p>
        </div>

        {/* Wizard Step Indicator */}
        <div className="wizard-steps">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Account</span>
          </div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Demographics</span>
          </div>
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Location & Details</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1: ACCOUNT CREDENTIALS & ROLE SELECTION */}
          {step === 1 && (
            <div>
              <div className="form-group">
                <label>System Role <span style={{ color: '#ef4444' }}>*</span></label>
                <select name="role" className="input-field" value={formData.role} onChange={handleChange} required>
                  <option value="patient">👨‍🌾 Patient (Rural Resident)</option>
                  <option value="healthcare_worker">🩺 Healthcare Worker (ASHA / ANM / Doctor)</option>
                  <option value="caregiver">👪 Family Caregiver</option>
                </select>
              </div>

              <div className="form-group">
                <label>Username / Mobile Number <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  name="username"
                  className="input-field"
                  placeholder="e.g. ramesh_kumar or 9876543210"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>First Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text"
                    name="first_name"
                    className="input-field"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text"
                    name="last_name"
                    className="input-field"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="password"
                  name="password"
                  className="input-field"
                  placeholder="Strong password (min 8 chars)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={handleStep1Next}
              >
                Next Step: Demographics ➔
              </button>
            </div>
          )}

          {/* STEP 2: ROLE-TAILORED DEMOGRAPHICS */}
          {step === 2 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Gender <span style={{ color: '#ef4444' }}>*</span></label>
                  <select name="gender" className="input-field" value={formData.gender} onChange={handleChange} required>
                    <option value="M">Male (पुरुष)</option>
                    <option value="F">Female (महिला)</option>
                    <option value="O">Other (अन्य)</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer Not To Say</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Preferred Language <span style={{ color: '#ef4444' }}>*</span></label>
                  <select
                    name="preferred_language"
                    className="input-field"
                    value={formData.preferred_language}
                    onChange={handleChange}
                    required
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name} ({l.native})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Date of Birth (DOB) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="date"
                    name="date_of_birth"
                    className="input-field"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Approx. Age (Years) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="number"
                    name="age"
                    className="input-field"
                    placeholder="e.g. 55"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* HEALTHCARE WORKER SPECIFIC FIELD: Organization / Hospital / PHC */}
              {formData.role === 'healthcare_worker' && (
                <div className="form-group">
                  <label>Hospital / Primary Health Centre (PHC) Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text"
                    name="organization"
                    className="input-field"
                    placeholder="e.g. Sitapur Community Health Centre / PHC"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {/* Live Age Preview Box */}
              {calculatedAge !== null && (
                <div className="age-preview-box">
                  <span>📅 Dynamic Age Calculation:</span>
                  <strong>{calculatedAge} Years Old</strong>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>
                  ⬅️ Back
                </button>
                <button type="button" className="btn-primary" style={{ flex: 2 }} onClick={handleStep2Next}>
                  Next Step: Location & Details ➔
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ROLE-TAILORED LOCATION & EMERGENCY CONTACT */}
          {step === 3 && (
            <div>
              <div className="form-group">
                <label>
                  {formData.role === 'healthcare_worker' ? 'Official Work Phone Number' : 'Mobile Phone Number'}{' '}
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="phone_number"
                  className="input-field"
                  placeholder="+91 9876543210"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {formData.role !== 'healthcare_worker' && (
                  <div className="form-group">
                    <label>Village / Gram Panchayat <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      name="village_or_town"
                      className="input-field"
                      placeholder="e.g. Rampur"
                      value={formData.village_or_town}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="form-group" style={{ gridColumn: formData.role === 'healthcare_worker' ? 'span 2' : 'span 1' }}>
                  <label>
                    {formData.role === 'healthcare_worker' ? 'PHC / District Posting Area' : 'District'}{' '}
                    <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    className="input-field"
                    placeholder="e.g. Sitapur"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>State <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text"
                    name="state"
                    className="input-field"
                    placeholder="e.g. Uttar Pradesh"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>PIN Code <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text"
                    name="pincode"
                    className="input-field"
                    placeholder="261001"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* EMERGENCY CONTACT: Mandatory for Patient & Caregiver, Optional for Healthcare Worker */}
              {formData.role !== 'healthcare_worker' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Emergency Relative Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      name="emergency_contact_name"
                      className="input-field"
                      placeholder="Relative / Guardian Name"
                      value={formData.emergency_contact_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Emergency Relative Phone <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      name="emergency_contact_phone"
                      className="input-field"
                      placeholder="+91 9876500222"
                      value={formData.emergency_contact_phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Secondary / Emergency Contact Name (Optional)</label>
                    <input
                      type="text"
                      name="emergency_contact_name"
                      className="input-field"
                      placeholder="Supervisor / Backup Contact"
                      value={formData.emergency_contact_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Secondary Phone (Optional)</label>
                    <input
                      type="text"
                      name="emergency_contact_phone"
                      className="input-field"
                      placeholder="+91 9876500222"
                      value={formData.emergency_contact_phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>
                  ⬅️ Back
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={loading}>
                  {loading ? 'Creating Profile...' : `Complete Registration as ${formData.role === 'healthcare_worker' ? 'Doctor / Health Worker' : formData.role === 'caregiver' ? 'Caregiver' : 'Patient'} 🚀`}
                </button>
              </div>
            </div>
          )}
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <button
            onClick={() => setCurrentView('login')}
            style={{ background: 'none', border: 'none', color: '#2dd4bf', fontWeight: '600', cursor: 'pointer' }}
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
