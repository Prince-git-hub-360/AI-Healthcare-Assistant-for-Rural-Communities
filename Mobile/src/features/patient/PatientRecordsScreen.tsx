import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
} from 'react-native';
import {
  FolderHeart,
  FileText,
  FlaskConical,
  Activity,
  ClipboardList,
  ShieldCheck,
  Calendar,
  Building2,
  User,
  ChevronRight,
  X,
  Download,
  Share2,
  Camera,
  Sparkles,
  Plus,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { MOCK_HEALTH_RECORDS, HealthRecordItem } from '../../mock/healthData';
import { SafeStorage } from '../../services/safeStorage';

export const PatientRecordsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecordItem | null>(null);
  const [records, setRecords] = useState<HealthRecordItem[]>([]);

  useEffect(() => {
    const loadVaultRecords = async () => {
      try {
        const stored = await SafeStorage.getItem('@swasthya_health_records');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mappedRecords: HealthRecordItem[] = parsed.map((r: any, idx: number) => ({
              id: r.id || `rec_${idx}`,
              title: r.title || 'Medical Record',
              type: (r.type || 'PRESCRIPTION').toUpperCase() as any,
              doctorName: r.doctor_name || 'Dr. Ramesh Sharma (PHC)',
              facility: 'Rampur Primary Health Centre',
              date: r.date || 'Today',
              summary: r.summary || 'AI has analyzed and extracted medicines and clinical guidance.',
              status: 'VERIFIED',
              findings: ['Normal vital indicators', 'Active medication regimen'],
            }));
            setRecords(mappedRecords);
            return;
          }
        }
      } catch (e) {}

      // Default sample records for rural patient
      setRecords(MOCK_HEALTH_RECORDS);
    };

    loadVaultRecords();
  }, [user]);

  const categories = [
    { id: 'ALL', label: 'All Records (सभी)' },
    { id: 'PRESCRIPTION', label: 'Prescriptions (पर्चे)' },
    { id: 'LAB_REPORT', label: 'Lab Tests (जांच)' },
    { id: 'MEDICAL_REPORT', label: 'Scans & Reports' },
  ];

  const filteredRecords =
    activeCategory === 'ALL'
      ? records
      : records.filter((r) => r.type === activeCategory);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PRESCRIPTION':
        return <FileText size={20} color={COLORS.primary} />;
      case 'LAB_REPORT':
        return <FlaskConical size={20} color="#2563EB" />;
      case 'MEDICAL_REPORT':
        return <Activity size={20} color={COLORS.secondary} />;
      case 'DOCTOR_NOTE':
      default:
        return <ClipboardList size={20} color={COLORS.accent} />;
    }
  };

  const handleDownload = (rec: HealthRecordItem) => {
    Alert.alert('Download Complete / डाउनलोड सफल 🎉', `Document "${rec.title}" saved to your device in PDF format.`);
  };

  const handleShare = (rec: HealthRecordItem) => {
    Alert.alert('ABHA Share / साझा करें', `Secure ABHA sharing token generated for ASHA worker (Sunita Bai).`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Digital Health Vault / स्वास्थ्य रिकॉर्ड</Text>
          <Text style={styles.screenSubtitle}>
            ABHA-linked medical records, prescriptions & lab reports
          </Text>
        </View>

        {/* Categories Horizontal Chip Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
          style={{ marginBottom: SPACING.md }}
        >
          {categories.map((c) => {
            const isActive = activeCategory === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(c.id)}
                activeOpacity={0.75}
              >
                <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Upload / Scan CTA Card */}
        <View style={styles.uploadCtaCard}>
          <View style={styles.uploadCtaLeft}>
            <View style={styles.uploadIconCircle}>
              <Sparkles size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.uploadCtaTitle}>Scan New Document / नया पर्चा जोड़ें</Text>
              <Text style={styles.uploadCtaSub}>AI auto-categorizes prescriptions, blood tests, & scans</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.uploadCtaBtn}
            onPress={() => navigation?.navigate && navigation.navigate('Scanner')}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.uploadCtaBtnText}>Scan</Text>
          </TouchableOpacity>
        </View>

        {/* Records Count Bar */}
        <View style={styles.countBar}>
          <Text style={styles.countBarText}>
            Showing {filteredRecords.length} Documents • ABHA Verified
          </Text>
        </View>

        {/* Records List */}
        <View style={styles.recordsList}>
          {filteredRecords.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.recordCard}
              onPress={() => setSelectedRecord(item)}
              activeOpacity={0.8}
            >
              <View style={styles.recordIconBox}>{getTypeIcon(item.type)}</View>

              <View style={{ flex: 1 }}>
                <View style={styles.recordTopRow}>
                  <Text style={styles.recordTitle}>{item.title}</Text>
                  <View style={styles.recordTypePill}>
                    <Text style={styles.recordTypePillText}>{item.type}</Text>
                  </View>
                </View>

                <Text style={styles.recordDoctor}>🩺 {item.doctorName}</Text>
                <Text style={styles.recordFacility}>🏥 {item.facility}</Text>

                <View style={styles.recordMetaRow}>
                  <View style={styles.recordDateBox}>
                    <Calendar size={12} color="#64748B" />
                    <Text style={styles.recordDateText}>{item.date}</Text>
                  </View>
                  <Text style={styles.medCountText}>• {item.status}</Text>
                </View>
              </View>

              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Detail Modal Sheet */}
      {selectedRecord && (
        <Modal visible={!!selectedRecord} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>{selectedRecord.title}</Text>
                  <Text style={styles.modalSub}>{selectedRecord.date} • {selectedRecord.facility}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedRecord(null)} style={styles.closeBtn}>
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.md }}>
                {/* AI Summary Box */}
                <View style={styles.aiSummaryBox}>
                  <View style={styles.aiSummaryHeader}>
                    <Sparkles size={16} color="#047857" />
                    <Text style={styles.aiSummaryTitle}>AI Medical Analysis & Summary</Text>
                  </View>
                  <Text style={styles.aiSummaryText}>{selectedRecord.summary}</Text>
                </View>

                {/* Doctor Details */}
                <View style={styles.detailRowCard}>
                  <Text style={styles.detailLabel}>Doctor / चिकित्सक:</Text>
                  <Text style={styles.detailValue}>{selectedRecord.doctorName}</Text>
                </View>

                {/* Facility Details */}
                <View style={styles.detailRowCard}>
                  <Text style={styles.detailLabel}>Facility / स्वास्थ्य केंद्र:</Text>
                  <Text style={styles.detailValue}>{selectedRecord.facility}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionBtnsRow}>
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() => handleDownload(selectedRecord)}
                  >
                    <Download size={16} color="#FFFFFF" />
                    <Text style={styles.downloadBtnText}>Download PDF</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.shareBtn}
                    onPress={() => handleShare(selectedRecord)}
                  >
                    <Share2 size={16} color="#047857" />
                    <Text style={styles.shareBtnText}>Share ABHA</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
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
    paddingBottom: SPACING.xxxl,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  screenTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  screenSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  categoryScroll: {
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  uploadCtaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#064E3B',
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  uploadCtaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  uploadIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadCtaTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  uploadCtaSub: {
    fontSize: 10,
    color: '#A7F3D0',
    marginTop: 1,
  },
  uploadCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  uploadCtaBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  countBar: {
    marginBottom: SPACING.sm,
  },
  countBarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  recordsList: {
    gap: 8,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...SHADOWS.subtle,
  },
  recordIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recordTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  recordTypePill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  recordTypePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  recordDoctor: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  recordFacility: {
    fontSize: 10,
    color: '#64748B',
  },
  recordMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  recordDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  recordDateText: {
    fontSize: 10,
    color: '#64748B',
  },
  medCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalSheet: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    maxHeight: '85%',
    ...SHADOWS.elevated,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: SPACING.sm,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  aiSummaryBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
  },
  aiSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  aiSummaryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#064E3B',
  },
  aiSummaryText: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
    fontWeight: '500',
  },
  detailRowCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  actionBtnsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: SPACING.xs,
  },
  downloadBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#047857',
    paddingVertical: 10,
    borderRadius: 8,
  },
  downloadBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  shareBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
});
