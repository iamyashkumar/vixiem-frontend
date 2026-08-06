import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../components/animations/PageTransition';
import { Mail, Lock, User, Eye, EyeOff, Check, X } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { Logo } from '../components/common/Logo';

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
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Server is waking up (cold start). Please wait a few seconds and try again.');
      } else {
        setError(err.message || 'Registration failed');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      const success = await loginWithGoogle(credentialResponse.credential);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Google signup failed');
    }
  };

  if (success) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F17] p-8 text-center transition-colors duration-200">
          <motion.div
            className="w-full max-w-md bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 p-10 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
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
              Go to Login
            </button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-200 transition-colors duration-200">
        
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-y-auto">
          
          <motion.div
            className="w-full max-w-md bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 p-10 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50 relative z-10 my-auto"
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
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Sign-Up failed')}
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
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 px-4 py-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
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
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 px-4 py-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm font-semibold"
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

                {/* Password Rules Checklist */}
                {password.length > 0 && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 text-xs">
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
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
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
                className="w-full btn-primary h-12 flex items-center justify-center font-semibold text-base shadow-lg shadow-sky-500/20"
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-600 dark:text-sky-400 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Side - Graphic Panel */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-white dark:bg-[#0F172A] border-l border-slate-200 dark:border-slate-800 items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[140px] pointer-events-none"></div>
          
          <div className="relative z-20 flex flex-col items-center text-center px-12">
            <div className="mb-8 transform scale-125">
              <Logo size="xl" showText={false} link={false} />
            </div>
            <h2 className="text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Join <span className="text-sky-500 dark:text-sky-400">Vixiem</span> Today</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-light max-w-md">Get instant automated monitoring and AI-powered failure resolution for all your APIs.</p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Register;