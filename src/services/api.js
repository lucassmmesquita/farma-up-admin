// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
});

// Adicionar interceptor para incluir o token JWT nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@FarmaUP:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado ou inválido, redirecionar para login
      localStorage.removeItem('@FarmaUP:user');
      localStorage.removeItem('@FarmaUP:token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;