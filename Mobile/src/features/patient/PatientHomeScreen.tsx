import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import {
  HeartPulse,
  Flame,
  Check,
  Camera,
  Activity,
  FolderHeart,
  Volume2,
  AlertTriangle,
  ChevronRight,
  Sun,
  Sunrise,
  Moon,
  Clock,
  Pill,
  Sparkles,
  PhoneCall,
  X,
  MapPin,
  ShieldAlert,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { MOCK_PATIENT, MOCK_TODAY_MEDICINES, MockMedicine } from '../../mock/healthData';
import { Header } from '../../components/common/Header';
import { VoiceAssistantService } from '../../services/speechService';
import { MobileEmergencySosModal } from '../../components/emergency/MobileEmergencySosModal';
import { SwasthyaMitrAiModal } from '../../components/ai/SwasthyaMitrAiModal';
import { SafeStorage } from '../../services/safeStorage';

export const PatientHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const { user } = useAuth();

  const [medicines, setMedicines] = useState<MockMedicine[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  useEffect(() => {
    const loadActiveMeds = async () => {
      try {
        const stored = await SafeStorage.getItem('@swasthya_active_medications');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMedicines(parsed);
            return;
          }
        }
      } catch (e) {}

      // Default active medicines for patient
      setMedicines(MOCK_TODAY_MEDICINES);
    };

    loadActiveMeds();
  }, [user]);

  const completedCount = medicines.filter((m) => m.status === 'TAKEN').length;
  const totalCount = medicines.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Find next pending medicine
  const nextMedicine = medicines.find((m) => m.status === 'PENDING') || medicines[0];

  const handleMarkTaken = (medId: string) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medId ? { ...m, status: 'TAKEN', takenTime: 'Just now' } : m
      )
    );
  };

  const handleToggleVoicePlayback = () => {
    if (isPlayingAudio) {
      VoiceAssistantService.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const text = `नमस्ते लक्ष्मी जी। आपकी अगली दवा ${nextMedicine.name} ${nextMedicine.dosage} है, जिसे आपको ${nextMedicine.foodInstructionHindi || 'नाश्ते के बाद लेना है'}।`;
      VoiceAssistantService.speak(text, currentLanguage, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const getGreetingText = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning / शुभ प्रभात';
    if (hour >= 12 && hour < 17) return 'Good afternoon / शुभ दोपहर';
    if (hour >= 17 && hour < 21) return 'Good evening / शुभ संध्या';
    return 'Good night / शुभ रात्रि';
  };

  const displayName = user?.first_name || (user?.username && !/^\d+$/.test(user.username) ? user.username : 'Prince Kumar');

  return (
    <View style={styles.container}>
      <Header roleBadge="Patient" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Dynamic Greeting Header */}
        <View style={styles.header}>
          <View style={styles.greetingBlock}>
            <Text style={styles.greetingTitle}>{getGreetingText()}, {displayName} 👋</Text>
            <Text style={styles.greetingSubtitle}>Welcome to your Swasthya AI Health Portal</Text>
          </View>
        </View>

        {/* Daily Medication Progress Card */}
        {medicines.length > 0 ? (
          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <View>
                <Text style={styles.progressHeading}>Today's Medication</Text>
                <Text style={styles.progressStats}>
                  {completedCount} of {totalCount} doses completed ({progressPercent}%)
                </Text>
              </View>
              <View style={styles.streakBadge}>
                <Flame size={14} color="#EA580C" />
                <Text style={styles.streakText}>Active</Text>
              </View>
            </View>

            {/* Clean Segmented Progress Bar */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        ) : null}

        {/* NEXT MEDICINE — Hero Action Card or Empty State */}
        {medicines.length > 0 && nextMedicine && nextMedicine.status === 'PENDING' ? (
          <View style={styles.heroMedicineCard}>
            <View style={styles.heroTopBadge}>
              <Clock size={12} color={COLORS.primary} />
              <Text style={styles.heroBadgeText}>NEXT MEDICINE • {nextMedicine.scheduledTime}</Text>
            </View>

            <View style={styles.heroMainRow}>
              <View style={styles.heroPillIcon}>
                <Pill size={28} color={COLORS.primary} />
              </View>
              <View style={styles.heroMedInfo}>
                <Text style={styles.heroMedName}>{nextMedicine.name}</Text>
                <Text style={styles.heroMedDosage}>
                  {nextMedicine.dosage} • {nextMedicine.foodInstructionHindi || nextMedicine.foodInstruction.replace('_', ' ')}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.heroTakeButton}
              onPress={() => handleMarkTaken(nextMedicine.id)}
              activeOpacity={0.85}
            >
              <Check size={18} color={COLORS.textInverse} />
              <Text style={styles.heroTakeButtonText}>✓ Mark as Taken</Text>
            </TouchableOpacity>
          </View>
        ) : medicines.length === 0 ? (
          <View style={styles.emptyMedsCard}>
            <View style={styles.emptyMedsIconCircle}>
              <Sparkles size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyMedsTitle}>No Active Medications / कोई दवा निर्धारित नहीं है</Text>
            <Text style={styles.emptyMedsSub}>
              You have not uploaded any prescription yet. Scan your doctor's slip to automatically extract medicines and generate audio guidance!
            </Text>
            <TouchableOpacity
              style={styles.emptyScanBtn}
              onPress={() => navigation.navigate('Scanner')}
              activeOpacity={0.85}
            >
              <Camera size={18} color="#FFFFFF" />
              <Text style={styles.emptyScanBtnText}>Scan Prescription / पर्चा स्कैन करें</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.allDoneCard}>
            <View style={styles.allDoneIcon}>
              <Check size={20} color={COLORS.success} />
            </View>
            <Text style={styles.allDoneText}>All doses taken for today! Excellent job.</Text>
          </View>
        )}

        {/* Quick Action Navigation Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {/* Scan Rx */}
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#F0FDF4' }]}
            onPress={() => navigation.navigate('Scanner')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: COLORS.primarySurface }]}>
              <Camera size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.quickCardTitle}>Scan Prescription</Text>
            <Text style={styles.quickCardSub}>AI camera scanner</Text>
          </TouchableOpacity>

          {/* Health Map */}
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#F0FDFA' }]}
            onPress={() => navigation.navigate('Health')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: COLORS.secondaryLight }]}>
              <Activity size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.quickCardTitle}>My Health Map</Text>
            <Text style={styles.quickCardSub}>3D Body & Organ Guide</Text>
          </TouchableOpacity>

          {/* Health Records */}
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#EFF6FF' }]}
            onPress={() => navigation.navigate('Records')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <FolderHeart size={20} color="#2563EB" />
            </View>
            <Text style={styles.quickCardTitle}>Health Records</Text>
            <Text style={styles.quickCardSub}>Prescriptions & Labs</Text>
          </TouchableOpacity>

          {/* Voice Assistant */}
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#FFFBEB' }, isPlayingAudio && { borderColor: COLORS.accent, borderWidth: 1.5 }]}
            onPress={handleToggleVoicePlayback}
            activeOpacity={0.8}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: COLORS.accentLight }]}>
              <Volume2 size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.quickCardTitle}>
              {isPlayingAudio ? 'Speaking...' : 'Listen in Hindi'}
            </Text>
            <Text style={styles.quickCardSub}>
              {isPlayingAudio ? 'बोल रहे हैं...' : 'आवाज में सुनें'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's Medicines Timeline */}
        <View style={styles.timelineHeaderRow}>
          <Text style={styles.sectionTitle}>Today's Medicines</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Medicines')}>
            <Text style={styles.viewAllText}>Full Schedule →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.medicineList}>
          {medicines.map((med) => {
            const isTaken = med.status === 'TAKEN';
            return (
              <View key={med.id} style={[styles.medRowCard, isTaken && styles.medRowCardTaken]}>
                <TouchableOpacity
                  style={[styles.checkCircleBtn, isTaken && styles.checkCircleBtnTaken]}
                  onPress={() => handleMarkTaken(med.id)}
                  activeOpacity={0.7}
                >
                  {isTaken && <Check size={14} color={COLORS.textInverse} />}
                </TouchableOpacity>

                <View style={styles.medRowDetails}>
                  <View style={styles.medRowTitleRow}>
                    <Text style={[styles.medRowName, isTaken && styles.medRowNameTaken]}>
                      {med.name}
                    </Text>
                    <Text style={styles.medRowTime}>{med.scheduledTime}</Text>
                  </View>
                  <Text style={styles.medRowMeta}>
                    {med.dosage} • {med.foodInstructionHindi || med.foodInstruction.replace('_', ' ')}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Space for floating SOS */}
        <View style={{ height: 70 }} />
      </ScrollView>

      {/* Floating Action Buttons Row */}
      <View style={styles.floatingBtnsRow}>
        <TouchableOpacity
          style={styles.floatingSos}
          onPress={() => setSosModalVisible(true)}
          activeOpacity={0.85}
        >
          <AlertTriangle size={16} color={COLORS.textInverse} />
          <Text style={styles.floatingSosText}>SOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.floatingAi}
          onPress={() => setAiModalVisible(true)}
          activeOpacity={0.85}
        >
          <Sparkles size={16} color="#FFFFFF" />
          <Text style={styles.floatingAiText}>AI Assistant</Text>
        </TouchableOpacity>
      </View>

      {/* Complete Web-Matched Emergency SOS & Facilities Modal */}
      <MobileEmergencySosModal
        visible={sosModalVisible}
        onClose={() => setSosModalVisible(false)}
      />

      {/* Swasthya Mitr AI Companion Modal */}
      <SwasthyaMitrAiModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
      />
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  greetingBlock: {
    flex: 1,
  },
  greetingTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
  },
  greetingSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  langPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  progressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressHeading: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressStats: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  streakText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9A3412',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  emptyMedsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.subtle,
  },
  emptyMedsIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emptyMedsTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyMedsSub: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  emptyScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.elevated,
  },
  emptyScanBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  heroMedicineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.card,
  },
  heroTopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.xs,
    marginBottom: SPACING.sm,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  heroMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  heroPillIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMedInfo: {
    flex: 1,
  },
  heroMedName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  heroMedDosage: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  heroTakeButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    gap: 6,
    ...SHADOWS.subtle,
  },
  heroTakeButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
  },
  allDoneCard: {
    backgroundColor: COLORS.successLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  allDoneIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allDoneText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.success,
    flex: 1,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  quickCard: {
    width: '48%',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  quickIconCircle: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickCardTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  quickCardSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  viewAllText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.primary,
  },
  medicineList: {
    gap: SPACING.xs,
  },
  medRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    ...SHADOWS.subtle,
  },
  medRowCardTaken: {
    backgroundColor: '#FAFAFA',
    opacity: 0.8,
  },
  checkCircleBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleBtnTaken: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  medRowDetails: {
    flex: 1,
  },
  medRowTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medRowName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  medRowNameTaken: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  medRowTime: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
  },
  medRowMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  floatingBtnsRow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 999,
  },
  floatingSos: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.full,
    gap: 4,
    ...SHADOWS.sos,
  },
  floatingSosText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textInverse,
    letterSpacing: 0.3,
  },
  floatingAi: {
    backgroundColor: '#047857',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.full,
    gap: 6,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  floatingAiText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheetFull: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxxl,
    height: '82%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sosAlertCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: BORDER_RADIUS.full,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: '#991B1B',
    fontSize: 16,
  },
  modalSubSmall: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  mapContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  mapLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  mapLiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  mapCoordsText: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  mapCanvas: {
    height: 140,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  mapGridLineH1: {
    position: 'absolute',
    top: '33%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  mapGridLineH2: {
    position: 'absolute',
    top: '66%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  mapGridLineV1: {
    position: 'absolute',
    left: '33%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#CBD5E1',
  },
  mapGridLineV2: {
    position: 'absolute',
    left: '66%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#CBD5E1',
  },
  mapRouteLine: {
    position: 'absolute',
    top: 35,
    left: 45,
    width: 130,
    height: 60,
    borderStyle: 'dashed',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#3B82F6',
  },
  userPin: {
    position: 'absolute',
    bottom: 20,
    left: '42%',
    alignItems: 'center',
  },
  userPinRing: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    top: -4,
  },
  pinLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#991B1B',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginTop: 2,
  },
  ambulancePin: {
    position: 'absolute',
    top: 15,
    left: 20,
    alignItems: 'center',
  },
  ambulanceEmoji: {
    fontSize: 22,
  },
  ambulanceTag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ambulanceTagText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  hospitalPin: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'center',
  },
  hospitalEmoji: {
    fontSize: 20,
  },
  hospitalTag: {
    backgroundColor: '#047857',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hospitalTagText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mapFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  mapAddressText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  mapEtaText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  sosSectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dialerGrid: {
    gap: 6,
    marginBottom: SPACING.md,
  },
  dialerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 10,
  },
  dialerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialerNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  dialerLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  sendDistressBtn: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    ...SHADOWS.elevated,
  },
  sendDistressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  cancelBtn: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
});

