import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, ArrowRight, Check, Zap, Shield, BarChart3,
  Globe, Clock, ChevronDown, Mail, Twitter, Github, Linkedin,
  Star, Quote
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const features = [
  { icon: Zap, title: 'Real-time Monitoring', desc: 'Sub-second health checks with instant alerts via email, SMS, and webhooks.' },
  { icon: Shield, title: 'AI Diagnostics', desc: 'Smart error analysis that identifies root causes and suggests fixes automatically.' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Deep insights into response times, error rates, and traffic patterns.' },
  { icon: Globe, title: 'Global Status Pages', desc: 'Beautiful public status pages to keep your users informed.' },
  { icon: Clock, title: '99.99% Uptime SLA', desc: 'Enterprise-grade reliability with redundant monitoring infrastructure.' },
  { icon: Activity, title: 'Team Collaboration', desc: 'Multi-user workspaces with role-based access control.' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'CTO at TechFlow', text: 'Velorix reduced our incident response time by 80%. The AI diagnostics are genuinely game-changing.', avatar: 'SC' },
  { name: 'Marcus Johnson', role: 'DevOps Lead at ScaleUp', text: 'We migrated from 3 different tools to Velorix. Best decision we made this year.', avatar: 'MJ' },
  { name: 'Elena Rodriguez', role: 'Founder at APIFirst', text: 'The status page feature alone saved us hundreds of support tickets during our last outage.', avatar: 'ER' },
];

const pricing = [
  { name: 'Free', price: '$0', period: '/month', features: ['5 endpoints', '1-min checks', 'Email alerts', 'Basic analytics'], cta: 'Get Started', popular: false },
  { name: 'Pro', price: '$29', period: '/month', features: ['50 endpoints', '30-sec checks', 'SMS + Webhook alerts', 'AI diagnostics', 'Custom status page'], cta: 'Start Free Trial', popular: true },
  { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited endpoints', '10-sec checks', 'Priority support', 'SSO & SAML', 'Dedicated infrastructure'], cta: 'Contact Sales', popular: false },
];

const faqs = [
  { q: 'How does the AI diagnosis work?', a: 'Our AI analyzes response patterns, error logs, and historical data to identify root causes and suggest specific fixes.' },
  { q: 'Can I monitor private APIs?', a: 'Yes! Velorix supports authentication headers, VPN tunnels, and private network agents.' },
  { q: 'What alert channels do you support?', a: 'Email, SMS, Slack, Discord, PagerDuty, Opsgenie, and custom webhooks.' },
  { q: 'Is there a free trial for Pro?', a: 'Yes, every new account gets a 14-day free trial of Pro features with no credit card required.' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-velorix-400 rounded-lg p-1">
            <div className="w-9 h-9 bg-gradient-to-br from-velorix-400 to-velorix-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Velorix</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400 rounded">Features</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400 rounded">Pricing</a>
            <a href="#faq" className="text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400 rounded">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="px-5 py-2 bg-velorix-500 hover:bg-velorix-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400 rounded px-3 py-2">Sign In</Link>
                <Link to="/register" className="px-5 py-2 bg-velorix-500 hover:bg-velorix-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-velorix-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-velorix-500/10 border border-velorix-500/20 rounded-full text-velorix-300 text-sm font-medium mb-8"
          >
            <Star className="w-4 h-4" /> Next-gen API Monitoring
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Monitor Your APIs <br />
            <span className="bg-gradient-to-r from-velorix-400 to-purple-400 bg-clip-text text-transparent">In Real-Time</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
          >
            Velorix is a powerful API monitoring platform with real-time alerts, advanced analytics, and AI-powered error diagnostics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="px-8 py-4 bg-velorix-500 hover:bg-velorix-600 text-white font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-velorix-400 flex items-center gap-2 text-lg">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 flex items-center gap-2 text-lg">
              Learn More
            </a>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 pt-8 border-t border-slate-800"
          >
            <p className="text-slate-500 text-sm mb-6">Trusted by engineering teams at</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
              {['Vercel', 'Stripe', 'Notion', 'Figma', 'Linear'].map((company) => (
                <span key={company} className="text-lg font-semibold text-slate-400">{company}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Everything you need</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Powerful features designed for modern engineering teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-velorix-500/30 transition-colors group"
              >
                <div className="w-12 h-12 bg-velorix-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-velorix-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-velorix-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-16">Loved by developers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl"
              >
                <Quote className="w-8 h-8 text-velorix-500/30 mb-4" />
                <p className="text-slate-300 mb-6 leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-velorix-500/20 rounded-full flex items-center justify-center text-velorix-300 font-semibold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400 text-lg">Start free, upgrade when you need to.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-2xl border ${plan.popular ? 'border-velorix-500/50 bg-velorix-500/5' : 'border-slate-800 bg-slate-900/60'} relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-velorix-500 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 ${
                    plan.popular
                      ? 'bg-velorix-500 hover:bg-velorix-600 text-white focus:ring-velorix-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-white focus:ring-slate-400'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-16">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus:ring-2 focus:ring-velorix-400"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-medium text-white">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5 text-slate-400 text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-velorix-500/20 to-purple-500/20 border border-velorix-500/20 rounded-3xl p-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to start monitoring?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">Join thousands of developers who trust Velorix to keep their APIs running smoothly.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-velorix-500 hover:bg-velorix-600 text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400 text-lg">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-velorix-400 to-velorix-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Velorix</span>
              </div>
              <p className="text-slate-400 text-sm">Next-generation API monitoring for modern teams.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex items-center gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400 rounded" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400 rounded" aria-label="GitHub"><Github className="w-5 h-5" /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-velorix-400 rounded" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© 2026 Velorix. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}