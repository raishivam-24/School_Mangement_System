/**
 * @file api.ts
 * @description Central Axios HTTP client instance with HttpOnly cookie support and error handling.
 */

import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enables automatic HttpOnly cookie transmission
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer header if token is stored in memory / local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('schoolhub_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle global 401 unauthenticated redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login') && window.location.pathname !== '/') {
      localStorage.removeItem('schoolhub_token');
      localStorage.removeItem('schoolhub_user');
      // Optional: redirect to login if session expired
    }
    return Promise.reject(error);
  }
);
