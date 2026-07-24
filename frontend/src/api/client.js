import axios from 'axios';

// In production / docker, default to http://localhost:8000 for backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const customerAPI = {
  getCustomers: async (search = '', stage = '') => {
    const params = {};
    if (search) params.search = search;
    if (stage) params.stage = stage;
    const response = await api.get('/customers', { params });
    return response.data;
  },

  getCustomerById: async (id) => {
    const response = await api.get(`/customer/${id}`);
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customer/${id}`, customerData);
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await api.delete(`/customer/${id}`);
    return response.data;
  },
};

export const noteAPI = {
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  getNotesByCustomer: async (customerId) => {
    const response = await api.get(`/notes/${customerId}`);
    return response.data;
  },
};

export const aiAPI = {
  generateEmail: async (customerId, tone = 'Professional', objective = '') => {
    const response = await api.post('/ai/generate-email', {
      customer_id: customerId,
      tone,
      objective,
    });
    return response.data;
  },

  summarizeNotes: async (customerId) => {
    const response = await api.post('/ai/summarize-notes', {
      customer_id: customerId,
    });
    return response.data;
  },

  getNextBestAction: async (customerId) => {
    const response = await api.post('/ai/next-best-action', {
      customer_id: customerId,
    });
    return response.data;
  },

  generateMeetingSummary: async (customerId, rawTranscript) => {
    const response = await api.post('/ai/meeting-summary', {
      customer_id: customerId,
      raw_transcript: rawTranscript,
    });
    return response.data;
  },
};

export default api;
