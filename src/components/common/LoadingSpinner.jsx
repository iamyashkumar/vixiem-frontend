import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md', fullScreen = true }) => {
  const sizeMap = {
    sm: 30,
    md: 50,
    lg: 80,
  };

  const spinnerSize = sizeMap[size];

  return (
    <motion.div
      className={`flex-center ${fullScreen ? 'min-h-screen' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: '4px solid rgba(20, 184, 166, 0.1)',
          borderTop: '4px solid var(--primary)',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
};

export default LoadingSpinner;