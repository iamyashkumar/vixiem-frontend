import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, FileText, ExternalLink, XCircle } from 'lucide-react';
import { logsService } from '../../services/logsService';
import { endpointsService } from '../../services/endpointsService';
import { LogStatusBadge } from '../../components/LogStatusBadge';
import { PageLoader } from '../../components/PageLoader';
import { ApiError } from '../../components/ApiError';

import { config } from '../../config/env';

export const LogsTab = () => {
  const [logs, setLogs] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [highlightLogId, setHighlightLogId] = useState(null);
  
  // Filters & Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    endpointId: '',
    status: '', // 'UP' or 'DOWN'
    keyword: ''
  });

  // Debounce search input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => (prev.keyword === searchTerm ? prev : { ...prev, keyword: searchTerm }));
      setPage(0);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchEndpoints = async () => {
    try {
      const data = await endpointsService.getEndpoints();
      setEndpoints(data);
    } catch (err) {
      console.error("Failed to load endpoints for filters", err);
    }
  };

  const fetchLogs = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setIsRefreshing(!showLoader);
    setError(null);
    try {
      const isUp = filters.status === 'UP' ? true : filters.status === 'DOWN' ? false : null;
      const params = { page, size: 10 };
      if (filters.level) params.level = filters.level;
      if (filters.keyword) params.keyword = filters.keyword;
      
      const response = await logsService.getLogs(params);
      setLogs(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch logs. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [page, filters]);

  // Initial load
  useEffect(() => {
    fetchEndpoints();
  }, []);

  useEffect(() => {
    fetchLogs(true);
  }, [fetchLogs]);

  // Connect to SSE for real-time log updates
  useEffect(() => {
    const sseUrl = `${config.apiBaseUrl}/api/sse/subscribe`;
    let eventSource;

    try {
      eventSource = new EventSource(sseUrl, { withCredentials: true });

      eventSource.addEventListener('INIT', () => {
        setIsLiveConnected(true);
      });

      eventSource.addEventListener('LOG_ENTRY', (event) => {
        try {
          const newLog = JSON.parse(event.data);
          setHighlightLogId(newLog.id);
          setLogs(prev => [newLog, ...prev]);
          setTotalElements(prev => prev + 1);

          setTimeout(() => {
            setHighlightLogId(null);
          }, 3000);
        } catch (e) {
          console.error("Failed to parse SSE log payload", e);
        }
      });

      eventSource.onerror = (err) => {
        setIsLiveConnected(false);
      };
    } catch (err) {
      console.error("SSE setup error", err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const getEndpointName = (id) => {
    const ep = endpoints.find(e => e.id === id);
    return ep ? ep.name : 'Unknown Endpoint';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading && logs.length === 0) return <PageLoader />;
  if (error && logs.length === 0) return <ApiError message={error} onRetry={() => fetchLogs()} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header & Controls (Fixed / Sticky at Top on Scroll) */}
      <div className="sticky top-20 z-30 bg-slate-50/95 dark:bg-black/95 backdrop-blur-md -mx-6 sm:-mx-8 px-6 sm:px-8 py-4 border-b border-slate-200 dark:border-neutral-800 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 transition-colors">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Monitoring Logs</h2>
             <span className="bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-mono font-semibold text-xs px-2.5 py-0.5 rounded-full border border-slate-300 dark:border-neutral-700">
               {totalElements} entries
             </span>
             {isLiveConnected && (
               <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5 animate-in fade-in font-mono">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 LIVE SSE
               </span>
             )}
           </div>
           <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-normal">Real-time event and error logs.</p>
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap w-full xl:w-auto gap-3">
          {/* Level Filter */}
          <select
            value={filters.level || ''}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="flex-1 sm:w-36 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all h-full text-sm font-medium"
          >
            <option value="">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>

          {/* Interactive Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFilters(prev => ({ ...prev, keyword: searchTerm }));
              setPage(0);
            }}
            className="relative flex-1 sm:w-64 flex items-center"
          >
            <button
              type="submit"
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-emerald-500 transition-colors"
              title="Click to search"
            >
              <Search size={16} />
            </button>
            <input
              type="text"
              placeholder="Search logs (e.g. 200, ERROR)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all h-full text-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilters(prev => ({ ...prev, keyword: '' }));
                  setPage(0);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-rose-500 transition-colors"
                title="Clear search"
              >
                <XCircle size={16} />
              </button>
            )}
          </form>
          
          <button
            onClick={() => fetchLogs(false)}
            disabled={isRefreshing}
            className={`p-2.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all flex items-center justify-center ${isRefreshing ? 'opacity-50' : ''}`}
            title="Refresh Logs"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin text-emerald-500" : ""} />
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white/85 dark:bg-black/70 backdrop-blur-sm border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl dark:shadow-black/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold font-display">
                <th className="px-6 py-5">Timestamp</th>
                <th className="px-6 py-5">Level</th>
                <th className="px-6 py-5">Source</th>
                <th className="px-6 py-5">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/80">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <FileText className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                    No logs matching the current criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr 
                    key={log.id || `log-${idx}`} 
                    className={`transition-all duration-500 ${log.id && log.id === highlightLogId ? 'bg-sky-400/10 dark:bg-sky-400/20 ring-1 ring-sky-500/40' : 'hover:bg-slate-50/80 dark:hover:bg-neutral-900/40'}`}
                  >
                    <td className="px-6 py-4 text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold font-mono uppercase tracking-wider border ${
                        log.level === 'ERROR' 
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' 
                          : log.level === 'WARN' 
                          ? 'bg-sky-400/10 text-sky-500 dark:text-sky-400 border-sky-400/20' 
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      }`}>
                        {log.level || 'INFO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {log.source || 'SYSTEM'}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-800 dark:text-slate-200 break-words max-w-md">
                      {log.message}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-neutral-950 border-t border-slate-200 dark:border-neutral-800">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Page <span className="font-semibold text-slate-900 dark:text-white">{page + 1}</span> of <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 disabled:opacity-40 rounded-lg transition-all text-slate-700 dark:text-slate-300"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 disabled:opacity-40 rounded-lg transition-all text-slate-700 dark:text-slate-300"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsTab;
