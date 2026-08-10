import { request } from './client';
import { authApi } from './auth';
import { patientApi } from './patient';
import { healthcareWorkerApi } from './healthcareWorker';
import { caregiverApi } from './caregiver';
import { prescriptionApi } from './prescription';
import { medicationApi } from './medication';
import { healthVaultApi } from './healthVault';

export const api = {
  // System Health
  async healthCheck() {
    return request('/sync/health-check/');
  },

  // Auth
  ...authApi,

  // Patient & Emergency
  ...patientApi,

  // Healthcare Worker
  ...healthcareWorkerApi,

  // Caregiver
  ...caregiverApi,

  // Prescription & Translation
  ...prescriptionApi,

  // Medication Reminders
  ...medicationApi,

  // Health Vault
  ...healthVaultApi,
};

export {
  authApi,
  patientApi,
  healthcareWorkerApi,
  caregiverApi,
  prescriptionApi,
  medicationApi,
  healthVaultApi,
};

export default api;
