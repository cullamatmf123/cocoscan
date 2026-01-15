import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions, Image, ImageBackground, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🌴</Text>
        </View>
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
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/about-app'); }}>
              <Ionicons name="information-circle-outline" size={20} color="#1F3D2A" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.replace('/'); }}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" style={styles.menuIcon} />
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentWrap} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Prevention</Text>

        <Text style={[styles.sectionHeading, { marginBottom: 8 }]}>Prevention & Control</Text>
        <Text style={[styles.sectionHeading, { marginBottom: 6 }]}>Cultural Control</Text>
        <View style={styles.imageBg}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -6 }}>
            <View style={{ width: 6 }} />
            {sanitationImages.map((src, idx) => (
              <Image key={`pre-top-${idx}`} source={src} style={styles.preventionImage} resizeMode="cover" />
            ))}
            <View style={{ width: 6 }} />
          </ScrollView>
          
          <View style={styles.photosCountChip}>
            <Text style={styles.photosCountText}>{sanitationImages.length} photos</Text>
          </View>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
          style={{ marginHorizontal: -16 }}
        >
          <View style={{ width: 16 }} />
          <TouchableOpacity
            onPress={() => handleTabPress(0)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={[activeTab === 0 ? styles.tabItemActive : styles.tabItem, { paddingHorizontal: 12 }]}
          >
            <Text style={activeTab === 0 ? styles.tabTextActive : styles.tabText}>Sanitation & Habitat Management</Text>
            {activeTab === 0 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabPress(1)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={[activeTab === 1 ? styles.tabItemActive : styles.tabItem, { paddingHorizontal: 12 }]}
          >
            <Text style={activeTab === 1 ? styles.tabTextActive : styles.tabText}>Monitoring & Early Detection</Text>
            {activeTab === 1 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabPress(2)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={[activeTab === 2 ? styles.tabItemActive : styles.tabItem, { paddingHorizontal: 12 }]}
          >
            <Text style={activeTab === 2 ? styles.tabTextActive : styles.tabText}>Preventing Spread</Text>
            {activeTab === 2 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <View style={{ width: 16 }} />
        </ScrollView>

        {/* Content area: not swipeable; switches only on tab press */}
        {activeTab === 0 && (
          <View>
            
            <Text style={styles.infoHeading}>Remove breeding sites</Text>
            <Text style={styles.infoBody}>Chop up and destroy decaying logs, stumps, dead leaves, and dead standing palms—prime CRB larval habitats.</Text>

            <Text style={styles.infoHeading}>Compost properly</Text>
            <Text style={styles.infoBody}>Turn piles regularly so they don't harbor larvae; spread thin layers to make breeding unsuitable.</Text>

            <Text style={styles.infoHeading}>Cover stumps</Text>
            <Text style={styles.infoBody}>When removal isn't possible, plant vines or ground cover over stumps to deter egg‑laying.</Text>

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
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
          style={{ marginHorizontal: -16 }}
        >
          <View style={{ width: 16 }} />
          <TouchableOpacity
            onPress={() => handleControlTabPress(0)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={[controlTab === 0 ? styles.tabItemActive : styles.tabItem, { paddingHorizontal: 12 }]}
          >
            <Text style={controlTab === 0 ? styles.tabTextActive : styles.tabText}>Mechanical Control</Text>
            {controlTab === 0 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleControlTabPress(1)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={[controlTab === 1 ? styles.tabItemActive : styles.tabItem, { paddingHorizontal: 12 }]}
          >
            <Text style={controlTab === 1 ? styles.tabTextActive : styles.tabText}>Biological Control</Text>
            {controlTab === 1 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleControlTabPress(2)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={[controlTab === 2 ? styles.tabItemActive : styles.tabItem, { paddingHorizontal: 12 }]}
          >
            <Text style={controlTab === 2 ? styles.tabTextActive : styles.tabText}>Trapping Methods</Text>
            {controlTab === 2 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleControlTabPress(3)}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={[controlTab === 3 ? styles.tabItemActive : styles.tabItem, { paddingHorizontal: 12 }]}
          >
            <Text style={controlTab === 3 ? styles.tabTextActive : styles.tabText}>Chemical Control</Text>
            {controlTab === 3 && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <View style={{ width: 16 }} />
        </ScrollView>

        {controlTab === 0 && (
          <View style={styles.contentSection}>
            <View style={styles.imageBg}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -6 }}>
                <View style={{ width: 6 }} />
                {controlMechanicalImages.map((src, idx) => (
                  <Image key={`ctrl-mech-${idx}`} source={src} style={styles.preventionImage} resizeMode="cover" />
                ))}
                <View style={{ width: 6 }} />
              </ScrollView>
              <View style={styles.photosCountChip}>
                <Text style={styles.photosCountText}>{controlMechanicalImages.length} photos</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletPoint}>Manually remove adults from crowns and breeding sites.</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletPoint}>Deploy pheromone traps (ethyl 4-methyl octanoate) for monitoring and mass-trapping.</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletPoint}>Monitor after treatment to ensure populations stay low.</Text>
                </View>
                 <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletPoint}>Monitor after treatment to ensure populations stay low.</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {controlTab === 1 && (
          <View style={styles.contentSection}>
            <View style={styles.imageBg}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -6 }}>
                <View style={{ width: 6 }} />
                {ornvGmfImages.map((item, idx) => (
                  <View key={`ornvgmf-${idx}`} style={{ marginRight: 10 }}>
                    
                    <Image source={item.src} style={styles.preventionImage} resizeMode="cover" />
                    <Text style={styles.imageCaption}>{item.label}</Text>
                  </View>
                ))}
                <View style={{ width: 6 }} />
              </ScrollView>
              <Text style={[styles.imageCaption, { marginTop: 4 }]}>Online reference images</Text>
              <View style={styles.photosCountChip}>
                <Text style={styles.photosCountText}>{ornvGmfImages.length} photos</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletPoint}>Establishment of coconut log traps inoculated with Green Muscardine Fungus (GMF) granules.</Text>
                </View>
                
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletPoint}>Apply Metarhizium anisopliae (green fungus) to breeding sites.</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletPoint}>Encourage natural predators such as birds or parasitic insects.</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletPoint}>Use Oryctes rhinoceros nudivirus (OrNV) to infect and kill beetles naturally.</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.methodTitle}>Method of Application of FungOryctes</Text>
                 <ImageBackground
                  source={require('../assets/images/design/FungOryctes.jpg')}
                  style={{ width: '50%', height: 140, borderRadius: 12, overflow: 'hidden', marginTop: 8, marginBottom: 10,  alignSelf: 'center' }}
                  imageStyle={{ borderRadius: 12, resizeMode: 'cover' }}
                >
                </ImageBackground> 
                 <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
              <Text style={styles.bulletPoint}>An artificial breeding site is made by putting to-gether four, cut, one meter coconut logs. The cavity is filled to the brim with sawdust, coco peat, dry animal dung and other decomposed matter. At least one hundred grams (100g) of dried GMF is placed in two layers within the sawdust mixture.</Text>
               </View>
               <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
              <Text style={styles.bulletPoint}>The top is watered and covered with coconut fronds or banana leaves to maintain moisture and encourage fungal growth.</Text>
               </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
              <Text style={styles.bulletPoint}>Four to five log traps per hectare are positioned along the edges and center of the plantation or near breeding areas.</Text>
               </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
              <Text style={styles.bulletPoint}>If coconut stumps, saw dusts and fallen logs abound in the area and are starting to decom-pose, GMF can be applied directly to these breeding places. The media must be moist enough to encourage fungal growth.</Text>
               </View>
               </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {controlTab === 2 && (
          <View style={styles.contentSection}>
            <View style={styles.imageBg}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -6 }}>
                <View style={{ width: 6 }} />
                {monitoringImages.map((src, idx) => (
                  <Image key={`trap-strip-${idx}`} source={src} style={styles.preventionImage} resizeMode="cover" />
                ))}
                <View style={{ width: 6 }} />
              </ScrollView>
              <View style={styles.photosCountChip}>
                <Text style={styles.photosCountText}>{monitoringImages.length} photos</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.methodTitle}>Log Trapping</Text>
              <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
              <Text style={styles.bulletPoint}>Use fresh or decomposing coconut logs to attract adults for capture and to expose larvae in breeding material. Keep baits moist and service routinely.</Text>
               </View>
               <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
               <Text style={styles.bulletPoint}>Log traps can be inspected two months after installation to check for beetle presence. Infected larvae may be transferred to another log traps to reinforce existing inoculum</Text>
              </View>
              </View>
             
             

              <Text style={[styles.methodTitle, { marginTop: 16 }]}>Pheromone Trapping</Text>
              <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletPoint}>Deploy synthetic pheromone lures to detect populations early and reduce adults through mass trapping. Combine with sanitation for best results.</Text>
              </View>
              
              </View>
            </View>
          </View>
          
        )}


        {controlTab === 3 && (
          <View style={styles.contentSection}>
            <View style={styles.imageBg}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -6 }}>
                <View style={{ width: 6 }} />
                {chemicalImages.map((item, idx) => (
                  <View key={`chem-${idx}`} style={{ marginRight: 10 }}>
                    <Image source={item.src} style={styles.preventionImage} resizeMode="cover" />
                    <Text style={styles.imageCaption}>{item.label}</Text>
                  </View>
                ))}
                <View style={{ width: 6 }} />
              </ScrollView>
              <View style={styles.photosCountChip}>
                <Text style={styles.photosCountText}>{chemicalImages.length} photos</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletPoint}>Use insecticides only as directed under expert guidance.</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletPoint}>Adopt IPM: combine cultural, biological, and chemical methods.</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletPoint}>Target breeding sites or the tree crown with recommended chemicals.</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletPoint}>Follow safety and environmental precautions strictly.</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} activeOpacity={0.7} accessibilityLabel="Go to Home">
          <Feather name="home" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/camera')} activeOpacity={0.7} accessibilityLabel="Open Camera">
          <Feather name="camera" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/history')} activeOpacity={0.7} accessibilityLabel="View History">
          <Feather name="clock" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/profile')} activeOpacity={0.7} accessibilityLabel="Open Profile">
          <Feather name="user" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  
  /* App Bar */
  appBar: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
  },
  hamburger: {
    padding: 8,
    borderRadius: 12,
  },
  menuLineDark: {
    width: 26,
    height: 3,
    backgroundColor: '#0F3D1E',
    marginVertical: 3,
    borderRadius: 2
  },
  brandTitle: {
    color: '#0F3D1E',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F4D36',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F2C200',
    shadowColor: '#F2C200',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  logoEmoji: { 
    fontSize: 20 
  },
  
  /* Menu Modal */
  menuBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)' 
  },
  menuBackdropTouch: {
    ...StyleSheet.absoluteFillObject as any,
  },
  menuSheet: {
    position: 'absolute',
    top: 72,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    width: 240,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  menuIcon: {
    marginRight: 12
  },
  menuItemText: {
    color: '#1F3D2A',
    fontSize: 16,
    fontWeight: '600'
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 12,
  },
  
  /* Content */
  contentWrap: { 
    padding: 16, 
    paddingBottom: 120 
  },
  title: { 
    fontSize: 26, 
    fontWeight: '900', 
    color: '#111827', 
    marginTop: 8, 
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionHeading: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: '#111827', 
    marginTop: 20, 
    marginBottom: 8, 
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  bullet: { 
    fontSize: 15, 
    color: '#4B5563', 
    lineHeight: 24, 
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  bulletList: {
    marginTop: 4,
    gap: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginTop: 9,
    flexShrink: 0,
  },
  bulletPoint: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    letterSpacing: 0.2,
    fontWeight: '500',
  },
  contentSection: {
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5EFE8',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#047857',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  methodBody: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  imageCaption: { 
    color: '#6B7280', 
    fontSize: 12, 
    marginTop: 2, 
    marginBottom: 0 
  },
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
  photosCountText: { 
    color: '#6B7280', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  
  /* Tabs */
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 8,
    marginBottom: 12,
    paddingRight: 20,
  },
  tabItem: { 
    paddingBottom: 4,
    paddingHorizontal: 4,
    flexShrink: 0 
  },
  tabItemActive: { 
    paddingBottom: 4,
    paddingHorizontal: 4,
    flexShrink: 0 
  },
  tabText: { 
    color: '#6B7280', 
    fontSize: 15, 
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  tabTextActive: { 
    color: '#16A34A', 
    fontSize: 15, 
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  tabUnderline: { 
    height: 3, 
    backgroundColor: '#16A34A', 
    borderRadius: 2, 
    marginTop: 4, 
    width: '100%',
  },
  infoHeading: { 
    color: '#047857', 
    fontSize: 17, 
    fontWeight: '900', 
    marginTop: 16, 
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  infoBody: { 
    color: '#4B5563', 
    fontSize: 15, 
    lineHeight: 22, 
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  
  /* Footer */
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  footerLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
  },
});