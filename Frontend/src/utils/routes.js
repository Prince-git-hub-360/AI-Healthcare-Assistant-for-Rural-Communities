// Route Constants & Helper Functions

export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    ABOUT: '/about',
    HOW_IT_WORKS: '/how-it-works',
    SOLUTIONS: '/solutions',
    ROADMAP: '/roadmap',
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  APP: {
    PATIENT: {
      DASHBOARD: '/app/patient',
      PROFILE: '/app/patient/profile',
      TRANSLATE: '/app/patient/translate',
      HEALTH_VAULT: '/app/patient/health-vault',
      REMINDERS: '/app/patient/reminders',
      EMERGENCY: '/app/patient/emergency',
    },
    ASHA: {
      DASHBOARD: '/app/asha',
      PATIENTS: '/app/asha/patients',
      FOLLOW_UPS: '/app/asha/follow-ups',
      PROFILE: '/app/asha/profile',
    },
    DOCTOR: {
      DASHBOARD: '/app/doctor',
      PATIENTS: '/app/doctor/patients',
      PRESCRIPTIONS: '/app/doctor/prescriptions',
      PROFILE: '/app/doctor/profile',
    },
    CAREGIVER: {
      DASHBOARD: '/app/caregiver',
      PROFILE: '/app/caregiver/profile',
    },
  },
};

export const navigateTo = (path, state = {}) => {
  if (window.location.pathname !== path) {
    window.history.pushState(state, '', path);
    window.dispatchEvent(new Event('popstate'));
  }
};

export const getRoleDefaultRoute = (role) => {
  switch (role) {
    case 'healthcare_worker':
      return ROUTES.APP.ASHA.DASHBOARD;
    case 'doctor':
      return ROUTES.APP.DOCTOR.DASHBOARD;
    case 'caregiver':
      return ROUTES.APP.CAREGIVER.DASHBOARD;
    case 'patient':
    default:
      return ROUTES.APP.PATIENT.DASHBOARD;
  }
};
