import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';

const SCREEN = Dimensions.get('window');

export default function PreventionControlScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.brandTitle}>COCOSCAN</Text>
      </View>

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
  brandTitle: {
    color: '#0F3D1E',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  contentWrap: { padding: 16, paddingBottom: 24 },
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
    marginTop: -6,
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
  footerBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  footerItem: { flex: 1, alignItems: 'center' },
});
