import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export const AnimatedBackground = () => {
  const [isDark, setIsDark] = useState(false);

  // Smooth mouse tracking spring
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const springX = useSpring(mouseX, { stiffness: 45, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 20 });

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#FAFCFF] dark:bg-[#08080A] transition-colors duration-500 pointer-events-none select-none">
      {/* 1. Linear / Supabase Precision Technical Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${
            isDark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(14, 165, 233, 0.22)'
          } 1.25px, transparent 1.25px)`,
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 95% 75% at 50% 25%, black 40%, transparent 95%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 95% 75% at 50% 25%, black 40%, transparent 95%)',
        }}
      />

      {/* 2. Top Hero Ambient Spotlight (Breathing Halo - Linear Style) */}
      <motion.div
        animate={{
          scale: [1, 1.08, 0.96, 1],
          opacity: isDark ? [0.45, 0.65, 0.45] : [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[160px] left-1/2 -translate-x-1/2 w-[75vw] max-w-[1100px] h-[520px] rounded-full blur-[100px] sm:blur-[130px] pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.26) 0%, rgba(6, 182, 212, 0.14) 42%, rgba(99, 102, 241, 0.05) 75%, transparent 100%)'
            : 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.38) 0%, rgba(14, 165, 233, 0.20) 45%, rgba(6, 182, 212, 0.06) 80%, transparent 100%)',
        }}
      />

      {/* 3. Interactive Cursor Spotlight (Illuminates Dot Grid on Mouse Hover) */}
      <motion.div
        className="absolute w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] pointer-events-none hidden sm:block"
        style={{
          x: springX,
          y: springY,
          background: isDark
            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, rgba(6, 182, 212, 0.06) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 75%)',
        }}
      />

      {/* 4. Subtle Bottom-Right Ambient Depth Beam */}
      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 25, -20, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[15%] -right-[10%] w-[50vw] max-w-[700px] h-[50vw] max-h-[700px] rounded-full blur-[120px] pointer-events-none opacity-40 dark:opacity-20"
        style={{
          background:
            'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 80%)',
        }}
      />

      {/* 5. Luxury Film Grain Overlay (Prevents Banding & Adds Tactile Depth) */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] brightness-100 contrast-150 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("${noiseSvg}")` }}
      />
    </div>
  );
};

export default AnimatedBackground;
