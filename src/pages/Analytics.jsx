import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/animations/PageTransition';

export const Analytics = () => {
  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', paddingTop: '80px', padding: '40px 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container"
        >
          <h1>Analytics</h1>
          <p style={{ color: '#cbd5e1', marginTop: '10px' }}>
            Detailed analytics and insights about your APIs coming soon...
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Analytics;