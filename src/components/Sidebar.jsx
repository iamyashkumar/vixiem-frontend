import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { LogOut, X, FileText, Activity, LayoutDashboard, Cpu } from 'lucide-react';
import { Logo } from './common/Logo';

export const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();
  const location = useLocation();

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
            className="fixed inset-0 bg-black/60 dark:bg-black/80 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed md:sticky top-24 left-0 h-[calc(100vh-8rem)] w-64 bg-white/85 dark:bg-[#0D0D10]/85 backdrop-blur-xl border border-sky-200/80 dark:border-sky-400/20 rounded-2xl p-5 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-lg dark:shadow-xl dark:shadow-black/60 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex items-center justify-between md:hidden mb-5 pb-3 border-b border-sky-200 dark:border-sky-400/20">
          <Logo size="sm" />
          <button onClick={() => setSidebarOpen(false)} className="text-zinc-500 dark:text-zinc-400 hover:text-sky-400 p-1">
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
                  ? 'text-sky-800 dark:text-sky-300 bg-sky-400/20 dark:bg-sky-400/10 shadow-sm border border-sky-400/40 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-sky-400/10 border border-transparent'
              }`}
            >
              <item.icon size={18} className={`mr-3 shrink-0 ${isActive(item.path) ? 'text-sky-500 dark:text-sky-400' : ''}`} /> {item.name}
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
