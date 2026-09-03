import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Volume2, VolumeX, Radio } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { audioService } from '../../services/AudioService';

interface VoiceSpeakerButtonProps {
  textToSpeak: string;
  label?: string;
  compact?: boolean;
}

export const VoiceSpeakerButton: React.FC<VoiceSpeakerButtonProps> = ({
  textToSpeak,
  label,
  compact = false,
}) => {
  const { currentLanguage, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      await audioService.stop();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setIsPlaying(true);
      await audioService.playVoiceGuidance(textToSpeak, currentLanguage, () => {
        setIsPlaying(false);
        setIsLoading(false);
      });
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactButton, isPlaying && styles.compactButtonActive]}
        onPress={handleTogglePlay}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.secondary} />
        ) : isPlaying ? (
          <Radio size={18} color={COLORS.secondary} />
        ) : (
          <Volume2 size={18} color={COLORS.primaryDark} />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.fullButton, isPlaying && styles.fullButtonActive]}
      onPress={handleTogglePlay}
      activeOpacity={0.8}
    >
      <View style={styles.iconCircle}>
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.surface} />
        ) : isPlaying ? (
          <VolumeX size={20} color={COLORS.surface} />
        ) : (
          <Volume2 size={20} color={COLORS.surface} />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>
          {isPlaying ? 'Speaking now... / बोल रहे हैं' : label || t('listen_voice')}
        </Text>
        <Text style={styles.subText}>
          {isPlaying ? 'Tap to pause' : 'Tap to hear instruction aloud'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryLight,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
    marginVertical: SPACING.xs,
  },
  fullButtonActive: {
    backgroundColor: '#FEF08A',
    borderColor: COLORS.secondaryDark,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.secondaryDark,
  },
  subText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  compactButton: {
    padding: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primarySurface,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  compactButtonActive: {
    backgroundColor: COLORS.secondaryLight,
    borderColor: COLORS.secondary,
  },
});
