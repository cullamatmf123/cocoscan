import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { collection, doc, getDoc } from 'firebase/firestore';
import React from 'react';
import { Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase';

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
  const [showMore, setShowMore] = React.useState(false);
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
  const handleSignOut = React.useCallback(() => {
    router.replace('/');
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
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" style={{ width: 60 }}>
            <Text style={{ opacity: 0 }}>‹ Back</Text>
          </TouchableOpacity>
          <View style={{ width: 60 }} />
          <View style={{ width: 60 }} />
        </View>

      {/* Farm Info Modal */}
      <Modal visible={showFarmInfo} transparent animationType="fade" onRequestClose={() => setShowFarmInfo(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowFarmInfo(false)}>
          <View />
        </Pressable>
        <View style={styles.modalCenter} pointerEvents="box-none">
          <View style={[styles.card, styles.shadow, styles.modalCard]}>
            <Text style={styles.modalTitle}>Profile  Info</Text>
            <View style={styles.divider} />
            <View style={styles.row}><Text style={styles.label}>Status</Text><Text style={styles.value}>{profile?.isActive ? 'Active' : 'Inactive'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Can Scan</Text><Text style={styles.value}>{profile?.canScan ? 'Yes' : 'No'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Created</Text><Text style={styles.value}>{profile?.createdAt ? profile.createdAt.toLocaleDateString() : '—'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Last Login</Text><Text style={styles.value}>{profile?.lastLogin ? profile.lastLogin.toLocaleString() : '—'}</Text></View>
            <TouchableOpacity style={[styles.primaryBtn, { alignSelf: 'center', marginTop: 12 }]} onPress={() => setShowFarmInfo(false)}>
              <Ionicons name="checkmark" size={16} color="#14532D" />
              <Text style={styles.primaryBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

        {/* In-header hero content */}
        <View style={styles.headerHero}>
          <Text style={styles.heroTitle}>CocoScan</Text>
          <View style={styles.heroAvatarWrap}>
            {profile?.photoURL ? (
              <Image source={{ uri: profile.photoURL }} style={styles.avatarLarge} />
            ) : (
              <View style={styles.avatarLargePlaceholder}>
                <Ionicons name="person-outline" size={42} color="#14532D" />
              </View>
            )}
            <TouchableOpacity style={styles.camBadge} accessibilityLabel="Change photo" onPress={pickImage}>
              <Ionicons name="camera" size={16} color="#14532D" />
            </TouchableOpacity>
          </View>
          {/* Role + Name row */}
          <View style={styles.heroNameRow}>
            <View style={styles.heroRoleSpacer} />
            <Text style={styles.heroNameText}>{profile?.fullName || 'Admin'}</Text>
            <View style={[styles.heroRolePill, profile?.role === 'admin' && styles.heroRolePillAdmin]}>
              <Text style={[styles.heroRolePillText, profile?.role === 'admin' && { color: '#FFFFFF' }]}>
                {(profile?.role || 'admin').toLowerCase()}
              </Text>
            </View>
          </View>
          {/* Set location pill removed per request */}
          <Text style={[styles.heroEmail, { fontWeight: '900' }]}>{profile?.email}</Text>
          <TouchableOpacity style={[styles.primaryBtn, { marginTop: 8 }]} accessibilityLabel="Edit Personal Info" onPress={() => setShowFarmInfo(true)}>
            <Ionicons name="create-outline" size={16} color="#14532D" />
            <Text style={styles.primaryBtnText}>Edit Personal Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
          {/* Hero content moved into header; keep body focused on details */}

          {/* Level and stats removed per request */}

          {/* Details card removed per request */}

          <View style={[styles.card, styles.shadow, { marginTop: 8 }]}>
            <Text style={{ fontSize: 16, fontWeight: '900', color: '#1F3D2A', marginBottom: 6 }}>User Feedback</Text>
            <Text style={{ color: '#475569', marginBottom: 12 }}>
              Collection of feedback submitted by users. Review and manage entries.
            </Text>
            <TouchableOpacity
              style={[styles.primaryBtn, { alignSelf: 'flex-start' }]}
              accessibilityRole="button"
              accessibilityLabel="Go to Admin User Feedback list"
              onPress={() => router.push('/admin/feedback')}
            >
              <Ionicons name="chatbubbles-outline" size={16} color="#14532D" />
              <Text style={styles.primaryBtnText}>View Feedback</Text>
            </TouchableOpacity>
          </View>
      </ScrollView>

      {/* Bottom dock */}
      <View style={styles.bottomDock}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go to Dashboard" onPress={() => router.push('/admin/dashboard')} style={styles.dockBtn}>
          <Ionicons name="home-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go to History" onPress={() => router.push('/admin/history')} style={styles.dockBtn}>
          <Ionicons name="time-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go to User Management" onPress={() => router.push('/admin/user-management')} style={[styles.dockBtn, styles.dockCircleOutline]}>
          <Text style={[styles.dockGlyph, styles.dockGlyphLarge]}>＋</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go to Profile" onPress={() => {}} style={styles.dockBtn}>
          <Ionicons name="person-circle-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="More options" onPress={() => setShowMore(true)} style={styles.dockBtn}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>
      {/* More menu */}
      <Modal transparent visible={showMore} animationType="fade" onRequestClose={() => setShowMore(false)}>
        <Pressable style={styles.menuBackdrop} onPress={() => setShowMore(false)}><View /></Pressable>
        <View style={styles.menuContainer} pointerEvents="box-none">
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMore(false); alert('Settings coming soon.'); }}>
              <Ionicons name="settings-outline" size={18} color="#0F172A" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMore(false); handleSignOut(); }}>
              <Ionicons name="log-out-outline" size={18} color="#0F172A" />
              <Text style={styles.menuText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7FAF8' },
  header: {
    flexDirection: 'column',
    paddingTop: 50, paddingHorizontal: 16, paddingBottom: 24, backgroundColor: '#175C35',
    borderBottomLeftRadius: 44, borderBottomRightRadius: 44,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  headerHero: { alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 4 },
  title: { position: 'absolute', left: 0, right: 0, textAlign: 'center', color: '#FFFFFF', fontSize: 18, fontWeight: '900' },

  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E5EFE8' },
  shadow: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#E6F7ED' },
  name: { fontSize: 18, fontWeight: '900', color: '#1F3D2A' },
  email: { fontSize: 12, color: '#6B7280' },
  rolePill: { backgroundColor: '#F1F8F4', borderWidth: 1, borderColor: '#E5EFE8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  rolePillText: { fontSize: 12, fontWeight: '800', color: '#1F3D2A' },
  divider: { height: 1, backgroundColor: '#E5EFE8', marginVertical: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  value: { fontSize: 14, color: '#1F3D2A', fontWeight: '800' },

  heroCard: { backgroundColor: '#1F8F61', borderRadius: 22, padding: 16, alignItems: 'center', marginBottom: 12 },
  heroTitle: { color: '#FFFFFF', fontWeight: '900', fontSize: 18, marginBottom: 10 },
  heroAvatarWrap: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#A7F3D0', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 12 },
  avatarLarge: { width: 120, height: 120, borderRadius: 60 },
  avatarLargePlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#BBF7D0', alignItems: 'center', justifyContent: 'center' },
  camBadge: { position: 'absolute', right: -4, bottom: -4, width: 30, height: 30, borderRadius: 15, backgroundColor: '#BBF7D0', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E6F7ED' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#CFFAEA', borderColor: '#A7F3D0', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginBottom: 8 },
  pillText: { color: '#14532D', fontWeight: '800', fontSize: 12 },
  heroEmail: { color: '#E6FFFA', marginBottom: 10, fontWeight: '700' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E6FFFA', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  primaryBtnText: { color: '#14532D', fontWeight: '900' },

  levelCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  levelBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' },
  levelText: { color: '#14532D', fontWeight: '900' },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E6FFFA', borderColor: '#BAE6FD', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  statChipText: { color: '#14532D', fontWeight: '800' },

  bottomDock: {
    position: 'absolute', left: 16, right: 16, bottom: 12, height: 56,
    backgroundColor: '#A7F3D0', borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'
  },
  dockBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dockCircleOutline: { borderWidth: 2, borderColor: '#0F172A' },
  dockGlyph: { color: '#0F172A', fontSize: 18, fontWeight: '600' },
  dockGlyphLarge: { fontSize: 26 },
  graphIcon: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  graphBar: { width: 6, backgroundColor: '#0F172A', borderRadius: 2 },
  menuBackdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.1)' },
  menuContainer: { position: 'absolute', left: 0, right: 0, bottom: 80, alignItems: 'flex-end', paddingHorizontal: 16 },
  menuCard: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 6 },
  menuText: { color: '#0F172A', fontWeight: '700' },

  // Modal styles
  modalBackdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.2)' },
  modalCenter: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  modalCard: { width: '90%', maxWidth: 420, alignSelf: 'center' },
  modalTitle: { fontSize: 16, fontWeight: '900', color: '#1F3D2A' },

  // Header hero name/role styles
  heroNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 4, marginBottom: 2, width: '100%' },
  heroRolePill: { backgroundColor: '#E6F7ED', borderWidth: 0, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, minWidth: 64, alignItems: 'center' },
  heroRolePillAdmin: { backgroundColor: '#134E2B' },
  heroRolePillText: { fontSize: 12, fontWeight: '900', color: '#134E2B', textTransform: 'lowercase' },
  heroNameText: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  heroRoleSpacer: { width: 64 },
});
