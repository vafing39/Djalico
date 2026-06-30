import { color } from "@/config/color";
import ParcoursCard, { type ParcoursCardItem } from "@/components/ParcoursCard";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Screen from "@/components/Screen";
import { useParcours } from "@/hooks/useParcours";
import type { Parcours, TagType } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEVEL_LABEL: Record<TagType, string> = {
  beginner:     "Débutant",
  intermediate: "Intermédiaire",
  expert:       "Expert",
};

function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}min`;
  return `${h}h${m > 0 ? ` ${m}min` : ""}`;
}

function toCardItem(p: Parcours): ParcoursCardItem {
  return {
    id:       p.id,
    title:    p.title,
    subtitle: p.category?.title ?? "",
    level:    LEVEL_LABEL[p.tag_type],
    duration: formatDuration(p.total_duration_seconds),
    image:    p.cover_image_url,
  };
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ count }: { count: number }) {
  return (
    <View>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Feather name="arrow-left" size={18} color="#fff" />
      </Pressable>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>Bibliothèque</Text>
          <Text style={styles.headerTitle}>Tous les parcours</Text>
        </View>
        <View style={styles.headerCount}>
          <Text style={styles.headerCountText}>{count}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AllParcoursScreen() {
  const { parcours } = useParcours();

  const items = useMemo(() => parcours.map(toCardItem), [parcours]);

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={<Header count={items.length} />}
        renderItem={({ item, index }) => (
          <ParcoursCard item={item} index={index} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListFooterComponent={<View style={{ height: 110 }} />}
      />
    </Screen>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  columnWrapper: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
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
  backBtn: {
    height: 38,
    width: 38,
    borderRadius: 12,
    backgroundColor: "rgba(3,3,3,0.53)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});
