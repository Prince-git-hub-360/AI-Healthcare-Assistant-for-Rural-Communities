import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { HeaderAuth } from './components/layout/HeaderAuth';
import { DashboardPage } from './pages/DashboardPage';
import { TranslatePage } from './pages/TranslatePage';
import { RemindersPage } from './pages/RemindersPage';
import { MedicalVaultPage } from './pages/MedicalVaultPage';
import { EmergencyHelpPage } from './pages/EmergencyHelpPage';
import { ProfilePage } from './pages/ProfilePage';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

function App() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });

  const openAuthModal = (mode = 'login') => {
    setAuthModal({ open: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ open: false, mode: 'login' });
  };

  // If user is authenticated, render Role-Aware Post-Login Portal
  if (user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-900 antialiased">
        {/* Authenticated Header */}
        <HeaderAuth currentView={currentView} setCurrentView={setCurrentView} />

        <main className="flex-1">
          {currentView === 'dashboard' && <DashboardPage setCurrentView={setCurrentView} />}
          {currentView === 'translate' && <TranslatePage />}
          {currentView === 'medical_vault' && <MedicalVaultPage setCurrentView={setCurrentView} />}
          {currentView === 'reminders' && <RemindersPage setCurrentView={setCurrentView} />}
          {currentView === 'emergency' && <EmergencyHelpPage setCurrentView={setCurrentView} />}
          {currentView === 'profile' && <ProfilePage setCurrentView={setCurrentView} />}
          {currentView === 'about' && (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <AboutPage setCurrentView={setCurrentView} openAuthModal={openAuthModal} />
            </div>
          )}
        </main>
      </div>
    );
  }

  // If user is logged out, render Public Corporate Landing Page
  return (
    <div>
      <HomePage />
    </div>
  );
}

export default App;
