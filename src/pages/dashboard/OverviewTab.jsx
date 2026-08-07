import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Server, XCircle, Clock, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsChart } from '../../components/dashboard/AnalyticsChart';
import { PageLoader } from '../../components/PageLoader';
import { ApiError } from '../../components/ApiError';

const StatCard = ({ label, value, icon: Icon, colorClass, bgBadgeClass, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ translateY: -3 }}
    className="bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-sm dark:shadow-lg dark:shadow-black/30 transition-all duration-300 hover:border-sky-500/40"
  >
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2.5 rounded-xl ${bgBadgeClass || 'bg-slate-100 dark:bg-[#0F172A]'} border border-slate-200 dark:border-slate-700/60`}>
        <Icon className={colorClass} size={22} />
      </div>
    </div>
    <div className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">{value}</div>
    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
  </motion.div>
);

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
        { time: '04:00', uptime: uptimeVal, responseTime: avgResp },
        { time: '08:00', uptime: uptimeVal, responseTime: avgResp },
        { time: '12:00', uptime: uptimeVal, responseTime: avgResp },
        { time: '16:00', uptime: uptimeVal, responseTime: avgResp },
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

  return (
    <div className="space-y-8 animate-in fade-in duration-300 w-full">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">Monitoring Overview</h2>
           <p className="text-slate-600 dark:text-slate-400 font-light text-xs sm:text-sm mt-0.5">Real-time metrics and endpoint health status across your services.</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-[#0F172A] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {['24h', '7d', '30d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                timeRange === range 
                  ? 'bg-sky-500 text-white shadow-md font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard index={0} label="Total Endpoints" value={summary?.totalEndpoints || 0} icon={Server} colorClass="text-sky-600 dark:text-sky-400" />
        <StatCard index={1} label="Healthy Endpoints" value={summary?.upEndpoints || 0} icon={ShieldCheck} colorClass="text-emerald-600 dark:text-emerald-400" />
        <StatCard index={2} label="Failed Endpoints" value={summary?.downEndpoints || 0} icon={XCircle} colorClass="text-rose-600 dark:text-rose-400" />
        <StatCard index={3} label="Avg Response Time" value={(summary?.averageResponseTime || 0) + 'ms'} icon={Clock} colorClass="text-purple-600 dark:text-purple-400" />
        <StatCard index={4} label="System Uptime" value={(summary?.uptimePercentage || '0.00') + '%'} icon={Activity} colorClass="text-cyan-600 dark:text-cyan-400" />
        <StatCard index={5} label="Total Requests" value={summary?.totalRequests || 0} icon={AlertTriangle} colorClass="text-amber-600 dark:text-amber-400" />
        <StatCard index={6} label="SLA Health Status" value={summary?.slaStatus || 'Healthy'} icon={Zap} colorClass="text-yellow-500 dark:text-yellow-400" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 col-span-1 lg:col-span-2 shadow-sm dark:shadow-xl dark:shadow-black/30"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
             <div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white">Global Response Latency Trend</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-light">Average endpoint response time over the selected timeframe.</p>
             </div>
             <div className="flex items-center gap-4">
                <span className="flex items-center text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-sky-400 mr-2"></div>
                  Avg Response (ms)
                </span>
             </div>
          </div>
          <AnalyticsChart data={trendData} />
        </motion.div>
      </div>
    </div>
  );
};

export default OverviewTab;
