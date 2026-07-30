import React from 'react';
import { BarChart2 } from 'lucide-react';

export const EmptyChartState = ({ message = "No data available for the selected time range" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 w-full bg-velorix-800 rounded-xl border border-dashed border-slate-700/50">
      <div className="w-12 h-12 rounded-full bg-velorix-800 flex items-center justify-center mb-3">
        <BarChart2 className="text-velorix-400" size={24} />
      </div>
      <p className="text-velorix-400 text-sm">{message}</p>
    </div>
  );
};
