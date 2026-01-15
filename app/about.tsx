import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header with hamburger */}
      <View style={styles.headerBar}>
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
              <Feather name="user" size={18} color="#111827" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/about-app'); }}>
              <Feather name="info" size={18} color="#111827" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.replace('/'); }}>
              <Feather name="log-out" size={18} color="#DC2626" style={styles.menuIcon} />
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentWrap} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Coconut Rhinoceros Beetle</Text>
              <View style={styles.scientificNameBadge}>
                <Text style={styles.scientificLabel}>Scientific Name</Text>
                <Text style={styles.scientificName}>Oryctes Rhinoceros</Text>
              </View>
            </View>
          </View>

          {/* Photos Slider */}
          <View style={styles.photoStripWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photoRow}
            >
              <Image source={require('../assets/images/design/homepage.png')} style={styles.photo} resizeMode="cover" />
              <Image source={require('../assets/images/design/CRB.jpg')} style={styles.photo} resizeMode="cover" />
              <Image source={require('../assets/images/design/crb(2).png')} style={styles.photo} resizeMode="cover" />
              <Image source={require('../assets/images/design/crb(3).png')} style={styles.photo} resizeMode="cover" />
              <Image source={require('../assets/images/design/crb(4).png')} style={styles.photo} resizeMode="cover" />
            </ScrollView>
            <View style={styles.photosCountChip}>
              <Feather name="image" size={12} color="#6B7280" />
              <Text style={styles.photosCountText}>5 photos</Text>
            </View>
          </View>
        </View>

        {/* Overview */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Feather name="book-open" size={18} color="#0F3D1E" />
            </View>
            <Text style={styles.sectionCardHeading}>Overview</Text>
          </View>
          <Text style={styles.paragraph}>
            The Coconut Rhinoceros Beetle (Oryctes rhinoceros) is a common and destructive pest that primarily attacks coconut
            palms and other palm species by boring into the crown to feed on sap, damaging young fronds and inhibiting
            leaf and flower development. Native to South and Southeast Asia, this beetle has spread to many tropical
            regions. Its rapid reproduction and adaptability make it a major threat to coconut productivity.
          </Text>
          <Text style={styles.paragraph}>
            Adults boring into the crown and spear leaf can repeatedly wound the growing point, causing the familiar
            V-shaped cuts, canopy decline, and substantial yield losses; severe or sustained attacks may kill young
            palms. Outbreaks spread quickly where breeding sites and favorable weather persist, making early detection
            and control essential.
          </Text>
        </View>

        {/* Signs */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Feather name="eye" size={18} color="#0F3D1E" />
            </View>
            <Text style={styles.sectionCardHeading}>Signs of Infestation</Text>
          </View>
          
          <View style={styles.photoStripWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.signsRow}
            >
              <Image source={require('../assets/images/design/v-cut-sign.jpg')} style={styles.signImage} resizeMode="cover" />
              <Image source={require('../assets/images/design/sign(2).png')} style={styles.signImage} resizeMode="cover" />
              <Image source={require('../assets/images/design/v-cut(2).jpg')} style={styles.signImage} resizeMode="cover" />
              <Image source={require('../assets/images/design/sign(3).jpg')} style={styles.signImage} resizeMode="cover" />
            </ScrollView>
            <View style={styles.photosCountChip}>
              <Feather name="image" size={12} color="#6B7280" />
              <Text style={styles.photosCountText}>4 photos</Text>
            </View>
          </View>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>V-shaped cuts or holes on young, unopened fronds</Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>Boreholes visible on the crown or trunk</Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>Frass (fibrous debris) around leaf bases and at bore entry</Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>Notched or missing tissues along leaflet margins</Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>Damaged or broken spear leaf</Text>
            </View>
          </View>
        </View>

        {/* Symptoms */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Feather name="alert-circle" size={18} color="#0F3D1E" />
            </View>
            <Text style={styles.sectionCardHeading}>Damage Symptoms</Text>
          </View>
          
          <View style={styles.photoStripWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.signsRow}
            >
              <Image source={require('../assets/images/design/Symptoms(2).jpg')} style={styles.signImage} resizeMode="cover" />
              <Image source={require('../assets/images/design/Symptoms(3).jpg')} style={styles.signImage} resizeMode="cover" />
              <Image source={require('../assets/images/design/Symptoms(3).jpg')} style={styles.signImage} resizeMode="cover" />
              <Image source={require('../assets/images/design/Symptoms(4).jpg')} style={styles.signImage} resizeMode="cover" />
            </ScrollView>
            <View style={styles.photosCountChip}>
              <Feather name="image" size={12} color="#6B7280" />
              <Text style={styles.photosCountText}>4 photos</Text>
            </View>
          </View>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>Distorted or stunted emerging fronds; reduced canopy density</Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>Declining vigor and reduced nut yield over time</Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>Secondary infections in damaged crown tissue</Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>Severe, repeated attacks may lead to palm death (especially young palms)</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} accessibilityLabel="Go to Home">
          <Feather name="home" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/camera')} accessibilityLabel="Open Camera">
          <View style={styles.cameraButton}>
            <Feather name="camera" size={26} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/history')} accessibilityLabel="View History">
          <Feather name="clock" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/profile')} accessibilityLabel="Open Profile">
          <Feather name="user" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  headerBar: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  hamburger: { padding: 8, zIndex: 10 },
  menuLineDark: { width: 24, height: 3, backgroundColor: '#0F3D1E', marginVertical: 2.5, borderRadius: 2 },
  brandTitle: {
    color: '#0F3D1E',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  logoBadge: { 
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    backgroundColor: '#1F4D36', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 3, 
    borderColor: '#F2C200',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  logoEmoji: { fontSize: 20 },
  
  contentWrap: { padding: 20, paddingBottom: 32 },
  
  heroSection: { marginBottom: 8 },
  titleRow: { marginBottom: 16 },
  titleContainer: { gap: 10 },
  title: { fontSize: 26, fontWeight: '900', color: '#111827', lineHeight: 32 },
  scientificNameBadge: { 
    backgroundColor: '#F0FDF4', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignSelf: 'flex-start',
  },
  scientificLabel: { fontSize: 10, color: '#166534', fontWeight: '600', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  scientificName: { fontSize: 15, color: '#0F3D1E', fontWeight: '700', fontStyle: 'italic' },
  
  photoStripWrap: { position: 'relative', marginTop: 6 },
  photoRow: { flexDirection: 'row', gap: 14, paddingRight: 6 },
  photo: { 
    width: 240, 
    height: 140, 
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  signsRow: { flexDirection: 'row', gap: 12, marginBottom: 16, paddingRight: 6 },
  signImage: { 
    width: 200, 
    height: 120, 
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  photosCountChip: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  photosCountText: { color: '#374151', fontSize: 12, fontWeight: '700' },
  
  sectionCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 18, 
    padding: 18, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    marginTop: 12, 
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.04, 
    shadowRadius: 12, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 2 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    marginBottom: 14 
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
  },
  sectionCardHeading: { fontSize: 18, fontWeight: '900', color: '#111827', flex: 1 },
  
  paragraph: { 
    fontSize: 15, 
    color: '#374151', 
    lineHeight: 24, 
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  
  bulletList: { gap: 10 },
  bulletItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  bulletDot: { 
    width: 7, 
    height: 7, 
    borderRadius: 3.5, 
    backgroundColor: '#0F3D1E', 
    marginTop: 7,
  },
  bulletText: { 
    flex: 1, 
    fontSize: 15, 
    color: '#374151', 
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  menuBackdropTouch: { ...StyleSheet.absoluteFillObject as any },
  menuSheet: {
    position: 'absolute', 
    top: 72, 
    left: 16, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 18, 
    paddingVertical: 6, 
    width: 220,
    shadowColor: '#000', 
    shadowOpacity: 0.25, 
    shadowRadius: 16, 
    shadowOffset: { width: 0, height: 8 }, 
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  menuItem: { 
    paddingHorizontal: 18, 
    paddingVertical: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 14 
  },
  menuIcon: { width: 20 },
  menuItemText: { color: '#111827', fontSize: 16, fontWeight: '700', flex: 1 },
  menuDivider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 12 },
  
  footerBar: {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, 
    borderTopColor: '#E5E7EB', 
    paddingVertical: 8, 
    paddingHorizontal: 8,
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  footerItem: { 
    flex: 1, 
    alignItems: 'center', 
    gap: 4,
    paddingVertical: 4,
  },
  footerLabel: { 
    fontSize: 11, 
    color: '#6B7280', 
    fontWeight: '600',
    marginTop: 2,
  },
  cameraButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0F3D1E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginTop: -28,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
});