import api from './api';

export const aiService = {
  getLimitStatus: async () => {
    const response = await api.get('/api/ai/limit-status');
    return response.data;
  },

  analyzeErrors: async (endpointId, errors) => {
    const response = await api.post('/api/ai/analyze', { endpointId, errors });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/api/ai/stats');
    return response.data;
  }
};
