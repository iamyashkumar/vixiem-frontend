import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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

      <aside
        className={`fixed md:sticky top-20 left-0 h-[calc(100vh-5rem)] w-60 bg-white dark:bg-black border-r border-slate-200 dark:border-neutral-800 p-4 z-40 transform transition-transform duration-200 ease-in-out flex flex-col shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex items-center justify-between md:hidden mb-4 pb-3 border-b border-slate-200 dark:border-neutral-800">
          <Logo size="sm" />
          <button onClick={() => setSidebarOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400 px-3 mb-2">
          Platform
        </div>

        <nav className="flex flex-col gap-1 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`px-3.5 py-2.5 rounded-lg flex items-center font-medium text-xs sm:text-sm transition-all duration-150 ${
                isActive(item.path)
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-neutral-900 font-bold border border-slate-200 dark:border-neutral-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-neutral-900/60'
              }`}
            >
              <item.icon size={17} className={`mr-2.5 shrink-0 ${isActive(item.path) ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`} /> {item.name}
            </Link>
          ))}
        </nav>

        <div className="pt-3 border-t border-slate-200 dark:border-neutral-800">
          <button
            onClick={logout}
            className="w-full px-3.5 py-2 rounded-lg flex items-center text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={16} className="mr-2.5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
