import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Lock, LogOut, AlertCircle, Zap, Cpu, RefreshCw, User } from 'lucide-react';
import { authService } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';

export const SettingsTab = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [aiQuota, setAiQuota] = useState(null);
  
  const [usernameInput, setUsernameInput] = useState(user?.username || '');
  const [updatingUsername, setUpdatingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.username) {
      setUsernameInput(user.username);
    }
  }, [user]);

  useEffect(() => {
    aiService.getLimitStatus()
      .then(res => setAiQuota(res))
      .catch(err => console.error("Error loading AI quota for profile", err));
  }, []);

  const handleChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setUsernameError(null);
    if (!usernameInput || usernameInput.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }

    try {
      setUpdatingUsername(true);
      const updatedUser = await authService.updateUsername(usernameInput.trim());
      toast.success("Username updated successfully!");
      // Reload page to hydrate updated username state across the whole dashboard
      window.location.reload();
    } catch (err) {
      console.error("Username update error:", err);
      const serverErr = err.response?.data?.error || err.response?.data?.message || err.message;
      setUsernameError(serverErr || "Could not update username. Please try again.");
    } finally {
      setUpdatingUsername(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      await logout();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12 w-full">
      {/* Header Banner */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
          <Shield className="w-6 h-6 text-sky-600 dark:text-sky-400" />
        </div>
        <div>
           <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">Account & Security Settings</h2>
           <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-light">Manage your profile, unique username, AI credits quota, and security credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card & AI Credits Card */}
        <div className="col-span-1 space-y-6">
          
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm dark:shadow-xl dark:shadow-black/30"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-3xl font-display font-bold text-white shadow-md mb-3 border-2 border-white/20">
                {(user?.username || user?.email)?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-0.5 truncate w-full">
                @{user?.username || user?.email?.split('@')[0]}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate w-full">{user?.email}</p>
              <p className="text-sky-600 dark:text-sky-400 font-semibold text-xs mb-6 tracking-wider uppercase">{user?.role || 'DEVELOPER'}</p>
              
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-xs sm:text-sm"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.div>

          {/* AI Credits & Usage Quota Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl dark:shadow-black/30"
          >
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Zap className="w-5 h-5 text-sky-500 fill-sky-500" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">AI Debugging Credits</h4>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  <span>Available Credits</span>
                  <span className="font-bold font-mono text-sky-600 dark:text-sky-400">
                    {aiQuota ? `${aiQuota.remainingCalls} / ${aiQuota.dailyCallsLimit}` : 'Loading...'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: aiQuota ? `${Math.min(100, (aiQuota.remainingCalls / aiQuota.dailyCallsLimit) * 100)}%` : '0%'
                    }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0F172A] p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-400 font-light">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-sky-500" /> Current Plan</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Free Tier</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5 text-emerald-500" /> Reset Cycle</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Rolling 24 Hours</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Update Username & Change Password */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* Update Username Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-xl dark:shadow-black/30"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-xl">
                <User size={20} className="text-sky-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Unique Username</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Set your custom unique handle displayed on the dashboard</p>
              </div>
            </div>

            {usernameError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl mb-4 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {usernameError}
              </div>
            )}

            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Username Handle</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 font-bold text-sm">@</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="e.g. yash"
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-9 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-all text-xs sm:text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingUsername}
                className="btn-primary w-full py-3 text-xs sm:text-sm font-bold shadow-md"
              >
                {updatingUsername ? 'Saving Username...' : 'Save & Update Username'}
              </button>
            </form>
          </motion.div>

          {/* Change Password Form */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-xl dark:shadow-black/30"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <Key size={20} className="text-indigo-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Change Password</h3>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl mb-6 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-all text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-all text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-all text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-xs sm:text-sm font-bold shadow-md mt-2"
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
