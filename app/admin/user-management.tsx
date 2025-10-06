import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const initialUsers = useMemo<AdminUser[]>(
    () => [
      { id: 'u1', name: 'France', email: 'france1@gmail.com', role: 'admin', active: true, canScan: true, isAdmin: true },
      { id: 'u2', name: 'Coraline', email: 'coraline@example.com', role: 'user', active: true, canScan: true, isAdmin: false },
      { id: 'u3', name: 'Guest', email: 'guest@example.com', role: 'user', active: false, canScan: false, isAdmin: false },
    ],
    []
  );

  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [filter, setFilter] = useState('');

  const filtered = useMemo(
    () => users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()) || u.email.toLowerCase().includes(filter.toLowerCase())),
    [users, filter]
  );

  const updateUser = (id: string, patch: Partial<AdminUser>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));
  };

  const onSave = () => {
    console.log('Saving users:', users);
    Alert.alert('Saved', 'User permissions updated successfully.');
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
        <View style={styles.rolePill}>
          <Text style={styles.rolePillText}>{item.role}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.switchCol}>
          <Text style={styles.switchLabel}>Active</Text>
          <Switch value={item.active} onValueChange={(v) => updateUser(item.id, { active: v })} />
        </View>
        <View style={styles.switchCol}>
          <Text style={styles.switchLabel}>Can scan</Text>
          <Switch value={item.canScan} onValueChange={(v) => updateUser(item.id, { canScan: v })} />
        </View>
        <View style={styles.switchCol}>
          <Text style={styles.switchLabel}>Admin</Text>
          <Switch value={item.isAdmin} onValueChange={(v) => updateUser(item.id, { isAdmin: v, role: v ? 'admin' : 'user' })} />
        </View>
      </View>

      <View style={styles.roleRow}>
        <Text style={styles.roleLabel}>Role</Text>
        <View style={styles.roleButtons}>
          {(['user','admin'] as const).map(r => (
            <TouchableOpacity key={r} style={[styles.roleBtn, item.role === r && styles.roleBtnActive]} onPress={() => updateUser(item.id, { role: r, isAdmin: r === 'admin' })}>
              <Text style={[styles.roleBtnText, item.role === r && styles.roleBtnTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
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
          { text: 'Delete', style: 'destructive', onPress: () => setUsers(prev => prev.filter(u => u.id !== item.id)) },
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
        <Text style={styles.title}>User Management</Text>
        <View style={{ width: 60 }} />
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
          <Ionicons name="person-add-outline" size={18} color="#ffffff" />
          <Text style={styles.addBtnText}>Add User</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={renderItem}
      />

      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Ionicons name="save-outline" size={18} color="#ffffff" />
        <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7FAF8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#EAF4EC',
    borderBottomColor: '#D5E6DA', borderBottomWidth: 1,
  },
  title: { position: 'absolute', left: 0, right: 0, textAlign: 'center', color: '#1F3D2A', fontSize: 18, fontWeight: '900' },

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
  roleLabel: { fontSize: 12, fontWeight: '800', color: '#1F3D2A' },
  roleButtons: { flexDirection: 'row', gap: 6 },
  roleBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#E5EFE8', backgroundColor: '#FFFFFF' },
  roleBtnActive: { backgroundColor: '#2D5A3D', borderColor: '#2D5A3D' },
  roleBtnText: { color: '#1F3D2A', fontWeight: '800', fontSize: 12 },
  roleBtnTextActive: { color: '#FFFFFF' },

  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  actionWarn: { backgroundColor: '#F59E0B' },
  actionDanger: { backgroundColor: '#EF4444' },
  actionBtnText: { color: '#fff', fontWeight: '900' },

  footerBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#E5EFE8' },
  saveBtn: { backgroundColor: '#2d5a3d', borderRadius: 12, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  saveBtnText: { color: '#ffffff', fontWeight: '900' },
});
