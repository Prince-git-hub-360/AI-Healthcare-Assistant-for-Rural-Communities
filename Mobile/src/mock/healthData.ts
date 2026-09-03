export interface MockMedicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection';
  timeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  scheduledTime: string;
  foodInstruction: 'BEFORE_FOOD' | 'AFTER_FOOD' | 'WITH_FOOD';
  foodInstructionHindi: string;
  status: 'PENDING' | 'TAKEN' | 'MISSED';
  takenTime?: string;
  prescribedBy: string;
  duration: string;
  purpose: string;
  color: string;
}

export interface OrganDetail {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  image: any;
  vitals: { label: string; value: string; status: 'optimal' | 'attention' | 'normal' }[];
  relatedConditions: string[];
  activeMedications: string[];
  educationalTip: string;
  educationalTipHindi: string;
  aiSuggestedQuestions: string[];
}

export interface HealthRecordItem {
  id: string;
  title: string;
  type: 'PRESCRIPTION' | 'LAB_REPORT' | 'MEDICAL_REPORT' | 'DISCHARGE_SUMMARY' | 'DOCTOR_NOTE';
  date: string;
  facility: string;
  doctorName: string;
  status: 'VERIFIED' | 'ACTIVE' | 'ARCHIVED';
  summary: string;
  findings: string[];
}

export interface AshaPatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  ward: string;
  abhaId: string;
  adherenceRate: number;
  streakDays: number;
  status: 'ON_TRACK' | 'ATTENTION_NEEDED' | 'CRITICAL';
  pendingDosesToday: number;
  lastVisitDate: string;
  conditions: string[];
  phone: string;
}

export const MOCK_PATIENT = {
  name: 'Lakshmi Devi',
  nameHindi: 'लक्ष्मी देवी',
  age: 58,
  gender: 'Female',
  bloodGroup: 'B +ve',
  abhaId: '91-4820-9921-7740',
  village: 'Rampur Gram (Ward 3)',
  district: 'Varanasi, Uttar Pradesh',
  primaryDoctor: 'Dr. Ramesh Sharma',
  ashaWorker: 'Sunita Bai',
  caregiver: 'Rajesh Kumar (Son)',
  caregiverPhone: '+91 98765 43210',
  adherenceRate: 92,
  completedDosesToday: 3,
  totalDosesToday: 5,
  streakDays: 5,
};

export const MOCK_TODAY_MEDICINES: MockMedicine[] = [
  {
    id: 'med-1',
    name: 'Metformin HCl',
    genericName: 'Glyciphage 500',
    dosage: '500 mg',
    form: 'tablet',
    timeSlot: 'MORNING',
    scheduledTime: '08:00 AM',
    foodInstruction: 'AFTER_FOOD',
    foodInstructionHindi: 'सुबह नाश्ते के बाद',
    status: 'TAKEN',
    takenTime: '08:14 AM',
    prescribedBy: 'Dr. Ramesh Sharma',
    duration: '30 Days',
    purpose: 'Blood sugar control (Diabetes)',
    color: '#059669',
  },
  {
    id: 'med-2',
    name: 'Amlodipine Besylate',
    genericName: 'Amlokind 5',
    dosage: '5 mg',
    form: 'tablet',
    timeSlot: 'AFTERNOON',
    scheduledTime: '01:30 PM',
    foodInstruction: 'AFTER_FOOD',
    foodInstructionHindi: 'दोपहर खाने के बाद',
    status: 'PENDING',
    prescribedBy: 'Dr. Ramesh Sharma',
    duration: '15 Days',
    purpose: 'Blood pressure maintenance',
    color: '#D97706',
  },
  {
    id: 'med-3',
    name: 'Vitamin D3 & Calcium',
    genericName: 'Shelcal HD',
    dosage: '1 Capsule',
    form: 'capsule',
    timeSlot: 'NIGHT',
    scheduledTime: '08:30 PM',
    foodInstruction: 'WITH_FOOD',
    foodInstructionHindi: 'रात भोजन के बाद गुनगुने पानी या दूध से',
    status: 'PENDING',
    prescribedBy: 'Dr. Ramesh Sharma',
    duration: '30 Days',
    purpose: 'Bone strength & joint health',
    color: '#3B82F6',
  },
  {
    id: 'med-4',
    name: 'Atorvastatin',
    genericName: 'Lipvas 10',
    dosage: '10 mg',
    form: 'tablet',
    timeSlot: 'NIGHT',
    scheduledTime: '09:00 PM',
    foodInstruction: 'AFTER_FOOD',
    foodInstructionHindi: 'रात को सोने से पहले',
    status: 'PENDING',
    prescribedBy: 'Dr. Ramesh Sharma',
    duration: '30 Days',
    purpose: 'Cholesterol & cardiac health',
    color: '#6366F1',
  },
];

