import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: ['Features', 'Integrations', 'Pricing', 'Changelog'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'API Reference', 'Blog', 'Community'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'],
    },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-[#08080A] border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 font-light">
              Next-generation API monitoring and observability platform for modern engineering teams.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'GitHub', 'Discord'].map((social) => (
                <motion.a
                  key={social}
                  href={`#${social.toLowerCase()}`}
                  className="text-slate-500 dark:text-slate-400 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <span className="text-sm font-medium">{social}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-4 font-display">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-slate-600 dark:text-slate-400 hover:text-sky-400 dark:hover:text-sky-400 text-sm transition-colors font-light"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-8 mt-8 text-center">
          <p className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-light">
            &copy; {currentYear} Vixiem. All rights reserved. | Enterprise-grade API Telemetry
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;