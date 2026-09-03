import { apiClient } from './client';
import {
  AuthResponse,
  UserProfile,
  PrescriptionRecord,
  ReminderDose,
  AbhaHealthCard,
  AshaPatientItem,
} from '../types';

export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post('/accounts/login/', { username, password });
    return res.data;
  },

  sendOtp: async (phone: string): Promise<{ status: string; otp: string; message: string }> => {
    const res = await apiClient.post('/accounts/otp/send/', { phone });
    return res.data;
  },

  verifyOtp: async (
    phone: string,
    otp: string,
    role: string,
    firstName?: string
  ): Promise<AuthResponse> => {
    const res = await apiClient.post('/accounts/otp/verify/', {
      phone,
      otp,
      role,
      first_name: firstName,
    });
    return res.data;
  },

  register: async (userData: any): Promise<any> => {
    const res = await apiClient.post('/accounts/register/', userData);
    return res.data;
  },

  resetPassword: async (phone: string, newPassword: string): Promise<any> => {
    const res = await apiClient.post('/accounts/password/phone-reset/', {
      phone,
      new_password: newPassword,
    });
    return res.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const res = await apiClient.get('/accounts/profile/');
    return res.data;
  },

  updateLanguage: async (languageCode: string): Promise<UserProfile> => {
    const res = await apiClient.patch('/accounts/profile/', { preferred_language: languageCode });
    return res.data;
  },
};

export const prescriptionApi = {
  getAll: async (): Promise<PrescriptionRecord[]> => {
    const res = await apiClient.get('/medications/prescriptions/');
    return res.data?.results || res.data || [];
  },

  getDetail: async (id: number): Promise<PrescriptionRecord> => {
    const res = await apiClient.get(`/medications/prescriptions/${id}/`);
    return res.data;
  },

  uploadScan: async (formData: FormData): Promise<PrescriptionRecord> => {
    const res = await apiClient.post('/medical/prescriptions/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export const pillboxApi = {
  getSchedule: async (days: number = 5): Promise<ReminderDose[]> => {
    const res = await apiClient.get(`/reminders/schedule/?days=${days}`);
    return res.data?.results || res.data || [];
  },

  markDoseTaken: async (reminderId: number): Promise<{ success: boolean; streak: number }> => {
    const res = await apiClient.post(`/reminders/schedule/${reminderId}/mark_taken/`);
    return res.data;
  },

  getStreak: async (): Promise<{ current_streak: number; adherence_percentage: number }> => {
    const res = await apiClient.get('/reminders/adherence_summary/');
    return res.data;
  },
};

export const patientApi = {
  getAbhaCard: async (): Promise<AbhaHealthCard> => {
    const res = await apiClient.get('/patients/health-card/');
    return res.data;
  },

  sendEmergencySos: async (latitude?: number, longitude?: number): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post('/medical/emergency/sos/', {
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    });
    return res.data;
  },
};

export const voiceApi = {
  getAudioForText: async (text: string, languageCode: string): Promise<{ audio_url: string }> => {
    const res = await apiClient.post('/translations/synthesize-audio/', {
      text,
      language: languageCode,
    });
    return res.data;
  },
};

export const ashaApi = {
  getRoster: async (): Promise<AshaPatientItem[]> => {
    const res = await apiClient.get('/healthcare-workers/patients/');
    return res.data?.results || res.data || [];
  },

  registerPatient: async (patientData: any): Promise<AshaPatientItem> => {
    const res = await apiClient.post('/healthcare-workers/patients/', patientData);
    return res.data;
  },

  syncOfflineBatch: async (records: any[]): Promise<{ synced_count: number }> => {
    const res = await apiClient.post('/healthcare-workers/sync-batch/', { records });
    return res.data;
  },
};
