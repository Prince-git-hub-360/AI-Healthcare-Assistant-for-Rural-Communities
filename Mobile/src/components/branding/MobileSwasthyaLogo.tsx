import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';

interface SwasthyaLogoProps {
  variant?: 'full' | 'mark' | 'dark';
  height?: number;
  showTagline?: boolean;
  onPress?: () => void;
}

export const MobileSwasthyaLogo: React.FC<SwasthyaLogoProps> = ({
  variant = 'full',
  height = 42,
  showTagline = false,
  onPress,
}) => {
  const isDark = variant === 'dark';
  const isMarkOnly = variant === 'mark';

  const markImg = isDark
    ? require('../../../assets/branding/swasthya-sanchar-mark-white.png')
    : require('../../../assets/branding/swasthya-sanchar-mark.png');

  if (isMarkOnly) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.8}
        style={styles.markContainer}
      >
        <Image
          source={markImg}
          style={{ height: height, width: height }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Image
        source={markImg}
        style={{ height: height, width: height }}
        resizeMode="contain"
      />

      <View style={styles.textColumn}>
        <View style={styles.titleRow}>
          <Text style={[styles.brandFirst, isDark && styles.textWhite]}>Swasthya</Text>
          <Text style={[styles.brandSecond, isDark && styles.textTealLight]}>Sanchar</Text>
          <View style={[styles.aiBadge, isDark && styles.aiBadgeDark]}>
            <Text style={[styles.aiBadgeText, isDark && styles.aiBadgeTextDark]}>AI</Text>
          </View>
        </View>

        {showTagline && (
          <Text style={[styles.tagline, isDark && styles.taglineDark]}>
            Healthcare that speaks your language
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandFirst: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  brandSecond: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0D9488', // Healthcare Teal
    letterSpacing: -0.3,
  },
  aiBadge: {
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  aiBadgeDark: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    borderColor: 'rgba(20, 184, 166, 0.4)',
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0F766E',
  },
  aiBadgeTextDark: {
    fontSize: 9,
    fontWeight: '900',
    color: '#5EEAD4',
  },
  tagline: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
  },
  taglineDark: {
    color: '#94A3B8',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textTealLight: {
    color: '#5EEAD4',
  },
});
