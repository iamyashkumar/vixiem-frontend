import api from './api';

export const logsService = {
  getLogs: async (params = {}) => {
    // params can include: page, size, level, keyword, endpointId
    const response = await api.get('/api/logs', { params });
    return response.data;
  },

  getLog: async (id) => {
    const response = await api.get(`/api/logs/${id}`);
    return response.data;
  }
};
