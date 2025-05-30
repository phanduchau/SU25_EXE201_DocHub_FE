import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://localhost:7057/api', // Thay bằng URL thật nếu cần
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
