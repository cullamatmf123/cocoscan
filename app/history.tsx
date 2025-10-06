import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { 
  Alert, 
  FlatList, 
  Image, 
  Modal, 
  RefreshControl, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator 
} from 'react-native';
import { HistoryItem, getUserHistory, deleteMultipleHistoryItems } from '../services/historyService';

export default function HistoryScreen() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleBack = () => router.replace('/home');

  const loadHistory = useCallback(async () => {
    try {
      setRefreshing(true);
      const historyItems = await getUserHistory();
      setItems(historyItems || []);
    } catch (error) {
      console.warn('Failed to load history:', error);
      Alert.alert('Error', 'Failed to load history. Please try again.');
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleOpen = (item: HistoryItem) => {
    if (deleteMode) {
      if (item.id) {
        toggleSelect(item.id);
      }
      return;
    }
    
    router.push({
      pathname: '/result',
      params: {
        id: item.id || '',
        fromHistory: '1',
        imageUri: item.imageUri || undefined,
        photoBase64: item.photoBase64 || undefined,
        prediction: item.prediction || 'Unknown',
        confidence: item.confidence || '0',
        details: item.details || '',
        recommendations: item.recommendations || '',
        weather: item.weather || '',
        soil: item.soil || '',
      },
    });
  };

  const handleToggleDelete = () => {
    if (!deleteMode) {
      setDeleteMode(true);
      setConfirmVisible(false);
      return;
    }
    
    if (selected.size > 0) {
      setConfirmVisible(true);
    } else {
      setDeleteMode(false);
      setConfirmVisible(false);
    }
  };

  const toggleSelect = (id: string) => {
    if (!id) return;
    
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    try {
      const idsToDelete = Array.from(selected).filter(id => id);
      if (idsToDelete.length === 0) return;
      
      await deleteMultipleHistoryItems(idsToDelete);
      
      setItems(prevItems => prevItems.filter(item => !selected.has(item.id || '')));
      setSelected(new Set());
      setDeleteMode(false);
      setConfirmVisible(false);
    } catch (error) {
      console.error('Error deleting selected items:', error);
      Alert.alert('Error', 'Failed to delete selected items. Please try again.');
    }
  };

  const handleSelectAll = () => {
    const validIds = items.map(item => item.id).filter(id => id) as string[];
    
    if (selected.size === validIds.length && validIds.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(validIds));
    }
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
        onPress={() => handleOpen(item)}
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
        <Text style={styles.itemDate}>
          {item.timestamp ? new Date(item.timestamp).toLocaleString() : '—'}
        </Text>
      </TouchableOpacity>

      {deleteMode && (
        <TouchableOpacity
          accessibilityLabel="Select result"
          onPress={() => item.id && toggleSelect(item.id)}
          style={[styles.checkbox, selected.has(item.id || '') && styles.checkboxChecked]}
        >
          {selected.has(item.id || '') && <Text style={styles.checkboxMark}>✓</Text>}
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2D5A3D" />
      </View>
    );
  }

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
            <TouchableOpacity 
              onPress={handleSelectAll} 
              style={styles.selectAllButton}
            >
              <Text style={styles.selectAllText}>
                {selected.size > 0 && selected.size === items.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleToggleDelete} style={styles.deleteButton}>
            <Text style={[styles.deleteText, deleteMode && styles.deleteTextActive]}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id || ''}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadHistory} 
            tintColor="#2D5A3D"
            colors={['#2D5A3D']}
          />
        }
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
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalCancel]} 
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={selected.size === 0}
                style={[
                  styles.modalBtn,
                  styles.modalDelete,
                  selected.size === 0 && styles.modalDeleteDisabled,
                ]}
                onPress={handleDeleteSelected}
              >
                <Text style={[
                  styles.modalDeleteText, 
                  selected.size === 0 && styles.modalDeleteTextDisabled
                ]}>
                  Delete
                </Text>
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
    backgroundColor: '#F7FAF7',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    gap: 12,
  },
  selectAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(45, 90, 61, 0.1)',
  },
  selectAllText: {
    color: '#2D5A3D',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    color: '#1F3D2A',
    fontSize: 18,
  },
  deleteTextActive: {
    color: '#DC2626',
  },
  listContent: {
    padding: 16,
    paddingTop: 16,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5EFE8',
  },
  itemShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#F0F7F2',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F3D2A',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeHealthy: {
    backgroundColor: '#E6F4EA',
    borderColor: '#B7E2C4',
  },
  badgeWarn: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#4B6B57',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: '#7A8C82',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2D5A3D',
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2D5A3D',
  },
  checkboxMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyWrap: {
    marginTop: 80,
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F3D2A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#5E8570',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: '#2D5A3D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F3D2A',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 16,
    color: '#4B6B57',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  modalCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalCancelText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  modalDelete: {
    backgroundColor: '#DC2626',
  },
  modalDeleteDisabled: {
    backgroundColor: '#FCA5A5',
  },
  modalDeleteText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalDeleteTextDisabled: {
    color: '#FEE2E2',
  },
});