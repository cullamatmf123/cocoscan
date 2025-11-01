import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PesticidesScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState<null | 'karate' | 'imidacloprid' | 'emamectin' | 'chlorantraniliprole'>(null);
  const [ppeOpen, setPpeOpen] = useState(false);
  const handleStartScanning = () => router.push('/camera');
  const handleHistoryPress = () => router.push('/history');
  const handleProfilePress = () => router.push('/profile');

  return (
    <SafeAreaView style={styles.safe}>
      {/* App Bar */}
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
        <View style={styles.logoBadge}><Text style={styles.logoEmoji}>🌴</Text></View>
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
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/about-app'); }}>
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); Alert.alert('Settings', 'Settings will be available soon.'); }}>
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.replace('/'); }}>
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lead}>
          Pesticide options commonly referenced for coconut rhinoceros beetle (CRB). Always follow local
          regulations and the specific product label.
        </Text>

        

        <Text style={styles.cardTitle}>Recommended Pesticides</Text>
        <View style={styles.card}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 6, marginHorizontal: -14 }}>
            <View style={{ width: 14 }} />
            <View style={styles.imageTile}>
              <TouchableOpacity onPress={() => setExpanded(expanded === 'karate' ? null : 'karate')} activeOpacity={0.9}>
                <Image source={require('../assets/images/design/Karate-front.webp')} style={styles.image} />
              </TouchableOpacity>
              <Text style={styles.imageCaption}>Lambda-cyhalothrin (Karate)</Text>
            </View>
            <View style={styles.imageTile}>
              <TouchableOpacity onPress={() => setExpanded(expanded === 'imidacloprid' ? null : 'imidacloprid')} activeOpacity={0.9}>
                <Image source={require('../assets/images/design/imidacloprid.png')} style={styles.image} />
              </TouchableOpacity>
              <Text style={styles.imageCaption}>Imidacloprid</Text>
            </View>
            <View style={styles.imageTile}>
              <TouchableOpacity onPress={() => setExpanded(expanded === 'emamectin' ? null : 'emamectin')} activeOpacity={0.9}>
                <Image source={require('../assets/images/design/Emamectin-Benzoate.webp')} style={styles.image} />
              </TouchableOpacity>
              <Text style={styles.imageCaption}>Emamectin Benzoate</Text>
            </View>
            <View style={styles.imageTile}>
              <TouchableOpacity onPress={() => setExpanded(expanded === 'chlorantraniliprole' ? null : 'chlorantraniliprole')} activeOpacity={0.9}>
                <Image source={require('../assets/images/design/chloros-chlorantraniliprole.webp')} style={styles.image} />
              </TouchableOpacity>
              <Text style={styles.imageCaption}>Chlorantraniliprole</Text>
            </View>
            <View style={{ width: 14 }} />
          </ScrollView>
          
        </View>

        {expanded && (
          <View style={styles.detailCard}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -12 }}>
              <View style={{ width: 12 }} />
              {expanded === 'karate' && (
                <>
                  <View style={styles.imageTile}><Image source={require('../assets/images/design/Karate-front.webp')} style={styles.image} /></View>
                  <View style={styles.imageTile}><Image source={require('../assets/images/design/Karate-back.webp')} style={styles.image} /></View>
                  <View style={styles.imageTile}><Image source={require('../assets/images/design/karate-ingredients.webp')} style={styles.image} /></View>
                </>
              )}
              {expanded === 'imidacloprid' && (
                <>
                  <View style={styles.imageTile}><Image source={require('../assets/images/design/imidacloprid.png')} style={styles.image} /></View>
                  <View style={styles.imageTile}><Image source={require('../assets/images/design/Imidacloprid(2).jpg')} style={styles.image} /></View>
                  <View style={styles.imageTile}><Image source={require('../assets/images/design/Imidacloprid(3).webp')} style={styles.image} /></View>
                </>
              )}
              {expanded === 'emamectin' && (
                <>
                  <View style={styles.imageTile}><Image source={require('../assets/images/design/Emamectin-Benzoate.webp')} style={styles.image} /></View>
                  <View style={styles.imageTile}><Image source={require('../assets/images/design/Emman.jpg')} style={styles.image} /></View>
                  <View style={styles.imageTile}><Image source={require('../assets/images/design/Emame.webp')} style={styles.image} /></View>
                </>
              )}
              {expanded === 'chlorantraniliprole' && (
                <>
                  <View style={styles.imageTile}><Image source={require('../assets/images/design/chloros-chlorantranili.webp')} style={styles.image} /></View>
                  <View style={styles.imageTile}><Image source={require('../assets/images/design/chloros-chlorantraniliprole.webp')} style={styles.image} /></View>
                  <View style={styles.imageTile}><Image source={require('../assets/images/design/prevathon.webp')} style={styles.image} /></View>
                </>
              )}
              <View style={{ width: 12 }} />
            </ScrollView>
            <View style={styles.detailBox}>
              {expanded === 'karate' && (
                <>
                  <Text style={styles.detailTitle}>Lambda-cyhalothrin (Karate)</Text>
                  <Text style={styles.detailText}>Lambda-cyhalothrin (Karate) is a synthetic pyrethroid insecticide widely used in agriculture to control a broad range of insect pests such as beetles, caterpillars, aphids, and borers.</Text>
                  <Text style={styles.detailTitle}>Brief Description:</Text>
                  <Text style={styles.detailBullet}>• Type: Synthetic pyrethroid insecticide</Text>
                  <Text style={styles.detailBullet}>• Brand name: Karate (by Syngenta)</Text>
                  <Text style={styles.detailBullet}>• Mode of action: It affects the nervous system of insects by disrupting the normal function of sodium channels in nerve cells, leading to paralysis and death.</Text>
                  <Text style={styles.detailBullet}>• Target pests: Effective against chewing and sucking insects on crops like rice, maize, vegetables, and coconuts.</Text>
                  <Text style={styles.detailBullet}>• Formulation: Usually available as emulsifiable concentrate (EC) or water-dispersible granules (WG).</Text>
                  <Text style={styles.detailTitle}>Benefits:</Text>
                  <Text style={styles.detailBullet}>• Fast knockdown and long residual effect</Text>
                  <Text style={styles.detailBullet}>• Low application rates needed</Text>
                  <Text style={styles.detailBullet}>• Compatible with integrated pest management (IPM) when used properly</Text>
                  <Text style={styles.detailBullet}>• Precaution: Toxic to fish, bees, and other non-target organisms — should be applied carefully to minimize environmental impact.</Text>
                </>
              )}
              {expanded === 'imidacloprid' && (
                <>
                  <Text style={styles.detailTitle}>Imidacloprid</Text>
                  <Text style={styles.detailText}>Imidacloprid is a systemic insecticide belonging to the neonicotinoid chemical class. It is one of the most widely used insecticides for controlling sucking insects such as aphids, whiteflies, leafhoppers, and mealybugs.</Text>
                  <Text style={styles.detailTitle}>Brief Description:</Text>
                  <Text style={styles.detailBullet}>• Type: Neonicotinoid systemic insecticide</Text>
                  <Text style={styles.detailBullet}>• Mode of action: Acts on the central nervous system of insects by binding to nicotinic acetylcholine receptors, causing overstimulation, paralysis, and death.</Text>
                  <Text style={styles.detailBullet}>• Systemic property: Absorbed by the plant and distributed through tissues, protecting from within.</Text>
                  <Text style={styles.detailBullet}>• Formulations: SC, WP, or G (check local labels).</Text>
                  <Text style={styles.detailBullet}>• Target pests: Controls many sucking and soil insects, including aphids, termites, and root-feeding pests.</Text>
                  <Text style={styles.detailTitle}>Advantages:</Text>
                  <Text style={styles.detailBullet}>• Long-lasting effect</Text>
                  <Text style={styles.detailBullet}>• Effective even at low doses</Text>
                  <Text style={styles.detailBullet}>• Can be applied to soil or foliage</Text>
                  <Text style={styles.detailTitle}>Precaution:</Text>
                  <Text style={styles.detailBullet}>• Highly toxic to bees and aquatic organisms; use responsibly within IPM programs.</Text>
                </>
              )}
              {expanded === 'emamectin' && (
                <>
                  <Text style={styles.detailTitle}>Emamectin Benzoate</Text>
                  <Text style={styles.detailText}>Emamectin Benzoate is a biological insecticide derived from the naturally occurring compound avermectin, produced by the soil microorganism Streptomyces avermitilis. It is commonly used to control caterpillars and other lepidopteran pests on crops.</Text>
                  <Text style={styles.detailTitle}>Brief Description:</Text>
                  <Text style={styles.detailBullet}>• Type: Biological (microbial-derived) insecticide</Text>
                  <Text style={styles.detailBullet}>• Chemical class: Avermectin derivative</Text>
                  <Text style={styles.detailBullet}>• Mode of action: Activates chloride channels in insect nerve and muscle cells, leading to paralysis and death.</Text>
                  <Text style={styles.detailBullet}>• Formulations: Commonly available as Emamectin Benzoate 5% SG (soluble granules)</Text>
                  <Text style={styles.detailBullet}>• Target pests: Caterpillars, leaf rollers, fruit borers, and pod borers; widely used on vegetables, fruits, rice, maize, and coconut crops.</Text>
                  <Text style={styles.detailTitle}>Advantages:</Text>
                  <Text style={styles.detailBullet}>• Highly effective even at low doses</Text>
                  <Text style={styles.detailBullet}>• Long residual activity</Text>
                  <Text style={styles.detailBullet}>• Compatible with many IPM programs</Text>
                  <Text style={styles.detailBullet}>• Low toxicity to beneficial insects and mammals (when used properly)</Text>
                  <Text style={styles.detailTitle}>Precaution:</Text>
                  <Text style={styles.detailBullet}>• Avoid spraying during high bee activity periods; follow safety intervals before harvest.</Text>
                </>
              )}
              {expanded === 'chlorantraniliprole' && (
                <>
                  <Text style={styles.detailTitle}>Chlorantraniliprole</Text>
                  <Text style={styles.detailText}>Chlorantraniliprole is a modern insecticide belonging to the anthranilic diamide group, widely used for controlling chewing insect pests such as borers, caterpillars, and beetles. It is valued for its high effectiveness and low toxicity to humans and beneficial insects.</Text>
                  <Text style={styles.detailTitle}>Brief Description:</Text>
                  <Text style={styles.detailBullet}>• Type: Anthranilic diamide insecticide</Text>
                  <Text style={styles.detailBullet}>• Mode of action: Activates ryanodine receptors in insect muscle cells, causing uncontrolled calcium release, leading to paralysis and death.</Text>
                  <Text style={styles.detailBullet}>• Systemic activity: Translaminar and systemic movement within plant tissues to protect new growth.</Text>
                  <Text style={styles.detailBullet}>• Formulations: Often available as 18.5% SC or 0.4% GR</Text>
                  <Text style={styles.detailBullet}>• Target pests: Caterpillars, borers, leaf folders, and beetles; used on rice, maize, vegetables, sugarcane, and coconut.</Text>
                  <Text style={styles.detailTitle}>Advantages:</Text>
                  <Text style={styles.detailBullet}>• Effective at very low doses</Text>
                  <Text style={styles.detailBullet}>• Long-lasting residual control</Text>
                  <Text style={styles.detailBullet}>• Safe for beneficial insects like bees and natural predators</Text>
                  <Text style={styles.detailBullet}>• Minimal risk of resistance when used correctly</Text>
                  <Text style={styles.detailTitle}>Precaution:</Text>
                  <Text style={styles.detailBullet}>• Avoid overuse to prevent resistance; follow PHI and label instructions.</Text>
                </>
              )}
            </View>
          </View>
        )}

        

        

        <View style={styles.card}>
          <TouchableOpacity onPress={() => setPpeOpen((v) => !v)} activeOpacity={0.85} accessibilityLabel="Toggle proper PPE list">
            <View style={styles.ppeHeader}>
              <Text style={styles.cardTitle}>Proper PPE</Text>
              <Feather name={ppeOpen ? 'minus' : 'plus'} size={20} color="#0F3D1E" />
            </View>
          </TouchableOpacity>
          {ppeOpen && (
            <>
              <Text style={styles.item}>• Chemical-resistant gloves (e.g., nitrile)</Text>
              <Text style={styles.item}>• Long-sleeved shirt and long pants</Text>
              <Text style={styles.item}>• Chemical-resistant boots (no open footwear)</Text>
              <Text style={styles.item}>• Eye protection: goggles or face shield</Text>
              <Text style={styles.item}>• Respirator/mask as required by the label (correct cartridge)</Text>
              <Text style={styles.item}>• Hat or hood; chemical apron when mixing/loading</Text>
              <Text style={styles.itemNote}>Safe-use reminders: Mix/apply in well-ventilated areas, avoid eating or drinking, wash hands and shower after work, keep children/pets away, follow re-entry and pre-harvest intervals, and store pesticides securely.</Text>
            </>
          )}
        </View>

        <Text style={styles.disclaimerSmall}>
          Disclaimer: This information is general guidance. Always consult local regulations, product labels, and extension services
          for approved products, rates, re-entry and pre-harvest intervals, and safety requirements. Use pesticides responsibly and
          in accordance with applicable laws.
        </Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  appBar: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  hamburger: {
    padding: 10,
    borderRadius: 8,
  },
  menuLineDark: {
    width: 26,
    height: 3,
    backgroundColor: '#0F3D1E',
    marginVertical: 3,
    borderRadius: 2,
  },
  brandTitle: {
    color: '#0F3D1E',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  profileButton: {
    padding: 6,
  },
  appBarSpacer: {
    width: 40,
    height: 40,
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
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  logoEmoji: { fontSize: 20 },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menuBackdropTouch: {
    ...StyleSheet.absoluteFillObject as any,
  },
  menuSheet: {
    position: 'absolute',
    top: 70,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    width: 240,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  menuItemText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  content: { 
    padding: 20, 
    paddingBottom: 110 
  },
  lead: { 
    color: '#374151', 
    fontSize: 15, 
    lineHeight: 22, 
    marginBottom: 20, 
    fontWeight: '500',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0F3D1E',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 16,
  },
  cardTitle: { 
    color: '#0F3D1E', 
    fontSize: 18, 
    fontWeight: '800', 
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  item: { 
    color: '#111827', 
    fontSize: 15, 
    marginBottom: 8,
    lineHeight: 22,
  },
  itemNote: { 
    color: '#6B7280', 
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    fontStyle: 'italic',
  },
  link: { 
    color: '#2563EB', 
    textDecorationLine: 'underline' 
  },
  imageTile: { 
    width: 200, 
    marginRight: 12 
  },
  image: { 
    width: 200, 
    height: 140, 
    borderRadius: 12, 
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  imageCaption: { 
    fontSize: 13, 
    color: '#374151', 
    marginTop: 8,
    fontWeight: '600',
  },
  ppeHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 4,
  },
  italicNote: { 
    fontStyle: 'italic' 
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 16,
  },
  detailBox: {
    marginTop: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailTitle: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#0F3D1E', 
    marginBottom: 8,
    marginTop: 8,
  },
  detailText: { 
    fontSize: 14, 
    color: '#374151', 
    marginBottom: 10, 
    lineHeight: 21,
  },
  detailBullet: { 
    fontSize: 14, 
    color: '#111827', 
    marginBottom: 6,
    lineHeight: 21,
  },
  disclaimer: { 
    color: '#6B7280', 
    fontSize: 13, 
    marginTop: 12,
    lineHeight: 20,
  },
  disclaimerSmall: { 
    color: '#6B7280', 
    fontSize: 12, 
    marginTop: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    borderTopColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
    paddingBottom: 20,
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
});
