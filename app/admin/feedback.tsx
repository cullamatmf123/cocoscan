import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, doc, query as fsQuery, onSnapshot, orderBy, updateDoc } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/firebase';

export default function AdminFeedbackScreen() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'All' | 'New' | 'Reviewed' | 'Resolved'>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailStatus, setDetailStatus] = useState<'New' | 'Reviewed' | 'Resolved'>('New');

  const [itemsState, setItemsState] = useState<Array<{ id: string; rating: number; message: string; userEmail: string; status: 'New' | 'Reviewed' | 'Resolved'; timestamp: Date; }>>([]);

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
      // Persist as lowercase to match backend convention
      await updateDoc(doc(db, 'feedback', selectedId), { status: s.toLowerCase() });
    } catch (e: any) {
      Alert.alert('Update failed', 'Could not save status.');
    }
  };

  useEffect(() => {
    // Real-time subscription to feedback collection
    const q = fsQuery(collection(db, 'feedback'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => {
        const data: any = d.data();
        const ts: Date = data?.timestamp?.toDate ? data.timestamp.toDate() : new Date();
        const rawStatus: string = (data?.status || 'new').toString();
        const uiStatus = (rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)) as 'New' | 'Reviewed' | 'Resolved';
        return {
          id: d.id,
          rating: Number(data?.rating ?? 0),
          message: String(data?.message ?? ''),
          userEmail: String(data?.userEmail ?? ''),
          status: uiStatus,
          timestamp: ts,
        };
      });
      setItemsState(list);
    });
    return () => unsub();
  }, []);

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
});
