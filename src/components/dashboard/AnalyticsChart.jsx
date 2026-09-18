import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AnalyticsChart = ({ endpointId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const url = endpointId 
          ? `/api/analytics/metrics?endpointId=${endpointId}` 
          : '/api/analytics/metrics';
        
        const response = await api.get(url);
        
        const formattedData = (response.data || []).map(item => {
          const dateObj = new Date(item.date);
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return {
            ...item,
            formattedDate,
            avgResponseTime: Math.round(item.avgResponseTime || 0)
          };
        });
        
        setData(formattedData);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [endpointId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400 text-sm">
        No analytics data available for the selected period.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#08080A] border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-lg text-xs font-mono">
          <p className="text-slate-500 dark:text-slate-400 font-semibold mb-1">{label}</p>
          <p className="text-sky-500 dark:text-sky-400 font-bold">
            Avg Response: {payload[0].value}ms
          </p>
          {payload[0].payload.errorCount > 0 && (
            <p className="text-rose-500 font-bold mt-0.5">
              Errors: {payload[0].payload.errorCount}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const gridColor = isDark ? "#334155" : "#E2E8F0";
  const axisColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis 
            dataKey="formattedDate" 
            stroke={axisColor} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10} 
          />
          <YAxis 
            stroke={axisColor} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}ms`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="avgResponseTime" 
            stroke="#38BDF8" 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#colorAvg)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
