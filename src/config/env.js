const API_URL = import.meta.env.VITE_API_BASE_URL;
let apiBaseUrl = API_URL;

if (!API_URL || API_URL.trim() === '') {
  console.warn("VITE_API_BASE_URL is not explicitly set. Falling back to default backend URL (http://localhost:8080).");
  apiBaseUrl = 'http://localhost:8080';
}

export const config = {
  apiBaseUrl,
  appName: import.meta.env.VITE_APP_NAME || 'Vixiem',
  environment: import.meta.env.VITE_ENVIRONMENT || (import.meta.env.DEV ? 'development' : 'production'),
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
};

export default config;