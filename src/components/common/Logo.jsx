import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'md', showText = true, link = true, className = '' }) => {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-xl' },
    md: { icon: 'w-9 h-9', text: 'text-2xl' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl' },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  const logoContent = (
    <div className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}>
      <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <div className="absolute inset-0 bg-sky-400/30 blur-md rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />

        <svg
          className={`${currentSize.icon} text-sky-400 dark:text-sky-400 relative z-10`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 12 14 L 38 14" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
          <path d="M 12 14 L 50 86 L 88 14" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 25 14 L 50 62 L 64 34 L 75 14" stroke="#38BDF8" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 38 14 L 50 38 L 62 14" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="50" cy="86" r="5" fill="#38BDF8" />
        </svg>
      </div>

      {showText && (
        <span className={`font-display font-extrabold tracking-tight text-zinc-950 dark:text-white flex items-center ${currentSize.text}`}>
          Vixiem
          <span className="text-sky-400 font-black ml-0.5 inline-block">.</span>
        </span>
      )}
    </div>
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
