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
      setItems(historyItems || []); // Ensure it's always an array
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
      const idsToDelete = Array.from(selected).filter(id => id); // Filter out empty IDs
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

  // Rest of your component remains the same...
  // (renderItem, loading check, return JSX, styles)