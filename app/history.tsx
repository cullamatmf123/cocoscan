import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Modal, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type HistoryItem = {
  id: string;
  timestamp: string;
  imageUri?: string | null;
  photoBase64?: string | null;
  prediction?: string;
  confidence?: string;
  details?: string;
  recommendations?: string;
  weather?: string;
  soil?: string;
};

export default function HistoryScreen() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleBack = () => router.replace('/home');

  const handleOpen = (item: HistoryItem) => {
    router.push({
      pathname: '/result',
      params: {
        id: item.id,
        fromHistory: '1',
        imageUri: item.imageUri ?? undefined,
        photoBase64: item.photoBase64 ?? undefined,
        prediction: item.prediction ?? 'Unknown',
        confidence: item.confidence ?? '0',
        details: item.details ?? '',
        recommendations: item.recommendations ?? '',
        weather: item.weather ?? '',
        soil: item.soil ?? '',
      },
    });
  };

  const handleSelectAllDelete = () => {
    if (!items.length) return;
    Alert.alert('Delete all results?', 'This will remove every saved result. This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All',
        style: 'destructive',
        onPress: async () => {
          setItems([]);
          await AsyncStorage.setItem('scanHistory', JSON.stringify([]));
          setDeleteMode(false);
        },
      },
    ]);
  };

  const loadHistory = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('scanHistory');
      const list: HistoryItem[] = raw ? JSON.parse(raw) : [];
      setItems(list);
    } catch (e) {
      console.warn('Failed to load history:', e);
      setItems([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleToggleDelete = () => {
    if (!deleteMode) {
      // First press: enter delete mode, do NOT show modal
      setDeleteMode(true);
      setConfirmVisible(false);
      return;
    }
    // Already in delete mode
    if (selected.size > 0) {
      // Only show modal when there are selected items
      setConfirmVisible(true);
    } else {
      // No selection: toggle delete mode off, no modal
      setDeleteMode(false);
      setConfirmVisible(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={[styles.item, styles.itemRow, styles.itemShadow]}>
      {(item.imageUri || item.photoBase64) ? (
        <Image
          source={item.imageUri ? { uri: item.imageUri } : { uri: `data:image/jpeg;base64,${item.photoBase64}` }}
          style={styles.itemThumb}
        />
      ) : (
        <View style={[styles.itemThumb, styles.itemThumbPlaceholder]} />
      )}

      <TouchableOpacity
        style={styles.itemMain}
        activeOpacity={0.8}
        onPress={() => (!deleteMode ? handleOpen(item) : toggleSelect(item.id))}
      >
        <View style={styles.titleRow}>
          <Text style={styles.itemTitle}>
            {((item.prediction || '').toLowerCase().includes('healthy') ? 'Healthy' : 'Unhealthy')}
          </Text>
          <View
            style={[
              styles.badge,
              (item.prediction || '').toLowerCase().includes('healthy')
                ? styles.badgeHealthy
                : styles.badgeWarn,
            ]}
          >
            <Text style={styles.badgeText} numberOfLines={1}>
              {((item.prediction || '').toLowerCase().includes('healthy') ? 'Healthy' : 'Unhealthy')}
            </Text>
          </View>
        </View>
        <Text style={styles.itemSubtitle} numberOfLines={1}>
          {(item.confidence ? `${item.confidence}%` : '—')}
          {item.weather ? `  •  ${item.weather}` : ''}
        </Text>
        <Text style={styles.itemDate}>{new Date(item.timestamp).toLocaleString()}</Text>
      </TouchableOpacity>

      {deleteMode && (
        <TouchableOpacity
          accessibilityLabel="Select result"
          onPress={() => toggleSelect(item.id)}
          style={[styles.checkbox, selected.has(item.id) && styles.checkboxChecked]}
        >
          {selected.has(item.id) && <Text style={styles.checkboxMark}>✓</Text>}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.bgAccent} />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.rightControls}>
          {deleteMode && (
            <TouchableOpacity onPress={() => {
              const allSelected = selected.size === items.length && items.length > 0;
              if (allSelected) setSelected(new Set());
              else setSelected(new Set(items.map(i => i.id)));
            }} style={styles.selectAllButton}>
              <Text style={styles.selectAllText}>Select All</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleToggleDelete} style={styles.deleteButton}>
            <Text style={[styles.deleteText, deleteMode && styles.deleteTextActive]}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={<RefreshControl refreshing={false} onRefresh={loadHistory} tintColor="#fff" />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No scans yet</Text>
            <Text style={styles.emptySubtitle}>Your scan history will appear here.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.replace('/camera')}>
              <Text style={styles.emptyBtnText}>Start a Scan</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete</Text>
            <Text style={styles.modalMessage}>
              {selected.size > 0
                ? 'Are you sure you want to delete the selected item(s)?'
                : 'No items selected. You can Select All or tap items to check them.'}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalCancel]} onPress={() => setConfirmVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={selected.size === 0}
                style={[
                  styles.modalBtn,
                  styles.modalDelete,
                  selected.size === 0 && styles.modalDeleteDisabled,
                ]}
                onPress={async () => {
                  const updated = items.filter((x) => !selected.has(x.id));
                  setItems(updated);
                  await AsyncStorage.setItem('scanHistory', JSON.stringify(updated));
                  setSelected(new Set());
                  setDeleteMode(false);
                  setConfirmVisible(false);
                }}
              >
                <Text style={[styles.modalDeleteText, selected.size === 0 && styles.modalDeleteTextDisabled]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bgAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#EAF4EC',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#EAF4EC',
    borderBottomWidth: 1,
    borderBottomColor: '#D5E6DA',
    position: 'relative',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: 60,
  },
  backText: {
    color: '#1F3D2A',
    fontSize: 16,
    fontWeight: '700',
  },
  selectAllText: {
    color: '#2D5A3D',
    fontSize: 12,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#1F3D2A',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    pointerEvents: 'none',
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginRight: 4,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: 24,
    alignItems: 'flex-end',
  },
  deleteText: {
    color: '#1F3D2A',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteTextActive: {
    color: '#DC2626',
  },
  listContent: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#F7FAF7',
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5EFE8',
  },
  itemShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemThumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#EAF4EC',
  },
  itemThumbPlaceholder: {
    borderWidth: 1,
    borderColor: '#E5EFE8',
  },
  itemMain: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemDeleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D5A3D',
    backgroundColor: 'rgba(255, 107, 107, 0.08)'
  },
  itemDeleteText: {
    color: '#FF9A9A',
    fontSize: 18,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2D5A3D',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#2D5A3D',
    borderColor: '#2D5A3D',
  },
  checkboxMark: {
    color: '#FFFFFF',
    fontWeight: '900',
    lineHeight: 18,
  },
  itemTitle: {
    color: '#1F3D2A',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  itemSubtitle: {
    color: '#3F5E4C',
    fontSize: 13,
    marginBottom: 2,
  },
  itemDate: {
    color: '#5E8570',
    fontSize: 12,
  },
  empty: {
    color: '#6B8F7A',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: '#1F3D2A',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#4B6B57',
    fontSize: 14,
    marginBottom: 16,
  },
  emptyBtn: {
    backgroundColor: '#2D5A3D',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    color: '#1F3D2A',
    fontWeight: '800',
    fontSize: 12,
  },
  badgeHealthy: {
    backgroundColor: '#E6F4EA',
    borderColor: '#B7E2C4',
  },
  badgeDanger: {
    backgroundColor: '#FDECEC',
    borderColor: '#F6B2B2',
  },
  badgeWarn: {
    backgroundColor: '#FFF6E5',
    borderColor: '#FFE1A3',
  },
  badgeNeutral: {
    backgroundColor: '#EEF2F1',
    borderColor: '#D8E5DE',
  },
  titleHealthy: { color: '#1F7A54' },
  titleDanger: { color: '#DC2626' },
  titleWarn: { color: '#B45309' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    color: '#111827',
  },
  modalMessage: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalCancelText: {
    color: '#111827',
    fontWeight: '700',
  },
  modalDelete: {
    backgroundColor: '#DC2626',
  },
  modalDeleteDisabled: {
    backgroundColor: '#FCA5A5',
  },
  modalDeleteText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  modalDeleteTextDisabled: {
    color: '#F3F4F6',
  },
});
