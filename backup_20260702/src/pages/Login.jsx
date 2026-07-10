import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Mail, Lock, Eye, EyeOff, ArrowRight,
  AlertCircle, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail, getPasswordStrength } from '../lib/utils';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const emailRef = useRef(null);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(email)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) {
      toast.error('Too many attempts. Please try again later.');
      return;
    }
    if (!validate()) {
      // Shake animation trigger
      return;
    }

    setLoading(true);
    const result = await login({ email: email.trim(), password });
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      setAttempts(prev => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          setLocked(true);
          toast.error('Account temporarily locked due to too many failed attempts.');
          setTimeout(() => { setLocked(false); setAttempts(0); }, 300000); // 5 min
        }
        return newAttempts;
      });
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements - GPU optimized */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-velorix-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 mb-8 focus:outline-none focus:ring-2 focus:ring-velorix-400 rounded-lg p-1 mx-auto w-fit"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-velorix-400 to-velorix-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Velorix</span>
        </Link>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: null})); }}
                  placeholder="you@example.com"
                  disabled={loading || locked}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-500/50 focus:ring-red-400'
                      : 'border-slate-700 focus:ring-velorix-400 focus:border-velorix-400'
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  id="email-error"
                  className="text-red-400 text-sm mt-1.5 flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: null})); }}
                  placeholder="••••••••"
                  disabled={loading || locked}
                  className={`w-full pl-10 pr-12 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-500/50 focus:ring-red-400'
                      : 'border-slate-700 focus:ring-velorix-400 focus:border-velorix-400'
                  }`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-velorix-400 rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  id="password-error"
                  className="text-red-400 text-sm mt-1.5 flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                </motion.p>
              )}
            </div>

            {/* Rate Limit Warning */}
            {attempts >= 3 && attempts < 5 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Warning: {5 - attempts} attempts remaining before lockout.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || locked}
              className="w-full py-3 bg-gradient-to-r from-velorix-500 to-velorix-600 hover:from-velorix-400 hover:to-velorix-500 text-white font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-velorix-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-velorix-400 hover:text-velorix-300 font-medium focus:outline-none focus:ring-2 focus:ring-velorix-400 rounded">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}