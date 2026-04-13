import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  LayoutAnimation,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SCREEN = Dimensions.get('window');
const SCREEN_WIDTH = SCREEN.width;
const HERO_HEIGHT = 450;

const HERO_IMAGES = [
  require('../assets/images/design/Symptoms.jpg'),
  require('../assets/images/design/capture-crb.png'),
  require('../assets/images/design/green fungus.jpg'),
  require('../assets/images/design/log traps.jpg'),
  require('../assets/images/design/pheromone traps.jpg'),
];

// ─── ACCORDION COMPONENT ───────────────────────────────────────────────────
type AccordionSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

function AccordionItem({ section }: { section: AccordionSection }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
    setOpen(prev => !prev);
  };

  return (
    <View style={accStyles.wrapper}>
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.8}
        style={[accStyles.header, open && accStyles.headerOpen]}
      >
        <View style={accStyles.headerLeft}>
          <View style={[accStyles.iconBadge, open && accStyles.iconBadgeOpen]}>
            <Feather name="chevron-right" size={14} color="#FFFFFF" />
          </View>
          <Text style={accStyles.headerTitle}>{section.title}</Text>
        </View>
      </TouchableOpacity>
      {open && (
        <View style={accStyles.body}>
          {section.content}
        </View>
      )}
    </View>
  );
}

const accStyles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  headerOpen: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderRadius: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0F3D1E',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '0deg' }],
  },
  iconBadgeOpen: {
    transform: [{ rotate: '90deg' }],
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
    color: '#0F3D1E',
    flex: 1,
  },
  body: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 14,
    gap: 8,
  },
});

// ─── HELPER COMPONENTS ─────────────────────────────────────────────────────
function StepItem({ number, text }: { number: number; text: string }) {
  return (
    <View style={helpStyles.stepRow}>
      <View style={helpStyles.stepNum}>
        <Text style={helpStyles.stepNumText}>{number}</Text>
      </View>
      <Text style={helpStyles.stepText}>{text}</Text>
    </View>
  );
}

function ToolItem({ icon, name, detail }: { icon: string; name: string; detail?: string }) {
  return (
    <View style={helpStyles.toolRow}>
      <Text style={helpStyles.toolIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={helpStyles.toolName}>{name}</Text>
        {detail && <Text style={helpStyles.toolDetail}>{detail}</Text>}
      </View>
    </View>
  );
}

function MaterialItem({ qty, name, note }: { qty: string; name: string; note?: string }) {
  return (
    <View style={helpStyles.matRow}>
      <View style={helpStyles.matQtyBadge}>
        <Text style={helpStyles.matQty}>{qty}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={helpStyles.matName}>{name}</Text>
        {note && <Text style={helpStyles.matNote}>{note}</Text>}
      </View>
    </View>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <View style={helpStyles.tipRow}>
      <Text style={helpStyles.tipBullet}>💡</Text>
      <Text style={helpStyles.tipText}>{text}</Text>
    </View>
  );
}

function WarningItem({ text }: { text: string }) {
  return (
    <View style={helpStyles.warnRow}>
      <Text style={helpStyles.tipBullet}>⚠️</Text>
      <Text style={helpStyles.warnText}>{text}</Text>
    </View>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <View style={helpStyles.secHeader}>
      <View style={helpStyles.secLine} />
      <Text style={helpStyles.secLabel}>{label}</Text>
      <View style={helpStyles.secLine} />
    </View>
  );
}

const helpStyles = StyleSheet.create({
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 6,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0F3D1E',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  stepText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 19 },

  toolRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    marginBottom: 5,
  },
  toolIcon: { fontSize: 18, width: 24, textAlign: 'center', marginTop: 1 },
  toolName: { fontSize: 13, fontWeight: '700', color: '#111827' },
  toolDetail: { fontSize: 12, color: '#6B7280', marginTop: 1 },

  matRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  matQtyBadge: {
    backgroundColor: '#0F3D1E',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
    minWidth: 40,
    alignItems: 'center',
  },
  matQty: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  matName: { fontSize: 13, fontWeight: '700', color: '#111827' },
  matNote: { fontSize: 12, color: '#6B7280', marginTop: 1 },

  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipBullet: { fontSize: 14, flexShrink: 0, marginTop: 1 },
  tipText: { flex: 1, fontSize: 12, color: '#374151', lineHeight: 18 },

  warnRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  warnText: { flex: 1, fontSize: 12, color: '#374151', lineHeight: 18 },

  secHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  secLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  secLabel: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 0.8, textTransform: 'uppercase' },
});

