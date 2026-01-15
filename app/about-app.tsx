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
          <Text style={styles.logoEmoji}>🥥</Text>
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
        {/* Hero Section */}
        <View style={styles.heroWrapper}>
          <ImageBackground
            source={require('../assets/images/design/dwarf-coconut-tree.webp')}
            style={styles.heroBg}
            imageStyle={styles.heroBgImage}
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.heroIconBadge}>
                <Ionicons name="shield-checkmark" size={28} color="#F2C200" />
              </View>
              <Text style={styles.heroTitle}>Protecting Your Palms</Text>
              <Text style={styles.heroSubtitle}>I'm here to help growers detect and prevent CRB damage with AI-powered insights.</Text>
            </View>
          </ImageBackground>
        </View>

        {/* About Section */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="information-circle" size={22} color="#0F3D1E" />
            </View>
            <Text style={styles.aboutTitle}>About CocoScan</Text>
          </View>
          
          <View style={styles.aboutContent}>
            <Image
              source={require('../assets/images/design/capture-crb.png')}
              style={styles.aboutPhoto}
              resizeMode="cover"
            />
            <View style={styles.aboutTextCol}>
              <Text style={styles.paragraph}>
                CocoScan helps growers quickly assess dwarf coconut trees by scanning coconut rhinoceros beetle (Oryctes rhinoceros) damage using their device camera.
              </Text>
              <Text style={styles.paragraph}>
                The app provides AI-powered predictions with confidence scores, and links to prevention, control, and pesticide recommendations, empowering you to act confidently in the field.
              </Text>
            </View>
          </View>
        </View>

        {/* Key Features */}
        <View style={[styles.card, styles.cardShadow]}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="list" size={20} color="#0F3D1E" />
            </View>
            <Text style={styles.sectionTitle}>Key Features</Text>
          </View>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name="camera-outline" size={20} color="#0F3D1E" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>AI-Powered Scanning</Text>
                <Text style={styles.featureDesc}>Camera-based detection with instant AI predictions</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name="bug-outline" size={20} color="#0F3D1E" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>CRB Detection</Text>
                <Text style={styles.featureDesc}>Identifies Oryctes Rhinoceros presence and damage signs</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name="create-outline" size={20} color="#0F3D1E" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Manual Input</Text>
                <Text style={styles.featureDesc}>Record weather, soil conditions, and observations</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name="time-outline" size={20} color="#0F3D1E" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Scan History</Text>
                <Text style={styles.featureDesc}>Review and track previous assessments over time</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name="book-outline" size={20} color="#0F3D1E" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Knowledge Hub</Text>
                <Text style={styles.featureDesc}>Prevention strategies and pesticide guidance</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Technology Stack */}
        <View style={[styles.card, styles.cardShadow]}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="code-slash" size={20} color="#0F3D1E" />
            </View>
            <Text style={styles.sectionTitle}>Built With</Text>
          </View>
          <Text style={styles.paragraph}>
            Developed using modern technologies for a seamless, responsive experience across all devices.
          </Text>
          <View style={styles.techStack}>
            <View style={styles.techBadge}>
              <Ionicons name="logo-react" size={16} color="#0F3D1E" />
              <Text style={styles.techText}>React Native</Text>
            </View>
            <View style={styles.techBadge}>
              <Ionicons name="navigate-circle-outline" size={16} color="#0F3D1E" />
              <Text style={styles.techText}>Expo Router</Text>
            </View>
            <View style={styles.techBadge}>
              <Ionicons name="flash-outline" size={16} color="#0F3D1E" />
              <Text style={styles.techText}>Expo SDK</Text>
            </View>
            <View style={styles.techBadge}>
              <Ionicons name="sparkles-outline" size={16} color="#0F3D1E" />
              <Text style={styles.techText}>TensorFlow</Text>
            </View>
          </View>
        </View>

        {/* Mission Statement */}
        <View style={styles.missionCard}>
          <View style={styles.missionIconWrapper}>
            <Text style={styles.missionEmoji}>🌴</Text>
          </View>
          <Text style={styles.missionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            Empowering coconut farmers with accessible AI technology to protect their crops, 
            increase yields, and build sustainable farming practices for future generations.
          </Text>
        </View>

        <View style={{ height: 40 }} />
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  hamburger: {
    padding: 8,
    zIndex: 10,
  },
  menuLineDark: {
    width: 24,
    height: 3,
    backgroundColor: '#0F3D1E',
    marginVertical: 2.5,
    borderRadius: 2
  },
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
  logoEmoji: { 
    fontSize: 20 
  },
  
  /* Menu Modal */
  menuBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.3)' 
  },
  menuBackdropTouch: {
    ...StyleSheet.absoluteFillObject as any,
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16
  },
  menuIcon: {
    marginRight: 14,
    width: 20,
  },
  menuItemText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 12,
  },
  
  /* Content */
  content: { 
    padding: 20, 
    paddingBottom: 120,
  },
  
  /* Hero Section */
  heroWrapper: { 
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  heroBg: { 
    height: 220,
    justifyContent: 'flex-end',
  },
  heroBgImage: { 
    borderRadius: 20,
  },
  heroOverlay: { 
    ...StyleSheet.absoluteFillObject as any, 
    backgroundColor: 'rgba(15, 61, 30, 0.75)',
  },
  heroContent: {
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  heroIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(31, 77, 54, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F2C200',
    marginBottom: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.95,
    paddingHorizontal: 8,
  },
  
  /* About Card */
  aboutCard: {
    backgroundColor: '#EAF5EE',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CFE6D2',
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  aboutTitle: { 
    fontSize: 20,
    color: '#0F3D1E',
    fontWeight: '900',
    flex: 1,
  },
  aboutContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  aboutPhoto: { 
    width: 120,
    height: 120,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  aboutTextCol: { 
    flex: 1,
    gap: 12,
  },
  
  /* Cards */
  card: { 
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  
  /* Section Headers */
  sectionHeader: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
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
  sectionTitle: { 
    fontSize: 18,
    color: '#111827',
    fontWeight: '900',
    flex: 1,
  },
  
  paragraph: { 
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  
  /* Features List */
  featuresList: {
    gap: 12,
  },
  featureItem: { 
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 14,
  },
  featureIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.2,
  },
  featureDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  
  /* Technology Stack */
  techStack: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  techBadge: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
  },
  techText: { 
    color: '#0F3D1E',
    fontWeight: '800',
    fontSize: 13,
  },
  
  /* Mission Card */
  missionCard: {
    backgroundColor: '#0F3D1E',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    marginBottom: 16,
  },
  missionIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(242, 194, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#F2C200',
  },
  missionEmoji: {
    fontSize: 36,
  },
  missionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F2C200',
    marginBottom: 12,
    textAlign: 'center',
  },
  missionText: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.95,
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
});