/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',   // ✅ ye line add karo
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        velorix: {
          950: '#0B0F17', // Deep Midnight Slate Base
          900: '#0F172A', // Rich Dark Slate
          800: '#1E293B', // Solid Card & Panel Slate
          700: '#334155', // High Contrast Borders & Dividers
          teal: '#0EA5E9', // Primary Electric Sky Blue / Cyan
          blue: '#6366F1', // Secondary Indigo Accent
          purple: '#8B5CF6', // Purple Highlight
          200: '#F8FAFC', // Crisp Slate-50 Primary Text
          400: '#94A3B8'  // Clean Slate-400 Muted Text
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}