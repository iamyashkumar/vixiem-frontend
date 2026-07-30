import React from 'react';
import { Activity, XCircle } from 'lucide-react';

export const LogStatusBadge = ({ isUp, className = "" }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
      isUp 
        ? 'bg-velorix-teal text-velorix-teal border-velorix-teal' 
        : 'bg-red-500/10 text-red-400 border-red-500/20'
    } ${className}`}>
      {isUp ? (
        <><Activity size={12} /> UP</>
      ) : (
        <><XCircle size={12} /> DOWN</>
      )}
    </span>
  );
};
