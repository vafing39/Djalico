import { color } from "@/config/color";
import { VideoCard } from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import Screen from "@/components/Screen";
import { useVideos } from "@/hooks/useVideos";
import { useSaved } from "@/hooks/useSaved";
import { useLanguage } from "@/hooks/useLanguage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

function Header({ count }: { count: number }) {
  const { t } = useLanguage();
  return (
    <View style={styles.headerWrap}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Feather name="arrow-left" size={18} color="#fff" />
      </Pressable>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>{t("categorie.library")}</Text>
          <Text style={styles.headerTitle}>{t("categorie.allVideos")}</Text>
        </View>
        <View style={styles.headerCount}>
          <Text style={styles.headerCountText}>{count}</Text>
        </View>
      </View>
    </View>
  );
}

export default function AllVideos() {
  const { videos, videoProgress, saveProgress } = useVideos();
  const { isVideoSaved, toggleVideoSave } = useSaved();
  const { t } = useLanguage();

  const [selectedVideo, setSelectedVideo] = useState<{ id: string; url: string; title: string } | null>(null);

  const publishedVideos = useMemo(() => videos.filter((v) => v.published), [videos]);

  const videoItems = useMemo(
    () =>
      publishedVideos.map((v) => {
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
          bookmarked: isVideoSaved(v.id),
          url: v.url,
        };
      }),
    [publishedVideos, videoProgress, isVideoSaved, t],
  );

  const handleProgress = useCallback(
    (currentTime: number, pct: number) => {
      if (!selectedVideo) return;
      saveProgress(selectedVideo.id, pct, currentTime);
    },
    [selectedVideo, saveProgress],
  );

  return (
    <Screen>
      <FlatList
        data={videoItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Header count={videoItems.length} />}
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap:      { paddingHorizontal: 20 },
  backBtn:         { height: 38, width: 38, borderRadius: 12, backgroundColor: "rgba(3,3,3,0.53)", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  header:          { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 8, paddingBottom: 24 },
  headerEyebrow:   { fontSize: 12, fontWeight: "600", color: color.softGray, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 4 },
  headerTitle:     { fontSize: 28, fontWeight: "800", color: color.deepBlue, letterSpacing: -0.5 },
  headerCount:     { width: 42, height: 42, borderRadius: 14, backgroundColor: color.yellow, justifyContent: "center", alignItems: "center", shadowColor: color.yellowDark, shadowOpacity: 0.5, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  headerCountText: { fontSize: 16, fontWeight: "800", color: color.deepBlue },
});
