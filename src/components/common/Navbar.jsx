import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Settings, LogOut, ChevronDown, Zap } from 'lucide-react';
import { Logo } from './Logo';
import { aiService } from '../../services/aiService';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [aiQuota, setAiQuota] = useState(null);
  const { isAuthenticated, logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isHome = location.pathname === '/';

  // Fetch AI credits status whenever dropdown is opened or on mount
  useEffect(() => {
    if (isAuthenticated) {
      aiService.getLimitStatus()
        .then(res => setAiQuota(res))
        .catch(err => console.error("Error fetching AI limit", err));
    }
  }, [isAuthenticated, profileOpen]);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 w-full z-50 bg-white/80 dark:bg-[#08080A]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm dark:shadow-black/20 transition-colors duration-200"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo on Left */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/" className={`font-medium transition-colors ${isHome ? 'text-sky-500 dark:text-sky-400 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400'}`}>
              Home
            </Link>

            {isHome && (
              <>
                <a href="#features" className="text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors">
                  How It Works
                </a>
                <a href="#pricing" className="text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors">
                  Pricing
                </a>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className={`font-medium transition-colors ${isDashboardRoute ? 'text-sky-500 dark:text-sky-400 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400'}`}>
                  Dashboard
                </Link>
                
                {/* Single Top Navbar Profile Avatar SYMBOL ONLY (Text "Profile" Removed as requested) */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="User Profile Menu"
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all border border-transparent focus:outline-none flex items-center gap-1.5"
                    title="User Profile Menu"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 text-white flex items-center justify-center text-white font-bold shadow-md border border-white/20 text-sm">
                      {(user?.username || user?.email)?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-600 dark:text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#141418] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 divide-y divide-slate-100 dark:divide-slate-800"
                      >
                        <div className="pb-2.5">
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">User Account</p>
                          <p className="text-xs font-bold text-sky-500 dark:text-sky-400 truncate mt-0.5">@{user?.username || user?.email?.split('@')[0]}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        </div>

                        {/* AI Credits Status Badge */}
                        <div className="py-2">
                          <div className="p-2.5 bg-sky-400/10 dark:bg-sky-400/15 border border-sky-400/25 rounded-xl">
                            <div className="flex items-center justify-between text-xs font-semibold text-sky-500 dark:text-sky-400">
                              <span className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                                AI Credits:
                              </span>
                              <span className="font-mono">{aiQuota ? `${aiQuota.remainingCalls} / ${aiQuota.dailyCallsLimit}` : 'Loading...'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="py-1.5 space-y-1">
                          <Link
                            to="/dashboard/settings"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all"
                          >
                            <Settings size={15} className="text-sky-400" />
                            <span>Profile & Settings</span>
                          </Link>
                        </div>

                        <div className="pt-1.5">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all w-full text-left"
                          >
                            <LogOut size={15} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Action Area (Hamburger) */}
          {!isDashboardRoute && (
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-[#0D0D10] border-b border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl"
          >
            <div className="px-6 pt-4 pb-6 space-y-4 flex flex-col">
              <Link
                to="/"
                className="block text-slate-800 dark:text-slate-200 hover:text-sky-400 font-medium text-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {isHome && (
                <>
                  <a
                    href="#features"
                    className="block text-slate-600 dark:text-slate-300 hover:text-sky-400 font-medium text-base pl-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="block text-slate-600 dark:text-slate-300 hover:text-sky-400 font-medium text-base pl-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How It Works
                  </a>
                  <a
                    href="#pricing"
                    className="block text-slate-600 dark:text-slate-300 hover:text-sky-400 font-medium text-base pl-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </a>
                </>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block text-slate-800 dark:text-slate-200 hover:text-sky-400 font-medium text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="block text-sky-400 font-medium text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile & Settings
                  </Link>
                </>
              ) : (
                <div className="pt-2 flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="block w-full text-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 py-3 rounded-xl font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-center block py-3 text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;