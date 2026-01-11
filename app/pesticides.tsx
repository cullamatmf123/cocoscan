import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PesticidesScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState<null | 'karate' | 'imidacloprid' | 'emamectin' | 'chlorantraniliprole'>(null);
  const [ppeOpen, setPpeOpen] = useState(false);
  const handleStartScanning = () => router.push('/camera');
  const handleHistoryPress = () => router.push('/history');
  const handleProfilePress = () => router.push('/profile');

  const pesticideData = {
    karate: {
      images: [
        require('../assets/images/design/Karate-front.webp'),
        require('../assets/images/design/Karate-back.webp'),
        require('../assets/images/design/karate-ingredients.webp'),
      ],
      name: 'Lambda-cyhalothrin (Karate)',
      description: 'Lambda-cyhalothrin (Karate) is a synthetic pyrethroid insecticide widely used in agriculture to control a broad range of insect pests such as beetles, caterpillars, aphids, and borers.',
      briefDescription: [
        '• Type: Synthetic pyrethroid insecticide',
        '• Brand name: Karate (by Syngenta)',
        '• Mode of action: It affects the nervous system of insects by disrupting the normal function of sodium channels in nerve cells, leading to paralysis and death.',
        '• Target pests: Effective against chewing and sucking insects on crops like rice, maize, vegetables, and coconuts.',
        '• Formulation: Usually available as emulsifiable concentrate (EC) or water-dispersible granules (WG).',
      ],
      benefits: [
        '• Fast knockdown and long residual effect',
        '• Low application rates needed',
        '• Compatible with integrated pest management (IPM) when used properly',
        '• Precaution: Toxic to fish, bees, and other non-target organisms — should be applied carefully to minimize environmental impact.',
      ],
    },
    imidacloprid: {
      images: [
        require('../assets/images/design/imidacloprid.png'),
        require('../assets/images/design/Imidacloprid(2).jpg'),
        require('../assets/images/design/Imidacloprid(3).webp'),
      ],
      name: 'Imidacloprid',
      description: 'Imidacloprid is a systemic insecticide belonging to the neonicotinoid chemical class. It is one of the most widely used insecticides for controlling sucking insects such as aphids, whiteflies, leafhoppers, and mealybugs.',
      briefDescription: [
        '• Type: Neonicotinoid systemic insecticide',
        '• Mode of action: Acts on the central nervous system of insects by binding to nicotinic acetylcholine receptors, causing overstimulation, paralysis, and death.',
        '• Systemic property: Absorbed by the plant and distributed through tissues, protecting from within.',
        '• Formulations: SC, WP, or G (check local labels).',
        '• Target pests: Controls many sucking and soil insects, including aphids, termites, and root-feeding pests.',
      ],
      benefits: [
        '• Long-lasting effect',
        '• Effective even at low doses',
        '• Can be applied to soil or foliage',
        '• Precaution: Highly toxic to bees and aquatic organisms; use responsibly within IPM programs.',
      ],
    },
    emamectin: {
      images: [
        require('../assets/images/design/Emamectin-Benzoate.webp'),
        require('../assets/images/design/Emman.jpg'),
        require('../assets/images/design/Emame.webp'),
      ],
      name: 'Emamectin Benzoate',
      description: 'Emamectin Benzoate is a biological insecticide derived from the naturally occurring compound avermectin, produced by the soil microorganism Streptomyces avermitilis. It is commonly used to control caterpillars and other lepidopteran pests on crops.',
      briefDescription: [
        '• Type: Biological (microbial-derived) insecticide',
        '• Chemical class: Avermectin derivative',
        '• Mode of action: Activates chloride channels in insect nerve and muscle cells, leading to paralysis and death.',
        '• Formulations: Commonly available as Emamectin Benzoate 5% SG (soluble granules)',
        '• Target pests: Caterpillars, leaf rollers, fruit borers, and pod borers; widely used on vegetables, fruits, rice, maize, and coconut crops.',
      ],
      benefits: [
        '• Highly effective even at low doses',
        '• Long residual activity',
        '• Compatible with many IPM programs',
        '• Low toxicity to beneficial insects and mammals (when used properly)',
        '• Precaution: Avoid spraying during high bee activity periods; follow safety intervals before harvest.',
      ],
    },
    chlorantraniliprole: {
      images: [
        require('../assets/images/design/chloros-chlorantranili.webp'),
        require('../assets/images/design/chloros-chlorantraniliprole.webp'),
        require('../assets/images/design/prevathon.webp'),
      ],
      name: 'Chlorantraniliprole',
      description: 'Chlorantraniliprole is a modern insecticide belonging to the anthranilic diamide group, widely used for controlling chewing insect pests such as borers, caterpillars, and beetles. It is valued for its high effectiveness and low toxicity to humans and beneficial insects.',
      briefDescription: [
        '• Type: Anthranilic diamide insecticide',
        '• Mode of action: Activates ryanodine receptors in insect muscle cells, causing uncontrolled calcium release, leading to paralysis and death.',
        '• Systemic activity: Translaminar and systemic movement within plant tissues to protect new growth.',
        '• Formulations: Often available as 18.5% SC or 0.4% GR',
        '• Target pests: Caterpillars, borers, leaf folders, and beetles; used on rice, maize, vegetables, sugarcane, and coconut.',
      ],
      benefits: [
        '• Effective at very low doses',
        '• Long-lasting residual control',
        '• Safe for beneficial insects like bees and natural predators',
        '• Minimal risk of resistance when used correctly',
        '• Precaution: Avoid overuse to prevent resistance; follow PHI and label instructions.',
      ],
    },
  };

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
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🌴</Text>
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Lead text */}
        <View style={styles.lead}>
          <Text style={styles.leadText}>
            Pesticide options commonly referenced for coconut rhinoceros beetle (CRB). Always follow local
            regulations and the specific product label.
          </Text>
        </View>

        {/* Conditional rendering based on expanded state */}
        {!expanded ? (
          <>
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Recommended Pesticides</Text>
            
            {/* Pesticide Grid */}
            <View style={styles.pesticideGrid}>
              <TouchableOpacity 
                style={styles.pesticideCard} 
                onPress={() => setExpanded('karate')}
                activeOpacity={0.8}
              >
                <View style={styles.pesticideImageContainer}>
                  <Image source={require('../assets/images/design/Karate-front.webp')} style={styles.pesticideImage} />
                </View>
                <Text style={styles.pesticideName}>Lambda-cyhalothrin{'\n'}(Karate)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.pesticideCard} 
                onPress={() => setExpanded('imidacloprid')}
                activeOpacity={0.8}
              >
                <View style={styles.pesticideImageContainer}>
                  <Image source={require('../assets/images/design/imidacloprid.png')} style={styles.pesticideImage} />
                </View>
                <Text style={styles.pesticideName}>Imidacloprid</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.pesticideCard} 
                onPress={() => setExpanded('emamectin')}
                activeOpacity={0.8}
              >
                <View style={styles.pesticideImageContainer}>
                  <Image source={require('../assets/images/design/Emamectin-Benzoate.webp')} style={styles.pesticideImage} />
                </View>
                <Text style={styles.pesticideName}>Emamectin Benzoate</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.pesticideCard} 
                onPress={() => setExpanded('chlorantraniliprole')}
                activeOpacity={0.8}
              >
                <View style={styles.pesticideImageContainer}>
                  <Image source={require('../assets/images/design/chloros-chlorantraniliprole.webp')} style={styles.pesticideImage} />
                </View>
                <Text style={styles.pesticideName}>Chlorantraniliprole</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setExpanded(null)} activeOpacity={0.8}>
              <Ionicons name="close-circle" size={32} color="#0F3D1E" />
            </TouchableOpacity>

            {/* Detail View */}
            <View style={styles.detailCard}>
              {/* Image Gallery */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
                {pesticideData[expanded].images.map((img, idx) => (
                  <View key={idx} style={styles.detailImageTile}>
                    <Image source={img} style={styles.detailImage} />
                  </View>
                ))}
              </ScrollView>

              {/* Pesticide Information */}
              <View style={styles.detailContent}>
                <Text style={styles.detailMainTitle}>{pesticideData[expanded].name}</Text>
                <Text style={styles.detailDescription}>{pesticideData[expanded].description}</Text>

                <Text style={styles.detailSectionTitle}>Brief Description:</Text>
                {pesticideData[expanded].briefDescription.map((item, idx) => (
                  <Text key={idx} style={styles.detailBullet}>{item}</Text>
                ))}

                <Text style={styles.detailSectionTitle}>Benefits:</Text>
                {pesticideData[expanded].benefits.map((item, idx) => (
                  <Text key={idx} style={styles.detailBullet}>{item}</Text>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Proper PPE Section */}
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

        {/* Disclaimer */}
        <Text style={styles.disclaimerSmall}>
          Disclaimer: This information is general guidance. Always consult local regulations, product labels, and extension services
          for approved products, rates, re-entry and pre-harvest intervals, and safety requirements. Use pesticides responsibly and
          in accordance with applicable laws.
        </Text>
      </ScrollView>

      {/* Footer navigation */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} activeOpacity={0.7} accessibilityLabel="Go to Home">
          <Feather name="home" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Home</Text>
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
  safe: { 
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
  content: { 
    padding: 16, 
    paddingBottom: 110 
  },
  lead: { 
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginBottom: 20,
  },
  leadText: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },
  sectionTitle: { 
    color: '#111827', 
    fontSize: 18, 
    fontWeight: '800', 
    marginBottom: 16,
    marginTop: 8,
  },
  
  /* Pesticide Grid */
  pesticideGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pesticideCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  pesticideImageContainer: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
    overflow: 'hidden',
  },
  pesticideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pesticideName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 18,
  },
  
  /* Close Button */
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    padding: 4,
  },
  
  /* Detail Card */
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    marginBottom: 20,
  },
  imageGallery: {
    marginBottom: 16,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  detailImageTile: {
    width: 260,
    height: 180,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailContent: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailMainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F3D1E',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  detailDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F3D1E',
    marginTop: 16,
    marginBottom: 8,
  },
  detailBullet: {
    fontSize: 13,
    color: '#111827',
    lineHeight: 20,
    marginBottom: 8,
    paddingLeft: 4,
  },
  
  /* PPE Section */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    marginBottom: 16,
  },
  cardTitle: { 
    color: '#0F3D1E', 
    fontSize: 16, 
    fontWeight: '800', 
    marginBottom: 0,
    letterSpacing: 0.3,
  },
  ppeHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 6,
  },
  item: { 
    color: '#111827', 
    fontSize: 14, 
    marginBottom: 10,
    lineHeight: 21,
    marginTop: 12,
  },
  itemNote: { 
    color: '#6B7280', 
    fontSize: 13,
    lineHeight: 20,
    marginTop: 14,
    fontStyle: 'italic',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3F7A4A',
  },
  
  /* Disclaimer */
  disclaimerSmall: { 
    color: '#6B7280', 
    fontSize: 12, 
    marginTop: 8,
    lineHeight: 18,
    fontStyle: 'italic',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
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