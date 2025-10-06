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
        <View style={styles.headerContent}>
          <View style={styles.avatarHero}>
            <Ionicons name="person-circle" size={80} color="#94A3B8" />
          </View>
          <Text style={styles.nameHero}>{displayName || 'User'}</Text>
          <Text style={[styles.emailText, { color: '#E5F2E9' }]}>{AuthService.getCurrentUser()?.email || 'user@example.com'}</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => console.log('Edit Farm Info')} activeOpacity={0.8}>
            <Ionicons name="create-outline" size={18} color="#1F3D2A" />
            <Text style={styles.editBtnText}>Edit Farm Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.sheet}>

          {/* Help us Grow button */}
          <TouchableOpacity style={styles.helpBtn} onPress={() => router.push('/feedback')} activeOpacity={0.85}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#FFFFFF" />
            <Text style={styles.helpBtnText}>Help us Grow</Text>
          </TouchableOpacity>

          {/* Metric cards row */}
          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, styles.metricChat, styles.cardShadow]}>
              <Ionicons name="chatbubble-outline" size={22} color="#2563eb" />
              <Text style={[styles.metricValue, { color: '#2563eb' }]}>0</Text>
              <Text style={styles.metricLabel}>Total Chats</Text>
            </View>
            <View style={[styles.metricCard, styles.metricDiag, styles.cardShadow]}>
              <Ionicons name="medkit-outline" size={22} color="#16a34a" />
              <Text style={[styles.metricValue, { color: '#16a34a' }]}>0</Text>
              <Text style={styles.metricLabel}>Diagnoses</Text>
            </View>
          </View>

          {/* Recent Diagnoses card */}
          <View style={[styles.recentCard, styles.cardShadow]}>
            <View style={styles.recentHeader}>
              <View style={styles.recentHeaderLeft}>
                <Ionicons name="medkit-outline" size={18} color="#1F7A54" />
                <Text style={styles.recentTitle}>Recent Diagnoses (15d)</Text>
              </View>
            </View>
            <View style={styles.recentEmptyWrap}>
              <Ionicons name="bandage-outline" size={40} color="#9CA3AF" style={{ marginBottom: 6 }} />
              <Text style={styles.recentEmptyText}>No diagnoses yet</Text>
            </View>
          </View>

          

          
        </View>
      </ScrollView>

      {/* Bottom navigation */}
      <View style={styles.bottomWrap} pointerEvents="box-none">
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/home')}>
            <Ionicons name="home-outline" size={26} color="#475569" />
          </TouchableOpacity>
          <View style={styles.navSpacer} />
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
            <Ionicons name="person-outline" size={26} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* Center floating camera button */}
        <View style={styles.fabContainer} pointerEvents="box-none">
          <TouchableOpacity style={styles.fab} onPress={() => router.replace('/camera')}>
            <Ionicons name="camera" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#2D5A3D' },
  headerWrap: { height: 260, overflow: 'hidden', marginBottom: 0, zIndex: 1 },
  headerBgPrimary: {
    ...StyleSheet.absoluteFillObject as any,
    backgroundColor: '#2D5A3D',
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  headerBgWave: {
    position: 'absolute', left: -40, right: -40, top: 110, height: 180,
    backgroundColor: '#2F6A46', borderTopLeftRadius: 120, borderTopRightRadius: 120,
    transform: [{ scaleX: 1.2 }],
  },
  headerContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 24,
    alignItems: 'center',
    gap: 6,
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
  topCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6, alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E2E8F0', marginRight: 12, overflow: 'hidden' },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: '900', color: '#111827' },
  phone: { color: '#2563eb', fontWeight: '800', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  ratingValue: { color: '#111827', fontWeight: '800', marginRight: 4 },
  topCardHeader: { alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 6 },
  avatarHero: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#E2E8F0' },
  nameHero: { fontSize: 18, fontWeight: '900', color: '#1F3D2A' },
  locationPill: { marginTop: 10, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EAF4EC', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  locationText: { color: '#1F3D2A', fontWeight: '800' },
  emailText: { color: '#6B7280', marginTop: 4, fontWeight: '600', textAlign: 'center' },
  editBtn: { marginTop: 12, alignSelf: 'center', flexDirection: 'row', gap: 8, backgroundColor: '#ffffff', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#E5EFE8' },
  editBtnText: { color: '#1F3D2A', fontWeight: '900' },
  levelCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, marginTop: 12 },
  levelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  levelLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EAF7EF', alignItems: 'center', justifyContent: 'center' },
  levelTitle: { fontSize: 14, fontWeight: '900', color: '#1F3D2A' },
  levelStats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3F4F6', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  levelStatText: { fontSize: 12, fontWeight: '900', color: '#111827' },
  sectionHeader: { marginTop: 16, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1F3D2A' },
  actionLink: { color: '#2563eb', fontWeight: '800' },
  tilesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12 },
  cardShadow: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  tilesGroup: { backgroundColor: '#F1F8F4', borderRadius: 16, padding: 14 },
  tile: { width: '31%', aspectRatio: 1, backgroundColor: '#EFF6F1', borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 8, borderWidth: 1, borderColor: '#E5EFE8' },
  tileText: { marginTop: 6, fontSize: 11, color: '#1f2937', textAlign: 'center', fontWeight: '800' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 12 },
  metricCard: { flex: 1, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 12, alignItems: 'flex-start' },
  metricChat: { backgroundColor: '#eaf1ff', borderWidth: 1, borderColor: '#d7e4ff' },
  metricDiag: { backgroundColor: '#eaf8ee', borderWidth: 1, borderColor: '#cfeedd' },
  metricValue: { marginTop: 4, fontSize: 22, fontWeight: '900' },
  metricLabel: { marginTop: 2, fontSize: 12, color: '#1f2937', fontWeight: '700' },
  helpBtn: { marginTop: 12, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4CAF84', borderRadius: 999, paddingVertical: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  helpBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 14 },
  recentCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, marginTop: 12 },
  recentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  recentHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recentTitle: { fontSize: 14, fontWeight: '900', color: '#1F3D2A' },
  recentEmptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  recentEmptyText: { color: '#6B7280', fontSize: 13, fontWeight: '700' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeTile: { width: '30.5%', backgroundColor: '#F8FAFC', borderRadius: 14, alignItems: 'center', paddingVertical: 14, position: 'relative', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  badgeTileActive: { backgroundColor: '#2D5A3D' },
  badgeLabelActive: { color: '#FFFFFF' },
  countBadge: { position: 'absolute', top: 8, right: 10, backgroundColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  countText: { fontSize: 12, fontWeight: '800', color: '#111827' },
  bottomWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 60,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  navItem: { padding: 8 },
  navSpacer: { width: 84 },
  fabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    top: -28,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2d5a3d',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
});
