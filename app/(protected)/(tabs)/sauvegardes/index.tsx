import { color } from "@/config/color";
import { VideoCard } from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import { useLanguage } from "@/hooks/useLanguage";
import { useVideos } from "@/hooks/useVideos";
import { useSaved } from "@/hooks/useSaved";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ count }: { count: number }) {
  const { t } = useLanguage();
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerEyebrow}>{t("saves.library")}</Text>
        <Text style={styles.headerTitle}>{t("saves.favorites")}</Text>
      </View>
      <View style={styles.headerCount}>
        <Text style={styles.headerCountText}>{count}</Text>
      </View>
    </View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  const { t } = useLanguage();
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Feather name="bookmark" size={36} color={color.softGray} />
      </View>
      <Text style={styles.emptyTitle}>{t("saves.empty")}</Text>
      <Text style={styles.emptyDesc}>{t("saves.emptyDesc")}</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Favoris() {
  const { t } = useLanguage();
  const { videos, videoProgress, saveProgress } = useVideos();
  const { isVideoSaved, toggleVideoSave } = useSaved();

  const [selectedVideo, setSelectedVideo] = useState<{ id: string; url: string; title: string } | null>(null);

  const savedVideos = useMemo(
    () =>
      videos
        .filter((v) => isVideoSaved(v.id))
        .map((v) => {
          const catTitle = v.category?.title ?? "";
          const mins = Math.floor(v.duration_seconds / 60);
          return {
            id: v.id,
            title: v.title,
            subtitle: v.subtitle ? `${v.subtitle} · ${mins} min` : `${catTitle} · ${mins} min`,
            image: v.image_url ?? "",
            tag: t(`common.level.${v.tag_type}`),
            tagType: v.tag_type,
            progress: videoProgress[v.id]?.pct ?? 0,
            bookmarked: true,
            url: v.url,
          };
        }),
    [videos, isVideoSaved, videoProgress, t],
  );

  const handleProgress = useCallback(
    (currentTime: number, pct: number) => {
      if (!selectedVideo) return;
      saveProgress(selectedVideo.id, pct, currentTime);
    },
    [selectedVideo, saveProgress],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={savedVideos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Header count={savedVideos.length} />}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <VideoCard
            item={item}
            onPress={() => setSelectedVideo({ id: item.id, url: item.url, title: item.title })}
            onBookmarkPress={() => toggleVideoSave(item.id)}
          />
        )}
        ListFooterComponent={<View style={{ height: 110 }} />}
      />

      <VideoModal
        visible={selectedVideo !== null}
        videoUrl={selectedVideo?.url ?? null}
        title={selectedVideo?.title}
        initialTime={selectedVideo ? videoProgress[selectedVideo.id]?.time : undefined}
        onProgress={handleProgress}
        onClose={() => setSelectedVideo(null)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: color.bgGradientTop },
  listContent: { paddingBottom: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerEyebrow:   { fontSize: 12, fontWeight: "600", color: color.softGray, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 4 },
  headerTitle:     { fontSize: 28, fontWeight: "800", color: color.deepBlue, letterSpacing: -0.5 },
  headerCount:     { width: 42, height: 42, borderRadius: 14, backgroundColor: color.yellow, justifyContent: "center", alignItems: "center", shadowColor: color.yellowDark, shadowOpacity: 0.5, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  headerCountText: { fontSize: 16, fontWeight: "800", color: color.deepBlue },

  emptyWrap:  { alignItems: "center", paddingTop: 60, paddingHorizontal: 40, gap: 12 },
  emptyIcon:  { width: 72, height: 72, borderRadius: 24, backgroundColor: "#EAF1F7", justifyContent: "center", alignItems: "center", marginBottom: 4 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: color.deepBlue, textAlign: "center" },
  emptyDesc:  { fontSize: 13, color: color.softGray, textAlign: "center", lineHeight: 19 },
});
