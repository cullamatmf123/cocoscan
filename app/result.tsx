import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ResultParams {
  id?: string;
  fromHistory?: string; // '1' when opened from history
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

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams() as Partial<ResultParams>;
  const savedRef = useRef(false);
  const [tab, setTab] = useState<'status' | 'pest'>('status');

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

  // Save result to local history once when screen mounts with data
  useEffect(() => {
    const saveToHistory = async () => {
      if (savedRef.current) return; // avoid duplicates on rerenders
      // If opened from history or an id already exists, do not save again
      if (fromHistory === '1' || (id && id.length > 0)) return;
      if (!imageUri && !photoBase64) return;
      try {
        const key = 'scanHistory';
        const existing = await AsyncStorage.getItem(key);
        const list = existing ? JSON.parse(existing) : [];
        const entry = {
          id: `${Date.now()}`,
          timestamp: new Date().toISOString(),
          imageUri: imageUri || null,
          photoBase64: photoBase64 || null,
          prediction,
          confidence,
          details,
          recommendations,
          weather,
          soil,
          temperature,
          humidity,
          lightCondition,
        };
        // newest first
        const updated = [entry, ...list].slice(0, 100);
        await AsyncStorage.setItem(key, JSON.stringify(updated));
        savedRef.current = true;
      } catch (e) {
        console.warn('Failed to save history:', e);
      }
    };
    saveToHistory();
  }, [imageUri, photoBase64, prediction, confidence, details, recommendations, weather, soil, temperature, humidity, lightCondition]);
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

  const handlePesticidePress = () => {
    router.push({
      pathname: '/about',
      params: {
        tab: 'pesticide',
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
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={() => router.replace('/home')}
          accessibilityLabel="Open menu"
        >
          <View style={styles.menuLineDark} />
          <View style={styles.menuLineDark} />
          <View style={styles.menuLineDark} />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>COCOSCAN</Text>
        {/* spacer to balance layout */}
        <View style={{ width: 40 }} />
      </View>

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
                {/* Thumb */}
                <View style={{ marginRight: 10 }}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.statusThumb} />
                  ) : photoBase64 ? (
                    <Image source={{ uri: `data:image/jpeg;base64,${photoBase64}` }} style={styles.statusThumb} />
                  ) : (
                    <View style={[styles.statusThumb, { backgroundColor: '#E5E7EB' }]} />)
                  }
                </View>
                {/* Right content */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.statusTitle}>AI : {prediction?.toLowerCase() === 'healthy' ? 'Healthy' : 'Pest Detected'}</Text>
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
                  <Text style={styles.sectionTitle}>Prevention & Control</Text>
                  <TouchableOpacity onPress={handlePreventionPress} accessibilityLabel="Open Prevention & Control details" activeOpacity={0.8}>
                    <Text style={styles.sectionChevron}>›</Text>
                  </TouchableOpacity>
                </View>
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
              </View>

              {/* Recommended Pesticides (images + names only) */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Recommended Pesticides</Text>
                  <TouchableOpacity onPress={() => router.push('/pesticides')} accessibilityLabel="Open full pesticide recommendations" activeOpacity={0.8}>
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
            </>
          )}

          {/* Pest Info tab content */}
          {tab === 'pest' && (
            <>
              <View style={styles.greenCardAlt}>
                <Text style={styles.greenDescTitle}>Coconut Rhinoceros Beetle</Text>
                <Text style={styles.greenDescSub}>Oryctes Rhinoceros</Text>
                <Text style={styles.greenDescText}>
                  A destructive coconut pest beetle that bores into the crowns and trunks of palm trees,
                  causing severe damage and reduced yield.
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.greenCard, { flex: 1 }]}> 
                  <Text style={styles.greenListTitle}>Signs</Text>
                  <Text style={styles.greenListItem}>• V-shaped cuts on fronds</Text>
                  <Text style={styles.greenListItem}>• Triangular leaf notches</Text>
                  <Text style={styles.greenListItem}>• Bore holes in crown</Text>
                </View>
                <View style={[styles.greenCard, { flex: 1 }]}> 
                  <Text style={styles.greenListTitle}>Symptoms</Text>
                  <Text style={styles.greenListItem}>• Stunted or deformed fronds</Text>
                  <Text style={styles.greenListItem}>• Yellowing of emerging leaf</Text>
                  <Text style={styles.greenListItem}>• Possible death from repeated attack</Text>
                </View>
              </View>
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

          
        </View>

        {/* Scan Again button (kept) */}
        <View style={{ paddingHorizontal: 16, marginTop: 8, marginBottom: 56 }}>
          <TouchableOpacity style={styles.scanAgainBtn} onPress={() => router.replace('/camera')} accessibilityLabel="Scan Again">
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>

        {/* Footer navigation */}
        <View style={styles.footerBar}>
          <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} accessibilityLabel="Go to Home">
            <Feather name="home" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/camera')} accessibilityLabel="Open Camera">
            <Feather name="camera" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/history')} accessibilityLabel="View History">
            <Feather name="clock" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/profile')} accessibilityLabel="Open Profile">
            <Feather name="user" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBar: {
    height: 56,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  hamburger: { padding: 8 },
  menuLineDark: {
    width: 24,
    height: 3,
    backgroundColor: '#0F3D1E',
    marginVertical: 2,
    borderRadius: 2,
  },
  brandTitle: {
    color: '#0F3D1E',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tabRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  tabText: { color: '#6B7280', fontWeight: '700' },
  tabTextActive: { color: '#0F3D1E', fontWeight: '900' },
  tabUnderline: { height: 3, backgroundColor: '#0F3D1E', width: 40, borderRadius: 2, marginTop: 4 },
  statusDateHeader: { color: '#111827', fontWeight: '900', marginBottom: 8, marginTop: 4 },
  statusCard: { backgroundColor: '#CFE6D2', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusThumb: { width: 56, height: 56, borderRadius: 8 },
  statusTitle: { color: '#0F3D1E', fontWeight: '900', marginBottom: 6 },
  statusChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 2 },
  statusChipText: { color: '#0F3D1E', fontSize: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2d5a3d',
    marginBottom: 16,
    textAlign: 'center',
  },
  imageStrip: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  stripItem: { flex: 1, height: 120, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f0f2f0' },
  stripItemMiddle: { marginHorizontal: 2 },
  imageFrame: { width: '100%', height: 240, backgroundColor: '#f0f2f0', borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  stripImage: { width: '100%', height: '100%' },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
  },
  chipText: {
    color: '#2d5a3d',
    fontWeight: '600',
    fontSize: 12,
  },
  chipHealthy: {
    backgroundColor: '#E6F4EA',
  },
  chipWarn: {
    backgroundColor: '#FFF1F0',
  },
  greenCardAlt: { backgroundColor: '#DFF3E2', borderRadius: 12, padding: 12, marginBottom: 10 },
  greenDescTitle: { color: '#0F3D1E', fontWeight: '900', fontSize: 16 },
  greenDescSub: { color: '#0F3D1E', fontStyle: 'italic', marginTop: 2 },
  greenDescText: { color: '#0F3D1E', fontSize: 12, lineHeight: 18, marginTop: 8 },
  greenCard: { backgroundColor: '#DFF3E2', borderRadius: 10, padding: 12, marginBottom: 10 },
  greenTitle: { color: '#0F3D1E', fontWeight: '900', fontSize: 14 },
  greenSub: { color: '#0F3D1E', fontStyle: 'italic', fontSize: 12 },
  greenSmall: { color: '#0F3D1E', fontSize: 11, marginTop: 4 },
  greenListTitle: { color: '#0F3D1E', fontWeight: '900', marginBottom: 4 },
  greenListItem: { color: '#0F3D1E', fontSize: 12, lineHeight: 18 },
  pestImg: { width: 140, height: 90, borderRadius: 10, marginRight: 8, backgroundColor: '#F3F4F6' },
  buttonsCol: { gap: 12 },
  btnShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  primaryBtn: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#2d5a3d',
    fontWeight: '800',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: '#2d5a3d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  ghostBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  ghostBtnText: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 16,
  },
  resultTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 4 },
  scientificName: { fontSize: 12, fontStyle: 'italic', color: '#374151', marginBottom: 10 },
  sectionCard: { backgroundColor: '#DFF3E2', borderRadius: 10, padding: 12, marginBottom: 10 },
  sectionTitle: { fontWeight: '800', color: '#111827', marginBottom: 6 },
  sectionText: { color: '#111827', fontSize: 13, lineHeight: 18 },
  bullet: { color: '#111827', fontSize: 13, lineHeight: 18 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionChevron: { fontSize: 22, fontWeight: '900', color: '#111827', paddingHorizontal: 6 },
  scanAgainBtn: { backgroundColor: '#2d5a3d', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  scanAgainText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  recTile: { width: 160, marginRight: 10 },
  recImage: { width: 160, height: 100, borderRadius: 10, backgroundColor: '#F3F4F6' },
  recCaption: { fontSize: 12, color: '#111827', marginTop: 6 },
  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'nowrap',
    zIndex: 10,
  },
  footerItem: { flex: 1, alignItems: 'center' },
});