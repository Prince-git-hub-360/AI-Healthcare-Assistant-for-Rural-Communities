import { CaregiverDashboardPage } from '../../features/caregiver/pages/Dashboard/CaregiverDashboardPage';
import { PrescriptionTranslatorPage } from '../../features/patient/pages/Prescription/PrescriptionTranslatorPage';
import { HealthVaultPage } from '../../features/patient/pages/HealthVault/HealthVaultPage';
import { RemindersPage } from '../../features/patient/pages/Reminders/RemindersPage';
import { EmergencyPage } from '../../features/patient/pages/Emergency/EmergencyPage';
import { PatientProfilePage } from '../../features/patient/pages/Profile/PatientProfilePage';

export const caregiverRoutes = [
  { path: 'dashboard', component: CaregiverDashboardPage },
  { path: 'translate', component: PrescriptionTranslatorPage },
  { path: 'medical_vault', component: HealthVaultPage },
  { path: 'reminders', component: RemindersPage },
  { path: 'emergency', component: EmergencyPage },
  { path: 'profile', component: PatientProfilePage },
];

export default caregiverRoutes;
