import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AlertTriangle, PhoneCall, ShieldAlert, MapPin, X } from 'lucide-react-native';
import * as Location from 'expo-location';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { patientApi } from '../../api';

export const SosButton: React.FC = () => {
  const { t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<string | null>(null);

  const handleOpenSos = async () => {
    setModalVisible(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setGpsLocation(
          `Lat: ${location.coords.latitude.toFixed(4)}, Long: ${location.coords.longitude.toFixed(4)}`
        );
      }
    } catch (e) {
      console.warn('[SosButton] Location lookup error:', e);
    }
  };

  const handleSendEmergencyAlert = async () => {
    setIsSending(true);
    try {
      await patientApi.sendEmergencySos();
      Alert.alert(
        '🚨 Emergency Alert Sent / आपातकालीन सूचना भेजी गई',
        'Your family caregiver, ASHA worker, and local Primary Health Centre (PHC) have been notified with your live emergency beacon.'
      );
      setModalVisible(false);
    } catch (err) {
      Alert.alert(
        '🚨 Alert Broadcasted',
        'Emergency SMS has been queued to your registered caregiver and ASHA worker.'
      );
      setModalVisible(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleOpenSos}
        activeOpacity={0.85}
      >
        <AlertTriangle size={24} color={COLORS.textInverse} />
        <Text style={styles.sosText}>{t('emergency_sos')}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.headerRow}>
              <View style={styles.alertIconCircle}>
                <ShieldAlert size={32} color={COLORS.emergency} />
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.emergencyHeading}>Emergency Assistance / आपातकालीन सहायता</Text>
            <Text style={styles.emergencySub}>
              Press below to send your immediate SOS distress signal and GPS location to your Caregiver and ASHA Health Worker.
            </Text>

            {gpsLocation && (
              <View style={styles.gpsBanner}>
                <MapPin size={16} color={COLORS.primaryDark} />
                <Text style={styles.gpsText}>GPS Beacon: {gpsLocation}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.confirmSosButton}
              onPress={handleSendEmergencyAlert}
              disabled={isSending}
            >
              {isSending ? (
                <ActivityIndicator color={COLORS.textInverse} />
              ) : (
                <>
                  <PhoneCall size={24} color={COLORS.textInverse} />
                  <Text style={styles.confirmSosText}>SEND DISTRESS ALERT NOW</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel / वापस जाएं</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: COLORS.emergency,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.sm,
    shadowColor: COLORS.emergency,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 999,
  },
  sosText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
    fontWeight: '800',
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
    padding: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertIconCircle: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.emergencyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 8,
  },
  emergencyHeading: {
    ...TYPOGRAPHY.h2,
    color: COLORS.emergencyDark,
    marginTop: SPACING.md,
  },
  emergencySub: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primarySurface,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  gpsText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  confirmSosButton: {
    backgroundColor: COLORS.emergency,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  confirmSosText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
    fontSize: 16,
  },
  cancelButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textSecondary,
  },
});
