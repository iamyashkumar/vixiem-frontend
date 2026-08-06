import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../components/animations/PageTransition';
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
      <div className="min-h-screen text-slate-800 dark:text-slate-200 bg-transparent overflow-x-hidden selection:bg-sky-500 selection:text-white pt-24 sm:pt-28 pb-16 w-full">
        
        {/* HERO SECTION */}
        <section className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pb-16 lg:pb-24">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column */}
            <motion.div variants={itemVariants} className="lg:col-span-7 xl:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 dark:bg-[#182234] border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs sm:text-sm font-medium shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
                </span>
                Vixiem Endpoint Monitoring v2.0 is Live
              </div>
              
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Monitor & Track API Endpoints <br className="hidden sm:block" />
                <span className="text-gradient">in Real Time</span>
              </h1>
              
              {/* Sub-headline */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                The all-in-one endpoint observability platform. Track status codes, response times, 
                and live telemetry across all your backend services with instant AI anomaly alerts.
              </p>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full">
                {isAuthenticated ? (
                  <Link 
                    to="/dashboard" 
                    className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group px-8 py-4 text-base sm:text-lg shadow-xl"
                  >
                    Go to Dashboard
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2.5 group px-8 py-4 text-base sm:text-lg shadow-xl"
                    >
                      Get Started Free
                      <Zap className="w-5 h-5 group-hover:scale-110 transition-transform text-yellow-300 fill-yellow-300" />
                    </Link>
                    <Link 
                      to="/login" 
                      className="btn-secondary w-full sm:w-auto px-8 py-4 text-base sm:text-lg flex items-center justify-center"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Bullets */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" /> 2-minute SDK setup</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" /> 99.99% Endpoint Uptime</span>
              </div>
            </motion.div>

            {/* Right Live Telemetry Terminal */}
            <motion.div variants={itemVariants} className="lg:col-span-5 xl:col-span-5 w-full">
              <div className="rounded-2xl bg-[#090D16] border border-slate-800 shadow-2xl overflow-hidden shadow-sky-500/10 w-full">
                
                {/* Terminal Header */}
                <div className="bg-[#0F172A] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-3 h-3 rounded-full bg-rose-500/90 shrink-0" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/90 shrink-0" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/90 shrink-0" />
                    <span className="text-xs text-slate-300 font-mono truncate ml-2">telemetry-stream.log</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 font-mono shrink-0 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    LIVE
                  </div>
                </div>

                {/* Key Metric Indicators */}
                <div className="p-3.5 sm:p-4 grid grid-cols-3 gap-2.5 border-b border-slate-800/90 bg-[#131C2E]/60">
                  <div className="bg-[#0B0F17] p-2.5 sm:p-3 rounded-xl border border-slate-800 text-center sm:text-left">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Avg Latency</p>
                    <p className="text-sm sm:text-lg font-bold text-sky-400 font-mono">14.2 ms</p>
                  </div>
                  <div className="bg-[#0B0F17] p-2.5 sm:p-3 rounded-xl border border-slate-800 text-center sm:text-left">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Req Rate</p>
                    <p className="text-sm sm:text-lg font-bold text-emerald-400 font-mono">1,420 rps</p>
                  </div>
                  <div className="bg-[#0B0F17] p-2.5 sm:p-3 rounded-xl border border-slate-800 text-center sm:text-left">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Success</p>
                    <p className="text-sm sm:text-lg font-bold text-indigo-400 font-mono">99.98%</p>
                  </div>
                </div>

                {/* Stream Console */}
                <div className="p-4 sm:p-5 font-mono text-xs space-y-3 bg-[#0B0F17] min-h-[200px] overflow-x-auto">
                  <div className="flex items-center justify-between text-slate-200 gap-2">
                    <span className="text-emerald-400 font-semibold truncate">POST /api/v1/auth/verify</span>
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] shrink-0 border border-emerald-500/30">200 OK</span>
                    <span className="text-slate-400 shrink-0">18ms</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-200 gap-2">
                    <span className="text-sky-400 font-semibold truncate">GET /api/v1/endpoints/health</span>
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] shrink-0 border border-emerald-500/30">200 OK</span>
                    <span className="text-slate-400 shrink-0">12ms</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-200 gap-2">
                    <span className="text-indigo-400 font-semibold truncate">POST /api/v1/telemetry/ingest</span>
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] shrink-0 border border-emerald-500/30">201 CREATED</span>
                    <span className="text-slate-400 shrink-0">24ms</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-200 gap-2">
                    <span className="text-purple-400 font-semibold truncate">GET /api/v1/users/profile</span>
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] shrink-0 border border-emerald-500/30">200 OK</span>
                    <span className="text-slate-400 shrink-0">9ms</span>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="p-3 bg-[#0F172A] border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">AI Anomaly Guard Active</span>
                  </div>
                  <span className="text-slate-400 font-mono shrink-0">0 Errors</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* SDK CODE PREVIEW */}
        <section className="w-full bg-slate-200/50 dark:bg-[#131C2E]/60 py-16 sm:py-20 border-y border-slate-200 dark:border-slate-800">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white font-display mb-3">
                Integrate in 2 Lines of Code
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-light">
                Vixiem connects seamlessly with Node.js, Python, Java, or REST APIs.
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-slate-900 dark:bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl w-full">
              {/* Tab Nav */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 bg-slate-950 dark:bg-[#182234] border-b border-slate-800 gap-3">
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
                          ? 'bg-sky-500 text-white shadow-md'
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
              <div className="p-5 sm:p-6 bg-slate-950 dark:bg-[#0B0F17] overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-sky-200 w-full">
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
                  className="bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800 rounded-2xl p-7 hover:border-sky-500/40 transition-all duration-300 group shadow-sm dark:shadow-none"
                >
                  <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-sky-500/20 transition-colors">
                    <Icon size={24} className="text-sky-600 dark:text-sky-400" />
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
        <section id="how-it-works" className="w-full bg-slate-200/50 dark:bg-[#131C2E]/60 py-20 border-y border-slate-200 dark:border-slate-800">
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
                  <div key={idx} className="bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800 rounded-2xl p-7 shadow-sm dark:shadow-none">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-3xl font-extrabold text-sky-500/40 font-display">{step.step}</span>
                      <div className="w-10 h-10 bg-sky-500/10 border border-sky-500/30 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
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

            <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-[#182234] border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  billingCycle === 'monthly' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                      ? 'bg-gradient-to-b from-sky-50 to-white dark:from-[#18253D] dark:to-[#131C2E] border-2 border-sky-500 shadow-xl shadow-sky-500/10 md:scale-[1.02]'
                      : 'bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
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
                          <Check className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" />
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
        <section className="w-full bg-slate-200/50 dark:bg-[#131C2E] py-16 border-y border-slate-200 dark:border-slate-800">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-600 dark:text-sky-400 font-display">
                    {stat.value}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide uppercase text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="w-full max-w-[1000px] mx-auto px-4 sm:px-8 lg:px-12 py-20">
          <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 p-8 sm:p-14 text-center shadow-2xl shadow-sky-500/20">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display mb-4 tracking-tight">
              Ready to Monitor Your API Endpoints?
            </h2>
            <p className="text-sky-100 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
              Join thousands of developers using Vixiem for real-time endpoint monitoring and telemetry.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-slate-950 hover:bg-slate-100 font-bold px-8 py-3.5 rounded-xl text-base transition-all shadow-md w-full sm:w-auto"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="bg-slate-950/40 text-white hover:bg-slate-950/60 font-semibold px-8 py-3.5 rounded-xl text-base transition-all border border-white/20 w-full sm:w-auto"
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
