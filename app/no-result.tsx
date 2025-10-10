import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NoResultParams {
  id?: string;
  fromHistory?: string;
  imageUri?: string;
  photoBase64?: string;
  prediction?: string;
  confidence?: string;
  details?: string;
  weather?: string;
  soil?: string;
  temperature?: string;
  humidity?: string;
  lightCondition?: string;
}

export default function NoResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams() as Partial<NoResultParams>;
  const savedRef = useRef(false);

  const {
    id,
    fromHistory,
    imageUri,
    photoBase64,
    prediction = 'Healthy',
    confidence = '0',
    weather = 'Not specified',
    soil = 'Not specified',
    temperature = 'Not specified',
    humidity = 'Not specified',
  } = params;

  useEffect(() => {
    if (!imageUri && !photoBase64) {
      Alert.alert('No Image', 'No image data available. Please try again.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [imageUri, photoBase64]);

  // Save a 'no pest' result to local history once
  useEffect(() => {
    const saveToHistory = async () => {
      try {
        if (savedRef.current) return;
        if (fromHistory === '1' || (id && id.length > 0)) return;
        if (!imageUri && !photoBase64) return;

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
          details: params.details || '',
          recommendations: '',
          weather,
          soil,
          temperature,
          humidity,
          lightCondition: params.lightCondition || 'Not specified',
        };
        const updated = [entry, ...list].slice(0, 100);
        await AsyncStorage.setItem(key, JSON.stringify(updated));
        savedRef.current = true;
      } catch (e) {
        console.warn('Failed to save history (no-result):', e);
      }
    };
    saveToHistory();
  }, [imageUri, photoBase64, prediction, confidence, weather, soil, temperature, humidity, params.details, params.lightCondition, fromHistory, id]);

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
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Result</Text>

          {/* Image */}
          <View style={styles.imageFrame}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            ) : photoBase64 ? (
              <Image source={{ uri: `data:image/jpeg;base64,${photoBase64}` }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
          </View>

          {/* Tabs mimic */}
          <View style={styles.tabRow}>
            <View style={styles.tabItem}>
              <Text style={styles.tabTextActive}>Status</Text>
              <View style={styles.tabUnderline} />
            </View>
            <View style={styles.tabItem}>
              <Text style={styles.tabText}>Pest Info</Text>
            </View>
          </View>

          {/* Status view */}
          <Text style={styles.statusDateHeader}>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: '2-digit' })}</Text>
          <View style={styles.statusCard}>
            {/* Thumb */}
            <View style={{ marginRight: 10 }}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.statusThumb} />
              ) : photoBase64 ? (
                <Image source={{ uri: `data:image/jpeg;base64,${photoBase64}` }} style={styles.statusThumb} />
              ) : (
                <View style={[styles.statusThumb, { backgroundColor: '#E5E7EB' }]} />
              )}
            </View>
            {/* Right content */}
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>AI : Healthy</Text>
              <View style={styles.statusChipsRow}>
                <Text style={styles.statusChipText}>🌤️ {weather || 'Not specified'}</Text>
                <Text style={styles.statusChipText}>🌡️ {temperature || 'Not specified'}°C</Text>
                <Text style={styles.statusChipText}>💧 {humidity || 'Not specified'}%</Text>
              </View>
              <Text style={styles.statusChipText}>🌱 {soil || 'Not specified'}</Text>
            </View>
          </View>

          <Text style={styles.emptyText}>No other data available</Text>
        </View>

      </ScrollView>
      {/* Bottom navigation (sticky at bottom) */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f7f7' },
  scrollContent: { padding: 16, paddingBottom: 24 },
  headerBar: { height: 56, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  hamburger: { padding: 8 },
  menuLineDark: { width: 24, height: 3, backgroundColor: '#0F3D1E', marginVertical: 2, borderRadius: 2 },
  brandTitle: { color: '#0F3D1E', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3, marginBottom: 20 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#2d5a3d', marginBottom: 16, textAlign: 'center' },
  imageFrame: { width: '100%', height: 240, backgroundColor: '#f0f2f0', borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
  tabRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  tabText: { color: '#6B7280', fontWeight: '700' },
  tabTextActive: { color: '#0F3D1E', fontWeight: '900' },
  tabUnderline: { height: 3, backgroundColor: '#0F3D1E', width: 40, borderRadius: 2, marginTop: 4 },
  greenCard: { backgroundColor: '#DFF3E2', borderRadius: 10, padding: 12, marginBottom: 10 },
  greenTitle: { color: '#0F3D1E', fontWeight: '900', fontSize: 14, textAlign: 'left' },
  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 28 },
  statusDateHeader: { color: '#111827', fontWeight: '900', marginBottom: 8, marginTop: 4 },
  statusCard: { backgroundColor: '#CFE6D2', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusThumb: { width: 56, height: 56, borderRadius: 8 },
  statusTitle: { color: '#0F3D1E', fontWeight: '900', marginBottom: 6 },
  statusChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 2 },
  statusChipText: { color: '#0F3D1E', fontSize: 12 },
  footerBar: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  footerItem: { flex: 1, alignItems: 'center' },
})
;
