
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const COLORS = {
  bg: "#F7FAFF",
  card: "#FFFFFF",
  textPrimary: "#1F2937",
  textMuted: "#6B7280",
  blue: "#1E88E5", // vif
  blueLight: "#E9F2FF",
  yellow: "#FFC107",
  yellowLight: "#FFF3CD",
  green: "#4CAF50",
  red: "#F44336",
  border: "#E5E7EB",
  shadow: "rgba(0,0,0,0.06)",
  yellowDark: "#F6C04F",
  navy: "#103149",
};

const kpi = [
  {
    id: "active",
    label: "Utilisateurs",
    value: 56,
    icon: "people-outline",
    bg: COLORS.blueLight,
  },
  {
    id: "new",
    label: "Videos",
    value: 12,
    icon: "person-add-outline",
    bg: COLORS.yellowLight,
  },
  {
    id: "pending",
    label: "A valider",
    value: 4,
    icon: "hourglass-outline",
    bg: "#FFE7E7",
  },
];

const satisfaction = [
  { label: "Guitare", value: 47, color: COLORS.yellowDark },
  { label: "Ballafon", value: 40, color: COLORS.blueLight },
  { label: "Piano", value: 16, color: COLORS.navy },
  { label: "Saxophone", value: 3, color: "#FFEB3B" },
];

const activity = [
  {
    id: "1",
    icon: "person-outline",
    color: COLORS.blue,
    text: "Marie Dupont a rejoint la plateforme",
    time: "il y a 2h",
  },
  {
    id: "2",
    icon: "videocam-outline",
    color: "#FF7043",
    text: 'Nouvelle vidéo ajoutée : "Formation UX Design"',
    time: "il y a 4h",
  },
  {
    id: "3",
    icon: "checkmark-circle-outline",
    color: COLORS.green,
    text: "8 utilisateurs ont complété leur profil aujourd'hui",
    time: "il y a 6h",
  },
  {
    id: "4",
    icon: "alert-circle-outline",
    color: COLORS.red,
    text: "2 comptes signalés pour vérification",
    time: "il y a 8h",
  },
];

// ------------------- COMPONENTS -------------------

const data = [
  { value: 47, color: COLORS.yellowDark, text: "Excellent" }, // jaune foncé
  { value: 40, color: "#FFEB3B", text: "Good" },             // jaune vif
  { value: 16, color: COLORS.blueLight, text: "Okay" },      // bleu très clair
  { value: 3, color: COLORS.navy, text: "Poor" },            // bleu foncé / navy
];


const StatCard = ({ item }: { item: any }) => (
  <View style={[styles.card, styles.elevated]}>
    <View style={[styles.iconWrap, {backgroundColor:COLORS.yellowDark}]}>
      <Ionicons name={item.icon as any} size={25} color={COLORS.navy} />
    </View>
    <Text style={styles.cardTitle}>{item.label}</Text>
    <Text style={styles.cardValue}>{item.value}</Text>
  </View>
);

const LegendItem = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <View style={styles.legendRow}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
    <View style={{ flex: 1 }} />
    <Text style={styles.legendPercent}>{value}</Text>
  </View>
);

const ActivityItem: React.FC<{ item: (typeof activity)[number] }> = ({
  item,
}) => (
  <View style={styles.activityRow}>
    <View style={[styles.activityIcon, { backgroundColor: `${item.color}1A` }]}>
      <Ionicons name={item.icon as any} size={18} color={item.color} />
    </View>
    <Text style={styles.activityText}>{item.text}</Text>
    <Text style={styles.activityTime}>{item.time}</Text>
  </View>
);

// ------------------- SCREEN -------------------
const home = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <LinearGradient
          colors={["#EEF6FF", "#FFFFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.header}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.welcome}>
              Bonsoir, Kamal <Text style={{ fontSize: 24 }}>👋</Text>
            </Text>
            <Text style={styles.subtitle}>
              Voici un résumé de ton activité aujourd'hui
            </Text>
            <View style={styles.metaRow}>
              <MaterialIcons name="wb-sunny" size={18} color={COLORS.yellow} />
              <Text style={styles.metaText}>{"today"}</Text>
            </View>
          </View>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1603415526960-f7e0328d13db?q=80&w=200",
            }}
            style={styles.avatar}
          />
        </LinearGradient>

        {/* KPI Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        >
          {kpi.map((it) => (
            <StatCard key={it.id} item={it} />
          ))}
        </ScrollView>

        {/* Satisfaction Card */}
        <View style={[styles.sectionCard, styles.elevated]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/**Ajouter pie chart ici */}
            <PieChart
              donut
              radius={65}
              innerRadius={40}
              data={data}
              showText={false}
              centerLabelComponent={() => {
                return (
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.centerValue}>47%</Text>
                    <Text style={styles.centerText}>Excellent</Text>
                  </View>
                );
              }}
            />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={styles.sectionTitle}>Activity</Text>
              <View style={{ marginTop: 8 }}>
                {satisfaction.map((s) => (
                  <LegendItem
                    key={s.label}
                    label={`${s.label}`}
                    value={s.value}
                    color={s.color}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Activity Feed */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <Text style={styles.feedTitle}>Activité</Text>
          <View style={[styles.feedCard, styles.elevated]}>
            <FlatList
              data={activity}
              keyExtractor={(it) => it.id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => <ActivityItem item={item} />}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.navy,
  },
  subtitle: {
    color: COLORS.textMuted,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  metaText: { color: COLORS.textPrimary, fontWeight: "600" },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.yellow,
  },

  // Cards
  card: {
    width: 128,
    backgroundColor: COLORS.blueLight,
    borderRadius: 18,
    padding: 16,
    marginVertical: 12,
    justifyContent:'center',
    alignItems:'center'
  },
  elevated: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: { color: COLORS.navy, fontWeight: "600" },
  cardValue: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.navy,
    marginVertical: 6,
  },

  primaryBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  primaryBtnText: { color: COLORS.navy, fontWeight: "700" },
  primaryBtnOutline: {
    borderWidth: 1,
    borderColor: COLORS.yellowDark,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
    backgroundColor: "transparent",
  },
  primaryBtnTextOutline: { color: COLORS.blue, fontWeight: "700" },

  // Section Card
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
  trendText: { color: COLORS.green, marginTop: 4, fontWeight: "600" },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendLabel: { color: COLORS.textPrimary },
  legendPercent: { fontWeight: "700", color: COLORS.textPrimary },

  // Donut center text
  donutCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  donutValue: { fontSize: 20, fontWeight: "800", color: COLORS.textPrimary },
  donutLabel: { color: COLORS.textMuted, marginTop: -2 },

  // Activity feed
  feedTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  feedCard: { backgroundColor: COLORS.card, borderRadius: 22, padding: 12 },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  activityIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityText: { flex: 1, color: COLORS.textPrimary },
  activityTime: { color: COLORS.textMuted, marginLeft: 8 },

  separator: { height: 1, backgroundColor: COLORS.border, opacity: 0.6 },
});
