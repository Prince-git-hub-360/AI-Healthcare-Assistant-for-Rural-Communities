import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  User,
  ShieldCheck,
  Globe,
  LogOut,
  ChevronRight,
  Heart,
  Phone,
  MapPin,
  Calendar,
  Building,
  Mail,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AbhaCardView } from '../../components/health/AbhaCardView';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentLanguage, setLanguage, languages } = useLanguage();

  const displayName = user?.first_name || (user?.username && !/^\d+$/.test(user.username) ? user.username : 'Prince Kumar');
  const displayPhone = user?.phone_number || (user?.username && /^\d+$/.test(user.username) ? user.username : '9008802105');
  const displayVillage = user?.village_or_town || 'Rampur Gram, Ward 3';
  const displayDistrict = user?.district || 'Varanasi';
  const displayState = user?.state || 'Uttar Pradesh';
  const displayPincode = user?.pincode || '221001';
  const displayAge = user?.age || 28;
  const displayGender = user?.gender || 'Male';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Settings & Profile / प्रोफ़ाइल</Text>
          <Text style={styles.screenSubtitle}>
            Ayushman Bharat Digital Health Card & Registered Profile Details
          </Text>
        </View>

        {/* User Profile Identity Hero Card */}
        <View style={styles.profileUserCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfoCol}>
            <Text style={styles.profileName}>{displayName}</Text>
            <View style={styles.userMetaRow}>
              <Phone size={13} color={COLORS.textSecondary} />
              <Text style={styles.userMetaText}>+91 {displayPhone}</Text>
            </View>
            <View style={styles.userMetaRow}>
              <MapPin size={13} color={COLORS.textSecondary} />
              <Text style={styles.userMetaText}>{displayVillage}, {displayDistrict}, {displayState}</Text>
            </View>
          </View>
          <View style={styles.roleBadgePrimary}>
            <Text style={styles.roleBadgeText}>Patient</Text>
          </View>
        </View>

        {/* Registered Demographic Information */}
        <Text style={styles.sectionHeader}>Registered Personal Details / व्यक्तिगत विवरण</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name (पूरा नाम)</Text>
            <Text style={styles.detailValue}>{displayName}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mobile Number (मोबाइल नंबर)</Text>
            <Text style={styles.detailValue}>+91 {displayPhone}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Age & Gender (उम्र / लिंग)</Text>
            <Text style={styles.detailValue}>{displayAge} yrs • {displayGender}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>State (राज्य)</Text>
            <Text style={styles.detailValue}>{displayState}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>District (जिला)</Text>
            <Text style={styles.detailValue}>{displayDistrict}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Village / Ward (ग्राम / वार्ड)</Text>
            <Text style={styles.detailValue}>{displayVillage}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>PIN Code (पिन कोड)</Text>
            <Text style={styles.detailValue}>{displayPincode}</Text>
          </View>
        </View>

        {/* Official ABHA Card Component */}
        <Text style={styles.sectionHeader}>My ABHA Digital Health Card</Text>
        <AbhaCardView />

        {/* Regional Language Switcher */}
        <Text style={styles.sectionHeader}>Preferred Language / भाषा चुनें</Text>
        <View style={styles.langGrid}>
          {languages.map((l) => {
            const isSelected = currentLanguage === l.code;
            return (
              <TouchableOpacity
                key={l.code}
                style={[styles.langCard, isSelected && styles.langCardActive]}
                onPress={() => setLanguage(l.code)}
                activeOpacity={0.8}
              >
                <Text style={[styles.langNative, isSelected && styles.langNativeActive]}>
                  {l.nativeName}
                </Text>
                <Text style={[styles.langName, isSelected && styles.langNameActive]}>
                  {l.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <LogOut size={18} color={COLORS.emergency} />
          <Text style={styles.logoutBtnText}>Sign Out / लॉग आउट करें</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: 60,
  },
  header: {
    marginBottom: SPACING.md,
  },
  screenTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
    fontSize: 20,
  },
  screenSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profileUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileInfoCol: {
    flex: 1,
  },
  profileName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  userMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  userMetaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  roleBadgePrimary: {
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  sectionHeader: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  langCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  langCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySurface,
  },
  langNative: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  langNativeActive: {
    color: COLORS.primaryDark,
  },
  langName: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  langNameActive: {
    color: COLORS.primary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.emergency,
  },
});
