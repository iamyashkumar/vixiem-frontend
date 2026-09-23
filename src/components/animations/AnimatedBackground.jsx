import React from 'react';
import { motion } from 'framer-motion';

const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#FAFCFF] dark:bg-[#08080A] transition-colors duration-500 pointer-events-none">
      {/* Luxury Film Grain Texture to prevent color banding */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.045] brightness-100 contrast-150 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("${noiseSvg}")` }}
      />

      {/* Aurora Stream 1: Top-Left Swirling Cyan & Utah Sky Ribbon */}
      <motion.div
        animate={{
          x: ['-5%', '8%', '-3%', '-5%'],
          y: ['-10%', '6%', '-4%', '-10%'],
          scale: [1, 1.15, 0.95, 1],
          rotate: [0, 18, -12, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-[40%_60%_70%_30%] blur-[75px] sm:blur-[90px] opacity-70 dark:opacity-35"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(56, 189, 248, 0.45) 0%, rgba(6, 182, 212, 0.3) 45%, rgba(14, 165, 233, 0.1) 75%, transparent 100%)',
        }}
      />

      {/* Aurora Stream 2: Top-Right Floating Arctic Sky & Indigo Beam */}
      <motion.div
        animate={{
          x: ['5%', '-10%', '6%', '5%'],
          y: ['-8%', '10%', '-5%', '-8%'],
          scale: [1.05, 0.9, 1.18, 1.05],
          rotate: [0, -22, 14, 0],
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[10%] -right-[12%] w-[60vw] h-[60vw] max-w-[850px] max-h-[850px] rounded-[60%_40%_30%_70%] blur-[80px] sm:blur-[95px] opacity-65 dark:opacity-30"
        style={{
          background: 'radial-gradient(circle at 60% 40%, rgba(14, 165, 233, 0.4) 0%, rgba(56, 189, 248, 0.25) 40%, rgba(99, 102, 241, 0.12) 70%, transparent 100%)',
        }}
      />

      {/* Aurora Stream 3: Center-Right Floating Electric Cyan Wave */}
      <motion.div
        animate={{
          x: ['-8%', '12%', '-6%', '-8%'],
          y: ['5%', '-12%', '8%', '5%'],
          scale: [0.92, 1.12, 1.02, 0.92],
          rotate: [0, 15, -18, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[25%] left-[20%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-[50%_50%_40%_60%] blur-[85px] sm:blur-[100px] opacity-55 dark:opacity-25"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.35) 0%, rgba(14, 165, 233, 0.2) 50%, transparent 80%)',
        }}
      />

      {/* Aurora Stream 4: Bottom-Left Gentle Counter-Flow Breeze */}
      <motion.div
        animate={{
          x: ['6%', '-8%', '4%', '6%'],
          y: ['8%', '-6%', '10%', '8%'],
          scale: [1, 1.1, 0.92, 1],
          rotate: [0, -16, 12, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[15%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-[45%_55%_65%_35%] blur-[75px] sm:blur-[90px] opacity-60 dark:opacity-25"
        style={{
          background: 'radial-gradient(circle at 40% 60%, rgba(56, 189, 248, 0.38) 0%, rgba(6, 182, 212, 0.22) 45%, transparent 75%)',
        }}
      />

      {/* Aurora Stream 5: Bottom-Right Deep Azure Horizon Glow */}
      <motion.div
        animate={{
          x: ['-4%', '6%', '-5%', '-4%'],
          y: ['-6%', '8%', '-7%', '-6%'],
          scale: [1.08, 0.96, 1.12, 1.08],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[12%] -right-[8%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-[55%_45%_35%_65%] blur-[70px] sm:blur-[85px] opacity-50 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle at 55% 55%, rgba(14, 165, 233, 0.35) 0%, rgba(34, 211, 238, 0.18) 50%, transparent 80%)',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
