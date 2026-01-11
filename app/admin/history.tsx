import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthService } from '../../services/authService';

import { db } from '../../config/firebase';

export default function ReportHistoryScreen() {
  const [totalScans, setTotalScans] = useState(0);
  const params = useLocalSearchParams<{ totalScans?: string; totalUsers?: string }>();
  const [totalUsers, setTotalUsers] = useState(0);
  const [history, setHistory] = useState<Array<{
    id: string;
    fullName: string;
    userId: string;
    createdAt: Date;
    prediction?: string;
    confidence?: string;
    weather?: string;
    soil?: string;
  }>>([]);

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      router.replace('/');
    } catch (e) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  useEffect(() => {
    const load = async () => {
      const dash = await AsyncStorage.getItem('dashboard_total_scans');
      const dashNum = dash !== null ? parseInt(dash, 10) : NaN;
      if (!Number.isNaN(dashNum)) {
        setTotalScans(dashNum);
        return;
      }
      if (params?.totalScans !== undefined) {
        const fromParam = parseInt(String(params.totalScans), 10);
        if (!Number.isNaN(fromParam)) {
          setTotalScans(fromParam);
          return;
        }
      }
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

          try {
            const q = query(collection(db, 'scanHistory'), orderBy('timestamp', 'desc'));
            const snap = await getDocs(q);
            const items = snap.docs.map((d) => {
              const data = d.data() as any;
              const createdAt = data.timestamp?.toDate ? data.timestamp.toDate() : new Date();
              const userId = data.userId || 'Unknown';
              const prediction = data.prediction || 'Unknown';
              const confidence = data.confidence || 'N/A';
              const weather = data.weather || 'N/A';
              const soil = data.soil || 'N/A';
              
              return {
                id: d.id,
                fullName: userId,
                userId: userId,
                createdAt,
                prediction,
                confidence,
                weather,
                soil,
              };
            });
            if (active) setHistory(items);

            if (active) {
              setTotalScans(items.length);
              await AsyncStorage.setItem('dashboard_total_scans', String(items.length));
            }
          } catch (err) {
            console.error('Error fetching scan history:', err);
          }
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
          {/* Intentionally empty to preserve spacing */}
        </TouchableOpacity>
        <Text style={styles.title}>CocoScan</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* Page Title */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Scan History</Text>
          <Text style={styles.pageSubtitle}>Track all coconut disease detections</Text>
        </View>

        {/* All History List */}
        <View style={[styles.panel, styles.shadow]}> 
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>All Scan Records</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{history.length}</Text>
            </View>
          </View>
          
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="document-outline" size={40} color="#64748B" />
              </View>
              <Text style={styles.emptyTitle}>No scan history yet</Text>
              <Text style={styles.emptySubtitle}>User scans will appear here</Text>
            </View>
          ) : (
            history.map((scan, idx) => (
              <View key={scan.id} style={styles.historyItem}>
                {/* User and Prediction */}
                <View style={styles.itemHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <Ionicons name="person" size={18} color="#FFFFFF" />
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={styles.userId} numberOfLines={1}>{scan.userId}</Text>
                      <Text style={styles.scanDate}>
                        {scan.createdAt.toLocaleDateString()} • {scan.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.pill, 
                    scan.prediction?.toLowerCase().includes('healthy') ? styles.pillHealthy : styles.pillUnhealthy
                  ]}>
                    <Text style={styles.pillText}>{scan.prediction || 'Unknown'}</Text>
                  </View>
                </View>

                {/* Scan Details */}
                <View style={styles.scanDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconWrap}>
                      <Ionicons name="cloud-outline" size={16} color="#64748B" />
                    </View>
                    <Text style={styles.detailLabel}>Weather</Text>
                    <Text style={styles.detailValue}>{scan.weather || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconWrap}>
                      <Ionicons name="leaf-outline" size={16} color="#64748B" />
                    </View>
                    <Text style={styles.detailLabel}>Soil</Text>
                    <Text style={styles.detailValue}>{scan.soil || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconWrap}>
                      <Ionicons name="analytics-outline" size={16} color="#64748B" />
                    </View>
                    <Text style={styles.detailLabel}>Confidence</Text>
                    <Text style={styles.detailValue}>{scan.confidence || 'N/A'}</Text>
                  </View>
                </View>

                {idx < history.length - 1 && <View style={styles.divider} />}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const GREEN = '#1F6A44';
const GREEN_DARK = '#184F34';
const GREEN_LIGHT = '#E8F5EF';
const BG = '#F0F6F4';

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingTop: 50, 
    paddingHorizontal: 20, 
    paddingBottom: 28, 
    backgroundColor: GREEN,
    borderBottomLeftRadius: 28, 
    borderBottomRightRadius: 28,
    shadowColor: GREEN_DARK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  backBtn: { 
    width: 60, 
    paddingVertical: 6,
  },
  title: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    textAlign: 'center', 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  pageHeader: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  pageSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },

  panel: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 18,
    borderWidth: 1,
    borderColor: '#D1E8DD',
  },
  shadow: { 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 12, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 3,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  panelTitle: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  countBadge: {
    backgroundColor: GREEN_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1E8DD',
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: GREEN,
  },

  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },

  historyItem: {
    paddingVertical: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: GREEN_LIGHT,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  scanDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '600',
  },
  
  pill: { 
    paddingVertical: 6, 
    paddingHorizontal: 14, 
    borderRadius: 10,
    borderWidth: 1,
  },
  pillHealthy: { 
    backgroundColor: '#ECFDF5', 
    borderColor: '#86EFAC',
  },
  pillUnhealthy: { 
    backgroundColor: '#FEF2F2', 
    borderColor: '#FCA5A5',
  },
  pillText: { 
    color: '#0F172A', 
    fontSize: 13, 
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  scanDetails: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 16,
  },
});