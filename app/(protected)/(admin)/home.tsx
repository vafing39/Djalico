import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useUsers } from "@/hooks/useUsers";
import { useVideos } from "@/hooks/useVideos";
import { useParcours } from "@/hooks/useParcours";
import { useCourses } from "@/hooks/useCourses";
import { useLessons } from "@/hooks/useLessons";

const C = {
  navy: "#103149",
  navyDeep: "#0B2035",
  white: "#FFFFFF",
  textPrimary: "#1F2937",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  card: "#FFFFFF",
  yellow: "#F6C04F",
  green: "#22C55E",
  red: "#F44336",
};

const PIE_COLORS = [
  "#F6C04F",
  "#1E88E5",
  "#22C55E",
  "#F44336",
  "#9333EA",
  "#FF7043",
];

// ─── Types ────────────────────────────────────────────────────────────────────

type KpiItem = {
  id: string;
  label: string;
  value: number;
  icon: string;
  bg: string;
  iconColor: string;
  trend: string;
  trendUp: boolean;
};

type ActivityEvent = {
  id: string;
  icon: string;
  color: string;
  text: string;
  time: string;
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
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (h < 1) return "il y a moins d'1h";
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${d}j`;
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

const StatCard = ({ item }: { item: KpiItem }) => (
  <View style={[styles.card, { backgroundColor: item.bg }]}>
    <View style={styles.cardTop}>
      <View
        style={[styles.iconWrap, { backgroundColor: `${item.iconColor}22` }]}
      >
        <Ionicons name={item.icon as any} size={17} color={item.iconColor} />
      </View>
      <View
        style={[
          styles.trendBadge,
          { backgroundColor: item.trendUp ? "#DCFCE7" : "#FFE7E7" },
        ]}
      >
        <Ionicons
          name={item.trendUp ? "arrow-up" : "arrow-down"}
          size={10}
          color={item.trendUp ? C.green : C.red}
        />
        <Text
          style={[styles.trendText, { color: item.trendUp ? C.green : C.red }]}
        >
          {item.trend}
        </Text>
      </View>
    </View>
    <Text style={styles.cardValue}>{item.value}</Text>
    <Text style={styles.cardLabel}>{item.label}</Text>
  </View>
);

// ─── Legend Item ─────────────────────────────────────────────────────────────

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

// ─── Activity Row ─────────────────────────────────────────────────────────────

const ActivityRow = ({ item }: { item: ActivityEvent }) => (
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
  const { profile } = useAuth();
  const { users } = useUsers();
  const { videos } = useVideos();
  const { parcours } = useParcours();
  const { courses } = useCourses();
  const { lessons } = useLessons();

  const publishedCount = videos.filter((v) => v.published).length;
  const pendingCount = videos.filter((v) => !v.published).length;

  const kpis: KpiItem[] = useMemo(
    () => [
      {
        id: "users",
        label: "Utilisateurs",
        value: users.length,
        icon: "people-outline",
        bg: "#E9F2FF",
        iconColor: "#1E88E5",
        trend: `${users.length}`,
        trendUp: true,
      },
      {
        id: "videos",
        label: "Vidéos",
        value: publishedCount,
        icon: "videocam-outline",
        bg: "#FFF3CD",
        iconColor: "#F59E0B",
        trend: `${publishedCount}`,
        trendUp: true,
      },
      {
        id: "pending",
        label: "À valider",
        value: pendingCount,
        icon: "hourglass-outline",
        bg: "#FFE7E7",
        iconColor: "#F44336",
        trend: `${pendingCount}`,
        trendUp: pendingCount === 0,
      },
      {
        id: "parcours",
        label: "Parcours",
        value: parcours.length,
        icon: "map-outline",
        bg: "#F3E8FF",
        iconColor: "#9333EA",
        trend: `${parcours.length}`,
        trendUp: true,
      },
      {
        id: "courses",
        label: "Cours",
        value: courses.length,
        icon: "book-outline",
        bg: "#DCFCE7",
        iconColor: "#22C55E",
        trend: `${courses.length}`,
        trendUp: true,
      },
      {
        id: "lessons",
        label: "Leçons",
        value: lessons.length,
        icon: "play-circle-outline",
        bg: "#FFF0E6",
        iconColor: "#FF7043",
        trend: `${lessons.length}`,
        trendUp: true,
      },
    ],
    [users.length, publishedCount, pendingCount, parcours.length, courses.length, lessons.length],
  );

  const { pieData, pieLegend } = useMemo(() => {
    const map = new Map<string, { count: number; color: string }>();
    videos.forEach((v, _, arr) => {
      if (!v.category) return;
      const key = v.category.title;
      const idx = Array.from(
        new Set(arr.filter((x) => x.category).map((x) => x.category!.title)),
      ).indexOf(key);
      const color = PIE_COLORS[idx % PIE_COLORS.length];
      map.set(key, { count: (map.get(key)?.count ?? 0) + 1, color });
    });
    const entries = Array.from(map.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);
    const total = entries.reduce((s, [, { count }]) => s + count, 0);
    const pieData = entries.map(([text, { count, color }]) => ({
      value: total > 0 ? Math.round((count / total) * 100) : 0,
      color,
      text,
    }));
    const pieLegend = entries.map(([label, { count, color }]) => ({
      label,
      value: total > 0 ? Math.round((count / total) * 100) : 0,
      color,
    }));
    return { pieData, pieLegend };
  }, [videos]);

  const topSlice =
    pieData.length > 0
      ? pieData.reduce((a, b) => (a.value > b.value ? a : b))
      : { value: 0, text: "—" };

  const recentActivity: ActivityEvent[] = useMemo(() => {
    const items: ActivityEvent[] = [
      ...users.slice(0, 2).map((u) => ({
        id: `user-${u.id}`,
        icon: "person-outline",
        color: "#1E88E5",
        text: `${u.name} a rejoint la plateforme`,
        time: relativeTime(u.created_at),
      })),
      ...videos.slice(0, 2).map((v) => ({
        id: `video-${v.id}`,
        icon: "videocam-outline",
        color: "#FF7043",
        text: `Nouvelle vidéo : « ${v.title} »`,
        time: relativeTime(v.created_at),
      })),
    ];
    return items;
  }, [users, videos]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── Header ── */}
        <LinearGradient
          colors={[C.navyDeep, C.navy]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View style={styles.datePill}>
              <Ionicons name="calendar-outline" size={12} color={C.yellow} />
              <Text style={styles.datePillText}>{getFormattedDate()}</Text>
            </View>
            {profile?.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {profile?.name?.[0]?.toUpperCase() ?? "?"}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.name}>{profile?.name ?? "—"} 👋</Text>
          <Text style={styles.subtitle}>
            Voici un résumé de ton activité aujourd'hui
          </Text>

          <View style={styles.summaryStrip}>
            {kpis.map((k, i) => (
              <View
                key={k.id}
                style={[
                  styles.summaryItem,
                  i < kpis.length - 1 && styles.summaryItemBorder,
                ]}
              >
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
          {kpis.map((it) => (
            <StatCard key={it.id} item={it} />
          ))}
        </ScrollView>

        {/* ── Popularity ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popularité par catégorie</Text>
        </View>
        <View style={[styles.sectionCard, styles.elevated]}>
          {pieData.length > 0 ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <PieChart
                donut
                radius={65}
                innerRadius={42}
                data={pieData}
                showText={false}
                centerLabelComponent={() => (
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.centerValue}>{topSlice.value}%</Text>
                    <Text style={styles.centerLabel}>{topSlice.text}</Text>
                  </View>
                )}
              />
              <View style={{ marginLeft: 20, flex: 1 }}>
                {pieLegend.map((s) => (
                  <LegendItem
                    key={s.label}
                    label={s.label}
                    value={`${s.value}%`}
                    color={s.color}
                  />
                ))}
              </View>
            </View>
          ) : (
            <Text
              style={[
                styles.cardLabel,
                { textAlign: "center", paddingVertical: 24 },
              ]}
            >
              Aucune vidéo publiée
            </Text>
          )}
        </View>

        {/* ── Activity ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
        </View>
        <View style={[styles.sectionCard, styles.elevated]}>
          {recentActivity.map((item, i) => (
            <View key={item.id}>
              <ActivityRow item={item} />
              {i < recentActivity.length - 1 && (
                <View style={styles.separator} />
              )}
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

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 0,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  datePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  datePillText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: C.yellow,
  },
  avatarPlaceholder: {
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { fontSize: 18, fontWeight: "800", color: C.yellow },
  greeting: { fontSize: 16, color: "rgba(255,255,255,0.6)", fontWeight: "500" },
  name: {
    fontSize: 30,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    marginTop: 6,
    marginBottom: 24,
  },

  summaryStrip: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  summaryItem: { flex: 1, alignItems: "center", paddingVertical: 14 },
  summaryItemBorder: {
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.1)",
  },
  summaryValue: { fontSize: 22, fontWeight: "800", color: C.white },
  summaryLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 },

  sectionHeader: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: -0.3,
  },

  card: { width: 116, borderRadius: 18, padding: 12, paddingBottom: 14 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 8,
  },
  trendText: { fontSize: 10, fontWeight: "700" },
  cardValue: {
    fontSize: 24,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: -0.5,
  },
  cardLabel: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: "500",
    marginTop: 2,
  },

  sectionCard: {
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 18,
    marginHorizontal: 20,
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },

  centerValue: { fontSize: 18, fontWeight: "800", color: C.navy },
  centerLabel: { fontSize: 10, color: C.textMuted, marginTop: 1 },
  legendRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { fontSize: 13, color: C.textPrimary },
  legendPercent: { fontSize: 13, fontWeight: "700", color: C.textPrimary },

  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  activityText: { flex: 1, fontSize: 13, color: C.textPrimary, lineHeight: 18 },
  activityTime: { fontSize: 11, color: C.textMuted, marginLeft: 8 },
  separator: { height: 1, backgroundColor: C.border, opacity: 0.6 },
});
