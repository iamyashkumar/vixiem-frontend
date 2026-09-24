import React from 'react';
import { PageLoader } from '../PageLoader';

/**
 * LoadingSpinner replacement: renders the official branded Vixiem Logo loader
 * instead of the old circular spinner across all pages, Suspense routes, and Auth guards.
 */
export const LoadingSpinner = ({ size = 'md', fullScreen = true, message = 'Loading Vixiem...' }) => {
  return <PageLoader fullScreen={fullScreen} message={message} />;
};

export default LoadingSpinner;
