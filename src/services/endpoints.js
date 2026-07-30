import api from './api';

export const healthService = {
  async checkHealth() {
    const response = await api.get('/health');
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/health/current-user');
    return response.data;
  },
};

export const aiService = {
  async analyzeErrors(errors) {
    const response = await api.post('/ai/analyze-errors', { errors });
    return response.data;
  },

  async getLimitStatus() {
    const response = await api.get('/ai/limit-status');
    return response.data;
  },

  async getStats() {
    const response = await api.get('/ai/stats');
    return response.data;
  },
};

export const logsService = {
  async getAllLogs() {
    const response = await api.get('/logs');
    return response.data;
  },

  async getLogById(id) {
    const response = await api.get(`/logs/${id}`);
    return response.data;
  },
};

export default {
  healthService,
  aiService,
  logsService,
};