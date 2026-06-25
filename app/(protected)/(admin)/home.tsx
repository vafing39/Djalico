import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ADMIN_KPI, ADMIN_PIE_DATA, ADMIN_SATISFACTION, ADMIN_ACTIVITY } from "@/data/mockData";

const ADMIN_NAME = "Kamal";

const C = {
  navy:         "#103149",
  navyDeep:     "#0B2035",
  white:        "#FFFFFF",
  textPrimary:  "#1F2937",
  textMuted:    "#6B7280",
  border:       "#E5E7EB",
  card:         "#FFFFFF",
  yellow:       "#F6C04F",
  green:        "#22C55E",
  red:          "#F44336",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

const StatCard = ({ item }: { item: (typeof ADMIN_KPI)[number] }) => (
  <View style={[styles.card, { backgroundColor: item.bg }]}>
    <View style={styles.cardTop}>
      <View style={[styles.iconWrap, { backgroundColor: `${item.iconColor}22` }]}>
        <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
      </View>
      <View style={[styles.trendBadge, { backgroundColor: item.trendUp ? "#DCFCE7" : "#FFE7E7" }]}>
        <Ionicons
          name={item.trendUp ? "arrow-up" : "arrow-down"}
          size={10}
          color={item.trendUp ? C.green : C.red}
        />
        <Text style={[styles.trendText, { color: item.trendUp ? C.green : C.red }]}>
          {item.trend}
        </Text>
      </View>
    </View>
    <Text style={styles.cardValue}>{item.value}</Text>
    <Text style={styles.cardLabel}>{item.label}</Text>
  </View>
);

// ─── Legend Item ─────────────────────────────────────────────────────────────

const LegendItem = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <View style={styles.legendRow}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
    <View style={{ flex: 1 }} />
    <Text style={styles.legendPercent}>{value}</Text>
  </View>
);

// ─── Activity Item ────────────────────────────────────────────────────────────

const ActivityItem = ({ item }: { item: (typeof ADMIN_ACTIVITY)[number] }) => (
  <View style={styles.activityRow}>
    <View style={[styles.activityIcon, { backgroundColor: `${item.color}1A` }]}>
      <Ionicons name={item.icon as any} size={18} color={item.color} />
    </View>
    <Text style={styles.activityText}>{item.text}</Text>
    <Text style={styles.activityTime}>{item.time}</Text>
  </View>
);

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function Home() {
  const topSlice = ADMIN_PIE_DATA.reduce((a, b) => (a.value > b.value ? a : b));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Header ── */}
        <LinearGradient
          colors={[C.navyDeep, C.navy]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          {/* top row */}
          <View style={styles.headerTop}>
            <View style={styles.datePill}>
              <Ionicons name="calendar-outline" size={12} color={C.yellow} />
              <Text style={styles.datePillText}>{getFormattedDate()}</Text>
            </View>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1603415526960-f7e0328d13db?q=80&w=200" }}
              style={styles.avatar}
            />
          </View>

          {/* greeting */}
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.name}>{ADMIN_NAME} 👋</Text>
          <Text style={styles.subtitle}>Voici un résumé de ton activité aujourd'hui</Text>

          {/* summary strip */}
          <View style={styles.summaryStrip}>
            {ADMIN_KPI.map((k, i) => (
              <View key={k.id} style={[styles.summaryItem, i < ADMIN_KPI.length - 1 && styles.summaryItemBorder]}>
                <Text style={styles.summaryValue}>{k.value}</Text>
                <Text style={styles.summaryLabel}>{k.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ── KPI Cards ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        >
          {ADMIN_KPI.map((it) => <StatCard key={it.id} item={it} />)}
        </ScrollView>

        {/* ── Popularity ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popularité par instrument</Text>
        </View>
        <View style={[styles.sectionCard, styles.elevated]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <PieChart
              donut
              radius={65}
              innerRadius={42}
              data={ADMIN_PIE_DATA}
              showText={false}
              centerLabelComponent={() => (
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.centerValue}>{topSlice.value}%</Text>
                  <Text style={styles.centerLabel}>{topSlice.text}</Text>
                </View>
              )}
            />
            <View style={{ marginLeft: 20, flex: 1 }}>
              {ADMIN_SATISFACTION.map((s) => (
                <LegendItem key={s.label} label={s.label} value={`${s.value}%`} color={s.color} />
              ))}
            </View>
          </View>
        </View>

        {/* ── Activity ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
        </View>
        <View style={[styles.sectionCard, styles.elevated]}>
          {ADMIN_ACTIVITY.map((item, i) => (
            <View key={item.id}>
              <ActivityItem item={item} />
              {i < ADMIN_ACTIVITY.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFF" },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 0, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: "hidden" },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  datePill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.1)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  datePillText: { fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: "500" },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: C.yellow },
  greeting: { fontSize: 16, color: "rgba(255,255,255,0.6)", fontWeight: "500" },
  name: { fontSize: 30, fontWeight: "800", color: C.white, letterSpacing: -0.5, marginTop: 2 },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6, marginBottom: 24 },

  summaryStrip: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 16, marginBottom: 20, overflow: "hidden" },
  summaryItem: { flex: 1, alignItems: "center", paddingVertical: 14 },
  summaryItemBorder: { borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.1)" },
  summaryValue: { fontSize: 22, fontWeight: "800", color: C.white },
  summaryLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 },

  // Section
  sectionHeader: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: C.textPrimary, letterSpacing: -0.3 },

  // KPI card
  card: { width: 148, borderRadius: 20, padding: 16, paddingBottom: 18 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  trendBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 10 },
  trendText: { fontSize: 11, fontWeight: "700" },
  cardValue: { fontSize: 32, fontWeight: "800", color: C.textPrimary, letterSpacing: -1 },
  cardLabel: { fontSize: 12, color: C.textMuted, fontWeight: "500", marginTop: 2 },

  // Shared card
  sectionCard: { backgroundColor: C.card, borderRadius: 22, padding: 18, marginHorizontal: 20 },
  elevated: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },

  // Pie legend
  centerValue: { fontSize: 18, fontWeight: "800", color: C.navy },
  centerLabel: { fontSize: 10, color: C.textMuted, marginTop: 1 },
  legendRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { fontSize: 13, color: C.textPrimary },
  legendPercent: { fontSize: 13, fontWeight: "700", color: C.textPrimary },

  // Activity
  activityRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  activityIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12, flexShrink: 0 },
  activityText: { flex: 1, fontSize: 13, color: C.textPrimary, lineHeight: 18 },
  activityTime: { fontSize: 11, color: C.textMuted, marginLeft: 8 },
  separator: { height: 1, backgroundColor: C.border, opacity: 0.6 },
});
