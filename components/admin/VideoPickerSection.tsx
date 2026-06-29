import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { color } from "@/config/adminTheme";
import type { Video, LessonDraft } from "@/types";

type Props = {
  videos: Video[];
  lessonDrafts: LessonDraft[];
  videoSearch: string;
  onSearchChange: (v: string) => void;
  onToggleVideo: (video: Video) => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
};

export default function VideoPickerSection({
  videos,
  lessonDrafts,
  videoSearch,
  onSearchChange,
  onToggleVideo,
  onMoveUp,
  onMoveDown,
}: Props) {
  const filtered = videos.filter(
    (v) =>
      videoSearch.trim() === "" ||
      v.title.toLowerCase().includes(videoSearch.trim().toLowerCase()),
  );

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Vidéos</Text>
        {lessonDrafts.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{lessonDrafts.length}</Text>
          </View>
        )}
      </View>

      {videos.length > 0 && (
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={15} color={color.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une vidéo…"
            placeholderTextColor={color.textMuted}
            value={videoSearch}
            onChangeText={onSearchChange}
            clearButtonMode="while-editing"
          />
        </View>
      )}

      {videos.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="film-outline" size={32} color={color.textMuted} />
          <Text style={styles.emptyText}>Aucune vidéo disponible</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filtered.map((video) => {
            const draftIdx = lessonDrafts.findIndex((d) => d.video_id === video.id);
            const isSelected = draftIdx !== -1;
            return (
              <Pressable
                key={video.id}
                style={[styles.row, isSelected && styles.rowSelected]}
                onPress={() => onToggleVideo(video)}
              >
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>

                <Text
                  style={[styles.videoTitle, isSelected && styles.videoTitleSelected]}
                  numberOfLines={1}
                >
                  {video.title}
                </Text>

                {isSelected && (
                  <View style={styles.orderControls}>
                    <Pressable
                      onPress={() => onMoveUp(draftIdx)}
                      disabled={draftIdx === 0}
                      style={[styles.moveBtn, draftIdx === 0 && styles.moveBtnDisabled]}
                    >
                      <Ionicons name="chevron-up" size={12} color={color.textPrimary} />
                    </Pressable>
                    <View style={styles.indexBadge}>
                      <Text style={styles.indexBadgeText}>{draftIdx + 1}</Text>
                    </View>
                    <Pressable
                      onPress={() => onMoveDown(draftIdx)}
                      disabled={draftIdx === lessonDrafts.length - 1}
                      style={[styles.moveBtn, draftIdx === lessonDrafts.length - 1 && styles.moveBtnDisabled]}
                    >
                      <Ionicons name="chevron-down" size={12} color={color.textPrimary} />
                    </Pressable>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  header: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  title: { fontSize: 15, fontWeight: "800", color: color.textPrimary, letterSpacing: -0.2 },
  countBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: color.deepBlue,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  countText: { fontSize: 11, fontWeight: "700", color: color.white },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: 10,
    gap: 6,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 13, color: color.textPrimary },
  empty: {
    alignItems: "center",
    paddingVertical: 28,
    backgroundColor: color.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: color.border,
    gap: 6,
  },
  emptyText: { fontSize: 14, fontWeight: "700", color: color.textPrimary },
  list: {
    maxHeight: 320,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.card,
  },
  listContent: { gap: 1, padding: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: color.card,
  },
  rowSelected: { backgroundColor: "rgba(14,43,69,0.06)" },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: color.border,
    backgroundColor: color.bg,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxSelected: { backgroundColor: color.deepBlue, borderColor: color.deepBlue },
  videoTitle: { flex: 1, fontSize: 13, color: color.textMuted },
  videoTitleSelected: { color: color.textPrimary, fontWeight: "600" },
  orderControls: { flexDirection: "row", alignItems: "center", gap: 4, flexShrink: 0 },
  moveBtn: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: color.bg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: color.border,
  },
  moveBtnDisabled: { opacity: 0.25 },
  indexBadge: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: color.deepBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  indexBadgeText: { fontSize: 12, fontWeight: "700", color: color.white },
});
