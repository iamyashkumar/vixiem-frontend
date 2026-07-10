import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCw, Globe, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { statusAPI } from '../api/api';
import { usePolling } from '../hooks/useApi';
import { getStatusColor, timeAgo } from '../lib/utils';
import { EmptyState } from '../components/EmptyState';

export default function Status() {
  const { data: endpoints, loading, refresh } = usePolling(statusAPI.getPublic, 30000); // 30s auto-refresh
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (endpoints) setLastUpdated(new Date());
  }, [endpoints]);

  const uptimePercent = endpoints?.length
    ? Math.round((endpoints.filter(e => e.active || e.status === 'UP').length / endpoints.length) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-velorix-400 rounded-lg p-1">
            <div className="w-8 h-8 bg-gradient-to-br from-velorix-400 to-velorix-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">Velorix Status</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Updated {timeAgo(lastUpdated)}
            </span>
            <button
              onClick={refresh}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400"
              aria-label="Refresh status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Overall Status */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
            uptimePercent === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
          }`}>
            <Globe className="w-4 h-4" />
            {uptimePercent === 100 ? 'All Systems Operational' : 'Some Systems Degraded'}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Service Status</h1>
          <p className="text-slate-400">Real-time monitoring of all public services</p>
        </div>

        {/* Status Grid */}
        {endpoints?.length === 0 ? (
          <EmptyState
            title="No public endpoints"
            description="No services are currently configured for public status display."
            icon={Globe}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {endpoints?.map((endpoint, i) => {
              const isUp = endpoint.active || endpoint.status === 'UP';
              return (
                <motion.div
                  key={endpoint._id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-white mb-1">{endpoint.name || 'API Endpoint'}</h3>
                    <p className="text-sm text-slate-400">{endpoint.url}</p>
                    <p className="text-xs text-slate-500 mt-1">Checked {timeAgo(endpoint.lastChecked)}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {isUp ? 'ONLINE' : 'OFFLINE'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Incident History Placeholder */}
        <div className="mt-12 p-6 bg-slate-900/30 border border-slate-800 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Incident History</h2>
          <p className="text-slate-500 text-sm">No incidents reported in the last 30 days.</p>
        </div>
      </main>
    </div>
  );
}