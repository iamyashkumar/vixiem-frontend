import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { 
  LogOut, 
  X, 
  FileText, 
  Activity, 
  LayoutDashboard, 
  Cpu, 
  PanelLeftClose, 
  PanelLeftOpen 
} from 'lucide-react';
import { Logo } from './common/Logo';

export const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();
  const location = useLocation();

  // Persist collapsed state in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('vixiem_sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('vixiem_sidebar_collapsed', String(next));
      return next;
    });
  };

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
        className={`fixed md:sticky top-20 left-0 h-[calc(100vh-5rem)] bg-white dark:bg-black border-r border-slate-200 dark:border-neutral-800 p-3 z-40 transform transition-all duration-200 ease-in-out flex flex-col shrink-0 ${
          isCollapsed ? 'md:w-16' : 'md:w-60'
        } ${sidebarOpen ? 'w-60 translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Mobile Header (Close Drawer) */}
        <div className="flex items-center justify-between md:hidden mb-4 pb-3 border-b border-slate-200 dark:border-neutral-800">
          <Logo size="sm" />
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Desktop Header with Open/Close Toggle Button */}
        <div className={`hidden md:flex items-center mb-3 pb-2 border-b border-slate-100 dark:border-neutral-800/80 ${
          isCollapsed ? 'justify-center' : 'justify-between px-2'
        }`}>
          {!isCollapsed && (
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">
              Platform
            </span>
          )}
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors"
            title={isCollapsed ? "Expand sidebar (Open)" : "Collapse sidebar (Close)"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Mobile label */}
        <div className="md:hidden text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400 px-3 mb-2">
          Platform
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 flex-grow">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                title={item.name}
                className={`py-2.5 rounded-lg flex items-center font-medium text-xs sm:text-sm transition-all duration-150 ${
                  isCollapsed ? 'justify-center px-2' : 'px-3.5'
                } ${
                  active
                    ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-neutral-900 font-bold border border-slate-200 dark:border-neutral-700 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-neutral-900/60'
                }`}
              >
                <item.icon 
                  size={18} 
                  className={`shrink-0 ${active ? 'text-slate-900 dark:text-white' : 'text-slate-400'} ${
                    isCollapsed ? '' : 'mr-2.5'
                  }`} 
                />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="pt-3 border-t border-slate-200 dark:border-neutral-800">
          <button
            onClick={logout}
            title="Logout"
            className={`w-full py-2.5 rounded-lg flex items-center text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ${
              isCollapsed ? 'justify-center px-2' : 'px-3.5'
            }`}
          >
            <LogOut size={17} className={`shrink-0 ${isCollapsed ? '' : 'mr-2.5'}`} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
