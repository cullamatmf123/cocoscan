import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutAppScreen() {
  return (
    <SafeAreaView style={styles.safe}> 
      <View style={styles.header}> 
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" style={styles.backBtn}>
          <Text style={[styles.backText, { opacity: 0 }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>About This App</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.appName}>COCOSCAN</Text>
        <Text style={styles.tagline}>Detect Oryctes Rhinoceros in Dwarf Coconut Trees.</Text>

        <View style={[styles.card, styles.cardShadow]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="leaf-outline" size={18} color="#2d5a3d" />
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <Text style={styles.paragraph}>
            CocoScan helps growers quickly assess dwarf coconut trees by scanning coconut rhinoceros beetle
            (Oryctes rhinoceros) damage using their device camera. The app provides an AI prediction, confidence,
            and guidance links for prevention, control, and pesticide recommendations.
          </Text>
        </View>

        <View style={[styles.card, styles.cardShadow]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={18} color="#2d5a3d" />
            <Text style={styles.sectionTitle}>Key Features</Text>
          </View>
          <Text style={styles.bullet}>• Camera-based scanning and AI prediction</Text>
          <Text style={styles.bullet}>• Simple history to review previous scans</Text>
          <Text style={styles.bullet}>• Information hub for prevention & pesticide guidance</Text>
        </View>

        <View style={[styles.card, styles.cardShadow]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="ribbon-outline" size={18} color="#2d5a3d" />
            <Text style={styles.sectionTitle}>Credits</Text>
          </View>
          <Text style={styles.paragraph}>Built with React Native, Expo Router, and community packages.</Text>
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
  safe: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: '#EAF4EC',
    borderBottomColor: '#D5E6DA', borderBottomWidth: 1,
  },
  backBtn: { width: 60, paddingVertical: 8, paddingHorizontal: 6 },
  backText: { color: '#1F3D2A', fontSize: 16, fontWeight: '700' },
  title: {
    position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none',
    color: '#1F3D2A', fontSize: 20, fontWeight: '800', letterSpacing: 0.3,
  },
  content: { padding: 16, paddingBottom: 160, gap: 14 },
  appName: { fontSize: 24, fontWeight: '900', color: '#2d5a3d', textAlign: 'center', letterSpacing: 0.3 },
  tagline: { fontSize: 14, color: '#374151', textAlign: 'center', marginTop: 2, marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E5EFE8' },
  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 16, color: '#2d5a3d', fontWeight: '800' },
  paragraph: { fontSize: 14, color: '#374151', lineHeight: 20 },
  bullet: { fontSize: 14, color: '#374151', lineHeight: 20 },
  primaryBtn: { backgroundColor: '#2d5a3d', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
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
  navIcon: { fontSize: 20, color: '#1f2937' },
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
  fabIcon: { fontSize: 26, color: '#ffffff', textAlign: 'center', marginTop: -2 },
});
