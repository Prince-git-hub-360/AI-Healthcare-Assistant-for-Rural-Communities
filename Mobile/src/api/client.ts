import axios from 'axios';
import { Platform } from 'react-native';
import { SafeStorage } from '../services/safeStorage';

// Default backend IP for local network/emulators
export const DEFAULT_API_BASE_URL = Platform.select({
  android: 'http://192.168.1.3:8000/api/v1',
  ios: 'http://192.168.1.3:8000/api/v1',
  default: 'http://127.0.0.1:8000/api/v1',
});

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@swasthya_access_token',
  REFRESH_TOKEN: '@swasthya_refresh_token',
  USER_PROFILE: '@swasthya_user_profile',
  ACTIVE_LANGUAGE: '@swasthya_language',
  CUSTOM_API_URL: '@swasthya_api_url',
  OFFLINE_PILLBOX: '@swasthya_offline_pillbox',
  OFFLINE_ABHA: '@swasthya_offline_abha',
};

export const apiClient = axios.create({
  baseURL: DEFAULT_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor to inject stored JWT and dynamically set configured URL
apiClient.interceptors.request.use(async (config) => {
  try {
    const customUrl = await SafeStorage.getItem(STORAGE_KEYS.CUSTOM_API_URL);
    if (customUrl && config.baseURL !== customUrl) {
      config.baseURL = customUrl;
    }

    const token = await SafeStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Graceful silent handling
  }
  return config;
});

// Interceptor to handle 401 token refresh cleanly without unhandled rejection pop-ups
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SafeStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const res = await axios.post(`${apiClient.defaults.baseURL}/accounts/token/refresh/`, {
            refresh: refreshToken,
          });
          if (res.data?.access) {
            await SafeStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.access);
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return apiClient(originalRequest);
          }
        }
      } catch {
        // Refresh token failed or expired
      }
    }
    return Promise.reject(error);
  }
);
