import React from 'react';
import { PublicNavbar } from '../../components/marketing/PublicNavbar';
import { AboutPage as AboutContent } from '../../features/public/pages/About/AboutPage';

export const AboutPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0B0F17] text-stone-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <PublicNavbar onNavigate={onNavigate} />
      <main className="flex-1">
        <AboutContent onNavigate={onNavigate} />
      </main>
    </div>
  );
};

export default AboutPage;
