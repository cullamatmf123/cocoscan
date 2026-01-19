import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { addHistoryItem } from '../services/historyService';

interface ResultParams {
  id?: string;
  fromHistory?: string;
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

type ResultClass = 'healthy' | 'unhealthy' | 'beetle' | 'unknown';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams() as Partial<ResultParams>;
  const savedRef = useRef(false);
  const [tab, setTab] = useState<'status' | 'pest'>('status');
  const [menuVisible, setMenuVisible] = useState(false);

  const {
    id,
    fromHistory,
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

  const resultClass: ResultClass = React.useMemo(() => {
    const p = (prediction || '').toLowerCase();

    if (!p) return 'unknown';
    if (p.includes('oryctes') || p.includes('beetle')) return 'beetle';
    if (p.includes('unhealthy') || p.includes('damage')) return 'unhealthy';
    if (p.includes('healthy')) return 'healthy';
    return 'unknown';
  }, [prediction]);

  const displayPrediction = React.useMemo(() => {
    switch (resultClass) {
      case 'healthy':
        return 'Healthy';
      case 'unhealthy':
        return 'Unhealthy – Damage detected';
      case 'beetle':
        return 'Oryctes Rhinoceros detected';
      default:
        return prediction || 'Unknown';
    }
  }, [prediction, resultClass]);

  const isHealthy = resultClass === 'healthy';

  useEffect(() => {
    const saveToHistory = async () => {
      if (savedRef.current) return;
      if (fromHistory === '1' || (id && id.length > 0)) return;
      if (!imageUri && !photoBase64) return;
      
      try {
        await addHistoryItem({
          imageUri: imageUri || null,
          photoBase64: photoBase64 || null,
          prediction: displayPrediction || 'Unknown',
          confidence: confidence || '0',
          details: details || '',
          recommendations: recommendations || 'No specific recommendations available.',
          weather: weather || 'Not specified',
          soil: soil || 'Not specified',
          temperature: temperature ? parseFloat(temperature) : undefined,
          humidity: humidity ? parseFloat(humidity) : undefined,
          lightCondition: lightCondition || 'Not specified'
        });
        
        savedRef.current = true;
      } catch (error) {
        console.warn('Failed to save to history:', error);
        Alert.alert(
          'Save Failed', 
          'Could not save to history. Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
      }
    };
    
    saveToHistory();
  }, [id, fromHistory, imageUri, photoBase64, prediction, confidence, details, recommendations, weather, soil, temperature, humidity, lightCondition, displayPrediction]);

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
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/about-app'); }}>
              <Ionicons name="information-circle-outline" size={20} color="#1F3D2A" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.replace('/'); }}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" style={styles.menuIcon} />
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Logout</Text>
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

          {/* Status tab content */}
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
                  <Text style={styles.statusTitle}>AI : {displayPrediction}</Text>
                  <View style={styles.statusChipsRow}>
                    <Text style={styles.statusChipText}>🌤️ {weather || 'Not specified'}</Text>
                    <Text style={styles.statusChipText}>🌡️ {temperature || 'Not specified'}°C</Text>
                    <Text style={styles.statusChipText}>💧 {humidity || 'Not specified'}%</Text>
                  </View>
                  <Text style={styles.statusChipText}>🌱 {soil || 'Not specified'}</Text>
                </View>
              </View>

              <View style={styles.sectionCard}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>
                    {isHealthy ? 'No Prevention & Control' : 'Prevention & Control'}
                  </Text>
                  <TouchableOpacity onPress={handlePreventionPress} accessibilityLabel="Open Prevention & Control details" activeOpacity={0.8}>
                    <Text style={styles.sectionChevron}>›</Text>
                  </TouchableOpacity>
                </View>
                {!isHealthy && (
                  <>
                    <Text style={[styles.sectionText, { fontWeight: '800', marginTop: 6 }]}>Prevention</Text>
                    <View style={{ gap: 6 }}>
                      <Text style={styles.bullet}>• Maintain field sanitation by removing and properly disposing of decaying logs, stumps, and organic debris that serve as breeding sites.</Text>
                      <Text style={styles.bullet}>• Use pheromone traps (Oryctalure) to attract and monitor adult beetle populations.</Text>
                      <Text style={styles.bullet}>• Set up log traps made from decomposing organic materials to lure and capture beetles.</Text>
                      <Text style={styles.bullet}>• Practice good plantation management, including proper fertilization, pruning, and drainage to keep trees healthy and resistant.</Text>
                      <Text style={styles.bullet}>• Regularly inspect young palms for early signs of beetle activity.</Text>
                    </View>
                    <Text style={[styles.sectionText, { fontWeight: '800', marginTop: 10 }]}>Control</Text>
                    <View style={{ gap: 6 }}>
                      <Text style={styles.bullet}>• Conduct manual removal of adult beetles from the crown and breeding sites.</Text>
                      <Text style={styles.bullet}>• Apply biological control agents, such as the fungus Metarhizium anisopliae or the Oryctes rhinoceros nudivirus (OrNV), to naturally suppress populations.</Text>
                      <Text style={styles.bullet}>• Use chemical control cautiously with recommended insecticides like lambda-cyhalothrin, imidacloprid, or chlorantraniliprole, following safety guidelines.</Text>
                      <Text style={styles.bullet}>• Adopt an Integrated Pest Management (IPM) approach by combining biological, cultural, and chemical methods for long-term effectiveness.</Text>
                      <Text style={styles.bullet}>• Monitor regularly after treatment to ensure the pest population remains under control.</Text>
                    </View>
                  </>
                )}
              </View>

