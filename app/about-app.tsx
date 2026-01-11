import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutAppScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <SafeAreaView style={styles.safe}> 
      {/* App Bar */}
      <View style={styles.appBar}> 
        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuVisible(true)} accessibilityLabel="Open menu">
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
      
      {/* Footer navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} activeOpacity={0.7} accessibilityLabel="Go to Home">
          <Feather name="home" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/camera')} activeOpacity={0.7} accessibilityLabel="Open Camera">
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  content: { 
    padding: 16, 
    paddingBottom: 120, 
    gap: 16 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 14, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#E5EFE8' 
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  heroWrapper: { 
    borderRadius: 16, 
    overflow: 'hidden' 
  },
  heroBg: { 
    height: 180, 
    borderRadius: 16, 
    justifyContent: 'flex-end' 
  },
  heroBgImage: { 
    borderRadius: 16 
  },
  heroOverlay: { 
    ...StyleSheet.absoluteFillObject as any, 
    backgroundColor: 'rgba(16, 48, 28, 0.35)' 
  },
  heroTextBox: { 
    padding: 16 
  },
  heroLine1: { 
    color: '#ffffff', 
    fontSize: 18, 
    fontWeight: '800', 
    letterSpacing: 0.2 
  },
  sectionBlock: { 
    backgroundColor: '#EAF5EE', 
    borderRadius: 16, 
    padding: 16 
  },
  aboutTitle: { 
    fontSize: 18, 
    color: '#2d5a3d', 
    fontWeight: '900', 
    marginBottom: 10 
  },
  aboutRow: { 
    flexDirection: 'row', 
    gap: 12, 
    alignItems: 'stretch' 
  },
  aboutPhoto: { 
    width: 110, 
    height: 110, 
    borderRadius: 16 
  },
  aboutTextCol: { 
    flex: 1, 
    gap: 8 
  },
  imageRowBlock: { 
    gap: 10 
  },
  bannerImage: { 
    width: '100%', 
    height: 160, 
    borderRadius: 16 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginBottom: 8 
  },
  sectionTitle: { 
    fontSize: 16, 
    color: '#2d5a3d', 
    fontWeight: '800' 
  },
  paragraph: { 
    fontSize: 14, 
    color: '#374151', 
    lineHeight: 20 
  },
  featuresCard: { 
    backgroundColor: '#FFFFFF' 
  },
  featureItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F7FBF8', 
    borderRadius: 12, 
    paddingVertical: 10, 
    paddingHorizontal: 12, 
    borderWidth: 1, 
    borderColor: '#E5EFE8' 
  },
  featureIcon: { 
    marginRight: 10 
  },
  featureText: { 
    color: '#374151', 
    fontSize: 14, 
    flex: 1 
  },
  badgesRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginTop: 12 
  },
  badge: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderWidth: 1, 
    borderColor: '#CFE6D2', 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 3 }, 
    elevation: 1 
  },
  badgeText: { 
    color: '#2d5a3d', 
    fontWeight: '800', 
    fontSize: 12 
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