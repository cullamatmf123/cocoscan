import React from 'react';
import { router } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutAppScreen() {
  return (
    <SafeAreaView style={styles.safe}> 
      <View style={styles.header}> 
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>About This App</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.appName}>COCOSCAN</Text>
        <Text style={styles.tagline}>Detect Oryctes Rhinoceros in Dwarf Coconut Trees.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.paragraph}>
            CocoScan helps growers quickly assess dwarf coconut trees for symptoms of coconut rhinoceros beetle
            (Oryctes rhinoceros) damage using their device camera. The app provides an AI prediction, confidence,
            and guidance links for prevention, control, and pesticide recommendations.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <Text style={styles.bullet}>• Camera-based scanning and AI prediction</Text>
          <Text style={styles.bullet}>• Simple history to review previous scans</Text>
          <Text style={styles.bullet}>• Information hub for prevention & pesticide guidance</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Credits</Text>
          <Text style={styles.paragraph}>Built with React Native, Expo Router, and community packages.</Text>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/home')}>
          <Text style={styles.primaryBtnText}>Go to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: '#EAF4EC',
    borderBottomColor: '#D5E6DA', borderBottomWidth: 1,
  },
  backBtn: { width: 60, paddingVertical: 8, paddingHorizontal: 6 },
  backText: { color: '#1F3D2A', fontSize: 16, fontWeight: '700' },
  title: {
    position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none',
    color: '#1F3D2A', fontSize: 20, fontWeight: '800', letterSpacing: 0.3,
  },
  content: { padding: 16, paddingBottom: 32, gap: 12 },
  appName: { fontSize: 22, fontWeight: '900', color: '#2d5a3d', textAlign: 'center' },
  tagline: { fontSize: 14, color: '#374151', textAlign: 'center', marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E5EFE8' },
  sectionTitle: { fontSize: 16, color: '#2d5a3d', fontWeight: '800', marginBottom: 6 },
  paragraph: { fontSize: 14, color: '#374151', lineHeight: 20 },
  bullet: { fontSize: 14, color: '#374151', lineHeight: 20 },
  primaryBtn: { backgroundColor: '#2d5a3d', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
