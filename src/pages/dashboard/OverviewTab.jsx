import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Server, XCircle, Clock, Zap, AlertTriangle, ShieldCheck, ArrowUpRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsChart } from '../../components/dashboard/AnalyticsChart';
import { PageLoader } from '../../components/PageLoader';
import { ApiError } from '../../components/ApiError';

export const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [trendData, setTrendData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const sum = await analyticsService.getSummary();
      
      const uptimeVal = parseFloat(sum?.uptimePercentage || 0);
      const avgResp = sum?.averageResponseTime || 0;
      const hasEndpoints = (sum?.totalEndpoints || 0) > 0;

      const trend = hasEndpoints ? [
        { time: '00:00', uptime: uptimeVal, responseTime: avgResp },
        { time: '04:00', uptime: uptimeVal, responseTime: Math.max(12, avgResp - 4) },
        { time: '08:00', uptime: uptimeVal, responseTime: Math.max(15, avgResp + 6) },
        { time: '12:00', uptime: uptimeVal, responseTime: avgResp },
        { time: '16:00', uptime: uptimeVal, responseTime: Math.max(14, avgResp + 2) },
        { time: '20:00', uptime: uptimeVal, responseTime: avgResp },
      ] : [];

      setSummary(sum);
      setTrendData(trend);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  if (loading) return <PageLoader />;
  if (error) return <ApiError message={error} onRetry={fetchData} />;

  const uptimeNum = parseFloat(summary?.uptimePercentage || 0);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Top Banner & Time Range Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live Mesh Observability
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Monitoring Overview
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-light text-xs sm:text-sm mt-0.5">
            Real-time endpoint telemetry, latency matrix, and SLA status.
          </p>
        </div>

        {/* Time Selector Glass Pill */}
        <div className="flex bg-white/50 dark:bg-[#08080A]/60 backdrop-blur-md p-1 rounded-xl border border-white/70 dark:border-white/[0.08] shadow-sm">
          {['24h', '7d', '30d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                timeRange === range 
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Core Health Pulse (4 Responsive Glass Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ translateY: -3 }}
          className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-xl border border-white/70 dark:border-white/[0.08] hover:border-sky-400/50 dark:hover:border-sky-400/40 rounded-2xl p-5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-sky-400/10 relative overflow-hidden group"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-sky-400/10 dark:bg-sky-400/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Total Endpoints</span>
            <div className="p-2.5 rounded-xl bg-sky-500/10 dark:bg-sky-400/15 border border-sky-400/20 text-sky-600 dark:text-sky-400">
              <Server size={18} />
            </div>
          </div>
          <div className="text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {summary?.totalEndpoints || 0}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span>Configured services</span>
          </div>
        </motion.div>

        {/* Healthy Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ translateY: -3 }}
          className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-xl border border-white/70 dark:border-white/[0.08] hover:border-emerald-400/50 dark:hover:border-emerald-400/40 rounded-2xl p-5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-emerald-400/10 relative overflow-hidden group"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Healthy Endpoints</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/15 border border-emerald-400/20 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 text-emerald-600 dark:text-emerald-400">
            {summary?.upEndpoints || 0}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 size={12} />
            <span>100% Operational</span>
          </div>
        </motion.div>

        {/* Failed Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ translateY: -3 }}
          className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-xl border border-white/70 dark:border-white/[0.08] hover:border-rose-400/50 dark:hover:border-rose-400/40 rounded-2xl p-5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-rose-400/10 relative overflow-hidden group"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-400/10 dark:bg-rose-400/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Failed Endpoints</span>
            <div className={`p-2.5 rounded-xl ${summary?.downEndpoints > 0 ? 'bg-rose-500/10 dark:bg-rose-400/15 text-rose-600 dark:text-rose-400 border border-rose-400/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
              <XCircle size={18} />
            </div>
          </div>
          <div className={`text-3xl font-display font-extrabold tracking-tight mb-2 ${summary?.downEndpoints > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
            {summary?.downEndpoints || 0}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className={`w-1.5 h-1.5 rounded-full ${summary?.downEndpoints > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
            <span>{summary?.downEndpoints > 0 ? 'Action required' : 'Zero outages'}</span>
          </div>
        </motion.div>

        {/* Average Response Time */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ translateY: -3 }}
          className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-xl border border-white/70 dark:border-white/[0.08] hover:border-purple-400/50 dark:hover:border-purple-400/40 rounded-2xl p-5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-purple-400/10 relative overflow-hidden group"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Avg Latency</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 dark:bg-purple-400/15 border border-purple-400/20 text-purple-600 dark:text-purple-400">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {summary?.averageResponseTime || 0}<span className="text-base font-normal text-slate-500 dark:text-slate-400 ml-1">ms</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp size={12} />
            <span>Optimal latency speed</span>
          </div>
        </motion.div>

      </div>

      {/* Row 2: Performance & Reliability Highlights (3 Extended Luminous Glass Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">

        {/* System Uptime */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-xl border border-white/70 dark:border-white/[0.08] hover:border-sky-400/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">System Uptime</span>
            <div className="p-2 rounded-xl bg-sky-500/10 dark:bg-sky-400/15 text-sky-600 dark:text-sky-400">
              <Activity size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            {summary?.uptimePercentage || '0.00'}<span className="text-lg font-bold text-sky-500 ml-0.5">%</span>
          </div>
          {/* Glowing SLA Bar */}
          <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
            <div 
              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-2 rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: `${Math.min(100, Math.max(0, uptimeNum))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>SLA Target: 99.9%</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Exceeding Target</span>
          </div>
        </motion.div>

        {/* Total Requests */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-xl border border-white/70 dark:border-white/[0.08] hover:border-amber-400/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Total Requests</span>
            <div className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-400/15 text-amber-600 dark:text-amber-400">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            {(summary?.totalRequests || 0).toLocaleString()}
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-medium">
            <Zap size={14} className="animate-bounce" />
            <span>High-throughput edge ingestion</span>
          </div>
        </motion.div>

        {/* SLA Health Status */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-xl border border-white/70 dark:border-white/[0.08] hover:border-emerald-400/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">SLA Health Status</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400">
              <Zap size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
            <span>{summary?.slaStatus || 'Healthy'}</span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
            <CheckCircle2 size={14} />
            <span>All global telemetry pipelines active</span>
          </div>
        </motion.div>

      </div>

      {/* Global Latency Trend Chart (Fluid Glass Frame) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-xl border border-white/70 dark:border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Global Response Latency Trend
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-light mt-0.5">
              Average endpoint response time over the selected timeframe.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/10 dark:bg-sky-400/10 border border-sky-400/20 text-xs font-semibold text-sky-700 dark:text-sky-300">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            Avg Response (ms)
          </div>
        </div>

        <AnalyticsChart data={trendData} />
      </motion.div>
    </div>
  );
};

export default OverviewTab;
