import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../components/animations/PageTransition';
import { LogOut, Menu, X, BarChart2, TrendingUp, FileText, CheckCircle } from 'lucide-react';
import { AnalyticsChart } from '../components/dashboard/AnalyticsChart';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { label: 'API Calls', value: '1.2M', change: '+12%', isPositive: true },
    { label: 'Errors', value: '234', change: '-8%', isPositive: false },
    { label: 'Uptime', value: '99.9%', change: '+0.2%', isPositive: true },
    { label: 'Avg Response', value: '145ms', change: '-5%', isPositive: true },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0D0D10] text-slate-200 pt-16 flex">
        
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-[#0D0D10] border-r border-slate-800 p-6 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <div className="flex items-center justify-between md:hidden mb-6">
            <span className="font-bold text-lg text-white">Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-2 flex-grow">
            <Link to="/dashboard" className="px-4 py-3 rounded-xl flex items-center text-sky-400 bg-sky-400/10 border border-sky-400/20 font-semibold transition-colors">
              <BarChart2 size={18} className="mr-3" /> Dashboard
            </Link>
            <Link to="/analytics" className="px-4 py-3 rounded-xl flex items-center text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium transition-colors">
              <TrendingUp size={18} className="mr-3" /> Analytics
            </Link>
            <Link to="/logs" className="px-4 py-3 rounded-xl flex items-center text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium transition-colors">
              <FileText size={18} className="mr-3" /> Logs
            </Link>
            <Link to="/status" className="px-4 py-3 rounded-xl flex items-center text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium transition-colors">
              <CheckCircle size={18} className="mr-3" /> Status
            </Link>
          </nav>

          <button
            onClick={() => {
              logout();
            }}
            className="mt-auto px-4 py-3 rounded-xl flex items-center text-rose-400 hover:bg-rose-500/10 font-medium transition-colors w-full"
          >
            <LogOut size={18} className="mr-3" /> Logout
          </button>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden w-full">
          {/* Mobile Header Toggle */}
          <div className="md:hidden flex items-center mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-400 hover:text-white mr-4"
            >
              <Menu size={28} />
            </button>
            <h1 className="text-2xl font-bold text-white font-display">Dashboard</h1>
          </div>

          <motion.div
            className="mb-8 hidden md:block"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="text-3xl font-bold text-white mb-2 font-display" variants={itemVariants}>Dashboard</motion.h1>
            <motion.p className="text-slate-400 font-light" variants={itemVariants}>
              Welcome back, {user?.email}!
            </motion.p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-[#141418] border border-slate-800/90 rounded-2xl p-6 shadow-xl shadow-black/30 hover:border-sky-400/40 transition-colors"
                variants={itemVariants}
                whileHover={{ translateY: -4 }}
              >
                <div className="text-sm text-slate-400 mb-2 font-light">{stat.label}</div>
                <div className="text-3xl font-bold text-white mb-2 font-display">{stat.value}</div>
                <div className={`text-xs font-semibold ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.change}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Activity & Chart */}
          <motion.div
            className="bg-[#141418] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/30"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <div className="border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-xl font-bold text-white font-display">Performance Analytics (Last 7 Days)</h3>
              <p className="text-sm text-slate-400 mt-1 font-light">Average Response Time</p>
            </div>
            
            <AnalyticsChart />
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Dashboard;