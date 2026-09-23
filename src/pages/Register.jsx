import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../components/animations/PageTransition';
import { Mail, Lock, User, Eye, EyeOff, Check, X, CheckCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { Logo } from '../components/common/Logo';
import { GlobeCanvas } from '../components/animations/GlobeCanvas';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLoginHook = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setError('');
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();
        if (profile && profile.email) {
          const success = await loginWithGoogle(JSON.stringify({ email: profile.email, name: profile.name }));
          if (success) {
            navigate('/dashboard');
          }
        } else {
          setError('Failed to fetch Google profile details.');
        }
      } catch (err) {
        setError(err.message || 'Google sign-up failed');
      }
    },
    onError: (err) => {
      console.error('Google sign-up error:', err);
      setError('Google Sign-Up was cancelled or blocked.');
    },
  });

  const passwordRules = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
    { label: 'One special character (@$!%*?&)', met: /[@$!%*?&]/.test(password) },
  ];
  const allRulesMet = passwordRules.every(rule => rule.met);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!allRulesMet) {
      setError('Please ensure your password meets all security requirements.');
      return;
    }

    try {
      const successResp = await register(email, password, username);
      if (successResp) {
        setSuccess(true);
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Server is waking up (cold start). Please wait a few seconds and try again.');
      } else {
        setError(err.message || 'Registration failed');
      }
    }
  };

  if (success) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-transparent p-8 text-center transition-colors duration-200">
          <motion.div
            className="w-full max-w-md bg-white/90 dark:bg-[#0D0D10]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-10 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-sky-400/10 text-sky-400 dark:text-sky-400 border border-sky-400/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
              <Mail size={40} />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Check Your Email</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 font-light">
              We've sent a verification link to <span className="text-slate-900 dark:text-white font-medium">{email}</span>. 
              Please verify your email address to log in.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full btn-primary h-12 flex items-center justify-center font-semibold"
            >
              Log In Now
            </button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-transparent text-slate-800 dark:text-slate-200 transition-colors duration-200 pt-20">
        
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-start justify-center px-6 sm:px-10 py-6 lg:py-8 relative overflow-y-auto">
          
          <motion.div
            className="w-full max-w-md bg-white/90 dark:bg-[#0D0D10]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-8 sm:p-10 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50 relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 lg:hidden text-center flex justify-center">
              <Logo size="lg" link={false} />
            </div>

            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-light">Start monitoring your APIs in seconds.</p>

            {/* Google Signup at TOP */}
            <div className="mb-6">
              <div className="flex justify-center w-full">
                <button
                  type="button"
                  onClick={() => handleGoogleLoginHook()}
                  className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-[#1A2333] border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#222D42] transition-all duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Or continue with email</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#08080A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 px-4 py-3 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all text-sm"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Unique Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#08080A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 px-4 py-3 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all text-sm font-semibold"
                    placeholder="e.g. yash"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#08080A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all text-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Rules Checklist */}
                {password.length > 0 && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-[#08080A] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 text-xs">
                    {passwordRules.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {rule.met ? (
                          <Check size={14} className="text-emerald-500 font-bold" />
                        ) : (
                          <X size={14} className="text-slate-400" />
                        )}
                        <span className={rule.met ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-400'}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#08080A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all text-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary h-12 flex items-center justify-center font-semibold text-base shadow-lg shadow-sky-400/10"
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-500 dark:text-sky-400 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Side - 3D Globe Graphic Showcase Panel */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-transparent border-l border-slate-200/80 dark:border-slate-800/80 items-center justify-center transition-colors duration-300">
          {/* Luminous Brand Showcase Content directly over the Globe with NO white circle */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-10 pointer-events-none max-w-md mx-auto h-full">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-500/15 border border-sky-400/30 text-sky-700 dark:text-sky-300 text-xs font-semibold tracking-wider uppercase mb-7 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Join 10+ Global Edge Regions
            </div>

            <div className="mb-5 transform hover:scale-105 transition-transform duration-300 drop-shadow-md">
              <Logo size="xl" showText={false} link={false} />
            </div>

            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
              Join <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-500 dark:from-sky-400 dark:via-sky-300 dark:to-cyan-300">Vixiem</span> Today
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-sm mb-7">
              Get instant automated observability, sub-second latency alerts, and AI failure diagnostics for your endpoints.
            </p>

            {/* Global Mesh Live Metrics Strip */}
            <div className="grid grid-cols-3 gap-2.5 w-full bg-white/70 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-md p-3.5 rounded-xl text-left shadow-sm dark:shadow-xl">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">Setup Time</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">2 Mins</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">Zero Config</p>
                <p className="text-sm font-bold text-sky-600 dark:text-sky-400 font-mono mt-0.5">Auto SDK</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">Plan</p>
                <p className="text-sm font-bold text-cyan-600 dark:text-cyan-300 font-mono mt-0.5">Free Tier</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Register;