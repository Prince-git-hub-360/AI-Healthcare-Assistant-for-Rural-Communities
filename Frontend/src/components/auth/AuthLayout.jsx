import React from 'react';
import { PublicNavbar } from '../marketing/PublicNavbar';

export const AuthLayout = ({ children, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0B0F17] text-stone-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <PublicNavbar onNavigate={onNavigate} />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
