import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthService } from '../../services/authService';

export default function AdminSignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await AuthService.signUp({
        email,
        password,
        fullName,
        isAdmin: true,
      });

      if (result.success) {
        Alert.alert('Success', 'Admin account created successfully! Please sign in.', [
          { text: 'OK', onPress: () => router.replace('/admin/signin') },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to create admin account');
      }
    } catch (error: any) {
      console.error('Admin sign up error:', error);
      Alert.alert('Error', error?.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    try {
      router.push('/admin/signin');
    } catch (err) {
      console.log('Navigation to admin signin failed:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      {Platform.OS === 'android' && (
        <View style={{ height: StatusBar.currentHeight, backgroundColor: '#FFFFFF' }} />
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.palmTreeIcon}>🌴</Text>
            </View>
          </View>

          <Text style={styles.title}>Create Admin Account</Text>
          <Text style={styles.subtitle}>Register an administrator</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Enter full name"
                placeholderTextColor="#A0A0A0"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                editable={!loading}
                returnKeyType="next"
              />
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter email"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                returnKeyType="next"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                returnKeyType="next"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Confirm password"
                placeholderTextColor="#A0A0A0"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
                onSubmitEditing={handleSignUp}
                returnKeyType="done"
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.signUpText}>Create Account</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={handleBackToSignIn} disabled={loading}>
              <Text style={styles.backButtonText}>Back to Sign In</Text>
            </TouchableOpacity>

            <View style={styles.signInPrompt}>
              <Text style={styles.signInPromptText}>Already an admin? </Text>
              <TouchableOpacity onPress={handleBackToSignIn} disabled={loading}>
                <Text style={[styles.signInLink, loading && styles.linkDisabled]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flexGrow: 1,
    width: '100%',
    padding: 24,
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  logoContainer: { alignItems: 'center', marginBottom: 12 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  palmTreeIcon: { fontSize: 40, textAlign: 'center' },
  title: {
    color: '#2D5A3D',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: { color: '#666666', fontSize: 16, textAlign: 'center', marginBottom: 24 },
  formContainer: { width: '100%', marginBottom: 24 },
  inputContainer: { marginBottom: 16 },
  inputLabel: {
    color: '#2D5A3D',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F9F7',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333333',
  },
  inputError: { borderColor: '#E74C3C' },
  errorText: { color: '#E74C3C', fontSize: 12, marginTop: 6 },
  buttonsContainer: { width: '100%', alignItems: 'center', marginTop: 8 },
  signUpButton: {
    backgroundColor: '#2D5A3D',
    borderRadius: 25,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: { backgroundColor: '#A0A0A0', opacity: 0.6 },
  signUpText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  backButton: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E7D32',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 12,
  },
  backButtonText: { color: '#2E7D32', fontSize: 16, fontWeight: '600' },
  signInPrompt: { flexDirection: 'row', alignItems: 'center' },
  signInPromptText: { color: '#666666', fontSize: 16 },
  signInLink: { color: '#2D5A3D', fontSize: 16, fontWeight: '600' },
  linkDisabled: { color: '#A0A0A0' },
});