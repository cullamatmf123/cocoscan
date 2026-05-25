import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
interface ResultParams {
  imageUri?: string;
  photoBase64?: string;
  prediction?: string;
  confidence?: string;
  details?: string;
  recommendations?: string;
  weather?: string;
  soil?: string;
  temperature?: string;
  humidity?: string;
  lightCondition?: string;
}

type CocoClass =
  | 'unspecified'
  | 'infested by CRB'
  | 'infestation from other pest'
  | 'not infested';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams() as Partial<ResultParams>;
  const [tab, setTab] = useState<'status' | 'pest'>('status');
  const [menuVisible, setMenuVisible] = useState(false);

  const {
    imageUri,
    photoBase64,
    prediction = 'Unknown',
    confidence = '0',
    details = '',
    recommendations = 'No specific recommendations available.',
    weather = 'Not specified',
    soil = 'Not specified',
    temperature = 'Not specified',
    humidity = 'Not specified',
    lightCondition = 'Not specified'
  } = params;

  useEffect(() => {
    console.log('Result screen params:', params);
    
    if (!imageUri && !photoBase64) {
      Alert.alert('No Image', 'No image data available. Please try again.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [imageUri, photoBase64]);

  // Normalize incoming prediction string to CocoClass
  const resultClass: CocoClass = React.useMemo(() => {
    const p = (prediction || '').toLowerCase().trim();
    if (!p) return 'unspecified';
    if (p === 'infested by CRB' || p.includes('crb') || p.includes('oryctes') || p.includes('rhinoceros')) return 'infested by CRB';
    if (p === 'infestation from other pest' || p.includes('infestation from other pest')) return 'infestation from other pest';
    if (p === 'not infested' || p.includes('not infested')) return 'not infested';
    return 'unspecified';
  }, [prediction]);

  // Human-readable label
  const displayPrediction = React.useMemo((): string => {
    switch (resultClass) {
      case 'not infested':            return 'Not Infested';
      case 'infested by CRB':    return 'Infested by CRB – Signs & Symptoms Detected';
      case 'infestation from other pest':
      case 'unspecified':
      default:                   return 'Other Damage or Abnormalities';
    }
  }, [resultClass]);

  // Status color per class
  const statusColor = React.useMemo((): string => {
    switch (resultClass) {
      case 'not infested':            return '#4CAF50';
      case 'infested by CRB':    return '#F44336';
      case 'infestation from other pest':
      case 'unspecified':
      default:                   return '#F39C12';
    }
  }, [resultClass]);

  // Status emoji + label
  const statusLabel = React.useMemo((): string => {
    switch (resultClass) {
      case 'not infested':            return '✅ Not Infested';
      case 'infested by CRB':    return '❌ Infested by CRB';
      case 'infestation from other pest':
      case 'unspecified':
      default:                   return 'Other Damage or Abnormalities';
    }
  }, [resultClass]);

  const isHealthy    = resultClass === 'not infested';
  const isUnspecified = resultClass === 'unspecified' || resultClass === 'infestation from other pest';
  const isCrbRelated = resultClass === 'infested by CRB';
  const needsAction  = !isHealthy && !isUnspecified;

  const handleAboutPress = () => {
    router.push({
      pathname: '/about',
      params: {
        tab: 'overview',
        imageUri,
        photoBase64,
        prediction,
        details,
        recommendations,
      },
    });
  };

  const handlePreventionPress = () => {
    router.push({
      pathname: '/prevention-control',
      params: {
        imageUri,
        photoBase64,
        prediction,
        details,
        recommendations,
      },
    });
  };

  // ── Pest Info tab helpers ────────────────────────────────────────────────

  const pestInfoTitle = React.useMemo((): string => {
    switch (resultClass) {
      case 'infested by CRB':    return 'Infested by CRB – Signs & Symptoms';
      case 'not infested':            return 'No Pest or Disease Detected';
      case 'infestation from other pest':
      case 'unspecified':
      default:                   return 'Not a Coconut Issue';
    }
  }, [resultClass]);

  const pestInfoSubtitle = React.useMemo((): string | null => {
    switch (resultClass) {
      case 'infested by CRB':    return 'Oryctes rhinoceros – infestation damage';
      default:                   return null;
    }
  }, [resultClass]);

  const pestInfoDesc = React.useMemo((): string | null => {
    switch (resultClass) {
      case 'infested by CRB':
        return 'The scan detected visible signs and symptoms of CRB infestation on the coconut palm. The Oryctes rhinoceros beetle itself was not visible, but characteristic damage patterns were identified.';
      case 'infestation from other pest':
      case 'unspecified':
        return 'The scanned image does not appear to be a coconut tree or any related coconut pest/disease.';
      default:
        return null;
    }
  }, [resultClass]);

  const signsItems = React.useMemo((): string[] => {
    switch (resultClass) {
      case 'infested by CRB':
        return [
          '• V-shaped cuts on fronds',
          '• Triangular leaf notches',
          '• Bore holes in the crown',
          '• Sawdust-like frass near entry points',
        ];
      default:
        return [];
    }
  }, [resultClass]);

  const symptomsItems = React.useMemo((): string[] => {
    switch (resultClass) {
      case 'infested by CRB':
        return [
          '• Stunted or deformed emerging fronds',
          '• Yellowing of newly opened leaves',
          '• Reduced nut production',
          '• Possible death from repeated attack',
        ];
      default:
        return [];
    }
  }, [resultClass]);

  // Section title helpers
  const preventionTitle = React.useMemo((): string => {
    if (isHealthy) return 'Prevention to Maintain Healthy Coconut';
    if (isUnspecified) return 'No Prevention & Control Needed';
    return 'Prevention & Control';
  }, [resultClass, isHealthy, isUnspecified]);

  const pesticidesTitle = React.useMemo((): string => {
    if (isHealthy) return 'No Recommended Pesticides';
    if (isUnspecified) return 'No Recommended Pesticides';
    return 'Recommended Pesticides';
  }, [resultClass, isHealthy, isUnspecified]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={() => setMenuVisible(true)}
          accessibilityLabel="Open menu"
        >
          <View style={styles.menuLineDark} />
          <View style={styles.menuLineDark} />
          <View style={styles.menuLineDark} />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>COCOSCAN</Text>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🌴</Text>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuBackdrop}>
          <TouchableOpacity style={styles.menuBackdropTouch} activeOpacity={1} onPress={() => setMenuVisible(false)} />
          <View style={styles.menuSheet}>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/user'); }}>
              <Ionicons name="information-circle-outline" size={20} color="#1F3D2A" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Result</Text>

          {/* Single image */}
          <View style={styles.imageFrame}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : photoBase64 ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${photoBase64}` }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity style={styles.tabItem} onPress={() => setTab('status')}>
              <Text style={tab === 'status' ? styles.tabTextActive : styles.tabText}>Status</Text>
              {tab === 'status' && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => setTab('pest')}>
              <Text style={tab === 'pest' ? styles.tabTextActive : styles.tabText}>Pest Info</Text>
              {tab === 'pest' && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          </View>

          {/* ── Status Tab ── */}
          {tab === 'status' && (
            <>
              {/* Date header */}
              <Text style={styles.statusDateHeader}>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: '2-digit' })}</Text>

              {/* Status card */}
              <View style={styles.statusCard}>
                <View style={{ marginRight: 10 }}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.statusThumb} />
                  ) : photoBase64 ? (
                    <Image source={{ uri: `data:image/jpeg;base64,${photoBase64}` }} style={styles.statusThumb} />
                  ) : (
                    <View style={[styles.statusThumb, { backgroundColor: '#E5E7EB' }]} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statusTitle, { color: statusColor }]}>
                    {statusLabel}
                  </Text>
                  <Text style={styles.statusSubtitle}>{displayPrediction}</Text>
                  <View style={styles.statusChipsRow}>
                    <Text style={styles.statusChipText}>🌤️ {weather || 'Not specified'}</Text>
                    <Text style={styles.statusChipText}>🌡️ {temperature || 'Not specified'}°C</Text>
                    <Text style={styles.statusChipText}>💧 {humidity || 'Not specified'}%</Text>
                  </View>
                  <Text style={styles.statusChipText}>🌱 {soil || 'Not specified'}</Text>
                </View>
              </View>

              {/* Prevention & Control — hidden for unspecified and unhealthy */}
              {(isHealthy || isCrbRelated) && (
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>{preventionTitle}</Text>
                    <TouchableOpacity onPress={handlePreventionPress} accessibilityLabel="Open Prevention & Control details" activeOpacity={0.8}>
                      <Text style={styles.sectionChevron}>›</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Healthy: tips to keep it healthy */}
                  {isHealthy && (
                    <>
                      <Text style={[styles.sectionText, { marginTop: 6, lineHeight: 20 }]}>
                        Your coconut palm appears healthy! Follow these practices to keep it that way:
                      </Text>
                      <View style={{ gap: 6, marginTop: 6 }}>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Regularly inspect the crown and fronds for early signs of pest activity.</Text></View>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Maintain proper fertilization and irrigation for optimal palm vigor.</Text></View>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Remove and dispose of dead organic matter around the base to prevent breeding sites.</Text></View>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Use pheromone traps nearby to monitor and deter Oryctes rhinoceros beetles.</Text></View>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Keep the plantation clean and well-drained to reduce disease and pest risk.</Text></View>
                      </View>
                    </>
                  )}

                  {/* CRB-related: full prevention & control bullets */}
                  {isCrbRelated && (
                    <>
                      <Text style={[styles.sectionText, { fontWeight: '800', marginTop: 6 }]}>Prevention</Text>
                      <View style={{ gap: 6 }}>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Maintain field sanitation by removing and properly disposing of decaying logs, stumps, and organic debris that serve as breeding sites.</Text></View>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Use pheromone traps (Oryctalure) to attract and monitor adult beetle populations.</Text></View>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Set up log traps made from decomposing organic materials to lure and capture beetles.</Text></View>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Practice good plantation management, including proper fertilization, pruning, and drainage to keep trees healthy and resistant.</Text></View>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Regularly inspect young palms for early signs of beetle activity.</Text></View>
                      </View>
                      <Text style={[styles.sectionText, { fontWeight: '800', marginTop: 10 }]}>Control</Text>
                      <View style={{ gap: 6 }}>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Conduct manual removal of adult beetles from the crown and breeding sites.</Text></View>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Apply biological control agents, such as the fungus Metarhizium anisopliae or the Oryctes rhinoceros nudivirus (OrNV), to naturally suppress populations.</Text></View>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Use chemical control cautiously with recommended insecticides like lambda-cyhalothrin, imidacloprid, or chlorantraniliprole, following safety guidelines.</Text></View>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Adopt an Integrated Pest Management (IPM) approach by combining biological, cultural, and chemical methods for long-term effectiveness.</Text></View>
                        <View style={styles.bulletCard}><Text style={styles.bullet}>• Monitor regularly after treatment to ensure the pest population remains under control.</Text></View>
                      </View>
                    </>
                  )}
                </View>
              )}

              {/* Recommended Pesticides — only for CRB-related */}
              {isCrbRelated && (
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>{pesticidesTitle}</Text>
                    <TouchableOpacity
                      onPress={() => router.push('/pesticides')}
                      accessibilityLabel="Open full pesticide recommendations"
                      activeOpacity={0.8}
                    >
                      <Text style={styles.sectionChevron}>›</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                    <View style={styles.recTile}>
                      <Image source={require('../assets/images/design/Karate-front.webp')} style={styles.recImage} />
                      <Text style={styles.recCaption}>Lambda-cyhalothrin (Karate)</Text>
                    </View>
                    <View style={styles.recTile}>
                      <Image source={require('../assets/images/design/imidacloprid.png')} style={styles.recImage} />
                      <Text style={styles.recCaption}>Imidacloprid</Text>
                    </View>
                    <View style={styles.recTile}>
                      <Image source={require('../assets/images/design/Emamectin-Benzoate.webp')} style={styles.recImage} />
                      <Text style={styles.recCaption}>Emamectin Benzoate</Text>
                    </View>
                    <View style={styles.recTile}>
                      <Image source={require('../assets/images/design/chloros-chlorantraniliprole.webp')} style={styles.recImage} />
                      <Text style={styles.recCaption}>Chlorantraniliprole</Text>
                    </View>
                  </ScrollView>
                </View>
              )}

              {/* Unspecified: not identified card */}
              {isUnspecified && (
                <View style={styles.unspecifiedCard}>
                  <Text style={styles.unspecifiedIcon}>🔍</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.unspecifiedTitle}>Image Not Identified</Text>
                    <Text style={styles.unspecifiedText}>
                      The scanned image was not recognized as a coconut tree or any related pest/disease. This may be an unrelated object. Please try again with a clear photo of a coconut palm for accurate results.
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}

          {/* ── Pest Info Tab ── */}
          {tab === 'pest' && (
            <>
              <View style={styles.greenCardAlt}>
                <Text style={styles.greenDescTitle}>{pestInfoTitle}</Text>
                {pestInfoSubtitle && (
                  <Text style={styles.greenDescSub}>{pestInfoSubtitle}</Text>
                )}
                {pestInfoDesc && (
                  <Text style={styles.greenDescText}>{pestInfoDesc}</Text>
                )}
              </View>

              {/* Signs & Symptoms — only when there's data */}
              {needsAction && (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={[styles.greenCard, { flex: 1 }]}>
                    <Text style={styles.greenListTitle}>Signs</Text>
                    {signsItems.map((item, i) => (
                      <Text key={i} style={styles.greenListItem}>{item}</Text>
                    ))}
                  </View>
                  <View style={[styles.greenCard, { flex: 1 }]}>
                    <Text style={styles.greenListTitle}>Symptoms</Text>
                    {symptomsItems.map((item, i) => (
                      <Text key={i} style={styles.greenListItem}>{item}</Text>
                    ))}
                  </View>
                </View>
              )}

              {/* Images — only for CRB-related classes */}
              {isCrbRelated && (
                <>
                  <View style={[styles.sectionHeaderRow, { marginTop: 10 }]}>
                    <Text style={styles.sectionTitle}>Images</Text>
                    <TouchableOpacity onPress={handleAboutPress} accessibilityLabel="View more images" activeOpacity={0.8}>
                      <Text style={styles.sectionChevron}>›</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                    <Image source={require('../assets/images/design/CRB.jpg')} style={styles.pestImg} />
                    <Image source={require('../assets/images/design/crb(2).png')} style={styles.pestImg} />
                    <Image source={require('../assets/images/design/crb(3).png')} style={styles.pestImg} />
                  </ScrollView>
                </>
              )}
            </>
          )}
        </View>

        {/* Scan Again button */}
        <View style={{ paddingHorizontal: 0, marginTop: 8, marginBottom: 20 }}>
          <TouchableOpacity style={styles.scanAgainBtn} onPress={() => router.replace('/guest-camera')} accessibilityLabel="Scan Again">
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/guest-homepage')} activeOpacity={0.7} accessibilityLabel="Go to Home">
          <Feather name="home" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/guest-camera')} activeOpacity={0.7} accessibilityLabel="Open Camera">
          <Feather name="camera" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/guest-profile')} activeOpacity={0.7} accessibilityLabel="Open Profile">
          <Feather name="user" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  /* App Bar */
  appBar: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
  },
  hamburger: {
    padding: 8,
    borderRadius: 12,
  },
  menuLineDark: {
    width: 26,
    height: 3,
    backgroundColor: '#0F3D1E',
    marginVertical: 3,
    borderRadius: 2
  },
  brandTitle: {
    color: '#0F3D1E',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F4D36',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F2C200',
    shadowColor: '#F2C200',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  logoEmoji: { 
    fontSize: 20 
  },
  
  /* Menu Modal */
  menuBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)' 
  },
  menuBackdropTouch: {
    ...StyleSheet.absoluteFillObject as any,
  },
  menuSheet: {
    position: 'absolute',
    top: 72,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    width: 240,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  menuIcon: {
    marginRight: 12
  },
  menuItemText: {
    color: '#1F3D2A',
    fontSize: 16,
    fontWeight: '600'
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 12,
  },
  
  /* Content */
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F3D1E',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  imageFrame: { 
    width: '100%', 
    height: 240, 
    backgroundColor: '#F9FAFB', 
    borderRadius: 12, 
    overflow: 'hidden', 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  
  /* Tabs */
  tabRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  tabItem: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 10 
  },
  tabText: { 
    color: '#6B7280', 
    fontWeight: '700',
    fontSize: 15,
  },
  tabTextActive: { 
    color: '#0F3D1E', 
    fontWeight: '900',
    fontSize: 15,
  },
  tabUnderline: { 
    height: 3, 
    backgroundColor: '#0F3D1E', 
    width: 60, 
    borderRadius: 2, 
    marginTop: 8,
    position: 'absolute',
    bottom: -2,
  },
  
  /* Status Tab */
  statusDateHeader: { 
    color: '#111827', 
    fontWeight: '800', 
    marginBottom: 10, 
    marginTop: 4,
    fontSize: 14,
  },
  statusCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  statusThumb: { 
    width: 60, 
    height: 60, 
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusTitle: { 
    fontWeight: '900', 
    marginBottom: 2,
    fontSize: 15,
  },
  statusSubtitle: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 8,
  },
  statusChipsRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginBottom: 6 
  },
  statusChipText: { 
    color: '#0F3D1E', 
    fontSize: 12,
    fontWeight: '600',
  },
  
  /* Section Cards */
  sectionCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  sectionTitle: { 
    fontWeight: '800', 
    color: '#0F3D1E', 
    marginBottom: 0,
    fontSize: 15,
  },
  sectionText: { 
    color: '#1F3D2A', 
    fontSize: 13, 
    lineHeight: 20 
  },
  bullet: { 
    color: '#1F3D2A', 
    fontSize: 13, 
    lineHeight: 20 
  },
  bulletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sectionHeaderRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  sectionChevron: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#0F3D1E', 
    paddingHorizontal: 6 
  },
  
  /* Recommended Pesticides */
  recTile: { 
    width: 140, 
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recImage: { 
    width: '100%', 
    height: 90, 
    borderRadius: 8, 
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  recCaption: { 
    fontSize: 11, 
    color: '#111827', 
    fontWeight: '700',
    textAlign: 'center',
  },
  
  /* Pest Info Tab */
  greenCardAlt: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  greenDescTitle: { 
    color: '#0F3D1E', 
    fontWeight: '900', 
    fontSize: 16 
  },
  greenDescSub: { 
    color: '#0F3D1E', 
    fontStyle: 'italic', 
    marginTop: 4,
    fontSize: 13,
  },
  greenDescText: { 
    color: '#1F3D2A', 
    fontSize: 13, 
    lineHeight: 20, 
    marginTop: 8 
  },
  greenCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  greenListTitle: { 
    color: '#0F3D1E', 
    fontWeight: '900', 
    marginBottom: 8,
    fontSize: 14,
  },
  greenListItem: { 
    color: '#1F3D2A', 
    fontSize: 12, 
    lineHeight: 18,
    marginBottom: 4,
  },
  pestImg: { 
    width: 140, 
    height: 90, 
    borderRadius: 10, 
    marginRight: 8, 
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  /* Scan Again Button */
  scanAgainBtn: { 
    backgroundColor: '#3F7A4A', 
    paddingVertical: 14, 
    borderRadius: 24, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  scanAgainText: { 
    color: '#FFFFFF', 
    fontWeight: '800', 
    fontSize: 16 
  },
  
  /* Disclaimer Note */
  disclaimerCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    borderWidth: 1,
    borderColor: '#FDE68A',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  disclaimerIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  disclaimerText: {
    flex: 1,
    color: '#78350F',
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  disclaimerBold: {
    fontWeight: '800',
    fontStyle: 'normal',
  },

  /* Unspecified Not Identified card */
  unspecifiedCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6B7280',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  unspecifiedIcon: {
    fontSize: 22,
    marginTop: 1,
  },
  unspecifiedTitle: {
    color: '#1F2937',
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 4,
  },
  unspecifiedText: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 20,
  },

  /* Footer */
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  footerLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
  },
});