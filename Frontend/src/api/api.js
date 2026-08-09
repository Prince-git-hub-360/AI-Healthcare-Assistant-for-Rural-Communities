/**
 * API Service for AI-Powered Healthcare Communication Assistant
 * Includes Automatic JWT Token Refresh Interceptor & Invalid Token Auto-Recovery
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

async function request(endpoint, options = {}, isRetry = false) {
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

function clearSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  if (window.dispatchEvent) {
    window.dispatchEvent(new Event('auth:session_expired'));
  }
}

export const api = {
  // System Health
  async healthCheck() {
    return request('/sync/health-check/');
  },

  // Auth & User Management
  async login(username, password, expected_role = null) {
    const body = { username, password };
    if (expected_role) body.expected_role = expected_role;
    return request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(body),
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

  // Medical Documents & Prescriptions Vault
  async getMedicalDocuments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `/medical-documents/${query ? `?${query}` : ''}`;
    return request(url);
  },

  async uploadMedicalDocument(formData) {
    return request('/medical-documents/', {
      method: 'POST',
      body: formData,
    });
  },

  async deleteMedicalDocument(docId) {
    return request(`/medical-documents/${docId}/`, {
      method: 'DELETE',
    });
  },

  async textToSpeech(text, target_language = 'hi') {
    return request('/voice/text-to-speech/', {
      method: 'POST',
      body: JSON.stringify({ text, target_language }),
    });
  },

  // Medication Reminders
  async getReminders() {
    return request('/reminders/');
  },

  async createReminder(reminderData) {
    return request('/reminders/', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });
  },

  async toggleReminder(reminderId, is_taken) {
    return request(`/reminders/${reminderId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_taken }),
    });
  },

  async deleteReminder(reminderId) {
    return request(`/reminders/${reminderId}/`, {
      method: 'DELETE',
    });
  },

  // Healthcare Workers & Field Patients
  async getHealthcareWorkerPatients() {
    return request('/healthcare-workers/');
  },

  async registerFieldPatient(patientData) {
    return request('/healthcare-workers/', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },

  // Emergency Assistance & Health Education
  async getEmergencyContacts() {
    return request('/emergency/contacts/');
  },

  async getFirstAidGuidance() {
    return request('/emergency/first-aid/');
  },

  async getNearbyFacilities() {
    return request('/emergency/nearby-facilities/');
  },

  // ABDM / ABHA Health Account & DPDP Privacy
  async updateAbhaId(abha_number) {
    return request('/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify({ abha_number }),
    });
  },

  // Voice Guidance & Text-To-Speech
  async textToSpeech(text, target_language = 'hi') {
    return request('/voice/text-to-speech/', {
      method: 'POST',
      body: JSON.stringify({ text, target_language }),
    });
  },
};
