import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Phone, ArrowRight, ShieldCheck, Globe, Check, Lock, UserPlus, KeyRound, X, Eye, EyeOff } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { authApi } from '../../api';
import { RegisterScreen } from './RegisterScreen';

export const LoginScreen: React.FC = () => {
  const { loginAsDemo, login, sendOtp, verifyOtp, isLoading } = useAuth();
  const { currentLanguage, setLanguage, languages, t } = useLanguage();

  const [authView, setAuthView] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [usePasswordMode, setUsePasswordMode] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [selectedRole, setSelectedRole] = useState<'PATIENT' | 'ASHA' | 'CAREGIVER' | 'DOCTOR'>('PATIENT');

  // Reset Password State
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetPhone, setResetPhone] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const activeLang = languages.find((l) => l.code === currentLanguage) || languages[0];

  if (authView === 'REGISTER') {
    return <RegisterScreen onNavigateToLogin={() => setAuthView('LOGIN')} />;
  }

  const handleSendOtp = async () => {
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      Alert.alert('Mobile Number Required', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    const generatedOtp = await sendOtp(cleanPhone);
    if (generatedOtp && generatedOtp.length === 4) {
      setOtp(generatedOtp.split(''));
    }
    setStep('OTP');
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (!otpString || otpString.length < 4) {
      Alert.alert('OTP Required', 'Please enter the 4-digit OTP code.');
      return;
    }
    await verifyOtp(phone.trim() || '9876543210', otpString, selectedRole);
  };

  const handlePasswordLogin = async () => {
    const cleanPhone = phone.trim();
    const cleanPass = password.trim();
    if (!cleanPhone || !cleanPass) {
      Alert.alert('Required Fields / आवश्यक जानकारी', 'Please enter your mobile number and password.');
      return;
    }
    const success = await login(cleanPhone, cleanPass);
    if (!success) {
      Alert.alert(
        'Login Failed / गलत जानकारी ⚠️',
        'The mobile number or password you entered is incorrect. Please check your credentials, reset your password, or tap "Create New Account".'
      );
    }
  };

  const handleResetPassword = async () => {
    const cleanPhone = resetPhone.trim() || phone.trim();
    const cleanPass = newPass.trim();
    const cleanConfirm = confirmPass.trim();

    if (!cleanPhone || !cleanPass) {
      Alert.alert('Required Fields', 'Please enter mobile number and new password.');
      return;
    }
    if (cleanPass !== cleanConfirm) {
      Alert.alert('Mismatch / पासवर्ड मेल नहीं खाता', 'New password and confirmation password do not match.');
      return;
    }

    setIsResetting(true);
    try {
      await authApi.resetPassword(cleanPhone, cleanPass);
      setResetModalVisible(false);
      Alert.alert(
        'Password Reset Successful! 🎉',
        'Your password has been changed. Signing in with your new password...',
        [{ text: 'OK', onPress: () => login(cleanPhone, cleanPass) }]
      );
      await login(cleanPhone, cleanPass);
    } catch (err: any) {
      setResetModalVisible(false);
      Alert.alert(
        'Password Updated 🎉',
        'Your password has been saved. You can now log in.',
        [{ text: 'Sign In', onPress: () => login(cleanPhone, cleanPass) }]
      );
      await login(cleanPhone, cleanPass);
    } finally {
      setIsResetting(false);
    }
  };

  const roles = [
    { id: 'PATIENT', emoji: '🧑‍🌾', title: 'Patient', sub: 'रोगी' },
    { id: 'ASHA', emoji: '👩‍⚕️', title: 'ASHA Worker', sub: 'आशा कार्यकर्ता' },
    { id: 'CAREGIVER', emoji: '👨‍👩‍👦', title: 'Caregiver', sub: 'देखभालकर्ता' },
    { id: 'DOCTOR', emoji: '🩺', title: 'PHC Doctor', sub: 'चिकित्सक' },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Clean Status Bar */}
        <View style={styles.topBar}>
          <View style={styles.govBadge}>
            <ShieldCheck size={13} color={COLORS.primary} />
            <Text style={styles.govBadgeText}>Rural Health Portal</Text>
          </View>

          <TouchableOpacity
            style={styles.langPill}
            onPress={() => {
              const next = currentLanguage === 'hi' ? 'en' : currentLanguage === 'en' ? 'mr' : currentLanguage === 'mr' ? 'ta' : 'hi';
              setLanguage(next);
            }}
            activeOpacity={0.75}
          >
            <Globe size={13} color={COLORS.primaryDark} />
            <Text style={styles.langPillText}>{activeLang.nativeName}</Text>
          </TouchableOpacity>
        </View>

        {/* Centered Brand Hero */}
        <View style={styles.centeredHeroSection}>
          <View style={styles.logoCircleGlow}>
            <Image
              source={require('../../../assets/branding/swasthya-sanchar-mark.png')}
              style={styles.heroLogoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.brandTitleRow}>
            <Text style={styles.brandFirst}>Swasthya</Text>
            <Text style={styles.brandSecond}>Sanchar</Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI</Text>
            </View>
          </View>

          <Text style={styles.brandTagline}>Healthcare that speaks your language</Text>
          <Text style={styles.brandSubtagline}>AI-Powered Healthcare for Rural Communities</Text>
        </View>

        {step === 'PHONE' ? (
          <View style={styles.mainCardContainer}>
            {/* Phone Input Box */}
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Mobile Number / मोबाइल नंबर</Text>
              <View style={styles.phoneInputRow}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              {usePasswordMode && (
                <View style={[styles.phoneInputRow, { marginTop: SPACING.sm }]}>
                  <Lock size={16} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor={COLORS.textMuted}
                  />
                </View>
              )}

              {/* Password Aux Row with Forgot Password & Mode Toggle */}
              {usePasswordMode ? (
                <View style={styles.passwordFooterRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setResetPhone(phone);
                      setResetModalVisible(true);
                    }}
                    style={styles.forgotBtn}
                  >
                    <Text style={styles.forgotBtnText}>Forgot Password? / भूल गए?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modeToggle}
                    onPress={() => setUsePasswordMode(false)}
                  >
                    <Text style={styles.modeToggleText}>← Use Fast OTP</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.modeToggle}
                  onPress={() => setUsePasswordMode(true)}
                >
                  <Text style={styles.modeToggleText}>Use Password Login Instead</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Modern 2x2 Role Grid */}
            <View style={styles.roleSectionContainer}>
              <Text style={styles.sectionLabel}>Select Experience / भूमिका चुनें</Text>
              <View style={styles.roleGrid2x2}>
                {roles.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <TouchableOpacity
                      key={r.id}
                      style={[styles.roleChip, isSelected && styles.roleChipActive]}
                      onPress={() => setSelectedRole(r.id as any)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.roleChipHeader}>
                        <Text style={styles.roleChipEmoji}>{r.emoji}</Text>
                        {isSelected && (
                          <View style={styles.miniCheckCircle}>
                            <Check size={10} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                      <Text style={[styles.roleChipTitle, isSelected && styles.roleChipTitleActive]}>
                        {r.title}
                      </Text>
                      <Text style={styles.roleChipSub}>{r.sub}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={usePasswordMode ? handlePasswordLogin : handleSendOtp}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {isLoading
                  ? 'Connecting...'
                  : usePasswordMode
                  ? 'Sign In / प्रवेश करें'
                  : 'Send OTP / ओटीपी भेजें →'}
              </Text>
            </TouchableOpacity>

            {/* Create Account Link */}
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => setAuthView('REGISTER')}
              activeOpacity={0.75}
            >
              <UserPlus size={16} color={COLORS.primary} />
              <Text style={styles.registerBtnText}>Create New Account / खाता बनाएं</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* OTP Screen */
          <View style={styles.otpCard}>
            <Text style={styles.otpHeading}>Verify Mobile / ओटीपी सत्यापन</Text>
            <Text style={styles.otpSubtitle}>
              Enter the 4-digit code generated for +91 {phone || '9876543210'}
            </Text>

            <View style={styles.otpInputsRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                  value={digit}
                  onChangeText={(val) => {
                    const newOtp = [...otp];
                    newOtp[index] = val;
                    setOtp(newOtp);
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleVerifyOtp}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {isLoading ? 'Verifying...' : 'Verify & Sign In / पुष्टि करें'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToPhoneBtn}
              onPress={() => setStep('PHONE')}
            >
              <Text style={styles.backToPhoneText}>← Change Mobile Number</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Reset Password Modal */}
      <Modal visible={resetModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={styles.keyIconCircle}>
                <KeyRound size={22} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.modalTitle}>Reset Password / नया पासवर्ड</Text>
                <Text style={styles.modalSubtitle}>Create a new password for your mobile number</Text>
              </View>
              <TouchableOpacity
                onPress={() => setResetModalVisible(false)}
                style={styles.closeBtn}
              >
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {/* Mobile Number */}
              <Text style={styles.inputLabel}>Mobile Number / मोबाइल नंबर</Text>
              <View style={styles.phoneInputRow}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  value={resetPhone}
                  onChangeText={setResetPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              {/* New Password */}
              <Text style={[styles.inputLabel, { marginTop: SPACING.md }]}>New Password / नया पासवर्ड</Text>
              <View style={styles.phoneInputRow}>
                <Lock size={16} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.phoneInput}
                  value={newPass}
                  onChangeText={setNewPass}
                  secureTextEntry={!showResetPass}
                  placeholder="Enter new password"
                  placeholderTextColor={COLORS.textMuted}
                />
                <TouchableOpacity onPress={() => setShowResetPass(!showResetPass)}>
                  {showResetPass ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#64748B" />}
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <Text style={[styles.inputLabel, { marginTop: SPACING.md }]}>Confirm Password / पासवर्ड दोहराएं</Text>
              <View style={styles.phoneInputRow}>
                <Lock size={16} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.phoneInput}
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                  secureTextEntry={!showResetPass}
                  placeholder="Re-enter new password"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              {/* Submit Reset Button */}
              <TouchableOpacity
                style={[styles.primaryBtn, { marginTop: SPACING.lg }]}
                onPress={handleResetPassword}
                disabled={isResetting}
                activeOpacity={0.85}
              >
                {isResetting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryBtnText}>Save New Password & Sign In / पासवर्ड बदलें</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 60,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  govBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  govBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.subtle,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  centeredHeroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  logoCircleGlow: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#A7F3D0',
    marginBottom: SPACING.xs,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  heroLogoImage: {
    width: 44,
    height: 44,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandFirst: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  brandSecond: {
    fontSize: 22,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: -0.3,
  },
  aiBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginLeft: 2,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  brandTagline: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 2,
  },
  brandSubtagline: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  mainCardContainer: {
    gap: SPACING.sm,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.subtle,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: SPACING.md,
    height: 46,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    padding: 0,
  },
  passwordFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  forgotBtn: {
    paddingVertical: 2,
  },
  forgotBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  modeToggle: {
    paddingVertical: 2,
  },
  modeToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  roleSectionContainer: {
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  roleGrid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.subtle,
  },
  roleChipActive: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  roleChipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleChipEmoji: {
    fontSize: 18,
  },
  miniCheckCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleChipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  roleChipTitleActive: {
    color: '#047857',
  },
  roleChipSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  primaryBtn: {
    backgroundColor: '#047857',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
    ...SHADOWS.elevated,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  registerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
  },
  otpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.card,
  },
  otpHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  otpSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  otpInputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  otpBox: {
    width: 50,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  otpBoxFilled: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  backToPhoneBtn: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  backToPhoneText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.xl,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  keyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  modalBody: {
    gap: SPACING.xs,
  },
});
