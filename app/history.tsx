import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
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
  ActivityIndicator,
} from 'react-native';
import { HistoryItem, deleteMultipleHistoryItems, getUserHistory } from '../services/historyService';

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
    const validIds = items.map(it => it.id).filter(Boolean) as string[];
    if (selected.size === validIds.length && validIds.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(validIds));
    }
  };
  
  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleOpen(item)} activeOpacity={0.8}>
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbFallback]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.prediction || 'Unknown'}</Text>
        <Text style={styles.itemSub}>{new Date(item.timestamp || Date.now()).toLocaleString()}</Text>
      </View>
      {deleteMode && (
        <View style={[styles.check, selected.has(item.id || '') && styles.checkActive]} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2d5a3d" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} accessibilityRole="button">
          <Text style={styles.headerBtnText}> Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={handleSelectAll}><Text style={styles.headerBtnText}>Select all</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleToggleDelete}><Text style={styles.headerBtnText}>{deleteMode ? 'Done' : 'Delete'}</Text></TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(it) => it.id || Math.random().toString(36)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadHistory} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6b7280' }}>No history yet.</Text>}
      />

      {/* Confirm modal */}
      <Modal transparent visible={confirmVisible} animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={{ fontWeight: '900', color: '#111827', marginBottom: 8 }}>Delete selected?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={() => setConfirmVisible(false)}><Text style={{ color: '#111827', fontWeight: '700' }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteSelected}><Text style={{ color: '#B91C1C', fontWeight: '700' }}>Delete</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Footer navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} accessibilityLabel="Go to Home">
          <Feather name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/camera')} accessibilityLabel="Open Camera">
          <Feather name="camera" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/history')} accessibilityLabel="View History">
          <Feather name="clock" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/profile')} accessibilityLabel="Open Profile">
          <Feather name="user" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 56, backgroundColor: '#2d5a3d', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  headerBtnText: { color: '#fff', fontWeight: '700' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  thumb: { width: 48, height: 48, borderRadius: 8, marginRight: 4, backgroundColor: '#F3F4F6' },
  thumbFallback: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#111827', fontWeight: '900' },
  itemSub: { color: '#6b7280', fontSize: 12 },
  check: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: '#9CA3AF' },
  checkActive: { backgroundColor: '#2d5a3d', borderColor: '#2d5a3d' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { backgroundColor: '#fff', padding: 16, borderRadius: 10, width: '80%' },
  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'nowrap',
    zIndex: 10,
  },
  footerItem: { flex: 1, alignItems: 'center' },
});