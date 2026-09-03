import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Navigation,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Check,
  Building2,
  Pill,
  Activity,
  HeartPulse,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { VoiceAssistantService } from '../../services/speechService';

export interface HealthcareFacility {
  id: string;
  name: string;
  type: 'PHC' | 'HOSPITAL' | 'PHARMACY' | 'AMBULANCE';
  distance: string;
  eta: string;
  phone: string;
  address: string;
  services: string[];
  status: string;
  lat: number;
  lng: number;
  icon: string;
}

const NEARBY_FACILITIES: HealthcareFacility[] = [
  {
    id: 'f1',
    name: 'Rampur Primary Health Centre (PHC)',
    type: 'PHC',
    distance: '0.8 km',
    eta: '4 mins',
    phone: '+919415012345',
    address: 'Main Road, Rampur Gram, Ward 3',
    services: ['24x7 Emergency', 'Anti-Snake Venom (ASV)', 'Maternity', 'Free Generic Meds'],
    status: 'Open 24 Hours (खुला है)',
    lat: 25.3176,
    lng: 82.9739,
    icon: '🩺',
  },
  {
    id: 'f2',
    name: 'Varanasi District Hospital & Trauma Centre',
    type: 'HOSPITAL',
    distance: '2.1 km',
    eta: '8 mins',
    phone: '+915422221111',
    address: 'Kabir Chaura, Varanasi District',
    services: ['ICU & CCU', 'Blood Bank', 'Advanced Trauma Care', '24x7 Ambulance'],
    status: 'Open 24 Hours (खुला है)',
    lat: 25.3210,
    lng: 82.9850,
    icon: '🏥',
  },
  {
    id: 'f3',
    name: 'Pradhan Mantri Jan Aushadhi 24x7 Kendra',
    type: 'PHARMACY',
    distance: '1.2 km',
    eta: '5 mins',
    phone: '+919838098765',
    address: 'Shop 4, Gram Panchayat Market',
    services: ['Generic Medicines 90% Off', 'Oxygen Cylinders', 'First-Aid Kits'],
    status: 'Open 24 Hours (खुला है)',
    lat: 25.3150,
    lng: 82.9700,
    icon: '💊',
  },
  {
    id: 'f4',
    name: '108 Rural Ambulance Dispatch Unit #4',
    type: 'AMBULANCE',
    distance: '1.0 km',
    eta: '7 mins',
    phone: '108',
    address: 'En route to Rampur Gram, Ward 3',
    services: ['Advanced Life Support', 'Paramedic on board', 'Oxygen supply'],
    status: 'En Route (रास्ते में है)',
    lat: 25.3160,
    lng: 82.9720,
    icon: '🚑',
  },
];

