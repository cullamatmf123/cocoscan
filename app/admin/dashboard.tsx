import { router } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebase';
import { AuthService } from '../../services/authService';

export default function AdminDashboard() {
  const [currentAdmin, setCurrentAdmin] = useState<string>('');
  const [totalReport, setTotalReport] = useState<number>(0);
  const [totalScans, setTotalScans] = useState<number>(0);
  const [totalHistory, setTotalHistory] = useState<number>(0);

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
          <View style={styles.headerLeft}>
            <Text style={styles.headerWelcome}>Welcome back,</Text>
            <Text style={styles.headerName}>{currentAdmin?.split('@')[0]}</Text>
          </View>
          <View style={styles.headerCenter}>
            <View style={styles.emojiBtn}>
              <Text style={styles.emojiText}>🌴</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Profile"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={goProfile}
            >
              <View style={styles.profileBtn}>
                <Text style={styles.profileText}>👤</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCardWrapper}>
          <View style={styles.statsCard}>
            <View style={styles.statBlock}>
              <View style={styles.statIconWrapper}>
                <Text style={styles.statIcon}>👥</Text>
              </View>
              <Text style={styles.statValue}>{totalReport}</Text>
              <Text style={styles.statLabel}>Active User</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <TouchableOpacity 
              style={styles.statBlock} 
              onPress={() => router.push('/admin/feedback')}
              activeOpacity={0.7}
            >
              <View style={styles.statIconWrapper}>
                <Text style={styles.statIcon}>💭</Text>
              </View>
              <Text style={styles.statValue}>{totalScans}</Text>
              <Text style={styles.statLabel}>User Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Second Stats Card */}
        <View style={[styles.statsCardWrapper, { marginTop: 16 }]}>
          <View style={[styles.statsCard, styles.secondaryCard]}>
            <TouchableOpacity 
              style={styles.statBlock} 
              onPress={() => router.push('/admin/history')}
              activeOpacity={0.7}
            >
              <View style={styles.statIconWrapper}>
                <Text style={styles.statIcon}>📋</Text>
              </View>
              <Text style={styles.statValue}>{totalHistory}</Text>
              <Text style={styles.statLabel}>User History</Text>
            </TouchableOpacity>
            
            <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
            
            <TouchableOpacity 
              style={styles.statBlock} 
              onPress={goUsers}
              activeOpacity={0.7}
            >
              <View style={styles.statIconWrapper}>
                <Text style={styles.statIcon}>👨‍💼</Text>
              </View>
              <Text style={[styles.statValue, { fontSize: 18 }]}>Manage</Text>
              <Text style={styles.statLabel}>User Management</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const GREEN = '#1F6A44';
const DARK_GREEN = '#2C3E50';
const BG = '#EAF1F7';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  headerBanner: {
    backgroundColor: GREEN,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerLeft: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 72,
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 44,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'box-none',
  },
  headerRight: {
    paddingTop: 72,
  },
  headerWelcome: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 15,
    marginBottom: 6,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  headerName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'lowercase',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emojiBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3.5,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  emojiText: {
    fontSize: 28,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A7F3D0',
  },
  profileText: {
    fontSize: 22,
  },
  statsCardWrapper: {
    marginTop: -12,
    paddingHorizontal: 20,
  },
  statsCard: {
    backgroundColor: GREEN,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  secondaryCard: {
    backgroundColor: DARK_GREEN,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statDivider: {
    width: 1.5,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 8,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});