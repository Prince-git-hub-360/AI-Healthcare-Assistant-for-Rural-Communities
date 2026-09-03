import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  X,
  Bot,
  User,
  Mic,
  RefreshCw,
  HelpCircle,
  Pill,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { VoiceAssistantService } from '../../services/speechService';
import { apiClient } from '../../api/client';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isSpeaking?: boolean;
}

const QUICK_PROMPTS: Record<string, string[]> = {
  hi: [
    'पैरासिटामोल के क्या फायदे और सावधानियां हैं?',
    'खाली पेट कौन सी दवाइयां लेनी चाहिए?',
    'ब्लड प्रेशर और शुगर कैसे नियंत्रित करें?',
    'आभा (ABHA) हेल्थ कार्ड के क्या लाभ हैं?',
  ],
  en: [
    'What are the main uses and precautions for Paracetamol 650mg?',
    'Which medicines should strictly be taken on an empty stomach?',
    'How can I manage high blood pressure and blood sugar naturally?',
    'What benefits does the ABHA Ayushman Health Card provide?',
  ],
};

export const SwasthyaMitrAiModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  activeMedicineContext?: string;
}> = ({ visible, onClose, activeMedicineContext }) => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize greeting on open
  useEffect(() => {
    if (visible && messages.length === 0) {
      const patientName = user?.first_name || 'मरीज';
      const initialGreeting: ChatMessage = {
        id: 'msg_welcome',
        sender: 'ai',
        text:
          currentLanguage === 'hi'
            ? `नमस्ते ${patientName} जी! 🙏 मैं **स्वास्थ मित्र** (Swasthya Mitr) हूँ — आपका AI स्वास्थ्य सहायक।\n\nआप मुझसे अपनी दवाइयों, खुराक के समय, साइड-इफेक्ट्स, बुखार, बीपी, शुगर, या किसी भी स्वास्थ्य समस्या के बारे में पूछ सकते हैं।`
            : `Hello ${patientName}! 🙏 I am **Swasthya Mitr** — your personal AI Healthcare Companion.\n\nYou can ask me about medicine dosages, meal timings, side effects, blood pressure, sugar, or any symptoms in your native language.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([initialGreeting]);
    }
  }, [visible, currentLanguage, user]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const targetLang = currentLanguage === 'hi' ? 'Hindi' : 'English';
      const response = await apiClient.post(
        '/ai-assistant/medicine/',
        {
          question: query,
          language: targetLang,
          medicine: activeMedicineContext ? { name: activeMedicineContext } : {},
          conversation_history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        },
        { timeout: 25000 }
      );

      const aiAnswer =
        response.data?.answer ||
        (currentLanguage === 'hi'
          ? 'दवाइयों का सही समय पर सेवन करें और डॉक्टर की सलाह का पालन करें।'
          : 'Please follow your prescribed medication routine and consult your doctor.');

      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: aiAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('[SwasthyaMitr] API error, loading local AI medical knowledge:', err);
      // Fallback local intelligence
      const fallbackMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text:
          currentLanguage === 'hi'
            ? `दवाइयों को हमेशा साफ पानी के साथ लें। एंटीबायोटिक्स का कोर्स बीच में न छोड़ें। यदि कोई गंभीर लक्षण महसूस हो तो तुरंत 108 एम्बुलेंस या नजदीकी पीएचसी (PHC) से संपर्क करें।`
            : `Always take prescribed medicines with clean water. Do not stop antibiotic courses midway. If you experience severe symptoms, contact 108 Ambulance or your nearest PHC immediately.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 150);
    }
  };

  const handleSpeak = (msg: ChatMessage) => {
    if (speakingMsgId === msg.id) {
      VoiceAssistantService.stop();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msg.id);
      // Clean markdown stars before speech
      const cleanText = msg.text.replace(/\*\*/g, '').replace(/#/g, '');
      VoiceAssistantService.speak(cleanText, currentLanguage, () => {
        setSpeakingMsgId(null);
      });
    }
  };

  const prompts = QUICK_PROMPTS[currentLanguage] || QUICK_PROMPTS.en;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.aiHeaderTitleRow}>
              <View style={styles.aiAvatarCircle}>
                <Sparkles size={20} color="#FFFFFF" />
              </View>
              <View>
                <View style={styles.badgeRow}>
                  <Text style={styles.aiTitle}>Swasthya Mitr (स्वास्थ मित्र)</Text>
                  <View style={styles.onlineBadge}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineText}>Gemini AI</Text>
                  </View>
                </View>
                <Text style={styles.aiSubtitle}>24x7 Multilingual AI Health Assistant</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Chat Messages Body */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.msgRow,
                  msg.sender === 'user' ? styles.msgRowUser : styles.msgRowAi,
                ]}
              >
                {msg.sender === 'ai' && (
                  <View style={styles.msgAvatarAi}>
                    <Bot size={16} color="#047857" />
                  </View>
                )}

                <View
                  style={[
                    styles.msgBubble,
                    msg.sender === 'user' ? styles.msgBubbleUser : styles.msgBubbleAi,
                  ]}
                >
                  <Text
                    style={[
                      styles.msgText,
                      msg.sender === 'user' ? styles.msgTextUser : styles.msgTextAi,
                    ]}
                  >
                    {msg.text}
                  </Text>

                  <View style={styles.msgFooter}>
                    <Text style={styles.msgTimestamp}>{msg.timestamp}</Text>
                    {msg.sender === 'ai' && (
                      <TouchableOpacity
                        style={styles.speakIconBtn}
                        onPress={() => handleSpeak(msg)}
                      >
                        {speakingMsgId === msg.id ? (
                          <VolumeX size={14} color="#DC2626" />
                        ) : (
                          <Volume2 size={14} color="#047857" />
                        )}
                        <Text style={[styles.speakBtnText, speakingMsgId === msg.id && { color: '#DC2626' }]}>
                          {speakingMsgId === msg.id ? 'Stop' : 'Listen'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {msg.sender === 'user' && (
                  <View style={styles.msgAvatarUser}>
                    <User size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ))}

            {isLoading && (
              <View style={[styles.msgRow, styles.msgRowAi]}>
                <View style={styles.msgAvatarAi}>
                  <Bot size={16} color="#047857" />
                </View>
                <View style={[styles.msgBubble, styles.msgBubbleAi, { paddingVertical: 12 }]}>
                  <ActivityIndicator size="small" color="#047857" />
                  <Text style={styles.thinkingText}>
                    Swasthya Mitr is analyzing your medical query...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick Prompt Chips */}
          <View style={styles.quickPromptsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: SPACING.md }}>
              {prompts.map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.promptChip}
                  onPress={() => handleSendMessage(p)}
                >
                  <Text style={styles.promptChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input Bar */}
          <View style={styles.inputBarContainer}>
            <TextInput
              style={styles.textInput}
              value={inputQuery}
              onChangeText={setInputQuery}
              placeholder={
                currentLanguage === 'hi'
                  ? 'अपनी दवा या बीमारी के बारे में पूछें...'
                  : 'Ask about medicine dosage, side effects, symptoms...'
              }
              placeholderTextColor="#94A3B8"
              onSubmitEditing={() => handleSendMessage()}
              returnKeyType="send"
            />

            <TouchableOpacity
              style={[styles.sendBtn, (!inputQuery.trim() || isLoading) && styles.sendBtnDisabled]}
              onPress={() => handleSendMessage()}
              disabled={!inputQuery.trim() || isLoading}
            >
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 440,
    height: '88%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    ...SHADOWS.elevated,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#F0FDF4',
    borderBottomWidth: 1,
    borderBottomColor: '#BBF7D0',
  },
  aiHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#064E3B',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  onlineText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
  aiSubtitle: {
    fontSize: 11,
    color: '#047857',
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
  },
  chatScrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowAi: {
    justifyContent: 'flex-start',
  },
  msgAvatarAi: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  msgAvatarUser: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgBubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...SHADOWS.subtle,
  },
  msgBubbleUser: {
    backgroundColor: '#0284C7',
    borderBottomRightRadius: 4,
  },
  msgBubbleAi: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  msgTextUser: {
    color: '#FFFFFF',
  },
  msgTextAi: {
    color: '#0F172A',
  },
  msgFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    gap: 8,
  },
  msgTimestamp: {
    fontSize: 10,
    color: '#94A3B8',
  },
  speakIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  speakBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  thinkingText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 4,
  },
  quickPromptsContainer: {
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  promptChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6,
    ...SHADOWS.subtle,
  },
  promptChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
  },
  inputBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.subtle,
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.6,
  },
});
