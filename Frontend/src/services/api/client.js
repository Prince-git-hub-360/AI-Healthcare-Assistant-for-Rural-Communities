/**
 * Core HTTP API Client for Swasthya Sanchar AI
 * Includes automatic JWT token refresh interceptor & session handling
 */

const BASE_URL = '/api/v1';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function request(endpoint, options = {}, isRetry = false) {
  let token = localStorage.getItem('access_token');
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (isFormData && headers['Content-Type']) {
    delete headers['Content-Type'];
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // If 401 Unauthorized and not already retrying login/refresh
    if (response.status === 401 && !isRetry && endpoint !== '/auth/login/' && endpoint !== '/auth/token/refresh/') {
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((newTok) => {
            options.headers = { ...options.headers, Authorization: `Bearer ${newTok}` };
            return request(endpoint, options, true);
          });
        }

        isRefreshing = true;

        try {
          const refreshRes = await fetch(`${BASE_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.access;
            localStorage.setItem('access_token', newAccessToken);
            processQueue(null, newAccessToken);
            isRefreshing = false;

            // Retry original request with new token
            return request(endpoint, options, true);
          } else {
            // Refresh token expired / invalid
            processQueue(new Error('Refresh token expired'), null);
            isRefreshing = false;
            clearSession();
            throw new Error('Session expired. Please sign in again.');
          }
        } catch (err) {
          processQueue(err, null);
          isRefreshing = false;
          clearSession();
          throw new Error('Session expired. Please sign in again.');
        }
      } else {
        clearSession();
        throw new Error('Please sign in to access healthcare services.');
      }
    }

    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.detail || data.message || (typeof data === 'object' ? JSON.stringify(data) : 'API Request Failed');
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export function clearSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new Event('auth:session_expired'));
  }
}
