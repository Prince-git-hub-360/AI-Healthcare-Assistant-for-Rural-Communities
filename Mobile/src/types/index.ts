export type UserRole = 'PATIENT' | 'HEALTHCARE_WORKER' | 'CAREGIVER' | 'DOCTOR' | 'ADMIN';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone_number?: string;
  preferred_language: string;
  abha_id?: string;
  village_or_town?: string;
  district?: string;
  state?: string;
  pincode?: string;
  age?: number | string;
  gender?: string;
  date_of_birth?: string;
}

export interface AuthResponse {
  access?: string;
  refresh?: string;
  tokens?: {
    access: string;
    refresh?: string;
  };
  user: UserProfile;
}

export interface MedicationItem {
  id: number;
  medicine_name: string;
  dosage: string;
  frequency: string;
  timing: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT' | 'CUSTOM';
  food_instruction: 'BEFORE_FOOD' | 'AFTER_FOOD' | 'WITH_FOOD' | 'EMPTY_STOMACH';
  duration_days: number;
  instructions_simple?: string;
}

export interface PrescriptionRecord {
  id: number;
  doctor_name: string;
  clinic_hospital?: string;
  date_prescribed: string;
  status: 'PROCESSING' | 'PARSED' | 'VERIFIED' | 'FAILED';
  raw_text?: string;
  medications: MedicationItem[];
  image_url?: string;
  audio_url?: string;
  audio_hindi_url?: string;
  audio_regional_url?: string;
  language_code?: string;
}

export interface ReminderDose {
  id: number;
  medication_name: string;
  dosage: string;
  scheduled_time: string;
  time_of_day: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  food_instruction: string;
  status: 'PENDING' | 'TAKEN' | 'MISSED' | 'SNOOZED';
  taken_at?: string;
  day_offset: number; // 0 for today, 1 for tomorrow, etc.
}

export interface AbhaHealthCard {
  abha_id: string;
  abha_number: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  blood_group?: string;
  qr_code_data: string;
  emergency_contact: string;
  address_line: string;
  village_district: string;
  state: string;
}

export interface AshaPatientItem {
  id: number;
  full_name: string;
  abha_id: string;
  age: number;
  gender: string;
  village: string;
  adherence_rate: number;
  active_prescriptions_count: number;
  pending_doses_today: number;
  last_visited?: string;
}
