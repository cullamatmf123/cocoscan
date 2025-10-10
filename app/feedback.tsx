import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Modal, 
  TextInput, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';
import { AuthService } from '../services/authService';

export default function FeedbackScreen() {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handlePress = () => {
    setVisible(true);
  };

  // Auto-hide the note after a short delay
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (visible) {
      timer = setTimeout(() => setVisible(false), 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible]);

  const submitFeedback = async () => {
    // Validation
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }

    if (message.trim().length < 10) {
      Alert.alert('Feedback Required', 'Please provide at least 10 characters of feedback.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to submit feedback.');
      return;
    }

    setSubmitting(true);

    try {
      // Create feedback document
      const feedbackData = {
        userId: user.uid,
        userEmail: user.email,
        rating: rating,
        message: message.trim(),
        timestamp: Timestamp.now(),
        status: 'new', // new, reviewed, resolved
        deviceInfo: {
          platform: 'mobile',
          userAgent: 'CocoScan App'
        }
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'feedback'), feedbackData);
      
      console.log('Feedback submitted successfully:', docRef.id);
      
      // Show success message
      setVisible(true);
      
      // Reset form
      setMessage('');
      setRating(0);
      
      // Navigate back after a delay
      setTimeout(() => {
        router.back();
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      
      let errorMessage = 'Failed to submit feedback. ';
      
      if (error.code === 'permission-denied') {
        errorMessage += 'You do not have permission to submit feedback.';
      } else if (error.code === 'unavailable') {
        errorMessage += 'Service is currently unavailable. Please try again later.';
      } else {
        errorMessage += 'Please check your internet connection and try again.';
      }
      
      Alert.alert('Submission Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>We value your opinion.</Text>
          <Text style={styles.subtitle}>How would you rate your overall experience?</Text>

          <View style={styles.starsRow}>
            {[1,2,3,4,5].map(i => (
              <TouchableOpacity 
                key={i} 
                onPress={() => setRating(i)} 
                accessibilityRole="button" 
                accessibilityLabel={`Rate ${i} star${i>1?'s':''}`}
                disabled={submitting}
              >
                <Ionicons 
                  name={i <= rating ? 'star' : 'star-outline'} 
                  size={28} 
                  color={i <= rating ? '#F59E0B' : '#94A3B8'} 
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.helper}>Kindly take a moment to tell us what you think.</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Your feedback... (minimum 10 characters)"
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            editable={!submitting}
            maxLength={500}
          />
          
          <Text style={styles.charCount}>
            {message.length}/500 characters
          </Text>

          <TouchableOpacity 
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} 
            onPress={submitFeedback} 
            activeOpacity={0.9}
            disabled={submitting}
          >
            {submitting ? (
              <View style={styles.submittingContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.submitText}>Submitting...</Text>
              </View>
            ) : (
              <Text style={styles.submitText}>Share my feedback</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.secondary} 
          onPress={() => router.back()}
          disabled={submitting}
        >
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
            <Ionicons name="checkmark-circle" size={24} color="#065F46" />
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
  charCount: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  submitBtn: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: '#2d5a3d',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  submitBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  submittingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
