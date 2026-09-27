import React from 'react';

export const PageLoader = ({ message = 'Loading...', fullScreen = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
        fullScreen ? 'fixed inset-0 z-50 bg-slate-50/90 dark:bg-black/95 backdrop-blur-md min-h-screen' : 'min-h-[360px] py-16'
      }`}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Pulsing Sky Blue Radial Glow Aura */}
        <div className="absolute -inset-4 bg-sky-400/20 dark:bg-sky-400/25 blur-2xl rounded-full pointer-events-none animate-pulse" />

        {/* Vixiem Logo Emblem with cybernetic pulse */}
        <div className="relative flex items-center justify-center mb-3 animate-pulse">
          <svg
            className="w-14 h-14 text-sky-400 relative z-10 filter drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top accent bar */}
            <path
              d="M 12 14 L 38 14"
              stroke="#38BDF8"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Outer V bracket */}
            <path
              d="M 12 14 L 50 86 L 88 14"
              stroke="#38BDF8"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Middle chevron */}
            <path
              d="M 25 14 L 50 62 L 64 34 L 75 14"
              stroke="#38BDF8"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Inner core chevron */}
            <path
              d="M 38 14 L 50 38 L 62 14"
              stroke="#38BDF8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Focal Node Anchor Dot */}
            <circle
              cx="50"
              cy="86"
              r="5.5"
              fill="#38BDF8"
            />
          </svg>
        </div>

        {/* Brand Text */}
        <div className="flex items-center font-display font-black text-xl tracking-tight text-slate-900 dark:text-white select-none">
          <span>Vixiem</span>
          <span className="text-sky-400 font-black ml-0.5 animate-pulse">
            .
          </span>
        </div>

        {/* High-speed Cybernetic Shimmer Laser Track */}
        <div className="w-40 h-1 bg-slate-200 dark:bg-neutral-900 rounded-full overflow-hidden relative mt-3 border border-slate-300/40 dark:border-neutral-800">
          <div className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-sky-400 to-transparent rounded-full shadow-[0_0_10px_#38bdf8] animate-loader-laser" />
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
