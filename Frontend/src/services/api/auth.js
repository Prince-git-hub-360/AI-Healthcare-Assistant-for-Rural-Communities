import { request } from './client';

export const authApi = {
  async login(username, password) {
    return request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async register(userData) {
    return request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getProfile() {
    return request('/auth/profile/', {
      method: 'GET',
    });
  },

  async updateProfile(profileData) {
    return request('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  async refreshToken(refreshToken) {
    return request('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },

  async logout() {
    return request('/auth/logout/', {
      method: 'POST',
    }).catch(() => ({}));
  },
};
