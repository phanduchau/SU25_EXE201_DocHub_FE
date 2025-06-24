import axios from 'axios';
import { refreshTokenApi } from '../apis/auth/authApi';

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Thay bằng URL thật nếu cần
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ✅ Gắn access token vào mỗi request
axiosClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Biến trạng thái để tránh gọi refresh nhiều lần cùng lúc
let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  subscribers.push(cb);
};

const onRefreshed = (newToken: string) => {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
};

// ✅ Interceptor xử lý lỗi token hết hạn
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await refreshTokenApi();
        const newToken = res.result.token;
        const newRefreshToken = res.result.refreshToken;

        const remember = localStorage.getItem('remember') === 'true';

        if (remember) {
          localStorage.setItem('token', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        } else {
          sessionStorage.setItem('token', newToken);
          sessionStorage.setItem('refreshToken', newRefreshToken);
        }

        onRefreshed(newToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
