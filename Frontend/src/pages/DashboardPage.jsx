import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PatientHomePage } from '../features/patient/pages/PatientHome/PatientHomePage';
import { WorkerDashboardPage } from '../features/healthcare-worker/pages/Dashboard/WorkerDashboardPage';
import { CaregiverDashboardPage } from '../features/caregiver/pages/Dashboard/CaregiverDashboardPage';

export const DashboardPage = (props) => {
  const { user } = useAuth();
  const role = user?.role || 'patient';

  if (role === 'healthcare_worker' || role === 'doctor') {
    return <WorkerDashboardPage {...props} />;
  }
  if (role === 'caregiver') {
    return <CaregiverDashboardPage {...props} />;
  }
  return <PatientHomePage {...props} />;
};

export default DashboardPage;
