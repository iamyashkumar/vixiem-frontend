import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { MailCheck, XCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. The token may be invalid or expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center items-center p-4 transition-colors duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/90 dark:bg-[#0D0D10]/90 backdrop-blur-xl p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl dark:shadow-2xl dark:shadow-black/50 text-center"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader size={48} className="text-sky-400 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">Verifying Email...</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <MailCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">Email Verified!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-light">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full btn-primary h-12 flex items-center justify-center font-semibold"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(244,63,94,0.2)]">
              <XCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">Verification Failed</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-light">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full btn-primary h-12 flex items-center justify-center font-semibold"
            >
              Back to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
