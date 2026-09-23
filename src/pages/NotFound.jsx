import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center pt-20 transition-colors duration-200 text-slate-800 dark:text-slate-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 max-w-md bg-white/90 dark:bg-[#0D0D10]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl"
      >
        <h1 className="text-6xl font-display font-extrabold text-sky-400 mb-4">404</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg font-light">Page not found</p>
        <Link to="/" className="btn-primary inline-block">
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;