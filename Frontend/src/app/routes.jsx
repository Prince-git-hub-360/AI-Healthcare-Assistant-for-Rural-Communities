import React, { useState, useEffect } from 'react';
import { useAuth } from '../shared/context/AuthContext';
import { ROUTES, getRoleDefaultRoute } from '../utils/routes';

// Layouts
import { AppNavbar } from '../components/application/AppNavbar';
import { SwasthyaMitrChatModal } from '../features/patient/components/VoiceAssistant/SwasthyaMitrChatModal';
import { SparklesIcon } from '../shared/icons/Icons';

// Public Pages
import { LandingPage as HomePage } from '../pages/LandingPage';
import { AboutPage } from '../pages/public/AboutPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Application Pages
import { PatientDashboard } from '../pages/application/patient/PatientDashboard';
import { PatientProfile } from '../pages/application/patient/PatientProfile';
import { TranslatePrescription } from '../pages/application/patient/TranslatePrescription';
import { MedicalVault } from '../pages/application/patient/MedicalVault';
import { MedicationReminders } from '../pages/application/patient/MedicationReminders';
import { EmergencyHelp } from '../pages/application/patient/EmergencyHelp';
import { EmergencyPatientCardPage } from '../features/patient/pages/Emergency/EmergencyPatientCardPage';

import { AshaDashboard } from '../pages/application/asha/AshaDashboard';
import { AshaProfile } from '../pages/application/asha/AshaProfile';

import { DoctorDashboard } from '../pages/application/doctor/DoctorDashboard';
import { DoctorProfile } from '../pages/application/doctor/DoctorProfile';

import { CaregiverDashboard } from '../pages/application/caregiver/CaregiverDashboard';

export const AppRoutes = () => {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || ROUTES.PUBLIC.HOME);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || ROUTES.PUBLIC.HOME);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path, sectionId) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);

    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const role = user?.role || 'patient';
  const defaultAppRoute = getRoleDefaultRoute(role);

  // PUBLIC EMERGENCY CARD ROUTE: (/emergency-card/*)
  if (currentPath.startsWith('/emergency-card/')) {
    return <EmergencyPatientCardPage />;
  }


  // AUTH GUARD 1: Authenticated user visiting /login or /register -> Redirect to role dashboard
  if (user && (currentPath === ROUTES.AUTH.LOGIN || currentPath === ROUTES.AUTH.REGISTER)) {
    window.history.replaceState({}, '', defaultAppRoute);
    return <AuthenticatedApp currentPath={defaultAppRoute} navigate={navigate} onOpenChat={() => setChatModalOpen(true)} chatModalOpen={chatModalOpen} setChatModalOpen={setChatModalOpen} />;
  }

  // AUTH GUARD 2: Unauthenticated user visiting /app/* -> Redirect to /login
  if (!user && currentPath.startsWith('/app')) {
    window.history.replaceState({}, '', ROUTES.AUTH.LOGIN);
    return <LoginPage onNavigate={navigate} onSuccess={(targetRoute) => navigate(targetRoute)} />;
  }

  // ROUTE 1: PUBLIC HOME (/)
  if (currentPath === ROUTES.PUBLIC.HOME || currentPath === ROUTES.PUBLIC.HOW_IT_WORKS || currentPath === ROUTES.PUBLIC.SOLUTIONS || currentPath === ROUTES.PUBLIC.ROADMAP) {
    return <HomePage onNavigate={navigate} />;
  }

  // ROUTE 2: PUBLIC ABOUT (/about)
  if (currentPath === ROUTES.PUBLIC.ABOUT) {
    return <AboutPage onNavigate={navigate} />;
  }

  // ROUTE 3: AUTH LOGIN (/login)
  if (currentPath === ROUTES.AUTH.LOGIN) {
    return <LoginPage onNavigate={navigate} onSuccess={(targetRoute) => navigate(targetRoute)} />;
  }

  // ROUTE 4: AUTH REGISTER (/register)
  if (currentPath === ROUTES.AUTH.REGISTER) {
    return <RegisterPage onNavigate={navigate} onSuccess={(targetRoute) => navigate(targetRoute)} />;
  }

  // ROUTE 5: AUTHENTICATED APPLICATION (/app/*)
  if (user && currentPath.startsWith('/app')) {
    return (
      <AuthenticatedApp 
        currentPath={currentPath} 
        navigate={navigate} 
        onOpenChat={() => setChatModalOpen(true)} 
        chatModalOpen={chatModalOpen} 
        setChatModalOpen={setChatModalOpen} 
      />
    );
  }

  // FALLBACK ROUTE: Redirect to Home
  return <HomePage onNavigate={navigate} />;
};

