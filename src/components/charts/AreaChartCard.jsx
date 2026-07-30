import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EmptyChartState } from './EmptyChartState';

export const AreaChartCard = ({ title, data, dataKey, xAxisKey, color = "#0ea5e9", height = 300 }) => {
  return (
    <div className="bg-[#182234] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/30 w-full">
      <h3 className="text-lg font-bold text-white mb-6">{title}</h3>
      
      {(!data || data.length === 0) ? (
        <EmptyChartState />
      ) : (
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#color${dataKey})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
