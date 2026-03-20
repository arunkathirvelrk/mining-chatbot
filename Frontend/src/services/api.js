import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // safe for future auth/session use
});

/* ===================== AUTH ===================== */

export const authService = {
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
};

/* ===================== CHAT ===================== */

export const chatService = {
  /**
   * REQUIRED payload:
   * {
   *   email,
   *   query,
   *   chat_id,   // null OR existing
   *   messages   // full message array
   * }
   */
  query: async (payload) => {
    const res = await api.post('/chat/query', payload);
    return res.data; // { answer, messages, chat_id }
  },

  getHistory: async (email) => {
    const res = await api.get(`/chat/history/${email}`);
    return Array.isArray(res.data) ? res.data : [];
  },
};

/* ===================== ADMIN ===================== */

export const adminService = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  },
};

export default api;
