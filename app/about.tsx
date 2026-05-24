import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 450;

const HERO_IMAGES = [
  require('../assets/images/design/homepage.png'),
  require('../assets/images/design/crb-damage(2).jpg'),
  require('../assets/images/design/crb-damage(5).jpg'),
  require('../assets/images/design/crb-damage(7).jpg'),
  require('../assets/images/design/crb-damage(1).jpg'),
];

// ── V-SHAPED CUT IMAGES ───────────────────────────────────────────────────────
const V_CUT_IMAGES = [
  require('../assets/images/design/crb-damage(5).jpg'),
  require('../assets/images/design/crb-damage(6).jpg'),
  require('../assets/images/design/crb-damage(8).jpg'),
  require('../assets/images/design/crb-damage(4).jpg'),
];

// ── BOREHOLE IMAGES ───────────────────────────────────────────────────────────
const BOREHOLE_IMAGES = [
  require('../assets/images/design/crb-damage(2).jpg'),
  require('../assets/images/design/crb-damage(1).jpg'),
  require('../assets/images/design/crb-damage(7).jpg'),
  require('../assets/images/design/crb-damage(3).jpg'),
];

// ── CONTENT DATA ──────────────────────────────────────────────────────────────

const V_CUT_BULLETS = [
  'V-shaped or triangular cuts on leaflets — formed when the beetle feeds inside the tightly rolled spear leaf before it fully unfurls, leaving symmetrical notches across multiple leaflets once opened',
  'Fan-shaped or wedge-shaped missing tissue along frond margins; damage is most visible on the 2nd–4th frond from the crown center where the beetle typically exits',
  'Shortened, asymmetrical, or "ragged" fronds in the crown — the cut pattern is unique to CRB and distinguishes it from other pest or disease damage',
  'In dwarf varieties, V-cuts appear closer to the crown base due to the compact growth habit, making them easier to spot at eye level compared to tall palms',
];

const BOREHOLE_BULLETS = [
  'Circular to oval boreholes (1–3 cm diameter) visible on the petiole base, crown shaft, or soft trunk tissue near the growing point — the primary entry point of adult beetles',
  'Fibrous frass (chewed palm fiber mixed with excrement) packed at or extruding from the borehole entrance; frass appearance ranges from dry and fibrous to moist and compacted depending on infestation age',
  'Dark sap staining or oozing around borehole edges, often accompanied by a fermented or sour odor indicating active feeding or secondary microbial infection',
  'In dwarf coconut, boreholes are accessible at lower trunk heights, allowing earlier ground-level detection compared to tall coconut varieties',
];

// ─────────────────────────────────────────────────────────────────────────────