export const MOCK_ORGANS: Record<string, OrganDetail> = {
  heart: {
    id: 'heart',
    name: 'Heart & Cardiovascular',
    hindiName: 'हृदय और रक्तसंचार',
    icon: '❤️',
    image: require('../../assets/anatomy/organs/heart_3d.jpg'),
    vitals: [
      { label: 'Pulse Rate', value: '72 bpm', status: 'optimal' },
      { label: 'Blood Pressure', value: '124/82 mmHg', status: 'optimal' },
      { label: 'Total Cholesterol', value: '178 mg/dL', status: 'normal' },
    ],
    relatedConditions: ['Mild Hypertension', 'Post-meal heart ease'],
    activeMedications: ['Amlodipine 5mg (1:30 PM)', 'Atorvastatin 10mg (9:00 PM)'],
    educationalTip:
      'The heart beats ~100,000 times a day to supply oxygen to all tissues. Taking blood pressure medication at consistent daily hours prevents sudden spikes.',
    educationalTipHindi:
      'हृदय पूरे शरीर में शुद्ध रक्त पहुंचाता है। रक्तचाप (BP) की दवा प्रतिदिन निश्चित समय पर लेने से दिल सुरक्षित रहता है।',
    aiSuggestedQuestions: [
      'Why is Amlodipine prescribed after lunch?',
      'What foods naturally help lower blood pressure?',
      'How to recognize early chest fatigue symptoms?',
    ],
  },
  brain: {
    id: 'brain',
    name: 'Brain & Nervous System',
    hindiName: 'मस्तिष्क और तंत्रिका तंत्र',
    icon: '🧠',
    image: require('../../assets/anatomy/organs/brain_3d.jpg'),
    vitals: [
      { label: 'Sleep Duration', value: '7.5 hrs', status: 'optimal' },
      { label: 'Nerve Response', value: 'Normal', status: 'optimal' },
      { label: 'Stress Level', value: 'Low', status: 'optimal' },
    ],
    relatedConditions: ['Occasional morning headache', 'Peripheral sensation'],
    activeMedications: ['Vitamin B-Complex & D3'],
    educationalTip:
      'Ensuring 7–8 hours of sound sleep and staying hydrated helps prevent tension headaches and preserves nerve health.',
    educationalTipHindi:
      'पर्याप्त नींद और समय पर पानी पीना मस्तिष्क और नसों को स्वस्थ रखता है।',
    aiSuggestedQuestions: [
      'How does adequate sleep support blood pressure?',
      'What vitamins protect nerve health in elderly patients?',
    ],
  },
  lungs: {
    id: 'lungs',
    name: 'Lungs & Respiratory',
    hindiName: 'फेफड़े और श्वसन तंत्र',
    icon: '🫁',
    image: require('../../assets/anatomy/organs/lungs_3d.jpg'),
    vitals: [
      { label: 'Oxygen SpO2', value: '98%', status: 'optimal' },
      { label: 'Respiration Rate', value: '16 /min', status: 'optimal' },
      { label: 'Airway Flow', value: 'Clear', status: 'normal' },
    ],
    relatedConditions: ['Seasonal winter cough (Resolved)'],
    activeMedications: ['None currently active'],
    educationalTip:
      'Practice gentle 5-minute deep breathing exercises in the morning to maintain optimal lung expansion.',
    educationalTipHindi:
      'सुबह ताजी हवा में गहरी सांस लेने से फेफड़े मजबूत रहते हैं और ऑक्सीजन स्तर बेहतर होता है।',
    aiSuggestedQuestions: [
      'How to protect lungs during crop burning / smoke season?',
      'When should a cough be checked at the PHC?',
    ],
  },
  stomach: {
    id: 'stomach',
    name: 'Stomach & Gastrointestinal',
    hindiName: 'पेट और पाचन तंत्र',
    icon: '🫄',
    image: require('../../assets/anatomy/organs/stomach_3d.jpg'),
    vitals: [
      { label: 'Fasting Glucose', value: '112 mg/dL', status: 'normal' },
      { label: 'Post-Meal Glucose', value: '142 mg/dL', status: 'optimal' },
      { label: 'Digestion Comfort', value: 'Good', status: 'optimal' },
    ],
    relatedConditions: ['Type 2 Diabetes management'],
    activeMedications: ['Metformin 500mg (After breakfast)'],
    educationalTip:
      'Always take Metformin immediately after a meal to avoid stomach irritation and ensure smooth glucose absorption.',
    educationalTipHindi:
      'मेटफ़ॉर्मिन की गोली हमेशा नाश्ते या भोजन के तुरंत बाद लें ताकि पेट में जलन न हो।',
    aiSuggestedQuestions: [
      'Why must diabetes medicine be taken with food?',
      'What are healthy traditional rural breakfast options for diabetics?',
    ],
  },
  kidneys: {
    id: 'kidneys',
    name: 'Kidneys & Renal Balance',
    hindiName: 'गुर्दे और जल संतुलन',
    icon: '🫘',
    image: require('../../assets/anatomy/organs/kidneys_3d.jpg'),
    vitals: [
      { label: 'Serum Creatinine', value: '0.9 mg/dL', status: 'optimal' },
      { label: 'eGFR Level', value: '>90 mL/min', status: 'optimal' },
      { label: 'Daily Hydration', value: '2.2 Liters', status: 'normal' },
    ],
    relatedConditions: ['Electrolyte balance maintenance'],
    activeMedications: ['Adequate water intake recommended'],
    educationalTip:
      'Drinking clean boiled or filtered water throughout the day filters toxins and prevents kidney stone formation.',
    educationalTipHindi:
      'दिनभर में पर्याप्त साफ पानी पीने से गुर्दे ठीक तरह से काम करते हैं और पथरी से बचाव होता है।',
    aiSuggestedQuestions: [
      'How much water is recommended for seniors in summer?',
      'What dietary habits protect kidney function?',
    ],
  },
};

