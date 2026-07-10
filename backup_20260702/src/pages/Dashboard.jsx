import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Activity, TrendingUp, TrendingDown, Clock,
  Zap, AlertTriangle, ChevronRight, Trash2, RefreshCw,
  Server, BarChart3
} from 'lucide-react';
import Layout from '../components/Layout';
import { CardSkeleton, ChartSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { useApi } from '../hooks/useApi';
import { endpointAPI, aiAPI } from '../api/api';
import { getStatusColor, formatDate } from '../lib/utils';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
  >
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-slate-400 text-sm mb-1">{title}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </motion.div>
);

const EndpointRow = ({ endpoint, isSelected, onClick, onDelete, health }) => {
  const status = endpoint.active || endpoint.status === 'UP' ? 'UP' : 'DOWN';

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-velorix-400 ${
        isSelected ? 'bg-velorix-500/10 border-velorix-500/50' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`${endpoint.name} - ${status}`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${status === 'UP' ? 'bg-emerald-500' : 'bg-red-500'}`} />
        <div className="min-w-0">
          <h4 className="font-semibold text-white truncate">{endpoint.name}</h4>
          <p className="text-sm text-slate-400 truncate">{endpoint.url}</p>
          <p className="text-xs text-slate-500 mt-1">
            {health ? `${health}ms` : 'No data'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label={`Delete ${endpoint.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const { data: endpoints, loading, error, refetch } = useApi(endpointAPI.getAll, []);
  const { data: healthData } = useApi(() => endpointAPI.getHealth(selectedEndpoint?._id), [selectedEndpoint?._id], { immediate: !!selectedEndpoint });

  const stats = useMemo(() => {
    if (!endpoints) return { total: 0, up: 0, down: 0, avgResponseTime: 0 };
    const up = endpoints.filter(e => e.active || e.status === 'UP').length;
    return {
      total: endpoints.length,
      up,
      down: endpoints.length - up,
      avgResponseTime: Math.round(endpoints.reduce((a, b) => a + (b.responseTime || 0), 0) / (endpoints.length || 1)),
    };
  }, [endpoints]);

  const chartData = useMemo(() => {
    if (!healthData?.history) return [];
    return healthData.history.map(h => ({
      time: formatDate(h.timestamp),
      responseTime: h.responseTime,
      status: h.status,
    }));
  }, [healthData]);

  const handleAddEndpoint = useCallback(async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await endpointAPI.create({ name: newName, url: newUrl });
      toast.success('Endpoint added successfully');
      setNewName('');
      setNewUrl('');
      refetch();
    } catch (err) {
      toast.error('Failed to add endpoint');
    }
  }, [newName, newUrl, refetch]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this endpoint?')) return;
    try {
      await endpointAPI.delete(id);
      toast.success('Endpoint deleted');
      refetch();
      if (selectedEndpoint?._id === id) setSelectedEndpoint(null);
    } catch (err) {
      toast.error('Failed to delete endpoint');
    }
  }, [selectedEndpoint, refetch]);

  const handleAiDiagnose = useCallback(async () => {
    if (!selectedEndpoint) return;
    setAiLoading(true);
    try {
      const response = await aiAPI.diagnose(selectedEndpoint._id);
      setAiSuggestion(response.data);
      toast.success('AI diagnosis complete');
    } catch (err) {
      toast.error('AI diagnosis failed');
    } finally {
      setAiLoading(false);
    }
  }, [selectedEndpoint]);

  if (loading) {
    return (
      <Layout title="Dashboard" description="Monitor your API endpoints in real-time">
        <PageSkeleton />
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" description="Monitor your API endpoints in real-time">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Endpoints" value={stats.total} icon={Server} color="bg-blue-500/10 text-blue-400" />
        <StatCard title="Endpoints Up" value={stats.up} icon={TrendingUp} color="bg-emerald-500/10 text-emerald-400" trend={stats.total ? Math.round((stats.up/stats.total)*100) : 0} />
        <StatCard title="Endpoints Down" value={stats.down} icon={TrendingDown} color="bg-red-500/10 text-red-400" />
        <StatCard title="Avg Latency" value={`${stats.avgResponseTime}ms`} icon={Clock} color="bg-purple-500/10 text-purple-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Add + List */}
        <div className="xl:col-span-2 space-y-6">
          {/* Add Endpoint Form */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-velorix-400" /> Add New Endpoint
            </h3>
            <form onSubmit={handleAddEndpoint} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Endpoint name"
                className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-velorix-400"
              />
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://api.example.com/health"
                className="flex-[2] px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-velorix-400"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-velorix-500 hover:bg-velorix-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>
          </div>

          {/* Endpoints List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-velorix-400" /> Monitored Endpoints
              </h3>
              <button onClick={refetch} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400" aria-label="Refresh endpoints">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {endpoints?.length === 0 ? (
              <EmptyState
                title="No endpoints yet"
                description="Add your first API endpoint to start monitoring."
                icon={Server}
                action={() => document.querySelector('input[placeholder=\"Endpoint name\"]')?.focus()}
                actionLabel="Add Endpoint"
              />
            ) : (
              <div className="space-y-2">
                {endpoints?.map((ep) => (
                  <EndpointRow
                    key={ep._id || ep.id}
                    endpoint={ep}
                    isSelected={selectedEndpoint?._id === ep._id}
                    onClick={() => setSelectedEndpoint(ep)}
                    onDelete={() => handleDelete(ep._id)}
                    health={healthData?.responseTime}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Chart + AI */}
        <div className="space-y-6">
          {selectedEndpoint ? (
            <>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-1">{selectedEndpoint.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{selectedEndpoint.url}</p>

                {chartData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="time" stroke="#475569" fontSize={12} />
                        <YAxis stroke="#475569" fontSize={12} unit="ms" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="responseTime"
                          stroke="#14b8a6"
                          fillOpacity={1}
                          fill="url(#colorResponse)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    No history data available
                  </div>
                )}
              </div>

              {/* AI Diagnosis */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" /> AI Diagnosis
                  </h3>
                  <button
                    onClick={handleAiDiagnose}
                    disabled={aiLoading}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
                  >
                    {aiLoading ? 'Analyzing...' : 'Run Analysis'}
                  </button>
                </div>

                {aiSuggestion ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Possible Cause</p>
                      <p className="text-sm text-white">{aiSuggestion.possibleCause}</p>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Recommended Fix</p>
                      <p className="text-sm text-white">{aiSuggestion.recommendedFix}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        aiSuggestion.severity === 'HIGH' ? 'bg-red-500/10 text-red-400' :
                        aiSuggestion.severity === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {aiSuggestion.severity} Severity
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Click "Run Analysis" to get AI-powered insights.</p>
                )}
              </div>
            </>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center">
              <BarChart3 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400">Select an endpoint to view performance metrics and AI diagnosis.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}