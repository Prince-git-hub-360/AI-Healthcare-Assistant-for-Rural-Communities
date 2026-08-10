import React from 'react';
import { CaregiverNavbar } from '../../features/caregiver/components/CaregiverNavbar/CaregiverNavbar';

export const CaregiverLayout = ({ children, currentView, setCurrentView, onOpenChat }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-900 font-sans antialiased">
      <CaregiverNavbar currentView={currentView} setCurrentView={setCurrentView} onOpenChat={onOpenChat} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default CaregiverLayout;
