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

import { CATEGORIES, FEATURED_PARCOURS, HOME_VIDEOS } from "@/data/mockData";

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [instrument, setInstrument] = useState<any>("0");
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

  const filteredData = useMemo(() => {
    return categorie?.title === "Tout"
      ? FEATURED_PARCOURS
      : FEATURED_PARCOURS.filter((item) => item.categorie === categorie?.title);
  }, [categorie?.title]);

  const filteredVideos = useMemo(() => {
    return categorie?.title === "Tout"
      ? HOME_VIDEOS
      : HOME_VIDEOS.filter((item) => item.categorie === categorie?.title);
  }, [categorie?.title]);

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
                source={{
                  uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60",
                }}
                style={styles.avatar}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.greetingSmall}>Bonjour 👋</Text>
                <Text style={styles.greetingName}>Magdalena</Text>
              </View>
            </View>

            <View style={styles.expertBadge}>
              <AntDesign name="star" size={12} color={color.deepBlue} />
              <Text style={styles.expertText}>Expert</Text>
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
            />
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
            <Text style={styles.sectionLink}>Voir tout</Text>
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
