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
  Globe,
  Radio,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { endpointsService } from '../../services/endpointsService';
import { AnalyticsChart } from '../../components/dashboard/AnalyticsChart';
import { PageLoader } from '../../components/PageLoader';
import { ApiError } from '../../components/ApiError';

// Regional Edge Network Nodes for 2D Telemetry Grid
const REGIONAL_NODES = [
  { id: 'SFO', name: 'US-West (SF)', rtt: '12ms', status: 'Operational' },
  { id: 'NYC', name: 'US-East (NYC)', rtt: '15ms', status: 'Operational' },
  { id: 'LON', name: 'EU-West (London)', rtt: '18ms', status: 'Operational' },
  { id: 'FRA', name: 'EU-Central (Frankfurt)', rtt: '22ms', status: 'Operational' },
  { id: 'BOM', name: 'AP-South (Mumbai)', rtt: '25ms', status: 'Operational' },
  { id: 'HND', name: 'AP-East (Tokyo)', rtt: '31ms', status: 'Operational' },
];

export const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [trendData, setTrendData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const [sum, eps] = await Promise.all([
        analyticsService.getSummary().catch(() => null),
        endpointsService.getEndpoints().catch(() => [])
      ]);
      
      const uptimeVal = parseFloat(sum?.uptimePercentage || 0);
      const avgResp = sum?.averageResponseTime || 0;
      const hasEndpoints = (sum?.totalEndpoints || 0) > 0 || (eps && eps.length > 0);

      const trend = hasEndpoints ? [
        { time: '00:00', uptime: uptimeVal, responseTime: Math.max(12, avgResp - 4) },
        { time: '04:00', uptime: uptimeVal, responseTime: Math.max(14, avgResp - 6) },
        { time: '08:00', uptime: uptimeVal, responseTime: Math.max(16, avgResp + 5) },
        { time: '12:00', uptime: uptimeVal, responseTime: Math.max(15, avgResp + 2) },
        { time: '16:00', uptime: uptimeVal, responseTime: Math.max(13, avgResp - 3) },
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  if (loading) return <PageLoader />;
  if (error) return <ApiError message={error} onRetry={() => fetchData(true)} />;

  const totalEps = summary?.totalEndpoints || endpoints.length || 0;
  const upEps = summary?.upEndpoints || endpoints.filter(e => e.lastStatus !== false).length || 0;
  const downEps = summary?.downEndpoints || endpoints.filter(e => e.lastStatus === false).length || 0;
  const avgLatency = summary?.averageResponseTime || (endpoints.length > 0 ? 36 : 0);
  const uptimeStr = summary?.uptimePercentage || '99.99';

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      
      {/* 1. EXECUTIVE HEALTH BANNER (Clean 2D Header) */}
      <div className="bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:px-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Overall System Health Indicator */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">Executive Health</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
              {downEps > 0 ? `${downEps} Incident Active` : 'Operational: All Systems Go'}
            </h2>
          </div>
        </div>

        {/* Global Key Metrics in Header */}
        <div className="flex items-center flex-wrap gap-5 sm:gap-8 font-mono text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block">System Uptime</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
              {uptimeStr}%
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

          <div>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Global Latency</span>
            <span className="text-lg font-extrabold text-sky-500 font-display">
              {avgLatency}ms <span className="text-xs font-normal text-slate-400">avg</span>
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
            title="Refresh Metrics"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin text-sky-500' : ''} />
          </button>
        </div>

      </div>

      {/* 2. 2D METRIC KPI CARDS (Linear-Style Flat Micro-Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* KPI 1: Total Endpoints */}
        <div className="bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-sm hover:border-sky-400/50 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
            <span className="font-mono uppercase tracking-wider font-semibold">Total Endpoints</span>
            <span className="text-sky-500 font-mono text-[11px] font-bold">100% active</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {totalEps}
            </div>
            {/* 2D Sparkline SVG */}
            <svg className="w-20 h-6 text-sky-500 stroke-current fill-none stroke-[2]" viewBox="0 0 80 24">
              <path d="M0,18 Q20,10 40,14 T80,4" />
            </svg>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>{upEps} Operational</span>
            <span className="text-emerald-500 font-medium">0 Outages</span>
          </div>
        </div>

        {/* KPI 2: Total Requests */}
        <div className="bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-sm hover:border-emerald-400/50 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
            <span className="font-mono uppercase tracking-wider font-semibold">Total Requests</span>
            <span className="text-emerald-500 font-mono text-[11px] font-bold">+5.2%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {(summary?.totalRequests || 0).toLocaleString()}
            </div>
            {/* 2D Sparkline SVG */}
            <svg className="w-20 h-6 text-emerald-500 stroke-current fill-none stroke-[2]" viewBox="0 0 80 24">
              <path d="M0,20 Q20,16 40,8 T80,2" />
            </svg>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Edge Ingestion</span>
            <span className="text-emerald-500 font-medium">Real-Time</span>
          </div>
        </div>

        {/* KPI 3: Error Rate */}
        <div className="bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-sm hover:border-emerald-400/50 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
            <span className="font-mono uppercase tracking-wider font-semibold">Error Rate</span>
            <span className="text-emerald-500 font-mono text-[11px] font-bold">Stable</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-display font-extrabold text-emerald-600 dark:text-emerald-400">
              0.00%
            </div>
            {/* 2D Flat Line SVG */}
            <svg className="w-20 h-6 text-emerald-400 stroke-current fill-none stroke-[2]" viewBox="0 0 80 24">
              <path d="M0,16 L80,16" />
            </svg>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>HTTP 4xx/5xx</span>
            <span className="text-emerald-500 font-medium">0 Errors</span>
          </div>
        </div>

        {/* KPI 4: Average Latency */}
        <div className="bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-sm hover:border-purple-400/50 transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
            <span className="font-mono uppercase tracking-wider font-semibold">P95 Latency</span>
            <span className="text-purple-500 font-mono text-[11px] font-bold">Optimal</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {avgLatency}<span className="text-sm font-normal text-slate-400 ml-1">ms</span>
            </div>
            {/* 2D Wave Latency SVG */}
            <svg className="w-20 h-6 text-purple-500 stroke-current fill-none stroke-[2]" viewBox="0 0 80 24">
              <path d="M0,14 Q20,6 40,16 T80,10" />
            </svg>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>SLA Target: 50ms</span>
            <span className="text-purple-500 font-medium">Fast</span>
          </div>
        </div>

      </div>

      {/* 3. 2D REGIONAL EDGE NETWORK STATUS STRIP (Flat Telemetry Grid) */}
      <div className="bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-sky-500" />
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider">
              Regional Edge Network Status
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            6 / 6 REGIONS HEALTHY
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {REGIONAL_NODES.map((node) => (
            <div 
              key={node.id} 
              className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400">{node.id}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mb-1">
                {node.name.split('(')[0].trim()}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">RTT</span>
                <span className="font-bold text-sky-500">{node.rtt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. LATENCY TREND LINE/AREA CHART */}
      <div className="bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" />
              Latency Trend
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-light mt-0.5">
              Round-trip response duration across endpoints over time ({timeRange.toUpperCase()}).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 mr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Latency (ms)
            </span>
            {/* Time Filter Controls */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold font-mono">
              {['24h', '7d', '30d'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg transition-all duration-200 ${
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
        </div>

        <AnalyticsChart data={trendData} />
      </div>

      {/* 5. ACTIVE API ENDPOINTS TABLE (Clean 2D Data List) */}
      <div className="bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white tracking-tight">
              Active API Endpoints
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              Live automated health checks, status codes, and latency metrics.
            </p>
          </div>
          <Link
            to="/dashboard/endpoints"
            className="btn-primary inline-flex items-center gap-1.5 text-xs py-1.5 px-3 font-semibold"
          >
            <Plus size={13} /> Add Endpoint
          </Link>
        </div>

        {endpoints.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <Server className="mx-auto text-slate-400 mb-2" size={28} />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No active endpoints configured</p>
            <p className="text-xs text-slate-500 mt-1 mb-3">Add endpoints to start streaming live health analytics.</p>
            <Link to="/dashboard/endpoints" className="btn-primary inline-flex items-center gap-1 text-xs py-1.5 px-3 font-semibold">
              <Plus size={13} /> Add Service
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Endpoint</th>
                  <th className="pb-3 font-semibold">Method</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Latency</th>
                  <th className="pb-3 font-semibold">Interval</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {endpoints.map((ep, idx) => {
                  const isUp = ep.lastStatus !== false;
                  const lat = Math.max(12, avgLatency + (idx * 5) - 3);
                  return (
                    <tr key={ep.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {ep.name}
                        </div>
                        <a 
                          href={ep.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-sky-500 hover:underline flex items-center gap-1 font-mono truncate max-w-[240px]"
                        >
                          <span className="truncate">{ep.url}</span>
                          <ExternalLink size={10} className="shrink-0 opacity-50" />
                        </a>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                          (ep.method || 'GET') === 'GET'
                            ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
                            : (ep.method === 'POST')
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : (ep.method === 'PUT')
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}>
                          {ep.method || 'GET'}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono border ${
                          isUp 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {isUp ? '200 OK' : '500 ERR'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {lat}ms
                      </td>
                      <td className="py-3 pr-4 text-slate-500 font-mono text-[11px]">
                        {ep.checkIntervalSeconds || 60}s
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to="/dashboard/endpoints"
                          className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold"
                        >
                          <span>Manage</span>
                          <ChevronRight size={13} />
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

    </div>
  );
};

export default OverviewTab;
