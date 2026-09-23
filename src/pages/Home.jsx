import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../components/animations/PageTransition';
import { GlobeCanvas } from '../components/animations/GlobeCanvas';
import { 
  Zap, 
  BarChart3, 
  Shield, 
  Rocket, 
  ChevronRight, 
  Check, 
  Copy, 
  Activity, 
  Cpu, 
  Bell, 
  CheckCircle2, 
  Terminal,
  Sparkles,
  Server
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const [activeCodeTab, setActiveCodeTab] = useState('node');
  const [copied, setCopied] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const codeSnippets = {
    node: `// Install SDK: npm install @vixiem/telemetry
import { Vixiem } from '@vixiem/telemetry';

const vixiem = new Vixiem({ apiKey: process.env.VIXIEM_API_KEY });
app.use(vixiem.middleware());

// Your API Endpoints are now monitored live!`,
    curl: `# Ingest Telemetry for an API Endpoint
curl -X GET "https://api.vixiem.dev/v1/telemetry/health" \\
  -H "X-Vixiem-Key: vx_live_your_api_key" \\
  -H "Content-Type: application/json"`,
    python: `# Install SDK: pip install vixiem-sdk
from vixiem import VixiemMiddleware
from fastapi import FastAPI

app = FastAPI()
app.add_middleware(VixiemMiddleware, api_key="vx_live_your_api_key")`,
    java: `// Add Maven dependency: com.vixiem:vixiem-spring-boot-starter
@SpringBootApplication
@EnableVixiemTelemetry
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    { icon: Server, title: 'Endpoint Status Tracking', desc: 'Real-time uptime and status code monitoring across all HTTP/REST microservices.' },
    { icon: BarChart3, title: 'Latency Analytics', desc: 'Track sub-second response times, p95/p99 latency distribution, and throughput.' },
    { icon: Cpu, title: 'AI Anomaly Detection', desc: 'Automatically flag 5xx surges, memory leaks, and slow endpoints before outages happen.' },
    { icon: Bell, title: 'Instant Alerting', desc: 'Receive instant notifications via Slack, Webhooks, PagerDuty, or Email on endpoint errors.' },
    { icon: Shield, title: 'Security-first monitoring', desc: 'Cookie-protected sessions and ownership-scoped workspaces for your monitored services.' },
    { icon: Rocket, title: 'Built for growing systems', desc: 'A focused monitoring workspace that keeps endpoint health easy to scan and act on.' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Plug & Play SDK',
      desc: 'Add the Vixiem middleware to Node.js, Python, Java, or Go in under 2 minutes.',
      icon: Terminal
    },
    {
      step: '02',
      title: 'Endpoint Telemetry',
      desc: 'Endpoint metrics and logs stream live to your secure Vixiem workspace.',
      icon: Activity
    },
    {
      step: '03',
      title: 'Real-Time Insights',
      desc: 'Visualize live dashboards, track endpoint health, and receive instant alert notifications.',
      icon: Sparkles
    }
  ];

  const pricingPlans = [
    {
      name: 'Developer',
      priceMonthly: '$0',
      priceAnnual: '$0',
      desc: 'Ideal for side projects & individual developers.',
      features: ['Up to 50,000 req/mo', '7-day data retention', '2 Monitored endpoints', 'Community Support'],
      highlight: false,
      buttonText: 'Get Started Free',
      link: '/register'
    },
    {
      name: 'Pro Engineer',
      priceMonthly: '$29',
      priceAnnual: '$24',
      desc: 'For growing teams requiring deep AI telemetry & fast endpoint alerts.',
      features: ['Up to 2,500,000 req/mo', '30-day data retention', 'Unlimited endpoints', 'AI Anomaly Detection', 'Slack & Webhook Alerts', 'Priority Email Support'],
      highlight: true,
      buttonText: 'Start Free Trial',
      link: '/register'
    },
    {
      name: 'Enterprise',
      priceMonthly: '$199',
      priceAnnual: '$159',
      desc: 'For high-scale organizations needing custom SLAs and retention.',
      features: ['Unlimited throughput', '365-day data retention', 'Dedicated Support Manager', 'Custom SAML & SSO', 'Custom SLAs (99.99%)', 'On-Premises Option'],
      highlight: false,
      buttonText: 'Contact Sales',
      link: '/register'
    }
  ];

  const stats = [
    { value: '99.99%', label: 'Endpoint Uptime SLA' },
    { value: '50M+', label: 'Telemetry Events' },
    { value: '<15ms', label: 'Average Latency' },
    { value: '24/7', label: 'AI Health Monitor' }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen text-slate-800 dark:text-slate-200 bg-transparent overflow-x-hidden selection:bg-sky-400 selection:text-white pt-24 sm:pt-28 pb-16 w-full">
        
        {/* HERO SECTION - STRIPE / LINEAR STYLE */}
        <section className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pb-16 lg:pb-24">
          
          {/* Ambient Warm Gold Glow Blob */}
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-sky-400/15 dark:bg-sky-400/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
                        {/* Left Column */}
            <motion.div variants={itemVariants} className="lg:col-span-7 xl:col-span-7 text-center lg:text-left space-y-6">
              
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
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-base shadow-lg shadow-sky-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Go to Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-base shadow-lg shadow-sky-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
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
            </motion.div>

            {/* Right Live Telemetry Terminal (Datadog Developer Style) */}
            <motion.div variants={itemVariants} className="lg:col-span-5 xl:col-span-5 w-full">
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
            </motion.div>
          </motion.div>
        </section>

        {/* SDK CODE PREVIEW */}
        <section className="w-full bg-transparent py-16 sm:py-20">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white font-display mb-3">
                Integrate in 2 Lines of Code
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-light">
                Vixiem connects seamlessly with Node.js, Python, Java, or REST APIs.
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-slate-900 dark:bg-[#08080A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl w-full">
              {/* Tab Nav */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 bg-slate-950 dark:bg-[#141418] border-b border-slate-800 gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
                  {[
                    { id: 'node', label: 'Node.js / Express' },
                    { id: 'python', label: 'Python / FastAPI' },
                    { id: 'java', label: 'Java / Spring Boot' },
                    { id: 'curl', label: 'cURL / REST' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCodeTab(tab.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                        activeCodeTab === tab.id
                          ? 'bg-sky-400 text-white font-extrabold shadow-md shadow-sky-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-sky-400 bg-slate-800 border border-slate-700 rounded-lg transition-all w-full sm:w-auto shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code */}
              <div className="p-5 sm:p-6 bg-slate-950 dark:bg-[#0D0D10] overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-sky-200 w-full">
                <pre className="whitespace-pre">{codeSnippets[activeCodeTab]}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-display mb-3">
              Engineered for Endpoint Precision
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base font-light">
              Everything you need to maintain 99.99% API endpoint reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-[#141418] border border-slate-200 dark:border-slate-800 rounded-2xl p-7 hover:border-sky-400/50 transition-all duration-300 group shadow-sm dark:shadow-none"
                >
                  <div className="w-12 h-12 bg-sky-400/10 border border-sky-400/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-sky-400/20 transition-colors">
                    <Icon size={24} className="text-sky-500 dark:text-sky-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light text-xs sm:text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="w-full bg-transparent py-20">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-display mb-3">
                How Vixiem Works
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base font-light">
                Monitor your endpoint health in 3 simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="bg-white dark:bg-[#141418] border border-slate-200 dark:border-slate-800 rounded-2xl p-7 shadow-sm dark:shadow-none">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-3xl font-extrabold text-sky-400/40 font-display">{step.step}</span>
                      <div className="w-10 h-10 bg-sky-400/10 border border-sky-400/30 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-light leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-display mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base font-light mb-6">
              Start free and scale as your traffic grows.
            </p>

            <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-[#141418] border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  billingCycle === 'monthly' ? 'bg-sky-400 text-white font-extrabold shadow-md shadow-sky-500/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'bg-sky-400 text-white font-extrabold shadow-md shadow-sky-500/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[9px] uppercase font-bold bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {pricingPlans.map((plan, index) => {
              const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
              return (
                <div
                  key={index}
                  className={`rounded-2xl p-7 flex flex-col justify-between relative ${
                    plan.highlight
                      ? 'bg-gradient-to-b from-sky-400/10 via-sky-400/5 to-white dark:from-[#141418] dark:to-[#0D0D10] border-2 border-sky-400 shadow-xl shadow-sky-400/10/10 md:scale-[1.02]'
                      : 'bg-white dark:bg-[#141418] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-400 via-sky-400 to-sky-400 text-white font-black text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-1">{plan.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs font-light mb-5">{plan.desc}</p>
                    
                    <div className="mb-6">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">{price}</span>
                      <span className="text-slate-600 dark:text-slate-400 text-xs font-light"> / month</span>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-light">
                          <Check className="w-3.5 h-3.5 text-sky-400 dark:text-sky-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={plan.link}
                    className={`w-full py-3 rounded-xl font-semibold text-center text-sm transition-all ${
                      plan.highlight
                        ? 'btn-primary text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* STATS BANNER */}
        <section className="w-full bg-transparent py-16">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-500 dark:text-sky-400 font-display">
                    {stat.value}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide uppercase text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

                {/* CTA BANNER - CYBER YELLOW & OBSIDIAN STYLING */}
        <section className="w-full max-w-[1000px] mx-auto px-4 sm:px-8 lg:px-12 py-20">
          <div className="rounded-3xl bg-gradient-to-r from-sky-400 via-sky-400 to-sky-400 dark:from-zinc-950 dark:via-black dark:to-zinc-950 border border-sky-400/40 p-8 sm:p-14 text-center shadow-2xl shadow-sky-400/20 backdrop-blur-xl relative overflow-hidden">
            
            {/* Soft Ambient Radial Glow */}
            <div className="absolute inset-0 bg-sky-400/10 dark:bg-sky-400/5 blur-2xl pointer-events-none"></div>

            <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 dark:text-white font-display mb-4 tracking-tight relative z-10">
              Ready to Monitor Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-950 dark:from-sky-400 dark:to-sky-300">
                API Endpoints?
              </span>
            </h2>
            <p className="text-zinc-900 dark:text-zinc-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium relative z-10">
              Join thousands of developers using Vixiem for real-time endpoint monitoring and AI diagnostics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                to="/register"
                className="bg-zinc-950 dark:bg-sky-400 text-sky-400 dark:text-black hover:bg-zinc-900 dark:hover:bg-sky-300 font-extrabold px-8 py-3.5 rounded-xl text-base transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="bg-sky-500/20 dark:bg-zinc-900 text-zinc-950 dark:text-sky-300 hover:bg-sky-500/30 dark:hover:bg-zinc-800 font-bold px-8 py-3.5 rounded-xl text-base transition-all border border-sky-400/40 w-full sm:w-auto"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Home;
