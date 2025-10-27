import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SCREEN = Dimensions.get('window');

export default function PreventionControlScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef<ScrollView>(null);
  const [controlTab, setControlTab] = useState(0);
  const sanitationImages = [
    require('../assets/images/design/Symptoms(3).jpg'),
    require('../assets/images/design/Symptoms.jpg'),
  ];
  const monitoringImages = [
    require('../assets/images/design/log traps.jpg'),
    require('../assets/images/design/log traps(2).jpg'),
    require('../assets/images/design/pheromone traps.jpg'),
    require('../assets/images/design/pheromone traps(2).jpg'),
    require('../assets/images/design/pheromone traps(3).jpg'),
  ];
  const controlMechanicalImages = [
    require('../assets/images/design/capture-crb.png'),
    require('../assets/images/design/capture-crb(2).jpg'),
    require('../assets/images/design/capture-crb(3).jpg'),
  ];
  const ornvImages = [
    require('../assets/images/design/virus.jpg'),
    require('../assets/images/design/rions-of-Oryctes-Nudivirus-OrNV-a-Showing-capsids-c-and-viral-membrane-m-b.png'),
  ];
  const gmfImages = [
    require('../assets/images/design/green fungus.jpg'),
    require('../assets/images/design/GMF.jpg'),
  ];
  const ornvGmfImages = [
    { src: require('../assets/images/design/virus.jpg'), label: 'Oryctes rhinoceros nudivirus (OrNV)' },
    { src: require('../assets/images/design/rions-of-Oryctes-Nudivirus-OrNV-a-Showing-capsids-c-and-viral-membrane-m-b.png'), label: 'Oryctes rhinoceros nudivirus (OrNV)' },
    { src: require('../assets/images/design/green fungus.jpg'), label: 'GMF (Metarhizium anisopliae)' },
    { src: require('../assets/images/design/GMF.jpg'), label: 'GMF (Metarhizium anisopliae)' },
  ];
  // Chemical control images reused from pesticides.tsx
  const chemicalImages = [
    { src: require('../assets/images/design/Karate-front.webp'), label: 'Lambda-cyhalothrin (Karate)' },
    { src: require('../assets/images/design/imidacloprid.png'), label: 'Imidacloprid' },
    { src: require('../assets/images/design/Emamectin-Benzoate.webp'), label: 'Emamectin Benzoate' },
    { src: require('../assets/images/design/chloros-chlorantraniliprole.webp'), label: 'Chlorantraniliprole' },
  ];
  const handlePesticidePress = (name: string) => {
    Alert.alert(name, 'Details will be available soon.');
  };
  const handleTabPress = (index: number) => {
    setActiveTab(index);
    contentRef.current?.scrollTo({ x: SCREEN.width * index, animated: true });
  };
  const handleControlTabPress = (index: number) => {
    setControlTab(index);
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

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentWrap} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Prevention</Text>

        <Text style={[styles.sectionHeading, { marginBottom: 8 }]}>Prevention & Control</Text>
        <View style={styles.imageBg}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sanitationImages.map((src, idx) => (
              <Image key={`pre-top-${idx}`} source={src} style={styles.preventionImage} resizeMode="cover" />
            ))}
          </ScrollView>
          
          <View style={styles.photosCountChip}>
            <Text style={styles.photosCountText}>{sanitationImages.length} photos</Text>
          </View>
        </View>
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

        {/* Content area: not swipeable; switches only on tab press */}
        {activeTab === 0 && (
          <View>
            
            <Text style={styles.infoHeading}>Remove breeding sites</Text>
            <Text style={styles.infoBody}>Chop up and destroy decaying logs, stumps, dead leaves, and dead standing palms—prime CRB larval habitats.</Text>

            <Text style={styles.infoHeading}>Compost properly</Text>
            <Text style={styles.infoBody}>Turn piles regularly so they don’t harbor larvae; spread thin layers to make breeding unsuitable.</Text>

            <Text style={styles.infoHeading}>Cover stumps</Text>
            <Text style={styles.infoBody}>When removal isn’t possible, plant vines or ground cover over stumps to deter egg‑laying.</Text>

            <Text style={styles.infoHeading}>Inspect green waste</Text>
            <Text style={styles.infoBody}>Check mulch or compost for CRB adults or larvae before use to avoid moving infestations.</Text>

          </View>
        )}

        {activeTab === 1 && (
          <View>
            
            <Text style={styles.infoHeading}>Regular inspections</Text>
            <Text style={styles.infoBody}>Frequently inspect coconut palms and other susceptible trees for damage such as crown holes, chewed fronds, or frayed new leaves.</Text>

            <Text style={styles.infoHeading}>Use light pheromone traps</Text>
            <Text style={styles.infoBody}>Set up pheromone traps to monitor adult beetle activity and capture them, providing early warning of infestations.</Text>

            <Text style={styles.infoHeading}>Community cooperation</Text>
            <Text style={styles.infoBody}>Coordinate with neighbors and the local community on trap placement and sanitation drives for collective prevention.</Text>
          </View>
        )}

        {activeTab === 2 && (
          <View>
            <Text style={styles.infoHeading}>Block movement</Text>
            <Text style={styles.infoBody}>Implement measures like blockading and cutting around infested zones to prevent spread to new areas.</Text>

            <Text style={styles.infoHeading}>Be vigilant with host material</Text>
            <Text style={styles.infoBody}>Do not transport CRB host material such as mulch, compost, or green waste from infested areas to new ones.</Text>

            <Text style={styles.infoHeading}>Sterilize tools</Text>
            <Text style={styles.infoBody}>After treating palms or handling infested material, sterilize tools with diluted bleach to avoid transferring disease.</Text>
          </View>
        )}
        <View style={{ height: 12 }} />
        <Text style={[styles.sectionHeading, { marginBottom: 8 }]}>Control</Text>
        <View style={styles.tabsRow}>
          <TouchableOpacity
            onPress={() => handleControlTabPress(0)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={controlTab === 0 ? styles.tabItemActive : styles.tabItem}
          >
            <Text style={controlTab === 0 ? styles.tabTextActive : styles.tabText}>Mechanical Control</Text>
            {controlTab === 0 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleControlTabPress(1)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={controlTab === 1 ? styles.tabItemActive : styles.tabItem}
          >
            <Text style={controlTab === 1 ? styles.tabTextActive : styles.tabText}>Biological Control</Text>
            {controlTab === 1 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleControlTabPress(2)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={controlTab === 2 ? styles.tabItemActive : styles.tabItem}
          >
            <Text style={controlTab === 2 ? styles.tabTextActive : styles.tabText}>Trapping Methods</Text>
            {controlTab === 2 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleControlTabPress(3)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={controlTab === 3 ? styles.tabItemActive : styles.tabItem}
          >
            <Text style={controlTab === 3 ? styles.tabTextActive : styles.tabText}>Chemical Control</Text>
            {controlTab === 3 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        {controlTab === 0 && (
          <View>
            <View style={styles.imageBg}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {controlMechanicalImages.map((src, idx) => (
                  <Image key={`ctrl-mech-${idx}`} source={src} style={styles.preventionImage} resizeMode="cover" />
                ))}
              </ScrollView>
              <View style={styles.photosCountChip}>
                <Text style={styles.photosCountText}>{controlMechanicalImages.length} photos</Text>
              </View>
            </View>
            <Text style={styles.bullet}>• Manually remove adults from crowns and breeding sites.</Text>
            <Text style={styles.bullet}>• Deploy pheromone traps (ethyl 4-methyl octanoate) for monitoring and mass-trapping.</Text>
            <Text style={styles.bullet}>• Monitor after treatment to ensure populations stay low.</Text>
          </View>
        )}

        {controlTab === 1 && (
          <View>
            <View style={styles.imageBg}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {ornvGmfImages.map((item, idx) => (
                  <View key={`ornvgmf-${idx}`} style={{ marginRight: 10 }}>
                    <Image source={item.src} style={styles.preventionImage} resizeMode="cover" />
                    <Text style={styles.imageCaption}>{item.label}</Text>
                  </View>
                ))}
              </ScrollView>
              <Text style={[styles.imageCaption, { marginTop: 4 }]}>Online reference images</Text>
              <View style={styles.photosCountChip}>
                <Text style={styles.photosCountText}>{ornvGmfImages.length} photos</Text>
              </View>
            </View>
            <Text style={styles.bullet}>• Use Oryctes rhinoceros nudivirus (OrNV) to infect and kill beetles naturally.</Text>
            <Text style={styles.bullet}>• Apply Metarhizium anisopliae (green fungus) to breeding sites.</Text>
            <Text style={styles.bullet}>• Encourage natural predators such as birds or parasitic insects.</Text>
          </View>
        )}

        {controlTab === 2 && (
          <View>
            <View style={styles.imageBg}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {monitoringImages.map((src, idx) => (
                  <Image key={`trap-strip-${idx}`} source={src} style={styles.preventionImage} resizeMode="cover" />
                ))}
              </ScrollView>
              <View style={styles.photosCountChip}>
                <Text style={styles.photosCountText}>{monitoringImages.length} photos</Text>
              </View>
            </View>
            <Text style={styles.infoBody}>Log Trapping</Text>
            <Text style={styles.infoBody}>Place decomposing coconut logs around plantations. Add attractants (e.g., sugar, yeast, or molasses) to lure adult beetles, and check regularly to destroy captured beetles.</Text>

            <Text style={[styles.infoBody, { marginTop: 6 }]}>Pheromone Trapping</Text>
            <Text style={styles.infoBody}>Use synthetic pheromones (e.g., ethyl 4-methyloctanoate) to attract adult beetles into traps. Suitable for monitoring and mass trapping in infested areas.</Text>
          </View>
        )}

        {controlTab === 3 && (
          <View>
            <View style={styles.imageBg}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {chemicalImages.map((item, idx) => (
                  <View key={`chem-${idx}`} style={{ marginRight: 10 }}>
                    <Image source={item.src} style={styles.preventionImage} resizeMode="cover" />
                    <Text style={styles.imageCaption}>{item.label}</Text>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.photosCountChip}>
                <Text style={styles.photosCountText}>{chemicalImages.length} photos</Text>
              </View>
            </View>
            <Text style={styles.bullet}>• Use insecticides only as directed under expert guidance.</Text>
            <Text style={styles.bullet}>• Adopt IPM: combine cultural, biological, and chemical methods.</Text>
            <Text style={styles.bullet}>• Target breeding sites or the tree crown with recommended chemicals.</Text>
            <Text style={styles.bullet}>• Follow safety and environmental precautions strictly.</Text>
          </View>
        )}

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
  logoBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#1F4D36', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#F2C200' },
  logoEmoji: { fontSize: 18 },
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  menuBackdropTouch: { ...StyleSheet.absoluteFillObject as any },
  menuSheet: {
    position: 'absolute', top: 60, left: 12, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 8, width: 220,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  menuItem: { paddingHorizontal: 16, paddingVertical: 14 },
  menuItemText: { color: '#111827', fontSize: 16, fontWeight: '700' },
  contentWrap: { padding: 16, paddingBottom: 120 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginTop: 8, marginBottom: 8 },
  sectionHeading: { fontSize: 16, fontWeight: '800', color: '#111827', marginTop: 12, marginBottom: -4, lineHeight: 18 },
  bullet: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 6 },
  imageCaption: { color: '#6B7280', fontSize: 12, marginTop: 2, marginBottom: 0 },
  imageCaptionSub: { color: '#9CA3AF', fontSize: 11, marginTop: 2, marginBottom: 0 },
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
    width: 220,
    height: 140,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#ffffff',
  },
  photosCountChip: {
    position: 'absolute',
    right: 8,
    bottom: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  photosCountText: { color: '#6B7280', fontSize: 12, fontWeight: '600' },
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
