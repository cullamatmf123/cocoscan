import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/firebase';

export default function AdminFeedbackScreen() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'All' | 'New' | 'Reviewed' | 'Resolved'>('All');
  const [showMore, setShowMore] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailStatus, setDetailStatus] = useState<'New' | 'Reviewed' | 'Resolved'>('New');

  const items = useMemo(
    () => [
      { id: '1', rating: 5, message: 'Amazing experience, the scanner is very accurate!', userEmail: 'jane@example.com', status: 'New', timestamp: new Date('2025-10-06T10:30:00') },
      { id: '2', rating: 2, message: 'Sometimes the app crashes when uploading photos.', userEmail: 'mark@example.com', status: 'Reviewed', timestamp: new Date('2025-10-05T14:12:00') },
      { id: '3', rating: 4, message: 'Would love dark mode and offline history.', userEmail: 'lisa@example.com', status: 'Resolved', timestamp: new Date('2025-10-03T09:00:00') },
      { id: '4', rating: 1, message: 'Scan results are slow on poor connection.', userEmail: 'pete@example.com', status: 'New', timestamp: new Date('2025-10-02T18:45:00') },
    ],
    []
  );
  const [itemsState, setItemsState] = useState(items);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return itemsState.filter((it) =>
      (tab === 'All' || it.status === tab) &&
      (q === '' || it.message.toLowerCase().includes(q) || it.userEmail.toLowerCase().includes(q))
    );
  }, [itemsState, query, tab]);

  const selected = useMemo(() => itemsState.find(i => i.id === selectedId) || null, [itemsState, selectedId]);

  const applyStatus = async (s: 'New' | 'Reviewed' | 'Resolved') => {
    if (!selectedId) return;
    setDetailStatus(s);
    setItemsState(prev => prev.map(it => it.id === selectedId ? { ...it, status: s } : it));
    try {
      await updateDoc(doc(db, 'feedback', selectedId), { status: s });
    } catch (e: any) {
      Alert.alert('Update failed', 'Could not save status.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if (selectedId) { setSelectedId(null); } else { router.back(); } }} style={styles.headerBack}>
          <Ionicons name="chevron-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selected ? 'Feedback Details' : 'User Feedback'}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {!selected && (
          <>
            <View style={styles.filtersCard}>
              <View style={styles.tabsRow}>
                {(['All','New','Reviewed','Resolved'] as const).map(t => (
                  <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tabPill, tab === t && styles.tabPillActive]}>
                    <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.searchRow}>
                <Ionicons name="search" size={18} color="#64748B" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search feedback or email"
                  placeholderTextColor="#94A3B8"
                  value={query}
                  onChangeText={setQuery}
                />
              </View>
            </View>

            <View style={styles.listWrap}>
              {filtered.map((it) => (
                <TouchableOpacity key={it.id} style={styles.itemCard} activeOpacity={0.9} onPress={() => { setSelectedId(it.id); setDetailStatus(it.status as 'New' | 'Reviewed' | 'Resolved'); }}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemEmoji}>{['','👎','😕','😐','👍','🤩'][it.rating]}</Text>
                  </View>
                  <View style={styles.itemCenter}>
                    <Text style={styles.itemMessage} numberOfLines={2}>{it.message}</Text>
                    <View style={styles.itemMetaRow}>
                      <Text style={styles.itemMeta}>{it.userEmail}</Text>
                      <Text style={styles.dot}>•</Text>
                      <Text style={styles.itemMeta}>{it.timestamp.toLocaleString()}</Text>
                    </View>
                  </View>
                  <View style={styles.itemRight}>
                    <View style={[styles.statusPill,
                      it.status === 'New' && styles.statusNew,
                      it.status === 'Reviewed' && styles.statusReviewed,
                      it.status === 'Resolved' && styles.statusResolved,
                    ]}>
                      <Text style={styles.statusText}>{it.status}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                  </View>
                </TouchableOpacity>
              ))}
              {filtered.length === 0 && (
                <View style={styles.emptyBox}>
                  <Ionicons name="chatbubbles-outline" size={22} color="#64748B" />
                  <Text style={styles.emptyText}>No feedback found</Text>
                </View>
              )}
            </View>
          </>
        )}

        {selected && (
          <View style={styles.detailCard}>
            <View style={styles.detailTop}>
              <View style={styles.detailEmojiWrap}>
                <Text style={styles.detailEmoji}>{['','👎','😕','😐','👍','🤩'][selected.rating]}</Text>
              </View>
              <View style={styles.detailRight}>
                <View style={[styles.statusPill,
                  detailStatus === 'New' && styles.statusNew,
                  detailStatus === 'Reviewed' && styles.statusReviewed,
                  detailStatus === 'Resolved' && styles.statusResolved,
                ]}>
                  <Text style={styles.statusText}>{detailStatus}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.detailTitle}>{selected.message}</Text>
            <View style={styles.itemMetaRow}>
              <Text style={styles.itemMeta}>{selected.userEmail}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.itemMeta}>{selected.timestamp.toLocaleString()}</Text>
            </View>

            <View style={styles.detailActionsRow}>
              <TouchableOpacity onPress={() => applyStatus('Reviewed')} style={[styles.actionPill, detailStatus === 'Reviewed' && styles.actionPillActiveBlue]}>
                <Ionicons name="checkmark-done-outline" size={16} color={detailStatus === 'Reviewed' ? '#0F172A' : '#0F172A'} />
                <Text style={styles.actionPillText}>Reviewed</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => applyStatus('Resolved')} style={[styles.actionPill, detailStatus === 'Resolved' && styles.actionPillActiveGreen]}>
                <Ionicons name="checkmark-circle-outline" size={16} color={detailStatus === 'Resolved' ? '#0F172A' : '#0F172A'} />
                <Text style={styles.actionPillText}>Resolved</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>

      <View style={styles.bottomDock}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go to Dashboard" onPress={() => router.push('/admin/dashboard')} style={styles.dockBtn}>
          <Ionicons name="home-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go to Report History" onPress={() => router.push('/admin/report-history')} style={styles.dockBtn}>
          <Ionicons name="time-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go to User Management" onPress={() => router.push('/admin/user-management')} style={[styles.dockBtn, styles.dockCircleOutline]}>
          <Text style={[styles.dockGlyph, styles.dockGlyphLarge]}>＋</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go to Profile" onPress={() => router.push('/admin/profile')} style={styles.dockBtn}>
          <Ionicons name="person-circle-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="More options" onPress={() => setShowMore(true)} style={styles.dockBtn}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={showMore} animationType="fade" onRequestClose={() => setShowMore(false)}>
        <Pressable style={styles.menuBackdrop} onPress={() => setShowMore(false)}><View /></Pressable>
        <View style={styles.menuContainer} pointerEvents="box-none">
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMore(false); }}>
              <Ionicons name="settings-outline" size={18} color="#0F172A" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 22, paddingBottom: 8 },
  headerBack: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9', marginTop: 8 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginTop: 8 },
  headerRight: { width: 40 },
  container: { padding: 16 },

  filtersCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  tabPill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#F1F5F9' },
  tabPillActive: { backgroundColor: '#134E2B' },
  tabText: { fontWeight: '800', color: '#0F172A' },
  tabTextActive: { color: '#FFFFFF' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  searchInput: { flex: 1, color: '#0F172A' },

  listWrap: { marginTop: 12, gap: 10 },
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  itemLeft: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  itemEmoji: { fontSize: 22 },
  itemCenter: { flex: 1 },
  itemMessage: { color: '#0F172A', fontWeight: '800' },
  itemMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  itemMeta: { color: '#64748B', fontSize: 12, fontWeight: '700' },
  dot: { color: '#94A3B8', fontSize: 12, fontWeight: '900' },
  itemRight: { alignItems: 'flex-end', gap: 6 },
  statusPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1 },
  statusNew: { backgroundColor: '#ECFDF5', borderColor: '#86EFAC' },
  statusReviewed: { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' },
  statusResolved: { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  statusText: { color: '#0F172A', fontWeight: '900', fontSize: 12 },

  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, backgroundColor: '#FFFFFF', gap: 8 },
  emptyText: { color: '#64748B', fontWeight: '800' },

  backLink: { alignSelf: 'center', paddingVertical: 14 },
  backText: { color: '#2d5a3d', fontWeight: '900' },
  // Detail view styles
  detailCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
  detailTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailEmojiWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  detailEmoji: { fontSize: 28 },
  detailRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailTitle: { color: '#0F172A', fontWeight: '900', fontSize: 16, marginTop: 10 },
  detailActionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  actionPill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  actionPillActiveBlue: { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' },
  actionPillActiveGreen: { backgroundColor: '#ECFDF5', borderColor: '#86EFAC' },
  actionPillText: { color: '#0F172A', fontWeight: '800' },
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
});
