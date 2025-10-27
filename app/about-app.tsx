import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ImageBackground, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        <View style={styles.logoBadge}><Text style={styles.logoEmoji}>🌴</Text></View>
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
        <View style={styles.heroWrapper}>
          <ImageBackground
            source={require('../assets/images/design/dwarf-coconut-tree.webp')}
            style={styles.heroBg}
            imageStyle={styles.heroBgImage}
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroTextBox}>
              <Text style={styles.heroLine1}>I'm here to help growers detect and prevent CRB damage.</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.aboutTitle}>About App</Text>
          <View style={styles.aboutRow}>
            <Image
              source={require('../assets/images/design/capture-crb.png')}
              style={styles.aboutPhoto}
              resizeMode="cover"
            />
            <View style={styles.aboutTextCol}>
              <Text style={styles.paragraph}>CocoScan helps growers quickly assess dwarf coconut trees by scanning coconut rhinoceros beetle (Oryctes rhinoceros) damage using their device camera.</Text>
              <Text style={styles.paragraph}>The app provides an AI prediction and confidence, and links to prevention, control, and pesticide recommendations, so you can act with confidence in the field.</Text>
            </View>
          </View>
        </View>

        <View style={styles.imageRowBlock}>
          <Image
            source={require('../assets/images/design/control.jpg')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        <View style={[styles.card, styles.cardShadow, styles.featuresCard]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={18} color="#2d5a3d" />
            <Text style={styles.sectionTitle}>Key Features</Text>
          </View>
          <View style={{ gap: 8 }}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#2d5a3d" style={styles.featureIcon} />
              <Text style={styles.featureText}>Camera-based scanning and AI prediction</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#2d5a3d" style={styles.featureIcon} />
              <Text style={styles.featureText}>Detects Oryctes Rhinoceros presence or signs</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#2d5a3d" style={styles.featureIcon} />
              <Text style={styles.featureText}>Manual input: weather, soil, and etc.</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#2d5a3d" style={styles.featureIcon} />
              <Text style={styles.featureText}>Simple history to review previous scans</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#2d5a3d" style={styles.featureIcon} />
              <Text style={styles.featureText}>Info hub for prevention & pesticide guidance</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.cardShadow]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="ribbon-outline" size={18} color="#2d5a3d" />
            <Text style={styles.sectionTitle}>Credits</Text>
          </View>
          <Text style={styles.paragraph}>Built with React Native, Expo Router, and community packages.</Text>
          <View style={styles.badgesRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>React Native</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>Expo Router</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>Expo</Text></View>
          </View>
        </View>
      </ScrollView>
      
      {/* Footer navigation (matches other pages) */}
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
  safe: { flex: 1, backgroundColor: '#F2F7F3' },
  appBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 48, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF',
  },
  hamburger: { padding: 8 },
  menuLineDark: { width: 24, height: 3, backgroundColor: '#0F3D1E', marginVertical: 2, borderRadius: 2 },
  brandTitle: { color: '#0F3D1E', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  content: { padding: 16, paddingBottom: 160, gap: 16 },
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
  heroWrapper: { borderRadius: 16, overflow: 'hidden' },
  heroBg: { height: 180, borderRadius: 16, justifyContent: 'flex-end' },
  heroBgImage: { borderRadius: 16 },
  heroOverlay: { ...StyleSheet.absoluteFillObject as any, backgroundColor: 'rgba(16, 48, 28, 0.35)' },
  heroTextBox: { padding: 16 },
  heroLine1: { color: '#ffffff', fontSize: 18, fontWeight: '800', letterSpacing: 0.2 },
  heroLine2: { color: '#ffffff', fontSize: 14, fontWeight: '700', marginTop: 4 },

  sectionBlock: { backgroundColor: '#EAF5EE', borderRadius: 16, padding: 16 },
  aboutTitle: { fontSize: 18, color: '#2d5a3d', fontWeight: '900', marginBottom: 10 },
  aboutRow: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  aboutPhoto: { width: 110, height: 110, borderRadius: 16 },
  aboutTextCol: { flex: 1, gap: 8 },

  imageRowBlock: { gap: 10 },
  bannerImage: { width: '100%', height: 160, borderRadius: 16 },
  quoteCard: { backgroundColor: '#EAF5EE', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#CFE6D2', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  quoteText: { color: '#0F3D1E', fontSize: 14, fontWeight: '700', lineHeight: 20 },
  quoteRow: { flexDirection: 'row', alignItems: 'flex-start' },
  quoteHeadline: { color: '#0F3D1E', fontSize: 16, fontWeight: '900', marginBottom: 4 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 16, color: '#2d5a3d', fontWeight: '800' },
  paragraph: { fontSize: 14, color: '#374151', lineHeight: 20 },
  bullet: { fontSize: 14, color: '#374151', lineHeight: 20 },
  featuresCard: { backgroundColor: '#FFFFFF' },
  featuresGrid: { flexDirection: 'column', gap: 12 },
  featureCol: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5EFE8', padding: 12 },
  featureColTitle: { color: '#0F3D1E', fontSize: 14, fontWeight: '900', marginBottom: 8 },
  featureItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7FBF8', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5EFE8' },
  featureIcon: { marginRight: 10 },
  featureText: { color: '#374151', fontSize: 14, flex: 1 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  badge: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#CFE6D2', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  badgeText: { color: '#2d5a3d', fontWeight: '800', fontSize: 12 },
  /* Menu styles */
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  menuBackdropTouch: { ...StyleSheet.absoluteFillObject as any },
  menuSheet: {
    position: 'absolute', top: 60, left: 12, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 8, width: 220,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  menuItem: { paddingHorizontal: 16, paddingVertical: 14 },
  menuItemText: { color: '#111827', fontSize: 16, fontWeight: '700' },
  logoBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#1F4D36', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#F2C200' },
  logoEmoji: { fontSize: 18 },
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
