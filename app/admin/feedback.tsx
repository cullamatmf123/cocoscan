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
      await updateDoc(doc(db, 'feedback', selectedId), { status: s.toLowerCase() });
    } catch (e: any) {
      Alert.alert('Update failed', 'Could not save status.');
    }
  };

  useEffect(() => {
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
        <TouchableOpacity 
          onPress={() => { if (selectedId) { setSelectedId(null); } else { router.back(); } }} 
          style={styles.headerBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#1F6A44" />
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
                  <TouchableOpacity 
                    key={t} 
                    onPress={() => setTab(t)} 
                    style={[styles.tabPill, tab === t && styles.tabPillActive]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.searchRow}>
                <Ionicons name="search" size={20} color="#64748B" />
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
                <TouchableOpacity 
                  key={it.id} 
                  style={styles.itemCard} 
                  activeOpacity={0.8} 
                  onPress={() => { setSelectedId(it.id); setDetailStatus(it.status as 'New' | 'Reviewed' | 'Resolved'); }}
                >
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
                    <Ionicons name="chevron-forward" size={20} color="#64748B" />
                  </View>
                </TouchableOpacity>
              ))}
              {filtered.length === 0 && (
                <View style={styles.emptyBox}>
                  <View style={styles.emptyIconWrap}>
                    <Ionicons name="chatbubbles-outline" size={32} color="#64748B" />
                  </View>
                  <Text style={styles.emptyText}>No feedback found</Text>
                  <Text style={styles.emptySubtext}>Try adjusting your filters or search</Text>
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
              <TouchableOpacity 
                onPress={() => applyStatus('Reviewed')} 
                style={[styles.actionPill, detailStatus === 'Reviewed' && styles.actionPillActiveBlue]}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-done-outline" size={18} color={detailStatus === 'Reviewed' ? '#1F6A44' : '#64748B'} />
                <Text style={[styles.actionPillText, detailStatus === 'Reviewed' && styles.actionPillTextActive]}>Reviewed</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => applyStatus('Resolved')} 
                style={[styles.actionPill, detailStatus === 'Resolved' && styles.actionPillActiveGreen]}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color={detailStatus === 'Resolved' ? '#1F6A44' : '#64748B'} />
                <Text style={[styles.actionPillText, detailStatus === 'Resolved' && styles.actionPillTextActive]}>Resolved</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const GREEN = '#1F6A44';
const GREEN_LIGHT = '#E8F5EF';
const BLUE_LIGHT = '#EFF6FF';
const BG = '#F8FAFC';

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: BG 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBack: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: GREEN_LIGHT,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  headerRight: { width: 44 },
  container: { 
    padding: 20,
    paddingBottom: 40,
  },

  filtersCard: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 16, 
    padding: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 10, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 2,
  },
  tabsRow: { 
    flexDirection: 'row', 
    gap: 10, 
    marginBottom: 14,
  },
  tabPill: { 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabPillActive: { 
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  tabText: { 
    fontWeight: '700', 
    color: '#475569',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  tabTextActive: { 
    color: '#FFFFFF',
    fontWeight: '800',
  },
  searchRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    backgroundColor: '#F8FAFC', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    paddingHorizontal: 14, 
    paddingVertical: 12,
  },
  searchInput: { 
    flex: 1, 
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '500',
  },

  listWrap: { 
    marginTop: 16, 
    gap: 12,
  },
  itemCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 16, 
    padding: 14, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  itemLeft: { 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    backgroundColor: GREEN_LIGHT, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#D1E8DD',
  },
  itemEmoji: { 
    fontSize: 26,
  },
  itemCenter: { 
    flex: 1,
  },
  itemMessage: { 
    color: '#0F172A', 
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  itemMetaRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginTop: 6,
  },
  itemMeta: { 
    color: '#64748B', 
    fontSize: 13, 
    fontWeight: '600',
  },
  dot: { 
    color: '#94A3B8', 
    fontSize: 12, 
    fontWeight: '900',
  },
  itemRight: { 
    alignItems: 'flex-end', 
    gap: 8,
    marginLeft: 12,
  },
  statusPill: { 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 8, 
    borderWidth: 1,
  },
  statusNew: { 
    backgroundColor: '#ECFDF5', 
    borderColor: '#86EFAC',
  },
  statusReviewed: { 
    backgroundColor: BLUE_LIGHT, 
    borderColor: '#93C5FD',
  },
  statusResolved: { 
    backgroundColor: '#F0FDF4', 
    borderColor: '#4ADE80',
  },
  statusText: { 
    color: '#0F172A', 
    fontWeight: '800', 
    fontSize: 12,
    letterSpacing: 0.3,
  },

  emptyBox: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 60, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 16, 
    backgroundColor: '#FFFFFF', 
    gap: 12,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyText: { 
    color: '#0F172A', 
    fontWeight: '700',
    fontSize: 16,
  },
  emptySubtext: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },

  // Detail view styles
  detailCard: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 20, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 12, 
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  detailTop: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  detailEmojiWrap: { 
    width: 68, 
    height: 68, 
    borderRadius: 34, 
    backgroundColor: GREEN_LIGHT, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D1E8DD',
  },
  detailEmoji: { 
    fontSize: 36,
  },
  detailRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
  },
  detailTitle: { 
    color: '#0F172A', 
    fontWeight: '700', 
    fontSize: 18, 
    marginTop: 16,
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  detailActionsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    marginTop: 20,
  },
  actionPill: { 
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 8, 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    backgroundColor: '#F8FAFC',
  },
  actionPillActiveBlue: { 
    backgroundColor: BLUE_LIGHT, 
    borderColor: '#93C5FD',
  },
  actionPillActiveGreen: { 
    backgroundColor: GREEN_LIGHT, 
    borderColor: '#86EFAC',
  },
  actionPillText: { 
    color: '#64748B', 
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  actionPillTextActive: {
    color: GREEN,
    fontWeight: '800',
  },
});