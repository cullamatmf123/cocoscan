import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AuthService } from '../services/authService';
import { HistoryItem, getUserHistory } from '../services/historyService';

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);

  const handleStartScanning = () => router.push('/camera');
  const handleHistoryPress = () => router.push('/history');
  const handleProfilePress = () => router.push('/profile');
  const handleMenuPress = () => setMenuVisible(true);

  useEffect(() => {
    const computeName = (email?: string | null, fallback?: string | null) => {
      if (fallback && fallback.trim()) return fallback.trim();
      if (!email) return 'User';
      const handle = email.split('@')[0] || '';
      const noTrailingDigits = handle.replace(/[0-9]+$/, '');
      const base = noTrailingDigits || handle;
      return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
    };

    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(computeName(user.email, user.displayName));
        (async () => {
          try {
            const items = await getUserHistory();
            setRecentHistory((items || []).slice(0, 3));
          } catch {
            setRecentHistory([]);
          }
        })();
      } else {
        router.replace('/signin');
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🌴</Text>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.menuBackdrop}>
          <TouchableOpacity style={styles.menuBackdropTouch} activeOpacity={1} onPress={() => setMenuVisible(false)} />
          <View style={styles.menuSheet}>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/about-app'); }}>
              <Ionicons name="information-circle-outline" size={20} color="#1F3D2A" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.replace('/'); }}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" style={styles.menuIcon} />
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetBox}>
          <Text style={styles.greetTitle}>Hi, {displayName || 'User'}</Text>
          <Text style={styles.greetSubtitle}>Dashboard</Text>
        </View>

        {/* What are CRB Visual Indicators? */}
        <Text style={styles.sectionTitle}>What are CRB Visual Indicators</Text>
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

        {/* Health Problem? */}
        <Text style={styles.sectionTitle}>Health Problem?</Text>
        <View style={styles.processCard}>
          <View style={styles.processRow}>
            <View style={styles.processStep}>
              <Image
                source={require('../assets/images/design/capture.png')}
                style={styles.stepImage}
                resizeMode="contain"
              />
              <Text style={styles.stepText}>Take a photo / Classify Health image</Text>
            </View>
            <Text style={styles.processArrow}>{'>'}</Text>
            <View style={styles.processStep}>
              <Image
                source={require('../assets/images/design/identify.png')}
                style={styles.stepImage}
                resizeMode="contain"
              />
              <Text style={styles.stepText}>Health Classification</Text>
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

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} activeOpacity={0.7} accessibilityLabel="Go to Home">
          <Feather name="home" size={24} color="#1F3D2A" />
          <Text style={[styles.footerLabel, { color: '#1F3D2A', fontWeight: '700' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleStartScanning} activeOpacity={0.7} accessibilityLabel="Open Camera">
          <Feather name="camera" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleHistoryPress} activeOpacity={0.7} accessibilityLabel="View History">
          <Feather name="clock" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleProfilePress} activeOpacity={0.7} accessibilityLabel="Open Profile">
          <Feather name="user" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  
  /* App Bar */
  appBar: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
  },
  hamburger: {
    padding: 8,
    borderRadius: 12,
  },
  menuLineDark: {
    width: 26,
    height: 3,
    backgroundColor: '#0F3D1E',
    marginVertical: 3,
    borderRadius: 2
  },
  brandTitle: {
    color: '#0F3D1E',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F4D36',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F2C200',
    shadowColor: '#F2C200',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  logoEmoji: { 
    fontSize: 20 
  },
  
  /* Menu Modal */
  menuBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)' 
  },
  menuBackdropTouch: {
    ...StyleSheet.absoluteFillObject as any,
  },
  menuSheet: {
    position: 'absolute',
    top: 72,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    width: 240,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  menuIcon: {
    marginRight: 12
  },
  menuItemText: {
    color: '#1F3D2A',
    fontSize: 16,
    fontWeight: '600'
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 12,
  },
  
  /* Content */
  scrollContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 24 
  },
  greetBox: { 
    marginBottom: 8 
  },
  greetTitle: { 
    color: '#0F3D1E', 
    fontSize: 22, 
    fontWeight: '800' 
  },
  greetSubtitle: { 
    color: '#374151', 
    fontSize: 14, 
    fontWeight: '700', 
    marginTop: 2 
  },
  sectionTitle: { 
    marginTop: 8, 
    marginBottom: 8, 
    color: '#111827', 
    fontSize: 16, 
    fontWeight: '800' 
  },
  heroButton: { 
    marginBottom: 12, 
    borderRadius: 12, 
    overflow: 'hidden' 
  },
  heroImage: { 
    width: '100%', 
    height: 150 
  },
  cardRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16 
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
    elevation: 4 
  },
  cardIconWrapper: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12, 
    overflow: 'hidden' 
  },
  cardIconImage: { 
    width: 22, 
    height: 22 
  },
  cardTitle: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: '700' 
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
    elevation: 3 
  },
  processRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  processStep: { 
    alignItems: 'center', 
    flex: 1 
  },
  stepImage: { 
    width: 44, 
    height: 44, 
    marginBottom: 6 
  },
  stepText: { 
    color: '#111827', 
    fontSize: 12, 
    textAlign: 'center' 
  },
  processArrow: { 
    marginHorizontal: 6, 
    color: '#111827', 
    fontSize: 28, 
    fontWeight: '900' 
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
    elevation: 2 
  },
  scanButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '700', 
    textAlign: 'center' 
  },
  historyHeader: { 
    marginTop: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  historyTitle: { 
    color: '#111827', 
    fontSize: 16, 
    fontWeight: '800' 
  },
  chevron: { 
    color: '#111827', 
    fontSize: 24, 
    fontWeight: '800' 
  },
  historyEmpty: { 
    color: '#6B7280', 
    marginTop: 8 
  },
  historyItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    padding: 10, 
    marginBottom: 8 
  },
  historyThumb: { 
    width: 54, 
    height: 54, 
    borderRadius: 12, 
    backgroundColor: '#F3F4F6', 
    marginRight: 12 
  },
  historyThumbFallback: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  historyItemTitle: { 
    color: '#111827', 
    fontWeight: '800' 
  },
  historyItemSub: { 
    color: '#6B7280', 
    fontSize: 12 
  },
  
  /* Footer */
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  footerLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
  },
});