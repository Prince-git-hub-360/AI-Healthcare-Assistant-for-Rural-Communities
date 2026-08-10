import React from 'react';
import { PublicNavbar } from '../../features/public/components/PublicNavbar/PublicNavbar';

export const PublicLayout = ({ children, currentView, setCurrentView, openAuthModal }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-900 font-sans antialiased">
      {currentView !== 'landing' && (
        <PublicNavbar currentView={currentView} setCurrentView={setCurrentView} openAuthModal={openAuthModal} />
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;
