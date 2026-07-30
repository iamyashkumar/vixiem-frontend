import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EmptyChartState } from './EmptyChartState';

export const LineChartCard = ({ title, data, dataKey, xAxisKey, color = "#0ea5e9", height = 300 }) => {
  return (
    <div className="bg-[#182234] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/30 w-full">
      <h3 className="text-lg font-bold text-white mb-6">{title}</h3>
      
      {(!data || data.length === 0) ? (
        <EmptyChartState />
      ) : (
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
