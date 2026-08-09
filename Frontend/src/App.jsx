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
import { SwasthyaMitrChatModal } from './components/medical/SwasthyaMitrChatModal';
import { SparklesIcon } from './components/ui/Icons';

function App() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });
  const [chatModalOpen, setChatModalOpen] = useState(false);

  const openAuthModal = (mode = 'login') => {
    setAuthModal({ open: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ open: false, mode: 'login' });
  };

  // If user is authenticated, render Role-Aware Post-Login Portal
  if (user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-900 antialiased relative">
        {/* Authenticated Header */}
        <HeaderAuth
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenChat={() => setChatModalOpen(true)}
        />

        <main className="flex-1">
          {currentView === 'dashboard' && <DashboardPage setCurrentView={setCurrentView} onOpenChat={() => setChatModalOpen(true)} />}
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

        {/* Floating AI Health Assistant Companion Button (Swasthya Mitr) */}
        <button
          onClick={() => setChatModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-teal-800 hover:bg-teal-900 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer border-2 border-teal-500/30"
          title="Ask Swasthya Mitr AI Voice & Chat"
        >
          <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center animate-pulse">
            <SparklesIcon size={14} color="#ffffff" />
          </div>
          <span className="font-extrabold text-xs tracking-wide hidden sm:inline">Ask AI Assistant</span>
        </button>

        {/* Multimodal AI Native Voice & Chat Assistant Modal */}
        <SwasthyaMitrChatModal
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
        />
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

