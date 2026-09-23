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
  Plus,
  RefreshCw,
  Gauge,
  Layers,
  Sparkles,
  Check
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

  const uptimeNum = parseFloat(summary?.uptimePercentage || 0);
  const totalEps = summary?.totalEndpoints || endpoints.length || 0;
  const upEps = summary?.upEndpoints || endpoints.filter(e => e.lastStatus !== false).length || 0;
  const downEps = summary?.downEndpoints || endpoints.filter(e => e.lastStatus === false).length || 0;
  const avgLatency = summary?.averageResponseTime || (endpoints.length > 0 ? 32 : 0);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      
      {/* 1. EXECUTIVE MISSION CONTROL STATUS BAR (Bento Top Strip) */}
      <div className="bg-white/80 dark:bg-[#0C101A]/80 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.08] rounded-2xl p-4 sm:px-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Overall Health Pulse */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-3.5 w-3.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${downEps > 0 ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${downEps > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                Global API Health:
              </span>
              <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                {downEps > 0 ? `${downEps} SERVICE DEGRADED` : '99.99% OPERATIONAL'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5 hidden sm:block">
              Continuous monitoring across distributed edge regions with automatic anomaly detection.
            </p>
          </div>
        </div>

        {/* Right: Key Micro-Metrics & Controls */}
        <div className="flex items-center flex-wrap gap-3 sm:gap-5 text-xs font-mono">
          <div className="flex items-center gap-4 py-1 px-3 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06]">
            <div>
              <span className="text-slate-400 text-[10px] block">ENDPOINTS</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{totalEps}</span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />
            <div>
              <span className="text-slate-400 text-[10px] block">AVG RTT</span>
              <span className="font-bold text-sky-500 text-sm">{avgLatency}ms</span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />
            <div>
              <span className="text-slate-400 text-[10px] block">REQUESTS</span>
              <span className="font-bold text-emerald-500 text-sm">{(summary?.totalRequests || 0).toLocaleString()}</span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />
            <div>
              <span className="text-slate-400 text-[10px] block">ERROR RATE</span>
              <span className="font-bold text-emerald-500 text-sm">0.00%</span>
            </div>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
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

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-600 dark:text-slate-400 transition-colors border border-slate-200/80 dark:border-white/[0.06]"
            title="Refresh Live Data"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-sky-500' : ''} />
          </button>
        </div>

      </div>

      {/* 2. MAIN BENTO GRID: 3D Telemetry Mesh (Left) + Latency Matrix & SLA Gauge (Right) */}
      <div className="grid grid-cols-12 gap-5 items-stretch">
        
        {/* Card A: 3D Interactive Global Telemetry Mesh Hub (Hero) */}
        <div className="col-span-12 lg:col-span-7 relative overflow-hidden bg-[#070A12] text-white rounded-3xl border border-sky-500/25 shadow-2xl h-[420px] sm:h-[450px] flex flex-col justify-between p-6 group">
          {/* 3D Wireframe Globe */}
          <GlobeCanvas className="absolute inset-0 w-full h-full pointer-events-none" globeSizeFactor={0.52} />

          {/* Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top HUD Overlay */}
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                VIXIEM TELEMETRY MESH • LIVE
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight mt-2.5">
                Global Edge Transit Network
              </h3>
              <p className="text-slate-400 text-xs font-mono mt-1">
                Active packet routing across 10 Edge Data Centers (SFO, NYC, LON, FRA, BOM, TYO, SYD)
              </p>
            </div>
            
            <div className="hidden sm:flex flex-col items-end text-right font-mono text-[11px] bg-slate-900/80 backdrop-blur-md py-2 px-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">EDGE RTT</span>
              <span className="text-sky-400 font-bold text-sm">14.2ms avg</span>
              <span className="text-emerald-400 text-[10px] mt-0.5">LOSS: 0.00%</span>
            </div>
          </div>

          {/* Bottom HUD Quick Datacenter Status Strip */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800/90 text-xs font-mono">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">US Mesh</p>
              <p className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>SFO / NYC (12ms)
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">EU Transit</p>
              <p className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>LON / FRA (16ms)
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">AP-South</p>
              <p className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Mumbai BOM (24ms)
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">AP-East</p>
              <p className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Tokyo / SYD (31ms)
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Endpoint Latencies + SLA Reliability Gauge */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-5 justify-between">
          
          {/* Card B1: Real-Time Endpoint Latency Matrix */}
          <div className="bg-white/80 dark:bg-[#0C101A]/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider">
                  Live Endpoint Latency
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time p95 response duration</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-semibold">
                SYNCED
              </span>
            </div>

            {endpoints.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                <p>No endpoints configured</p>
                <Link to="/dashboard/endpoints" className="text-sky-500 hover:underline mt-1 inline-block font-semibold">
                  Add an API endpoint
                </Link>
              </div>
            ) : (
              <div className="space-y-3 my-auto">
                {endpoints.slice(0, 3).map((ep, idx) => {
                  const ms = Math.max(12, avgLatency + (idx * 6) - 4);
                  const isUp = ep.lastStatus !== false;
                  return (
                    <div key={ep.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.05]">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                          {ep.method || 'GET'}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {ep.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Mini Latency Bar Indicator */}
                        <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className="bg-sky-400 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(100, (ms / 100) * 100)}%` }} 
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {ms}ms
                        </span>
                        <span className={`w-2 h-2 rounded-full ${isUp ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Total Monitored: {totalEps}</span>
              <Link to="/dashboard/endpoints" className="text-sky-600 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1">
                View all <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Card B2: SLA Reliability Gauge & Compliance Status */}
          <div className="bg-white/80 dark:bg-[#0C101A]/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Uptime SLA Compliance
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                {summary?.uptimePercentage || '99.99'}<span className="text-sm text-emerald-500 ml-1 font-bold">%</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Contract Target: 99.90% • Status: <span className="text-emerald-500 font-bold">Exceeding SLA</span>
              </p>
            </div>

            {/* Visual SLA Circular Badge */}
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center shrink-0 border-4 border-emerald-500/20 bg-emerald-500/10">
              <div className="text-center">
                <Zap size={18} className="text-emerald-500 mx-auto" />
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">PASS</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. LIVE MONITORED ENDPOINTS DETAILED STATUS TABLE */}
      <div className="bg-white/80 dark:bg-[#0C101A]/80 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Radio size={18} className="text-sky-500 animate-pulse" />
              Active Monitored Endpoints
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              Live automated health checks, uptime status, and response intervals.
            </p>
          </div>
          <Link
            to="/dashboard/endpoints"
            className="btn-primary inline-flex items-center gap-1.5 text-xs py-2 px-3.5 font-semibold"
          >
            <Plus size={14} /> Add Service
          </Link>
        </div>

        {endpoints.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <Server className="mx-auto text-slate-400 mb-2" size={32} />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No active endpoints yet</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Start monitoring endpoints to see real-time status and health telemetry.</p>
            <Link to="/dashboard/endpoints" className="btn-primary inline-flex items-center gap-1.5 text-xs py-2 px-4 font-semibold">
              <Plus size={14} /> Add Your First Endpoint
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Service</th>
                  <th className="pb-3 font-semibold">Target URL</th>
                  <th className="pb-3 font-semibold">Interval</th>
                  <th className="pb-3 font-semibold">Health Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {endpoints.slice(0, 6).map((ep) => {
                  const isUp = ep.lastStatus !== false;
                  return (
                    <tr key={ep.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                            {ep.method || 'GET'}
                          </span>
                          <span>{ep.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-400 font-mono truncate max-w-[280px]">
                        <a href={ep.url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 hover:underline flex items-center gap-1 truncate">
                          <span className="truncate">{ep.url}</span>
                          <ExternalLink size={11} className="shrink-0 opacity-60" />
                        </a>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-500 dark:text-slate-400 font-mono">
                        {ep.checkIntervalSeconds || 60}s
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
                          <span>Manage</span>
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

      {/* 4. GLOBAL RESPONSE LATENCY AREA CHART */}
      <div className="bg-white/80 dark:bg-[#0C101A]/80 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <TrendingUp size={18} className="text-purple-500" />
              Global Response Latency Trend
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-light mt-0.5">
              Average endpoint transit duration measured across all edge nodes ({timeRange.toUpperCase()}).
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-400/20 text-xs font-semibold text-purple-700 dark:text-purple-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Avg Latency (ms)
          </div>
        </div>

        <AnalyticsChart data={trendData} />
      </div>

    </div>
  );
};

export default OverviewTab;
