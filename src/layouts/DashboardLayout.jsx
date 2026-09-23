import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/animations/PageTransition';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <PageTransition>
      <div className="min-h-screen text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-black pt-20 flex relative w-full transition-colors duration-200">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col w-full min-w-0">
          <Header setSidebarOpen={setSidebarOpen} />
          
          <main className="flex-1 w-full min-w-0">
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
