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
  Stethoscope,
  Users,
  FileCheck2,
  AlertCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  CheckCircle2,
  Search,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { MOCK_DOCTOR_DATA } from '../../mock/healthData';
import { Header } from '../../components/common/Header';

export const DoctorHomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header roleBadge="PHC Doctor" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Greeting Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{MOCK_DOCTOR_DATA.doctorName} 🩺</Text>
            <Text style={styles.subGreeting}>{MOCK_DOCTOR_DATA.hospital}</Text>
          </View>
        </View>

        {/* OPD Daily Metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>{MOCK_DOCTOR_DATA.totalOpdToday}</Text>
            <Text style={styles.metricLabel}>Total OPD</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: COLORS.success }]}>
              {MOCK_DOCTOR_DATA.consultedToday}
            </Text>
            <Text style={styles.metricLabel}>Consulted</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: COLORS.accent }]}>
              {MOCK_DOCTOR_DATA.waitingQueue}
            </Text>
            <Text style={styles.metricLabel}>In Queue</Text>
          </View>
        </View>

        {/* Prescription Verification Quick Action Card */}
        <View style={styles.rxReviewBanner}>
          <View style={styles.rxReviewLeft}>
            <FileCheck2 size={22} color={COLORS.primary} />
            <View style={styles.rxReviewInfo}>
              <Text style={styles.rxReviewTitle}>3 AI Prescription Reviews Pending</Text>
              <Text style={styles.rxReviewSub}>
                OCR digitized prescriptions from ASHA field visits awaiting doctor digital sign-off.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.reviewBtn}
            onPress={() => Alert.alert('Prescription Review Queue', 'Opening doctor verification workflow for pending OCR scripts.')}
            activeOpacity={0.85}
          >
            <Text style={styles.reviewBtnText}>Review Now</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Active Patient Queue */}
        <Text style={styles.sectionHeader}>Today's Live OPD Queue</Text>

        <View style={styles.queueList}>
          {MOCK_DOCTOR_DATA.queue.map((item, idx) => {
            const isInConsult = item.status === 'IN_CONSULTATION';
            return (
              <View key={idx} style={[styles.queueCard, isInConsult && styles.queueCardActive]}>
                <View style={styles.tokenBox}>
                  <Text style={styles.tokenText}>{item.token}</Text>
                  <Text style={styles.tokenStatus}>{item.status.replace('_', ' ')}</Text>
                </View>

                <View style={styles.queueInfo}>
                  <View style={styles.queueNameRow}>
                    <Text style={styles.patientName}>{item.name}</Text>
                    <Text style={styles.patientMeta}>
                      {item.age} yrs • {item.gender}
                    </Text>
                  </View>
                  <Text style={styles.complaintText}>{item.complaint}</Text>
                  <Text style={styles.vitalsText}>Vitals: {item.vitals}</Text>
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
  doctorBadge: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  doctorBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6D28D9',
  },
  metricsRow: {
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
  rxReviewBanner: {
    backgroundColor: COLORS.primarySurface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  rxReviewLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  rxReviewInfo: {
    flex: 1,
  },
  rxReviewTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primaryDark,
  },
  rxReviewSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  reviewBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  reviewBtnText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
    fontSize: 13,
  },
  sectionHeader: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  queueList: {
    gap: SPACING.sm,
  },
  queueCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    ...SHADOWS.subtle,
  },
  queueCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FAFCFA',
  },
  tokenBox: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  tokenText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primaryDark,
  },
  tokenStatus: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  queueInfo: {
    flex: 1,
  },
  queueNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  patientMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  complaintText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginTop: 2,
    fontWeight: '500',
  },
  vitalsText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