const AuthenticatedApp = ({ currentPath, navigate, onOpenChat, chatModalOpen, setChatModalOpen }) => {
  const { user } = useAuth();
  const role = user?.role || 'patient';
  const [selectedMedForAI, setSelectedMedForAI] = useState(null);

  useEffect(() => {
    const handleOpenAIWithMed = (e) => {
      if (e.detail?.medicine) {
        setSelectedMedForAI(e.detail.medicine);
      }
      setChatModalOpen(true);
    };
    window.addEventListener('swasthya:open_ai_assistant', handleOpenAIWithMed);
    return () => window.removeEventListener('swasthya:open_ai_assistant', handleOpenAIWithMed);
  }, [setChatModalOpen]);

  const renderContent = () => {
    // PATIENT ROUTES
    if (currentPath === ROUTES.APP.PATIENT.DASHBOARD || currentPath === '/app/patient/care') {
      return <PatientDashboard setCurrentView={(view) => handleLegacyView(view, navigate, role)} onOpenChat={onOpenChat} />;
    }
    if (currentPath === ROUTES.APP.PATIENT.TRANSLATE) {
      return <TranslatePrescription setCurrentView={(view) => handleLegacyView(view, navigate, role)} />;
    }
    if (currentPath === ROUTES.APP.PATIENT.HEALTH_VAULT) {
      return <MedicalVault setCurrentView={(view) => handleLegacyView(view, navigate, role)} />;
    }
    if (currentPath === ROUTES.APP.PATIENT.REMINDERS) {
      return <MedicationReminders setCurrentView={(view) => handleLegacyView(view, navigate, role)} />;
    }
    if (currentPath === ROUTES.APP.PATIENT.EMERGENCY) {
      return <EmergencyHelp setCurrentView={(view) => handleLegacyView(view, navigate, role)} />;
    }
    if (currentPath === ROUTES.APP.PATIENT.PROFILE || currentPath === ROUTES.APP.ASHA.PROFILE || currentPath === ROUTES.APP.DOCTOR.PROFILE || currentPath === ROUTES.APP.CAREGIVER.PROFILE) {
      return <PatientProfile setCurrentView={(view) => handleLegacyView(view, navigate, role)} />;
    }

    // ASHA WORKER ROUTES
    if (currentPath === ROUTES.APP.ASHA.DASHBOARD || currentPath === ROUTES.APP.ASHA.PATIENTS || currentPath === ROUTES.APP.ASHA.FOLLOW_UPS) {
      return <AshaDashboard setCurrentView={(view) => handleLegacyView(view, navigate, role)} />;
    }

    // DOCTOR ROUTES
    if (currentPath === ROUTES.APP.DOCTOR.DASHBOARD || currentPath === ROUTES.APP.DOCTOR.PATIENTS || currentPath === ROUTES.APP.DOCTOR.PRESCRIPTIONS) {
      return <DoctorDashboard setCurrentView={(view) => handleLegacyView(view, navigate, role)} />;
    }

    // CAREGIVER ROUTES
    if (currentPath === ROUTES.APP.CAREGIVER.DASHBOARD) {
      return <CaregiverDashboard setCurrentView={(view) => handleLegacyView(view, navigate, role)} />;
    }

    // Default to Patient / Role Dashboard
    if (role === 'healthcare_worker') return <AshaDashboard setCurrentView={(view) => handleLegacyView(view, navigate, role)} />;
    if (role === 'doctor') return <DoctorDashboard setCurrentView={(view) => handleLegacyView(view, navigate, role)} />;
    if (role === 'caregiver') return <CaregiverDashboard setCurrentView={(view) => handleLegacyView(view, navigate, role)} />;
    return <PatientDashboard setCurrentView={(view) => handleLegacyView(view, navigate, role)} onOpenChat={onOpenChat} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 antialiased relative font-sans transition-colors duration-200">
      <AppNavbar currentPath={currentPath} onNavigate={navigate} onOpenChat={() => { setSelectedMedForAI(null); onOpenChat(); }} />

      <main className="flex-1 lg:pl-[248px] transition-all duration-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </div>
      </main>

      {/* Floating AI Health Assistant Companion Button (Compact & Elegant - REQ 3 & 4) */}
      <button
        type="button"
        onClick={() => { setSelectedMedForAI(null); onOpenChat(); }}
        className="fixed bottom-5 right-5 z-40 bg-[#E2A233] hover:bg-[#c88d28] text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-full shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer border border-[#E2A233]/40"
        title="Ask Swasthya AI Assistant"
      >
        <SparklesIcon size={16} className="animate-pulse text-slate-950" />
        <span className="hidden sm:inline">✦ Ask Swasthya AI</span>
      </button>

      {/* AI Voice Assistant Modal */}
      <SwasthyaMitrChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        initialMedicine={selectedMedForAI}
      />
    </div>
  );
};

// Legacy View Mapping Helper (for backward compatibility with components using setCurrentView('translate'))
const handleLegacyView = (view, navigate, role) => {
  switch (view) {
    case 'dashboard':
    case 'care':
      navigate(getRoleDefaultRoute(role));
      break;
    case 'translate':
      navigate(ROUTES.APP.PATIENT.TRANSLATE);
      break;
    case 'medical_vault':
    case 'medical_documents':
      navigate(ROUTES.APP.PATIENT.HEALTH_VAULT);
      break;
    case 'reminders':
      navigate(ROUTES.APP.PATIENT.REMINDERS);
      break;
    case 'emergency':
      navigate(ROUTES.APP.PATIENT.EMERGENCY);
      break;
    case 'profile':
      navigate(ROUTES.APP.PATIENT.PROFILE);
      break;
    case 'login':
      navigate(ROUTES.AUTH.LOGIN);
      break;
    case 'register':
      navigate(ROUTES.AUTH.REGISTER);
      break;
    case 'landing':
    case 'home':
    default:
      navigate(ROUTES.PUBLIC.HOME);
      break;
  }
};

export default AppRoutes;
