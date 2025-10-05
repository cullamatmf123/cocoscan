import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const initialTab =
    params?.tab === 'prevention' ? 'prevention' : params?.tab === 'pesticide' ? 'pesticide' : 'overview';
  const [tab, setTab] = useState<'overview' | 'prevention' | 'pesticide'>(initialTab);
  return (
    <SafeAreaView style={styles.safe}>
      {/* Image header */}
      <ImageBackground
        source={require('../assets/images/design/CRB.jpg')}
        style={styles.hero}
        imageStyle={styles.heroImage}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay} />
        
        <View style={styles.heroContent}>
          <Text style={styles.heroKicker}>Coconut Rhinoceros Beetle</Text>
          <Text style={styles.heroTitle}>Oryctes rhinoceros</Text>
        </View>
      </ImageBackground>

      {/* White content sheet with tabs */}
      <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
        <View style={styles.tabsRow}>
          <TouchableOpacity style={styles.tabBtn} onPress={() => setTab('overview')}>
            <Text style={[styles.tabText, tab === 'overview' && styles.tabTextActive]}>Overview</Text>
            {tab === 'overview' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabBtn} onPress={() => setTab('prevention')}>
            <Text style={[styles.tabText, tab === 'prevention' && styles.tabTextActive]}>Prevention & Control</Text>
            {tab === 'prevention' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabBtn} onPress={() => setTab('pesticide')}>
            <Text style={[styles.tabText, tab === 'pesticide' && styles.tabTextActive]}>Pesticide Recommendation</Text>
            {tab === 'pesticide' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        {tab === 'overview' && (
          <View>
            <Text style={styles.section}>Overview</Text>
            <Text style={styles.paragraph}>
              The coconut rhinoceros beetle (CRB) bores into the crown of coconut and oil palm to feed on sap,
              damaging developing fronds and reducing yield. Severe or repeated attacks can stunt palms and, in
              young plantings, cause mortality.
            </Text>

            <Text style={styles.section}>Key Signs</Text>
            <Text style={styles.bullet}>• V-shaped cuts on newly opened fronds</Text>
            <Text style={styles.bullet}>• Holes with coarse frass at the crown or leaf bases</Text>
            <Text style={styles.bullet}>• Shortened or broken spear leaves</Text>

            <Text style={styles.section}>Lifecycle & Behavior</Text>
            <Text style={styles.paragraph}>
              Adults are strong fliers. Breeding occurs in decomposing plant matter like rotting logs, mulch piles,
              or unmanaged farm residues. Larvae develop in these substrates before emerging as adults that fly to
              palms to feed.
            </Text>
          </View>
        )}

        {tab === 'prevention' && (
          <View>
            <Text style={styles.section}>Prevention & Control</Text>
            <Text style={styles.bullet}>• Sanitation: Remove or treat breeding sites; manage residues properly.</Text>
            <Text style={styles.bullet}>• Monitoring: Use pheromone traps to detect and reduce adult populations.</Text>
            <Text style={styles.bullet}>• Biological control: Apply Metarhizium anisopliae in breeding substrates.</Text>
            <Text style={styles.bullet}>• Inspection: Regularly check crowns; destroy detected adults safely.</Text>
          </View>
        )}

        {tab === 'pesticide' && (
          <View>
            <Text style={styles.section}>Pesticide Recommendation</Text>
            <Text style={styles.paragraph}>
              Select approved insecticides according to local regulations and label instructions. Prioritize
              integrated pest management (IPM) and target applications based on monitoring and thresholds. Consult
              your local agriculture authority for current recommendations.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom navigation */}
      <View style={styles.bottomWrap} pointerEvents="box-none">
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/home')}>
            <Ionicons name="home-outline" size={26} color="#475569" />
          </TouchableOpacity>
          <View style={styles.navSpacer} />
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
            <Ionicons name="person-outline" size={26} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* Center floating camera button */}
        <View style={styles.fabContainer} pointerEvents="box-none">
          <TouchableOpacity style={styles.fab} onPress={() => router.replace('/camera')}>
            <Ionicons name="camera" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  hero: {
    height: 220,
    width: '100%',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    overflow: 'hidden',
  },
  heroImage: {
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject as any,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroHeaderRow: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  heroBackBtn: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 999,
  },
  heroBackText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  heroKicker: {
    color: '#E5F2E9',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  sheetContent: {
    padding: 16,
    paddingTop: 18,
    paddingBottom: 120,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  tabBtn: {
    alignItems: 'center',
  },
  tabText: {
    color: '#6b7280',
    fontWeight: '700',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#22c55e',
  },
  tabUnderline: {
    height: 3,
    backgroundColor: '#22c55e',
    borderRadius: 999,
    width: '60%',
    marginTop: 2,
  },
  section: { fontSize: 16, fontWeight: '800', color: '#2d5a3d', marginTop: 8, marginBottom: 6 },
  paragraph: { fontSize: 14, color: '#374151', lineHeight: 20 },
  bullet: { fontSize: 14, color: '#374151', lineHeight: 20 },
  bottomWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 60,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
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
