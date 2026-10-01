import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../components/animations/PageTransition';
import { 
  ChevronRight, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

const HomeBelowTheFold = lazy(() => import('./HomeBelowTheFold'));

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const [showBelowTheFold, setShowBelowTheFold] = useState(false);

  useEffect(() => {
    let idleId = null;
    let timerId = null;
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => setShowBelowTheFold(true), { timeout: 1200 });
    } else {
      timerId = setTimeout(() => setShowBelowTheFold(true), 300);
    }
    return () => {
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen text-slate-800 dark:text-slate-200 bg-transparent overflow-x-hidden selection:bg-sky-400 selection:text-white pt-24 sm:pt-28 pb-16 w-full">
        
        {/* HERO SECTION - STRIPE / LINEAR STYLE */}
        <section className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pb-16 lg:pb-24">
          
          {/* Ambient Warm Gold Glow Blob */}
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-sky-400/15 dark:bg-sky-400/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                        {/* Left Column */}
            <div className="lg:col-span-7 xl:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Datadog Live Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/25 text-sky-700 dark:text-sky-300 text-xs font-semibold tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <span className="font-mono">LIVE TELEMETRY & AI DIAGNOSTICS</span>
              </div>
              
              {/* Single-Line Bold Datadog Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.14]">
                Monitor & Track{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-500 dark:from-sky-300 dark:via-sky-400 dark:to-cyan-300">
                  API Endpoints
                </span>{" "}
                in Real Time
              </h1>
              
              {/* Sub-headline */}
              <p className="text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                The all-in-one endpoint observability platform. Track response times, status codes, 
                and live telemetry across all your backend services with instant AI anomaly alerts.
              </p>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1 w-full">
                {isAuthenticated ? (
                  <Link 
                    to="/dashboard" 
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-base shadow-lg shadow-sky-400/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Go to Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-base shadow-lg shadow-sky-400/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Start Monitoring Free
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link 
                      to="/login" 
                      className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 hover:border-sky-400 text-zinc-800 dark:text-zinc-200 font-semibold text-base transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Bullets */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 2-minute SDK setup</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 99.99% Uptime SLA</span>
              </div>
            </div>

            {/* Right Live Telemetry Terminal (Datadog Developer Style) */}
            <div className="lg:col-span-5 xl:col-span-5 w-full">
              <div className="rounded-2xl bg-white dark:bg-[#08080A] border border-zinc-200 dark:border-zinc-800/90 shadow-2xl shadow-sky-500/10 overflow-hidden w-full transition-all">
                
                {/* Console Header Bar */}
                <div className="bg-zinc-50 dark:bg-[#0D0D10] px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 truncate pl-1">
                      vixiem-agent • us-east-1
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    HEALTHY
                  </div>
                </div>

                {/* Key Metric HUD Cards */}
                <div className="p-3 grid grid-cols-3 gap-2 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#0A0A0E]">
                  <div className="bg-white dark:bg-[#111116] p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-left">
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Avg Latency</p>
                    <p className="text-sm sm:text-base font-bold text-sky-500 dark:text-sky-400 font-mono mt-0.5">14.2 ms</p>
                  </div>
                  <div className="bg-white dark:bg-[#111116] p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-left">
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Throughput</p>
                    <p className="text-sm sm:text-base font-bold text-emerald-500 dark:text-emerald-400 font-mono mt-0.5">1,420 rps</p>
                  </div>
                  <div className="bg-white dark:bg-[#111116] p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-left">
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Success</p>
                    <p className="text-sm sm:text-base font-bold text-sky-500 dark:text-sky-400 font-mono mt-0.5">99.98%</p>
                  </div>
                </div>

                {/* Live Endpoint Cards with Latency Bars */}
                <div className="p-3.5 space-y-2.5 font-mono text-xs bg-white dark:bg-[#08080A]">
                  {/* Endpoint 1 */}
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-[#0E0E12] border border-zinc-200/70 dark:border-zinc-800/70 hover:border-sky-400/40 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">POST</span>
                        <span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate text-[11px]">/api/v1/auth/verify</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">200 OK</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }} />
                      </div>
                      <span className="font-mono text-zinc-600 dark:text-zinc-400 font-medium shrink-0">18ms</span>
                    </div>
                  </div>

                  {/* Endpoint 2 */}
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-[#0E0E12] border border-zinc-200/70 dark:border-zinc-800/70 hover:border-sky-400/40 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">GET</span>
                        <span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate text-[11px]">/api/v1/endpoints/health</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">200 OK</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-sky-400 h-full rounded-full" style={{ width: '18%' }} />
                      </div>
                      <span className="font-mono text-zinc-600 dark:text-zinc-400 font-medium shrink-0">12ms</span>
                    </div>
                  </div>

                  {/* Endpoint 3 */}
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-[#0E0E12] border border-zinc-200/70 dark:border-zinc-800/70 hover:border-sky-400/40 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">POST</span>
                        <span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate text-[11px]">/api/v1/telemetry/ingest</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">201 CREATED</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '36%' }} />
                      </div>
                      <span className="font-mono text-zinc-600 dark:text-zinc-400 font-medium shrink-0">24ms</span>
                    </div>
                  </div>

                  {/* Endpoint 4 */}
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-[#0E0E12] border border-zinc-200/70 dark:border-zinc-800/70 hover:border-sky-400/40 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">GET</span>
                        <span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate text-[11px]">/api/v1/users/profile</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">200 OK</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-sky-400 h-full rounded-full" style={{ width: '14%' }} />
                      </div>
                      <span className="font-mono text-zinc-600 dark:text-zinc-400 font-medium shrink-0">9ms</span>
                    </div>
                  </div>
                </div>

                {/* Console Footer */}
                <div className="p-3 bg-zinc-50 dark:bg-[#0D0D10] border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span className="font-medium truncate">AI Anomaly Guard Active</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">0 Anomalies Detected</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BELOW THE FOLD SECTIONS - LAZY LOADED FOR INSTANT MOBILE LCP */}
        {showBelowTheFold && (
          <Suspense fallback={null}>
            <HomeBelowTheFold />
          </Suspense>
        )}

      </div>
    </PageTransition>
  );
};

export default Home;
