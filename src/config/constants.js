export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    GOOGLE: '/api/auth/google',
    ME: '/api/auth/me',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
    CSRF: '/api/auth/csrf',
  },
  HEALTH: {
    CHECK: '/health',
    PING: '/ping',
  },
  AI: {
    ANALYZE: '/api/ai/analyze',
    LIMIT_STATUS: '/api/ai/limit-status',
    STATS: '/api/ai/stats',
  },
  LOGS: {
    GET_ALL: '/api/logs',
    GET_ONE: '/api/logs/:id',
  },
  ENDPOINTS: {
    GET_ALL: '/api/endpoints',
    CREATE: '/api/endpoints',
    GET_ONE: '/api/endpoints/:id',
    UPDATE: '/api/endpoints/:id',
    DELETE: '/api/endpoints/:id',
  },
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
};

export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.5,
  SLOW: 0.8,
};

export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

export default {
  API_ENDPOINTS,
  STORAGE_KEYS,
  ANIMATION_DURATION,
  HTTP_STATUS,
};