// ─── LOG TRAP ACCORDION DATA ────────────────────────────────────────────────
const logTrapSections: AccordionSection[] = [
  {
    id: 'lt-materials',
    title: 'Materials Required',
    content: (
      <View>
        <SectionHeader label="Main Structure" />
        <MaterialItem qty="4 pcs" name="Coconut logs (1 m each)" note="Fresh or slightly decomposing; ~15–25 cm diameter" />
        <MaterialItem qty="Enough" name="Sawdust" note="Fine coconut or wood sawdust to fill cavity" />
        <MaterialItem qty="Mixed" name="Coco peat" note="Improves moisture retention in the medium" />
        <MaterialItem qty="Mixed" name="Dry animal dung" note="Cattle or carabao dung; partially composted" />
        <MaterialItem qty="Mixed" name="Other decomposed matter" note="Dried leaves, rice hulls, crop residues" />
        <SectionHeader label="Biological Agent" />
        <MaterialItem qty="≥100 g" name="Green Muscardine Fungus (GMF) granules" note="Metarhizium anisopliae — dried, granulated form" />
        <SectionHeader label="Cover & Moisture" />
        <MaterialItem qty="Several" name="Coconut fronds or banana leaves" note="Used to cover top and retain moisture" />
        <MaterialItem qty="As needed" name="Water" note="For initial watering of medium" />
      </View>
    ),
  },
  {
    id: 'lt-tools',
    title: 'Tools & Equipment',
    content: (
      <View>
        <ToolItem icon="🪚" name="Chainsaw or hand saw" detail="For cutting logs to 1-meter lengths" />
        <ToolItem icon="⛏️" name="Crowbar or digging bar" detail="For hollowing out the center cavity of logs" />
        <ToolItem icon="🪣" name="Buckets or mixing trough" detail="For blending sawdust, coco peat, and dung" />
        <ToolItem icon="🥄" name="Spade or trowel" detail="For packing the medium tightly into the cavity" />
        <ToolItem icon="💧" name="Watering can" detail="For moistening the medium after filling" />
        <ToolItem icon="🧤" name="Rubber gloves" detail="For handling GMF granules and decomposed material" />
        <ToolItem icon="😷" name="Face mask (N95)" detail="Dust protection when handling fungal granules" />
        <ToolItem icon="📏" name="Measuring tape" detail="For spacing traps accurately (per-hectare placement)" />
        <ToolItem icon="🪝" name="Rope or twine" detail="Optional — to hold logs together in square formation" />
        <ToolItem icon="🗒️" name="Field notebook & marker" detail="For labeling trap location and installation date" />
      </View>
    ),
  },
  {
    id: 'lt-procedure',
    title: 'Step-by-Step Procedure',
    content: (
      <View>
        <SectionHeader label="Site Preparation" />
        <StepItem number={1} text="Select a shaded, accessible spot within or along the edge of the coconut plantation — preferably near known CRB activity or breeding sites." />
        <StepItem number={2} text="Clear a 1 m × 1 m ground area of weeds and debris. The surface should be level and slightly shaded to help retain moisture." />
        <SectionHeader label="Assembling the Log Trap" />
        <StepItem number={3} text="Cut 4 coconut logs to exactly 1 meter in length using a chainsaw or saw. Each log should be 15–25 cm in diameter." />
        <StepItem number={4} text="Arrange the 4 logs in a square formation (2 × 2), with a hollow cavity in the center. Logs should touch at the sides to enclose the central space." />
        <StepItem number={5} text="Using a crowbar or chisel, hollow out the inner sides of each log slightly to increase the cavity volume and expose more wood surface." />
        <SectionHeader label="Filling the Trap" />
        <StepItem number={6} text="In a bucket or trough, mix together sawdust, coco peat, dry animal dung, and other decomposed organic matter in roughly equal parts." />
        <StepItem number={7} text="Spread a first layer (~5 cm deep) of the mixed medium into the log cavity." />
        <StepItem number={8} text="Evenly distribute 50 g of GMF granules over this first layer." />
        <StepItem number={9} text="Add a second layer of the mixed medium on top, filling the cavity to the brim." />
        <StepItem number={10} text="Distribute the remaining 50 g of GMF granules on this top layer. Total GMF used: at least 100 g per trap." />
        <SectionHeader label="Finishing" />
        <StepItem number={11} text="Water the top surface thoroughly until the medium is moist — not waterlogged. The moisture activates and supports fungal growth." />
        <StepItem number={12} text="Cover the top completely with coconut fronds or banana leaves to retain humidity and mimic a natural breeding site." />
        <StepItem number={13} text="Place a marker or stake with the installation date. Record GPS coordinates or sketch location in your field notebook." />
        <SectionHeader label="Placement" />
        <StepItem number={14} text="Install 4–5 log traps per hectare: position some along the plantation edges and at least one in the center. Space traps ≥20 m apart." />
        <StepItem number={15} text="Ensure traps are reachable for regular maintenance without entering deep into the plantation." />
      </View>
    ),
  },
  {
    id: 'lt-maintenance',
    title: 'Monitoring & Maintenance',
    content: (
      <View>
        <StepItem number={1} text="Inspect traps every 2 months after installation. Look for adult beetles sheltering in the cavity, and larvae in the medium." />
        <StepItem number={2} text="Check for visible green fungal growth (M. anisopliae) — white mycelium appears after ~10 days, turning green after ~3 more days." />
        <StepItem number={3} text="Transfer infected larvae (showing fungal mummification) into a fresh log trap to reinforce the biological inoculum at new sites." />
        <StepItem number={4} text="Re-water the medium if it appears dry. Replenish sawdust-dung mixture if the level has dropped significantly." />
        <StepItem number={5} text="Replace logs that are fully decomposed (typically after 6–12 months) with fresh coconut logs and refill with medium + GMF." />
        <StepItem number={6} text="Record data at each visit: number of adults captured, larval stages observed, fungal coverage estimate (%), and trap condition." />
      </View>
    ),
  },
  {
    id: 'lt-tips',
    title: 'Tips, Notes & Warnings',
    content: (
      <View>
        <TipItem text="Freshly cut coconut logs with exposed sap are more attractive to CRB adults than older, dried-out logs." />
        <TipItem text="Combining GMF with log traps is a highly cost-effective method — beetles that escape trapping get infected and spread the fungus to other beetles in the population." />
        <TipItem text="Position at least one trap upwind of the prevailing breeze — volatile compounds from decomposing wood travel with the wind and attract more beetles." />
        <TipItem text="Planting short-term cover crops (e.g., sweet potato) around trap sites helps maintain soil moisture and shading." />
        <WarningItem text="Do not place log traps immediately adjacent to healthy palms — while unlikely, heavily infested traps near palms could create a bridge for adults to climb." />
        <WarningItem text="Wear gloves and a mask when handling GMF granules. Although non-toxic to humans, fungal spores can irritate airways in sensitive individuals." />
        <WarningItem text="Do not use insecticide-treated mulch or chemically contaminated logs — this will kill the GMF and render the biological control ineffective." />
      </View>
    ),
  },
];

