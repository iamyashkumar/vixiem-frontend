import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const ApiError = ({ message, onRetry }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800 rounded-2xl w-full shadow-sm dark:shadow-xl"
    >
      <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="text-rose-500" size={24} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Something went wrong</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 max-w-md">
        {message || "We encountered an error while fetching your data. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 font-medium text-xs sm:text-sm"
        >
          <RefreshCw size={16} /> Retry
        </button>
      )}
    </motion.div>
  );
};
