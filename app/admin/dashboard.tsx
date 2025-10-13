import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { AuthService } from '../../services/authService';

export default function AdminDashboard() {
  const [currentAdmin, setCurrentAdmin] = useState<string>('');
  const [totalReport, setTotalReport] = useState<number>(0);
  const [totalScans, setTotalScans] = useState<number>(0);
  const [totalHistory, setTotalHistory] = useState<number>(0);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    setCurrentAdmin(user?.displayName || user?.email || 'Admin');
    fetchUserCount();
    fetchFeedbackCount();
    fetchHistoryCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      setTotalReport(snapshot.size);
    } catch (error) {
      console.error('Error fetching user count:', error);
      setTotalReport(0);
    }
  };

  const fetchFeedbackCount = async () => {
    try {
      const feedbackCollection = collection(db, 'feedback');
      const snapshot = await getDocs(feedbackCollection);
      setTotalScans(snapshot.size);
    } catch (error) {
      console.error('Error fetching feedback count:', error);
      setTotalScans(0);
    }
  };

  const fetchHistoryCount = async () => {
    try {
      const historyCollection = collection(db, 'scanHistory');
      const snapshot = await getDocs(historyCollection);
      setTotalHistory(snapshot.size);
    } catch (error) {
      console.error('Error fetching history count:', error);
      setTotalHistory(0);
    }
  };

  const goUsers = () => router.push('/admin/user-management');
  const goAnalytics = () => router.push('/admin/history');
  const goProfile = () => router.push('/admin/profile');
  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      router.replace('/');
    } catch (e) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Header banner */}
      <View style={styles.headerBanner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerWelcome}>Welcome back,</Text>
          <Text style={styles.headerName}>{currentAdmin?.split('@')[0]}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Profile"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={goProfile}
          >
            <View style={styles.emojiBtn}>
              <Text style={styles.emojiText}>🌴</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCardWrapper}>
        <View style={styles.statsCard}>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Active User</Text>
            <Text style={styles.statValue}>{totalReport}</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <TouchableOpacity 
            style={styles.statBlock} 
            onPress={() => router.push('/admin/feedback')}
            activeOpacity={0.9}
          >
            <Text style={styles.statLabel}> User Feedback</Text>
            <Text style={styles.statValue}>{totalScans}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Second Stats Card */}
      <View style={[styles.statsCardWrapper, { marginTop: 12 }]}>
        <TouchableOpacity 
          style={[styles.statsCard, { backgroundColor: '#2C3E50' }]}
          onPress={() => router.push('/admin/history')}
          activeOpacity={0.9}
        >
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>User History</Text>
            <Text style={styles.statValue}>{totalHistory}</Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.35)' }]} />
          
          <TouchableOpacity 
            style={styles.statBlock} 
            onPress={goUsers}
            activeOpacity={0.9}
          >
            <Text style={styles.statLabel}>User Management</Text>
            <Text style={styles.statValue}></Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      </ScrollView>

      {/* Footer dock */}
      <View style={styles.bottomDock}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go to Dashboard"
          onPress={() => router.push('/admin/dashboard')}
          style={styles.dockBtn}
        >
          <Ionicons name="home-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go to History"
          onPress={() => router.push('/admin/history')}
          style={styles.dockBtn}
        >
          <Ionicons name="time-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go to User Management"
          onPress={() => router.push('/admin/user-management')}
          style={[styles.dockBtn, styles.dockCircleOutline]}
        >
          <Text style={[styles.dockGlyph, styles.dockGlyphLarge]}>＋</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={goProfile}
          style={styles.dockBtn}
        >
          <Ionicons name="person-circle-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="More options"
          onPress={() => setShowMore(true)}
          style={styles.dockBtn}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* More menu */}
      <Modal
        transparent
        visible={showMore}
        animationType="fade"
        onRequestClose={() => setShowMore(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setShowMore(false)}><View /></Pressable>
        <View style={styles.menuContainer} pointerEvents="box-none">
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMore(false); Alert.alert('Settings', 'Settings coming soon.'); }}>
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
    </View>
  );
}

const GREEN = '#1F6A44';
const BG = '#EAF1F7';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  headerBanner: {
    backgroundColor: GREEN,
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerWelcome: {
    color: '#EAFBF1',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 6,
  },
  headerName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'lowercase',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingTop: 2,
    paddingLeft: 0,
  },
  statsCardWrapper: {
    marginTop: -8,
    paddingHorizontal: 16,
  },
  statsCard: {
    backgroundColor: GREEN,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 3,
    borderColor: '#E8F1EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  rowCard: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#9EE6BE',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  rowArrow: {
    fontSize: 18,
    color: '#1E293B',
  },
  sectionHeaderRow: {
    marginHorizontal: 16,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  statusText: {
    color: '#1E293B',
    fontSize: 14,
    marginLeft: 8,
  },
  dotGreen: {
    color: '#22C55E',
    fontSize: 22,
    lineHeight: 16,
  },
  dotAmber: {
    color: '#F59E0B',
    fontSize: 22,
    lineHeight: 16,
  },
  bottomDock: {
    position: 'absolute', left: 16, right: 16, bottom: 12, height: 56,
    backgroundColor: '#A7F3D0', borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'
  },
  dockBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dockCircleOutline: { borderWidth: 2, borderColor: '#0F172A' },
  dockGlyph: { color: '#0F172A', fontSize: 18, fontWeight: '600' },
  dockGlyphLarge: { fontSize: 26 },
  menuBackdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.1)' },
  menuContainer: { position: 'absolute', left: 0, right: 0, bottom: 80, alignItems: 'flex-end', paddingHorizontal: 16 },
  menuCard: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 6 },
  menuText: { color: '#0F172A', fontWeight: '700' },
  emojiBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginLeft: -4,
  },
  emojiText: {
    fontSize: 24,
  },
});
