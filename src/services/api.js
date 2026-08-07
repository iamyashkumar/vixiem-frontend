import axios from 'axios';
import toast from 'react-hot-toast';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config/constants';

import { config } from '../config/env';

const apiBaseUrl = config.apiBaseUrl;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 75000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Silent background warmup call for Render free tier sleep mode
export const warmupBackend = async () => {
  try {
    await axios.get(`${apiBaseUrl}/health`, { timeout: 75000, withCredentials: true });
  } catch (e) {
    // Ignore warmup errors
  }
};

// Fire warmup ping immediately when api module loads
warmupBackend();

// We no longer need a request interceptor to inject Authorization headers 
// because HttpOnly cookies are handled automatically by Axios.
// However, because frontend (5173) and backend (8080) are different origins (ports),
// Axios will not automatically read and send the XSRF-TOKEN cookie. We must inject it manually.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
  if (match) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[2]);
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    // Automatic retry once for timed out requests (Render cold starts)
    if ((error.code === 'ECONNABORTED' || error.message?.includes('timeout')) && originalRequest && !originalRequest._isRetryAttempt) {
      originalRequest._isRetryAttempt = true;
      toast.loading('Server is starting up, please wait a moment...', { id: 'cold-start-warmup', duration: 4000 });
      try {
        return await api(originalRequest);
      } catch (retryErr) {
        error = retryErr;
      }
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.message = 'Server request timed out. Please check back in a few seconds while the server wakes up.';
      toast.error(error.message, { id: 'timeout-error' });
    } else if (status === 401) {
      if (
        originalRequest.url.includes(API_ENDPOINTS.AUTH.REFRESH) ||
        originalRequest.url.includes(API_ENDPOINTS.AUTH.LOGIN) ||
        originalRequest.url.includes(API_ENDPOINTS.AUTH.REGISTER) ||
        originalRequest.url.includes(API_ENDPOINTS.AUTH.GOOGLE) ||
        originalRequest.url.includes('/api/ai/')
      ) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || localStorage.getItem('refreshToken') || localStorage.getItem('vixiem_refresh_token');
      if (!refreshToken) {
        if (window.location.pathname.startsWith('/dashboard')) {
          window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function(resolve, reject) {
        axios.post(`${apiBaseUrl}${API_ENDPOINTS.AUTH.REFRESH}`, { refresh_token: refreshToken }, { withCredentials: true })
          .then((res) => {
            if (res.data?.accessToken) {
              localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.accessToken);
              localStorage.setItem('vixiem_access_token', res.data.accessToken);
              if (res.data.refreshToken) {
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.data.refreshToken);
                localStorage.setItem('vixiem_refresh_token', res.data.refreshToken);
              }
            }
            processQueue(null);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err);
            if (window.location.pathname.startsWith('/dashboard')) {
              window.dispatchEvent(new Event('auth:logout'));
            }
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    } else if (status === 403) {
      if (error.response?.data?.error !== 'EMAIL_NOT_VERIFIED') {
        toast.error('You do not have permission to access this resource.');
      }
    } else if (status && status >= 500) {
      // Suppress generic 500 toasts for AI endpoints since the UI handles them gracefully
      if (originalRequest && !originalRequest.url.includes('/api/ai/')) {
        toast.error('Server error. Please try again later.');
      }
    } else if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// Expose api to window for manual one-off testing (Task 2.1 Concurrency Verification)
if (import.meta.env.DEV) {
  window.api = api;
}

export default api;