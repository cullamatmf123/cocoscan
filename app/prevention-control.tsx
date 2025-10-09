import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';

const SCREEN = Dimensions.get('window');

export default function PreventionControlScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <SafeAreaView style={styles.safe}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={() => setMenuVisible(true)}
          accessibilityLabel="Open menu"
        >
          <View style={styles.menuLineDark} />
          <View style={styles.menuLineDark} />
          <View style={styles.menuLineDark} />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>COCOSCAN</Text>
        <View style={styles.appBarSpacer} />
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
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/about-app'); }}>
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); Alert.alert('Settings', 'Settings will be available soon.'); }}>
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.replace('/'); }}>
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentWrap} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Prevention & Control</Text>

        <Text style={styles.sectionHeading}>Prevention</Text>

        <View style={styles.imageBg}>
          <Image
            source={require('../assets/images/design/prevention-online.png')}
            style={styles.preventionImage}
            resizeMode="contain"
          />
          <Text style={styles.imageCaption}>
            Figure 1. Collection of CRB (Oryctes rhinoceros) larvae from a rotting palm trunk in Samoa. Insert (top left)
            shows the adult beetle.
          </Text>
        </View>
        <Text style={styles.bullet}>• Remove and destroy breeding sites (rotting logs, compost heaps, decaying organic matter).</Text>
        <Text style={styles.bullet}>• Maintain field sanitation; avoid leaving palm residues after pruning or felling.</Text>
        <Text style={styles.bullet}>• Use clean planting materials; inspect nursery stock for damage.</Text>
        <Text style={styles.bullet}>• Install sand or small stones in the crown of young palms to deter boring.</Text>

        <Text style={[styles.sectionHeading, { marginBottom: 6 }]}>Control</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.controlRow}
        >
          <Image source={require('../assets/images/design/control.jpg')} style={styles.controlImage} resizeMode="contain" />
          <Image source={require('../assets/images/design/control(2).jpg')} style={styles.controlImage} resizeMode="contain" />
          <Image source={require('../assets/images/design/control(3).jpg')} style={styles.controlImage} resizeMode="contain" />
          <Image source={require('../assets/images/design/control(5).jpg')} style={styles.controlImage} resizeMode="contain" />
        </ScrollView>
        <Text style={styles.bullet}>• Manual removal of adults from boreholes and traps placed in breeding sites.</Text>
        <Text style={styles.bullet}>• Use pheromone traps (ethyl 4-methyl octanoate) to monitor and mass-trap adults.</Text>
        <Text style={styles.bullet}>• Apply recommended biological agents where available (e.g., Oryctes nudivirus strains effective in your region).</Text>
        <Text style={styles.bullet}>• Targeted insecticide treatments following local guidelines and safety regulations.</Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer navigation */}
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
  safe: { flex: 1, backgroundColor: '#ffffff' },
  headerBar: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
  appBar: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  hamburger: { padding: 8 },
  menuLineDark: { width: 24, height: 3, backgroundColor: '#0F3D1E', marginVertical: 2, borderRadius: 2 },
  brandTitle: {
    color: '#0F3D1E',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  appBarSpacer: { width: 34, height: 34 },
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  menuBackdropTouch: { ...StyleSheet.absoluteFillObject as any },
  menuSheet: {
    position: 'absolute', top: 56, right: 12, backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 6, width: 180,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  menuItem: { paddingHorizontal: 14, paddingVertical: 12 },
  menuItemText: { color: '#111827', fontSize: 16, fontWeight: '600' },
  menuDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 2 },
  contentWrap: { padding: 16, paddingBottom: 120 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginTop: 8, marginBottom: 8 },
  sectionHeading: { fontSize: 16, fontWeight: '800', color: '#111827', marginTop: 12, marginBottom: -4, lineHeight: 18 },
  bullet: { fontSize: 14, color: '#374151', lineHeight: 20 },
  imageCaption: { color: '#6B7280', fontSize: 12, marginTop: 2, marginBottom: 0 },
  imageBg: {
    width: '100%',
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginTop: 4,
    marginBottom: 10,
  },
  preventionImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 0.72,
    alignSelf: 'flex-start',
    borderRadius: 4,
    marginTop: 0,
    marginBottom: 0,
  },
  controlRow: { flexDirection: 'row', gap: 10, paddingRight: 4, marginBottom: 8 },
  controlImage: { width: 220, height: 140, borderRadius: 10, backgroundColor: '#ffffff' },
  footerBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', flexWrap: 'nowrap', zIndex: 10,
  },
  footerItem: { flex: 1, alignItems: 'center' },
});
