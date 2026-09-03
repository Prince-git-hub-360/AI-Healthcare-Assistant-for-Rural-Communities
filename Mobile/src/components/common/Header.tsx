import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Globe, LogOut, CheckCircle2 } from 'lucide-react-native';
import { MobileSwasthyaLogo } from '../branding/MobileSwasthyaLogo';

export const Header: React.FC<{
  title?: string;
  roleBadge?: string;
  showLangSwitch?: boolean;
}> = ({ title, roleBadge, showLangSwitch = true }) => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const activeLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  const handleLogout = () => {
    Alert.alert(
      'Log Out / लॉग आउट',
      'Are you sure you want to return to the login screen?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <MobileSwasthyaLogo variant="full" height={36} />
      </View>

      <View style={styles.rightRow}>
        {roleBadge && (
          <View style={styles.roleBadgeContainer}>
            <Text style={styles.roleBadgeText}>{roleBadge}</Text>
          </View>
        )}

        {showLangSwitch && (
          <TouchableOpacity
            style={styles.langButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Globe size={14} color={COLORS.primaryDark} />
            <Text style={styles.langText}>{activeLangObj.nativeName}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
          accessibilityLabel="Log Out"
        >
          <LogOut size={16} color={COLORS.emergency} />
        </TouchableOpacity>
      </View>

      {/* Language Selector Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language / भाषा चुनें</Text>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.langItem,
                    item.code === currentLanguage && styles.langItemActive,
                  ]}
                  onPress={async () => {
                    await setLanguage(item.code);
                    setModalVisible(false);
                  }}
                >
                  <View style={styles.langItemLeft}>
                    <Text style={styles.flagText}>{item.flag}</Text>
                    <View>
                      <Text style={styles.langItemNative}>{item.nativeName}</Text>
                      <Text style={styles.langItemEnglish}>{item.name}</Text>
                    </View>
                  </View>
                  {item.code === currentLanguage && (
                    <CheckCircle2 size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close / बंद करें</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  roleBadgeContainer: {
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  logoutButton: {
    padding: 7,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.emergencyLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  langItemActive: {
    backgroundColor: COLORS.primarySurface,
    borderRadius: BORDER_RADIUS.md,
  },
  langItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  flagText: {
    fontSize: 22,
  },
  langItemNative: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  langItemEnglish: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  modalCloseButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  modalCloseText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textSecondary,
  },
});
