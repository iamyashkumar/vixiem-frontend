import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { LogOut, X, FileText, Activity, LayoutDashboard, Cpu } from 'lucide-react';
import { Logo } from './common/Logo';

export const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();
  const location = useLocation();

  // Settings removed from sidebar menu as requested
  const navItems = [
    { name: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'Endpoints', path: '/dashboard/endpoints', icon: Activity },
    { name: 'Logs', path: '/dashboard/logs', icon: FileText },
    { name: 'AI Assistant', path: '/dashboard/ai', icon: Cpu },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path === '/dashboard/overview' && location.pathname === '/dashboard');
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed md:sticky top-24 left-0 h-[calc(100vh-8rem)] w-64 bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-lg dark:shadow-xl dark:shadow-black/40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex items-center justify-between md:hidden mb-5 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Logo size="sm" />
          <button onClick={() => setSidebarOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1">
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-grow mt-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`px-4 py-3 rounded-xl flex items-center font-medium text-sm transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 shadow-sm border border-sky-500/30 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
              }`}
            >
              <item.icon size={18} className="mr-3 shrink-0" /> {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-auto px-4 py-3 rounded-xl flex items-center text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent font-medium text-sm transition-all duration-200 w-full"
        >
          <LogOut size={18} className="mr-3 shrink-0" /> Logout
        </button>
      </motion.aside>
    </>
  );
};

export default Sidebar;