              {/* Recommended Pesticides */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>
                    {isHealthy ? 'No Recommended Pesticides' : 'Recommended Pesticides'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/pesticides')}
                    accessibilityLabel="Open full pesticide recommendations"
                    activeOpacity={0.8}
                  >
                    <Text style={styles.sectionChevron}>›</Text>
                  </TouchableOpacity>
                </View>
                {!isHealthy && (
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
                )}
              </View>
            </>
          )}

          {/* Pest Info tab content */}
          {tab === 'pest' && (
            <>
              <View style={styles.greenCardAlt}>
                <Text style={styles.greenDescTitle}>
                  {resultClass === 'healthy'
                    ? 'No Coconut Rhinoceros Beetle'
                    : 'Coconut Rhinoceros Beetle'}
                </Text>
                {resultClass !== 'healthy' && (
                  <>
                    <Text style={styles.greenDescSub}>Oryctes Rhinoceros</Text>
                    <Text style={styles.greenDescText}>
                      {resultClass === 'beetle'
                        ? 'An Oryctes rhinoceros beetle was detected on the coconut palm in this scan.'
                        : 'The model detected unhealthy regions on the coconut palm consistent with stress, disease, or damage. The beetle itself was not clearly visible.'}
                    </Text>
                  </>
                )}
              </View>
              
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.greenCard, { flex: 1 }]}> 
                  <Text style={styles.greenListTitle}>
                    {isHealthy ? 'No Sign' : 'Signs'}
                  </Text>
                  {!isHealthy && (
                    <>
                      <Text style={styles.greenListItem}>• V-shaped cuts on fronds</Text>
                      <Text style={styles.greenListItem}>• Triangular leaf notches</Text>
                      <Text style={styles.greenListItem}>• Bore holes in crown</Text>
                    </>
                  )}
                </View>
                <View style={[styles.greenCard, { flex: 1 }]}> 
                  <Text style={styles.greenListTitle}>
                    {isHealthy ? 'No Symptoms' : 'Symptoms'}
                  </Text>
                  {!isHealthy && (
                    <>
                      <Text style={styles.greenListItem}>• Stunted or deformed fronds</Text>
                      <Text style={styles.greenListItem}>• Yellowing of emerging leaf</Text>
                      <Text style={styles.greenListItem}>• Possible death from repeated attack</Text>
                    </>
                  )}
                </View>
              </View>

              {!isHealthy && (
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
          <TouchableOpacity style={styles.scanAgainBtn} onPress={() => router.replace('/camera')} accessibilityLabel="Scan Again">
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} activeOpacity={0.7} accessibilityLabel="Go to Home">
          <Feather name="home" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/camera')} activeOpacity={0.7} accessibilityLabel="Open Camera">
          <Feather name="camera" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/history')} activeOpacity={0.7} accessibilityLabel="View History">
          <Feather name="clock" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/profile')} activeOpacity={0.7} accessibilityLabel="Open Profile">
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
    backgroundColor: '#E8F5E9', 
    borderRadius: 12, 
    padding: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  statusThumb: { 
    width: 60, 
    height: 60, 
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusTitle: { 
    color: '#0F3D1E', 
    fontWeight: '900', 
    marginBottom: 8,
    fontSize: 15,
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
    backgroundColor: '#E8F5E9', 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
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
    backgroundColor: '#E8F5E9', 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
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
    backgroundColor: '#E8F5E9', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
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