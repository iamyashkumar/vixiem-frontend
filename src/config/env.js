const API_URL = import.meta.env.VITE_API_BASE_URL;
let apiBaseUrl = API_URL;

if (!API_URL) {
  if (import.meta.env.DEV) {
    console.warn("VITE_API_BASE_URL is not set. Falling back to localhost for development.");
    apiBaseUrl = 'http://localhost:8080';
  } else {
    throw new Error("Missing required environment variable: VITE_API_BASE_URL");
  }
}

export const config = {
  apiBaseUrl,
  appName: import.meta.env.VITE_APP_NAME || 'Vixiem',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
};

export default config;