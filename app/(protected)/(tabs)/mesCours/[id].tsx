import { color } from "@/config/color";
import VideoModal from "@/components/VideoModal";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCourses } from "@/hooks/useCourses";
import { useLessons } from "@/hooks/useLessons";
import { useVideos } from "@/hooks/useVideos";
import type { Lesson } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TAG_STYLES = {
  expert:       { bg: "rgba(255,214,107,0.28)", text: "#8A6200", dot: color.yellowDark },
  intermediate: { bg: "rgba(29,158,117,0.12)",  text: "#0F6E56", dot: "#1D9E75"       },
  beginner:     { bg: "rgba(181,212,244,0.4)",   text: "#185FA5", dot: "#3A8FD4"       },
};

const LEVEL_LABEL = { beginner: "Débutant", intermediate: "Intermédiaire", expert: "Expert" };

function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}min${s > 0 ? ` ${s}s` : ""}`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return `${h}h${rem > 0 ? ` ${rem}min` : ""}`;
}

// ─── LessonItem ───────────────────────────────────────────────────────────────

function LessonItem({
  lesson,
  pct,
  time,
  onPress,
}: {
  lesson: Lesson;
  pct: number;
  time: number;
  onPress: () => void;
}) {
  const isDone = pct >= 0.9;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.lessonRow, pressed && styles.lessonRowPressed]}
    >
      <View style={[styles.lessonIndex, isDone && styles.lessonIndexDone]}>
        {isDone ? (
          <Feather name="check" size={14} color="#fff" />
        ) : (
          <Text style={styles.lessonIndexText}>{lesson.index}</Text>
        )}
      </View>

      <View style={styles.lessonInfo}>
        <Text numberOfLines={1} style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.lessonMeta}>
          <Feather name="clock" size={11} color={color.softGray} />
          <Text style={styles.lessonDuration}>{formatDuration(lesson.duration_seconds)}</Text>
          {pct > 0 && !isDone && (
            <Text style={styles.lessonPct}>{Math.round(pct * 100)}%</Text>
          )}
        </View>
        {pct > 0 && !isDone && (
          <View style={styles.lessonProgressTrack}>
            <View style={[styles.lessonProgressFill, { width: `${pct * 100}%` as any }]} />
          </View>
        )}
      </View>

      <View style={[styles.lessonPlayBtn, isDone && styles.lessonPlayBtnDone]}>
        <Feather name={isDone ? "refresh-cw" : "play"} size={13} color={isDone ? color.softGray : "#fff"} />
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

type SelectedLesson = { lesson: Lesson; url: string };

export default function CourseLessonsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { courses }                     = useCourses();
  const { lessons }                     = useLessons();
  const { videoProgress, saveProgress } = useVideos();

  const course       = courses.find((c) => c.id === id) ?? null;
  const courseLessons = lessons
    .filter((l) => l.course_id === id)
    .sort((a, b) => a.index - b.index);

  const [selectedLesson, setSelectedLesson] = useState<SelectedLesson | null>(null);

  const handleProgress = useCallback(
    (currentTime: number, pct: number) => {
      if (!selectedLesson) return;
      saveProgress(selectedLesson.lesson.video_id, pct, currentTime);
    },
    [selectedLesson, saveProgress],
  );

  if (!course) return null;

  const totalLessons     = courseLessons.length;
  const completedLessons = courseLessons.filter((l) => (videoProgress[l.video_id]?.pct ?? 0) >= 0.9).length;
  const overallProgress  = totalLessons > 0 ? completedLessons / totalLessons : 0;

  const tagStyle = TAG_STYLES[course.tag_type];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerImageWrap}>
        {course.image_url ? (
          <Image source={{ uri: course.image_url }} style={styles.headerImage} />
        ) : (
          <View style={[styles.headerImage, { backgroundColor: color.deepBlue }]} />
        )}
        <LinearGradient colors={["rgba(14,43,69,0.35)", "rgba(14,43,69,0.92)"]} style={styles.headerOverlay} />

        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </Pressable>

        <View style={styles.headerInfo}>
          <View style={[styles.tagPill, { backgroundColor: tagStyle.bg }]}>
            <View style={[styles.tagDot, { backgroundColor: tagStyle.dot }]} />
            <Text style={[styles.tagText, { color: tagStyle.text }]}>{LEVEL_LABEL[course.tag_type]}</Text>
          </View>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseInstructor}>{course.instructor}</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${overallProgress * 100}%` as any }]} />
            </View>
            <Text style={styles.progressLabel}>{completedLessons}/{totalLessons} leçons</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsStrip}>
        <View style={styles.statChip}>
          <Feather name="book-open" size={13} color={color.deepBlue} />
          <Text style={styles.statChipText}>{totalLessons} leçons</Text>
        </View>
        <View style={styles.statChip}>
          <Feather name="clock" size={13} color={color.deepBlue} />
          <Text style={styles.statChipText}>{formatDuration(course.total_duration_seconds)}</Text>
        </View>
        {course.category && (
          <View style={styles.statChip}>
            <Feather name="bar-chart-2" size={13} color={color.deepBlue} />
            <Text style={styles.statChipText}>{course.category.title}</Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Contenu du cours</Text>

        {courseLessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            pct={videoProgress[lesson.video_id]?.pct ?? 0}
            time={videoProgress[lesson.video_id]?.time ?? 0}
            onPress={() =>
              setSelectedLesson({ lesson, url: lesson.video?.url ?? "" })
            }
          />
        ))}

        <View style={{ height: 110 }} />
      </ScrollView>

      <VideoModal
        visible={selectedLesson !== null}
        videoUrl={selectedLesson?.url ?? null}
        title={selectedLesson?.lesson.title}
        initialTime={selectedLesson ? (videoProgress[selectedLesson.lesson.video_id]?.time ?? 0) : 0}
        onProgress={handleProgress}
        onClose={() => setSelectedLesson(null)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgGradientTop },

  headerImageWrap: { height: 260, position: "relative" },
  headerImage:     { width: "100%", height: "100%", resizeMode: "cover" },
  headerOverlay:   { position: "absolute", top: 0, bottom: 0, left: 0, right: 0 },
  backBtn: { position: "absolute", top: 16, left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
  headerInfo: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 18 },
  tagPill:    { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginBottom: 8 },
  tagDot:     { width: 5, height: 5, borderRadius: 3 },
  tagText:    { fontSize: 10, fontWeight: "700" },
  courseTitle:     { fontSize: 22, fontWeight: "800", color: "#fff", letterSpacing: -0.4, marginBottom: 4 },
  courseInstructor:{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 12 },
  progressRow:  { flexDirection: "row", alignItems: "center", gap: 10 },
  progressTrack:{ flex: 1, height: 5, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: color.yellow, borderRadius: 4 },
  progressLabel:{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: "600" },

  statsStrip: { flexDirection: "row", gap: 10, paddingHorizontal: 18, paddingVertical: 14, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "rgba(14,43,69,0.06)" },
  statChip:     { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: color.paleBlue, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  statChipText: { fontSize: 11, fontWeight: "600", color: color.deepBlue },

  scrollContent: { paddingHorizontal: 18, paddingTop: 18 },
  sectionTitle:  { fontSize: 15, fontWeight: "700", color: color.deepBlue, marginBottom: 14, letterSpacing: -0.2 },

  lessonRow: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, shadowColor: color.navy, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: "rgba(14,43,69,0.04)" },
  lessonRowPressed: { opacity: 0.75 },
  lessonIndex:      { width: 36, height: 36, borderRadius: 18, backgroundColor: color.deepBlue, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  lessonIndexDone:  { backgroundColor: "#1D9E75" },
  lessonIndexText:  { fontSize: 13, fontWeight: "700", color: "#fff" },

  lessonInfo:     { flex: 1, minWidth: 0, gap: 3 },
  lessonTitle:    { fontSize: 14, fontWeight: "600", color: color.deepBlue, letterSpacing: -0.1 },
  lessonMeta:     { flexDirection: "row", alignItems: "center", gap: 5 },
  lessonDuration: { fontSize: 11, color: color.softGray },
  lessonPct:      { fontSize: 11, color: color.yellowDark, fontWeight: "700", marginLeft: 4 },
  lessonProgressTrack: { height: 3, backgroundColor: "rgba(14,43,69,0.08)", borderRadius: 3, overflow: "hidden", marginTop: 4 },
  lessonProgressFill:  { height: "100%", backgroundColor: color.yellow, borderRadius: 3 },

  lessonPlayBtn:     { width: 34, height: 34, borderRadius: 10, backgroundColor: color.deepBlue, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  lessonPlayBtnDone: { backgroundColor: color.paleBlue },
});
