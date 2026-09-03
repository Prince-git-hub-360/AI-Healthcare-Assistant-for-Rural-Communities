import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  Users,
  Search,
  Camera,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronRight,
  UserCheck,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { MOCK_ASHA_DATA } from '../../mock/healthData';
import { Header } from '../../components/common/Header';

export const AshaHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      Alert.alert('Offline Data Synchronized', 'All local field visit notes & patient profiles synced with PHC Central Server.');
    }, 1200);
  };

  const filteredPatients = MOCK_ASHA_DATA.patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.ward.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header roleBadge="ASHA Worker" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Greeting Banner */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, Sunita 👋</Text>
            <Text style={styles.subGreeting}>
              ASHA Sector: Rampur Gram Panchayat (Ward 1–4)
            </Text>
          </View>
        </View>

        {/* Offline Sync Status Banner */}
        <View style={styles.syncBanner}>
          <View style={styles.syncBannerLeft}>
            <ShieldCheck size={16} color={COLORS.primary} />
            <Text style={styles.syncBannerText}>{MOCK_ASHA_DATA.syncStatus}</Text>
          </View>
          <TouchableOpacity onPress={handleSync} style={styles.syncIconBtn} activeOpacity={0.7}>
            <RefreshCw size={14} color={COLORS.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Today's Field Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>4</Text>
            <Text style={styles.metricLabel}>Today's Visits</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: COLORS.accent }]}>18</Text>
            <Text style={styles.metricLabel}>Assigned Patients</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: COLORS.success }]}>88%</Text>
            <Text style={styles.metricLabel}>Avg Adherence</Text>
          </View>
        </View>

        {/* Critical Alerts Banner */}
        <View style={styles.criticalAlertCard}>
          <View style={styles.alertTopRow}>
            <AlertTriangle size={18} color={COLORS.emergency} />
            <Text style={styles.alertHeading}>Critical Missed Dose Alert</Text>
            <Text style={styles.alertTime}>11:15 AM</Text>
          </View>
          <Text style={styles.alertBody}>
            Ram Charan Yadav (Ward 1) has not logged his morning Amlodipine BP dose. Needs home check-in.
          </Text>
        </View>

        {/* Quick Actions Row */}
        <View style={styles.quickActionRow}>
          <TouchableOpacity
            style={styles.quickScanBtn}
            onPress={() => navigation.navigate('Scanner')}
            activeOpacity={0.85}
          >
            <Camera size={18} color={COLORS.textInverse} />
            <Text style={styles.quickScanText}>Field Scan Prescription</Text>
          </TouchableOpacity>
        </View>

        {/* Patient Search */}
        <View style={styles.searchBox}>
          <Search size={16} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patient by name or ward..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        {/* Assigned Patients Roster */}
        <Text style={styles.sectionHeader}>Assigned Rural Patients ({filteredPatients.length})</Text>

        <View style={styles.patientList}>
          {filteredPatients.map((patient) => {
            const isAttention = patient.status === 'ATTENTION_NEEDED';
            return (
              <View key={patient.id} style={styles.patientCard}>
                <View style={styles.patientCardTop}>
                  <View style={styles.patientAvatar}>
                    <Text style={styles.avatarLetter}>{patient.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.patientInfo}>
                    <View style={styles.patientNameRow}>
                      <Text style={styles.patientName}>{patient.name}</Text>
                      <View
                        style={[
                          styles.adherenceBadge,
                          { backgroundColor: isAttention ? COLORS.emergencyLight : COLORS.successLight },
                        ]}
                      >
                        <Text
                          style={[
                            styles.adherenceText,
                            { color: isAttention ? COLORS.emergencyDark : COLORS.success },
                          ]}
                        >
                          {patient.adherenceRate}% Adherence
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.patientMeta}>
                      {patient.age} yrs • {patient.gender} • {patient.ward}
                    </Text>
                  </View>
                </View>

                <View style={styles.patientCardFooter}>
                  <View style={styles.conditionTags}>
                    {patient.conditions.map((c, i) => (
                      <View key={i} style={styles.conditionPill}>
                        <Text style={styles.conditionText}>{c}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.checkinBtn}
                    onPress={() => Alert.alert('Patient Contacted', `Opening visit log for ${patient.name}`)}
                    activeOpacity={0.75}
                  >
                    <UserCheck size={14} color={COLORS.primary} />
                    <Text style={styles.checkinText}>Log Visit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
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
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  greeting: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
  },
  subGreeting: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  ashaBadge: {
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  ashaBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.secondaryDark,
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primarySurface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  syncBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  syncBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  syncIconBtn: {
    padding: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  metricVal: {
    ...TYPOGRAPHY.display,
    color: COLORS.primaryDark,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  criticalAlertCard: {
    backgroundColor: COLORS.emergencyLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  alertTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  alertHeading: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.emergencyDark,
    flex: 1,
  },
  alertTime: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.emergency,
  },
  alertBody: {
    ...TYPOGRAPHY.caption,
    color: COLORS.emergencyDark,
    lineHeight: 16,
  },
  quickActionRow: {
    marginBottom: SPACING.md,
  },
  quickScanBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    ...SHADOWS.subtle,
  },
  quickScanText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  sectionHeader: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  patientList: {
    gap: SPACING.sm,
  },
  patientCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  patientCardTop: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  patientAvatar: {
    width: 42,
    height: 42,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primaryDark,
  },
  patientInfo: {
    flex: 1,
  },
  patientNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  adherenceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  adherenceText: {
    fontSize: 10,
    fontWeight: '800',
  },
  patientMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  patientCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  conditionTags: {
    flexDirection: 'row',
    gap: 4,
  },
  conditionPill: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  conditionText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  checkinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.sm,
  },
  checkinText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
