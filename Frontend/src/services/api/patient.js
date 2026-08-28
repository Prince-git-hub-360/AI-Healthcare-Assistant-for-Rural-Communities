import { request } from './client';

export const patientApi = {
  async getEmergencyContacts() {
    return request('/emergency/contacts/');
  },

  async getFirstAidGuidance(condition) {
    const query = condition ? `?condition=${encodeURIComponent(condition)}` : '';
    return request(`/emergency/first-aid/${query}`);
  },

  async getNearbyFacilities(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.latitude) queryParams.append('latitude', params.latitude);
    if (params.longitude) queryParams.append('longitude', params.longitude);
    if (params.district) queryParams.append('district', params.district);
    if (params.type) queryParams.append('type', params.type);
    if (params.radius_km) queryParams.append('radius_km', params.radius_km);
    if (params.limit) queryParams.append('limit', params.limit);
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return request(`/emergency/nearby-facilities/${queryString}`);
  },

  async startEmergencySession(payload = {}) {
    return request('/emergency/start/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateEmergencyLocation(payload = {}) {
    return request('/emergency/location/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async stopEmergencySession(payload = {}) {
    return request('/emergency/stop/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getEmergencySessionCard(token) {
    return request(`/emergency/session/${encodeURIComponent(token)}/`);
  },

  async notifyEmergencyContacts(payload = {}) {
    return request('/emergency/notify-contacts/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateAbhaId(abha_number) {
    return request('/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify({ abha_number }),
    });
  },
};

