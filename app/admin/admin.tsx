// app/admin/admin.tsx
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Admin() {
  const handleSignIn = () => {
    try {
      router.push('/admin/signin');
    } catch (error) {
      console.log('Navigation to admin sign in failed:', error);
    }
  };

  const handleSignUp = () => {
    try {
      router.push('/admin/signup');
    } catch (error) {
      console.log('Navigation to admin sign up failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.palmTreeIcon}>🌴</Text>
          </View>
          <Text style={styles.appName}>COCOSCAN</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpText}>Create Account</Text>
          </TouchableOpacity>
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
    marginBottom: 30,
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#2D5A3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  palmTreeIcon: {
    fontSize: 50,
    textAlign: 'center',
  },
  appName: {
    color: '#2D5A3D',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 15,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
  buttonsContainer: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  signInButton: {
    backgroundColor: 'transparent',
    borderColor: '#2D5A3D',
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 14,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  signInText: {
    color: '#2D5A3D',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  signUpButton: {
    backgroundColor: '#FFD700',
    borderRadius: 25,
    paddingVertical: 14,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpText: {
    color: '#2D5A3D',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
});