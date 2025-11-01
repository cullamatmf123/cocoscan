import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { collection, doc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/firebase';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  active: boolean;
  canScan: boolean;
  isAdmin: boolean;
};

export default function UserManagementScreen() {
  // Start with empty list; populate from Firestore
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filter, setFilter] = useState('');

  const goAnalyticsSameAsDashboard = async () => {
    try {
      const dash = await AsyncStorage.getItem('dashboard_total_scans');
      const dashNum = dash !== null ? parseInt(dash, 10) : NaN;
      if (!Number.isNaN(dashNum)) {
        router.push({ pathname: '/admin/history', params: { totalScans: String(dashNum) } });
        return;
      }
      // Fallback: keep existing behavior
      router.push('/admin/history');
    } catch {
      router.push('/admin/history');
    }
  };

  // Load users from Firestore on mount
  useEffect(() => {
    const load = async () => {
      try {
        const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(qUsers);
        const list: AdminUser[] = snap.docs.map(d => {
          const data = d.data() as any;
          return {
            id: data.uid || d.id,
            name: data.fullName || data.displayName || data.email || 'User',
            email: data.email || '',
            role: (data.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
            active: data.isActive !== undefined ? !!data.isActive : true,
            canScan: data.canScan !== undefined ? !!data.canScan : true,
            isAdmin: data.role === 'admin',
          };
        });
        setUsers(list);
      } catch {}
    };
    load();
  }, []);

  // Reload users whenever this screen gains focus
  useFocusEffect(
    useCallback(() => {
      let active = true;
      const refresh = async () => {
        try {
          const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
          const snap = await getDocs(qUsers);
          if (!active) return;
          const list: AdminUser[] = snap.docs.map(d => {
            const data = d.data() as any;
            return {
              id: data.uid || d.id,
              name: data.fullName || data.displayName || data.email || 'User',
              email: data.email || '',
              role: (data.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
              active: data.isActive !== undefined ? !!data.isActive : true,
              canScan: data.canScan !== undefined ? !!data.canScan : true,
              isAdmin: data.role === 'admin',
            };
          });
          setUsers(list);
        } catch {}
      };
      refresh();
      return () => { active = false; };
    }, [])
  );

  const filtered = useMemo(
    () => users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()) || u.email.toLowerCase().includes(filter.toLowerCase())),
    [users, filter]
  );

  const updateUser = async (id: string, patch: Partial<AdminUser>) => {
    // Update local state immediately for better UX
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));
    
    // Update in Firestore
    try {
      const ref = doc(collection(db, 'users'), id);
      const updateData: any = {
        updatedAt: Timestamp.now(),
      };
      
      if (patch.role !== undefined) {
        updateData.role = patch.role;
      }
      if (patch.active !== undefined) {
        updateData.isActive = patch.active;
      }
      if (patch.canScan !== undefined) {
        updateData.canScan = patch.canScan;
      }
      
      await updateDoc(ref, updateData);
      
      // Show success message for role changes
      if (patch.role !== undefined) {
        Alert.alert('Success', `User role updated to ${patch.role}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Failed to update user. Please try again.');
      
      // Revert local state on error
      const revertPatch: Partial<AdminUser> = {};
      if (patch.role !== undefined) revertPatch.role = patch.role === 'admin' ? 'user' : 'admin';
      if (patch.active !== undefined) revertPatch.active = !patch.active;
      if (patch.canScan !== undefined) revertPatch.canScan = !patch.canScan;
      
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...revertPatch } : u)));
    }
  };

  const onSave = async () => {
    try {
      // Persist each user to Firestore users/{uid}
      await Promise.all(
        users.map(u => {
          const ref = doc(collection(db, 'users'), u.id);
          return setDoc(ref, {
            uid: u.id,
            fullName: u.name,
            email: u.email,
            role: u.role,
            isActive: u.active,
            canScan: u.canScan,
            updatedAt: Timestamp.now(),
            createdAt: Timestamp.now(), // Will be ignored if document exists
          }, { merge: true });
        })
      );
      Alert.alert('Saved', 'All user permissions updated successfully.');
    } catch (e) {
      console.error('Error saving users:', e);
      Alert.alert('Error', 'Failed to save user changes. Please try again.');
    }
  };

  const onAddUser = () => {
    router.push('/admin/signup');
  };

  const renderItem = ({ item }: { item: AdminUser }) => (
    <View style={[styles.card, styles.cardShadow]}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color="#1F3D2A" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={[
          styles.rolePill,
          item.role === 'admin' && { backgroundColor: '#2D5A3D', borderColor: '#2D5A3D' }
        ]}>
          <Text style={[
            styles.rolePillText,
            item.role === 'admin' && { color: '#FFFFFF' }
          ]}>{item.role}</Text>
        </View>
      </View>

      <View style={styles.roleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.roleLabel}>Role</Text>
          <View style={styles.roleButtons}>
            {(['user','admin'] as const).map(r => (
              <TouchableOpacity key={r} style={[styles.roleBtn, item.role === r && styles.roleBtnActive]} onPress={() => updateUser(item.id, { role: r, isAdmin: r === 'admin' })}>
                <Text style={[styles.roleBtnText, item.role === r && styles.roleBtnTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.actionWarn]} onPress={() => Alert.alert('Disable user', `Disable ${item.name}?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Disable', style: 'destructive', onPress: () => updateUser(item.id, { active: false }) },
        ])}>
          <Ionicons name="ban-outline" size={16} color="#fff" />
          <Text style={styles.actionBtnText}>Disable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionDanger]} onPress={() => Alert.alert('Delete user', `Delete ${item.name}?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              // Soft delete: mark inactive instead of removing doc to keep audit
              const ref = doc(collection(db, 'users'), item.id);
              await updateDoc(ref, { isActive: false, updatedAt: Timestamp.now() });
              setUsers(prev => prev.filter(u => u.id !== item.id));
            } catch {}
          } },
        ])}>
          <Ionicons name="trash-outline" size={16} color="#fff" />
          <Text style={styles.actionBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" style={{ width: 60 }}>
          <Text style={{ opacity: 0 }}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>CocoScan</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => router.push('/admin/notifications')} style={{ width: 60, alignItems: 'flex-end', marginRight: 8 }}>
          <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Page section title */}
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <Text style={styles.sectionTitle}>User Management</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            placeholder="Search users"
            placeholderTextColor="#9CA3AF"
            value={filter}
            onChangeText={setFilter}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onAddUser}>
          <Ionicons name="search-outline" size={18} color="#ffffff" />
          <Text style={styles.addBtnText}>Search User</Text>
        </TouchableOpacity>
      </View>

      {/* Top actions: Delete (left) and Save (right) */}
      <View style={[styles.saveTopWrap, { marginTop: 16, gap: 8 }]}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionDanger]}
          onPress={() => Alert.alert(
            'Delete all users',
            'This will mark all users as inactive. Continue?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete', style: 'destructive', onPress: async () => {
                  try {
                    await Promise.all(
                      users.map(u => updateDoc(doc(collection(db, 'users'), u.id), { isActive: false, updatedAt: Timestamp.now() }))
                    );
                    setUsers([]);
                    Alert.alert('Done', 'All users marked inactive.');
                  } catch {
                    Alert.alert('Error', 'Failed to delete users.');
                  }
                }
              }
            ]
          )}
        >
          <Ionicons name="trash-outline" size={18} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Ionicons name="save-outline" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Users list below Save Changes */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7FAF8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 16, paddingBottom: 24, backgroundColor: '#175C35',
    borderBottomColor: '#134E2B', borderBottomWidth: 0,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
    marginBottom: 12,
  },
  title: { position: 'absolute', left: 0, right: 0, textAlign: 'center', color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1F3D2A' },

  controls: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: '#E5EFE8',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111827', paddingVertical: 0 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#2d5a3d', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  addBtnText: { color: '#ffffff', fontWeight: '900' },

  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E5EFE8' },
  cardShadow: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  userName: { fontSize: 15, fontWeight: '900', color: '#1F3D2A' },
  userEmail: { fontSize: 12, color: '#6B7280' },
  rolePill: { backgroundColor: '#F1F8F4', borderWidth: 1, borderColor: '#E5EFE8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  rolePillText: { fontSize: 12, fontWeight: '800', color: '#1F3D2A' },

  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  switchCol: { alignItems: 'center', gap: 4, flex: 1 },
  switchLabel: { fontSize: 12, fontWeight: '800', color: '#1F3D2A' },

  roleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  roleLabel: { fontSize: 12, fontWeight: '800', color: '#1F3D2A', marginBottom: 6 },
  roleButtons: { flexDirection: 'row', gap: 12 },
  roleBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#E5EFE8', backgroundColor: '#FFFFFF' },
  roleBtnActive: { backgroundColor: '#2D5A3D', borderColor: '#2D5A3D' },
  roleBtnText: { color: '#1F3D2A', fontWeight: '800', fontSize: 12 },
  roleBtnTextActive: { color: '#FFFFFF' },

  actions: { flexDirection: 'row', gap: 8, marginTop: 10, justifyContent: 'flex-end' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  actionWarn: { backgroundColor: '#F59E0B' },
  actionDanger: { backgroundColor: '#EF4444' },
  actionBtnText: { color: '#fff', fontWeight: '900' },

  footerBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#E5EFE8' },
  saveBtn: { backgroundColor: '#2d5a3d', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  saveBtnText: { color: '#ffffff', fontWeight: '900' },
  saveTopWrap: { paddingHorizontal: 16, marginBottom: 8, flexDirection: 'row', justifyContent: 'flex-end' },
  graphIcon: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  graphBar: { width: 6, backgroundColor: '#0F172A', borderRadius: 2 },
});