const FIRST_AID_GUIDES: Record<string, { title: string; icon: string; audio: string; steps: string[] }> = {
  snakebite: {
    title: 'Snakebite Emergency (सर्पदंश प्राथमिक उपचार)',
    icon: '🐍',
    audio: 'सर्पदंश होने पर मरीज को शांत रखें और बिल्कुल न हिलाएं। काटे गए अंग को दिल के स्तर से नीचे रखें। घाव को साफ पानी से धोएं, कोई चीरा या तंग पट्टी न बांधें। तुरंत नजदीकी अस्पताल ले जाएं जहां एंटी-वेनम उपलब्ध है।',
    steps: [
      'Keep the patient calm and completely still to slow venom spread.',
      'Immobilize the bitten limb below heart level with a cloth sling.',
      'Remove rings, tight clothes, or bangles before swelling starts.',
      'Wash gently with clean water. DO NOT cut skin or tie tight tourniquets.',
      'Rush immediately to Rampur PHC (0.8 km) for Anti-Snake Venom (ASV).',
    ],
  },
  cpr: {
    title: 'CPR Protocol (हृदय गति रुकना)',
    icon: '🫀',
    audio: 'मरीज को सख्त जमीन पर सीधा लिटाएं। दोनों हाथों की उंगलियां छाती के बीच में फंसाएं और तेजी से 100 से 120 बार प्रति मिनट की गति से छाती दबाएं। 108 एम्बुलेंस आने तक इसे जारी रखें।',
    steps: [
      'Place victim flat on their back on hard ground.',
      'Interlock fingers in the center of the chest between nipples.',
      'Push hard and fast (100–120 compressions per minute).',
      'Allow chest to rise completely between compressions until 108 arrives.',
    ],
  },
  poisoning: {
    title: 'Pesticide Poisoning (कीटनाशक जहर)',
    icon: '⚠️',
    audio: 'कीटनाशक के संपर्क में आए कपड़े तुरंत उतारें और त्वचा को साबुन व ठंडे पानी से अच्छी तरह धोएं। उल्टी न कराएं। कीटनाशक का डिब्बा साथ लेकर तुरंत अस्पताल जाएं।',
    steps: [
      'Remove contaminated farm clothes immediately and wash skin with soap & water.',
      'Do NOT induce vomiting unless instructed by doctors.',
      'Bring the pesticide container or label to the hospital.',
      'Call National Poison Helpline 1066 or rush to nearest CHC.',
    ],
  },
  bleeding: {
    title: 'Severe Bleeding (गंभीर रक्तस्राव)',
    icon: '🩸',
    audio: 'घाव पर साफ कपड़े से लगातार तेज दबाव बनाएं। अगर कोई हड्डी न टूटी हो तो घायल हिस्से को दिल से ऊपर उठाएं। खून बहना बंद होने तक पट्टी न हटाएं।',
    steps: [
      'Apply firm, continuous direct pressure on the wound with a clean cloth.',
      'Elevate the injured limb above heart level if no bone fracture is suspected.',
      'Do NOT remove cloth if soaked; layer another clean cloth on top.',
      'Rush immediately to Varanasi District Trauma Hospital.',
    ],
  },
};

