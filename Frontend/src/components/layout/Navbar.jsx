import React from 'react';
import { useAuth, LANGUAGES } from '../../context/AuthContext';

export const Navbar = ({ currentView, setCurrentView }) => {
  const { user, currentLang, updateLanguage, logout, backendHealthy } = useAuth();

  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">🏥</div>
        <div className="brand-text">
          <h2>Swasthya Sanchar</h2>
          <p>AI Healthcare Assistant for Rural Communities</p>
        </div>
      </div>

      <div className="nav-actions">
        {/* Backend API Health Indicator */}
        <div className="status-badge" title="Django API Server Status">
          <span className={`dot ${backendHealthy ? 'online' : 'offline'}`}></span>
          <span>API: {backendHealthy ? 'Connected' : 'Connecting...'}</span>
        </div>

        {/* Multilingual Selector */}
        <select
          className="lang-select"
          value={currentLang}
          onChange={(e) => updateLanguage(e.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name} ({lang.native})
            </option>
          ))}
        </select>

        {/* User Navigation Actions */}
        {user ? (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              className="btn-secondary"
              onClick={() => setCurrentView('medical_documents')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: currentView === 'medical_documents' ? '#2dd4bf' : 'var(--input-border)',
                background: currentView === 'medical_documents' ? 'rgba(20, 184, 166, 0.2)' : 'rgba(30, 41, 59, 0.8)',
                color: currentView === 'medical_documents' ? '#2dd4bf' : '#e2e8f0',
              }}
            >
              📁 Medical Vault
            </button>

            <button
              className="btn-secondary"
              onClick={() => setCurrentView('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: currentView === 'profile' ? '#2dd4bf' : 'var(--input-border)',
                background: currentView === 'profile' ? 'rgba(20, 184, 166, 0.2)' : 'rgba(30, 41, 59, 0.8)',
                color: currentView === 'profile' ? '#2dd4bf' : '#e2e8f0',
              }}
            >
              👤 {user.first_name || user.username}
            </button>
            <button className="btn-secondary" onClick={logout} style={{ borderColor: '#ef4444', color: '#fca5a5' }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`btn-secondary ${currentView === 'login' ? 'active' : ''}`}
              onClick={() => setCurrentView('login')}
            >
              Login
            </button>
            <button
              className="btn-primary"
              style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}
              onClick={() => setCurrentView('register')}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
