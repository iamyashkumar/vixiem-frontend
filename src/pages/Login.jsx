import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../components/animations/PageTransition';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { Logo } from '../components/common/Logo';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const { login, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setUnverifiedEmail('');
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      if (err.message === 'EMAIL_NOT_VERIFIED' || err.response?.data?.error === 'EMAIL_NOT_VERIFIED' || err.response?.data?.message === 'EMAIL_NOT_VERIFIED') {
        setError('Your email is not verified. Please check your inbox.');
        setUnverifiedEmail(email);
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Server is waking up (cold start). Please wait a few seconds and try again.');
      } else {
        setError(err.message || 'Login failed');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      setUnverifiedEmail('');
      const success = await loginWithGoogle(credentialResponse.credential);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Server is waking up (cold start). Please try again in 5-10 seconds.');
      } else {
        setError(err.message || 'Google login failed');
      }
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await import('../services/auth').then(m => m.authService.resendVerification(unverifiedEmail));
    } catch (err) {
      // Error is handled in authService toast
    } finally {
      setResending(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-200 transition-colors duration-200">
        
        {/* Left Side - Graphic Panel */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[140px] pointer-events-none"></div>
          
          <div className="relative z-20 flex flex-col items-center text-center px-12">
            <div className="mb-8 transform scale-125">
              <Logo size="xl" showText={false} link={false} />
            </div>
            <h2 className="text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Welcome to <span className="text-sky-500 dark:text-sky-400">Vixiem</span></h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-light max-w-md">Experience the next generation of API monitoring and intelligence.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
          
          <motion.div
            className="w-full max-w-md bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 p-10 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50 relative z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 lg:hidden text-center flex justify-center">
              <Logo size="lg" link={false} />
            </div>

            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Sign In</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-light">Welcome back! Please enter your details.</p>

            {/* Google Login at TOP */}
            <div className="mb-6">
              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Sign-In failed')}
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Or continue with email</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl mb-6 text-sm flex flex-col gap-2">
                <div>{error}</div>
                {unverifiedEmail && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-xs text-sky-600 dark:text-sky-400 underline hover:text-sky-500 text-left font-medium"
                  >
                    {resending ? 'Sending email...' : 'Click here to resend verification email'}
                  </button>
                )}
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
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 px-4 py-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
                    placeholder="name@company.com"
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
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
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
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary h-12 flex items-center justify-center font-semibold text-base shadow-lg shadow-sky-500/20"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-sky-600 dark:text-sky-400 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;