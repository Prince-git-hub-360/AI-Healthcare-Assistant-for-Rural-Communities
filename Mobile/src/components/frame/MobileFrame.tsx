import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, Smartphone, User, Shield, Stethoscope, Heart, Users } from 'lucide-react-native';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isWeb = Platform.OS === 'web';
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { user, loginAsDemo, logout } = useAuth();
  const { currentLanguage, setLanguage, languages } = useLanguage();

  const [deviceWidth, setDeviceWidth] = useState<number>(390);
  const [deviceHeight, setDeviceHeight] = useState<number>(844);

  // If running on a real mobile device or native emulator, don't wrap in fake frame
  if (!isWeb || windowWidth < 600) {
    return <View style={styles.nativeContainer}>{children}</View>;
  }

  const activeLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <View style={styles.webDesktopBackground}>
      {/* Top Prototype Control Ribbon for Designers & Evaluators */}
      <View style={styles.topControlRibbon}>
        <View style={styles.ribbonLeft}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>SWASTHYA AI</Text>
          </View>
          <Text style={styles.ribbonTitle}>Mobile Design Prototype Preview</Text>
          <Text style={styles.viewportBadge}>{deviceWidth} × {deviceHeight} dp</Text>
        </View>

        {/* 1-Click Role Switcher */}
        <View style={styles.ribbonRoleSwitcher}>
          <Text style={styles.switchRoleLabel}>Switch Role:</Text>
          <TouchableOpacity
            style={[styles.roleChip, user?.role === 'PATIENT' && styles.roleChipActive]}
            onPress={() => loginAsDemo('PATIENT')}
          >
            <User size={13} color={user?.role === 'PATIENT' ? COLORS.textInverse : COLORS.textPrimary} />
            <Text style={[styles.roleChipText, user?.role === 'PATIENT' && styles.roleChipTextActive]}>
              Patient (Lakshmi)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleChip, user?.role === 'HEALTHCARE_WORKER' && styles.roleChipActive]}
            onPress={() => loginAsDemo('ASHA')}
          >
            <Users size={13} color={user?.role === 'HEALTHCARE_WORKER' ? COLORS.textInverse : COLORS.textPrimary} />
            <Text style={[styles.roleChipText, user?.role === 'HEALTHCARE_WORKER' && styles.roleChipTextActive]}>
              ASHA (Sunita)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleChip, user?.role === 'CAREGIVER' && styles.roleChipActive]}
            onPress={() => loginAsDemo('CAREGIVER')}
          >
            <Heart size={13} color={user?.role === 'CAREGIVER' ? COLORS.textInverse : COLORS.textPrimary} />
            <Text style={[styles.roleChipText, user?.role === 'CAREGIVER' && styles.roleChipTextActive]}>
              Caregiver (Rajesh)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleChip, user?.role === 'DOCTOR' && styles.roleChipActive]}
            onPress={() => loginAsDemo('DOCTOR')}
          >
            <Stethoscope size={13} color={user?.role === 'DOCTOR' ? COLORS.textInverse : COLORS.textPrimary} />
            <Text style={[styles.roleChipText, user?.role === 'DOCTOR' && styles.roleChipTextActive]}>
              Doctor (Dr. Sharma)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Language Pill Switcher */}
        <View style={styles.ribbonRight}>
          <TouchableOpacity
            style={styles.langPill}
            onPress={() => {
              const next = currentLanguage === 'hi' ? 'en' : currentLanguage === 'en' ? 'mr' : currentLanguage === 'mr' ? 'ta' : 'hi';
              setLanguage(next);
            }}
          >
            <Globe size={14} color={COLORS.primary} />
            <Text style={styles.langPillText}>{activeLangObj.nativeName} ({activeLangObj.code.toUpperCase()})</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Centered Device Canvas */}
      <View style={styles.deviceWrapper}>
        <View
          style={[
            styles.deviceFrame,
            { width: deviceWidth, height: Math.min(deviceHeight, windowHeight - 100) },
          ]}
        >
          {/* Realistic Mobile Status Bar */}
          <View style={styles.statusBar}>
            <Text style={styles.statusTime}>9:41</Text>
            <View style={styles.notchPill} />
            <View style={styles.statusIcons}>
              <Text style={styles.statusIconText}>5G</Text>
              <Text style={styles.statusIconText}>100%</Text>
            </View>
          </View>

          {/* Actual Mobile App Viewport */}
          <View style={styles.appContainer}>{children}</View>

          {/* Home Indicator Bar */}
          <View style={styles.homeIndicatorWrapper}>
            <View style={styles.homeIndicator} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webDesktopBackground: {
    flex: 1,
    backgroundColor: '#0F172A', // Sleek dark stage for contrast
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topControlRibbon: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingHorizontal: SPACING.xl,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  ribbonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  brandBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  brandBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  ribbonTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  viewportBadge: {
    fontSize: 11,
    color: '#94A3B8',
    backgroundColor: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ribbonRoleSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchRoleLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginRight: 4,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
  },
  roleChipActive: {
    backgroundColor: COLORS.primary,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  roleChipTextActive: {
    color: '#FFFFFF',
  },
  ribbonRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  deviceWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  deviceFrame: {
    backgroundColor: COLORS.background,
    borderRadius: 48,
    borderWidth: 8,
    borderColor: '#334155',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
    position: 'relative',
  },
  statusBar: {
    height: 40,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 50,
  },
  statusTime: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  notchPill: {
    width: 80,
    height: 20,
    backgroundColor: '#0F172A',
    borderRadius: 10,
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 6,
  },
  statusIconText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  homeIndicatorWrapper: {
    height: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 130,
    height: 4,
    backgroundColor: COLORS.borderDark,
    borderRadius: 2,
  },
});
