import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 dark:bg-[#0B0F17] transition-colors duration-300">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      
      {/* Top Left Blob */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 30, -30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-400/20 dark:bg-sky-500/10 blur-[120px]"
      />

      {/* Bottom Right Blob */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-400/15 dark:bg-purple-500/10 blur-[150px]"
      />

      {/* Center Blue Blob */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -50, 20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-indigo-400/15 dark:bg-indigo-500/10 blur-[100px]"
      />
    </div>
  );
};

export default AnimatedBackground;