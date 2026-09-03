import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pill, Sun, Sunrise, Sunset, Moon, Check, Utensils } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { ReminderDose } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { VoiceSpeakerButton } from '../voice/VoiceSpeakerButton';

interface PillCardProps {
  dose: ReminderDose;
  onTakeDose: (id: number) => void;
}

export const PillCard: React.FC<PillCardProps> = ({ dose, onTakeDose }) => {
  const { t } = useLanguage();

  const getTimeBadge = () => {
    switch (dose.time_of_day) {
      case 'MORNING':
        return {
          label: t('morning'),
          icon: <Sunrise size={16} color={COLORS.morning} />,
          bg: COLORS.morningBg,
          color: COLORS.morning,
        };
      case 'AFTERNOON':
        return {
          label: t('afternoon'),
          icon: <Sun size={16} color={COLORS.afternoon} />,
          bg: COLORS.afternoonBg,
          color: COLORS.afternoon,
        };
      case 'EVENING':
        return {
          label: t('evening'),
          icon: <Sunset size={16} color={COLORS.evening} />,
          bg: COLORS.eveningBg,
          color: COLORS.evening,
        };
      case 'NIGHT':
      default:
        return {
          label: t('night'),
          icon: <Moon size={16} color={COLORS.night} />,
          bg: COLORS.nightBg,
          color: COLORS.night,
        };
    }
  };

  const badge = getTimeBadge();
  const isTaken = dose.status === 'TAKEN';
  const spokenText = `${dose.medication_name}, ${dose.dosage}, ${badge.label}, ${dose.food_instruction || 'After food'}`;

  return (
    <View style={[styles.card, isTaken && styles.cardTaken]}>
      <View style={styles.topRow}>
        <View style={[styles.timeBadge, { backgroundColor: badge.bg }]}>
          {badge.icon}
          <Text style={[styles.timeText, { color: badge.color }]}>{badge.label}</Text>
        </View>

        <View style={styles.topActions}>
          <VoiceSpeakerButton textToSpeak={spokenText} compact />
          {isTaken && (
            <View style={styles.takenBadge}>
              <Check size={14} color={COLORS.success} />
              <Text style={styles.takenBadgeText}>{t('dose_taken')}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.medRow}>
        <View style={styles.pillIconCircle}>
          <Pill size={24} color={isTaken ? COLORS.textMuted : COLORS.primary} />
        </View>
        <View style={styles.medDetails}>
          <Text style={[styles.medName, isTaken && styles.textStrikethrough]}>
            {dose.medication_name}
          </Text>
          <Text style={styles.dosageText}>Dosage: {dose.dosage}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.foodTag}>
          <Utensils size={14} color={COLORS.textSecondary} />
          <Text style={styles.foodText}>{dose.food_instruction || t('after_food')}</Text>
        </View>

        {!isTaken && (
          <TouchableOpacity
            style={styles.takeButton}
            onPress={() => onTakeDose(dose.id)}
            activeOpacity={0.8}
          >
            <Check size={18} color={COLORS.textInverse} />
            <Text style={styles.takeButtonText}>{t('mark_taken')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginVertical: SPACING.xs,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTaken: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  timeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  takenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  takenBadgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontWeight: '700',
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginVertical: SPACING.sm,
  },
  pillIconCircle: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medDetails: {
    flex: 1,
  },
  medName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  textStrikethrough: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  dosageText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  foodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  foodText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  takeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    gap: 4,
  },
  takeButtonText: {
    ...TYPOGRAPHY.button,
    fontSize: 13,
    color: COLORS.textInverse,
  },
});
