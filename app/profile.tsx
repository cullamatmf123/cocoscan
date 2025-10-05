import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthService } from '../services/authService';

export default function ProfileScreen() {
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    const computeName = (email?: string | null, fallback?: string | null) => {
      if (fallback && fallback.trim()) return fallback.trim();
      if (!email) return '';
      const handle = email.split('@')[0] || '';
      const noTrailingDigits = handle.replace(/[0-9]+$/,'');
      const base = noTrailingDigits || handle;
      return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
    };
    const current = AuthService.getCurrentUser();
    setDisplayName(computeName(current?.email ?? null, current?.displayName ?? null));

    const unsub = AuthService.onAuthStateChanged((u) => {
      setDisplayName(computeName(u?.email ?? null, u?.displayName ?? null));
    });
    return () => unsub && unsub();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerWrap}>
        <View style={styles.headerBgPrimary} />
        <View style={styles.headerBgWave} />
        <TouchableOpacity onPress={() => router.replace('/home')} style={styles.backButton} accessibilityLabel="Back to home">
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My{"\n"}Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.sheet}>
          {/* Top card with avatar, name, id and rating */}
          <View style={styles.topCard}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Ionicons name="person-circle" size={64} color="#94A3B8" />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{displayName || 'User'}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Profile Details</Text>
          <View style={styles.tilesGroup}>
            <View style={styles.tilesRow}>
              <TouchableOpacity style={styles.tile} onPress={() => console.log('User pressed')} activeOpacity={0.8}>
                <Ionicons name="person-outline" size={26} color="#2D5A3D" />
                <Text style={styles.tileText}>User</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tile} onPress={() => router.push('/history')} activeOpacity={0.8}>
                <Ionicons name="time-outline" size={26} color="#2D5A3D" />
                <Text style={styles.tileText}>History</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tile} onPress={() => console.log('Feedback pressed')} activeOpacity={0.8}>
                <Ionicons name="chatbubble-ellipses-outline" size={26} color="#2D5A3D" />
                <Text style={styles.tileText}>Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>

          

          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#2D5A3D' },
  headerWrap: { height: 200, overflow: 'hidden', marginBottom: 0, zIndex: 1 },
  headerBgPrimary: {
    ...StyleSheet.absoluteFillObject as any,
    backgroundColor: '#2D5A3D',
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  headerBgWave: {
    position: 'absolute', left: -40, right: -40, top: 75, height: 160,
    backgroundColor: '#2F6A46', borderTopLeftRadius: 120, borderTopRightRadius: 120,
    transform: [{ scaleX: 1.2 }],
  },
  headerTitle: {
    position: 'absolute',
    left: 16,
    bottom: 36,
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    zIndex: 2,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  
  sheet: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginHorizontal: 12,
    padding: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    zIndex: 2,
    elevation: 4,
  },
  topCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E2E8F0', marginRight: 12, overflow: 'hidden' },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: '900', color: '#111827' },
  phone: { color: '#2563eb', fontWeight: '800', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  ratingValue: { color: '#111827', fontWeight: '800', marginRight: 4 },
  sectionHeader: { marginTop: 16, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  actionLink: { color: '#2563eb', fontWeight: '800' },
  tilesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  tilesGroup: { backgroundColor: '#F3FAF6', borderRadius: 16, padding: 10 },
  tile: { width: '31%', aspectRatio: 1, backgroundColor: '#EFF6F1', borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 6 },
  tileText: { marginTop: 4, fontSize: 10, color: '#1f2937', textAlign: 'center', fontWeight: '700' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeTile: { width: '30.5%', backgroundColor: '#F8FAFC', borderRadius: 14, alignItems: 'center', paddingVertical: 14, position: 'relative', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  badgeTileActive: { backgroundColor: '#2D5A3D' },
  badgeLabelActive: { color: '#FFFFFF' },
  countBadge: { position: 'absolute', top: 8, right: 10, backgroundColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  countText: { fontSize: 12, fontWeight: '800', color: '#111827' },
});
