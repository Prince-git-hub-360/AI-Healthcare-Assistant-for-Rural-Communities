import React from 'react';
import { PatientNavbar } from '../../features/patient/components/PatientNavbar/PatientNavbar';

export const PatientLayout = ({ children, currentView, setCurrentView, onOpenChat }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-900 font-sans antialiased">
      <PatientNavbar currentView={currentView} setCurrentView={setCurrentView} onOpenChat={onOpenChat} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default PatientLayout;