export const MobileEmergencySosModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'MAP' | 'FACILITIES' | 'FIRSTAID'>('MAP');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HOSPITAL' | 'PHC' | 'PHARMACY'>('ALL');
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility>(NEARBY_FACILITIES[0]);
  const [selectedTopic, setSelectedTopic] = useState<string>('snakebite');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const filteredFacilities = NEARBY_FACILITIES.filter((f) => {
    if (activeFilter === 'ALL') return true;
    return f.type === activeFilter;
  });

  const handleCall = (phone: string, name: string) => {
    Alert.alert(
      `Calling ${name}`,
      `Connecting phone call to ${phone}...`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => {}) },
      ]
    );
  };

  const handleDirections = (facility: HealthcareFacility) => {
    Alert.alert(
      'Navigation Directions',
      `Opening GPS route to ${facility.name} (${facility.distance}, ${facility.eta})...`,
      [
        { text: 'OK', onPress: () => Linking.openURL(`https://maps.google.com/?q=${facility.lat},${facility.lng}`).catch(() => {}) },
      ]
    );
  };

  const handleBroadcastSos = () => {
    const village = user?.village_or_town || 'Rampur Gram, Ward 3';
    const patientName = user?.first_name || 'Prince Kumar';
    Alert.alert(
      'SOS Broadcasted! 🚨',
      `High-Priority Emergency Signal Sent!\n\nPatient: ${patientName}\nLocation: ${village}, Varanasi\nGPS: 25.3176° N, 82.9739° E\n\nASHA Worker (Sunita Bai), 108 Dispatch, and Emergency Contacts have been alerted with live tracking.`
    );
  };

  const toggleTopicAudio = () => {
    if (isPlayingAudio) {
      VoiceAssistantService.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const text = FIRST_AID_GUIDES[selectedTopic]?.audio || '';
      VoiceAssistantService.speak(text, currentLanguage, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.sosHeaderTitleRow}>
              <View style={styles.sosIconCircle}>
                <ShieldAlert size={20} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.sosTitle}>Emergency SOS / आपातकालीन</Text>
                <Text style={styles.sosSubtitle}>Live GPS Radar & Nearby Healthcare Facilities</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={styles.modeTabsRow}>
            <TouchableOpacity
              style={[styles.modeTab, activeTab === 'MAP' && styles.modeTabActive]}
              onPress={() => setActiveTab('MAP')}
            >
              <MapPin size={14} color={activeTab === 'MAP' ? '#DC2626' : '#64748B'} />
              <Text style={[styles.modeTabText, activeTab === 'MAP' && styles.modeTabTextActive]}>
                GPS Radar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, activeTab === 'FACILITIES' && styles.modeTabActive]}
              onPress={() => setActiveTab('FACILITIES')}
            >
              <Building2 size={14} color={activeTab === 'FACILITIES' ? '#DC2626' : '#64748B'} />
              <Text style={[styles.modeTabText, activeTab === 'FACILITIES' && styles.modeTabTextActive]}>
                Hospitals & PHCs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, activeTab === 'FIRSTAID' && styles.modeTabActive]}
              onPress={() => setActiveTab('FIRSTAID')}
            >
              <HeartPulse size={14} color={activeTab === 'FIRSTAID' ? '#DC2626' : '#64748B'} />
              <Text style={[styles.modeTabText, activeTab === 'FIRSTAID' && styles.modeTabTextActive]}>
                First-Aid Guides
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollBody}>
            {activeTab === 'MAP' && (
              <View>
                {/* Visual Satellite GPS Radar Map */}
                <View style={styles.radarMapCard}>
                  <View style={styles.radarMapCanvas}>
                    {/* Grid Overlay */}
                    <View style={styles.gridLineH1} />
                    <View style={styles.gridLineH2} />
                    <View style={styles.gridLineV1} />
                    <View style={styles.gridLineV2} />

                    {/* Ambulance Live Route Line */}
                    <View style={styles.routeDottedLine} />

                    {/* Patient User Pin */}
                    <View style={styles.userRadarPin}>
                      <View style={styles.userPulseRing} />
                      <View style={styles.userPinCenter}>
                        <Text style={{ fontSize: 12 }}>📍</Text>
                      </View>
                      <Text style={styles.userPinLabel}>You (आप)</Text>
                    </View>

                    {/* Facility Marker: Rampur PHC */}
                    <TouchableOpacity
                      style={[styles.facilityMarker, { top: 20, right: 30 }]}
                      onPress={() => setSelectedFacility(NEARBY_FACILITIES[0])}
                    >
                      <Text style={styles.markerEmoji}>🩺</Text>
                      <View style={styles.markerTag}>
                        <Text style={styles.markerTagText}>PHC 0.8km</Text>
                      </View>
                    </TouchableOpacity>

                    {/* Facility Marker: District Hospital */}
                    <TouchableOpacity
                      style={[styles.facilityMarker, { bottom: 25, right: 20 }]}
                      onPress={() => setSelectedFacility(NEARBY_FACILITIES[1])}
                    >
                      <Text style={styles.markerEmoji}>🏥</Text>
                      <View style={styles.markerTag}>
                        <Text style={styles.markerTagText}>Hospital 2.1km</Text>
                      </View>
                    </TouchableOpacity>

                    {/* Facility Marker: 24x7 Pharmacy */}
                    <TouchableOpacity
                      style={[styles.facilityMarker, { top: 30, left: 25 }]}
                      onPress={() => setSelectedFacility(NEARBY_FACILITIES[2])}
                    >
                      <Text style={styles.markerEmoji}>💊</Text>
                      <View style={styles.markerTag}>
                        <Text style={styles.markerTagText}>Medical 1.2km</Text>
                      </View>
                    </TouchableOpacity>

                    {/* Facility Marker: 108 Ambulance */}
                    <TouchableOpacity
                      style={[styles.facilityMarker, { bottom: 35, left: 35 }]}
                      onPress={() => setSelectedFacility(NEARBY_FACILITIES[3])}
                    >
                      <Text style={styles.markerEmoji}>🚑</Text>
                      <View style={[styles.markerTag, { backgroundColor: '#DC2626' }]}>
                        <Text style={[styles.markerTagText, { color: '#FFFFFF' }]}>108 (7m ETA)</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.mapStatusBar}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mapStatusVillage}>
                        📍 {user?.village_or_town || 'Rampur Gram, Ward 3'}, Varanasi
                      </Text>
                      <Text style={styles.mapStatusGps}>GPS Accuracy: ±4m • 4 Facilities within 2.5 km</Text>
                    </View>
                    <View style={styles.etaBadge}>
                      <Text style={styles.etaBadgeText}>ETA: 7 Mins</Text>
                    </View>
                  </View>
                </View>

                {/* Selected Facility Spotlight Card */}
                {selectedFacility && (
                  <View style={styles.spotlightCard}>
                    <View style={styles.spotlightHeader}>
                      <View style={styles.spotlightIconCircle}>
                        <Text style={{ fontSize: 20 }}>{selectedFacility.icon}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.spotlightName}>{selectedFacility.name}</Text>
                        <Text style={styles.spotlightStatus}>
                          🟢 {selectedFacility.status} • {selectedFacility.distance} ({selectedFacility.eta})
                        </Text>
                      </View>
                    </View>

                    <View style={styles.serviceChipsRow}>
                      {selectedFacility.services.map((s, idx) => (
                        <View key={idx} style={styles.serviceChip}>
                          <Text style={styles.serviceChipText}>✓ {s}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.spotlightActionsRow}>
                      <TouchableOpacity
                        style={styles.callBtn}
                        onPress={() => handleCall(selectedFacility.phone, selectedFacility.name)}
                      >
                        <PhoneCall size={16} color="#FFFFFF" />
                        <Text style={styles.callBtnText}>Call ({selectedFacility.phone})</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.directionsBtn}
                        onPress={() => handleDirections(selectedFacility)}
                      >
                        <Navigation size={16} color="#047857" />
                        <Text style={styles.directionsBtnText}>Directions</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {activeTab === 'FACILITIES' && (
              <View>
                {/* Category Filter Chips */}
                <View style={styles.filterChipsRow}>
                  <TouchableOpacity
                    style={[styles.filterChip, activeFilter === 'ALL' && styles.filterChipActive]}
                    onPress={() => setActiveFilter('ALL')}
                  >
                    <Text style={[styles.filterChipText, activeFilter === 'ALL' && styles.filterChipTextActive]}>
                      All (सभी)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.filterChip, activeFilter === 'HOSPITAL' && styles.filterChipActive]}
                    onPress={() => setActiveFilter('HOSPITAL')}
                  >
                    <Text style={[styles.filterChipText, activeFilter === 'HOSPITAL' && styles.filterChipTextActive]}>
                      🏥 Hospitals
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.filterChip, activeFilter === 'PHC' && styles.filterChipActive]}
                    onPress={() => setActiveFilter('PHC')}
                  >
                    <Text style={[styles.filterChipText, activeFilter === 'PHC' && styles.filterChipTextActive]}>
                      🩺 PHC / CHC
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.filterChip, activeFilter === 'PHARMACY' && styles.filterChipActive]}
                    onPress={() => setActiveFilter('PHARMACY')}
                  >
                    <Text style={[styles.filterChipText, activeFilter === 'PHARMACY' && styles.filterChipTextActive]}>
                      💊 Pharmacies
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Facilities List */}
                <View style={{ gap: SPACING.sm }}>
                  {filteredFacilities.map((fac) => (
                    <View key={fac.id} style={styles.facilityListItem}>
                      <View style={styles.facListTop}>
                        <View style={styles.facListIconCircle}>
                          <Text style={{ fontSize: 18 }}>{fac.icon}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.facListName}>{fac.name}</Text>
                          <Text style={styles.facListAddress}>{fac.address}</Text>
                          <Text style={styles.facListStatus}>🟢 {fac.status}</Text>
                        </View>
                        <View style={styles.facListDistCol}>
                          <Text style={styles.facListDistText}>{fac.distance}</Text>
                          <Text style={styles.facListEtaText}>{fac.eta}</Text>
                        </View>
                      </View>

                      <View style={styles.facListActions}>
                        <TouchableOpacity
                          style={styles.facListCallBtn}
                          onPress={() => handleCall(fac.phone, fac.name)}
                        >
                          <PhoneCall size={14} color="#FFFFFF" />
                          <Text style={styles.facListCallText}>Call {fac.phone}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.facListNavBtn}
                          onPress={() => handleDirections(fac)}
                        >
                          <Navigation size={14} color="#047857" />
                          <Text style={styles.facListNavText}>Get Route</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'FIRSTAID' && (
              <View>
                {/* Topic Selector Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
                  {Object.entries(FIRST_AID_GUIDES).map(([key, item]) => (
                    <TouchableOpacity
                      key={key}
                      style={[styles.topicChip, selectedTopic === key && styles.topicChipActive]}
                      onPress={() => setSelectedTopic(key)}
                    >
                      <Text style={styles.topicChipEmoji}>{item.icon}</Text>
                      <Text style={[styles.topicChipText, selectedTopic === key && styles.topicChipTextActive]}>
                        {item.title.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Guide Card */}
                {FIRST_AID_GUIDES[selectedTopic] && (
                  <View style={styles.guideCard}>
                    <View style={styles.guideHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.guideTitle}>{FIRST_AID_GUIDES[selectedTopic].title}</Text>
                        <Text style={styles.guideAlert}>CRITICAL EMERGENCY PROTOCOL</Text>
                      </View>
                      <TouchableOpacity style={styles.audioBtn} onPress={toggleTopicAudio}>
                        {isPlayingAudio ? <VolumeX size={18} color="#DC2626" /> : <Volume2 size={18} color="#047857" />}
                        <Text style={[styles.audioBtnText, isPlayingAudio && { color: '#DC2626' }]}>
                          {isPlayingAudio ? 'Stop' : 'Listen'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.stepsList}>
                      {FIRST_AID_GUIDES[selectedTopic].steps.map((step, idx) => (
                        <View key={idx} style={styles.stepRow}>
                          <View style={styles.stepNumCircle}>
                            <Text style={styles.stepNumText}>{idx + 1}</Text>
                          </View>
                          <Text style={styles.stepDesc}>{step}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* 1-Tap National Emergency Dialers */}
            <Text style={styles.sosSectionHeader}>National Emergency Hotlines / आपातकालीन नंबर</Text>
            <View style={styles.dialerGrid}>
              <TouchableOpacity
                style={[styles.dialerCard, { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }]}
                onPress={() => handleCall('108', 'Free National Ambulance')}
                activeOpacity={0.85}
              >
                <View style={[styles.dialerIconCircle, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={{ fontSize: 20 }}>🚑</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dialerNumber}>108</Text>
                  <Text style={styles.dialerLabel}>Ambulance (एम्बुलेंस)</Text>
                </View>
                <PhoneCall size={18} color="#DC2626" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dialerCard, { borderColor: '#BAE6FD', backgroundColor: '#F0F9FF' }]}
                onPress={() => handleCall('112', 'All-India Police & Rescue')}
                activeOpacity={0.85}
              >
                <View style={[styles.dialerIconCircle, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={{ fontSize: 20 }}>🚨</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dialerNumber}>112</Text>
                  <Text style={styles.dialerLabel}>Police & Rescue (पुलिस)</Text>
                </View>
                <PhoneCall size={18} color="#0284C7" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dialerCard, { borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' }]}
                onPress={() => handleCall('104', 'State Health Helpline')}
                activeOpacity={0.85}
              >
                <View style={[styles.dialerIconCircle, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={{ fontSize: 20 }}>🩺</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dialerNumber}>104</Text>
                  <Text style={styles.dialerLabel}>Health Helpline (स्वास्थ्य)</Text>
                </View>
                <PhoneCall size={18} color="#16A34A" />
              </TouchableOpacity>
            </View>

            {/* Glowing Red Instant Distress Broadcast Button */}
            <TouchableOpacity
              style={styles.sendDistressBtn}
              onPress={handleBroadcastSos}
              activeOpacity={0.85}
            >
              <ShieldAlert size={20} color="#FFFFFF" />
              <Text style={styles.sendDistressText}>BROADCAST DISTRESS SIGNAL TO ASHA & FAMILY</Text>
            </TouchableOpacity>
          </ScrollView>
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: SPACING.md,
    paddingBottom: 30,
    ...SHADOWS.elevated,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sosHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sosIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  sosSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  modeTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeTabActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  modeTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  modeTabTextActive: {
    color: '#DC2626',
    fontWeight: '800',
  },
  modalScrollBody: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    gap: SPACING.md,
  },
  radarMapCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  radarMapCanvas: {
    height: 180,
    backgroundColor: '#0B1329',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLineH1: {
    position: 'absolute',
    top: '33%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  gridLineH2: {
    position: 'absolute',
    top: '66%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  gridLineV1: {
    position: 'absolute',
    left: '33%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  gridLineV2: {
    position: 'absolute',
    left: '66%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  routeDottedLine: {
    position: 'absolute',
    left: '25%',
    bottom: '25%',
    width: '35%',
    height: 2,
    backgroundColor: '#38BDF8',
    opacity: 0.8,
  },
  userRadarPin: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  userPulseRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  userPinCenter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userPinLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    marginTop: 3,
  },
  facilityMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerEmoji: {
    fontSize: 20,
  },
  markerTag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#475569',
    marginTop: 2,
  },
  markerTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E2E8F0',
  },
  mapStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
  },
  mapStatusVillage: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  mapStatusGps: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  etaBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  etaBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  spotlightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.subtle,
  },
  spotlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.xs,
  },
  spotlightIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  spotlightName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  spotlightStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
    marginTop: 1,
  },
  serviceChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginVertical: 6,
  },
  serviceChip: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  serviceChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  spotlightActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  callBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#047857',
    paddingVertical: 9,
    borderRadius: 8,
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  directionsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  directionsBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#DC2626',
    fontWeight: '800',
  },
  facilityListItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.subtle,
  },
  facListTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  facListIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  facListName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  facListAddress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  facListStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
    marginTop: 2,
  },
  facListDistCol: {
    alignItems: 'flex-end',
  },
  facListDistText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#DC2626',
  },
  facListEtaText: {
    fontSize: 10,
    color: '#64748B',
  },
  facListActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  facListCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#047857',
    paddingVertical: 7,
    borderRadius: 6,
  },
  facListCallText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  facListNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  facListNavText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6,
  },
  topicChipActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  topicChipEmoji: {
    fontSize: 14,
  },
  topicChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  topicChipTextActive: {
    color: '#DC2626',
    fontWeight: '800',
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    ...SHADOWS.subtle,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
    marginBottom: SPACING.sm,
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
  },
  guideAlert: {
    fontSize: 9,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  audioBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  stepsList: {
    gap: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  stepNumCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#DC2626',
  },
  stepDesc: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '500',
  },
  sosSectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: SPACING.xs,
  },
  dialerGrid: {
    gap: 8,
  },
  dialerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1.5,
  },
  dialerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialerNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  dialerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  sendDistressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: SPACING.xs,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendDistressText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
