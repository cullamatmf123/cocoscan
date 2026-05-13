import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  HistoryItem,
  deleteMultipleHistoryItems,
  getUserHistory,
} from '../services/historyService';

export default function HistoryScreen() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

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
        temperature:
          typeof item.temperature === 'number'
            ? String(item.temperature)
            : '',
        humidity:
          typeof item.humidity === 'number' ? String(item.humidity) : '',
        lightCondition: item.lightCondition || '',
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

    setSelected((prev) => {
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
      const idsToDelete = Array.from(selected).filter((id) => id);
      if (idsToDelete.length === 0) return;

      await deleteMultipleHistoryItems(idsToDelete);

      setItems((prevItems) =>
        prevItems.filter((item) => !selected.has(item.id || ''))
      );
      setSelected(new Set());
      setDeleteMode(false);
      setConfirmVisible(false);
    } catch (error) {
      console.error('Error deleting selected items:', error);
      Alert.alert(
        'Error',
        'Failed to delete selected items. Please try again.'
      );
    }
  };

  const handleSelectAll = () => {
    const validIds = items.map((it) => it.id).filter(Boolean) as string[];
    if (selected.size === validIds.length && validIds.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(validIds));
    }
  };

  const formatDateHeader = (ts?: Date | number | string) => {
    const d = new Date((ts as any) || Date.now());
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  const isSameDay = (
    a?: Date | number | string,
    b?: Date | number | string
  ) => {
    const da = new Date((a as any) || 0),
      db = new Date((b as any) || 0);
    return (
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
    );
  };

  const formatTime = (ts?: Date | number | string) => {
    const d = new Date((ts as any) || Date.now());
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ── UI ONLY: maps prediction label to a human-readable subtitle ──────────
  const getSubtitle = (prediction: string): string => {
    const pred = (prediction || '').toLowerCase().trim();

    if (pred === 'unspecified' || pred.startsWith('unspecified')) {
      return 'Unspecified';
    }
    if (pred === 'not infested' || pred.startsWith('not infested')) {
      return 'No CRB infestation';
    }
    if (pred === 'infestation from other pest' || pred.startsWith('infestation from other pest')) {
      return 'Not CRB infestation';
    }
    if (pred.includes('infested by crb') || pred.includes('crb')) {
      return 'CRB has signs & symptoms';
    }
    // Fallback — show raw prediction text
    return prediction;
  };

  const renderItem = ({ item, index }: { item: HistoryItem; index: number }) => {
    const prev = items[index - 1];
    const showHeader =
      index === 0 || !isSameDay(prev?.timestamp, item.timestamp);

    return (
      <View>
        {showHeader && (
          <View style={styles.dateHeaderRow}>
            <Text style={styles.dateHeader}>
              {formatDateHeader(item.timestamp)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {deleteMode && (
                <TouchableOpacity
                  onPress={handleSelectAll}
                  accessibilityLabel="Select all"
                >
                  <Text style={styles.dateHeaderActionText}>Select All</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleToggleDelete}
                accessibilityLabel="Toggle delete mode"
              >
                <Feather name="trash-2" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleOpen(item)}
          activeOpacity={0.85}
        >
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbFallback]} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>
              {item.prediction || 'Unknown'}
            </Text>
            <Text style={styles.itemSub}>
              {getSubtitle(item.prediction || '')}
            </Text>
          </View>
          <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
          {deleteMode && (
            <View
              style={[
                styles.check,
                selected.has(item.id || '') && styles.checkActive,
              ]}
            >
              {selected.has(item.id || '') && (
                <Feather name="check" size={12} color="#FFFFFF" />
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2d5a3d" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={() => setMenuVisible(true)}
          accessibilityLabel="Open menu"
        >
          <View style={styles.menuLineDark} />
          <View style={styles.menuLineDark} />
          <View style={styles.menuLineDark} />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>COCOSCAN</Text>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🌴</Text>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuBackdrop}>
          <TouchableOpacity
            style={styles.menuBackdropTouch}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
          <View style={styles.menuSheet}>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/about-app');
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#1F3D2A"
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.replace('/');
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#DC2626"
                style={styles.menuIcon}
              />
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.pageHeading}>History</Text>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(it) => it.id || Math.random().toString(36)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
          backgroundColor: '#FFFFFF',
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadHistory} />
        }
        ListEmptyComponent={
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
            paddingHorizontal: 20,
          }}>
            <Feather
              name="inbox"
              size={48}
              color="#9CA3AF"
              style={{ marginBottom: 16 }}
            />
            <Text style={{
              textAlign: 'center',
              color: '#6B7280',
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
            }}>
              No history yet
            </Text>
            <Text style={{
              textAlign: 'center',
              color: '#9CA3AF',
              fontSize: 14,
              lineHeight: 20,
            }}>
              Start scanning coconut palms to see your detection history here
            </Text>
          </View>
        }
      />

      {/* Confirm Delete Modal */}
      <Modal
        transparent
        visible={confirmVisible}
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={{ fontWeight: '900', color: '#111827', marginBottom: 8 }}>
              Delete selected?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={() => setConfirmVisible(false)}>
                <Text style={{ color: '#111827', fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteSelected}>
                <Text style={{ color: '#B91C1C', fontWeight: '700' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Footer navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.replace('/home')}
          activeOpacity={0.7}
          accessibilityLabel="Go to Home"
        >
          <Feather name="home" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/camera')}
          activeOpacity={0.7}
          accessibilityLabel="Open Camera"
        >
          <Feather name="camera" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/history')}
          activeOpacity={0.7}
          accessibilityLabel="View History"
        >
          <Feather name="clock" size={24} color="#1F3D2A" />
          <Text style={[styles.footerLabel, { color: '#1F3D2A', fontWeight: '700' }]}>
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/profile')}
          activeOpacity={0.7}
          accessibilityLabel="Open Profile"
        >
          <Feather name="user" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* App Bar */
  appBar: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
  },
  hamburger: {
    padding: 8,
    borderRadius: 12,
  },
  menuLineDark: {
    width: 26,
    height: 3,
    backgroundColor: '#0F3D1E',
    marginVertical: 3,
    borderRadius: 2,
  },
  brandTitle: {
    color: '#0F3D1E',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  appBarSpacer: { width: 40, height: 40 },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F4D36',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F2C200',
    shadowColor: '#F2C200',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  logoEmoji: { fontSize: 20 },

  /* Menu Modal */
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menuBackdropTouch: {
    ...(StyleSheet.absoluteFillObject as any),
  },
  menuSheet: {
    position: 'absolute',
    top: 72,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    width: 240,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuIcon: { marginRight: 12 },
  menuItemText: {
    color: '#1F3D2A',
    fontSize: 16,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 12,
  },

  /* Page */
  pageHeading: {
    color: '#0F3D1E',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
    alignSelf: 'center',
  },

  /* List items */
  dateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 8,
  },
  dateHeader: { color: '#111827', fontWeight: '900' },
  dateHeaderActionText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  thumbFallback: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#111827', fontWeight: '900', fontSize: 16 },
  itemSub: { color: '#6b7280', fontSize: 13, fontStyle: 'italic' },
  timeText: { color: '#6B7280', fontSize: 12, fontWeight: '700' },
  check: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkActive: {
    backgroundColor: '#2d5a3d',
    borderColor: '#2d5a3d',
    borderWidth: 0,
  },

  /* Confirm modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    width: '80%',
  },

  /* Footer */
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  footerLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
  },
});