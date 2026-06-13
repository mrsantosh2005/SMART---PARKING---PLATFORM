import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

console.log('🌐 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status}`);
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error('🔌 Network error - Cannot connect to server');
      console.error('   Please check if backend is running on:', API_URL);
    } else {
      console.error(`❌ Error ${error.response.status}:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;