import React from 'react';
import { PublicNavbar } from '../../components/marketing/PublicNavbar';
import { AboutPage as AboutContent } from '../../features/public/pages/About/AboutPage';

export const AboutPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 font-sans antialiased">
      <PublicNavbar onNavigate={onNavigate} />
      <main className="flex-1">
        <AboutContent onNavigate={onNavigate} />
      </main>
    </div>
  );
};

export default AboutPage;
