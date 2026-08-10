import { request } from './client';

export const caregiverApi = {
  async getCaregiverPatients() {
    return request('/caregiver/patients/');
  },
};