// ─── PHEROMONE TRAP ACCORDION DATA ─────────────────────────────────────────
const pheromoneTrapSections: AccordionSection[] = [
  {
    id: 'pt-materials',
    title: 'Materials Required',
    content: (
      <View>
        <SectionHeader label="Trap Body" />
        <MaterialItem qty="1 pc" name="Trap funnel or bucket trap" note="Commercial CRB bucket trap or locally fabricated funnel trap; dark-colored preferred" />
        <MaterialItem qty="1 pc" name="Holding cage or collection container" note="Attached beneath funnel; beetles fall in and cannot escape" />
        <MaterialItem qty="As needed" name="Wire or rope" note="For suspending the trap at the correct height" />
        <SectionHeader label="Lure & Attractant" />
        <MaterialItem qty="1 pc" name="Pheromone lure sachet" note="Ethyl 4-methyloctanoate (synthetic CRB aggregation pheromone)" />
        <MaterialItem qty="1 pc" name="Lure dispenser/holder" note="Rubber septum or small perforated container to hold and release lure slowly" />
        <SectionHeader label="Optional Additions" />
        <MaterialItem qty="Small amt." name="Insecticide strip or DDVP strip" note="Optional — placed inside collection container to kill captured beetles; reduces escape risk" />
        <MaterialItem qty="1 pc" name="Stake or mounting post" note="1.5–2 m wooden or metal post for freestanding deployment" />
      </View>
    ),
  },
  {
    id: 'pt-tools',
    title: 'Tools & Equipment',
    content: (
      <View>
        <ToolItem icon="🔩" name="Drill or awl" detail="For creating mounting holes in trap body or post" />
        <ToolItem icon="✂️" name="Wire cutters & pliers" detail="For securing trap to post or branch" />
        <ToolItem icon="📏" name="Measuring tape" detail="To confirm trap height (1–2 m) and inter-trap spacing (≥50 m)" />
        <ToolItem icon="🧤" name="Rubber gloves" detail="Minimize skin contact with pheromone lure — human scent reduces attractiveness" />
        <ToolItem icon="🗒️" name="Data sheet & waterproof pen" detail="Record trap ID, date, beetle count per check" />
        <ToolItem icon="📍" name="GPS or mapping app" detail="For recording exact trap locations for future reference" />
        <ToolItem icon="🪣" name="Small container with soapy water" detail="Optional — placed in collection cup to drown beetles and reduce odor" />
        <ToolItem icon="🚗" name="Field vehicle or transport" detail="For reaching remote plantation sections during maintenance rounds" />
      </View>
    ),
  },
  {
    id: 'pt-procedure',
    title: 'Step-by-Step Procedure',
    content: (
      <View>
        <SectionHeader label="Trap Assembly" />
        <StepItem number={1} text="Assemble the funnel trap body according to manufacturer instructions, or construct a locally made version using a large dark-colored bucket with a funnel insert." />
        <StepItem number={2} text="Attach the collection container (cage or cup) beneath the funnel opening. Ensure the gap between funnel exit and container is minimal — beetles must fall in, not escape." />
        <StepItem number={3} text="Using rubber gloves, remove the pheromone lure sachet from its sealed packaging. Avoid touching the lure with bare hands." />
        <StepItem number={4} text="Place the lure sachet in the dispenser holder. Position it inside the upper funnel or attach it just above the funnel opening so volatile compounds disperse downward and outward." />
        <SectionHeader label="Trap Deployment" />
        <StepItem number={5} text="Drive a 1.5–2 m stake or post firmly into the ground at the selected site. Choose locations near the plantation edge, along beetle flight paths, or close to known breeding areas." />
        <StepItem number={6} text="Attach the assembled trap to the post at a height of 1–2 meters above ground — this is within the beetle's typical flying and searching height." />
        <StepItem number={7} text="Space traps a minimum of 50 meters apart to avoid competition between lures diluting each trap's catchment. For monitoring purposes, use 1 trap per 2 ha; for mass trapping, use higher densities." />
        <StepItem number={8} text="Record installation date, GPS coordinates, and trap ID number in your data sheet." />
        <SectionHeader label="Ongoing Operation" />
        <StepItem number={9} text="Check traps every 1–2 weeks. Count and record captured beetles, then remove and dispose of them (destroy or feed to poultry)." />
        <StepItem number={10} text="Replace the pheromone lure sachet every 4–8 weeks, or sooner if catch rates drop suddenly — this often signals lure exhaustion." />
        <StepItem number={11} text="Inspect the funnel and collection container for blockage (leaves, water, debris). Clear any obstruction to maintain beetle access." />
        <StepItem number={12} text="Reposition underperforming traps: if a trap consistently catches zero or very few beetles over 3 checks, move it 10–20 m in the direction of known palm damage." />
      </View>
    ),
  },
  {
    id: 'pt-maintenance',
    title: 'Data Recording & Evaluation',
    content: (
      <View>
        <Text style={{ fontSize: 13, color: '#374151', lineHeight: 19, marginBottom: 8 }}>
          Consistent data collection is critical for evaluating trap performance and deciding on management responses:
        </Text>
        <StepItem number={1} text="Record for each trap per visit: date, trap ID, number of males captured, number of females captured, lure condition (fresh / faded / replaced), and any notes on trap damage." />
        <StepItem number={2} text="Compile weekly totals per hectare. A catch of > 5 beetles/trap/week typically indicates an active infestation warranting intensified control." />
        <StepItem number={3} text="Graph catch trends over time — a rising trend signals population increase; a falling trend after intervention confirms control success." />
        <StepItem number={4} text="Share data with neighboring farms or the local agriculture office — coordinated area-wide trapping dramatically outperforms single-farm efforts." />
      </View>
    ),
  },
  {
    id: 'pt-tips',
    title: 'Tips, Notes & Warnings',
    content: (
      <View>
        <TipItem text="Always handle pheromone lures with clean rubber gloves. Human skin oils and foreign odors deposited on the lure can reduce attractiveness by up to 40%." />
        <TipItem text="Traps placed on the windward (upwind) side of the plantation intercept more arriving beetles. Ask local farmers about prevailing wind direction before placement." />
        <TipItem text="Combining pheromone trapping with cultural sanitation (removing breeding sites) achieves much better control than either method alone." />
        <TipItem text="Store unused pheromone lures sealed in a cool, dark place (refrigerator if possible). Heat and light degrade the active compound quickly." />
        <TipItem text="CRB adults are most active from dusk to midnight — this is when traps capture the most beetles. If checking in the morning, expect a fresh catch overnight." />
        <WarningItem text="Do not place traps directly next to healthy palm crowns — the lure will attract beetles toward the tree before they enter the trap funnel." />
        <WarningItem text="If using an insecticide strip inside the collection container, follow label safety instructions and keep out of reach of children and non-target animals." />
        <WarningItem text="Pheromone trapping alone will NOT eradicate a heavy infestation — it is most effective as an early-warning and population-suppression tool combined with other IPM methods." />
      </View>
    ),
  },
];

