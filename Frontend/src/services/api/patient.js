import { request } from './client';

export const patientApi = {
  async getEmergencyContacts() {
    return request('/emergency/contacts/');
  },

  async getFirstAidGuidance() {
    return request('/emergency/first-aid/');
  },

  async getNearbyFacilities() {
    return request('/emergency/nearby-facilities/');
  },

  async updateAbhaId(abha_number) {
    return request('/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify({ abha_number }),
    });
  },
};
