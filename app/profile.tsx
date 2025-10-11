import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { getAuth, updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AuthService } from '../services/authService';

export default function ProfileScreen() {
  const [displayName, setDisplayName] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const computeName = (email?: string | null, fallback?: string | null) => {
      if (fallback && fallback.trim()) return fallback.trim();
      if (!email) return '';
      const handle = email.split('@')[0] || '';
      const noTrailingDigits = handle.replace(/[0-9]+$/,'');
      const base = noTrailingDigits || handle;
      return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
    };

    const current = AuthService.getCurrentUser();
    setDisplayName(computeName(current?.email ?? null, current?.displayName ?? null));
    if (current?.photoURL) {
      setImage(current.photoURL);
    }

    const unsub = AuthService.onAuthStateChanged((u) => {
      setDisplayName(computeName(u?.email ?? null, u?.displayName ?? null));
      if (u?.photoURL) {
        setImage(u.photoURL);
      }
    });
    return () => unsub && unsub();
  }, []);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your photos to upload a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        if (selectedImage.fileSize && selectedImage.fileSize > 5 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select an image smaller than 5MB.');
          return;
        }
        setImage(selectedImage.uri);
        await uploadImage(selectedImage.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated. Please sign in again.');

      const response = await fetch(uri);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      const blob = await response.blob();

      const storage = getStorage();
      const timestamp = Date.now();
      const storageRef = ref(storage, `profilePictures/${user.uid}_${timestamp}.jpg`);
      const metadata = {
        contentType: 'image/jpeg',
        customMetadata: { uploadedBy: user.uid, uploadedAt: new Date().toISOString() }
      };
      const uploadTask = await uploadBytes(storageRef, blob, metadata);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      await updateProfile(user, { photoURL: downloadURL });
      setImage(downloadURL);
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Detailed upload error:', error);
      Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
      const currentUser = AuthService.getCurrentUser();
      setImage(currentUser?.photoURL || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => console.log('Open Menu')} style={styles.menuBtn}>
          <Feather name="menu" size={22} color="#0B3B2A" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>COCOSCAN</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <TouchableOpacity onPress={pickImage} disabled={uploading}>
            {uploading ? (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="large" color="#4CAF84" />
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            ) : image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person" size={56} color="#EAF7EF" style={styles.defaultAvatar} />
            )}
          </TouchableOpacity>

          <Text style={styles.nameHero}>{displayName || 'User'}</Text>
          <Text style={styles.emailText}>{AuthService.getCurrentUser()?.email || 'user@example.com'}</Text>

          <TouchableOpacity style={styles.editBtn} onPress={() => console.log('Edit Personal Info')} activeOpacity={0.85}>
            <Ionicons name="create-outline" size={16} color="#1F3D2A" />
            <Text style={styles.editBtnText}>Edit Personal Info</Text>
          </TouchableOpacity>
        </View>

        {/* Metrics Card */}
        <View style={[styles.card, styles.metricsCard]}>
          <View style={styles.metricCol}>
            <Text style={styles.metricTitle}>Pest Detected</Text>
            <Text style={styles.metricValue}>0</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricCol}>
            <Text style={styles.metricTitle}>Total Scan</Text>
            <Text style={styles.metricValue}>0</Text>
          </View>
        </View>

        {/* Recent Detection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Detection</Text>
          <View style={styles.recentEmpty} />
        </View>

        {/* Feedback Card */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Ionicons name="chatbubbles-outline" size={22} color="#1F3D2A" />
            <View style={{ flex: 1 }}>
              <Text style={styles.feedbackTitle}>Tell us what you think about the CocoScan app!</Text>
              <Text style={styles.feedbackText}>We value your opinions  share your feedback with us.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.feedbackBtn} onPress={() => router.push('/feedback')} activeOpacity={0.9}>
            <Text style={styles.feedbackBtnText}>Give Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer navigation (unchanged) */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')}>
          <Feather name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/camera')}>
          <Feather name="camera" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/history')}>
          <Feather name="clock" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/profile')}>
          <Feather name="user" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  menuBtn: {
    padding: 4,
    borderRadius: 8,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0B3B2A',
    letterSpacing: 1.5,
  },

  /* Hero */
  hero: {
    marginTop: 4,
    marginHorizontal: 0,
    backgroundColor: '#1E5A3A',
    borderBottomLeftRadius: 96,
    borderBottomRightRadius: 96,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 28,
  },
  profileImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: '#E2E8F0',
  },
  defaultAvatar: {
    width: 92,
    height: 92,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'transparent'
  },
  uploadingContainer: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E2E8F0',
  },
  uploadingText: {
    marginTop: 4,
    fontSize: 10,
    color: '#4CAF84',
    fontWeight: '600',
  },
  nameHero: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '900',
    color: '#EAF7EF'
  },
  emailText: {
    color: '#EAF7EF',
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center'
  },
  editBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5EFE8'
  },
  editBtnText: {
    color: '#1F3D2A',
    fontWeight: '900'
  },

  /* Cards */
  card: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F3D2A',
  },
  metricsCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 0,
    overflow: 'hidden',
  },
  metricCol: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTitle: {
    color: '#4B5563',
    fontWeight: '700',
  },
  metricValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '900',
    color: '#0B3B2A'
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#E5E7EB'
  },
  recentEmpty: {
    height: 40,
    backgroundColor: '#F5F6F7',
    borderRadius: 8,
    marginTop: 10,
  },

  /* Feedback */
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F3D2A',
  },
  feedbackText: {
    marginTop: 4,
    fontSize: 12,
    color: '#4B5563',
  },
  feedbackBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#3FA36E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginTop: 12,
  },
  feedbackBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
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
    paddingVertical: 10,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
  },
});


