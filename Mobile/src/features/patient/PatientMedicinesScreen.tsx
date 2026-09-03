import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Calendar,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Pill,
  Check,
  Volume2,
  Utensils,
  Sparkles,
  Camera,
  Bot,
  Plus,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { MOCK_TODAY_MEDICINES, MockMedicine } from '../../mock/healthData';
import { VoiceAssistantService } from '../../services/speechService';
import { SafeStorage } from '../../services/safeStorage';
import { SwasthyaMitrAiModal } from '../../components/ai/SwasthyaMitrAiModal';

const HINDI_DAYS = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
const ENG_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const PatientMedicinesScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState(0);
  const [medicines, setMedicines] = useState<MockMedicine[]>([]);
  const [speakingMedId, setSpeakingMedId] = useState<string | null>(null);
  const [aiModalVisible, setAiModalVisible] = useState<boolean>(false);
  const [courseDurationDays, setCourseDurationDays] = useState<number>(7);

  // Generate dynamic day pills starting from Today
  const generateDynamicDays = (totalDays: number = 7) => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : ENG_DAYS[d.getDay()];
      const hindi = i === 0 ? 'आज' : i === 1 ? 'कल' : HINDI_DAYS[d.getDay()];
      const dateStr = `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]}`;
      list.push({ offset: i, dayName, dateStr, hindi });
    }
    return list;
  };

  const dynamicDays = generateDynamicDays(courseDurationDays);

  // Load active medications from SafeStorage or fallback
  useEffect(() => {
    const loadMeds = async () => {
      try {
        const stored = await SafeStorage.getItem('@swasthya_active_medications');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMedicines(parsed);
            const maxDuration = Math.max(...parsed.map((m: any) => m.duration_days || m.days || 7));
            setCourseDurationDays(Math.max(5, Math.min(maxDuration, 30)));
            return;
          }
        }
      } catch (err) {
        console.warn('[MedicinesScreen] Could not read active medicines from storage:', err);
      }

      // Default active medicines for demo / registered patients
      const defaultMeds: MockMedicine[] = [
        {
          id: 'med_1',
          name: 'Pantoprazole 40mg',
          genericName: 'Pan 40',
          dosage: '1 tablet (1 गोली)',
          timeSlot: 'MORNING',
          scheduledTime: '08:00 AM',
          foodInstruction: 'BEFORE_FOOD',
          foodInstructionHindi: 'सुबह खाली पेट गुनगुने पानी के साथ',
          status: 'PENDING',
          form: 'tablet',
          prescribedBy: 'Dr. Ramesh Sharma',
          duration: '7 Days',
          purpose: 'Gastric acid & heartburn prevention',
          color: '#E0F2FE',
        },
        {
          id: 'med_2',
          name: 'Amoxicillin 500mg',
          genericName: 'Mox 500',
          dosage: '1 capsule (1 कैप्सूल)',
          timeSlot: 'AFTERNOON',
          scheduledTime: '01:30 PM',
          foodInstruction: 'AFTER_FOOD',
          foodInstructionHindi: 'दोपहर भोजन के 20 मिनट बाद',
          status: 'PENDING',
          form: 'capsule',
          prescribedBy: 'Dr. Ramesh Sharma',
          duration: '7 Days',
          purpose: 'Bacterial infection treatment',
          color: '#FEF3C7',
        },
        {
          id: 'med_3',
          name: 'Paracetamol 650mg',
          genericName: 'Dolo 650',
          dosage: '1 tablet (1 गोली)',
          timeSlot: 'NIGHT',
          scheduledTime: '09:00 PM',
          foodInstruction: 'AFTER_FOOD',
          foodInstructionHindi: 'रात भोजन के बाद बुखार या दर्द होने पर',
          status: 'PENDING',
          form: 'tablet',
          prescribedBy: 'Dr. Ramesh Sharma',
          duration: '5 Days',
          purpose: 'Fever & body ache relief',
          color: '#DCFCE7',
        },
      ];
      setMedicines(defaultMeds);
      setCourseDurationDays(7);
    };

    loadMeds();
  }, [user]);

  const handleTakeDose = (id: string) => {
    setMedicines((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, status: 'TAKEN' as const, takenTime: 'Just now' } : m
      );
      SafeStorage.setItem('@swasthya_active_medications', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    Alert.alert('Dose Recorded / खुराक दर्ज की गई! 🎉', 'Great job maintaining your medication adherence!');
  };

  const handleSpeak = (id: string) => {
    const med = medicines.find((m) => m.id === id);
    if (!med) return;

    setSpeakingMedId(id);
    const speechText = med.foodInstructionHindi
      ? `${med.name} ${med.dosage}, ${med.foodInstructionHindi}`
      : `Take ${med.name} ${med.dosage}, ${med.foodInstruction}.`;

    VoiceAssistantService.speak(speechText, currentLanguage, () => {
      setSpeakingMedId(null);
    });
  };

  const morningMeds = medicines.filter((m) => m.timeSlot === 'MORNING');
  const afternoonMeds = medicines.filter((m) => m.timeSlot === 'AFTERNOON');
  const nightMeds = medicines.filter((m) => m.timeSlot === 'NIGHT');

  const takenCount = medicines.filter((m) => m.status === 'TAKEN').length;
  const adherencePercent = medicines.length > 0 ? Math.round((takenCount / medicines.length) * 100) : 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Calendar size={22} color={COLORS.primary} />
            <Text style={styles.screenTitle}>{courseDurationDays}-Day Visual Pillbox</Text>
            <View style={styles.courseBadge}>
              <Text style={styles.courseBadgeText}>{courseDurationDays} Days Course</Text>
            </View>
          </View>
          <Text style={styles.screenSubtitle}>
            दैनिक दवा दिनचर्या • Visual schedule with food instructions & voice assistance
          </Text>
        </View>

        {/* Dynamic Horizontal Day Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daySelectorScroll}
          contentContainerStyle={styles.daySelectorContent}
        >
          {dynamicDays.map((d) => {
            const isSelected = selectedDay === d.offset;
            return (
              <TouchableOpacity
                key={d.offset}
                style={[styles.dayChip, isSelected && styles.dayChipActive]}
                onPress={() => setSelectedDay(d.offset)}
                activeOpacity={0.75}
              >
                <Text style={[styles.dayChipHindi, isSelected && styles.dayChipHindiActive]}>
                  {d.hindi}
                </Text>
                <Text style={[styles.dayChipLabel, isSelected && styles.dayChipLabelActive]}>
                  {d.dayName}
                </Text>
                <Text style={[styles.dayChipDate, isSelected && styles.dayChipDateActive]}>
                  {d.dateStr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Adherence Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Daily Adherence / आज की खुराक</Text>
              <Text style={styles.progressSub}>
                {takenCount} of {medicines.length} medicines taken today
              </Text>
            </View>
            <Text style={styles.progressPercent}>{adherencePercent}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${adherencePercent}%` }]} />
          </View>
        </View>

        {/* Morning Slot */}
        <View style={styles.slotSection}>
          <View style={styles.slotHeader}>
            <View style={styles.slotTitleRow}>
              <Sunrise size={18} color="#D97706" />
              <Text style={styles.slotTitle}>Morning / सुबह (08:00 AM)</Text>
            </View>
            <Text style={styles.slotBadge}>{morningMeds.length} Medicines</Text>
          </View>

          {morningMeds.map((med) => (
            <View key={med.id} style={styles.medCard}>
              <View style={[styles.medIconBox, { backgroundColor: med.color || '#E0F2FE' }]}>
                <Pill size={22} color={COLORS.primary} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medDose}>{med.dosage}</Text>
                <View style={styles.foodTag}>
                  <Utensils size={12} color="#047857" />
                  <Text style={styles.foodTagText}>
                    {currentLanguage === 'hi' ? med.foodInstructionHindi : med.foodInstruction}
                  </Text>
                </View>
              </View>

              <View style={styles.medActionsCol}>
                <TouchableOpacity
                  style={styles.voiceBtn}
                  onPress={() => handleSpeak(med.id)}
                >
                  <Volume2 size={16} color={speakingMedId === med.id ? '#DC2626' : COLORS.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.takeBtn, med.status === 'TAKEN' && styles.takeBtnDone]}
                  onPress={() => handleTakeDose(med.id)}
                  disabled={med.status === 'TAKEN'}
                >
                  {med.status === 'TAKEN' ? (
                    <Check size={16} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.takeBtnText}>Take</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Afternoon Slot */}
        <View style={styles.slotSection}>
          <View style={styles.slotHeader}>
            <View style={styles.slotTitleRow}>
              <Sun size={18} color="#EAB308" />
              <Text style={styles.slotTitle}>Afternoon / दोपहर (01:30 PM)</Text>
            </View>
            <Text style={styles.slotBadge}>{afternoonMeds.length} Medicines</Text>
          </View>

          {afternoonMeds.map((med) => (
            <View key={med.id} style={styles.medCard}>
              <View style={[styles.medIconBox, { backgroundColor: med.color || '#FEF3C7' }]}>
                <Pill size={22} color="#B45309" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medDose}>{med.dosage}</Text>
                <View style={styles.foodTag}>
                  <Utensils size={12} color="#047857" />
                  <Text style={styles.foodTagText}>
                    {currentLanguage === 'hi' ? med.foodInstructionHindi : med.foodInstruction}
                  </Text>
                </View>
              </View>

              <View style={styles.medActionsCol}>
                <TouchableOpacity
                  style={styles.voiceBtn}
                  onPress={() => handleSpeak(med.id)}
                >
                  <Volume2 size={16} color={speakingMedId === med.id ? '#DC2626' : COLORS.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.takeBtn, med.status === 'TAKEN' && styles.takeBtnDone]}
                  onPress={() => handleTakeDose(med.id)}
                  disabled={med.status === 'TAKEN'}
                >
                  {med.status === 'TAKEN' ? (
                    <Check size={16} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.takeBtnText}>Take</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Night Slot */}
        <View style={styles.slotSection}>
          <View style={styles.slotHeader}>
            <View style={styles.slotTitleRow}>
              <Moon size={18} color="#6366F1" />
              <Text style={styles.slotTitle}>Night / रात (09:00 PM)</Text>
            </View>
            <Text style={styles.slotBadge}>{nightMeds.length} Medicines</Text>
          </View>

          {nightMeds.map((med) => (
            <View key={med.id} style={styles.medCard}>
              <View style={[styles.medIconBox, { backgroundColor: med.color || '#DCFCE7' }]}>
                <Pill size={22} color="#047857" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medDose}>{med.dosage}</Text>
                <View style={styles.foodTag}>
                  <Utensils size={12} color="#047857" />
                  <Text style={styles.foodTagText}>
                    {currentLanguage === 'hi' ? med.foodInstructionHindi : med.foodInstruction}
                  </Text>
                </View>
              </View>

              <View style={styles.medActionsCol}>
                <TouchableOpacity
                  style={styles.voiceBtn}
                  onPress={() => handleSpeak(med.id)}
                >
                  <Volume2 size={16} color={speakingMedId === med.id ? '#DC2626' : COLORS.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.takeBtn, med.status === 'TAKEN' && styles.takeBtnDone]}
                  onPress={() => handleTakeDose(med.id)}
                  disabled={med.status === 'TAKEN'}
                >
                  {med.status === 'TAKEN' ? (
                    <Check size={16} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.takeBtnText}>Take</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Scan New Prescription CTA */}
        <TouchableOpacity
          style={styles.scanCta}
          onPress={() => navigation?.navigate && navigation.navigate('Scanner')}
          activeOpacity={0.85}
        >
          <Camera size={20} color="#FFFFFF" />
          <Text style={styles.scanCtaText}>Scan New Doctor’s Slip / नया पर्चा जोड़ें</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating AI Health Assistant Bot Button */}
      <TouchableOpacity
        style={styles.floatingAiBtn}
        onPress={() => setAiModalVisible(true)}
        activeOpacity={0.85}
      >
        <Sparkles size={18} color="#FFFFFF" />
        <Text style={styles.floatingAiBtnText}>AI Health Assistant</Text>
      </TouchableOpacity>

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
    paddingBottom: 90,
  },
  header: {
    marginBottom: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  screenTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  courseBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  courseBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  screenSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  daySelectorScroll: {
    marginBottom: SPACING.md,
  },
  daySelectorContent: {
    gap: 8,
  },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    minWidth: 64,
  },
  dayChipActive: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  dayChipHindi: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  dayChipHindiActive: {
    color: '#FFFFFF',
  },
  dayChipLabel: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 1,
  },
  dayChipLabelActive: {
    color: '#E0F2FE',
  },
  dayChipDate: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  dayChipDateActive: {
    color: '#FFFFFF',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.subtle,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  progressSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '900',
    color: '#047857',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#047857',
    borderRadius: 3,
  },
  slotSection: {
    marginBottom: SPACING.md,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  slotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slotTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  slotBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...SHADOWS.subtle,
  },
  medIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  medDose: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  foodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  foodTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  medActionsCol: {
    alignItems: 'center',
    gap: 6,
  },
  voiceBtn: {
    padding: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  takeBtn: {
    backgroundColor: '#047857',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takeBtnDone: {
    backgroundColor: '#10B981',
  },
  takeBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scanCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: SPACING.sm,
    ...SHADOWS.subtle,
  },
  scanCtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  floatingAiBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#047857',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  floatingAiBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
