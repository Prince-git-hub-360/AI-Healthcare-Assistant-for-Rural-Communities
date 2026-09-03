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

  async lookupPatientByAbha(abhaId) {
    return request(`/patients/abha/${encodeURIComponent(abhaId)}/`);
  },

  async saveClinicalNote(abhaId, noteData) {
    return request(`/patients/abha/${encodeURIComponent(abhaId)}/notes/`, {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  },

  async getAbhaDirectory(params = {}) {
    const query = new URLSearchParams();
    if (params.triage) query.append('triage', params.triage);
    if (params.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/patients/abha/directory/${qs}`);
  },
};

