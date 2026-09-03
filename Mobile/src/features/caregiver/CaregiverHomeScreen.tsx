import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Heart,
  PhoneCall,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Calendar,
  ChevronRight,
  Flame,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { MOCK_PATIENT } from '../../mock/healthData';
import { Header } from '../../components/common/Header';

export const CaregiverHomeScreen: React.FC<{ navigation?: any }> = () => {
  const [nudgeSent, setNudgeSent] = useState(false);

  const handleCallMother = () => {
    Alert.alert('Calling Lakshmi Devi', 'Initiating call to +91 98765 43210...');
  };

  const handleSendNudge = () => {
    setNudgeSent(true);
    Alert.alert(
      'Voice Nudge Sent / आवाज में संदेश भेजा गया',
      'A gentle regional voice reminder has been played on Lakshmi Devi\'s phone for her afternoon dose.'
    );
  };

  return (
    <View style={styles.container}>
      <Header roleBadge="Caregiver" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Greeting Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Family Caregiver Portal</Text>
            <Text style={styles.subGreeting}>Monitoring: {MOCK_PATIENT.name} (Mother)</Text>
          </View>
        </View>

        {/* Patient Health Overview Hero Card */}
        <View style={styles.patientHeroCard}>
          <View style={styles.patientHeroTop}>
            <View style={styles.patientAvatarCircle}>
              <Heart size={24} color={COLORS.emergency} />
            </View>
            <View style={styles.patientHeroDetails}>
              <Text style={styles.patientName}>{MOCK_PATIENT.name}</Text>
              <Text style={styles.patientLocation}>
                {MOCK_PATIENT.village} • ABHA: {MOCK_PATIENT.abhaId}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.success }]}>
                {MOCK_PATIENT.adherenceRate}%
              </Text>
              <Text style={styles.statLabel}>Adherence Rate</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.streakRow}>
                <Flame size={14} color="#EA580C" />
                <Text style={styles.statValue}>{MOCK_PATIENT.streakDays} Days</Text>
              </View>
              <Text style={styles.statLabel}>Daily Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3 / 5</Text>
              <Text style={styles.statLabel}>Doses Taken</Text>
            </View>
          </View>

          <View style={styles.actionButtonRow}>
            <TouchableOpacity style={styles.callBtn} onPress={handleCallMother} activeOpacity={0.85}>
              <PhoneCall size={16} color={COLORS.textInverse} />
              <Text style={styles.callBtnText}>Call Mother</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.nudgeBtn, nudgeSent && styles.nudgeBtnSent]}
              onPress={handleSendNudge}
              activeOpacity={0.85}
            >
              <Bell size={16} color={nudgeSent ? COLORS.success : COLORS.primaryDark} />
              <Text style={[styles.nudgeBtnText, nudgeSent && { color: COLORS.success }]}>
                {nudgeSent ? 'Nudge Sent ✓' : 'Send Voice Nudge'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Missed Dose Alert Simulator */}
        <View style={styles.alertNotice}>
          <View style={styles.alertNoticeTop}>
            <AlertCircle size={16} color={COLORS.accentDark} />
            <Text style={styles.alertNoticeTitle}>Upcoming Schedule Notice</Text>
          </View>
          <Text style={styles.alertNoticeBody}>
            Afternoon BP medicine (Amlodipine 5mg) is scheduled for 01:30 PM. Auto-alert will trigger if unconfirmed after 45 minutes.
          </Text>
        </View>

        {/* Today's Dose Activity Stream */}
        <Text style={styles.sectionHeader}>Today's Medication Stream</Text>

        <View style={styles.timelineCard}>
          {/* Taken Dose */}
          <View style={styles.timelineRow}>
            <View style={[styles.timelineIconBox, { backgroundColor: COLORS.successLight }]}>
              <CheckCircle2 size={16} color={COLORS.success} />
            </View>
            <View style={styles.timelineInfo}>
              <View style={styles.timelineTitleRow}>
                <Text style={styles.timelineMedTitle}>Metformin 500mg (Morning)</Text>
                <Text style={styles.timelineTime}>08:14 AM</Text>
              </View>
              <Text style={styles.timelineStatusSuccess}>Taken on time with breakfast ✅</Text>
            </View>
          </View>

          <View style={styles.timelineLine} />

          {/* Pending Afternoon Dose */}
          <View style={styles.timelineRow}>
            <View style={[styles.timelineIconBox, { backgroundColor: COLORS.afternoonBg }]}>
              <Clock size={16} color={COLORS.afternoon} />
            </View>
            <View style={styles.timelineInfo}>
              <View style={styles.timelineTitleRow}>
                <Text style={styles.timelineMedTitle}>Amlodipine 5mg (Afternoon)</Text>
                <Text style={styles.timelineTime}>01:30 PM</Text>
              </View>
              <Text style={styles.timelineStatusPending}>Scheduled after lunch</Text>
            </View>
          </View>

          <View style={styles.timelineLine} />

          {/* Night Dose */}
          <View style={styles.timelineRow}>
            <View style={[styles.timelineIconBox, { backgroundColor: COLORS.nightBg }]}>
              <Clock size={16} color={COLORS.night} />
            </View>
            <View style={styles.timelineInfo}>
              <View style={styles.timelineTitleRow}>
                <Text style={styles.timelineMedTitle}>Vitamin D3 & Calcium (Night)</Text>
                <Text style={styles.timelineTime}>08:30 PM</Text>
              </View>
              <Text style={styles.timelineStatusUpcoming}>Scheduled at bedtime with milk</Text>
            </View>
          </View>
        </View>

        {/* Emergency SOS Protection Info */}
        <View style={styles.safetyCard}>
          <ShieldCheck size={22} color={COLORS.primaryDark} />
          <Text style={styles.safetyText}>
            Emergency SOS Protection Active: Any distress button press on your mother's phone will immediately ring your phone and transmit live GPS coordinates.
          </Text>
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
  caregiverBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  caregiverBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E40AF',
  },
  patientHeroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  patientHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  patientAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.emergencyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientHeroDetails: {
    flex: 1,
  },
  patientName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  patientLocation: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginVertical: SPACING.md,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  actionButtonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  callBtn: {
    flex: 1,
    backgroundColor: COLORS.emergency,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    gap: 6,
  },
  callBtnText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
    fontSize: 13,
  },
  nudgeBtn: {
    flex: 1,
    backgroundColor: COLORS.primarySurface,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    gap: 6,
  },
  nudgeBtnSent: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },
  nudgeBtnText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primaryDark,
    fontSize: 13,
  },
  alertNotice: {
    backgroundColor: '#FFFBEB',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: SPACING.md,
  },
  alertNoticeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  alertNoticeTitle: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.accentDark,
    fontWeight: '700',
  },
  alertNoticeBody: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  sectionHeader: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  timelineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  timelineIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineInfo: {
    flex: 1,
  },
  timelineTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineMedTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  timelineTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  timelineStatusSuccess: {
    fontSize: 11,
    color: COLORS.success,
    marginTop: 2,
    fontWeight: '600',
  },
  timelineStatusPending: {
    fontSize: 11,
    color: COLORS.afternoon,
    marginTop: 2,
  },
  timelineStatusUpcoming: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  timelineLine: {
    width: 2,
    height: 16,
    backgroundColor: COLORS.border,
    marginLeft: 15,
    marginVertical: 2,
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.primarySurface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  safetyText: {
    flex: 1,
    ...TYPOGRAPHY.caption,
    color: COLORS.primaryDark,
    lineHeight: 16,
  },
});
