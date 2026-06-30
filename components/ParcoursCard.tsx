import { color } from "@/config/color";
import { router } from "expo-router";
import React, { useState } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";

export type ParcoursCardItem = {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  duration: string;
  image: string | null;
};

export default function ParcoursCard({
  item,
  index,
}: {
  item: ParcoursCardItem;
  index: number;
}) {
  const [scale]      = useState(() => new Animated.Value(1));
  const [fadeAnim]   = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(24));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,   { toValue: 1, duration: 420, delay: index * 90, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 420, delay: index * 90, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, index, translateY]);

  const isExpert = item.level === "Expert";

  return (
    <Animated.View style={[styles.cardWrap, { opacity: fadeAnim, transform: [{ translateY }, { scale }] }]}>
      <Pressable
        onPress={() => router.navigate({ pathname: "/categorie/parcoursScreen", params: { parcoursId: item.id } })}
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        style={styles.card}
      >
        <View style={styles.thumbWrap}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.thumbImage} />
          ) : (
            <View style={[styles.thumbImage, { backgroundColor: color.deepBlue }]} />
          )}
          <View style={styles.thumbGradient} />

          <View style={[styles.badge, isExpert ? styles.badgeExpert : styles.badgePro]}>
            <View style={[styles.badgeDot, isExpert ? styles.dotExpert : styles.dotPro]} />
            <Text style={styles.badgeText}>{item.level}</Text>
          </View>

          <View style={styles.durationChip}>
            <Text style={styles.durationText}>⏱ {item.duration}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>
          <Text numberOfLines={1} style={styles.cardSubtitle}>{item.subtitle}</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrap: { flex: 1 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, overflow: "hidden", shadowColor: color.navy, shadowOpacity: 0.1, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, elevation: 4 },

  thumbWrap:     { height: 140, position: "relative", backgroundColor: "#dde9f0" },
  thumbImage:    { width: "100%", height: "100%", resizeMode: "cover" },
  thumbGradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: 56, backgroundColor: "rgba(14,43,69,0.35)" },

  badge:       { position: "absolute", top: 10, left: 10, flexDirection: "row", alignItems: "center", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20, gap: 5 },
  badgeExpert: { backgroundColor: color.yellow },
  badgePro:    { backgroundColor: "rgba(255,255,255,0.9)" },
  badgeDot:    { width: 6, height: 6, borderRadius: 3 },
  dotExpert:   { backgroundColor: color.deepBlue },
  dotPro:      { backgroundColor: color.softGray },
  badgeText:   { fontSize: 11, fontWeight: "700", color: color.deepBlue, letterSpacing: 0.3 },

  durationChip: { position: "absolute", bottom: 8, right: 10 },
  durationText: { fontSize: 10, fontWeight: "600", color: "#fff", letterSpacing: 0.2 },

  cardFooter:   { paddingHorizontal: 12, paddingTop: 11, paddingBottom: 12, gap: 3 },
  cardTitle:    { fontSize: 13, fontWeight: "800", color: color.deepBlue, lineHeight: 18, letterSpacing: -0.2 },
  cardSubtitle: { fontSize: 11, color: color.softGray, fontWeight: "500" },

  progressTrack: { height: 3, backgroundColor: "#EAF1F7", borderRadius: 4, marginTop: 8, overflow: "hidden" },
  progressFill:  { height: "100%", width: "0%", backgroundColor: color.yellow, borderRadius: 4 },
});
