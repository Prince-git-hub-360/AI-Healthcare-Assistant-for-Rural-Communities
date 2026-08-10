import React from 'react';
import { PublicNavbar } from '../../components/marketing/PublicNavbar';
import { HomePage as HomeContent } from '../../features/public/pages/Home/HomePage';

export const HomePage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 font-sans antialiased">
      <PublicNavbar onNavigate={onNavigate} />
      <main className="flex-1">
        <HomeContent onNavigate={onNavigate} />
      </main>
    </div>
  );
};

export default HomePage;
