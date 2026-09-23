import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition';

export const Unauthorized = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-center px-4 transition-colors duration-200">
        <div className="p-8 max-w-md w-full bg-white/90 dark:bg-[#0D0D10]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl">
          <ShieldAlert size={64} className="text-rose-500 mx-auto mb-6" />
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 font-light text-sm">
            You don't have the necessary permissions to view this page. If you believe this is an error, please contact your administrator.
          </p>
          <Link 
            to="/dashboard" 
            className="btn-primary inline-block font-semibold"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default Unauthorized;
