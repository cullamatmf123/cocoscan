import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SCREEN = Dimensions.get('window');

export default function PreventionControlScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef<ScrollView>(null);
  const handlePesticidePress = (name: string) => {
    Alert.alert(name, 'Details will be available soon.');
  };
  const handleTabPress = (index: number) => {
    setActiveTab(index);
    contentRef.current?.scrollTo({ x: SCREEN.width * index, animated: true });
  };
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

        <Text style={[styles.sectionHeading, { marginBottom: 8 }]}>Prevention</Text>
        <View style={styles.tabsRow}>
          <TouchableOpacity
            onPress={() => handleTabPress(0)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={activeTab === 0 ? styles.tabItemActive : styles.tabItem}
          >
            <Text style={activeTab === 0 ? styles.tabTextActive : styles.tabText}>Sanitation & Habitat Management</Text>
            {activeTab === 0 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabPress(1)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={activeTab === 1 ? styles.tabItemActive : styles.tabItem}
          >
            <Text style={activeTab === 1 ? styles.tabTextActive : styles.tabText}>Monitoring & Early Detection</Text>
            {activeTab === 1 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabPress(2)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={activeTab === 2 ? styles.tabItemActive : styles.tabItem}
          >
            <Text style={activeTab === 2 ? styles.tabTextActive : styles.tabText}>Preventing Spread</Text>
            {activeTab === 2 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={contentRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN.width);
            setActiveTab(idx);
          }}
        >
          {/* Page 0: Sanitation & Habitat Management */}
          <View style={{ width: SCREEN.width }}>
            <Text style={styles.infoHeading}>Remove breeding sites</Text>
            <Text style={styles.infoBody}>Chop up and destroy decaying logs, stumps, dead leaves, and dead standing palms—prime CRB larval habitats.</Text>

            <Text style={styles.infoHeading}>Compost properly</Text>
            <Text style={styles.infoBody}>Turn piles regularly so they don’t harbor larvae; spread thin layers to make breeding unsuitable.</Text>

            <Text style={styles.infoHeading}>Cover stumps</Text>
            <Text style={styles.infoBody}>When removal isn’t possible, plant vines or ground cover over stumps to deter egg‑laying.</Text>

            <Text style={styles.infoHeading}>Inspect green waste</Text>
            <Text style={styles.infoBody}>Check mulch or compost for CRB adults or larvae before use to avoid moving infestations.</Text>

            <View style={styles.recBox}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recRow}
              >
                <TouchableOpacity
                  style={styles.recCard}
                  onPress={() => handlePesticidePress('Imidacloprid')}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Imidacloprid"
                >
                  <Image source={require('../assets/images/design/Imidacloprid(2).jpg')} style={styles.recImage} resizeMode="cover" />
                  <Text style={styles.recCaption}>Imidacloprid</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.recCard}
                  onPress={() => handlePesticidePress('Emamectin benzoate')}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Emamectin benzoate"
                >
                  <Image source={require('../assets/images/design/Emamectin-Benzoate.webp')} style={styles.recImage} resizeMode="cover" />
                  <Text style={styles.recCaption}>Emamectin benzoate</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>

          {/* Page 1: Monitoring & Early Detection */}
          <View style={{ width: SCREEN.width }}>
            <Text style={styles.infoHeading}>Regular inspections</Text>
            <Text style={styles.infoBody}>Frequently inspect coconut palms and other susceptible trees for damage such as crown holes, chewed fronds, or frayed new leaves.</Text>

            <Text style={styles.infoHeading}>Use pheromone traps</Text>
            <Text style={styles.infoBody}>Set up pheromone traps to monitor adult beetle activity and capture them, providing early warning of infestations.</Text>

            <Text style={styles.infoHeading}>Community cooperation</Text>
            <Text style={styles.infoBody}>Coordinate with neighbors and the local community on trap placement and sanitation drives for collective prevention.</Text>
          </View>

          {/* Page 2: Preventing Spread */}
          <View style={{ width: SCREEN.width }}>
            <Text style={styles.infoHeading}>Block movement</Text>
            <Text style={styles.infoBody}>Implement measures like blockading and cutting around infested zones to prevent spread to new areas.</Text>

            <Text style={styles.infoHeading}>Be vigilant with host material</Text>
            <Text style={styles.infoBody}>Do not transport CRB host material such as mulch, compost, or green waste from infested areas to new ones.</Text>

            <Text style={styles.infoHeading}>Sterilize tools</Text>
            <Text style={styles.infoBody}>After treating palms or handling infested material, sterilize tools with diluted bleach to avoid transferring disease.</Text>
          </View>
        </ScrollView>
        <Text style={styles.bullet}>• Manually remove adults from crowns and breeding sites.</Text>
        <Text style={styles.bullet}>• Deploy pheromone traps (ethyl 4-methyl octanoate) for monitoring and mass-trapping.</Text>
        <Text style={styles.bullet}>• Apply biocontrols where available (e.g., OrNV, Metarhizium).</Text>
        <Text style={styles.bullet}>• Use insecticides only as directed by local guidelines.</Text>
        <Text style={styles.bullet}>• Adopt IPM: combine cultural, biological, and chemical methods.</Text>
        <Text style={styles.bullet}>• Monitor after treatment to ensure populations stay low.</Text>

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
  // Recommended box styles
  recBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 10,
    marginTop: 6,
    marginBottom: 10,
  },
  recTitle: { fontSize: 16, fontWeight: '800', color: '#0F3D1E', marginBottom: 8 },
  recRow: { flexDirection: 'row', gap: 10, paddingRight: 6 },
  recCard: { width: 220 },
  recImage: { width: '100%', height: 120, borderRadius: 10, backgroundColor: '#F3F4F6' },
  recCaption: { marginTop: 6, color: '#374151', fontSize: 14 },
  // Tabs styles
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
    paddingVertical: 6,
    marginBottom: 6,
  },
  tabItem: { paddingBottom: 2 },
  tabItemActive: { paddingBottom: 2 },
  tabText: { color: '#6B7280', fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#16A34A', fontSize: 14, fontWeight: '800' },
  tabUnderline: { height: 3, backgroundColor: '#16A34A', borderRadius: 2, marginTop: 2, width: 22 },
  infoHeading: { color: '#065F46', fontSize: 16, fontWeight: '800', marginTop: 8, marginBottom: 2 },
  infoBody: { color: '#374151', fontSize: 14, lineHeight: 20, marginBottom: 6 },
});
