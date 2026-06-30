import { FeaturedCard } from "@/components/FeaturedCard";
import { VideoCard } from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import { color } from "@/config/color";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import { useParcours } from "@/hooks/useParcours";
import { useVideos } from "@/hooks/useVideos";
import { useSaved } from "@/hooks/useSaved";
import type { Category, Parcours } from "@/types";
import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOUT: Category = { id: "0", title: "Tout", emoji: "🎵" };

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  Guitare: ["#0E2B45", "#1A5F9A"],
  Piano: ["#2E4A1E", "#5A8A3C"],
  Saxophone: ["#1a3d5c", "#2A7FA5"],
  Trompette: ["#7B4F2E", "#C4813D"],
  Basse: ["#0D3348", "#1E6B8A"],
  Balafon: ["#5C2E00", "#A0522D"],
};
const DEFAULT_GRADIENT: [string, string] = ["#0E2B45", "#1A5F9A"];

const LEVEL_LABEL: Record<string, string> = {
  expert: "Expert",
  intermediate: "Intermédiaire",
  beginner: "Débutant",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m} min`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "hier";
  return `il y a ${days}j`;
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

function toFeaturedItem(p: Parcours) {
  const catTitle = p.category?.title ?? "";
  const [gradientStart, gradientEnd] =
    CATEGORY_GRADIENTS[catTitle] ?? DEFAULT_GRADIENT;
  return {
    id: p.id,
    title: p.title,
    subtitle: formatDuration(p.total_duration_seconds),
    badge: LEVEL_LABEL[p.tag_type] ?? p.tag_type,
    badgeLight: true,
    gradientStart,
    gradientEnd,
    categorie: catTitle,
    categoryId: p.category?.id ?? "",
  };
}

// ─── Main screen ──────────────────────────────────────────────────────────────

type SelectedVideo = {
  id: string;
  url: string;
  title: string;
  imageUrl: string | null;
  categoryTitle: string;
  initialTime?: number;
};

export default function HomeScreen() {
  const { profile } = useAuth();
  const { videoProgress, saveProgress } = useVideos();
  const { isVideoSaved, toggleVideoSave } = useSaved();
  const [scrollY] = useState(() => new Animated.Value(0));
  const [selectedCategoryId, setSelectedCategoryId] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);

  // ── Data from contexts ──
  const { categories: rawCategories } = useCategories();
  const { parcours } = useParcours();
  const { videos } = useVideos();

  const rawParcours = useMemo(
    () => parcours.slice(0, 20),
    [parcours],
  );
  const rawVideos = useMemo(
    () => videos.filter((v) => v.published).slice(0, 15),
    [videos],
  );

  const videoItems = useMemo(
    () => rawVideos.map((v) => {
      const catTitle = v.category?.title ?? "";
      const mins = Math.floor(v.duration_seconds / 60);
      return {
        id: v.id,
        title: v.title,
        subtitle: v.subtitle ? `${v.subtitle} · ${mins} min` : `${catTitle} · ${mins} min`,
        image: v.image_url ?? "",
        tag: LEVEL_LABEL[v.tag_type] ?? v.tag_type,
        tagType: v.tag_type,
        progress: 0,
        bookmarked: isVideoSaved(v.id),
        categorie: catTitle,
        categoryId: v.category?.id ?? "",
        url: v.url,
      };
    }),
    [rawVideos, isVideoSaved],
  );

  // ── Derived data ──
  const allCategories = useMemo(
    () => [TOUT, ...rawCategories],
    [rawCategories],
  );
  const featuredItems = useMemo(
    () => rawParcours.map(toFeaturedItem),
    [rawParcours],
  );
  const q = searchQuery.toLowerCase().trim();

  const filteredData = useMemo(() => {
    const byCat =
      selectedCategoryId === "0"
        ? featuredItems
        : featuredItems.filter(
            (item) => item.categoryId === selectedCategoryId,
          );
    if (!q) return byCat;
    return byCat.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.categorie?.toLowerCase().includes(q),
    );
  }, [selectedCategoryId, featuredItems, q]);

  const filteredVideos = useMemo(() => {
    const byCat =
      selectedCategoryId === "0"
        ? videoItems
        : videoItems.filter((item) => item.categoryId === selectedCategoryId);
    if (!q) return byCat;
    return byCat.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.categorie?.toLowerCase().includes(q),
    );
  }, [selectedCategoryId, videoItems, q]);

  // In-progress videos (started but not finished), sorted by most recently watched
  const inProgressVideos = useMemo(
    () =>
      videoItems
        .filter((v) => {
          const p = videoProgress[v.id];
          return p && p.pct > 0.02 && p.pct < 0.9;
        })
        .sort((a, b) => {
          const aAt = videoProgress[a.id]?.updatedAt ?? "";
          const bAt = videoProgress[b.id]?.updatedAt ?? "";
          return bAt.localeCompare(aAt);
        }),
    [videoProgress, videoItems],
  );

  const hasNoResults =
    q.length > 0 && filteredData.length === 0 && filteredVideos.length === 0;

  // ── Animated header ──
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [210, 70],
    extrapolate: "clamp",
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const openVideo = (
    video: {
      id: string;
      url: string;
      title: string;
      image?: string;
      categorie?: string;
    },
    initialTime?: number,
  ) => {
    setSelectedVideo({
      id: video.id,
      url: video.url,
      title: video.title,
      imageUrl: video.image ?? null,
      categoryTitle: video.categorie ?? "",
      initialTime,
    });
    setModalVisible(true);
  };

  const handleProgress = useCallback(
    (currentTime: number, pct: number) => {
      if (!selectedVideo) return;
      saveProgress(selectedVideo.id, pct, currentTime);
    },
    [selectedVideo, saveProgress],
  );

  const userName = profile?.name ?? "";
  const userLevel = profile?.level;
  const avatarUri = profile?.avatar_url ?? null;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[color.bgGradientTop, color.bgGradientBottom]}
        style={styles.pageGradient}
      >
        {/* ── Animated header ── */}
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <View style={styles.headerTop}>
            <View style={styles.profileRow}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitial}>
                    {userName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.greetingSmall}>Bonjour 👋</Text>
                <Text style={styles.greetingName}>{userName}</Text>
              </View>
            </View>

            {userLevel && (
              <View style={styles.expertBadge}>
                <AntDesign name="star" size={12} color={color.deepBlue} />
                <Text style={styles.expertText}>
                  {LEVEL_LABEL[userLevel] ?? userLevel}
                </Text>
              </View>
            )}
          </View>

          <Animated.Text style={[styles.headline, { opacity: titleOpacity }]}>
            Transforme tes instants en{" "}
            <Text style={styles.headlineAccent}>mélodie</Text>
          </Animated.Text>

          <View style={styles.searchBox}>
            <Feather name="search" size={18} color={color.softGray} />
            <TextInput
              placeholder="Instrument, vidéo, cours…"
              placeholderTextColor={color.softGray}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Feather name="x" size={16} color={color.softGray} />
              </Pressable>
            )}
          </View>
        </Animated.View>

        {/* ── Scrollable content ── */}
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
        >
          {/* Categories */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Instruments</Text>
            <Pressable onPress={() => router.navigate("/Explorer")}>
              <Text style={styles.sectionLink}>Voir tout</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
          >
            {allCategories.map((c) => {
              const active = selectedCategoryId === c.id;
              return (
                <Pressable
                  key={c.id}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setSelectedCategoryId(c.id)}
                >
                  <Text style={styles.pillEmoji}>{c.emoji}</Text>
                  <Text
                    style={[styles.pillText, active && styles.pillTextActive]}
                  >
                    {c.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Reprendre */}
          {inProgressVideos.length > 0 && (
            <>
              <View style={[styles.sectionHeader, { marginTop: 28 }]}>
                <Text style={styles.sectionTitle}>Reprendre</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.resumeRow}
              >
                {inProgressVideos.map((item) => {
                  const prog = videoProgress[item.id]!;
                  return (
                    <Pressable
                      key={item.id}
                      style={({ pressed }) => [
                        styles.resumeCard,
                        { opacity: pressed ? 0.88 : 1 },
                      ]}
                      onPress={() => openVideo(item, prog.time)}
                    >
                      {item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.resumeThumb}
                        />
                      ) : (
                        <View
                          style={[styles.resumeThumb, styles.resumeThumbFallback]}
                        >
                          <Feather
                            name="play-circle"
                            size={28}
                            color={color.softGray}
                          />
                        </View>
                      )}
                      <View style={styles.resumeInfo}>
                        <Text style={styles.resumeCategory}>
                          {item.categorie}
                        </Text>
                        <Text style={styles.resumeTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <View style={styles.progressTrack}>
                          <View
                            style={[
                              styles.progressFill,
                              { width: `${prog.pct * 100}%` as any },
                            ]}
                          />
                        </View>
                        <Text style={styles.resumeMeta}>
                          {Math.round(prog.pct * 100)}% ·{" "}
                          {timeAgo(prog.updatedAt)}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </>
          )}

          {/* Featured parcours */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Text style={styles.sectionTitle}>À la une</Text>
            <TouchableOpacity
              onPress={() =>
                router.navigate({ pathname: "/categorie/allParcoursScreen" })
              }
            >
              <Text style={styles.sectionLink}>Tous les parcours</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredRow}
          >
            {filteredData.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
                onPress={() =>
                  router.navigate({
                    pathname: "/categorie/parcoursScreen",
                    params: { parcoursId: item.id },
                  })
                }
              >
                <FeaturedCard item={item} />
              </Pressable>
            ))}
          </ScrollView>

          {/* Top Videos */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Text style={styles.sectionTitle}>Top Vidéos</Text>
            <Pressable onPress={() => router.navigate("/categorie/allVideos")}>
              <Text style={styles.sectionLink}>Voir tout</Text>
            </Pressable>
          </View>

          {filteredVideos.map((item) => (
            <VideoCard
              key={item.id}
              item={{ ...item, progress: videoProgress[item.id]?.pct ?? 0 }}
              onPress={() => openVideo(item, videoProgress[item.id]?.time)}
              onBookmarkPress={() => toggleVideoSave(item.id)}
            />
          ))}

          {hasNoResults && (
            <View style={styles.emptyState}>
              <Feather name="search" size={36} color={color.softGray} />
              <Text style={styles.emptyTitle}>Aucun résultat</Text>
              <Text style={styles.emptySubtitle}>
                Essayez un autre terme ou changez d&apos;instrument
              </Text>
            </View>
          )}

          <VideoModal
            visible={modalVisible}
            videoUrl={selectedVideo?.url ?? null}
            title={selectedVideo?.title}
            initialTime={selectedVideo?.initialTime}
            onProgress={handleProgress}
            onClose={() => {
              setModalVisible(false);
              setSelectedVideo(null);
            }}
          />

          <View style={{ height: 100 }} />
        </Animated.ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgGradientTop,
  },
  pageGradient: { flex: 1 },
  featuredRow: { paddingHorizontal: 24, gap: 14 },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 12,
    justifyContent: "flex-end",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  profileRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ddd",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
  avatarPlaceholder: {
    backgroundColor: color.deepBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { fontSize: 18, fontWeight: "700", color: "#fff" },
  greetingSmall: { fontSize: 12, color: color.softGray },
  greetingName: {
    fontSize: 15,
    fontWeight: "600",
    color: color.deepBlue,
    letterSpacing: -0.3,
  },
  expertBadge: {
    backgroundColor: color.yellow,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  expertText: {
    color: color.deepBlue,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  headline: {
    fontSize: 26,
    fontWeight: "700",
    color: color.deepBlue,
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  headlineAccent: { fontStyle: "italic", color: "#1A5F9A" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(14,43,69,0.06)",
  },
  searchInput: { flex: 1, fontSize: 14, color: color.deepBlue },

  // Scroll
  scrollContent: { paddingTop: 8, paddingBottom: 20 },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: color.deepBlue,
    letterSpacing: -0.4,
  },
  sectionLink: { fontSize: 13, color: color.softGray, fontWeight: "500" },

  // Pills
  pillsRow: { paddingHorizontal: 24, gap: 8 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "rgba(14,43,69,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
  },
  pillActive: {
    backgroundColor: color.yellowDark,
    borderColor: color.deepBlue,
  },
  pillEmoji: { fontSize: 14 },
  pillText: { fontSize: 13, fontWeight: "500", color: color.deepBlue },
  pillTextActive: { color: color.deepBlue },

  // Reprendre
  resumeRow: { paddingHorizontal: 24, gap: 14 },
  resumeCard: {
    width: 240,
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(14,43,69,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  resumeThumb: { width: "100%", height: 110, resizeMode: "cover" },
  resumeThumbFallback: {
    backgroundColor: color.paleBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  resumeInfo: { padding: 12, gap: 4 },
  resumeCategory: {
    fontSize: 11,
    fontWeight: "600",
    color: color.softGray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  resumeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: color.deepBlue,
    letterSpacing: -0.2,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(14,43,69,0.08)",
    borderRadius: 2,
    marginTop: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: color.yellowDark,
    borderRadius: 2,
  },
  resumeMeta: { fontSize: 11, color: color.softGray, marginTop: 4 },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingTop: 48,
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
});
