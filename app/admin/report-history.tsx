import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthService } from '../../services/authService';

import { db } from '../../config/firebase';

export default function ReportHistoryScreen() {
  const [totalScans, setTotalScans] = useState(0);
  const params = useLocalSearchParams<{ totalScans?: string; totalUsers?: string }>();
  const [totalUsers, setTotalUsers] = useState(0);
  const [history, setHistory] = useState<Array<{
    id: string;
    fullName: string;
    role: 'admin' | 'user';
    createdAt: Date;
    reportStatus: 'healthy' | 'unhealthy';
  }>>([]);
  const [showMore, setShowMore] = useState(false);

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      // Redirect to the app index; it will decide sign-in/signup
      router.replace('/');
    } catch (e) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  // totalScans: prefer Dashboard-persisted value, then route param, then local scanHistory
  useEffect(() => {
    const load = async () => {
      // 1) Dashboard authoritative value
      const dash = await AsyncStorage.getItem('dashboard_total_scans');
      const dashNum = dash !== null ? parseInt(dash, 10) : NaN;
      if (!Number.isNaN(dashNum)) {
        setTotalScans(dashNum);
        return;
      }
      // 2) Route param
      if (params?.totalScans !== undefined) {
        const fromParam = parseInt(String(params.totalScans), 10);
        if (!Number.isNaN(fromParam)) {
          setTotalScans(fromParam);
          return;
        }
      }
      // 3) Local fallback
      try {
        const raw = await AsyncStorage.getItem('scanHistory');
        const list = raw ? JSON.parse(raw) : [];
        setTotalScans(Array.isArray(list) ? list.length : 0);
      } catch {
        setTotalScans(0);
      }
    };
    load();
  }, [params?.totalScans]);

  // totalUsers: prefer Dashboard-persisted non-admin users, then route param, else 0
  useEffect(() => {
    const loadUsers = async () => {
      const dashUsers = await AsyncStorage.getItem('dashboard_total_users_nonadmin');
      const dashUsersNum = dashUsers !== null ? parseInt(dashUsers, 10) : NaN;
      if (!Number.isNaN(dashUsersNum)) {
        setTotalUsers(dashUsersNum);
        return;
      }
      if (params?.totalUsers !== undefined) {
        const fromParam = parseInt(String(params.totalUsers), 10);
        if (!Number.isNaN(fromParam)) {
          setTotalUsers(fromParam);
          return;
        }
      }
      setTotalUsers(0);
    };
    loadUsers();
  }, [params?.totalUsers]);

  // Refresh both KPIs whenever Analytics gains focus
  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      const refresh = async () => {
        try {
          const [dashScans, dashUsers] = await Promise.all([
            AsyncStorage.getItem('dashboard_total_scans'),
            AsyncStorage.getItem('dashboard_total_users_nonadmin'),
          ]);
          if (active && dashScans !== null) {
            const n = parseInt(dashScans, 10);
            if (!Number.isNaN(n)) setTotalScans(n);
          }
          if (active && dashUsers !== null) {
            const u = parseInt(dashUsers, 10);
            if (!Number.isNaN(u)) setTotalUsers(u);
          }

          // Load report history from Firestore 'scans' (new source of truth)
          try {
            const q = query(collection(db, 'scans'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            const items = snap.docs.map((d, idx) => {
              const data = d.data() as any;
              const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
              const fullName = data.userName || data.userEmail || 'User';
              const email = data.userEmail || '';
              const status = (data.status === 'healthy' || data.status === 'unhealthy')
                ? data.status
                : (String(data.prediction).toLowerCase() === 'healthy' ? 'healthy' : 'unhealthy');
              return {
                id: d.id,
                fullName,
                role: data.role ?? 'user',
                createdAt,
                reportStatus: status as 'healthy' | 'unhealthy',
                email,
              };
            });
            if (active) setHistory(items);

            // Persist unified history for Dashboard (top 3 there)
            try {
              const toStore = items.map(item => ({
                id: item.id,
                fullName: item.fullName,
                email: item.email,
                reportStatus: item.reportStatus,
                createdAt: item.createdAt.toISOString(),
              }));
              await AsyncStorage.setItem('report_history', JSON.stringify(toStore));
            } catch {}
          } catch {}
        } catch {}
      };
      refresh();
      return () => { active = false; };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/admin/dashboard')} style={styles.backBtn}>
          {/* Intentionally empty to preserve spacing without showing text */}
        </TouchableOpacity>
        <Text style={styles.title}>CocoScan</Text>
        <View style={{ width: 60, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => router.push('/admin/notifications')} style={{ marginRight: 8 }}>
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <View style={{ paddingHorizontal: 0, marginBottom: 8 }}>
          <Text style={styles.sectionTitle}>Report History</Text>
        </View>
        <View style={styles.row}>
          <View style={[styles.card, styles.shadow]}>
            <View style={styles.cardIcon}><Ionicons name="people-outline" size={18} color="#2D5A3D" /></View>
            <Text style={styles.kpiValue}>{totalUsers}</Text>
            <Text style={styles.kpiLabel}>Total Users</Text>
          </View>
          <View style={[styles.card, styles.shadow]}>
            <View style={styles.cardIcon}><Ionicons name="time-outline" size={18} color="#2D5A3D" /></View>
            <Text style={styles.kpiValue}>{totalScans}</Text>
            <Text style={styles.kpiLabel}>Total Scans</Text>
          </View>
        </View>

        <View style={[styles.panel, styles.shadow]}>
          <Text style={styles.panelTitle}>Usage</Text>
          <Text style={styles.panelText}>Add charts and breakdowns here.</Text>
        </View>

        <View style={[styles.panel, styles.shadow]}> 
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={styles.panelTitle}>Report History</Text>
          </View>
          {history.slice(0,3).map((u, idx) => (
            <View key={u.id} style={{ paddingVertical: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: '900', color: '#1F3D2A' }}>{u.fullName}</Text>
                <View style={[styles.pill, u.reportStatus === 'healthy' ? styles.pillHealthy : styles.pillUnhealthy]}>
                  <Text style={styles.pillText}>{u.reportStatus === 'healthy' ? 'Healthy' : 'Unhealthy'}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, marginRight: 6, color: '#0F172A' }}>{idx % 2 === 0 ? '☁️' : '🌤️'}</Text>
                    <Text style={{ color: '#1F2937', fontSize: 12 }}>{idx % 2 === 0 ? 'cloudy' : 'sunny'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, marginRight: 6, color: '#0F172A' }}>🌿</Text>
                    <Text style={{ color: '#1F2937', fontSize: 12 }}>{u.role === 'admin' ? 'silt' : (idx % 2 === 0 ? 'clay' : 'sandy')}  </Text>
                    <Text style={{ color: '#6B7280', fontSize: 12 }}>( {idx % 2 === 0 ? '87%' : '95%'} )</Text>
                  </View>
                </View>
                <Text style={{ color: '#111827', fontSize: 12 }}>{u.createdAt.toLocaleDateString()}</Text>
              </View>
              {idx < Math.min(3, history.length) - 1 && <View style={{ height: 1, backgroundColor: '#175C35', marginTop: 10 }} />}
            </View>
          ))}
          {history.length === 0 && (
            <Text style={{ color: '#64748B', fontWeight: '700' }}>No report history yet.</Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom dock */}
      <View style={styles.bottomDock}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go to Dashboard"
          onPress={() => router.push('/admin/dashboard')}
          style={styles.dockBtn}
        >
          <Ionicons name="home-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go to Report History"
          onPress={() => router.push({ pathname: '/admin/report-history', params: { totalScans: String(totalScans), totalUsers: String(totalUsers) } })}
          style={styles.dockBtn}
        >
          <Ionicons name="time-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go to User Management"
          onPress={() => router.push('/admin/user-management')}
          style={[styles.dockBtn, styles.dockCircleOutline]}
        >
          <Text style={[styles.dockGlyph, styles.dockGlyphLarge]}>＋</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.push('/admin/profile')}
          style={styles.dockBtn}
        >
          <Ionicons name="person-circle-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="More options"
          onPress={() => setShowMore(true)}
          style={styles.dockBtn}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* More menu */}
      <Modal
        transparent
        visible={showMore}
        animationType="fade"
        onRequestClose={() => setShowMore(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setShowMore(false)}><View /></Pressable>
        <View style={styles.menuContainer} pointerEvents="box-none">
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMore(false); Alert.alert('Settings', 'Settings coming soon.'); }}>
              <Ionicons name="settings-outline" size={18} color="#0F172A" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMore(false); handleSignOut(); }}>
              <Ionicons name="log-out-outline" size={18} color="#0F172A" />
              <Text style={styles.menuText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7FAF8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 16, paddingBottom: 24, backgroundColor: '#175C35',
    borderBottomColor: '#134E2B', borderBottomWidth: 0,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  backBtn: { width: 80, paddingVertical: 6 },
  backText: { color: '#1F3D2A', fontWeight: '900', fontSize: 16 },
  title: { position: 'absolute', left: 0, right: 0, textAlign: 'center', color: '#FFFFFF', fontSize: 18, fontWeight: '900' },

  row: { flexDirection: 'row', gap: 12 },
  card: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14 },
  shadow: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  cardIcon: { marginBottom: 6 },
  kpiValue: { fontSize: 22, fontWeight: '900', color: '#1F3D2A' },
  kpiLabel: { marginTop: 2, fontSize: 12, color: '#64748B', fontWeight: '700' },

  panel: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginTop: 16 },
  panelTitle: { fontSize: 16, fontWeight: '900', color: '#1F3D2A', marginBottom: 8 },
  panelText: { color: '#64748B', fontWeight: '700' },
  pill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  pillHealthy: { backgroundColor: '#86EFAC' },
  pillUnhealthy: { backgroundColor: '#FCA5A5' },
  pillText: { color: '#0F172A', fontSize: 12, fontWeight: '700' },
  bottomDock: {
    position: 'absolute', left: 16, right: 16, bottom: 12, height: 56,
    backgroundColor: '#A7F3D0', borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'
  },
  dockBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dockCircleOutline: { borderWidth: 2, borderColor: '#0F172A' },
  dockGlyph: { color: '#0F172A', fontSize: 18, fontWeight: '600' },
  dockGlyphLarge: { fontSize: 26 },
  graphIcon: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  graphBar: { width: 6, backgroundColor: '#0F172A', borderRadius: 2 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1F3D2A' },
  menuBackdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.1)' },
  menuContainer: { position: 'absolute', left: 0, right: 0, bottom: 80, alignItems: 'flex-end', paddingHorizontal: 16 },
  menuCard: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 6 },
  menuText: { color: '#0F172A', fontWeight: '700' },
});
