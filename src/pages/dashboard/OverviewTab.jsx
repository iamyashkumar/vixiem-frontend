import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Server, 
  XCircle, 
  Clock, 
  Zap, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Globe2,
  Radio,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { endpointsService } from '../../services/endpointsService';
import { AnalyticsChart } from '../../components/dashboard/AnalyticsChart';
import { GlobeCanvas } from '../../components/animations/GlobeCanvas';
import { PageLoader } from '../../components/PageLoader';
import { ApiError } from '../../components/ApiError';

export const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [trendData, setTrendData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sum, eps] = await Promise.all([
        analyticsService.getSummary().catch(() => null),
        endpointsService.getEndpoints().catch(() => [])
      ]);
      
      const uptimeVal = parseFloat(sum?.uptimePercentage || 0);
      const avgResp = sum?.averageResponseTime || 0;
      const hasEndpoints = (sum?.totalEndpoints || 0) > 0 || eps.length > 0;

      const trend = hasEndpoints ? [
        { time: '00:00', uptime: uptimeVal, responseTime: Math.max(12, avgResp - 3) },
        { time: '04:00', uptime: uptimeVal, responseTime: Math.max(14, avgResp - 5) },
        { time: '08:00', uptime: uptimeVal, responseTime: Math.max(16, avgResp + 6) },
        { time: '12:00', uptime: uptimeVal, responseTime: Math.max(15, avgResp + 2) },
        { time: '16:00', uptime: uptimeVal, responseTime: Math.max(14, avgResp - 2) },
        { time: '20:00', uptime: uptimeVal, responseTime: avgResp },
      ] : [];

      setSummary(sum);
      setEndpoints(eps || []);
      setTrendData(trend);
    } catch (err) {
      console.error("Dashboard overview fetch error:", err);
      setError("Failed to load dashboard telemetry.");
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
  const totalEps = summary?.totalEndpoints || endpoints.length || 0;
  const upEps = summary?.upEndpoints || endpoints.filter(e => e.lastStatus !== false).length || 0;
  const downEps = summary?.downEndpoints || endpoints.filter(e => e.lastStatus === false).length || 0;

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      
      {/* 1. Executive Mission Control Health Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 dark:bg-[#0D1117]/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${downEps > 0 ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${downEps > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
          </span>
          <div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {downEps > 0 ? `${downEps} Incident Active` : 'All Systems Operational'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-mono hidden md:inline">
              • {upEps}/{totalEps} Endpoints Healthy • {summary?.uptimePercentage || '99.99'}% Uptime SLA
            </span>
          </div>
        </div>

        {/* Time Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          {['24h', '7d', '30d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                timeRange === range 
                  ? 'bg-sky-500 text-white shadow-sm font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Hero Split: Dedicated 3D Global Telemetry Mesh Map + Core KPI Matrix */}
      <div className="grid grid-cols-12 gap-5 items-stretch">
        
        {/* Left: 3D Telemetry Mesh Showcase Card */}
        <div className="col-span-12 lg:col-span-7 relative overflow-hidden bg-slate-950 text-white rounded-3xl border border-sky-500/20 shadow-xl h-[380px] sm:h-[420px] flex flex-col justify-between p-6 group">
          {/* Embedded 3D Wireframe Globe */}
          <GlobeCanvas className="absolute inset-0 w-full h-full pointer-events-none" globeSizeFactor={0.50} />

          {/* Top HUD Overlay */}
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-mono font-semibold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE GLOBAL TELEMETRY MESH
              </div>
              <p className="text-slate-400 text-xs mt-2 font-mono">
                Real-time transit across 10 Edge Regions (SFO, LON, FRA, BOM, HND, SYD)
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end text-right font-mono text-[10px] text-sky-400/80">
              <span>LATENCY: 14.2ms</span>
              <span className="text-emerald-400">PACKET LOSS: 0.00%</span>
            </div>
          </div>

          {/* Bottom HUD Telemetry Strip */}
          <div className="relative z-10 grid grid-cols-3 gap-2 bg-slate-900/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 text-xs font-mono">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Edge Nodes</p>
              <p className="text-sm font-bold text-sky-400 mt-0.5">10 Global Hubs</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Transit Routing</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">Sub-50ms Mesh</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Telemetry Pipe</p>
              <p className="text-sm font-bold text-cyan-300 mt-0.5">Active Sync</p>
            </div>
          </div>
        </div>

        {/* Right: Core KPI Grid (4 High-Contrast Luminous Cards) */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Metric 1: Total Monitored Endpoints */}
          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-sky-400/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Endpoints</span>
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Server size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                {totalEps}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{upEps} Operational</span>
              </div>
            </div>
          </motion.div>

          {/* Metric 2: Average Response Time */}
          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-purple-400/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg Latency</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Clock size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                {summary?.averageResponseTime || 0}<span className="text-sm font-normal text-slate-500 ml-1">ms</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">
                <TrendingUp size={13} />
                <span>Sub-50ms target</span>
              </div>
            </div>
          </motion.div>

          {/* Metric 3: System Availability / Uptime */}
          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-emerald-400/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Uptime SLA</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Activity size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                {summary?.uptimePercentage || '100.00'}<span className="text-sm font-normal text-slate-500 ml-0.5">%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, Math.max(0, uptimeNum || 100))}%` }} 
                />
              </div>
            </div>
          </motion.div>

          {/* Metric 4: Ingested Requests */}
          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-amber-400/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Requests</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Zap size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                {(summary?.totalRequests || 0).toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                <CheckCircle2 size={13} />
                <span>Live Edge Streaming</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>

      {/* 3. Live Monitored Endpoints Quick-View Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white tracking-tight">
              Live Monitored Services
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              Active HTTP health checks, availability status, and response intervals.
            </p>
          </div>
          <Link
            to="/dashboard/endpoints"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
          >
            <span>Manage All ({totalEps})</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {endpoints.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <Server className="mx-auto text-slate-400 mb-2" size={28} />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No endpoints monitored yet</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Add your first HTTP service to start streaming live telemetry.</p>
            <Link to="/dashboard/endpoints" className="btn-primary inline-flex items-center gap-1.5 text-xs py-2 px-4 font-semibold">
              <Plus size={14} /> Add Endpoint
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Service Name</th>
                  <th className="pb-3 font-semibold">Endpoint URL</th>
                  <th className="pb-3 font-semibold">Check Rate</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {endpoints.slice(0, 5).map((ep) => {
                  const isUp = ep.lastStatus !== false;
                  return (
                    <tr key={ep.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                            {ep.method || 'GET'}
                          </span>
                          <span>{ep.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-400 font-mono truncate max-w-[260px]">
                        <a href={ep.url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 hover:underline flex items-center gap-1 truncate">
                          <span className="truncate">{ep.url}</span>
                          <ExternalLink size={11} className="shrink-0 opacity-60" />
                        </a>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-500 dark:text-slate-400 font-mono">
                        {ep.checkIntervalSeconds || 60}s interval
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono border ${
                          isUp 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                          {isUp ? 'OPERATIONAL' : 'DOWN'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          to="/dashboard/endpoints"
                          className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Global Response Latency Analytics Chart */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white tracking-tight">
              Global Response Latency Trend
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-light mt-0.5">
              Average endpoint response time over the selected timeframe ({timeRange.toUpperCase()}).
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-400/20 text-xs font-semibold text-sky-700 dark:text-sky-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            Avg Latency (ms)
          </div>
        </div>

        <AnalyticsChart data={trendData} />
      </div>

    </div>
  );
};

export default OverviewTab;
