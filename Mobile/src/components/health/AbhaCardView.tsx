import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck, Heart, Phone, MapPin, QrCode } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { AbhaHealthCard } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface AbhaCardViewProps {
  card?: AbhaHealthCard | null;
}

export const AbhaCardView: React.FC<AbhaCardViewProps> = ({ card }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const displayName = user?.first_name || (user?.username && !/^\d+$/.test(user.username) ? user.username : 'Prince Kumar');
  const displayPhone = user?.phone_number || (user?.username && /^\d+$/.test(user.username) ? user.username : '9008802105');
  const displayVillage = user?.village_or_town || 'Rampur Gram, Ward 3';
  const displayDistrict = user?.district || 'Varanasi District';
  const displayState = user?.state || 'Uttar Pradesh';
  const displayGender = user?.gender ? (user.gender.toLowerCase() === 'female' ? 'Female / महिला' : 'Male / पुरुष') : 'Male / पुरुष';
  const displayDob = user?.date_of_birth || (user?.age ? `Age ${user.age} yrs` : '15-08-1996');

  const data: AbhaHealthCard = card || {
    abha_id: user?.abha_id || '91-4820-9921-7740',
    abha_number: 'ABHA-RURAL-IND-4089',
    full_name: displayName,
    gender: displayGender,
    date_of_birth: displayDob,
    blood_group: 'B +ve',
    emergency_contact: `+91 ${displayPhone}`,
    address_line: `${displayVillage}`,
    village_district: `${displayDistrict}`,
    state: `${displayState}`,
    qr_code_data: `ABHA://${displayName.replace(/\s+/g, '-').toUpperCase()}/${user?.abha_id || '91-4820-9921-7740'}`,
  };

  return (
    <View style={styles.cardContainer}>
      {/* Top National Health Bar */}
      <View style={styles.topHeader}>
        <View style={styles.flagStrip}>
          <View style={[styles.flagBar, { backgroundColor: '#FF9933' }]} />
          <View style={[styles.flagBar, { backgroundColor: '#FFFFFF' }]} />
          <View style={[styles.flagBar, { backgroundColor: '#138808' }]} />
        </View>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.nhaTitle}>NATIONAL HEALTH AUTHORITY</Text>
          <Text style={styles.subTitle}>Ayushman Bharat Digital Mission (ABDM)</Text>
        </View>
        <ShieldCheck size={26} color={COLORS.primaryDark} />
      </View>

      {/* Main Details Body */}
      <View style={styles.body}>
        <View style={styles.leftDetails}>
          <Text style={styles.patientName}>{data.full_name}</Text>
          <Text style={styles.abhaIdText}>ABHA ID: {data.abha_id}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>DOB: </Text>
            <Text style={styles.metaValue}>{data.date_of_birth}</Text>
            <Text style={styles.metaLabel}> | Gender: </Text>
            <Text style={styles.metaValue}>{data.gender}</Text>
          </View>

          {data.blood_group && (
            <View style={styles.metaRow}>
              <Heart size={14} color={COLORS.emergency} />
              <Text style={styles.bloodGroupText}> Blood Group: {data.blood_group}</Text>
            </View>
          )}

          <View style={styles.metaRow}>
            <Phone size={14} color={COLORS.textSecondary} />
            <Text style={styles.contactText}> {data.emergency_contact}</Text>
          </View>

          <View style={styles.metaRow}>
            <MapPin size={14} color={COLORS.textSecondary} />
            <Text style={styles.addressText}> {data.village_district}, {data.state}</Text>
          </View>
        </View>

        {/* QR Code Container */}
        <View style={styles.qrContainer}>
          <View style={styles.qrBox}>
            <QrCode size={64} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.scanText}>Scan at PHC</Text>
        </View>
      </View>

      {/* Footer Verified Badge */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Digital Health Card • Official Healthcare Record</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: SPACING.md,
  },
  topHeader: {
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: SPACING.sm,
  },
  flagStrip: {
    flexDirection: 'row',
    width: 24,
    height: 16,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
  },
  flagBar: {
    flex: 1,
  },
  headerTitleBlock: {
    flex: 1,
  },
  nhaTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.6,
  },
  subTitle: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  body: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: '#FFFFFF',
  },
  leftDetails: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  patientName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  abhaIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: 2,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  metaLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 11,
    color: '#0F172A',
    fontWeight: '700',
  },
  bloodGroupText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emergency,
  },
  contactText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  qrBox: {
    padding: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scanText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  footer: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
});