// ─── MAIN SCREEN ───────────────────────────────────────────────────────────
export default function PreventionControlScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [controlTab, setControlTab] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<{ src: any; label?: string } | null>(null);
  const contentRef = useRef<ScrollView>(null);

  const sanitationImages = [
    require('../assets/images/design/Symptoms(3).jpg'),
    require('../assets/images/design/Symptoms.jpg'),
  ];
  const monitoringImages = [
    require('../assets/images/design/log traps.jpg'),
    require('../assets/images/design/log traps(2).jpg'),
    require('../assets/images/design/pheromone traps.jpg'),
    require('../assets/images/design/pheromone traps(2).jpg'),
    require('../assets/images/design/pheromone traps(3).jpg'),
  ];
  const controlMechanicalImages = [
    require('../assets/images/design/capture-crb.png'),
    require('../assets/images/design/capture-crb(2).jpg'),
    require('../assets/images/design/capture-crb(3).jpg'),
  ];
  const ornvGmfImages = [
    { src: require('../assets/images/design/virus.jpg'), label: 'Oryctes rhinoceros nudivirus (OrNV)' },
    { src: require('../assets/images/design/rions-of-Oryctes-Nudivirus-OrNV-a-Showing-capsids-c-and-viral-membrane-m-b.png'), label: 'Oryctes rhinoceros nudivirus (OrNV)' },
    { src: require('../assets/images/design/green fungus.jpg'), label: 'GMF (Metarhizium anisopliae)' },
    { src: require('../assets/images/design/GMF.jpg'), label: 'GMF (Metarhizium anisopliae)' },
  ];
  const chemicalImages = [
    { src: require('../assets/images/design/Karate-front.webp'), label: 'Lambda-cyhalothrin (Karate)' },
    { src: require('../assets/images/design/imidacloprid.png'), label: 'Imidacloprid' },
    { src: require('../assets/images/design/Emamectin-Benzoate.webp'), label: 'Emamectin Benzoate' },
    { src: require('../assets/images/design/chloros-chlorantraniliprole.webp'), label: 'Chlorantraniliprole' },
  ];

  const handleHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== activeSlide) setActiveSlide(index);
  };

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    contentRef.current?.scrollTo({ x: SCREEN_WIDTH * index, animated: true });
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainScrollContent}
      >
        {/* ── HERO (app bar lives inside here so it scrolls away) ── */}
        <View style={styles.heroContainer}>
          <ScrollView
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onScroll={handleHeroScroll} onMomentumScrollEnd={handleHeroScroll}
            scrollEventThrottle={8} style={StyleSheet.absoluteFillObject}
          >
            {HERO_IMAGES.map((src, i) => (
              <TouchableOpacity key={i} activeOpacity={0.92} onPress={() => setZoomedImage({ src })} style={{ width: SCREEN_WIDTH, height: HERO_HEIGHT }}>
                <Image source={src} style={styles.heroBg} resizeMode="cover" />
                <View style={styles.heroOverlay} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── APP BAR — same pattern as About screen ── */}
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

          {/* Hero text */}
          <View style={styles.heroTextBlock}>
            <View style={styles.heroBadge}>
              <Feather name="shield" size={11} color="#F2C200" />
              <Text style={styles.heroBadgeText}>Integrated Pest Management</Text>
            </View>
            <Text style={styles.heroTitle}>Prevention &amp;{'\n'}Control</Text>
            <Text style={styles.heroSubtitle}>Tap any image to zoom • Scroll for more</Text>
            <View style={styles.dotsRow}>
              {HERO_IMAGES.map((_, i) => (
                <View key={i} style={[styles.dot, i === activeSlide && styles.dotActive]} />
              ))}
            </View>
          </View>
        </View>

        {/* ── WHITE SHEET ── */}
        <View style={styles.sheetCard}>

          {/* PREVENTION */}
          <View style={styles.sectionLabelRow}>
            <View style={styles.sectionLabelAccent} />
            <Text style={styles.sectionLabel}>Prevention</Text>
          </View>
          <Text style={styles.blockTitle}>Cultural Control</Text>
          <View style={styles.imageStrip}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
              {sanitationImages.map((src, idx) => (
                <TouchableOpacity key={idx} onPress={() => setZoomedImage({ src })} activeOpacity={0.85}>
                  <Image source={src} style={styles.stripImage} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.photosCountChip}>
              <Feather name="image" size={11} color="#6B7280" />
              <Text style={styles.photosCountText}>{sanitationImages.length} photos</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow} style={{ marginHorizontal: -22 }}>
            <View style={{ width: 22 }} />
            {['Sanitation & Habitat Management', 'Monitoring & Early Detection', 'Preventing Spread'].map((label, i) => (
              <TouchableOpacity key={i} onPress={() => handleTabPress(i)} activeOpacity={0.8} style={[styles.tabItem, activeTab === i && styles.tabItemActive]}>
                <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{label}</Text>
                {activeTab === i && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            ))}
            <View style={{ width: 22 }} />
          </ScrollView>

          {activeTab === 0 && (
            <View style={styles.infoCard}>
              {[
                { h: 'Remove breeding sites', b: 'Chop up and destroy decaying logs, stumps, dead leaves, and dead standing palms—prime CRB larval habitats.' },
                { h: 'Compost properly', b: "Turn piles regularly so they don't harbor larvae; spread thin layers to make breeding unsuitable." },
                { h: 'Cover stumps', b: "When removal isn't possible, plant vines or ground cover over stumps to deter egg-laying." },
                { h: 'Inspect green waste', b: 'Check mulch or compost for CRB adults or larvae before use to avoid moving infestations.' },
              ].map((item, i) => (
                <TouchableOpacity key={i} style={styles.bulletCard} activeOpacity={0.6}>
                  <View style={styles.bulletCardDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoHeading}>{item.h}</Text>
                    <Text style={styles.infoBody}>{item.b}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {activeTab === 1 && (
            <View style={styles.infoCard}>
              {[
                { h: 'Regular inspections', b: 'Frequently inspect coconut palms and other susceptible trees for damage such as crown holes, chewed fronds, or frayed new leaves.' },
                { h: 'Use light pheromone traps', b: 'Set up pheromone traps to monitor adult beetle activity and capture them, providing early warning of infestations.' },
                { h: 'Community cooperation', b: 'Coordinate with neighbors and the local community on trap placement and sanitation drives for collective prevention.' },
              ].map((item, i) => (
                <TouchableOpacity key={i} style={styles.bulletCard} activeOpacity={0.6}>
                  <View style={styles.bulletCardDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoHeading}>{item.h}</Text>
                    <Text style={styles.infoBody}>{item.b}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {activeTab === 2 && (
            <View style={styles.infoCard}>
              {[
                { h: 'Block movement', b: 'Implement measures like blockading and cutting around infested zones to prevent spread to new areas.' },
                { h: 'Be vigilant with host material', b: 'Do not transport CRB host material such as mulch, compost, or green waste from infested areas to new ones.' },
                { h: 'Sterilize tools', b: 'After treating palms or handling infested material, sterilize tools with diluted bleach to avoid transferring disease.' },
              ].map((item, i) => (
                <TouchableOpacity key={i} style={styles.bulletCard} activeOpacity={0.6}>
                  <View style={styles.bulletCardDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoHeading}>{item.h}</Text>
                    <Text style={styles.infoBody}>{item.b}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* CONTROL */}
          <View style={[styles.sectionLabelRow, { marginTop: 28 }]}>
            <View style={[styles.sectionLabelAccent, { backgroundColor: '#1D4ED8' }]} />
            <Text style={styles.sectionLabel}>Control</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow} style={{ marginHorizontal: -22 }}>
            <View style={{ width: 22 }} />
            {['Mechanical', 'Biological', 'Trapping', 'Chemical'].map((label, i) => (
              <TouchableOpacity key={i} onPress={() => setControlTab(i)} activeOpacity={0.8} style={[styles.tabItem, controlTab === i && styles.tabItemActive]}>
                <Text style={[styles.tabText, controlTab === i && styles.tabTextActive]}>{label}</Text>
                {controlTab === i && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            ))}
            <View style={{ width: 22 }} />
          </ScrollView>

          {/* Mechanical */}
          {controlTab === 0 && (
            <View>
              <View style={styles.imageStrip}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
                  {controlMechanicalImages.map((src, idx) => (
                    <TouchableOpacity key={idx} onPress={() => setZoomedImage({ src })} activeOpacity={0.85}>
                      <Image source={src} style={styles.stripImage} resizeMode="cover" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.photosCountChip}>
                  <Feather name="image" size={11} color="#6B7280" />
                  <Text style={styles.photosCountText}>{controlMechanicalImages.length} photos</Text>
                </View>
              </View>
              <View style={styles.infoCard}>
                {[
                  'Manually remove adults from crowns and breeding sites.',
                  'Deploy pheromone traps (ethyl 4-methyl octanoate) for monitoring and mass-trapping.',
                  'Monitor after treatment to ensure populations stay low.',
                  'Monitor after treatment to ensure populations stay low.',
                ].map((text, i) => (
                  <TouchableOpacity key={i} style={styles.bulletCard} activeOpacity={0.6}>
                    <View style={styles.bulletCardDot} />
                    <Text style={styles.bulletPoint}>{text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Biological */}
          {controlTab === 1 && (
            <View>
              <View style={styles.imageStrip}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
                  {ornvGmfImages.map((item, idx) => (
                    <TouchableOpacity key={idx} onPress={() => setZoomedImage({ src: item.src, label: item.label })} activeOpacity={0.85}>
                      <View>
                        <Image source={item.src} style={styles.stripImage} resizeMode="cover" />
                        <Text style={styles.imageCaption}>{item.label}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.photosCountChip}>
                  <Feather name="image" size={11} color="#6B7280" />
                  <Text style={styles.photosCountText}>{ornvGmfImages.length} photos</Text>
                </View>
              </View>
              <Text style={styles.captionNote}>Online reference images</Text>
              <View style={styles.infoCard}>
                {[
                  'Establishment of coconut log traps inoculated with Green Muscardine Fungus (GMF) granules.',
                  'Apply Metarhizium anisopliae (green fungus) to breeding sites.',
                  'Encourage natural predators such as birds or parasitic insects.',
                  'Use Oryctes rhinoceros nudivirus (OrNV) to infect and kill beetles naturally.',
                ].map((text, i) => (
                  <TouchableOpacity key={i} style={styles.bulletCard} activeOpacity={0.6}>
                    <View style={styles.bulletCardDot} />
                    <Text style={styles.bulletPoint}>{text}</Text>
                  </TouchableOpacity>
                ))}
                <View style={styles.subCard}>
                  <Text style={styles.methodTitle}>Method of Application of FungOryctes</Text>
                  <ImageBackground
                    source={require('../assets/images/design/FungOryctes.jpg')}
                    style={styles.methodImage}
                    imageStyle={{ borderRadius: 12, resizeMode: 'cover' }}
                  />
                  <Text style={styles.methodBody}>
                    An environmentally friendly biological control method employs a highly effective green muscardine fungus to eliminate coconut rhinoceros beetles at all life stages. The fungus penetrates the beetle's body, leading to mummification. White fungal growth becomes visible within approximately 10 days and subsequently turns green after about three days.
                  </Text>
                  {[
                    'An artificial breeding site is made by putting together four, cut, one meter coconut logs. The cavity is filled to the brim with sawdust, coco peat, dry animal dung and other decomposed matter. At least one hundred grams (100g) of dried GMF is placed in two layers within the sawdust mixture.',
                    'The top is watered and covered with coconut fronds or banana leaves to maintain moisture and encourage fungal growth.',
                    'Four to five log traps per hectare are positioned along the edges and center of the plantation or near breeding areas.',
                    'If coconut stumps, saw dusts and fallen logs abound in the area and are starting to decompose, GMF can be applied directly to these breeding places. The media must be moist enough to encourage fungal growth.',
                  ].map((text, i) => (
                    <TouchableOpacity key={i} style={[styles.bulletCard, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]} activeOpacity={0.6}>
                      <View style={[styles.bulletCardDot, { backgroundColor: '#059669' }]} />
                      <Text style={styles.bulletPoint}>{text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Trapping */}
          {controlTab === 2 && (
            <View>
              <View style={styles.imageStrip}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
                  {monitoringImages.map((src, idx) => (
                    <TouchableOpacity key={idx} onPress={() => setZoomedImage({ src })} activeOpacity={0.85}>
                      <Image source={src} style={styles.stripImage} resizeMode="cover" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.photosCountChip}>
                  <Feather name="image" size={11} color="#6B7280" />
                  <Text style={styles.photosCountText}>{monitoringImages.length} photos</Text>
                </View>
              </View>

              <View style={trappingStyles.methodHeader}>
                <View style={trappingStyles.methodHeaderAccent} />
                <View style={{ flex: 1 }}>
                  <Text style={trappingStyles.methodHeaderTitle}>Log Trapping</Text>
                  <Text style={trappingStyles.methodHeaderSub}>Biological control — attract, trap & infect with GMF</Text>
                </View>
              </View>

              {/* Log Trap — Overview (always visible) */}
              <View style={overviewCardStyles.card}>
                <View style={overviewCardStyles.titleRow}>
                  <View style={overviewCardStyles.iconBadge}>
                    <Feather name="info" size={14} color="#FFFFFF" />
                  </View>
                  <Text style={overviewCardStyles.title}>Overview & Purpose</Text>
                </View>
                <Text style={overviewCardStyles.body}>
                  Log traps exploit the CRB's natural preference for decaying organic matter as breeding and feeding sites. When placed strategically, they lure adult beetles away from productive palms and concentrate them for removal or biological control inoculation.
                </Text>
                <View style={overviewCardStyles.statsRow}>
                  {[
                    { label: 'Setup Time', value: '2–3 hrs' },
                    { label: 'Lifespan', value: '6–12 mos' },
                    { label: 'Coverage', value: '4–5 / ha' },
                  ].map((stat, i) => (
                    <View key={i} style={overviewCardStyles.statBox}>
                      <Text style={overviewCardStyles.statValue}>{stat.value}</Text>
                      <Text style={overviewCardStyles.statLabel}>{stat.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {logTrapSections.map(section => (
                <AccordionItem key={section.id} section={section} />
              ))}

              <View style={[trappingStyles.methodHeader, { marginTop: 24 }]}>
                <View style={trappingStyles.methodHeaderAccent} />
                <View style={{ flex: 1 }}>
                  <Text style={trappingStyles.methodHeaderTitle}>Pheromone Trapping</Text>
                  <Text style={trappingStyles.methodHeaderSub}>Chemical lure — monitor populations & mass-trap adults</Text>
                </View>
              </View>

              {/* Pheromone Trap — Overview (always visible) */}
              <View style={overviewCardStyles.card}>
                <View style={overviewCardStyles.titleRow}>
                  <View style={overviewCardStyles.iconBadge}>
                    <Feather name="info" size={14} color="#FFFFFF" />
                  </View>
                  <Text style={overviewCardStyles.title}>Overview & Purpose</Text>
                </View>
                <Text style={overviewCardStyles.body}>
                  Pheromone traps use a synthetic chemical lure — ethyl 4-methyloctanoate — that mimics the aggregation pheromone naturally produced by CRB adults. This chemical signal attracts both male and female beetles to the trap where they are captured and killed or removed.
                </Text>
                <View style={overviewCardStyles.statsRow}>
                  {[
                    { label: 'Lure Lifespan', value: '4–8 wks' },
                    { label: 'Check Every', value: '2 wks' },
                    { label: 'Deploy At', value: '1–2 m ht.' },
                  ].map((stat, i) => (
                    <View key={i} style={overviewCardStyles.statBox}>
                      <Text style={overviewCardStyles.statValue}>{stat.value}</Text>
                      <Text style={overviewCardStyles.statLabel}>{stat.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {pheromoneTrapSections.map(section => (
                <AccordionItem key={section.id} section={section} />
              ))}
            </View>
          )}

          {/* Chemical */}
          {controlTab === 3 && (
            <View>
              <View style={styles.imageStrip}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
                  {chemicalImages.map((item, idx) => (
                    <TouchableOpacity key={idx} onPress={() => setZoomedImage({ src: item.src, label: item.label })} activeOpacity={0.85}>
                      <View>
                        <Image source={item.src} style={styles.stripImage} resizeMode="cover" />
                        <Text style={styles.imageCaption}>{item.label}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.photosCountChip}>
                  <Feather name="image" size={11} color="#6B7280" />
                  <Text style={styles.photosCountText}>{chemicalImages.length} photos</Text>
                </View>
              </View>
              <View style={styles.infoCard}>
                {[
                  'Use insecticides only as directed under expert guidance.',
                  'Adopt IPM: combine cultural, biological, and chemical methods.',
                  'Target breeding sites or the tree crown with recommended chemicals.',
                  'Follow safety and environmental precautions strictly.',
                ].map((text, i) => (
                  <TouchableOpacity key={i} style={styles.bulletCard} activeOpacity={0.6}>
                    <View style={styles.bulletCardDot} />
                    <Text style={styles.bulletPoint}>{text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* MENU MODAL */}
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

      {/* LIGHTBOX */}
      <Modal visible={!!zoomedImage} transparent animationType="fade" onRequestClose={() => setZoomedImage(null)}>
        <View style={styles.lightboxBackdrop}>
          <View style={styles.lightboxContent}>
            <TouchableOpacity style={styles.lightboxCloseBtn} onPress={() => setZoomedImage(null)}>
              <Feather name="x" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            {zoomedImage && (
              <Image source={zoomedImage.src} style={styles.lightboxImage} resizeMode="contain" />
            )}
            {zoomedImage?.label && (
              <Text style={styles.lightboxCaption}>{zoomedImage.label}</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* FOOTER */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.replace('/home')} activeOpacity={0.7}>
          <Feather name="home" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/camera')} activeOpacity={0.7}>
          <Feather name="camera" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/history')} activeOpacity={0.7}>
          <Feather name="clock" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/profile')} activeOpacity={0.7}>
          <Feather name="user" size={24} color="#6B7280" />
          <Text style={styles.footerLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── OVERVIEW CARD STYLES (always-visible, non-collapsible) ────────────────
const overviewCardStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0F3D1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F3D1E',
    letterSpacing: 0.2,
  },
  body: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F3D1E',
  },
  statLabel: {
    fontSize: 10,
    color: '#065F46',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
});

// ─── TRAPPING-SPECIFIC STYLES ───────────────────────────────────────────────
const trappingStyles = StyleSheet.create({
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
    marginTop: 4,
  },
  methodHeaderAccent: {
    width: 4,
    height: '100%',
    minHeight: 40,
    borderRadius: 2,
    backgroundColor: '#0F3D1E',
    flexShrink: 0,
  },
  methodHeaderTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F3D1E',
    marginBottom: 2,
  },
  methodHeaderSub: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});

// ─── STYLES ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#111827' },

  mainScroll: { flex: 1 },
  mainScrollContent: { paddingBottom: 0 },

  /* ── HERO ── */
  heroContainer: { width: SCREEN_WIDTH, height: HERO_HEIGHT, position: 'relative' },
  heroBg: { position: 'absolute', width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5,30,12,0.62)' },

  /* ── APP BAR inside hero (same as About screen) ── */
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
  hamburger: { padding: 8, borderRadius: 12 },
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

  heroTextBlock: { position: 'absolute', bottom: 28, left: 20, right: 20 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: 'rgba(242,194,0,0.18)', borderWidth: 1, borderColor: 'rgba(242,194,0,0.5)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 10 },
  heroBadgeText: { color: '#F2C200', fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  heroTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', lineHeight: 36, marginBottom: 6, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 },
  heroSubtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '500', marginBottom: 14 },
  dotsRow: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { backgroundColor: '#F2C200', width: 22, borderRadius: 4 },

  sheetCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, padding: 22, paddingBottom: 32, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: -6 }, elevation: 8, minHeight: 600 },

  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sectionLabelAccent: { width: 4, height: 24, borderRadius: 2, backgroundColor: '#0F3D1E' },
  sectionLabel: { fontSize: 21, fontWeight: '900', color: '#111827' },
  blockTitle: { fontSize: 14, fontWeight: '800', color: '#0F3D1E', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },

  imageStrip: { position: 'relative', marginBottom: 14 },
  photoRow: { flexDirection: 'row', gap: 12, paddingRight: 6 },
  stripImage: { width: 220, height: 140, borderRadius: 14, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  photosCountChip: { position: 'absolute', right: 10, bottom: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  photosCountText: { color: '#374151', fontSize: 12, fontWeight: '700' },
  imageCaption: { color: '#6B7280', fontSize: 11, marginTop: 4, fontWeight: '500' },
  captionNote: { color: '#9CA3AF', fontSize: 11, fontStyle: 'italic', marginBottom: 10 },

  tabsRow: { flexDirection: 'row', alignItems: 'flex-end', paddingVertical: 4, marginBottom: 14 },
  tabItem: { paddingBottom: 6, paddingHorizontal: 14, flexShrink: 0 },
  tabItemActive: { paddingBottom: 6, paddingHorizontal: 14, flexShrink: 0 },
  tabText: { color: '#9CA3AF', fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#0F3D1E', fontSize: 14, fontWeight: '800' },
  tabUnderline: { height: 3, backgroundColor: '#0F3D1E', borderRadius: 2, marginTop: 4 },

  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 14, gap: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },

  bulletCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  bulletCardDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0F3D1E', flexShrink: 0, marginTop: 6 },
  bulletPoint: { flex: 1, fontSize: 14, color: '#374151', lineHeight: 21, letterSpacing: 0.1 },
  infoHeading: { fontSize: 14, fontWeight: '800', color: '#0F3D1E', marginBottom: 3 },
  infoBody: { fontSize: 13, color: '#4B5563', lineHeight: 19 },

  subCard: { backgroundColor: '#F0FDF4', borderRadius: 14, borderWidth: 1, borderColor: '#BBF7D0', padding: 14, marginTop: 10, gap: 10 },
  methodTitle: { fontSize: 15, fontWeight: '800', color: '#047857', marginBottom: 4 },
  methodImage: { width: '55%', height: 140, borderRadius: 12, overflow: 'hidden', alignSelf: 'center', marginBottom: 10 },
  methodBody: { fontSize: 13, color: '#374151', lineHeight: 20, marginBottom: 4 },

  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  menuBackdropTouch: { ...StyleSheet.absoluteFillObject as any },
  menuSheet: { position: 'absolute', top: 72, left: 16, backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 10, width: 230, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  menuIcon: { marginRight: 12 },
  menuItemText: { color: '#1F3D2A', fontSize: 16, fontWeight: '600' },
  menuDivider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 12 },

  lightboxBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.96)', justifyContent: 'center', alignItems: 'center' },
  lightboxTopBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, zIndex: 10 },
  lightboxBackBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  lightboxBackText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  lightboxCloseBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  lightboxImage: { width: SCREEN_WIDTH, height: SCREEN_WIDTH },

  footerBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 8, paddingHorizontal: 8, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -4 }, elevation: 8 },
  footerItem: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4 },
  footerLabel: { fontSize: 11, color: '#6B7280', fontWeight: '600', marginTop: 2 },
});