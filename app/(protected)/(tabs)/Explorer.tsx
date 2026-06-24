import { TeacherCard } from "@/components/TeacherCard";
import { ThemeCard } from "@/components/ThemeCard";
import { VideoCard } from "@/components/VideoCard";
import { color } from "@/config/color";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Bookmark } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS = ["Tout", "Vidéos", "Parcours"];

const THEMES = [
  {
    id: "t1",
    title: "Cordes",
    count: "42 vidéos",
    emoji: "🎸",
    colors: ["#0E2B45", "#1A5F9A"] as [string, string],
  },
  {
    id: "t2",
    title: "Cuivres",
    count: "28 vidéos",
    emoji: "🎷",
    colors: ["#7B4F2E", "#C4813D"] as [string, string],
  },
  {
    id: "t3",
    title: "Claviers",
    count: "35 vidéos",
    emoji: "🎹",
    colors: ["#1a3d5c", "#2E7D6B"] as [string, string],
  },
  {
    id: "t4",
    title: "Percussions",
    count: "19 vidéos",
    emoji: "🥁",
    colors: ["#3D1A5E", "#7A3BAA"] as [string, string],
  },
];

const VIDEOS = [
  {
    id: "v1",
    title: "Fingerstyle acoustique",
    subtitle: "Guitare · 32 min",
    tag: "Expert",
    tagType: "expert" as const,
    bookmarked: true,
    image:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "v2",
    title: "Gammes pentatoniques",
    subtitle: "Piano · 20 min",
    tag: "Intermédiaire",
    tagType: "intermediate" as const,
    bookmarked: false,
    image:
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "v3",
    title: "Intro au jazz manouche",
    subtitle: "Guitare · 45 min",
    tag: "Débutant",
    tagType: "beginner" as const,
    bookmarked: false,
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=200&q=60",
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<"Tout" | "Videos" | "Parcours">(
    "Tout",
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[color.bgGradientTop, color.bgGradientBottom]}
        style={styles.gradient}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>Découvrir</Text>
            <Text style={styles.headerTitle}>
              Explorer <Text style={styles.headerTitleAccent}>la musique</Text>
            </Text>
          </View>
          <View style={styles.filterBtn}>
            <Feather name="sliders" size={18} color="#fff" />
          </View>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <Feather name="search" size={17} color={color.softGray} />
            <TextInput
              placeholder="Instrument, style, artiste…"
              placeholderTextColor={color.softGray}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* ── Tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabsRow]}
        >
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Scrollable content ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Thèmes */}
          <View style={[styles.sectionHeader, { paddingHorizontal: 24 }]}>
            <Text style={styles.sectionTitle}>Thèmes musicaux</Text>
            <Text style={styles.sectionLink}>Voir tout</Text>
          </View>
          <View style={[styles.themeGrid, { paddingHorizontal: 24 }]}>
            {THEMES.map((t) => (
              <ThemeCard key={t.id} item={t} />
            ))}
          </View>

          {/* Tendances */}
          <View
            style={[
              styles.sectionHeader,
              { marginTop: 24, paddingHorizontal: 24 },
            ]}
          >
            <Text style={styles.sectionTitle}>Tendances</Text>
            <Text style={styles.sectionLink}>Voir tout</Text>
          </View>
          {VIDEOS.map((v) => (
            <VideoCard key={v.id} item={v} />
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_GAP = 12;
const THEME_SIZE = (width - 48 - CARD_GAP) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgGradientTop },
  gradient: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 12,
    marginBottom: 18,
  },
  headerEyebrow: { fontSize: 12, color: color.softGray, marginBottom: 2 },
  headerTitle: {
    fontSize: 27,
    fontWeight: "700",
    color: color.deepBlue,
    letterSpacing: -0.5,
  },
  headerTitleAccent: { fontStyle: "italic", color: "#1A5F9A" },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: color.deepBlue,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  // Search
  searchWrap: { paddingHorizontal: 24, marginBottom: 18 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(14,43,69,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: color.deepBlue },

  // Tabs
  tabsRow: {
    paddingHorizontal: 24,
    gap: 0,
    marginBottom: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(14,43,69,0.07)",
  },
  tab: {
    paddingBottom: 10,
    marginRight: 22,
    borderBottomWidth: 2.5,
    borderBottomColor: "transparent",
    marginBottom: -1.5,
  },
  tabActive: { borderBottomColor: color.yellowDark },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: color.softGray,
    padding: 5,
  },
  tabTextActive: { color: color.deepBlue },

  // Scroll
  scrollContent: { paddingTop: 22 },

  // Section
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: color.deepBlue,
    letterSpacing: -0.3,
  },
  sectionLink: { fontSize: 12, color: color.softGray, fontWeight: "500" },

  // Theme grid
  themeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
  },
  themeCard: {
    width: THEME_SIZE,
    height: 110,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 12,
  },
  themeEmoji: {
    fontSize: 28,
    position: "absolute",
    top: 12,
    right: 12,
    opacity: 0.7,
  },
  themeContent: {},
  themeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.2,
  },

  // Teachers

  // Video rows
  videoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(14,43,69,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  videoThumb: {
    width: 68,
    height: 68,
    borderRadius: 12,
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: color.paleBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  videoThumbImg: { width: "100%", height: "100%", resizeMode: "cover" },
  playBtn: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(14,43,69,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 8,
    borderStyle: "solid",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#fff",
    marginLeft: 2,
  },
  videoInfo: { flex: 1, minWidth: 0 },
  videoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: color.deepBlue,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  videoSub: { fontSize: 12, color: color.softGray, marginBottom: 6 },
  videoTagRow: { flexDirection: "row" },
  tag: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
  tagExpert: { backgroundColor: "rgba(255,214,107,0.3)" },
  tagIntermediate: { backgroundColor: "rgba(29,158,117,0.12)" },
  tagBeginner: { backgroundColor: "rgba(181,212,244,0.4)" },
  tagText: { fontSize: 11, fontWeight: "600" },
  tagTextExpert: { color: "#8A6200" },
  tagTextIntermediate: { color: "#0F6E56" },
  tagTextBeginner: { color: "#185FA5" },
  bookmarkBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: color.paleBlue,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  // Bottom nav
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderTopWidth: 1,
    borderTopColor: "rgba(14,43,69,0.07)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 16,
    paddingHorizontal: 10,
  },
  navItem: { alignItems: "center", gap: 3 },
  navLabel: { fontSize: 10, color: color.softGray, fontWeight: "500" },
  navLabelActive: { color: color.deepBlue, fontWeight: "600" },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.yellowDark,
  },
  teachersRow: { gap: 12, paddingRight: 4, paddingHorizontal: 24 },
});
