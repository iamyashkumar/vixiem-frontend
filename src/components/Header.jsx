import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Header = ({ setSidebarOpen }) => {
  const { user } = useAuth();
  
  // Display unique username if available, else derive clean name from email
  const displayName = user?.username || (user?.email ? user.email.split('@')[0] : 'User');

  return (
    <div className="flex items-center justify-between px-6 py-4 w-full bg-white dark:bg-black border-b border-slate-200 dark:border-neutral-800 sticky top-20 z-20 transition-colors duration-200">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mr-3.5 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
              Dashboard Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 hidden sm:block">
            Welcome back, <span className="text-slate-900 dark:text-white font-bold">{displayName}</span>
          </p>
        </div>
      </div>

      {/* Right status info - NO duplicate theme toggle button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="hidden sm:inline font-medium">Telemetry Connected</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
