import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutAppScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <SafeAreaView style={styles.safe}> 
      {/* App Bar with hamburger + centered brand */}
      <View style={styles.appBar}> 
        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuVisible(true)} accessibilityLabel="Open menu">
          <View style={styles.menuLineDark} />
          <View style={styles.menuLineDark} />
          <View style={styles.menuLineDark} />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>COCOSCAN</Text>
        <View style={{ width: 34, height: 34 }} />
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
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/profile'); }}>
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/about-app'); }}>
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); Alert.alert('Settings', 'Settings will be available soon.'); }}>
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.replace('/'); }}>
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>
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
      
      {/* Footer navigation (floating rounded bar) */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} accessibilityLabel="Go to Home">
          <Feather name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/camera')} accessibilityLabel="Open Camera">
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
  safe: { flex: 1, backgroundColor: '#ffffff' },
  appBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 48, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF',
  },
  hamburger: { padding: 8 },
  menuLineDark: { width: 24, height: 3, backgroundColor: '#0F3D1E', marginVertical: 2, borderRadius: 2 },
  brandTitle: { color: '#0F3D1E', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
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
  /* Menu styles */
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  menuBackdropTouch: { ...StyleSheet.absoluteFillObject as any },
  menuSheet: {
    position: 'absolute', top: 60, left: 12, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 8, width: 220,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  menuItem: { paddingHorizontal: 16, paddingVertical: 14 },
  menuItemText: { color: '#111827', fontSize: 16, fontWeight: '700' },
  footerBar: {
    position: 'absolute', left: 0, right: 0, bottom: 8,
    alignSelf: 'center', width: '92%', height: 60,
    backgroundColor: '#FFFFFF', borderRadius: 20,
    paddingHorizontal: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  footerItem: { flex: 1, alignItems: 'center' },
  primaryBtn: { backgroundColor: '#2d5a3d', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
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
