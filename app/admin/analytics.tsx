import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AnalyticsScreen() {
  const [totalScans, setTotalScans] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem('scanHistory');
        const list = raw ? JSON.parse(raw) : [];
        setTotalScans(Array.isArray(list) ? list.length : 0);
      } catch (e) {
        setTotalScans(0);
      }
    };
    load();
  }, []);

  // If you later have a real users source, replace this with the real count
  const totalUsers = useMemo(() => 0, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/admin/dashboard')} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Analytics</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={styles.row}>
          <View style={[styles.card, styles.shadow]}>
            <View style={styles.cardIcon}><Ionicons name="people-outline" size={18} color="#2D5A3D" /></View>
            <Text style={styles.kpiValue}>{totalUsers}</Text>
            <Text style={styles.kpiLabel}>Total Users</Text>
          </View>
          <View style={[styles.card, styles.shadow]}>
            <View style={styles.cardIcon}><Ionicons name="bar-chart-outline" size={18} color="#2D5A3D" /></View>
            <Text style={styles.kpiValue}>{totalScans}</Text>
            <Text style={styles.kpiLabel}>Total Scans</Text>
          </View>
        </View>

        <View style={[styles.panel, styles.shadow]}>
          <Text style={styles.panelTitle}>Usage</Text>
          <Text style={styles.panelText}>Add charts and breakdowns here.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7FAF8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#EAF4EC',
    borderBottomColor: '#D5E6DA', borderBottomWidth: 1,
  },
  backBtn: { width: 80, paddingVertical: 6 },
  backText: { color: '#1F3D2A', fontWeight: '900', fontSize: 16 },
  title: { position: 'absolute', left: 0, right: 0, textAlign: 'center', color: '#1F3D2A', fontSize: 18, fontWeight: '900' },

  row: { flexDirection: 'row', gap: 12 },
  card: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14 },
  shadow: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  cardIcon: { marginBottom: 6 },
  kpiValue: { fontSize: 22, fontWeight: '900', color: '#1F3D2A' },
  kpiLabel: { marginTop: 2, fontSize: 12, color: '#64748B', fontWeight: '700' },

  panel: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginTop: 16 },
  panelTitle: { fontSize: 16, fontWeight: '900', color: '#1F3D2A', marginBottom: 8 },
  panelText: { color: '#64748B', fontWeight: '700' },
});
