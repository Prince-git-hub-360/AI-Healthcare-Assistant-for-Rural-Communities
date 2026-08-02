import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const Login = ({ setCurrentView }) => {
  const { login, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    try {
      await login(username, password, selectedRole);
      setCurrentView('profile');
    } catch {
      // Handled in context toast
    }
  };

  const fillDemoPatient = () => {
    setSelectedRole('patient');
    setUsername('rural_patient_test');
    setPassword('StrongPassword@123');
  };

  const fillDemoWorker = () => {
    setSelectedRole('healthcare_worker');
    setUsername('dr_anita_verma');
    setPassword('WorkerPassword@123');
  };

  return (
    <div style={{ width: '100%', maxWidth: '460px' }}>
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>Portal Sign In</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Select your account type to access personalized healthcare services
          </p>
        </div>

        {/* ROLE SELECTOR TABS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedRole('patient')}
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              background: selectedRole === 'patient' ? 'linear-gradient(135deg, #14b8a6, #0f766e)' : 'transparent',
              color: selectedRole === 'patient' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            👨‍🌾 Patient
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('healthcare_worker')}
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              background: selectedRole === 'healthcare_worker' ? 'linear-gradient(135deg, #14b8a6, #0f766e)' : 'transparent',
              color: selectedRole === 'healthcare_worker' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            🩺 Doctor / ASHA
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('caregiver')}
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              background: selectedRole === 'caregiver' ? 'linear-gradient(135deg, #14b8a6, #0f766e)' : 'transparent',
              color: selectedRole === 'caregiver' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            👪 Caregiver
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username / Mobile Number</label>
            <input
              type="text"
              className="input-field"
              placeholder={selectedRole === 'healthcare_worker' ? 'e.g. dr_anita_verma' : 'e.g. rural_patient_test'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', color: '#2dd4bf', fontSize: '12px', cursor: 'pointer' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Authenticating...' : `Sign In as ${selectedRole === 'healthcare_worker' ? 'Doctor / Health Worker' : selectedRole === 'caregiver' ? 'Caregiver' : 'Patient'} 🚀`}
          </button>
        </form>

        <div className="demo-bar">
          <p>Quick Demo Credentials Fill:</p>
          <div className="demo-btns">
            <button type="button" className="btn-demo" onClick={fillDemoPatient}>
              👨‍🌾 Demo Patient
            </button>
            <button type="button" className="btn-demo" onClick={fillDemoWorker}>
              🩺 Demo Health Worker
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentView('register')}
            style={{ background: 'none', border: 'none', color: '#2dd4bf', fontWeight: '600', cursor: 'pointer' }}
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
};
