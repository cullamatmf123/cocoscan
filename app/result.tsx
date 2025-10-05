import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
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
}

export default function ResultScreen() {
  const router = useRouter();
<<<<<<< HEAD
  const params = useLocalSearchParams() as Partial<ResultParams>;
  const savedRef = useRef(false);

=======
  const params = useLocalSearchParams() as ResultParams;
>>>>>>> d8cc992be317314bb0e0e71f26d51093f6704f01
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
    soil = 'Not specified'
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
  }, [imageUri, photoBase64, prediction, confidence, details, recommendations, weather, soil]);

  const handleAboutPress = () => {
    router.push({
      pathname: '/',
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

  const handleTreatmentPress = () => {
    router.push({
<<<<<<< HEAD
      pathname: '/about',
=======
      pathname: '/',
>>>>>>> d8cc992be317314bb0e0e71f26d51093f6704f01
      params: {
        tab: 'prevention',
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
        <View style={styles.logoRow}>
          <Text style={{ fontSize: 22, marginRight: 8 }}>🌴</Text>
          <Text style={styles.headerTitle}>COCOSCAN</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.replace('/home')} 
          accessibilityRole="button" 
          accessibilityLabel="Close and return to home"
        >
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Scan Result</Text>
          
          {/* Image */}
          <View style={styles.imageFrame}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="cover"
                onError={(e) => {
                  console.log('Image loading error:', e.nativeEvent.error);
                  if (!photoBase64) Alert.alert('Error', 'Failed to load image');
                }}
              />
            ) : photoBase64 ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${photoBase64}` }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>No image available</Text>
              </View>
            )}
          </View>

          {/* Info chips */}
          <View style={styles.chipsRow}>
            <View style={[
              styles.chip, 
              prediction?.toLowerCase() === 'healthy' ? styles.chipHealthy : styles.chipWarn
            ]}>
              <Text style={styles.chipText}>
                AI: {prediction?.toLowerCase() === 'healthy' ? 'Healthy' : 'Pest Detected'} ({confidence}%)
              </Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>🌤️ {weather}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>🌱 {soil}</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsCol}>
            <TouchableOpacity
              style={[styles.primaryBtn, styles.btnShadow]}
              activeOpacity={0.9}
              onPress={handleAboutPress}
            >
              <Text style={styles.primaryBtnText}>About Plant</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryBtn, styles.btnShadow]}
              activeOpacity={0.9}
              onPress={handleTreatmentPress}
            >
              <Text style={styles.secondaryBtnText}>Treatment & Control</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.ghostBtn]} 
              activeOpacity={0.9}
              onPress={handlePesticidePress}
            >
              <Text style={styles.ghostBtnText}>Pesticide Recommendation</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer actions */}
        <View style={styles.footerRow}>
          <TouchableOpacity 
            style={styles.footerBtn} 
            onPress={() => router.replace('/camera')}
          >
            <Text style={styles.footerBtnText}>Scan Again</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.footerBtn, styles.footerBtnAlt]} 
            onPress={() => router.replace('/home')}
          >
            <Text style={[styles.footerBtnText, styles.footerBtnTextAlt]}>Home</Text>
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
    backgroundColor: '#2d5a3d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  closeBtn: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 4,
  },
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
  imageFrame: {
    width: '100%',
    height: 240,
    backgroundColor: '#f0f2f0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
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
  buttonsCol: {
    gap: 12,
  },
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
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  footerBtn: {
    flex: 1,
    backgroundColor: '#2d5a3d',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  footerBtnAlt: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  footerBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  footerBtnTextAlt: {
    color: '#1f2937',
  },
});