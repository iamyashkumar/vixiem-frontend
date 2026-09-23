import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/animations/PageTransition';
import { CheckCircle } from 'lucide-react';

export const Status = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-transparent text-slate-800 dark:text-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white/90 dark:bg-[#0D0D10]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-black/50 text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-2 font-display">System Status</h1>
          <p className="text-slate-400 flex items-center justify-center gap-2 mt-4 text-lg font-light">
            All systems operational <CheckCircle size={20} className="text-emerald-400" />
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Status;