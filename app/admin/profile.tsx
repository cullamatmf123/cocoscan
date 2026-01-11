import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { collection, doc, getDoc } from 'firebase/firestore';
import React from 'react';
import { Alert, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase';
import { AuthService } from '../../services/authService';

export default function AdminProfileScreen() {
  const [showFarmInfo, setShowFarmInfo] = React.useState(false);
  const [profile, setProfile] = React.useState<{
    uid: string;
    fullName: string;
    email: string;
    role: 'admin' | 'user' | string;
    isActive?: boolean;
    canScan?: boolean;
    createdAt?: Date;
    lastLogin?: Date;
    photoURL?: string | null;
  } | null>(null);
  const pickImage = React.useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setProfile((p) => (p ? { ...p, photoURL: uri } : p));
    }
  }, []);
  const handleSignOut = React.useCallback(async () => {
    try {
      await AuthService.signOut();
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  }, []);

  const load = React.useCallback(async () => {
      const u = auth.currentUser;
      if (!u) {
        setProfile(null);
        return;
      }
      const ref = doc(collection(db, 'users'), u.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as any;
        setProfile({
          uid: u.uid,
          fullName: data.fullName || u.displayName || 'Admin',
          email: data.email || u.email || '',
          role: data.role || 'admin',
          isActive: data.isActive,
          canScan: data.canScan,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : undefined,
          lastLogin: data.lastLogin?.toDate ? data.lastLogin.toDate() : undefined,
          photoURL: u.photoURL || null,
        });
      } else {
        setProfile({
          uid: u.uid,
          fullName: u.displayName || 'Admin',
          email: u.email || '',
          role: 'admin',
          isActive: true,
          canScan: true,
          createdAt: undefined,
          lastLogin: undefined,
          photoURL: u.photoURL || null,
        });
      }
  }, []);

  React.useEffect(() => { load(); }, [load]);
  useFocusEffect(React.useCallback(() => { load(); }, [load]));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>

      {/* Farm Info Modal */}
      <Modal visible={showFarmInfo} transparent animationType="fade" onRequestClose={() => setShowFarmInfo(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowFarmInfo(false)}>
          <View />
        </Pressable>
        <View style={styles.modalCenter} pointerEvents="box-none">
          <View style={[styles.card, styles.shadow, styles.modalCard]}>
            <Text style={styles.modalTitle}>Profile Info</Text>
            <View style={styles.divider} />
            <View style={styles.row}><Text style={styles.label}>Status</Text><Text style={styles.value}>{profile?.isActive ? 'Active' : 'Inactive'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Can Scan</Text><Text style={styles.value}>{profile?.canScan ? 'Yes' : 'No'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Created</Text><Text style={styles.value}>{profile?.createdAt ? profile.createdAt.toLocaleDateString() : '—'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Last Login</Text><Text style={styles.value}>{profile?.lastLogin ? profile.lastLogin.toLocaleString() : '—'}</Text></View>
            <TouchableOpacity style={[styles.primaryBtn, { alignSelf: 'center', marginTop: 16 }]} onPress={() => setShowFarmInfo(false)}>
              <Ionicons name="checkmark" size={18} color="#14532D" />
              <Text style={styles.primaryBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

        {/* Profile Header Content */}
        <View style={styles.profileHeaderContent}>
          <View style={styles.avatarContainer}>
            {profile?.photoURL ? (
              <Image source={{ uri: profile.photoURL }} style={styles.avatarLarge} />
            ) : (
              <View style={styles.avatarLargePlaceholder}>
                <Ionicons name="person" size={56} color="#14532D" />
              </View>
            )}
            <TouchableOpacity style={styles.camBadge} accessibilityLabel="Change photo" onPress={pickImage}>
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>{profile?.fullName || 'Admin'}</Text>
          
          <View style={[styles.roleBadge, profile?.role === 'admin' && styles.roleBadgeAdmin]}>
            <Ionicons name="shield-checkmark" size={14} color={profile?.role === 'admin' ? '#FFFFFF' : '#14532D'} />
            <Text style={[styles.roleBadgeText, profile?.role === 'admin' && { color: '#FFFFFF' }]}>
              {(profile?.role || 'admin').toUpperCase()}
            </Text>
          </View>
          
          <Text style={styles.profileEmail}>{profile?.email}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Feedback Card */}
        <View style={[styles.card, styles.shadow, styles.actionCard]}>
          <View style={styles.actionCardHeader}>
            <View style={styles.actionIconWrapper}>
              <Ionicons name="chatbubbles" size={24} color="#14532D" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionCardTitle}>User Feedback</Text>
              <Text style={styles.actionCardDescription}>
                Review and manage feedback submitted by users
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel="Go to Admin User Feedback list"
            onPress={() => router.push('/admin/feedback')}
          >
            <Text style={styles.actionButtonText}>View Feedback</Text>
            <Ionicons name="arrow-forward" size={18} color="#14532D" />
          </TouchableOpacity>
        </View>

        {/* Account Actions Card */}
        <View style={[styles.card, styles.shadow, styles.actionCard]}>
          <View style={styles.actionCardHeader}>
            <View style={[styles.actionIconWrapper, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="log-out" size={24} color="#DC2626" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionCardTitle}>Account</Text>
              <Text style={styles.actionCardDescription}>
                Sign out of your admin account
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const GREEN_PRIMARY = '#175C35';
const GREEN_LIGHT = '#A7F3D0';
const GREEN_DARK = '#14532D';
const BG_COLOR = '#F7FAF8';

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: BG_COLOR 
  },
  header: {
    backgroundColor: GREEN_PRIMARY,
    paddingTop: 50,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTop: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  profileHeaderContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarLarge: { 
    width: 110, 
    height: 110, 
    borderRadius: 55,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarLargePlaceholder: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    backgroundColor: GREEN_LIGHT,
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  camBadge: { 
    position: 'absolute', 
    right: 0, 
    bottom: 0, 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: GREEN_PRIMARY,
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 3, 
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 8,
  },
  roleBadgeAdmin: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  profileEmail: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 20,
    borderWidth: 1, 
    borderColor: '#E5EFE8',
    marginBottom: 16,
  },
  shadow: { 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 12, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 4,
  },
  statsCard: {
    marginTop: -24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 16,
    color: GREEN_DARK,
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5EFE8',
  },
  actionCard: {
    padding: 20,
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 14,
  },
  actionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: GREEN_DARK,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  actionCardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: GREEN_LIGHT,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    color: GREEN_DARK,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  infoCardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  divider: { 
    height: 1, 
    backgroundColor: '#E5EFE8', 
    marginVertical: 16,
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12,
    paddingVertical: 4,
  },
  label: { 
    fontSize: 14, 
    color: '#64748B', 
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  value: { 
    fontSize: 14, 
    color: GREEN_DARK, 
    fontWeight: '800',
  },
  modalBackdrop: { 
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCenter: { 
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0, 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: { 
    width: '100%', 
    maxWidth: 400,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: GREEN_DARK,
    letterSpacing: 0.3,
  },
  primaryBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    backgroundColor: GREEN_LIGHT, 
    borderRadius: 12, 
    paddingHorizontal: 20, 
    paddingVertical: 12,
  },
  primaryBtnText: { 
    color: GREEN_DARK, 
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});