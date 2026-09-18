import React from 'react';
import { motion } from 'framer-motion';

const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-white dark:bg-[#08080A] transition-colors duration-300">
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] brightness-100 contrast-150 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("${noiseSvg}")` }}
      ></div>
      
      {/* Top Left Warm Amber Glow */}
      <motion.div
        animate={{
          x: [0, 40, -40, 0],
          y: [0, 25, -25, 0],
          scale: [1, 1.08, 0.92, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-300/20 dark:bg-sky-400/10 blur-[130px]"
      />

      {/* Bottom Right Golden Yellow Glow */}
      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, -35, 50, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-sky-300/15 dark:bg-sky-500/10 blur-[150px]"
      />

      {/* Center Soft Sunburst Glow */}
      <motion.div
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -40, 15, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-sky-400/10 dark:bg-sky-400/5 blur-[110px]"
      />
    </div>
  );
};

export default AnimatedBackground;
