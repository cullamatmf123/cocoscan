import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { HistoryItem, getUserHistory } from '../services/historyService';
import { AuthService } from '../services/authService';

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);

  const handleStartScanning = () => {
    router.push('/camera');
  };

  const handleHistoryPress = () => {
    router.push('/history');
  };

  useEffect(() => {
    const computeName = (email?: string | null, fallback?: string | null) => {
      if (fallback && fallback.trim()) return fallback.trim();
      if (!email) return 'User';
      const handle = (email.split('@')[0] || '');
      const noTrailingDigits = handle.replace(/[0-9]+$/, '');
      const base = noTrailingDigits || handle;
      return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
    };

    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(computeName(user.email, user.displayName));
        // Load recent history preview
        (async () => {
          try {
            const items = await getUserHistory();
            setRecentHistory((items || []).slice(0, 3));
          } catch (e) {
            setRecentHistory([]);
          }
        })();
      } else {
        router.replace('/signin');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={handleMenuPress}
          accessibilityLabel="Open menu"
        >
          <View style={styles.menuLineDark} />
          <View style={styles.menuLineDark} />
          <View style={styles.menuLineDark} />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>COCOSCAN</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfilePress}
          accessibilityLabel="Open profile"
        >
          <View style={styles.defaultProfileIcon} />
        </TouchableOpacity>
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

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search (temporarily hidden) */}
        {false && (
          <View style={styles.searchBar}>
            <View style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#6B7280"
            />
          </View>
        )}

        {/* Greeting */}
        <View style={styles.greetBox}>
          <Text style={styles.greetTitle}>Hi, {displayName || 'User'}</Text>
          <Text style={styles.greetSubtitle}>Dashboard</Text>
        </View>

        {/* What is Oryctes Rhinoceros? */}
        <Text style={styles.sectionTitle}>What is Oryctes Rhinoceros?</Text>
        <TouchableOpacity
          style={styles.heroButton}
          activeOpacity={0.9}
          onPress={() => router.push('/about')}
          accessibilityLabel="Learn more about Oryctes Rhinoceros"
        >
          <Image
            source={require('../assets/images/design/homepage.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Info Cards */}
        <View style={styles.cardRow}>
          <TouchableOpacity style={styles.infoCard} activeOpacity={0.9} onPress={() => router.push('/prevention-control')}>
            <View style={styles.cardIconWrapper}>
              <Image
                source={require('../assets/images/design/image.png')}
                style={styles.cardIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.cardTitle}>Prevention & Control</Text>
          </TouchableOpacity>
          <View style={{ width: 12 }} />
          <TouchableOpacity style={styles.infoCard} activeOpacity={0.9} onPress={() => router.push('/pesticides')}>
            <View style={styles.cardIconWrapper}>
              <Image
                source={require('../assets/images/design/pesticide.png')}
                style={styles.cardIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.cardTitle}>Pesticide Recommendations</Text>
          </TouchableOpacity>
        </View>

        {/* Pest Problem? */}
        <Text style={styles.sectionTitle}>Pest Problem?</Text>
        <View style={styles.processCard}>
          <View style={styles.processRow}>
            <View style={styles.processStep}>
              <Image
                source={require('../assets/images/design/capture.png')}
                style={styles.stepImage}
                resizeMode="contain"
              />
              <Text style={styles.stepText}>Take a photo / Scan image</Text>
            </View>
            <Text style={styles.processArrow}>{'>'}</Text>
            <View style={styles.processStep}>
              <Image
                source={require('../assets/images/design/identify.png')}
                style={styles.stepImage}
                resizeMode="contain"
              />
              <Text style={styles.stepText}>Pest Detection</Text>
            </View>
            <Text style={styles.processArrow}>{'>'}</Text>
            <View style={styles.processStep}>
              <Image
                source={require('../assets/images/design/result.png')}
                style={styles.stepImage}
                resizeMode="contain"
              />
              <Text style={styles.stepText}>Result</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.scanButton} onPress={handleStartScanning}>
            <Text style={styles.scanButtonText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>

        {/* History header */}
        <TouchableOpacity style={styles.historyHeader} onPress={handleHistoryPress}>
          <Text style={styles.historyTitle}>History</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Recent History list (max 3 items) */}
        {recentHistory.length === 0 ? (
          <Text style={styles.historyEmpty}>No recent history.</Text>
        ) : (
          <View style={{ marginTop: 8 }}>
            {recentHistory.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item.id || Math.random().toString(36)}
                style={styles.historyItem}
                onPress={() => router.push('/history')}
                activeOpacity={0.85}
                accessibilityLabel={`Open history item ${item.prediction || 'Unknown'}`}
              >
                {item.imageUri ? (
                  <Image source={{ uri: item.imageUri }} style={styles.historyThumb} />
                ) : (
                  <View style={[styles.historyThumb, styles.historyThumbFallback]} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyItemTitle}>{item.prediction || 'Unknown'}</Text>
                  <Text style={styles.historyItemSub}>{new Date(item.timestamp || Date.now()).toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} accessibilityLabel="Go to Home">
          <Feather name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleStartScanning} accessibilityLabel="Open Camera">
          <Feather name="camera" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleHistoryPress} accessibilityLabel="View History">
          <Feather name="clock" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleProfilePress} accessibilityLabel="Open Profile">
          <Feather name="user" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appBar: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  hamburger: {
    padding: 8,
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
  menuLineDark: {
    width: 24,
    height: 3,
    backgroundColor: '#0F3D1E',
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
    backgroundColor: '#C9E4CA',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  brandTitle: {
    color: '#0F3D1E',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  searchBar: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9CA3AF',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  greetBox: {
    marginBottom: 8,
  },
  greetTitle: {
    color: '#0F3D1E',
    fontSize: 22,
    fontWeight: '800',
  },
  greetSubtitle: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  imageRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageTile: {
    flex: 1,
    height: 110,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  heroButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 110,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#195A2B',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF7EB',
    marginBottom: 12,
  },
  cardIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardIconImage: {
    width: 22,
    height: 22,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  processCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  processRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  processStep: {
    alignItems: 'center',
    flex: 1,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111827',
    marginBottom: 6,
  },
  stepImage: {
    width: 44,
    height: 44,
    marginBottom: 6,
  },
  stepText: {
    color: '#111827',
    fontSize: 12,
    textAlign: 'center',
  },
  processArrow: {
    marginHorizontal: 6,
    color: '#111827',
    fontSize: 28,
    fontWeight: '900',
  },
  scanButton: {
    backgroundColor: '#3F7A4A',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  historyHeader: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  chevron: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '800',
  },
  historyGrid: { flexDirection: 'row', marginTop: 8 },
  historyTile: { flex: 1, height: 120, borderRadius: 16, borderWidth: 2, borderColor: '#9FE3A9', backgroundColor: '#FFFFFF', marginRight: 12 },
  historyEmpty: { color: '#6B7280', marginTop: 8 },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 10, marginBottom: 8 },
  historyThumbRow: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  historyThumb: { width: 54, height: 54, borderRadius: 12, backgroundColor: '#F3F4F6', marginRight: 12 },
  historyThumbSpacing: { marginRight: 12 },
  historyThumbFallback: { alignItems: 'center', justifyContent: 'center' },
  historyItemTitle: { color: '#111827', fontWeight: '800' },
  historyItemSub: { color: '#6B7280', fontSize: 12 },
  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
  },
  footerIconText: {
    fontSize: 24,
    color: '#111827',
  },
});
