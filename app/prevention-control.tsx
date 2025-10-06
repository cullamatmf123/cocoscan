import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PreventionControlScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.feedbackBtn}
          activeOpacity={0.9}
          onPress={() => router.push('/feedback')}
          accessibilityRole="button"
          accessibilityLabel="Open feedback"
        >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="#ffffff" />
          <Text style={styles.feedbackText}>Help us Grow</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  text: { color: '#1f2937', marginBottom: 12, fontWeight: '700' },
  feedbackBtn: {
    backgroundColor: '#50AF84',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 2,
  },
  feedbackText: { color: '#fff', fontWeight: '800' },
});
