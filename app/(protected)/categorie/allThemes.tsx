import { ThemeCard } from "@/components/ThemeCard";
import { color } from "@/config/color";
import { useCategories } from "@/hooks/useCategories";
import { useVideos } from "@/hooks/useVideos";
import { useLanguage } from "@/hooks/useLanguage";
import type { Category } from "@/types";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  Guitare: ["#0E2B45", "#1A5F9A"],
  Piano: ["#2E4A1E", "#5A8A3C"],
  Saxophone: ["#1a3d5c", "#2A7FA5"],
  Trompette: ["#7B4F2E", "#C4813D"],
  Basse: ["#0D3348", "#1E6B8A"],
  Balafon: ["#5C2E00", "#A0522D"],
};
const DEFAULT_GRADIENT: [string, string] = ["#0E2B45", "#1A5F9A"];

function toCategoryTheme(
  cat: Category,
  videoCount: number,
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  return {
    id: cat.id,
    title: cat.title,
    emoji: cat.emoji,
    count: t(
      videoCount === 1 ? "categorie.themes.videoCount" : "categorie.themes.videoCountPlural",
      { n: videoCount },
    ),
    colors: CATEGORY_GRADIENTS[cat.title] ?? DEFAULT_GRADIENT,
  };
}

function Header({ count }: { count: number }) {
  const { t } = useLanguage();
  return (
    <View style={styles.headerWrap}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Feather name="arrow-left" size={18} color="#fff" />
      </Pressable>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>{t("categorie.themes.eyebrow")}</Text>
          <Text style={styles.headerTitle}>{t("categorie.themes.title")}</Text>
        </View>
        <View style={styles.headerCount}>
          <Text style={styles.headerCountText}>{count}</Text>
        </View>
      </View>
    </View>
  );
}

export default function AllThemesScreen() {
  const { categories } = useCategories();
  const { videos } = useVideos();
  const { t } = useLanguage();

  const publishedVideos = useMemo(() => videos.filter((v) => v.published), [videos]);

  const themes = useMemo(
    () =>
      categories.map((cat) =>
        toCategoryTheme(
          cat,
          publishedVideos.filter((v) => v.category?.id === cat.id).length,
          t,
        ),
      ),
    [categories, publishedVideos, t],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={themes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={<Header count={themes.length} />}
        renderItem={({ item }) => (
          <ThemeCard
            item={item}
            onPress={() => router.navigate("/categorie/allParcoursScreen")}
          />
        )}
        ListFooterComponent={<View style={{ height: 110 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgGradientTop,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  headerWrap: {
    paddingBottom: 24,
    paddingTop: 8,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
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
});
