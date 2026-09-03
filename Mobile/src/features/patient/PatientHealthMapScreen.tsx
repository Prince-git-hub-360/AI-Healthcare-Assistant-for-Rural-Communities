import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {
  Activity,
  Heart,
  Brain,
  Wind,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Volume2,
  CheckCircle2,
  X,
  MessageSquare,
  FileText,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_ORGANS, OrganDetail } from '../../mock/healthData';
import { VoiceAssistantService } from '../../services/speechService';

export const PatientHealthMapScreen: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const [selectedView, setSelectedView] = useState<'FRONT' | 'SIDE' | 'BACK'>('FRONT');
  const [selectedOrganKey, setSelectedOrganKey] = useState<string>('heart');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isSpeakingAdvice, setIsSpeakingAdvice] = useState<boolean>(false);

  const organKeys = Object.keys(MOCK_ORGANS);
  const currentOrgan: OrganDetail = MOCK_ORGANS[selectedOrganKey] || MOCK_ORGANS.heart;

  const handleSelectOrgan = (key: string) => {
    setSelectedOrganKey(key);
  };

  const handleOpenOrganDetails = (key: string) => {
    setSelectedOrganKey(key);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.header}>
          <View>
            <Text style={styles.screenTitle}>My Health Map</Text>
            <Text style={styles.screenSubtitle}>
              Interactive 3D anatomical explorer & organ education
            </Text>
          </View>
        </View>

        {/* View Switcher: Front | Side | Back */}
        <View style={styles.viewToggleContainer}>
          <TouchableOpacity
            style={[styles.viewTab, selectedView === 'FRONT' && styles.viewTabActive]}
            onPress={() => setSelectedView('FRONT')}
          >
            <Text style={[styles.viewTabText, selectedView === 'FRONT' && styles.viewTabTextActive]}>
              Front View
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.viewTab, selectedView === 'SIDE' && styles.viewTabActive]}
            onPress={() => setSelectedView('SIDE')}
          >
            <Text style={[styles.viewTabText, selectedView === 'SIDE' && styles.viewTabTextActive]}>
              Side View
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.viewTab, selectedView === 'BACK' && styles.viewTabActive]}
            onPress={() => setSelectedView('BACK')}
          >
            <Text style={[styles.viewTabText, selectedView === 'BACK' && styles.viewTabTextActive]}>
              Back View
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3D Anatomical Stage */}
        <View style={styles.anatomyStage}>
          {/* Main Anatomy Silhouette / Visual Asset */}
          <Image
            source={require('../../../assets/anatomy/clinical_human_anatomy.jpg')}
            style={styles.anatomyImage}
            resizeMode="contain"
          />

          {/* Interactive Anatomical Hotspots */}
          <TouchableOpacity
            style={[styles.hotspot, styles.hotspotBrain, selectedOrganKey === 'brain' && styles.hotspotActive]}
            onPress={() => handleOpenOrganDetails('brain')}
          >
            <Text style={styles.hotspotEmoji}>🧠</Text>
            <Text style={styles.hotspotLabel}>Brain</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.hotspot, styles.hotspotLungs, selectedOrganKey === 'lungs' && styles.hotspotActive]}
            onPress={() => handleOpenOrganDetails('lungs')}
          >
            <Text style={styles.hotspotEmoji}>🫁</Text>
            <Text style={styles.hotspotLabel}>Lungs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.hotspot, styles.hotspotHeart, selectedOrganKey === 'heart' && styles.hotspotActive]}
            onPress={() => handleOpenOrganDetails('heart')}
          >
            <Text style={styles.hotspotEmoji}>❤️</Text>
            <Text style={styles.hotspotLabel}>Heart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.hotspot, styles.hotspotStomach, selectedOrganKey === 'stomach' && styles.hotspotActive]}
            onPress={() => handleOpenOrganDetails('stomach')}
          >
            <Text style={styles.hotspotEmoji}>🫄</Text>
            <Text style={styles.hotspotLabel}>Stomach</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.hotspot, styles.hotspotKidneys, selectedOrganKey === 'kidneys' && styles.hotspotActive]}
            onPress={() => handleOpenOrganDetails('kidneys')}
          >
            <Text style={styles.hotspotEmoji}>🫘</Text>
            <Text style={styles.hotspotLabel}>Kidneys</Text>
          </TouchableOpacity>
        </View>

        {/* Organ Selector Carousel */}
        <Text style={styles.sectionHeading}>Select Body Area</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.organScroll}
        >
          {organKeys.map((key) => {
            const organ = MOCK_ORGANS[key];
            const isSelected = selectedOrganKey === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.organCard, isSelected && styles.organCardSelected]}
                onPress={() => handleSelectOrgan(key)}
                activeOpacity={0.8}
              >
                <Text style={styles.organCardEmoji}>{organ.icon}</Text>
                <Text style={[styles.organCardName, isSelected && styles.organCardNameSelected]}>
                  {organ.name.split('&')[0]}
                </Text>
                <Text style={styles.organCardHindi}>{organ.hindiName.split(' ')[0]}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Organ Interactive Card */}
        <View style={styles.activeOrganSummaryCard}>
          <View style={styles.organHeaderRow}>
            <Image source={currentOrgan.image} style={styles.organThumbnail} />
            <View style={styles.organHeaderInfo}>
              <Text style={styles.organMainTitle}>{currentOrgan.name}</Text>
              <Text style={styles.organHindiTitle}>{currentOrgan.hindiName}</Text>
              <View style={styles.statusPill}>
                <CheckCircle2 size={12} color={COLORS.success} />
                <Text style={styles.statusPillText}>Status: Normal & Stable</Text>
              </View>
            </View>
          </View>

          {/* Vitals Grid */}
          <View style={styles.vitalsRow}>
            {currentOrgan.vitals.map((v, i) => (
              <View key={i} style={styles.vitalBox}>
                <Text style={styles.vitalValue}>{v.value}</Text>
                <Text style={styles.vitalLabel}>{v.label}</Text>
              </View>
            ))}
          </View>

          {/* Active Prescriptions for this Organ */}
          <View style={styles.prescriptionsBlock}>
            <Text style={styles.blockTitle}>Active Prescriptions for this Area</Text>
            {currentOrgan.activeMedications.map((m, idx) => (
              <View key={idx} style={styles.medTag}>
                <FileText size={12} color={COLORS.primary} />
                <Text style={styles.medTagText}>{m}</Text>
              </View>
            ))}
          </View>

          {/* Health Education & Advice */}
          <View style={styles.educationBox}>
            <View style={styles.educationHeader}>
              <Info size={14} color={COLORS.primaryDark} />
              <Text style={styles.educationTitle}>Health Education / स्वास्थ्य सलाह</Text>
              <TouchableOpacity
                style={styles.speakerIconBtn}
                onPress={() => {
                  const tip = currentLanguage === 'hi' ? currentOrgan.educationalTipHindi : currentOrgan.educationalTip;
                  VoiceAssistantService.speak(`${currentOrgan.hindiName || currentOrgan.name}: ${tip}`, currentLanguage);
                }}
              >
                <Volume2 size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.educationBody}>
              {currentLanguage === 'hi'
                ? currentOrgan.educationalTipHindi
                : currentOrgan.educationalTip}
            </Text>
          </View>

          {/* Ask Swasthya AI Button */}
          <TouchableOpacity
            style={styles.askAiButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.85}
          >
            <Sparkles size={16} color={COLORS.textInverse} />
            <Text style={styles.askAiButtonText}>Ask Swasthya AI about {currentOrgan.name.split('&')[0]}</Text>
          </TouchableOpacity>

          {/* Educational Disclaimer */}
          <Text style={styles.disclaimerText}>
            ℹ️ Educational reference guide only. Does not replace professional medical diagnosis. Consult Dr. Ramesh Sharma at PHC for medical concerns.
          </Text>
        </View>
      </ScrollView>

      {/* Interactive AI Assistant & Deep Dive Sheet */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalTitleBlock}>
                <Text style={styles.modalOrganTitle}>{currentOrgan.name}</Text>
                <Text style={styles.modalOrganSub}>Swasthya AI Health Education</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Image source={currentOrgan.image} style={styles.modalOrganBanner} resizeMode="cover" />

              <Text style={styles.faqHeading}>Frequently Asked Rural Health Questions:</Text>
              {currentOrgan.aiSuggestedQuestions.map((q, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.faqCard}
                  onPress={() => {
                    Alert.alert(
                      q,
                      `Swasthya AI Explanation: ${currentOrgan.educationalTip}\n\n(Always take medicines at prescribed hours with proper meals.)`
                    );
                  }}
                  activeOpacity={0.7}
                >
                  <MessageSquare size={16} color={COLORS.primary} />
                  <Text style={styles.faqText}>{q}</Text>
                  <ChevronRight size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              ))}

              <View style={styles.aiGuidanceCard}>
                <Sparkles size={18} color={COLORS.secondary} />
                <Text style={styles.aiGuidanceText}>
                  "Your vitals for this organ system are well maintained under current prescription routine. Continue daily morning walking and drink adequate water."
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginBottom: SPACING.md,
  },
  screenTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
  },
  screenSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  viewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: BORDER_RADIUS.full,
    padding: 3,
    marginBottom: SPACING.md,
  },
  viewTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
  },
  viewTabActive: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.subtle,
  },
  viewTabText: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
  },
  viewTabTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  anatomyStage: {
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.subtle,
  },
  anatomyImage: {
    width: '90%',
    height: '90%',
  },
  hotspot: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    gap: 4,
    ...SHADOWS.subtle,
  },
  hotspotActive: {
    backgroundColor: COLORS.primarySurface,
    borderColor: COLORS.primaryDark,
    transform: [{ scale: 1.08 }],
  },
  hotspotEmoji: {
    fontSize: 12,
  },
  hotspotLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  hotspotBrain: {
    top: 15,
    left: '38%',
  },
  hotspotLungs: {
    top: 65,
    left: '20%',
  },
  hotspotHeart: {
    top: 75,
    right: '20%',
  },
  hotspotStomach: {
    top: 120,
    left: '32%',
  },
  hotspotKidneys: {
    top: 145,
    right: '25%',
  },
  sectionHeading: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  organScroll: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  organCard: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    minWidth: 92,
    ...SHADOWS.subtle,
  },
  organCardSelected: {
    backgroundColor: COLORS.primarySurface,
    borderColor: COLORS.primary,
  },
  organCardEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  organCardName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  organCardNameSelected: {
    color: COLORS.primaryDark,
  },
  organCardHindi: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  activeOrganSummaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  organHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  organThumbnail: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceSubtle,
  },
  organHeaderInfo: {
    flex: 1,
  },
  organMainTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  organHindiTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
  },
  vitalsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  vitalBox: {
    flex: 1,
    alignItems: 'center',
  },
  vitalValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  vitalLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 1,
    textAlign: 'center',
  },
  prescriptionsBlock: {
    marginBottom: SPACING.md,
  },
  blockTitle: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  medTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
    marginVertical: 2,
  },
  medTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  educationBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  educationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  educationTitle: {
    ...TYPOGRAPHY.captionSmall,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  speakerIconBtn: {
    marginLeft: 'auto',
    padding: 4,
  },
  educationBody: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  askAiButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  askAiButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
    fontSize: 13,
  },
  disclaimerText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    lineHeight: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '85%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitleBlock: {
    flex: 1,
  },
  modalOrganTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  modalOrganSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalScroll: {
    marginBottom: SPACING.lg,
  },
  modalOrganBanner: {
    width: '100%',
    height: 160,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  faqHeading: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  faqCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    marginVertical: 4,
  },
  faqText: {
    flex: 1,
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  aiGuidanceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.secondaryLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.md,
  },
  aiGuidanceText: {
    flex: 1,
    ...TYPOGRAPHY.caption,
    color: COLORS.secondaryDark,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
