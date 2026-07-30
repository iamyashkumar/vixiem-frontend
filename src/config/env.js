const API_URL = import.meta.env.VITE_API_BASE_URL;
let apiBaseUrl = API_URL;

if (!API_URL || API_URL.trim() === '') {
  console.warn("VITE_API_BASE_URL is not explicitly set. Defaulting to production backend (https://vixiem-backend.onrender.com).");
  apiBaseUrl = 'https://vixiem-backend.onrender.com';
}

export const config = {
  apiBaseUrl,
  appName: import.meta.env.VITE_APP_NAME || 'Vixiem',
  environment: import.meta.env.VITE_ENVIRONMENT || (import.meta.env.DEV ? 'development' : 'production'),
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
};

export default config;