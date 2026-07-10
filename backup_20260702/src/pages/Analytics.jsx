import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { CardSkeleton, ChartSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { useApi } from '../hooks/useApi';
import { analyticsAPI } from '../api/api';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
      <p className="text-slate-300 text-sm mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-white text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [period, setPeriod] = useState('7d');
  const { data: analytics, loading } = useApi(analyticsAPI.getSummary, []);
  const { data: traffic } = useApi(() => analyticsAPI.getTraffic(period), [period]);
  const { data: statusDist } = useApi(analyticsAPI.getStatusDistribution, []);
  const { data: topEndpoints } = useApi(() => analyticsAPI.getTopEndpoints(5), []);

  const statusData = useMemo(() => {
    if (!statusDist) return [];
    return Object.entries(statusDist).map(([name, value]) => ({ name, value }));
  }, [statusDist]);

  if (loading) {
    return (
      <Layout title="Analytics" description="Detailed performance metrics">
        <CardSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Analytics" description="Detailed performance metrics across all endpoints">
      {/* Period Selector */}
      <div className="flex items-center gap-2 mb-6">
        {['24h', '7d', '30d', '90d'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400 ${
              period === p
                ? 'bg-velorix-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            aria-pressed={period === p}
          >
            {p === '24h' ? 'Last 24h' : p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'Last 90 days'}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Hits', value: analytics?.totalRequests || 0, icon: Activity, color: 'bg-blue-500/10 text-blue-400' },
          { title: 'Avg Latency', value: `${analytics?.avgResponseTime || 0}ms`, icon: TrendingUp, color: 'bg-purple-500/10 text-purple-400' },
          { title: 'Success Rate', value: `${analytics?.successRate || 0}%`, icon: BarChart3, color: 'bg-emerald-500/10 text-emerald-400' },
          { title: 'Error Rate', value: `${analytics?.errorRate || 0}%`, icon: AlertCircle, color: 'bg-red-500/10 text-red-400' },
        ].map((stat) => (
          <motion.div
            key={stat.title}
            whileHover={{ y: -2 }}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-5"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-slate-400 text-sm">{stat.title}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Trend */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Traffic Trend</h3>
          {traffic?.requestsOverTime?.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={traffic.requestsOverTime}>
                  <defs>
                    <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="requests" stroke="#14b8a6" fill="url(#trafficGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="No traffic data" description="Traffic data will appear once endpoints start receiving requests." icon={Activity} />
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Status Distribution</h3>
          {statusData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="No status data" description="Status distribution will appear once monitoring begins." icon={Activity} />
          )}
        </div>
      </div>

      {/* Top Endpoints */}
      {topEndpoints?.length > 0 && (
        <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-velorix-400" /> Top Endpoints
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topEndpoints} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#475569" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={12} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="requests" fill="#14b8a6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Layout>
  );
}
