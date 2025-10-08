import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Simple header */}
      <View style={styles.headerBar}>
        <Text style={styles.brandTitle}>COCOSCAN</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentWrap} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>Coconut Rhinoceros Beetle</Text>
        <Text style={styles.subtitle}>Scientific Name: <Text style={styles.italic}>Oryctes Rhinoceros</Text></Text>

        {/* Photos Slider */}
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
        <Text style={styles.photoCount}>5 photos</Text>

        {/* Overview */}
        <Text style={styles.sectionHeading}>Overview</Text>
        <Text style={styles.paragraph}>
          The Coconut Rhinoceros Beetle (Oryctes rhinoceros) is a destructive pest that primarily attacks coconut
          palms and other palm species by boring into the crown to feed on sap, damaging young fronds and inhibiting
          leaf and flower development. Native to South and Southeast Asia, this beetle has spread to many tropical
          regions. Its rapid reproduction and adaptability make it a major threat to coconut productivity.
        </Text>

        {/* Signs */}
        <Text style={styles.sectionHeading}>Signs:</Text>
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
        <Text style={styles.bullet}>• V-shaped cuts or holes on young, unopened fronds</Text>
        <Text style={styles.bullet}>• Boreholes visible on the crown or trunk</Text>
        <Text style={styles.bullet}>• Frass (fibrous debris) around leaf bases and at bore entry</Text>
        <Text style={styles.bullet}>• Notched or missing tissues along leaflet margins</Text>
        <Text style={styles.bullet}>• Damaged or broken spear leaf</Text>

        {/* Symptoms */}
        <Text style={styles.sectionHeading}>Symptoms:</Text>
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
        <Text style={styles.bullet}>• Distorted or stunted emerging fronds; reduced canopy density</Text>
        <Text style={styles.bullet}>• Declining vigor and reduced nut yield over time</Text>
        <Text style={styles.bullet}>• Secondary infections in damaged crown tissue</Text>
        <Text style={styles.bullet}>• Severe, repeated attacks may lead to palm death (especially young palms)</Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer navigation (black icons) */}
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
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginTop: 8 },
  subtitle: { fontSize: 12, color: '#6B7280', fontStyle: 'italic', marginTop: 2 },
  italic: { fontStyle: 'italic' },
  photoRow: { flexDirection: 'row', gap: 10, marginTop: 12, paddingRight: 4 },
  photo: { width: 220, height: 110, borderRadius: 12 },
  signsRow: { flexDirection: 'row', gap: 10, marginTop: 10, marginBottom: 10, paddingRight: 4 },
  signImage: { width: 180, height: 110, borderRadius: 12 },
  photoCount: { alignSelf: 'flex-end', color: '#6B7280', fontSize: 12, marginTop: 4 },
  sectionHeading: { fontSize: 16, fontWeight: '800', color: '#111827', marginTop: 12, marginBottom: 6 },
  paragraph: { fontSize: 14, color: '#374151', lineHeight: 20 },
  bullet: { fontSize: 14, color: '#374151', lineHeight: 20 },
  footerBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  footerItem: { flex: 1, alignItems: 'center' },
});
