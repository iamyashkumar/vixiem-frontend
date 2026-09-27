import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggleFAB = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark / Light Theme"
      className="fixed bottom-6 right-6 z-[9990] p-3.5 rounded-full bg-white/90 dark:bg-[#141418]/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-300/40 dark:shadow-black/70 text-slate-800 dark:text-slate-100 hover:border-sky-400/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="transition-transform duration-200">
        {isDark ? (
          <Sun className="w-5 h-5 text-sky-400 group-hover:rotate-45 transition-transform" />
        ) : (
          <Moon className="w-5 h-5 text-sky-500 group-hover:-rotate-12 transition-transform" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggleFAB;
