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
      router.push('/admin/history');
    } catch {
      router.push('/admin/history');
    }
  };

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
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));
    
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
      
      if (patch.role !== undefined) {
        Alert.alert('Success', `User role updated to ${patch.role}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Failed to update user. Please try again.');
      
      const revertPatch: Partial<AdminUser> = {};
      if (patch.role !== undefined) revertPatch.role = patch.role === 'admin' ? 'user' : 'admin';
      if (patch.active !== undefined) revertPatch.active = !patch.active;
      if (patch.canScan !== undefined) revertPatch.canScan = !patch.canScan;
      
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...revertPatch } : u)));
    }
  };

  const onSave = async () => {
    try {
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
            createdAt: Timestamp.now(),
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
          <Ionicons name="person" size={22} color="#1F6A44" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={[
          styles.rolePill,
          item.role === 'admin' && styles.rolePillAdmin
        ]}>
          <Text style={[
            styles.rolePillText,
            item.role === 'admin' && styles.rolePillTextAdmin
          ]}>{item.role}</Text>
        </View>
      </View>

      <View style={styles.roleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.roleLabel}>Role Assignment</Text>
          <View style={styles.roleButtons}>
            {(['user','admin'] as const).map(r => (
              <TouchableOpacity 
                key={r} 
                style={[styles.roleBtn, item.role === r && styles.roleBtnActive]} 
                onPress={() => updateUser(item.id, { role: r, isAdmin: r === 'admin' })}
                activeOpacity={0.7}
              >
                <Text style={[styles.roleBtnText, item.role === r && styles.roleBtnTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.actionWarn]} 
          onPress={() => Alert.alert('Disable user', `Disable ${item.name}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Disable', style: 'destructive', onPress: () => updateUser(item.id, { active: false }) },
          ])}
          activeOpacity={0.8}
        >
          <Ionicons name="ban-outline" size={18} color="#fff" />
          <Text style={styles.actionBtnText}>Disable</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.actionDanger]} 
          onPress={() => Alert.alert('Delete user', `Delete ${item.name}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
              try {
                const ref = doc(collection(db, 'users'), item.id);
                await updateDoc(ref, { isActive: false, updatedAt: Timestamp.now() });
                setUsers(prev => prev.filter(u => u.id !== item.id));
              } catch {}
            } },
          ])}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
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
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.sectionTitle}>User Management</Text>
        <Text style={styles.sectionSubtitle}>{filtered.length} {filtered.length === 1 ? 'user' : 'users'}</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#64748B" />
          <TextInput
            placeholder="Search users"
            placeholderTextColor="#94A3B8"
            value={filter}
            onChangeText={setFilter}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onAddUser} activeOpacity={0.8}>
          <Ionicons name="search-outline" size={20} color="#ffffff" />
          <Text style={styles.addBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.saveTopWrap}>
        <TouchableOpacity
          style={[styles.topActionBtn, styles.actionDanger]}
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
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={20} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={onSave} activeOpacity={0.8}>
          <Ionicons name="save-outline" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const GREEN = '#1F6A44';
const GREEN_DARK = '#184F34';
const GREEN_LIGHT = '#E8F5EF';
const BG = '#F0F6F4';

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingTop: 50, 
    paddingHorizontal: 20, 
    paddingBottom: 28, 
    backgroundColor: GREEN,
    borderBottomLeftRadius: 28, 
    borderBottomRightRadius: 28,
    shadowColor: GREEN_DARK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  title: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    textAlign: 'center', 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },

  controls: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    paddingHorizontal: 20,
    marginTop: 12,
  },
  searchBox: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10,
    backgroundColor: '#ffffff', 
    borderRadius: 14, 
    paddingHorizontal: 14, 
    paddingVertical: 12,
    borderWidth: 1, 
    borderColor: '#D1E8DD',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 15, 
    color: '#0F172A', 
    paddingVertical: 0,
    fontWeight: '500',
  },
  addBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: GREEN, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 12,
    shadowColor: GREEN_DARK,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  addBtnText: { 
    color: '#ffffff', 
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.3,
  },

  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 18, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#D1E8DD',
  },
  cardShadow: { 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 10, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 3,
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 14,
  },
  avatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: GREEN_LIGHT, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12, 
    borderWidth: 2, 
    borderColor: '#D1E8DD',
  },
  userName: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  userEmail: { 
    fontSize: 13, 
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  rolePill: { 
    backgroundColor: '#F1F5F9', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8,
  },
  rolePillAdmin: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  rolePillText: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: '#475569',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  rolePillTextAdmin: {
    color: '#FFFFFF',
  },

  roleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: 4,
    marginBottom: 12,
  },
  roleLabel: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#475569', 
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  roleButtons: { 
    flexDirection: 'row', 
    gap: 10,
  },
  roleBtn: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#D1E8DD', 
    backgroundColor: '#FFFFFF',
  },
  roleBtnActive: { 
    backgroundColor: GREEN, 
    borderColor: GREEN,
  },
  roleBtnText: { 
    color: '#475569', 
    fontWeight: '700', 
    fontSize: 13,
    letterSpacing: 0.3,
    textTransform: 'capitalize',
  },
  roleBtnTextActive: { 
    color: '#FFFFFF',
    fontWeight: '800',
  },

  actions: { 
    flexDirection: 'row', 
    gap: 10, 
    marginTop: 8, 
    justifyContent: 'flex-end',
  },
  actionBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 10,
  },
  actionWarn: { 
    backgroundColor: '#F59E0B',
  },
  actionDanger: { 
    backgroundColor: '#EF4444',
  },
  actionBtnText: { 
    color: '#fff', 
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.3,
  },

  saveTopWrap: { 
    paddingHorizontal: 20, 
    marginTop: 16,
    marginBottom: 8, 
    flexDirection: 'row', 
    justifyContent: 'flex-end',
    gap: 10,
  },
  topActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  saveBtn: { 
    backgroundColor: GREEN, 
    borderRadius: 24, 
    width: 48,
    height: 48,
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: GREEN_DARK,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
});