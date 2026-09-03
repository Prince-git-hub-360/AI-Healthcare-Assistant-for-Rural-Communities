export const COLORS = {
  // Deep healthcare green / emerald
  primary: '#0A5C36',
  primaryMedium: '#059669',
  primaryLight: '#D1FAE5',
  primarySurface: '#ECFDF5',
  primaryDark: '#064E2B',

  // Secondary Teal
  secondary: '#0D9488',
  secondaryLight: '#CCFBF1',
  secondaryDark: '#115E59',

  // Accent Warm Amber
  accent: '#D97706',
  accentLight: '#FEF3C7',
  accentDark: '#92400E',

  // Emergency Clear Red
  emergency: '#DC2626',
  emergencyLight: '#FEE2E2',
  emergencyDark: '#991B1B',

  // Status Colors
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#EA580C',
  warningLight: '#FFEDD5',
  info: '#2563EB',
  infoLight: '#DBEAFE',

  // Canvas & Surfaces (Very light warm/neutral)
  background: '#F8FAFC',
  backgroundWarm: '#FBFBFB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  surfaceCard: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#94A3B8',
  borderFocus: '#059669',

  // Typography (Dark charcoal & navy)
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Pill & Timing visual tags
  morning: '#D97706',
  morningBg: '#FEF3C7',
  afternoon: '#0284C7',
  afternoonBg: '#E0F2FE',
  evening: '#7C3AED',
  eveningBg: '#EDE9FE',
  night: '#1E293B',
  nightBg: '#F1F5F9',
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#0A5C36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  sos: {
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const TYPOGRAPHY = {
  display: { fontSize: 26, fontWeight: '800' as const, lineHeight: 32, letterSpacing: -0.5 },
  h1: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28, letterSpacing: -0.3 },
  h2: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24, letterSpacing: -0.2 },
  h3: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  bodyLarge: { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodyBold: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  captionSmall: { fontSize: 11, fontWeight: '600' as const, lineHeight: 14 },
  button: { fontSize: 15, fontWeight: '700' as const, letterSpacing: 0.1 },
};
