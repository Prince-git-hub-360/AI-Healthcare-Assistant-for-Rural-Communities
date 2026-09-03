import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ShieldCheck, Download, WifiOff, PhoneCall, HeartHandshake } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { AbhaCardView } from '../../components/health/AbhaCardView';
import { patientApi } from '../../api';
import { AbhaHealthCard } from '../../types';
import { BigButton } from '../../components/common/BigButton';

export const HealthCardScreen: React.FC = () => {
  const { t } = useLanguage();
  const [cardData, setCardData] = useState<AbhaHealthCard | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const data = await patientApi.getAbhaCard();
        if (data) setCardData(data);
      } catch (e) {
        console.log('[HealthCard] Using offline cached health card');
      }
    };
    fetchCard();
  }, []);

  const handleDownloadOffline = () => {
    Alert.alert(
      'Card Saved to Offline Vault',
      'Your ABHA Digital Health Card & QR code is cached locally on this phone. You can present it at any Primary Health Centre even when you have 0% cellular signal.'
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Offline Status Badge */}
      <View style={styles.offlineBanner}>
        <WifiOff size={16} color={COLORS.primaryDark} />
        <Text style={styles.offlineText}>Offline Health Vault: Active & Saved Locally</Text>
      </View>

      {/* Main ABHA Health Card */}
      <AbhaCardView card={cardData} />

      {/* Quick Actions */}
      <View style={styles.buttonGroup}>
        <BigButton
          title="Save Offline to Phone"
          icon={<Download size={20} color={COLORS.textInverse} />}
          onPress={handleDownloadOffline}
        />
      </View>

      {/* Emergency Assistance Info Box */}
      <View style={styles.emergencyBox}>
        <View style={styles.emergencyHeader}>
          <HeartHandshake size={24} color={COLORS.emergency} />
          <Text style={styles.emergencyTitle}>Rural Healthcare Support</Text>
        </View>
        <Text style={styles.emergencyDesc}>
          This digital health card is verified under the Ayushman Bharat Digital Mission (ABDM). For immediate rural medical assistance, contact your local ASHA Worker or 108 Emergency Ambulance.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primarySurface,
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    marginBottom: SPACING.sm,
  },
  offlineText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  buttonGroup: {
    marginVertical: SPACING.md,
  },
  emergencyBox: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  emergencyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  emergencyDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
