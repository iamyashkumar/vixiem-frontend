import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isOverview = location.pathname === '/dashboard' || location.pathname === '/dashboard/overview';

  return (
    <PageTransition>
      <div className="min-h-screen text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-black pt-20 flex relative w-full transition-colors duration-200">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col w-full min-w-0">
          {/* Header ONLY shown on Overview page */}
          {isOverview ? (
            <Header setSidebarOpen={setSidebarOpen} />
          ) : (
            /* Minimal mobile hamburger button for non-overview pages */
            <div className="md:hidden flex items-center px-4 py-3 bg-white dark:bg-black border-b border-slate-200 dark:border-neutral-800 sticky top-20 z-20">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Open sidebar"
              >
                <Menu size={22} />
              </button>
            </div>
          )}
          
          {/* 100% Full Width across ALL pages, no max-w-7xl constraint */}
          <main className={`flex-1 w-full min-w-0 ${isOverview ? '' : 'p-6 sm:px-8 py-6'}`}>
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardLayout;
