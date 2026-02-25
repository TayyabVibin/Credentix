import axios from 'axios';
import { dispatchApiError } from '../utils/apiErrorEvent.ts';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('credentix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('credentix_token');
      window.location.href = '/login';
    } else if (error.response?.status && error.response.status >= 400) {
      const msg = error.response?.data?.message ?? error.message ?? 'Something went wrong';
      dispatchApiError(msg);
    }
    return Promise.reject(error);
  },
);

export default api;
