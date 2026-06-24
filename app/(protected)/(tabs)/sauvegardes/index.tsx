import { router } from "expo-router";
import React, { useRef, useEffect } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { color } from "@/config/color";
import { SAVED_PARCOURS } from "@/data/mockData";

const TOP_VIDEOS = SAVED_PARCOURS;

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2; // 2 columns with 16px gap + 20px sides

// ─── VideoCard ─────────────────────────────────────────────────────────────────
function VideoCard({
  item,
  index,
}: {
  item: (typeof TOP_VIDEOS)[0];
  index: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 420,
        delay: index * 90,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 420,
        delay: index * 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn = () => {
    router.navigate({ pathname: "/sauvegardes/[id]" });
  };

  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const isExpert = item.level === "Expert";

  return (
    <Animated.View
      style={[
        styles.cardWrap,
        {
          opacity: fadeAnim,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.card}
      >
        {/* Thumbnail */}
        <View style={styles.thumbWrap}>
          <Image source={{ uri: item.image }} style={styles.thumbImage} />

          {/* Gradient overlay bottom */}
          <View style={styles.thumbGradient} />

          {/* Level badge */}
          <View
            style={[
              styles.badge,
              isExpert ? styles.badgeExpert : styles.badgePro,
            ]}
          >
            <View
              style={[
                styles.badgeDot,
                isExpert ? styles.dotExpert : styles.dotPro,
              ]}
            />
            <Text style={styles.badgeText}>{item.level}</Text>
          </View>

          {/* Heart */}
          <View style={styles.heartButton}>
            <Text style={styles.heartIcon}>♥</Text>
          </View>

          {/* Duration chip on thumb */}
          <View style={styles.durationChip}>
            <Text style={styles.durationText}>⏱ {item.duration}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Text numberOfLines={2} style={styles.cardTitle}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={styles.cardSubtitle}>
            {item.subtitle}
          </Text>

          {/* Progress bar (decorative) */}
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${30 + index * 14}%` }]}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerEyebrow}>Ma bibliothèque</Text>
        <Text style={styles.headerTitle}>Mes favoris</Text>
      </View>
      <View style={styles.headerCount}>
        <Text style={styles.headerCountText}>{TOP_VIDEOS.length}</Text>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function Favoris() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={TOP_VIDEOS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={<Header />}
        renderItem={({ item, index }) => (
          <VideoCard item={item} index={index} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListFooterComponent={<View style={{ height: 110 }} />}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgGradientTop,
  },

  // ── Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerEyebrow: {
    fontSize: 12,
    fontWeight: "600",
    color: color.softGray,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: color.deepBlue,
    letterSpacing: -0.5,
  },
  headerCount: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: color.yellow,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: color.yellowDark,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  headerCountText: {
    fontSize: 16,
    fontWeight: "800",
    color: color.deepBlue,
  },

  // ── List
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    paddingHorizontal: 20,
    gap: 12,
  },

  // ── Card
  cardWrap: {
    flex: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: color.navy,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },

  // ── Thumb
  thumbWrap: {
    height: 140,
    position: "relative",
    backgroundColor: "#dde9f0",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  thumbGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: "rgba(14,43,69,0.35)",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  badgeExpert: {
    backgroundColor: color.yellow,
  },
  badgePro: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotExpert: {
    backgroundColor: color.deepBlue,
  },
  dotPro: {
    backgroundColor: color.softGray,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: color.deepBlue,
    letterSpacing: 0.3,
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  heartIcon: {
    fontSize: 13,
    color: "#E05C6F",
  },
  durationChip: {
    position: "absolute",
    bottom: 8,
    right: 10,
  },
  durationText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.2,
  },

  // ── Footer
  cardFooter: {
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 12,
    gap: 3,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: color.deepBlue,
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: color.softGray,
    fontWeight: "500",
  },
  progressTrack: {
    height: 3,
    backgroundColor: "#EAF1F7",
    borderRadius: 4,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: color.yellow,
    borderRadius: 4,
  },
});
