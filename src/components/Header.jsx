import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

export const Header = ({ setSidebarOpen }) => {
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  
  // Display unique username if available, else derive clean name from email
  const displayName = user?.username || (user?.email ? user.email.split('@')[0] : 'User');

  return (
    <div className="flex items-center justify-between p-4 sm:p-5 md:px-8 md:py-4 w-full border-b border-sky-200/80 dark:border-sky-400/20 bg-white/90 dark:bg-[#0D0D10]/90 backdrop-blur-md relative z-20 transition-colors duration-300">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-sky-600 dark:text-sky-400 hover:text-sky-400 transition-colors mr-3.5 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-zinc-950 dark:text-white mb-0.5 tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm hidden sm:block">
            Welcome back, <span className="text-sky-500 dark:text-sky-400 font-bold">{displayName}</span>!
          </p>
        </div>
      </div>

      {/* Theme Switcher Toggle - Yellow & Black (Dark) / White & Yellow (Light) */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="relative flex items-center justify-center p-2.5 rounded-xl bg-sky-50 dark:bg-[#18181C] border border-sky-300/80 dark:border-sky-400/30 text-sky-800 dark:text-sky-300 hover:border-sky-400 transition-all duration-300 shadow-sm active:scale-95 group"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun size={20} className="text-sky-400 transition-transform duration-300 group-hover:rotate-45" />
          ) : (
            <Moon size={20} className="text-sky-500 transition-transform duration-300 group-hover:-rotate-12" />
          )}
          <span className="hidden md:inline-block ml-2 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;
