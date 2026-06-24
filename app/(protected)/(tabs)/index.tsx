import { FeaturedCard } from "@/components/FeaturedCard";
import { VideoCard } from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import { color } from "@/config/color";
import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
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

import { CATEGORIES, CURRENT_USER, FEATURED_PARCOURS, HOME_VIDEOS, MY_COURSES } from "@/data/mockData";

const LEVEL_LABEL: Record<string, string> = {
  expert: "Expert",
  intermediate: "Intermédiaire",
  beginner: "Débutant",
};

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [instrument, setInstrument] = useState<any>("0");
  const [searchQuery, setSearchQuery] = useState("");
  const categorie = CATEGORIES[instrument];

  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openVideo = (url: string, title: string) => {
    setSelectedVideo({ url, title });
    setModalVisible(true);
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [210, 110],
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const q = searchQuery.toLowerCase().trim();

  const filteredData = useMemo(() => {
    const byInstrument =
      categorie?.title === "Tout"
        ? FEATURED_PARCOURS
        : FEATURED_PARCOURS.filter((item) => item.categorie === categorie?.title);
    if (!q) return byInstrument;
    return byInstrument.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.categorie?.toLowerCase().includes(q) ||
        item.instructor?.toLowerCase().includes(q)
    );
  }, [categorie?.title, q]);

  const filteredVideos = useMemo(() => {
    const byInstrument =
      categorie?.title === "Tout"
        ? HOME_VIDEOS
        : HOME_VIDEOS.filter((item) => item.categorie === categorie?.title);
    if (!q) return byInstrument;
    return byInstrument.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.categorie?.toLowerCase().includes(q)
    );
  }, [categorie?.title, q]);

  const inProgressCourses = useMemo(
    () => MY_COURSES.filter((c) => c.status === "en_cours"),
    []
  );

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
              <Image
                source={{ uri: CURRENT_USER.avatar }}
                style={styles.avatar}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.greetingSmall}>Bonjour 👋</Text>
                <Text style={styles.greetingName}>{CURRENT_USER.name}</Text>
              </View>
            </View>

            <View style={styles.expertBadge}>
              <AntDesign name="star" size={12} color={color.deepBlue} />
              <Text style={styles.expertText}>{LEVEL_LABEL[CURRENT_USER.level]}</Text>
            </View>
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
            {CATEGORIES.map((c) => {
              const active = instrument === c.id;
              return (
                <Pressable
                  key={c.id}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setInstrument(c.id)}
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
          {inProgressCourses.length > 0 && (
            <>
              <View style={[styles.sectionHeader, { marginTop: 28 }]}>
                <Text style={styles.sectionTitle}>Reprendre</Text>
                <Pressable onPress={() => router.navigate("/mesCours")}>
                  <Text style={styles.sectionLink}>Mes cours</Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.resumeRow}
              >
                {inProgressCourses.map((course) => {
                  const progress = course.completedLessons / course.totalLessons;
                  return (
                    <Pressable
                      key={course.id}
                      style={styles.resumeCard}
                      onPress={() => router.navigate("/mesCours")}
                    >
                      <Image source={{ uri: course.image }} style={styles.resumeThumb} />
                      <View style={styles.resumeInfo}>
                        <Text style={styles.resumeCategory}>{course.category}</Text>
                        <Text style={styles.resumeTitle} numberOfLines={1}>
                          {course.title}
                        </Text>
                        <View style={styles.progressTrack}>
                          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                        </View>
                        <Text style={styles.resumeMeta}>
                          {course.completedLessons}/{course.totalLessons} leçons
                          {course.lastWatched ? ` · ${course.lastWatched}` : ""}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </>
          )}

          {/* Featured */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Text style={styles.sectionTitle}>À la une</Text>
            <TouchableOpacity
              onPress={() =>
                router.navigate({
                  pathname: "/categorie/allParcoursScreen",
                })
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
                onPress={() =>
                  router.navigate({
                    pathname: "/categorie/parcoursScreen",
                  })
                }
              >
                <FeaturedCard key={item.id} item={item} />
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
            <TouchableOpacity
              key={item.id}
              onPress={() => openVideo(item.url, item.title)}
            >
              <VideoCard item={item} />
            </TouchableOpacity>
          ))}

          <VideoModal
            visible={modalVisible}
            videoUrl={selectedVideo?.url ?? null}
            title={selectedVideo?.title}
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
  pageGradient: {
    flex: 1,
  },
  featuredRow: {
    paddingHorizontal: 24,
    gap: 14,
  },
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
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ddd",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
  greetingSmall: {
    fontSize: 12,
    color: color.softGray,
  },
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
  headlineAccent: {
    fontStyle: "italic",
    color: "#1A5F9A",
  },
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
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: color.deepBlue,
  },

  // Scroll
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },

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
  sectionLink: {
    fontSize: 13,
    color: color.softGray,
    fontWeight: "500",
  },

  // Pills
  pillsRow: {
    paddingHorizontal: 24,
    gap: 8,
  },
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
    backgroundColor: color.deepBlue,
    borderColor: color.deepBlue,
  },
  pillEmoji: {
    fontSize: 14,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "500",
    color: color.deepBlue,
  },
  pillTextActive: {
    color: "#fff",
  },

  // Resume / reprendre
  resumeRow: {
    paddingHorizontal: 24,
    gap: 14,
  },
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
  resumeThumb: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
  },
  resumeInfo: {
    padding: 12,
    gap: 4,
  },
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
  resumeMeta: {
    fontSize: 11,
    color: color.softGray,
    marginTop: 4,
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
  navItem: {
    alignItems: "center",
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    color: color.softGray,
    fontWeight: "500",
  },
  navLabelActive: {
    color: color.deepBlue,
    fontWeight: "600",
  },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.yellowDark,
  },
});
