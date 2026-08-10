import React from 'react';
import { PublicNavbar } from '../marketing/PublicNavbar';

export const AuthLayout = ({ children, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 font-sans antialiased">
      <PublicNavbar onNavigate={onNavigate} />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
