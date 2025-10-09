import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PesticidesScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const handleStartScanning = () => router.push('/camera');
  const handleHistoryPress = () => router.push('/history');
  const handleProfilePress = () => router.push('/profile');

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
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); handleProfilePress(); }}>
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

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lead}>
          Based on common coconut rhinoceros beetle management practices, consider the following pesticide
          and bio-control options. Always follow local regulations and product labels.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Biological Control</Text>
          <Text style={styles.item}>• Oryctes rhinoceros nudivirus (OrNV)</Text>
          <Text style={styles.itemNote}>Deploy via infected beetles or formulations where permitted.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Larval Habitat Treatment</Text>
          <Text style={styles.item}>• Bacillus thuringiensis var. israelensis (BTI)</Text>
          <Text style={styles.item}>• Beauveria bassiana (entomopathogenic fungus)</Text>
          <Text style={styles.itemNote}>Apply to breeding sites like decaying logs, compost, and manure heaps.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trunk/Canopy Protection</Text>
          <Text style={styles.item}>• Synthetic pyrethroids (e.g., cypermethrin) – where legally approved</Text>
          <Text style={styles.item}>• Neem-based products (azadirachtin)</Text>
          <Text style={styles.itemNote}>Target entry holes and fresh damage; avoid non-target exposure.</Text>
        </View>

        <Text style={styles.disclaimer}>
          Disclaimer: This is general guidance. Consult local extension services for region-approved
          products, rates, and safety guidelines. Always wear appropriate PPE and comply with
          environmental safeguards.
        </Text>
      </ScrollView>

      {/* Footer navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} accessibilityLabel="Go to Home">
          <Feather name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleStartScanning} accessibilityLabel="Open Camera">
          <Feather name="camera" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleHistoryPress} accessibilityLabel="View History">
          <Feather name="clock" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleProfilePress} accessibilityLabel="Open Profile">
          <Feather name="user" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  hamburger: {
    padding: 8,
  },
  menuLineDark: {
    width: 24,
    height: 3,
    backgroundColor: '#0F3D1E',
    marginVertical: 2,
    borderRadius: 2,
  },
  brandTitle: {
    color: '#0F3D1E',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  profileButton: {
    padding: 5,
  },
  appBarSpacer: {
    width: 34,
    height: 34,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  menuBackdropTouch: {
    ...StyleSheet.absoluteFillObject as any,
  },
  menuSheet: {
    position: 'absolute',
    top: 56,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    width: 180,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuItemText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 2,
  },
  content: { padding: 16, paddingBottom: 100 },
  lead: { color: '#1F2937', fontSize: 14, lineHeight: 20, marginBottom: 12, fontWeight: '600' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 12,
  },
  cardTitle: { color: '#0F3D1E', fontSize: 16, fontWeight: '800', marginBottom: 6 },
  item: { color: '#111827', fontSize: 14, marginBottom: 4 },
  itemNote: { color: '#374151', fontSize: 12 },
  disclaimer: { color: '#6B7280', fontSize: 12, marginTop: 8 },
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
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
  },
});
