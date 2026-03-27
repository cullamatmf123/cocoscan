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
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width: SW } = Dimensions.get('window');
const HERO_H = 420;

// ── DATA ──────────────────────────────────────────────────────────────────────
const PESTICIDES = [
  {
    id: 'karate',
    name: 'Lambda-cyhalothrin',
    subtitle: 'Karate · Synthetic Pyrethroid',
    thumb: require('../assets/images/design/Karate-front.webp'),
    images: [
      require('../assets/images/design/Karate-front.webp'),
      require('../assets/images/design/Karate-back.webp'),
      require('../assets/images/design/karate-ingredients.webp'),
    ],
    description:
      'Lambda-cyhalothrin (Karate) is a synthetic pyrethroid insecticide widely used in agriculture to control beetles, caterpillars, aphids, and borers. It disrupts sodium channels in insect nerve cells, causing paralysis and death.',
    specs: [
      { label: 'Type', value: 'Synthetic pyrethroid insecticide' },
      { label: 'Brand', value: 'Karate (Syngenta)' },
      { label: 'Mode of action', value: 'Disrupts sodium channels → paralysis & death' },
      { label: 'Target pests', value: 'Chewing & sucking insects on rice, maize, vegetables, coconut' },
      { label: 'Formulation', value: 'Emulsifiable concentrate (EC) or water-dispersible granules (WG)' },
    ],
    benefits: [
      'Fast knockdown with long residual effect',
      'Low application rates needed',
      'Compatible with IPM when used properly',
    ],
    caution: 'Toxic to fish, bees, and other non-target organisms — apply with care.',
  },
  {
    id: 'imidacloprid',
    name: 'Imidacloprid',
    subtitle: 'Neonicotinoid · Systemic',
    thumb: require('../assets/images/design/imidacloprid.png'),
    images: [
      require('../assets/images/design/imidacloprid.png'),
      require('../assets/images/design/Imidacloprid(2).jpg'),
      require('../assets/images/design/Imidacloprid(3).webp'),
    ],
    description:
      'Imidacloprid is a systemic neonicotinoid insecticide. It binds to nicotinic acetylcholine receptors in insect nerve cells, causing overstimulation, paralysis, and death. Absorbed by the plant, it protects from within.',
    specs: [
      { label: 'Type', value: 'Neonicotinoid systemic insecticide' },
      { label: 'Mode of action', value: 'Binds nACh receptors → overstimulation & death' },
      { label: 'Systemic property', value: 'Absorbed by plant; distributed through all tissues' },
      { label: 'Target pests', value: 'Aphids, whiteflies, leafhoppers, mealybugs, termites' },
      { label: 'Formulation', value: 'SC, WP, or G (check local label)' },
    ],
    benefits: [
      'Long-lasting, effective at low doses',
      'Can be applied to soil or foliage',
      'Controls both foliar and soil-dwelling pests',
    ],
    caution: 'Highly toxic to bees and aquatic organisms — use within responsible IPM programs.',
  },
  {
    id: 'emamectin',
    name: 'Emamectin Benzoate',
    subtitle: 'Avermectin Derivative · Biopesticide',
    thumb: require('../assets/images/design/Emamectin-Benzoate.webp'),
    images: [
      require('../assets/images/design/Emamectin-Benzoate.webp'),
      require('../assets/images/design/Emman.jpg'),
      require('../assets/images/design/Emame.webp'),
    ],
    description:
      'Emamectin Benzoate is a biological insecticide derived from avermectin, produced by the soil microorganism Streptomyces avermitilis. It activates chloride channels in insect nerve and muscle cells, leading to paralysis.',
    specs: [
      { label: 'Type', value: 'Biological (microbial-derived) insecticide' },
      { label: 'Class', value: 'Avermectin derivative' },
      { label: 'Mode of action', value: 'Activates chloride channels → paralysis & death' },
      { label: 'Target pests', value: 'Caterpillars, leaf rollers, fruit & pod borers' },
      { label: 'Formulation', value: 'Emamectin Benzoate 5% SG (soluble granules)' },
    ],
    benefits: [
      'Highly effective at very low doses',
      'Long residual activity',
      'Low toxicity to beneficial insects and mammals',
    ],
    caution: 'Avoid spraying during peak bee activity; observe pre-harvest intervals.',
  },
  {
    id: 'chlorantraniliprole',
    name: 'Chlorantraniliprole',
    subtitle: 'Anthranilic Diamide · Modern',
    thumb: require('../assets/images/design/chloros-chlorantraniliprole.webp'),
    images: [
      require('../assets/images/design/chloros-chlorantranili.webp'),
      require('../assets/images/design/chloros-chlorantraniliprole.webp'),
      require('../assets/images/design/prevathon.webp'),
    ],
    description:
      'Chlorantraniliprole is a modern anthranilic diamide insecticide. It activates ryanodine receptors in insect muscle cells, causing uncontrolled calcium release, paralysis, and death — with exceptional safety for beneficial organisms.',
    specs: [
      { label: 'Type', value: 'Anthranilic diamide insecticide' },
      { label: 'Mode of action', value: 'Activates ryanodine receptors → Ca²⁺ release & paralysis' },
      { label: 'Systemic activity', value: 'Translaminar & systemic movement within plant tissue' },
      { label: 'Target pests', value: 'Caterpillars, borers, leaf folders, beetles' },
      { label: 'Formulation', value: '18.5% SC or 0.4% GR' },
    ],
    benefits: [
      'Effective at very low doses; long-lasting control',
      'Safe for bees and natural predators',
      'Minimal resistance risk when used correctly',
    ],
    caution: 'Avoid overuse to prevent resistance; follow PHI and label instructions strictly.',
  },
] as const;

