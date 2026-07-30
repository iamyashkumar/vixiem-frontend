import React from 'react';

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-velorix-800 text-velorix-200 p-4">
      <div className="bg-velorix-800 p-8 rounded-lg shadow-lg max-w-lg w-full border border-red-500/30">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
        <p className="text-velorix-400 mb-4">
          An unexpected error occurred. Please try reloading the page.
        </p>
        <pre className="bg-velorix-900 p-4 rounded text-sm text-red-400 overflow-auto mb-6">
          {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-velorix-teal hover:bg-velorix-teal text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
