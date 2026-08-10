import { request } from './client';

export const healthcareWorkerApi = {
  async getHealthcareWorkerPatients() {
    return request('/healthcare-workers/');
  },

  async registerFieldPatient(patientData) {
    return request('/healthcare-workers/', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },
};
