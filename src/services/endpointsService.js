import api from './api';

export const endpointsService = {
  getEndpoints: async (tag = '') => {
    const url = tag ? `/api/endpoints?tag=${encodeURIComponent(tag)}` : '/api/endpoints';
    const response = await api.get(url);
    return response.data;
  },

  getEndpointById: async (id) => {
    const response = await api.get(`/api/endpoints/${id}`);
    return response.data;
  },

  createEndpoint: async (endpointData) => {
    const response = await api.post('/api/endpoints', endpointData);
    return response.data;
  },

  updateEndpoint: async (id, endpointData) => {
    const response = await api.put(`/api/endpoints/${id}`, endpointData);
    return response.data;
  },

  deleteEndpoint: async (id) => {
    const response = await api.delete(`/api/endpoints/${id}`);
    return response.data;
  }
};
