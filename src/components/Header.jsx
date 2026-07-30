import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Header = ({ setSidebarOpen }) => {
  const { user } = useAuth();
  
  // Display unique username if available, else derive clean name from email
  const displayName = user?.username || (user?.email ? user.email.split('@')[0] : 'User');

  return (
    <div className="flex items-center justify-between p-5 sm:p-6 md:p-8 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131C2E] relative z-20 transition-colors duration-200">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors mr-3.5 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white mb-0.5 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm hidden sm:block">
            Welcome back, <span className="text-sky-600 dark:text-sky-400 font-bold">{displayName}</span>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
