import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Shield, 
  Rocket, 
  Check, 
  Copy, 
  Activity, 
  Cpu, 
  Bell, 
  Terminal,
  Sparkles,
  Server
} from 'lucide-react';

export const HomeBelowTheFold = () => {
  const [activeCodeTab, setActiveCodeTab] = useState('node');
  const [copied, setCopied] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');

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
    <>
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
                        ? 'bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-5 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-slate-300">
              <pre>{codeSnippets[activeCodeTab]}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className="w-full bg-slate-100/50 dark:bg-[#0c0c0e]/30 py-16 sm:py-24 border-y border-slate-200 dark:border-slate-800/80">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display mb-4">
              Enterprise-Grade Observability
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal">
              Built from the ground up for modern engineering teams who demand precision and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-[#111114] border border-slate-200 dark:border-slate-800/80 p-6 sm:p-8 rounded-2xl hover:border-sky-400/50 dark:hover:border-sky-400/30 transition-all duration-300 group hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-sky-500/5"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 flex items-center justify-center mb-6 text-sky-500 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / 3-STEP FLOW */}
      <section className="w-full py-16 sm:py-24 bg-transparent">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display mb-4">
              How Vixiem Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Set up end-to-end endpoint monitoring in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-[#111114] border border-slate-200 dark:border-slate-800"
                >
                  <div className="w-14 h-14 rounded-2xl bg-sky-400/10 border border-sky-400/30 text-sky-400 flex items-center justify-center font-mono font-bold text-xl mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-500 uppercase tracking-widest mb-2">
                    Step {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-display">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="w-full border-y border-slate-200 dark:border-slate-800 bg-sky-50/50 dark:bg-sky-950/10 py-12">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="p-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-sky-500 dark:text-sky-400 font-mono mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="w-full py-16 sm:py-24 bg-transparent">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display mb-4">
              Transparent, Scalable Pricing
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base mb-8">
              Start free, upgrade as your API fleet grows. No hidden fees.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-200 dark:bg-[#141418] border border-slate-300 dark:border-slate-800">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Annual
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col justify-between p-8 rounded-2xl border transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-white dark:bg-[#141418] border-sky-400 shadow-2xl shadow-sky-500/10 scale-100 md:-translate-y-2'
                    : 'bg-white dark:bg-[#0c0c0e] border-slate-200 dark:border-slate-800/80 shadow-sm'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-400 text-slate-950 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mb-6 min-h-[32px]">
                    {plan.desc}
                  </p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                      {billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly}
                    </span>
                    <span className="text-slate-500 text-sm">/month</span>
                  </div>

                  <ul className="space-y-3 mb-8 border-t border-slate-100 dark:border-slate-800/80 pt-6">
                    {plan.features.map((feat, fi) => (
                      <li key={fi} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={plan.link}
                  className={`w-full py-3 rounded-xl font-bold text-sm text-center transition-all ${
                    plan.highlight
                      ? 'bg-sky-400 hover:bg-sky-300 text-slate-950 shadow-lg shadow-sky-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL BOTTOM CTA */}
      <section className="w-full py-16 sm:py-20 relative overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 text-center relative z-10">
          <div className="bg-sky-500/10 dark:bg-sky-950/20 border border-sky-500/20 rounded-3xl p-8 sm:p-14 max-w-4xl mx-auto backdrop-blur-sm relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display mb-4 relative z-10">
              Start Monitoring Your Endpoints Today
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal relative z-10">
              Join thousands of developers using Vixiem for real-time endpoint monitoring and AI diagnostics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                to="/register"
                className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-extrabold px-8 py-3.5 rounded-xl text-base transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-sky-300 hover:bg-slate-50 dark:hover:bg-zinc-800 font-bold px-8 py-3.5 rounded-xl text-base transition-all border border-slate-300 dark:border-zinc-800 w-full sm:w-auto"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeBelowTheFold;
