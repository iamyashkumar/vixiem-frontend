export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  HEALTH: {
    CHECK: '/health',
    CURRENT_USER: '/health/current-user',
  },
  AI: {
    ANALYZE: '/ai/analyze-errors',
    LIMIT_STATUS: '/ai/limit-status',
    STATS: '/ai/stats',
  },
  LOGS: {
    GET_ALL: '/logs',
    GET_ONE: '/logs/:id',
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