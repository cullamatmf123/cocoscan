import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthService } from '../services/authService';

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');

  const handleStartScanning = () => {
    router.push('/camera');
  };

  const handleHistoryPress = () => {
    router.push('/history');
  };

  useEffect(() => {
    const computeName = (email?: string | null, fallback?: string | null) => {
      if (fallback && fallback.trim()) return fallback.trim();
      if (!email) return '';
      const handle = (email.split('@')[0] || '');
      const noTrailingDigits = handle.replace(/[0-9]+$/, '');
      const base = noTrailingDigits || handle;
      return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
    };
    const current = AuthService.getCurrentUser();
    setDisplayName(computeName(current?.email ?? null, current?.displayName ?? null));
    const unsub = AuthService.onAuthStateChanged((u) => {
      setDisplayName(computeName(u?.email ?? null, u?.displayName ?? null));
    });
    return () => unsub && unsub();
  }, []);

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {/* Green header at the top (swapped from image background) */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          {/* Header moved inside hero */}
          <View style={styles.headerRow}>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={handleProfilePress}
              accessibilityLabel="Open profile"
            >
              <View style={styles.defaultProfileIcon} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={handleMenuPress}
              accessibilityLabel="Open menu"
            >
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </TouchableOpacity>
          </View>
          <Text style={styles.heroTitle}>Hi, {displayName || 'User'}</Text>
          <Text style={styles.heroSubtitle}>Dashboard</Text>
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
          <TouchableOpacity style={styles.menuBackdropTouch} activeOpacity={1} onPress={() => setMenuVisible(false)} />
          <View style={styles.menuSheet}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); handleProfilePress(); }}>
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/about-app'); }}>
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); Alert.alert('Settings', 'Settings will be available soon.'); }}>
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.replace('/'); }}>
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Content section now uses the coconut tree image as background */}
      <ImageBackground
        source={require('../assets/images/design/dwarf-coconut-tree.webp')}
        style={styles.contentBg}
        imageStyle={styles.contentBgImage}
        resizeMode="cover"
      >
        <View style={styles.contentOverlay} />
        <View style={styles.content}>
          <View style={styles.brandGroup} accessibilityRole="header" accessibilityLabel="CocoScan Welcome">
            {/* Top line: COCOSCAN */}
            <View style={styles.brandStack}>
              <Text style={styles.brandTopOuter}>COCOSCAN</Text>
              <Text style={styles.brandTopInner}>COCOSCAN</Text>
            </View>
            {/* Bottom line: Welcome! */}
            <View style={[styles.brandStack, { marginTop: 2 }]}>
              <Text style={styles.brandBottomOuter}>Welcome!</Text>
              <Text style={styles.brandBottomInner}>Welcome!</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Detect Oryctes Rhinoceros in Dwarf Coconut Trees.</Text>
          
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={handleStartScanning}
          >
            <Text style={styles.scanButtonText}>Start Scanning</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={handleHistoryPress}
          >
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D5A3D',
  },
  hero: {
    height: 210,
    width: '100%',
    borderRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    marginBottom: 0,
  },
  heroImage: {
    borderRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject as any,
    backgroundColor: 'transparent',
  },
  heroEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  menuButton: {
    padding: 10,
    marginLeft: 12,
  },
  menuLine: {
    width: 25,
    height: 3,
    backgroundColor: '#FFFFFF',
    marginVertical: 2,
    borderRadius: 2,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  menuBackdropTouch: {
    ...StyleSheet.absoluteFillObject as any,
  },
  menuSheet: {
    position: 'absolute',
    top: 56,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    width: 180,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuItemText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 2,
  },
  profileButton: {
    padding: 5,
  },
  defaultProfileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 100,
  },
  contentBg: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  contentOverlay: {
    ...StyleSheet.absoluteFillObject as any,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentBgImage: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  brandGroup: {
    alignItems: 'center',
    marginBottom: 10,
  },
  brandStack: {
    position: 'relative',
    alignItems: 'center',
  },
  brandTopOuter: {
    position: 'absolute',
    color: '#869053',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#869053',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  brandTopInner: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },
  brandBottomOuter: {
    position: 'absolute',
    color: '#869053',
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#869053',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
  },
  brandBottomInner: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  scanButton: {
    backgroundColor: '#FFD700',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 60,
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButtonText: {
    color: '#2D5A3D',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  historyButton: {
    backgroundColor: '#2D5A3D',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 60,
    width: 280,
    marginTop: 16,
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});