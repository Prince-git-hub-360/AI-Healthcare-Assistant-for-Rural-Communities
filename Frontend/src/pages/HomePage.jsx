import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Login } from '../components/auth/Login';
import { Register } from '../components/auth/Register';
import { ProfileDashboard } from '../components/profile/ProfileDashboard';
import { MedicalDocuments } from '../components/medical/MedicalDocuments';
import { Toast } from '../components/ui/Toast';

function HomePage() {
  const { user, toast } = useAuth();
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    if (user) {
      if (currentView !== 'medical_documents') {
        setCurrentView('profile');
      }
    } else {
      setCurrentView('login');
    }
  }, [user]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="main-content">
        {!user && currentView === 'login' && <Login setCurrentView={setCurrentView} />}
        {!user && currentView === 'register' && <Register setCurrentView={setCurrentView} />}
        {user && currentView === 'profile' && <ProfileDashboard />}
        {user && currentView === 'medical_documents' && <MedicalDocuments />}
      </main>

      <Toast toast={toast} />
    </div>
  );
}

export default HomePage;
