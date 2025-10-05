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
    TouchableOpacity,
    View
} from 'react-native';
import { auth } from '../../config/firebase';
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
  const [currentAdmin, setCurrentAdmin] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

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
          email: 'john.doe@example.com',
          fullName: 'John Doe',
          role: 'user',
          createdAt: new Date('2024-01-15'),
          isActive: true,
          lastLogin: new Date('2024-01-20')
        },
        {
          id: '2',
          email: 'jane.smith@example.com',
          fullName: 'Jane Smith',
          role: 'user',
          createdAt: new Date('2024-01-14'),
          isActive: true,
          lastLogin: new Date('2024-01-19')
        },
        {
          id: '3',
          email: 'admin@cocoscan.com',
          fullName: 'Admin User',
          role: 'admin',
          createdAt: new Date('2024-01-10'),
          isActive: true,
          lastLogin: new Date('2024-01-20')
        }
      ]);

      const currentUser = auth.currentUser;
      if (currentUser) {
        setCurrentAdmin(currentUser.displayName || currentUser.email || 'Admin');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.signOut();
              router.replace('/admin');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  const handleUserManagement = () => {
    Alert.alert('User Management', 'This feature will allow you to manage users, view details, and modify permissions.');
  };

  const handleSystemSettings = () => {
    Alert.alert('System Settings', 'This feature will allow you to configure app settings and preferences.');
  };

  const handleAnalytics = () => {
    Alert.alert('Analytics', 'This feature will show detailed analytics and usage reports.');
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
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.adminName}>{currentAdmin}</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={handleUserManagement}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionTitle}>User Management</Text>
            <Text style={styles.actionSubtitle}>Manage users and permissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleAnalytics}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionTitle}>Analytics</Text>
            <Text style={styles.actionSubtitle}>View usage statistics</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleSystemSettings}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionTitle}>System Settings</Text>
            <Text style={styles.actionSubtitle}>Configure app settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleBackup}>
            <Text style={styles.actionIcon}>💾</Text>
            <Text style={styles.actionTitle}>Data Backup</Text>
            <Text style={styles.actionSubtitle}>Backup and restore data</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Users</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Status</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>🟢</Text>
            <Text style={styles.statusText}>Database: Online</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>🟢</Text>
            <Text style={styles.statusText}>Authentication: Active</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>🟢</Text>
            <Text style={styles.statusText}>Storage: Available</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>🟡</Text>
            <Text style={styles.statusText}>Backup: Scheduled</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
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