type PesticideId = typeof PESTICIDES[number]['id'];

const HERO_IMAGES = PESTICIDES.map((p) => p.thumb);

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function PesticidesScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState<PesticideId | null>(null);
  const [ppeOpen, setPpeOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<any>(null);

  const active = expanded ? PESTICIDES.find((p) => p.id === expanded)! : null;

  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
    if (idx !== activeSlide) setActiveSlide(idx);
  };

  return (
    <View style={s.root}>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <View style={s.hero}>
          <ScrollView
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onScroll={onHeroScroll} onMomentumScrollEnd={onHeroScroll}
            scrollEventThrottle={8} style={StyleSheet.absoluteFillObject}
          >
            {HERO_IMAGES.map((src, i) => (
              <View key={i} style={{ width: SW, height: HERO_H }}>
                <Image source={src} style={s.heroBg} resizeMode="contain" />
                <View style={s.heroOverlay} />
              </View>
            ))}
          </ScrollView>

          <SafeAreaView style={s.headerSafe}>
            <View style={s.headerBar}>
              <TouchableOpacity style={s.hamburger} onPress={() => setMenuVisible(true)}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={[s.menuLine, i === 1 && { width: 16 }]} />
                ))}
              </TouchableOpacity>
              <Text style={s.brandTitle}>COCOSCAN</Text>
              <View style={s.logoBadge}>
                <Text style={s.logoEmoji}>🌴</Text>
              </View>
            </View>
          </SafeAreaView>

          <View style={s.heroText}>
            <View style={s.heroPill}><Text style={s.heroPillText}>PEST MANAGEMENT</Text></View>
            <Text style={s.heroTitle}>Recommended{'\n'}Pesticides</Text>
            <View style={s.dots}>
              {HERO_IMAGES.map((_, i) => (
                <View key={i} style={[s.dot, i === activeSlide && s.dotActive]} />
              ))}
            </View>
          </View>
        </View>

        {/* ── CONTENT SHEET ── */}
        <View style={s.sheet}>

          {!active ? (
            <>
              {/* Intro banner */}
              <View style={s.banner}>
                <Text style={s.bannerIcon}>⚠️</Text>
                <Text style={s.bannerText}>
                  Tap a card to learn about each pesticide. Always follow local regulations and product labels.
                </Text>
              </View>

              <Text style={s.sectionTitle}>Pesticide Options</Text>

              <View style={s.grid}>
                {PESTICIDES.map((p) => (
                  <TouchableOpacity key={p.id} style={s.card} onPress={() => setExpanded(p.id)} activeOpacity={0.75}>
                    <View style={s.cardImgWrap}>
                      <Image source={p.thumb} style={s.cardImg} />
                      <View style={s.cardImgShade} />
                    </View>
                    <View style={s.cardBody}>
                      <Text style={s.cardName}>{p.name}</Text>
                      <Text style={s.cardSub}>{p.subtitle}</Text>
                    </View>
                    <View style={s.cardArrow}>
                      <Feather name="chevron-right" size={16} color="#3F7A4A" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            /* ── DETAIL VIEW ── */
            <View>
              <TouchableOpacity style={s.backBtn} onPress={() => setExpanded(null)} activeOpacity={0.7}>
                <Feather name="arrow-left" size={18} color="#0F3D1E" />
                <Text style={s.backText}>All Pesticides</Text>
              </TouchableOpacity>

              {/* Image strip */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.strip}>
                {active.images.map((img, i) => (
                  <TouchableOpacity key={i} style={s.stripTile} onPress={() => setZoomedImage(img)} activeOpacity={0.85}>
                    <Image source={img} style={s.stripImg} />
                    <View style={s.stripZoomHint}>
                      <Feather name="zoom-in" size={14} color="#fff" />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Header */}
              <View style={s.detailHeader}>
                <Text style={s.detailName}>{active.name}</Text>
                <Text style={s.detailSub}>{active.subtitle}</Text>
              </View>

              <Text style={s.detailDesc}>{active.description}</Text>

              {/* Specs table */}
              <Text style={s.detailSection}>Specifications</Text>
              <View style={s.table}>
                {active.specs.map((spec, i) => (
                  <View key={i} style={[s.tableRow, i % 2 === 0 && s.tableRowAlt]}>
                    <Text style={s.tableLabel}>{spec.label}</Text>
                    <Text style={s.tableValue}>{spec.value}</Text>
                  </View>
                ))}
              </View>

              {/* Benefits */}
              <Text style={s.detailSection}>Benefits</Text>
              <View style={s.benefitList}>
                {active.benefits.map((b, i) => (
                  <View key={i} style={s.benefitRow}>
                    <View style={s.benefitDot} />
                    <Text style={s.benefitText}>{b}</Text>
                  </View>
                ))}
              </View>

              {/* Caution */}
              <View style={s.cautionBox}>
                <Text style={s.cautionIcon}>⚠️</Text>
                <Text style={s.cautionText}>{active.caution}</Text>
              </View>

              <View style={{ height: 8 }} />
            </View>
          )}

          {/* ── PPE ACCORDION ── */}
          <TouchableOpacity style={s.ppeHeader} onPress={() => setPpeOpen((v) => !v)} activeOpacity={0.8}>
            <View style={s.ppeLeft}>
              <Text style={s.ppeIcon}>🦺</Text>
              <Text style={s.ppeTitle}>Personal Protective Equipment</Text>
            </View>
            <Feather name={ppeOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#0F3D1E" />
          </TouchableOpacity>

          {ppeOpen && (
            <View style={s.ppeBody}>
              {[
                'Chemical-resistant gloves (e.g., nitrile)',
                'Long-sleeved shirt and long trousers',
                'Chemical-resistant boots — no open footwear',
                'Eye protection: goggles or face shield',
                'Respirator with correct cartridge (per label)',
                'Hat or hood; chemical apron when mixing',
              ].map((item, i) => (
                <View key={i} style={s.ppeRow}>
                  <View style={s.ppeDot} />
                  <Text style={s.ppeItem}>{item}</Text>
                </View>
              ))}
              <View style={s.ppeNote}>
                <Text style={s.ppeNoteText}>
                  Mix and apply in well-ventilated areas. Avoid eating or drinking during use. Wash hands and
                  shower after work. Keep children and pets away. Follow re-entry and pre-harvest intervals.
                  Store pesticides securely and out of reach.
                </Text>
              </View>
            </View>
          )}

          {/* ── DISCLAIMER ── */}
          <View style={s.disclaimer}>
            <Text style={s.disclaimerText}>
              This information is general guidance only. Always consult local regulations, current product
              labels, and extension services for approved products, rates, re-entry intervals, and safety
              requirements. Use pesticides responsibly and in accordance with applicable laws.
            </Text>
          </View>

          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ── IMAGE ZOOM MODAL ── */}
      <Modal visible={!!zoomedImage} transparent animationType="fade" onRequestClose={() => setZoomedImage(null)}>
        <TouchableWithoutFeedback onPress={() => setZoomedImage(null)}>
          <View style={s.zoomBackdrop}>
            <TouchableWithoutFeedback>
              <View style={s.zoomContainer}>
                {zoomedImage && (
                  <Image source={zoomedImage} style={s.zoomImage} resizeMode="contain" />
                )}
                <TouchableOpacity style={s.zoomClose} onPress={() => setZoomedImage(null)} activeOpacity={0.8}>
                  <View style={s.zoomCloseInner}>
                    <Ionicons name="close" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── MENU MODAL ── */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <View style={s.menuBackdrop}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject as any} onPress={() => setMenuVisible(false)} />
          <View style={s.menuSheet}>
            <TouchableOpacity style={s.menuItem} onPress={() => { setMenuVisible(false); router.push('/about-app'); }}>
              <Ionicons name="information-circle-outline" size={20} color="#1F3D2A" style={s.menuIcon} />
              <Text style={s.menuItemText}>About</Text>
            </TouchableOpacity>
            <View style={s.menuDivider} />
            <TouchableOpacity style={s.menuItem} onPress={() => { setMenuVisible(false); router.replace('/'); }}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" style={s.menuIcon} />
              <Text style={[s.menuItemText, { color: '#DC2626' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── FOOTER ── */}
      <View style={s.footer}>
        {[
          { icon: 'home', label: 'Home', route: '/home' },
          { icon: 'camera', label: 'Camera', route: '/camera' },
          { icon: 'clock', label: 'History', route: '/history' },
          { icon: 'user', label: 'Profile', route: '/profile' },
        ].map(({ icon, label, route }) => (
          <TouchableOpacity key={route} style={s.footerItem} onPress={() => router.push(route as any)} activeOpacity={0.7}>
            <Feather name={icon as any} size={22} color="#6B7280" />
            <Text style={s.footerLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const GREEN = '#0F3D1E';
const GREEN_MID = '#3F7A4A';
const GOLD = '#F2C200';

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A1F10' },
  scroll: { flex: 1 },

  // Hero
  hero: { width: SW, height: HERO_H, position: 'relative' },
  heroBg: { position: 'absolute', width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,20,12,0.62)',
  },
  headerSafe: { position: 'absolute', top: 0, left: 0, right: 0 },
  headerBar: {
    paddingTop: 12, paddingHorizontal: 20, paddingBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  hamburger: { padding: 8, gap: 10 },
  menuLine: { width: 24, height: 2.5, backgroundColor: '#fff', borderRadius: 2 },
  brandTitle: {
    color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 2.5,
    position: 'absolute', left: 0, right: 0, textAlign: 'center', zIndex: 1,
    pointerEvents: 'none',
  },
  logoBadge: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: GREEN,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: GOLD,
  },
  logoEmoji: { fontSize: 18 },
  heroText: { position: 'absolute', bottom: 30, left: 22, right: 22 },
  heroPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(242,194,0,0.18)', borderWidth: 1, borderColor: 'rgba(242,194,0,0.5)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10,
  },
  heroPillText: { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  heroTitle: {
    color: '#fff', fontSize: 30, fontWeight: '900', lineHeight: 37, marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6,
  },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { backgroundColor: '', width: 20, borderRadius: 3 },

  // Sheet
  sheet: {
    backgroundColor: '#F8FAF8', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -28, paddingHorizontal: 18, paddingTop: 26,
  },

  // Banner
  banner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#FDE68A', borderLeftWidth: 3, borderLeftColor: GOLD,
    marginBottom: 24,
  },
  bannerIcon: { fontSize: 15, marginTop: 1 },
  bannerText: { flex: 1, color: '#6B5200', fontSize: 13, lineHeight: 19, fontWeight: '500' },

  sectionTitle: { color: GREEN, fontSize: 13, fontWeight: '800', letterSpacing: 1.4, marginBottom: 14, textTransform: 'uppercase' },

  // Card list
  grid: { gap: 12, marginBottom: 24 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, flexDirection: 'row', alignItems: 'center',
    overflow: 'hidden', borderWidth: 1, borderColor: '#E8F0E9',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  cardImgWrap: { width: 76, height: 76, position: 'relative' },
  cardImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardImgShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,61,30,0.08)' },
  cardBody: { flex: 1, paddingHorizontal: 14 },
  cardName: { color: '#111827', fontSize: 15, fontWeight: '800', marginBottom: 3 },
  cardSub: { color: GREEN_MID, fontSize: 12, fontWeight: '600' },
  cardArrow: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0FDF4',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },

  // Detail
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginBottom: 18, alignSelf: 'flex-start',
  },
  backText: { color: GREEN, fontSize: 14, fontWeight: '700' },
  strip: { marginHorizontal: -18, paddingHorizontal: 18, marginBottom: 20 },
  stripTile: {
    width: 220, height: 150, marginRight: 10, borderRadius: 14,
    overflow: 'hidden', backgroundColor: '#E8F0E9',
  },
  stripImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  stripZoomHint: {
    position: 'absolute', bottom: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 20,
    padding: 6,
  },

  // Zoom modal
  zoomBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center', justifyContent: 'center',
  },
  zoomContainer: {
    width: SW - 24, aspectRatio: 1,
    borderRadius: 20, overflow: 'hidden',
    backgroundColor: '#111',
    position: 'relative',
  },
  zoomImage: { width: '100%', height: '100%' },
  zoomClose: {
    position: 'absolute', top: 12, right: 12,
  },
  zoomCloseInner: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  detailHeader: { marginBottom: 12 },
  detailName: { color: GREEN, fontSize: 22, fontWeight: '900', letterSpacing: 0.2, marginBottom: 4 },
  detailSub: { color: GREEN_MID, fontSize: 13, fontWeight: '600' },
  detailDesc: { color: '#374151', fontSize: 14, lineHeight: 22, marginBottom: 22 },
  detailSection: { color: GREEN, fontSize: 12, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10, marginTop: 4 },
  table: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E8F0E9', marginBottom: 22 },
  tableRow: { flexDirection: 'row', padding: 12, gap: 8 },
  tableRowAlt: { backgroundColor: '#F6FAF7' },
  tableLabel: { width: 110, color: GREEN, fontSize: 12, fontWeight: '700', lineHeight: 18 },
  tableValue: { flex: 1, color: '#374151', fontSize: 12, lineHeight: 18 },
  benefitList: { gap: 8, marginBottom: 20 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  benefitDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: GREEN_MID, marginTop: 6 },
  benefitText: { flex: 1, color: '#374151', fontSize: 14, lineHeight: 20 },
  cautionBox: {
    flexDirection: 'row', gap: 10, backgroundColor: '#FFF7ED', padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: '#FED7AA', borderLeftWidth: 3, borderLeftColor: '#F97316',
    marginBottom: 24, alignItems: 'flex-start',
  },
  cautionIcon: { fontSize: 14, marginTop: 1 },
  cautionText: { flex: 1, color: '#7C3200', fontSize: 13, lineHeight: 19, fontWeight: '500' },

  // PPE
  ppeHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 2,
    borderWidth: 1, borderColor: '#E8F0E9',
  },
  ppeLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ppeIcon: { fontSize: 18 },
  ppeTitle: { color: GREEN, fontSize: 15, fontWeight: '800' },
  ppeBody: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#E8F0E9', borderTopWidth: 0,
    borderTopLeftRadius: 0, borderTopRightRadius: 0, marginBottom: 16, gap: 10,
  },
  ppeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  ppeDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: GREEN_MID, marginTop: 6 },
  ppeItem: { flex: 1, color: '#374151', fontSize: 13.5, lineHeight: 20 },
  ppeNote: {
    marginTop: 6, backgroundColor: '#F0FDF4', padding: 12, borderRadius: 10,
    borderLeftWidth: 3, borderLeftColor: GREEN_MID,
  },
  ppeNoteText: { color: '#1F3D2A', fontSize: 12.5, lineHeight: 19, fontStyle: 'italic' },

  // Disclaimer
  disclaimer: {
    backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14, marginTop: 4,
    borderWidth: 1, borderColor: '#FDE68A', borderLeftWidth: 3, borderLeftColor: GOLD,
  },
  disclaimerText: { color: '#6B5200', fontSize: 12, lineHeight: 18, fontStyle: 'italic' },

  // Menu
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  menuSheet: {
    position: 'absolute', top: 68, left: 16, backgroundColor: '#fff',
    borderRadius: 18, paddingVertical: 8, width: 220,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 12,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14 },
  menuIcon: { marginRight: 12 },
  menuItemText: { color: '#1F3D2A', fontSize: 15, fontWeight: '600' },
  menuDivider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 10 },

  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F0F0F0',
    paddingTop: 10, paddingBottom: 22, paddingHorizontal: 10,
    flexDirection: 'row', justifyContent: 'space-around',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: -3 }, elevation: 6,
  },
  footerItem: { alignItems: 'center', gap: 4 },
  footerLabel: { fontSize: 10.5, color: '#6B7280', fontWeight: '600' },
});