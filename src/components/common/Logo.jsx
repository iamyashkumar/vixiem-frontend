import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Logo = ({ size = 'md', showText = true, link = true, className = '' }) => {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-xl' },
    md: { icon: 'w-9 h-9', text: 'text-2xl' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl' },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  const logoContent = (
    <motion.div 
      className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}
      whileHover="hover"
      initial="initial"
    >
      {/* Animated V Emblem */}
      <motion.div 
        className="relative flex items-center justify-center"
        variants={{
          hover: { scale: 1.1, rotate: [0, -4, 4, 0], transition: { duration: 0.4 } }
        }}
      >
        {/* Glow backdrop pulse */}
        <motion.div 
          className="absolute inset-0 bg-sky-400/30 blur-md rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        <svg
          className={`${currentSize.icon} text-sky-500 dark:text-sky-400 relative z-10`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Left Connecting Bar */}
          <motion.path 
            d="M 12 14 L 38 14" 
            stroke="currentColor" 
            strokeWidth="7" 
            strokeLinecap="round"
            initial={{ pathLength: 0.2, opacity: 0.8 }}
            animate={{ pathLength: [0.2, 1, 0.2], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Outer V Stripe */}
          <motion.path 
            d="M 12 14 L 50 86 L 88 14" 
            stroke="currentColor" 
            strokeWidth="7" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ pathLength: 0.4 }}
            animate={{ pathLength: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />
          
          {/* Middle Left & Intertwined M Line */}
          <motion.path 
            d="M 25 14 L 50 62 L 64 34 L 75 14" 
            stroke="#38BDF8" 
            strokeWidth="6.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ pathLength: 0.3 }}
            animate={{ pathLength: [0.3, 1, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
          
          {/* Inner V Stripe */}
          <motion.path 
            d="M 38 14 L 50 38 L 62 14" 
            stroke="#818CF8" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ pathLength: 0.5 }}
            animate={{ pathLength: [0.5, 1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />

          {/* Animated Telemetry Core Node */}
          <motion.circle 
            cx="50" 
            cy="86" 
            r="5" 
            fill="#38BDF8"
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>

      {/* Brand Typography - Vixiem */}
      {showText && (
        <span className={`font-display font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center ${currentSize.text}`}>
          Vixiem
          <motion.span 
            className="text-sky-500 font-black ml-0.5 inline-block"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            .
          </motion.span>
        </span>
      )}
    </motion.div>
  );

  if (link) {
    return (
      <Link to="/" className="inline-block focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo;