export const MOCK_HEALTH_RECORDS: HealthRecordItem[] = [
  {
    id: 'rec-1',
    title: 'PHC Chronic Care Prescription',
    type: 'PRESCRIPTION',
    date: '18 Aug 2026',
    facility: 'Primary Health Centre, Rampur',
    doctorName: 'Dr. Ramesh Sharma (Medical Officer)',
    status: 'ACTIVE',
    summary: 'Monthly renewal for diabetes & hypertension maintenance regimen.',
    findings: [
      'Metformin 500mg (1 tab morning after breakfast)',
      'Amlodipine 5mg (1 tab afternoon after lunch)',
      'Vitamin D3 & Calcium (1 cap night with milk)',
      'Atorvastatin 10mg (1 tab bedtime)',
    ],
  },
  {
    id: 'rec-2',
    title: 'Quarterly Lipid & Glycemic Panel',
    type: 'LAB_REPORT',
    date: '10 Aug 2026',
    facility: 'District Hospital Diagnostic Center, Varanasi',
    doctorName: 'Dr. Anita Roy (Pathologist)',
    status: 'VERIFIED',
    summary: 'Blood test shows HbA1c improved to 6.4%, cholesterol well controlled.',
    findings: [
      'HbA1c: 6.4% (Target < 7.0%) - Controlled',
      'Fasting Blood Sugar: 112 mg/dL',
      'Total Cholesterol: 178 mg/dL (Normal < 200)',
      'Triglycerides: 140 mg/dL',
    ],
  },
  {
    id: 'rec-3',
    title: 'Annual Cardiovascular Health Summary',
    type: 'MEDICAL_REPORT',
    date: '02 Jul 2026',
    facility: 'Community Health Centre (CHC), Shivpur',
    doctorName: 'Dr. P. K. Mishra (Physician)',
    status: 'VERIFIED',
    summary: 'Resting ECG shows normal sinus rhythm. Blood pressure controlled on monotherapy.',
    findings: [
      'Resting Blood Pressure: 124/82 mmHg',
      'ECG: Normal sinus rhythm, rate 72 bpm',
      'Advised continued daily walking and low sodium diet',
    ],
  },
  {
    id: 'rec-4',
    title: 'ASHA Home Health Visit Record',
    type: 'DOCTOR_NOTE',
    date: '24 Aug 2026',
    facility: 'Rampur Gram Health Sub-Centre',
    doctorName: 'Sunita Bai (ASHA Health Worker)',
    status: 'VERIFIED',
    summary: 'Weekly adherence check conducted. Pillbox verified with 92% compliance.',
    findings: [
      'Patient reported good appetite and energy',
      'BP measured at home: 126/80 mmHg',
      'Reminded patient regarding bedtime Calcium capsule',
    ],
  },
];

