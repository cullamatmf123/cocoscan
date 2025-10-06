import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { auth, db } from '../../config/firebase';
import { AuthService } from '../../services/authService';

interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  activeUsers: number;
  totalScans: number;
}

interface UserData {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  createdAt: Date;
  isActive: boolean;
  lastLogin?: Date;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAdmins: 0,
    activeUsers: 0,
    totalScans: 0
  });
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [usersDb, setUsersDb] = useState<UserData[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<string>('');
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Reload data whenever Dashboard gains focus so it reflects saved role changes
  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
      return undefined;
    }, [])
  );

  // Build a deduplicated Users list (most recent per email)
  const getUniqueUsers = (items: UserData[]) => {
    const map = new Map<string, UserData>();
    for (const u of items) {
      const key = u.email || u.fullName;
      const prev = map.get(key);
      if (!prev || (u.createdAt?.getTime?.() ?? 0) > (prev.createdAt?.getTime?.() ?? 0)) {
        map.set(key, u);
      }
    }
    return Array.from(map.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  // Keep persisted totals in sync whenever the screen gains focus or stats change
  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      const sync = async () => {
        try {
          await AsyncStorage.setItem('dashboard_total_scans', String(stats.totalScans));
          await AsyncStorage.setItem('dashboard_total_users_nonadmin', String(Math.max(0, stats.totalUsers - stats.totalAdmins)));
        } catch {}
      };
      sync();
      return () => { active = false; };
    }, [stats.totalScans, stats.totalUsers, stats.totalAdmins])
  );

  const loadDashboardData = async () => {
    try {
      setStats({
        totalUsers: 156,
        totalAdmins: 3,
        activeUsers: 89,
        totalScans: 2847
      });

      setRecentUsers([
        {
          id: '1',
          email: 'celyn1@example.com',
          fullName: 'Celyn',
          role: 'user',
          createdAt: new Date('2024-01-15'),
          isActive: true,
          lastLogin: new Date('2024-01-20'),
          reportStatus: 'unhealthy',
        },
        {
          id: '2',
          email: 'Cora.line@example.com',
          fullName: 'Coraline',
          role: 'user',
          createdAt: new Date('2024-01-14'),
          isActive: true,
          lastLogin: new Date('2024-01-19'),
          reportStatus: 'unhealthy',
        },
        {
          id: '3',
          email: 'francell@gmail.com',
          fullName: 'Francell',
          role: 'admin',
          createdAt: new Date('2024-01-10'),
          isActive: true,
          lastLogin: new Date('2024-01-20'),
          reportStatus: 'healthy',
        }
      ]);

      const currentUser = auth.currentUser;
      if (currentUser) {
        setCurrentAdmin(currentUser.displayName || currentUser.email || 'Admin');
      }

      // Load cached users immediately for faster render
      try {
        const cached = await AsyncStorage.getItem('users_cache');
        if (cached) {
          const arr = JSON.parse(cached) as UserData[];
          if (Array.isArray(arr)) setUsersDb(arr);
        }
      } catch {}

      // Firestore users fetch in background (non-blocking) with a small limit
      (async () => {
        try {
          const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(25));
          const snapUsers = await getDocs(qUsers);
          const list: UserData[] = snapUsers.docs.map((d) => {
            const data = d.data() as any;
            const createdAt: Date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
            return {
              id: data.uid || d.id,
              email: data.email || '',
              fullName: data.fullName || data.displayName || data.email || 'User',
              role: (data.role === 'admin' ? 'admin' : 'user') as 'admin' | 'user',
              createdAt,
              isActive: data.isActive !== undefined ? !!data.isActive : true,
              lastLogin: data.lastLogin?.toDate ? data.lastLogin.toDate() : undefined,
            };
          });
          setUsersDb(list);
          try { await AsyncStorage.setItem('users_cache', JSON.stringify(list)); } catch {}
        } catch {}
      })();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      // End loading sooner; Firestore users fetch continues in background
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      // Redirect to app index; it will decide sign-in/signup
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleUserManagement = () => {
    router.push('/admin/user-management');
  };

  const handleSystemSettings = () => {
    Alert.alert('System Settings', 'This feature will allow you to configure app settings and preferences.');
  };

  const handleAnalytics = () => {
    router.push('/admin/analytics');
  };

  const handleBackup = () => {
    Alert.alert('Data Backup', 'This feature will allow you to backup and restore system data.');
  };

  const renderStatCard = (title: string, value: number, color: string, icon: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value.toLocaleString()}</Text>
    </View>
  );

  const renderUserItem = ({ item }: { item: UserData }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.fullName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>
          {item.role === 'admin' ? '👑 Admin' : '👤 User'} • 
          {item.isActive ? ' 🟢 Active' : ' 🔴 Inactive'}
        </Text>
      </View>
      <Text style={styles.userDate}>
        {item.createdAt.toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D5A3D" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 110 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View>
            <Text style={styles.heroWelcome}>Welcome back,</Text>
            <Text style={styles.heroName}>{currentAdmin}</Text>
          </View>
          <View style={styles.heroIcons}>
            <Text style={styles.heroGlyph}>⏰</Text>
            <Text style={styles.heroGlyph}>◯</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        {renderStatCard('Total Users', stats.totalUsers, '#3B82F6', '👥')}
        {renderStatCard('Admins', stats.totalAdmins, '#EF4444', '👑')}
        {renderStatCard('Active Users', stats.activeUsers, '#10B981', '🟢')}
        {renderStatCard('Total Scans', stats.totalScans, '#F59E0B', '📱')}
      </View>

        {/* Report History */}
        <View style={styles.sectionShell}>
          <View style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Report History</Text>
              <Text style={styles.historyArrow}>→</Text>
            </View>
            {recentUsers.slice(0,3).map((u, idx, arr) => (
              <View key={u.id} style={{ paddingVertical: 10 }}>
                <View style={styles.historyTopRow}>
                  <Text style={styles.historyName}>{u.fullName}</Text>
                  <View style={[styles.statusPill, u.reportStatus === 'healthy' ? styles.pillHealthy : styles.pillUnhealthy]}>
                    <Text style={styles.pillText}>{u.reportStatus === 'healthy' ? 'Healthy' : 'Unhealthy'}</Text>
                  </View>
                </View>
                <View style={styles.historyMetaRow}>
                  <View style={styles.metaLeft}>
                    <View style={styles.metaTag}>
                      <Text style={styles.metaIcon}>{idx % 2 === 0 ? '☁️' : '🌤️'}</Text>
                      <Text style={styles.metaText}>{idx % 2 === 0 ? 'cloudy' : 'sunny'}</Text>
                    </View>
                    <View style={styles.metaTag}>
                      <Text style={styles.metaIcon}>🌿</Text>
                      <Text style={styles.metaText}>{u.role === 'admin' ? 'silt' : (idx % 2 === 0 ? 'clay' : 'sandy')}  </Text>
                      <Text style={styles.metaPct}>( {idx % 2 === 0 ? '87%' : '95%'} )</Text>
                    </View>
                  </View>
                  <Text style={styles.metaDate}>{u.createdAt.toLocaleDateString()}</Text>
                </View>
                {idx < arr.length - 1 && <View style={styles.historyDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Users</Text>
          <View style={styles.usersList}>
            <FlatList
              data={recentUsers}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusDot}>●</Text>
              <Text style={styles.statusText}>Database: Online</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusDot}>●</Text>
              <Text style={styles.statusText}>Authentication: Active</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusDot}>●</Text>
              <Text style={styles.statusText}>Storage: Available</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={[styles.statusDot, { color: '#F59E0B' }]}>●</Text>
              <Text style={styles.statusText}>Backup: Scheduled</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom dock */}
      <View style={styles.bottomDock}>
        <View style={[styles.dockBtn, styles.dockBtnActive]}>
          <Text style={styles.dockGlyph}>⌂</Text>
        </View>
        <View style={styles.dockBtn}>
          <Text style={styles.dockGlyph}>▦</Text>
        </View>
        <View style={styles.dockBtn}>
          <Text style={styles.dockGlyph}>＋</Text>
        </View>
        <View style={styles.dockBtn}>
          <Text style={styles.dockGlyph}>⋯</Text>
        </View>
        <View style={styles.dockBtn}>
          <Text style={styles.dockGlyph}>👤</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  hero: {
    backgroundColor: '#175C35',
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 56,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroWelcome: { color: '#E1F6EA', fontSize: 14 },
  heroName: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  heroIcons: { flexDirection: 'row', gap: 14 },
  heroGlyph: { color: '#0F172A', fontSize: 18 },

  summaryCard: {
    marginHorizontal: 16,
    marginTop: -34,
    backgroundColor: '#175C35',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 6,
    borderColor: '#E6F7ED',
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { color: '#CDE5D8', marginBottom: 6 },
  summaryValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  summaryDivider: { width: 1, height: '100%', backgroundColor: '#CDE5D8', opacity: 0.4 },

  sectionShell: { paddingHorizontal: 16, marginTop: 16 },
  historyCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#1FAE55', padding: 12 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  historyTitle: { fontWeight: '700', color: '#1E293B' },
  historyArrow: { fontSize: 16, color: '#0F172A' },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  historyName: { color: '#0F172A', fontWeight: '600' },
  historySub: { color: '#64748B', fontSize: 12 },
  historyStatus: { fontWeight: '600' },
  historyTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  metaLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaTag: { flexDirection: 'row', alignItems: 'center' },
  metaIcon: { fontSize: 12, marginRight: 6, color: '#0F172A' },
  metaDot: { fontSize: 10, marginRight: 6 },
  metaText: { color: '#1F2937', fontSize: 12 },
  metaPct: { color: '#6B7280', fontSize: 12 },
  metaDate: { color: '#111827', fontSize: 12 },
  statusPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  pillHealthy: { backgroundColor: '#86EFAC' },
  pillUnhealthy: { backgroundColor: '#FCA5A5' },
  pillText: { color: '#0F172A', fontSize: 12, fontWeight: '700' },
  historyDivider: { height: 2, backgroundColor: '#175C35', marginTop: 10, borderRadius: 1 },

  bottomDock: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    height: 56,
    backgroundColor: '#A7F3D0',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dockBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dockBtnActive: { backgroundColor: '#22C55E' },
  dockGlyph: { color: '#0F172A', fontSize: 18, fontWeight: '600' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748B',
  },
  adminName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D5A3D',
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signOutText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  usersList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  userDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    paddingVertical: 8,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#1E293B',
  },
});