import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggleFAB = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      aria-label="Toggle Dark / Light Theme"
      className="fixed bottom-6 right-6 z-[9990] p-3.5 rounded-full bg-white/90 dark:bg-[#182234]/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-300/40 dark:shadow-black/70 text-slate-800 dark:text-slate-100 hover:border-sky-500/50 transition-all flex items-center justify-center group"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
        ) : (
          <Moon className="w-5 h-5 text-sky-600 group-hover:-rotate-12 transition-transform" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggleFAB;
