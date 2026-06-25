import { ThemeCard } from "@/components/ThemeCard";
import { VideoCard } from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import { color } from "@/config/color";
import { THEMES, EXPLORER_PARCOURS, EXPLORER_VIDEOS } from "@/data/mockData";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS = ["Tout", "Vidéos", "Parcours"] as const;
type Tab = (typeof TABS)[number];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("Tout");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterLevel, setFilterLevel] = useState<"beginner" | "intermediate" | "expert" | null>(null);

  const q = searchQuery.toLowerCase().trim();

  const filteredThemes = useMemo(() => {
    if (!q) return THEMES;
    return THEMES.filter((t) => t.title.toLowerCase().includes(q));
  }, [q]);

  const filteredParcours = useMemo(() => {
    let results = EXPLORER_PARCOURS;
    if (q) results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.tag?.toLowerCase().includes(q)
    );
    if (filterLevel) results = results.filter((p) => p.tagType === filterLevel);
    return results;
  }, [q, filterLevel]);

  const filteredVideos = useMemo(() => {
    let results = EXPLORER_VIDEOS;
    if (q) results = results.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.subtitle?.toLowerCase().includes(q) ||
        v.tag?.toLowerCase().includes(q)
    );
    if (filterLevel) results = results.filter((v) => v.tagType === filterLevel);
    return results;
  }, [q, filterLevel]);

  const hasNoResults =
    q.length > 0 &&
    filteredThemes.length === 0 &&
    filteredParcours.length === 0 &&
    filteredVideos.length === 0;

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
          <Pressable style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
            <Feather name="sliders" size={18} color="#fff" />
            {filterLevel !== null && <View style={styles.filterBadge} />}
          </Pressable>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <Feather name="search" size={17} color={color.softGray} />
            <TextInput
              placeholder="Instrument, style, artiste…"
              placeholderTextColor={color.softGray}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Feather name="x" size={15} color={color.softGray} />
              </Pressable>
            )}
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
          {hasNoResults ? (
            <View style={styles.emptyState}>
              <Feather name="search" size={36} color={color.softGray} />
              <Text style={styles.emptyTitle}>Aucun résultat</Text>
              <Text style={styles.emptySubtitle}>
                Essayez un autre instrument ou style
              </Text>
            </View>
          ) : (
            <>
              {/* Thèmes — masqués en vue Vidéos */}
              {activeTab !== "Vidéos" && filteredThemes.length > 0 && (
                <>
                  <View
                    style={[styles.sectionHeader, { paddingHorizontal: 24 }]}
                  >
                    <Text style={styles.sectionTitle}>Thèmes musicaux</Text>
                    <Pressable
                      onPress={() =>
                        router.navigate("/categorie/allThemes")
                      }
                    >
                      <Text style={styles.sectionLink}>Voir tout</Text>
                    </Pressable>
                  </View>
                  <View style={[styles.themeGrid, { paddingHorizontal: 24 }]}>
                    {filteredThemes.map((t) => (
                      <ThemeCard
                        key={t.id}
                        item={t}
                        onPress={() =>
                          router.navigate("/categorie/allParcoursScreen")
                        }
                      />
                    ))}
                  </View>
                </>
              )}

              {/* Parcours — masqués en vue Vidéos */}
              {activeTab !== "Vidéos" && filteredParcours.length > 0 && (
                <View
                  style={[
                    styles.sectionHeader,
                    { marginTop: 24, paddingHorizontal: 24 },
                  ]}
                >
                  <Text style={styles.sectionTitle}>Parcours populaires</Text>
                  <Pressable
                    onPress={() =>
                      router.navigate("/categorie/allParcoursScreen")
                    }
                  >
                    <Text style={styles.sectionLink}>Voir tout</Text>
                  </Pressable>
                </View>
              )}
              {activeTab !== "Vidéos" &&
                filteredParcours.map((p) => (
                  <VideoCard
                    key={p.id}
                    item={p}
                    onPress={() => router.navigate({ pathname: "/categorie/parcoursScreen", params: { parcoursId: p.id } } as any)}
                  />
                ))}

              {/* Vidéos — masquées en vue Parcours */}
              {activeTab !== "Parcours" && filteredVideos.length > 0 && (
                <View
                  style={[
                    styles.sectionHeader,
                    { marginTop: 24, paddingHorizontal: 24 },
                  ]}
                >
                  <Text style={styles.sectionTitle}>Tendances</Text>
                  <Pressable
                    onPress={() => router.navigate("/categorie/allVideos")}
                  >
                    <Text style={styles.sectionLink}>Voir tout</Text>
                  </Pressable>
                </View>
              )}
              {activeTab !== "Parcours" &&
                filteredVideos.map((v) => (
                  <VideoCard
                    key={v.id}
                    item={v}
                    onPress={() =>
                      setSelectedVideo({ url: v.url, title: v.title })
                    }
                  />
                ))}
            </>
          )}

          <VideoModal
            visible={selectedVideo !== null}
            videoUrl={selectedVideo?.url ?? null}
            title={selectedVideo?.title}
            onClose={() => setSelectedVideo(null)}
          />

          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>

      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setFilterVisible(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Filtrer par niveau</Text>

            {([
              { label: "Tous les niveaux", value: null },
              { label: "Débutant", value: "beginner" },
              { label: "Intermédiaire", value: "intermediate" },
              { label: "Expert", value: "expert" },
            ] as const).map((opt) => (
              <Pressable
                key={String(opt.value)}
                style={[styles.filterOption, filterLevel === opt.value && styles.filterOptionActive]}
                onPress={() => { setFilterLevel(opt.value); setFilterVisible(false); }}
              >
                <Text style={[styles.filterOptionText, filterLevel === opt.value && styles.filterOptionTextActive]}>
                  {opt.label}
                </Text>
                {filterLevel === opt.value && (
                  <Feather name="check" size={16} color={color.deepBlue} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_GAP = 12;

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
  filterBadge: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.yellowDark,
    borderWidth: 1.5,
    borderColor: color.deepBlue,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(14,43,69,0.12)",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: color.deepBlue,
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: color.paleBlue,
  },
  filterOptionActive: {
    backgroundColor: color.yellow,
  },
  filterOptionText: {
    fontSize: 15,
    fontWeight: "500",
    color: color.softGray,
  },
  filterOptionTextActive: {
    color: color.deepBlue,
    fontWeight: "700",
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

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingTop: 64,
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: color.deepBlue,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: color.softGray,
    textAlign: "center",
    lineHeight: 20,
  },

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
});
