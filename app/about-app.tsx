import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutAppScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeCredits, setActiveCredits] = useState<'dev' | 'res' | null>(null);

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
              <Text style={styles.heroTitle}>Classifying CRB Infestation</Text>
              <Text style={styles.heroSubtitle}>
                AI-powered visual classification of Oryctes rhinoceros infestation in dwarf coconut trees — right from your mobile device.
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* About Section */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="information-circle" size={22} color="#1F7A3E" />
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
                CocoScan is a mobile application that classifies the condition of dwarf coconut trees based on visual indicators of Coconut Rhinoceros Beetle (Oryctes rhinoceros) infestation using a YOLOv8-based image classification model.
              </Text>
              <Text style={styles.paragraph}>
                The system classifies coconut tree images into four categories: Infested by CRB, Not Infested, Infestation from Other Pest, and Unspecified — with a model accuracy of 98.57%.
              </Text>
            </View>
          </View>
        </View>

        {/* Classification Categories */}
        <View style={[styles.card, styles.cardShadow]}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="git-branch-outline" size={20} color="#1F7A3E" />
            </View>
            <Text style={styles.sectionTitle}>Classification Categories</Text>
          </View>

          <View style={styles.featuresList}>
            {[
              {
                icon: 'bug-outline',
                title: 'Infested by CRB',
                desc: 'Trees showing visible CRB indicators such as V-shaped leaf cuts, boreholes, and observable infestation symptoms associated with Oryctes rhinoceros.',
              },
              {
                icon: 'leaf-outline',
                title: 'Not Infested',
                desc: 'Healthy coconut trees that do not exhibit visible signs of CRB infestation.',
              },
              {
                icon: 'alert-circle-outline',
                title: 'Other Damage or Abnormalities',
                desc: 'Coconut trees exhibiting symptoms not directly attributable to CRB, including unrelated forms of damage or abnormal conditions.',
              },
            ].map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <View style={styles.featureIconWrapper}>
                  <Ionicons name={f.icon as any} size={20} color="#1F7A3E" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Key Features */}
        <View style={[styles.card, styles.cardShadow]}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="list" size={20} color="#1F7A3E" />
            </View>
            <Text style={styles.sectionTitle}>Key Features</Text>
          </View>

          <View style={styles.featuresList}>
            {[
              { icon: 'camera-outline', title: 'Image Capture & Classification', desc: 'Capture coconut tree images and receive real-time YOLOv8-based classification results.' },
              { icon: 'shield-checkmark-outline', title: 'Pest Management Recommendations', desc: 'Get context-sensitive prevention, control, and pesticide recommendations based on classification.' },
              { icon: 'create-outline', title: 'Environmental Data Input', desc: 'Manually log climate and soil conditions as supplementary context for farm monitoring.' },
              { icon: 'time-outline', title: 'Scan History Tracking', desc: 'Review and monitor previous classification results over time.' },
              { icon: 'chatbubble-outline', title: 'User Feedback', desc: 'Submit ratings and suggestions to help continuously improve the system.' },
            ].map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <View style={styles.featureIconWrapper}>
                  <Ionicons name={f.icon as any} size={20} color="#1F7A3E" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Technology Stack */}
        <View style={[styles.card, styles.cardShadow]}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="code-slash" size={20} color="#1F7A3E" />
            </View>
            <Text style={styles.sectionTitle}>Built With</Text>
          </View>
          <Text style={styles.paragraph}>
            Developed using modern technologies for a seamless, real-time classification experience on Android devices.
          </Text>
          <View style={styles.techStack}>
            {[
              { icon: 'logo-react', label: 'React Native (Expo)' },
              { icon: 'code-outline', label: 'JavaScript' },
              { icon: 'terminal-outline', label: 'TypeScript' },
              { icon: 'sparkles-outline', label: 'YOLOv8n-cls' },
              { icon: 'cloud-outline', label: 'Roboflow' },
              { icon: 'flame-outline', label: 'Firebase' },
              { icon: 'logo-github', label: 'Hugging Face' },
            ].map((t, i) => (
              <View key={i} style={styles.techBadge}>
                <Ionicons name={t.icon as any} size={15} color="#1F7A3E" />
                <Text style={styles.techText}>{t.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Model Performance */}
        <View style={[styles.card, styles.cardShadow]}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="stats-chart" size={20} color="#1F7A3E" />
            </View>
            <Text style={styles.sectionTitle}>Model Performance</Text>
          </View>
          <Text style={styles.paragraph}>
            The YOLOv8n-cls model was trained on 14,000 annotated images across four classes using Roboflow, with GPU-accelerated training on a Tesla T4.
          </Text>
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>98.57%</Text>
              <Text style={styles.statLabel}>Top-1 Accuracy</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0.99</Text>
              <Text style={styles.statLabel}>F1-Score</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>14,000</Text>
              <Text style={styles.statLabel}>Images</Text>
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
            Empowering smallholder coconut farmers with accessible AI technology to classify CRB infestation early, reduce crop damage, and support sustainable farming practices in Kinawitnon, Babak, Island Garden City of Samal.
          </Text>
        </View>

        {/* Interactive Credits — DO NOT TOUCH */}
        <View style={styles.creditsBlock}>
          <View style={styles.creditsDivider} />
          <View style={styles.creditsButtonRow}>
            <TouchableOpacity
              style={[styles.creditsBtn, activeCredits === 'dev' && styles.creditsBtnActive]}
              onPress={() => setActiveCredits(activeCredits === 'dev' ? null : 'dev')}
              activeOpacity={0.7}
            >
              <Ionicons name="code-slash-outline" size={11} color={activeCredits === 'dev' ? '#0F3D1E' : '#9CA3AF'} style={{ marginRight: 4 }} />
              <Text style={[styles.creditsBtnText, activeCredits === 'dev' && styles.creditsBtnTextActive]}>Developers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.creditsBtn, activeCredits === 'res' && styles.creditsBtnActive]}
              onPress={() => setActiveCredits(activeCredits === 'res' ? null : 'res')}
              activeOpacity={0.7}
            >
              <Ionicons name="flask-outline" size={11} color={activeCredits === 'res' ? '#0F3D1E' : '#9CA3AF'} style={{ marginRight: 4 }} />
              <Text style={[styles.creditsBtnText, activeCredits === 'res' && styles.creditsBtnTextActive]}>Researchers</Text>
            </TouchableOpacity>
          </View>

          {activeCredits === 'dev' && (
            <View style={styles.creditsPopBox}>
              <Text style={styles.creditsPopTitle}>System Developers</Text>
              <View style={styles.creditsPopDivider} />
              <Text style={styles.creditsPopName}>Francelyn Estorpe</Text>
              <Text style={styles.creditsPopName}>Mark Francis Cullamat</Text>
            </View>
          )}
          {activeCredits === 'res' && (
            <View style={styles.creditsPopBox}>
              <Text style={styles.creditsPopTitle}>Research Team</Text>
              <View style={styles.creditsPopDivider} />
              <Text style={styles.creditsPopName}>Francelyn Estorpe</Text>
              <Text style={styles.creditsPopName}>Mark Francis Cullamat</Text>
              <Text style={styles.creditsPopName}>Kaella May Cueme</Text>
              <Text style={styles.creditsPopName}>Stephen Dualan</Text>
            </View>
          )}
          <View style={styles.creditsDivider} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Footer navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} activeOpacity={0.7}>
          <Feather name="home" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/camera')} activeOpacity={0.7}>
          <Feather name="camera" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/history')} activeOpacity={0.7}>
          <Feather name="clock" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/profile')} activeOpacity={0.7}>
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
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  hamburger: { padding: 8, zIndex: 10 },
  menuLineDark: {
    width: 22,
    height: 2.5,
    backgroundColor: '#1F7A3E',
    marginVertical: 2.5,
    borderRadius: 2,
  },
  brandTitle: {
    color: '#1A1A1A',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1F7A3E',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  logoEmoji: { fontSize: 18 },

  /* Menu Modal */
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  menuBackdropTouch: { ...StyleSheet.absoluteFillObject as any },
  menuSheet: {
    position: 'absolute',
    top: 72,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    width: 210,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 15 },
  menuIcon: { marginRight: 12, width: 20 },
  menuItemText: { color: '#111827', fontSize: 15, fontWeight: '700', flex: 1 },
  menuDivider: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 12 },

  /* Content */
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
    backgroundColor: '#FFFFFF',
  },

  /* Hero */
  heroWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#1F7A3E',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  heroBg: { height: 210, justifyContent: 'flex-end' },
  heroBgImage: { borderRadius: 18 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject as any,
    backgroundColor: 'rgba(10, 40, 20, 0.65)',
  },
  heroContent: { padding: 22, alignItems: 'center', gap: 8 },
  heroIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(242,194,0,0.8)',
    marginBottom: 2,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },

  /* About Card */
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8F5EC',
    shadowColor: '#1F7A3E',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  aboutHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  aboutTitle: { fontSize: 18, color: '#1A1A1A', fontWeight: '900', flex: 1 },
  aboutContent: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  aboutPhoto: {
    width: 110,
    height: 110,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8F5EC',
  },
  aboutTextCol: { flex: 1, gap: 10 },

  /* Cards */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 14,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  /* Section Headers */
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F2FBF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1EDD9',
  },
  sectionTitle: { fontSize: 17, color: '#1A1A1A', fontWeight: '900', flex: 1 },

  paragraph: { fontSize: 14, color: '#4B5563', lineHeight: 22, letterSpacing: 0.1 },

  /* Features */
  featuresList: { gap: 10 },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAFFFE',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EAF5EE',
    gap: 12,
  },
  featureIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F2FBF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1EDD9',
  },
  featureContent: { flex: 1, gap: 3 },
  featureTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', letterSpacing: 0.1 },
  featureDesc: { fontSize: 12, color: '#6B7280', lineHeight: 17 },

  /* Tech Stack */
  techStack: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  techBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F2FBF5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#D1EDD9',
  },
  techText: { color: '#1F7A3E', fontWeight: '800', fontSize: 12 },

  /* Model Performance Stats */
  statRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F2FBF5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1EDD9',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F7A3E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  /* Mission Card */
  missionCard: {
    backgroundColor: '#0F3D1E',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#0F3D1E',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    marginBottom: 14,
  },
  missionIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: 'rgba(242,194,0,0.6)',
  },
  missionEmoji: { fontSize: 32 },
  missionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F2C200',
    marginBottom: 10,
    textAlign: 'center',
  },
  missionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.1,
  },

  /* Interactive Credits — UNCHANGED */
  creditsBlock: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
    gap: 10,
  },
  creditsDivider: {
    width: 40,
    height: 1,
    backgroundColor: '#D1D5DB',
    borderRadius: 1,
    marginVertical: 2,
  },
  creditsButtonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  creditsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  creditsBtnActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  creditsBtnText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  creditsBtnTextActive: {
    color: '#0F3D1E',
  },
  creditsPopBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: 4,
    minWidth: 200,
  },
  creditsPopTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F3D1E',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  creditsPopDivider: {
    width: 30,
    height: 1,
    backgroundColor: '#BBF7D0',
    borderRadius: 1,
    marginBottom: 4,
  },
  creditsPopName: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },

  /* Footer */
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 6,
  },
  footerItem: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4 },
  footerLabel: { fontSize: 11, color: '#6B7280', fontWeight: '600', marginTop: 2 },
});