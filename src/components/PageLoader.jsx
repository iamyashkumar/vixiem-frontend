import React from 'react';
import { motion } from 'framer-motion';

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[400px]">
      <motion.div
        className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-sky-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};
