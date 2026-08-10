import React from 'react';
import { WorkerNavbar } from '../../features/healthcare-worker/components/WorkerNavbar/WorkerNavbar';

export const HealthcareWorkerLayout = ({ children, currentView, setCurrentView, onOpenChat }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-900 font-sans antialiased">
      <WorkerNavbar currentView={currentView} setCurrentView={setCurrentView} onOpenChat={onOpenChat} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default HealthcareWorkerLayout;
