import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, updateProfile } from 'firebase/auth';
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
        console.log('Selected image:', {
          uri: selectedImage.uri,
          width: selectedImage.width,
          height: selectedImage.height,
          fileSize: selectedImage.fileSize
        });
        
        // Check file size (limit to 5MB)
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
      console.log('Starting image upload process...');
      
      // Get current user
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('User not authenticated. Please sign in again.');
      }

      console.log('User authenticated:', user.uid);

      // Create blob from image URI
      console.log('Fetching image from URI...');
      const response = await fetch(uri);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('Image blob created:', {
        size: blob.size,
        type: blob.type
      });

      // Initialize Firebase Storage
      const storage = getStorage();
      const timestamp = Date.now();
      const storageRef = ref(storage, `profilePictures/${user.uid}_${timestamp}.jpg`);
      
      console.log('Uploading to Firebase Storage...');
      
      // Upload with metadata
      const metadata = {
        contentType: 'image/jpeg',
        customMetadata: {
          uploadedBy: user.uid,
          uploadedAt: new Date().toISOString()
        }
      };
      
      const uploadTask = await uploadBytes(storageRef, blob, metadata);
      console.log('Upload completed successfully');
      
      // Get download URL
      console.log('Getting download URL...');
      const downloadURL = await getDownloadURL(uploadTask.ref);
      console.log('Download URL obtained:', downloadURL);
      
      // Update user profile
      console.log('Updating user profile...');
      await updateProfile(user, { 
        photoURL: downloadURL 
      });
      
      // Update local state
      setImage(downloadURL);
      console.log('Profile updated successfully');
      
      Alert.alert('Success', 'Profile picture updated successfully!');
      
    } catch (error: any) {
      console.error('Detailed upload error:', {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack
      });
      
      let errorMessage = 'Failed to upload image. ';
      
      if (error.code === 'storage/unauthorized') {
        errorMessage += 'You do not have permission to upload files.';
      } else if (error.code === 'storage/canceled') {
        errorMessage += 'Upload was canceled.';
      } else if (error.code === 'storage/unknown') {
        errorMessage += 'An unknown error occurred. Please check your internet connection and try again.';
      } else if (error.message.includes('fetch')) {
        errorMessage += 'Could not read the selected image.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      Alert.alert('Upload Error', errorMessage);
      
      // Reset image to previous state if upload failed
      const currentUser = AuthService.getCurrentUser();
      setImage(currentUser?.photoURL || null);
      
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerWrap}>
        <View style={styles.headerBgPrimary} />
        <View style={styles.headerBgWave} />
        <View style={styles.headerContent}>
          <View style={styles.avatarHero}>
            <TouchableOpacity onPress={pickImage} disabled={uploading}>
              {uploading ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="large" color="#4CAF84" />
                  <Text style={styles.uploadingText}>Uploading...</Text>
                </View>
              ) : image ? (
                <Image
                  source={{ uri: image }}
                  style={styles.profileImage}
                />
              ) : (
                <Ionicons name="person-circle" size={96} color="#94A3B8" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.nameHero}>{displayName || 'User'}</Text>
          <Text style={[styles.emailText, { color: '#E5F2E9' }]}>
            {AuthService.getCurrentUser()?.email || 'user@example.com'}
          </Text>
          <TouchableOpacity 
            style={styles.editBtn} 
            onPress={() => console.log('Edit Farm Info')} 
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={18} color="#1F3D2A" />
            <Text style={styles.editBtnText}>Edit Farm Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.sheet}>
          {/* Help us Grow button */}
          <TouchableOpacity 
            style={styles.helpBtn} 
            onPress={() => router.push('/feedback')} 
            activeOpacity={0.85}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#FFFFFF" />
            <Text style={styles.helpBtnText}>Help us Grow</Text>
          </TouchableOpacity>

          {/* Metric cards row */}
          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, styles.metricChat, styles.cardShadow]}>
              <Ionicons name="chatbubble-outline" size={22} color="#2563eb" />
              <Text style={[styles.metricValue, { color: '#2563eb' }]}>0</Text>
              <Text style={styles.metricLabel}>Total Chats</Text>
            </View>
            <View style={[styles.metricCard, styles.metricDiag, styles.cardShadow]}>
              <Ionicons name="medkit-outline" size={22} color="#16a34a" />
              <Text style={[styles.metricValue, { color: '#16a34a' }]}>0</Text>
              <Text style={styles.metricLabel}>Diagnoses</Text>
            </View>
          </View>

          {/* Recent Diagnoses card */}
          <View style={[styles.recentCard, styles.cardShadow]}>
            <View style={styles.recentHeader}>
              <View style={styles.recentHeaderLeft}>
                <Ionicons name="medkit-outline" size={18} color="#1F7A54" />
                <Text style={styles.recentTitle}>Recent Diagnoses (15d)</Text>
              </View>
            </View>
            <View style={styles.recentEmptyWrap}>
              <Ionicons name="bandage-outline" size={40} color="#9CA3AF" style={{ marginBottom: 6 }} />
              <Text style={styles.recentEmptyText}>No diagnoses yet</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer navigation */}
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
    backgroundColor: '#2D5A3D' 
  },
  headerWrap: { 
    height: 260, 
    overflow: 'hidden', 
    marginBottom: 0, 
    zIndex: 1 
  },
  headerBgPrimary: {
    ...StyleSheet.absoluteFillObject as any,
    backgroundColor: '#2D5A3D',
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  headerBgWave: {
    position: 'absolute', 
    left: -40, 
    right: -40, 
    top: 110, 
    height: 180,
    backgroundColor: '#2F6A46', 
    borderTopLeftRadius: 120, 
    borderTopRightRadius: 120,
    transform: [{ scaleX: 1.2 }],
  },
  headerContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 24,
    alignItems: 'center',
    gap: 6,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#E2E8F0',
  },
  uploadingContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    fontSize: 18, 
    fontWeight: '900', 
    color: '#1F3D2A' 
  },
  emailText: { 
    color: '#6B7280', 
    marginTop: 4, 
    fontWeight: '600', 
    textAlign: 'center' 
  },
  editBtn: { 
    marginTop: 12, 
    alignSelf: 'center', 
    flexDirection: 'row', 
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
  sheet: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 12,
    padding: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    zIndex: 2,
    elevation: 4,
  },
  helpBtn: { 
    marginTop: 12, 
    alignSelf: 'stretch', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    backgroundColor: '#4CAF84', 
    borderRadius: 999, 
    paddingVertical: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 3 
  },
  helpBtnText: { 
    color: '#FFFFFF', 
    fontWeight: '900', 
    fontSize: 14 
  },
  metricsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 12, 
    marginTop: 12 
  },
  metricCard: { 
    flex: 1, 
    borderRadius: 16, 
    paddingVertical: 16, 
    paddingHorizontal: 12, 
    alignItems: 'flex-start' 
  },
  metricChat: { 
    backgroundColor: '#eaf1ff', 
    borderWidth: 1, 
    borderColor: '#d7e4ff' 
  },
  metricDiag: { 
    backgroundColor: '#eaf8ee', 
    borderWidth: 1, 
    borderColor: '#cfeedd' 
  },
  metricValue: { 
    marginTop: 4, 
    fontSize: 22, 
    fontWeight: '900' 
  },
  metricLabel: { 
    marginTop: 2, 
    fontSize: 12, 
    color: '#1f2937', 
    fontWeight: '700' 
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  recentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F3D2A'
  },
  recentEmptyWrap: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  recentEmptyText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600'
  },
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
  cardShadow: { 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 2 
  },
  avatarHero: { 
    width: 102, 
    height: 102, 
    borderRadius: 51, 
    backgroundColor: '#F1F5F9', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 3, 
    borderColor: '#E2E8F0' 
  },
});