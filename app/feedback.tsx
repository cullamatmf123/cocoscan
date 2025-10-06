import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function FeedbackScreen() {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  const handlePress = () => {
    setVisible(true);
  };

  // Auto-hide the note after a short delay
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (visible) {
      timer = setTimeout(() => setVisible(false), 1500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible]);

  const submit = () => {
    // Here you could send to Firestore or API
    setVisible(true);
    setMessage('');
    setRating(0);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>We value your opinion.</Text>
          <Text style={styles.subtitle}>How would you rate your overall experience?</Text>

          <View style={styles.starsRow}>
            {[1,2,3,4,5].map(i => (
              <TouchableOpacity key={i} onPress={() => setRating(i)} accessibilityRole="button" accessibilityLabel={`Rate ${i} star${i>1?'s':''}`}>
                <Ionicons name={i <= rating ? 'star' : 'star-outline'} size={28} color={i <= rating ? '#F59E0B' : '#94A3B8'} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.helper}>Kindly take a moment to tell us what you think.</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Your feedback..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={submit} activeOpacity={0.9}>
            <Text style={styles.submitText}>Share my feedback</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.secondary} onPress={() => router.back()}>
          <Text style={styles.secondaryText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.noteBackdrop}>
          <View style={styles.noteCard}>
            <Ionicons name="sparkles-outline" size={20} color="#065F46" />
            <Text style={styles.noteText}>Thanks for your feedback! 🌱</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#2d5a3d' },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  title: { color: '#111827', fontSize: 22, fontWeight: '900', marginBottom: 8 },
  subtitle: { color: '#1f2937', textAlign: 'center', fontWeight: '700', marginBottom: 8 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: 8 },
  helper: { color: '#1f2937', textAlign: 'center', marginTop: 8, marginBottom: 8 },
  input: {
    minHeight: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#ffffff',
    padding: 12,
    color: '#111827',
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: '#2d5a3d',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  submitText: { color: '#ffffff', fontWeight: '800' },
  secondary: { marginTop: 14, paddingVertical: 8, paddingHorizontal: 12 },
  secondaryText: { color: '#E5F2E9', fontWeight: '800' },
  noteBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', alignItems: 'center', justifyContent: 'center' },
  noteCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  noteText: { color: '#065F46', fontWeight: '800' },
});
