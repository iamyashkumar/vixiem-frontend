import React from 'react';
import { motion } from 'framer-motion';

export const PageLoader = ({ message = 'Loading...', fullScreen = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
        fullScreen ? 'fixed inset-0 z-50 bg-slate-50/90 dark:bg-black/95 backdrop-blur-md min-h-screen' : 'min-h-[360px] py-16'
      }`}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Pulsing Sky Blue Radial Glow Aura */}
        <motion.div
          className="absolute -inset-4 bg-sky-400/20 dark:bg-sky-400/25 blur-2xl rounded-full pointer-events-none"
          animate={{
            scale: [0.95, 1.25, 0.95],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Vixiem Logo Emblem with cybernetic pulse */}
        <motion.div
          className="relative flex items-center justify-center mb-3"
          animate={{
            scale: [0.98, 1.03, 0.98],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            className="w-14 h-14 text-sky-400 relative z-10 filter drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top accent bar */}
            <motion.path
              d="M 12 14 L 38 14"
              stroke="#38BDF8"
              strokeWidth="7"
              strokeLinecap="round"
              initial={{ pathLength: 0.2, opacity: 0.8 }}
              animate={{ pathLength: [0.3, 1, 0.3], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Outer V bracket */}
            <motion.path
              d="M 12 14 L 50 86 L 88 14"
              stroke="#38BDF8"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.4 }}
              animate={{ pathLength: [0.4, 1, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            />

            {/* Middle chevron */}
            <motion.path
              d="M 25 14 L 50 62 L 64 34 L 75 14"
              stroke="#38BDF8"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.3 }}
              animate={{ pathLength: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            />

            {/* Inner core chevron */}
            <motion.path
              d="M 38 14 L 50 38 L 62 14"
              stroke="#38BDF8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.5 }}
              animate={{ pathLength: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />

            {/* Focal Node Anchor Dot */}
            <motion.circle
              cx="50"
              cy="86"
              r="5.5"
              fill="#38BDF8"
              animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>

        {/* Brand Text */}
        <div className="flex items-center font-display font-black text-xl tracking-tight text-slate-900 dark:text-white select-none">
          <span>Vixiem</span>
          <motion.span
            className="text-sky-400 font-black ml-0.5"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            .
          </motion.span>
        </div>

        {/* High-speed Cybernetic Shimmer Laser Track (No round circle!) */}
        <div className="w-40 h-1 bg-slate-200 dark:bg-neutral-900 rounded-full overflow-hidden relative mt-3 border border-slate-300/40 dark:border-neutral-800">
          <motion.div
            className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-sky-400 to-transparent rounded-full shadow-[0_0_10px_#38bdf8]"
            animate={{ x: [-80, 160] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Clean Tech Status / Message */}
        <span className="text-[11px] font-mono tracking-widest text-slate-500 dark:text-neutral-400 uppercase mt-2.5 select-none font-medium">
          {message}
        </span>
      </div>
    </div>
  );
};

export default PageLoader;
