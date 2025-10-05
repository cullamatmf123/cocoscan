import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function GetStarted() {
  const [selectedUserType, setSelectedUserType] = useState<'user' | 'admin' | null>(null);

  const handleUserSelection = (userType: 'user' | 'admin') => {
    setSelectedUserType(userType);
  };

  const handleGetStarted = () => {
    if (selectedUserType === 'user') {
      router.push('/user');
    } else if (selectedUserType === 'admin') {
      router.push('/admin/admin');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D5A3D" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.palmTreeIcon}>🌴</Text>
          </View>
          <Text style={styles.appName}>COCOSCAN</Text>
          <Text style={styles.tagline}>AI-Powered Coconut Analysis</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeTitle}>Get Started</Text>
          <Text style={styles.welcomeDescription}>
            Choose your role to access the right tools for your needs
          </Text>

          {/* User Type Selection Cards */}
          <View style={styles.cardsContainer}>
            <TouchableOpacity 
              style={[
                styles.userCard,
                selectedUserType === 'user' && styles.selectedCard
              ]}
              onPress={() => handleUserSelection('user')}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.cardIcon}>👨‍🌾</Text>
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>User</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.userCard,
                selectedUserType === 'admin' && styles.selectedCard
              ]}
              onPress={() => handleUserSelection('admin')}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.cardIcon}>👨‍💼</Text>
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>Admin</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            {selectedUserType && (
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleGetStarted}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryButtonText}>
                  Continue as {selectedUserType === 'user' ? 'User' : 'Admin'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D5A3D',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  palmTreeIcon: {
    fontSize: 32,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    marginTop: 8,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 32,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#FFD700',
    backgroundColor: '#FFFBF0',
    shadowColor: '#FFD700',
    shadowOpacity: 0.15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
  cardFeatures: {
    gap: 6,
  },
  featureText: {
    fontSize: 14,
    color: '#4A7C59',
    fontWeight: '400',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#2D5A3D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2D5A3D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  }
});