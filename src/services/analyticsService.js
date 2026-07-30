import api from './api';

export const analyticsService = {
  getSummary: async () => {
    const response = await api.get('/api/analytics/summary');
    return response.data;
  },

  getEndpointAnalytics: async (id) => {
    const response = await api.get(`/api/analytics/endpoint/${id}`);
    return response.data;
  },

  getEndpointTrend: async (id, timeRange = '24h') => {
    const days = timeRange === '30d' ? 30 : timeRange === '7d' ? 7 : 1;
    const response = await api.get(`/api/analytics/trend/${id}`, {
      params: { days }
    });
    return response.data;
  }
};
