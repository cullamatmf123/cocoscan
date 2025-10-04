import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signUp } from '../services/authService';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateForm = (): boolean => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!termsAccepted) {
      setError('You must accept the Terms & Conditions');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    
    try {
      await signUp(email, password, name);
      
      Alert.alert(
        'Account Created',
        'Your account has been created successfully! Please sign in to continue.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/signin')
          }
        ]
      );
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignIn = () => {
    router.push('/signin');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.palmTreeIcon}>🌴</Text>
            </View>
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join CocoScan to start analyzing your coconuts</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isLoading}
                onSubmitEditing={handleSignUp}
              />
            </View>

            <View style={styles.termsContainer}>
              <TouchableOpacity 
                style={styles.checkbox} 
                onPress={() => setTermsAccepted(!termsAccepted)}
                disabled={isLoading}
              >
                <View style={[styles.checkboxBox, termsAccepted && styles.checkboxChecked]}>
                  {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.button, (!termsAccepted || isLoading) && styles.buttonDisabled]} 
              onPress={handleSignUp}
              disabled={!termsAccepted || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signinContainer}>
              <Text style={styles.signinText}>Already have an account? </Text>
              <TouchableOpacity onPress={navigateToSignIn} disabled={isLoading}>
                <Text style={styles.signinLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#2D5A3D',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
    marginBottom: 20,
  },
  palmTreeIcon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#2D5A3D',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  termsContainer: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#2D5A3D',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2D5A3D',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: '#2D5A3D',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#2D5A3D',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signinText: {
    color: '#666',
  },
  signinLink: {
    color: '#2D5A3D',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
});