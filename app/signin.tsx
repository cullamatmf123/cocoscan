import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthService } from '../services/authService';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const result = await AuthService.signIn(email, password);
      
      if (result.success) {
        router.replace('/home');
      } else {
        Alert.alert('Sign In Failed', result.error || 'An error occurred');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToSignUp = () => {
    try {
      router.push('/signup');
    } catch (error) {
      console.log('Navigation to signup failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo with palm tree icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.palmTreeIcon}>🌴</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Sign In</Text>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#A0A0A0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.signInButton, loading && styles.buttonDisabled]} 
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.signInText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signUpPrompt}>
            <Text style={styles.signUpPromptText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleGoToSignUp} disabled={loading}>
              <Text style={[styles.signUpLink, loading && styles.linkDisabled]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 20,
  },
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
  palmTreeIcon: {
    fontSize: 40,
    textAlign: 'center',
  },
  title: {
    color: '#2D5A3D',
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#2D5A3D',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333333',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#2D5A3D',
    borderRadius: 25,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
  signUpPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpPromptText: {
    color: '#666666',
    fontSize: 16,
  },
  signUpLink: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  linkDisabled: {
    color: '#A0A0A0',
  },
});