export const MOCK_ASHA_DATA = {
  workerName: 'Sunita Bai',
  roleTitle: 'Accredited Social Health Activist (ASHA)',
  sector: 'Rampur Gram Panchayat (Ward 1-4)',
  assignedFamilies: 42,
  totalPatients: 18,
  scheduledVisitsToday: 4,
  completedVisitsToday: 2,
  syncStatus: 'All records staged offline • Auto-sync active',
  criticalAlerts: [
    {
      id: 'alt-1',
      patientName: 'Ram Charan Yadav (Ward 1)',
      type: 'MISSED_DOSE',
      message: 'Missed morning Hypertension dose by 3 hours',
      time: '11:15 AM',
      priority: 'HIGH',
    },
  ],
  patients: [
    {
      id: 'p-1',
      name: 'Lakshmi Devi',
      age: 58,
      gender: 'Female',
      village: 'Rampur Gram (Ward 3)',
      ward: 'Ward 3',
      abhaId: '91-4820-9921-7740',
      adherenceRate: 92,
      streakDays: 5,
      status: 'ON_TRACK',
      pendingDosesToday: 1,
      lastVisitDate: '24 Aug 2026',
      conditions: ['Type 2 Diabetes', 'Hypertension'],
      phone: '+91 98765 43210',
    },
    {
      id: 'p-2',
      name: 'Ram Charan Yadav',
      age: 64,
      gender: 'Male',
      village: 'Rampur Gram (Ward 1)',
      ward: 'Ward 1',
      abhaId: '91-3310-8812-4011',
      adherenceRate: 68,
      streakDays: 1,
      status: 'ATTENTION_NEEDED',
      pendingDosesToday: 2,
      lastVisitDate: '20 Aug 2026',
      conditions: ['Hypertension', 'Arthritis'],
      phone: '+91 98111 22334',
    },
    {
      id: 'p-3',
      name: 'Savitri Bai',
      age: 49,
      gender: 'Female',
      village: 'Rampur Gram (Ward 2)',
      ward: 'Ward 2',
      abhaId: '91-5521-1109-8833',
      adherenceRate: 96,
      streakDays: 12,
      status: 'ON_TRACK',
      pendingDosesToday: 0,
      lastVisitDate: '26 Aug 2026',
      conditions: ['Post-natal check', 'Anemia'],
      phone: '+91 98333 44556',
    },
    {
      id: 'p-4',
      name: 'Gopal Prasad',
      age: 71,
      gender: 'Male',
      village: 'Rampur Gram (Ward 4)',
      ward: 'Ward 4',
      abhaId: '91-7711-2299-6611',
      adherenceRate: 84,
      streakDays: 4,
      status: 'ON_TRACK',
      pendingDosesToday: 1,
      lastVisitDate: '22 Aug 2026',
      conditions: ['COPD / Respiratory', 'Cardiac'],
      phone: '+91 98444 55667',
    },
  ] as AshaPatientRecord[],
};

export const MOCK_DOCTOR_DATA = {
  doctorName: 'Dr. Ramesh Sharma',
  qualification: 'MBBS, DNB (Family Medicine)',
  designation: 'Medical Officer In-Charge',
  hospital: 'Primary Health Centre (PHC), Rampur',
  totalOpdToday: 24,
  consultedToday: 16,
  waitingQueue: 8,
  pendingRxReviews: 3,
  queue: [
    {
      token: 'OPD-17',
      name: 'Lakshmi Devi',
      age: 58,
      gender: 'F',
      complaint: 'Routine Monthly Chronic Care Follow-up',
      vitals: 'BP 124/82 • Sugar 112 • SpO2 98%',
      status: 'IN_CONSULTATION',
      abhaId: '91-4820-9921-7740',
    },
    {
      token: 'OPD-18',
      name: 'Kailash Nath',
      age: 62,
      gender: 'M',
      complaint: 'Joint pain & seasonal dry cough',
      vitals: 'BP 138/88 • SpO2 97%',
      status: 'NEXT',
      abhaId: '91-2290-4411-8822',
    },
    {
      token: 'OPD-19',
      name: 'Meena Kumari',
      age: 32,
      gender: 'F',
      complaint: 'Antenatal 2nd trimester check',
      vitals: 'BP 110/70 • Hb 11.2',
      status: 'WAITING',
      abhaId: '91-9988-1122-3344',
    },
  ],
};