export default function AboutScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [vCutOpen, setVCutOpen] = useState(false);
  const [boreholeOpen, setBoreholeOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<any>(null);

  const handleHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== activeSlide) setActiveSlide(index);
  };

  return (
    <View style={styles.root}>

      {/* ── EVERYTHING IN ONE SCROLL ── */}
      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainScrollContent}
      >
        {/* ── HERO + HEADER ── */}
        <View style={styles.heroContainer}>
          {/* Carousel images */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleHeroScroll}
            onMomentumScrollEnd={handleHeroScroll}
            scrollEventThrottle={8}
            style={StyleSheet.absoluteFillObject}
          >
            {HERO_IMAGES.map((src, i) => (
              <View key={i} style={{ width: SCREEN_WIDTH, height: HERO_HEIGHT }}>
                <Image source={src} style={styles.heroBg} resizeMode="cover" />
                <View style={styles.heroOverlay} />
              </View>
            ))}
          </ScrollView>

          {/* ── HEADER ── */}
          <SafeAreaView style={styles.headerSafe}>
            <View style={styles.appBar}>
              <TouchableOpacity
                style={styles.hamburger}
                onPress={() => setMenuVisible(true)}
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
          </SafeAreaView>

          {/* Hero text at bottom of hero */}
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>Visual Indicators{'\n'}of CRB Infestation</Text>
            <Text style={styles.heroSubtitle}>Identifying signs of damage on dwarf coconut palms</Text>
            <View style={styles.dotsRow}>
              {HERO_IMAGES.map((_, i) => (
                <View key={i} style={[styles.dot, i === activeSlide && styles.dotActive]} />
              ))}
            </View>
          </View>
        </View>

        {/* ── WHITE SHEET ── */}
        <View style={styles.sheetCard}>

          {/* Title + Target variety badge */}
          <Text style={styles.beetleTitle}>CRB Damage on Dwarf Coconut</Text>
          <View style={styles.scientificBadge}>
            <Text style={styles.scientificLabel}>TARGET VARIETY</Text>
            <Text style={styles.scientificName}>Cocos nucifera (Dwarf)</Text>
          </View>

          {/* Overview Card — always expanded */}
          <View style={styles.accordionCard}>
            <View style={styles.accordionHeader}>
              <View style={styles.accordionLeft}>
                <View style={styles.iconCircle}>
                  <Feather name="book-open" size={16} color="#0F3D1E" />
                </View>
                <Text style={styles.accordionTitle}>Overview</Text>
              </View>
            </View>
            <View style={styles.accordionBody}>
              <View style={styles.dividerLine} />
              <Text style={styles.paragraph}>
                The Coconut Rhinoceros Beetle (Oryctes rhinoceros) attacks dwarf coconut trees by
                boring into the crown and feeding on young developing tissue. Two key visual indicators
                confirm CRB infestation: V-shaped cuts on leaves — formed as the beetle feeds inside
                the tightly rolled spear leaf — and boreholes on the trunk or crown, often accompanied
                by fibrous frass at the entry point. Dwarf coconut varieties are especially vulnerable
                due to their compact crowns and lower trunk height, which makes both damage types
                accessible and observable at ground level, enabling earlier detection.
              </Text>
            </View>
          </View>

          {/* ── V-SHAPED LEAF CUTS ACCORDION ── */}
          <View style={styles.accordionCard}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => setVCutOpen(v => !v)}
              activeOpacity={0.75}
            >
              <View style={styles.accordionLeft}>
                <View style={styles.iconCircle}>
                  <Feather name="scissors" size={16} color="#0F3D1E" />
                </View>
                <Text style={styles.accordionTitle}>V-Shaped Cuts on Leaves</Text>
              </View>
              <Feather
                name={vCutOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>

            {vCutOpen && (
              <View style={styles.accordionBody}>
                <View style={styles.dividerLine} />

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.photoRow}
                >
                  {V_CUT_IMAGES.map((src, i) => (
                    <TouchableOpacity key={i} onPress={() => setZoomedImage(src)} activeOpacity={0.85}>
                      <Image source={src} style={styles.signImage} resizeMode="cover" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.bulletList}>
                  {V_CUT_BULLETS.map((text, i) => (
                    <View key={i} style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>{text}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* ── BOREHOLES & FRASS ACCORDION ── */}
          <View style={styles.accordionCard}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => setBoreholeOpen(v => !v)}
              activeOpacity={0.75}
            >
              <View style={styles.accordionLeft}>
                <View style={styles.iconCircle}>
                  <Feather name="alert-circle" size={16} color="#0F3D1E" />
                </View>
                <Text style={styles.accordionTitle}>Boreholes & Frass</Text>
              </View>
              <Feather
                name={boreholeOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>

            {boreholeOpen && (
              <View style={styles.accordionBody}>
                <View style={styles.dividerLine} />

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.photoRow}
                >
                  {BOREHOLE_IMAGES.map((src, i) => (
                    <TouchableOpacity key={i} onPress={() => setZoomedImage(src)} activeOpacity={0.85}>
                      <Image source={src} style={styles.signImage} resizeMode="cover" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.bulletList}>
                  {BOREHOLE_BULLETS.map((text, i) => (
                    <View key={i} style={styles.bulletItem}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.bulletText}>{text}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ── MENU MODAL ── */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuBackdrop}>
          <TouchableOpacity
            style={styles.menuBackdropTouch}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
          <View style={styles.menuSheet}>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { setMenuVisible(false); router.push('/about-app'); }}
            >
              <Ionicons name="information-circle-outline" size={20} color="#1F3D2A" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { setMenuVisible(false); router.replace('/'); }}
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" style={styles.menuIcon} />
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── LIGHTBOX MODAL ── */}
      <Modal
        visible={!!zoomedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setZoomedImage(null)}
      >
        <View style={styles.lightboxBackdrop}>
          <SafeAreaView style={styles.lightboxTopBar}>
            <TouchableOpacity
              style={styles.lightboxBackBtn}
              onPress={() => setZoomedImage(null)}
              accessibilityLabel="Go back"
            >
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
              <Text style={styles.lightboxBackText}>Back</Text>
            </TouchableOpacity>
          </SafeAreaView>
          {zoomedImage && (
            <Image source={zoomedImage} style={styles.lightboxImage} resizeMode="contain" />
          )}
        </View>
      </Modal>

      {/* ── FOOTER NAV ── */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} accessibilityLabel="Go to Home">
          <Feather name="home" size={24} color="#0F3D1E" />
          <Text style={[styles.footerLabel, styles.footerLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/camera')} accessibilityLabel="Open Camera">
          <Feather name="camera" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/history')} accessibilityLabel="View History">
          <Feather name="clock" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/profile')} accessibilityLabel="Open Profile">
          <Feather name="user" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#111827' },

  /* ─── MAIN SCROLL ─── */
  mainScroll: { flex: 1 },
  mainScrollContent: { paddingBottom: 0 },

  /* ─── HERO CAROUSEL ─── */
  heroContainer: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.52)',
  },

  /* ── HEADER STYLES ── */
  headerSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  appBar: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  hamburger: {
    padding: 8,
    borderRadius: 12,
  },
  menuLineDark: {
    width: 26,
    height: 3,
    backgroundColor: '#ffffff',
    marginVertical: 3,
    borderRadius: 2,
  },
  brandTitle: {
    color: '#ffffff',
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
  logoEmoji: { fontSize: 20 },

  /* Hero text */
  heroTextBlock: {
    position: 'absolute',
    bottom: 28,
    left: 20,
    right: 20,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 34,
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 14,
  },
  dotsRow: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: '#F2C200',
    width: 22,
    borderRadius: 4,
  },

  /* ─── WHITE SHEET ─── */
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 22,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -6 },
    elevation: 8,
    minHeight: 600,
  },

  /* Title & Scientific Name */
  beetleTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 10,
  },
  scientificBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 20,
  },
  scientificLabel: {
    fontSize: 9,
    color: '#166534',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  scientificName: {
    fontSize: 14,
    color: '#0F3D1E',
    fontWeight: '700',
    fontStyle: 'italic',
  },

  /* ─── ACCORDION ─── */
  accordionCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  accordionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
  },
  iconCircleSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
  },
  accordionTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  dividerLine: { height: 1, backgroundColor: '#F3F4F6' },
  accordionBody: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12 },
  paragraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    letterSpacing: 0.15,
  },

  /* ─── PHOTO ROW ─── */
  photoRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 6,
    marginBottom: 14,
  },
  signImage: {
    width: 180,
    height: 110,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  /* ─── BULLET LIST ─── */
  bulletList: { gap: 8 },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F8FFF9',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0F3D1E',
    flexShrink: 0,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
    letterSpacing: 0.15,
  },

  /* ─── MENU MODAL ─── */
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  menuBackdropTouch: { ...StyleSheet.absoluteFillObject as any },
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
    paddingVertical: 16,
  },
  menuIcon: { marginRight: 12 },
  menuItemText: { color: '#1F3D2A', fontSize: 16, fontWeight: '600' },
  menuDivider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 12 },

  /* ─── FOOTER NAV ─── */
  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  footerLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  footerLabelActive: { color: '#0F3D1E' },

  /* ─── LIGHTBOX ─── */
  lightboxBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.96)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    zIndex: 10,
  },
  lightboxBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  lightboxBackText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  lightboxImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
});