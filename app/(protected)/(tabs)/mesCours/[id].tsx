import { color } from "@/config/color";
import { CourseLesson, COURSE_LESSONS, MY_COURSES } from "@/data/mockData";
import VideoModal from "@/components/VideoModal";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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

const LESSON_KEY = (id: string) => `djalico_lesson_${id}`;

type LessonProgress = Record<string, { pct: number; time: number }>;

const TAG_STYLES = {
  expert:       { bg: "rgba(255,214,107,0.28)", text: "#8A6200", dot: color.yellowDark },
  intermediate: { bg: "rgba(29,158,117,0.12)",  text: "#0F6E56", dot: "#1D9E75"       },
  beginner:     { bg: "rgba(181,212,244,0.4)",   text: "#185FA5", dot: "#3A8FD4"       },
};

// ─── LessonItem — one row in the lesson list ──────────────────────────────────

function LessonItem({
  lesson,
  progress,
  isLocked,
  onPress,
}: {
  lesson: CourseLesson;
  progress: { pct: number; time: number } | undefined;
  isLocked: boolean;
  onPress: () => void;
}) {
  const pct = progress?.pct ?? 0;
  const isDone = pct >= 0.9;

  return (
    <Pressable
      onPress={isLocked ? undefined : onPress}
      style={({ pressed }) => [styles.lessonRow, pressed && !isLocked && styles.lessonRowPressed]}
    >
      {/* Index circle */}
      <View style={[styles.lessonIndex, isDone && styles.lessonIndexDone, isLocked && styles.lessonIndexLocked]}>
        {isDone ? (
          <Feather name="check" size={14} color="#fff" />
        ) : isLocked ? (
          <Feather name="lock" size={12} color="rgba(255,255,255,0.6)" />
        ) : (
          <Text style={styles.lessonIndexText}>{lesson.index}</Text>
        )}
      </View>

      {/* Info */}
      <View style={styles.lessonInfo}>
        <Text numberOfLines={1} style={[styles.lessonTitle, isLocked && styles.lessonTitleLocked]}>
          {lesson.title}
        </Text>
        <View style={styles.lessonMeta}>
          <Feather name="clock" size={11} color={color.softGray} />
          <Text style={styles.lessonDuration}>{lesson.duration}</Text>
          {pct > 0 && !isDone && (
            <Text style={styles.lessonPct}>{Math.round(pct * 100)}%</Text>
          )}
        </View>

        {/* Mini progress bar for in-progress lessons */}
        {pct > 0 && !isDone && (
          <View style={styles.lessonProgressTrack}>
            <View style={[styles.lessonProgressFill, { width: `${pct * 100}%` as any }]} />
          </View>
        )}
      </View>

      {/* Play / replay button */}
      {!isLocked && (
        <View style={[styles.lessonPlayBtn, isDone && styles.lessonPlayBtnDone]}>
          <Feather name={isDone ? "refresh-cw" : "play"} size={13} color={isDone ? color.softGray : "#fff"} />
        </View>
      )}
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CourseLessonsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const course = MY_COURSES.find((c) => c.id === id);
  const lessons = COURSE_LESSONS.filter((l) => l.courseId === id);

  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);

  useEffect(() => {
    async function load() {
      const entries = await AsyncStorage.multiGet(lessons.map((l) => LESSON_KEY(l.id)));
      const map: LessonProgress = {};
      entries.forEach(([key, value]) => {
        if (value) {
          const lessonId = key.replace("djalico_lesson_", "");
          try { map[lessonId] = JSON.parse(value); } catch {}
        }
      });
      setLessonProgress(map);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleProgress = useCallback(
    async (currentTime: number, pct: number) => {
      if (!selectedLesson) return;
      const data = { pct, time: currentTime };
      await AsyncStorage.setItem(LESSON_KEY(selectedLesson.id), JSON.stringify(data));
      setLessonProgress((prev) => ({ ...prev, [selectedLesson.id]: data }));
    },
    [selectedLesson],
  );

  if (!course) return null;

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l) => (lessonProgress[l.id]?.pct ?? 0) >= 0.9).length;
  const overallProgress = totalLessons > 0 ? completedLessons / totalLessons : 0;

  const tagStyle = TAG_STYLES[course.tagType];
  const isLocked = course.status === "non_commence";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Course header image */}
      <View style={styles.headerImageWrap}>
        <Image source={{ uri: course.image }} style={styles.headerImage} />
        <LinearGradient
          colors={["rgba(14,43,69,0.35)", "rgba(14,43,69,0.92)"]}
          style={styles.headerOverlay}
        />

        {/* Back button */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </Pressable>

        {/* Header info */}
        <View style={styles.headerInfo}>
          <View style={[styles.tagPill, { backgroundColor: tagStyle.bg }]}>
            <View style={[styles.tagDot, { backgroundColor: tagStyle.dot }]} />
            <Text style={[styles.tagText, { color: tagStyle.text }]}>{course.tag}</Text>
          </View>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseInstructor}>{course.instructor}</Text>

          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${overallProgress * 100}%` as any }]} />
            </View>
            <Text style={styles.progressLabel}>
              {completedLessons}/{totalLessons} leçons
            </Text>
          </View>
        </View>
      </View>

      {/* Stats strip */}
      <View style={styles.statsStrip}>
        <View style={styles.statChip}>
          <Feather name="book-open" size={13} color={color.deepBlue} />
          <Text style={styles.statChipText}>{totalLessons} leçons</Text>
        </View>
        <View style={styles.statChip}>
          <Feather name="clock" size={13} color={color.deepBlue} />
          <Text style={styles.statChipText}>{course.duration}</Text>
        </View>
        <View style={styles.statChip}>
          <Feather name="bar-chart-2" size={13} color={color.deepBlue} />
          <Text style={styles.statChipText}>{course.category}</Text>
        </View>
      </View>

      {/* Lesson list */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Contenu du cours</Text>

        {lessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            progress={lessonProgress[lesson.id]}
            isLocked={isLocked}
            onPress={() => setSelectedLesson(lesson)}
          />
        ))}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Video player modal */}
      <VideoModal
        visible={selectedLesson !== null}
        videoUrl={selectedLesson?.url ?? null}
        title={selectedLesson?.title}
        initialTime={selectedLesson ? (lessonProgress[selectedLesson.id]?.time ?? 0) : 0}
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
  backBtn: {
    position: "absolute", top: 16, left: 16,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center", alignItems: "center",
  },
  headerInfo: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 18 },
  tagPill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    alignSelf: "flex-start", marginBottom: 8,
  },
  tagDot:          { width: 5, height: 5, borderRadius: 3 },
  tagText:         { fontSize: 10, fontWeight: "700" },
  courseTitle:     { fontSize: 22, fontWeight: "800", color: "#fff", letterSpacing: -0.4, marginBottom: 4 },
  courseInstructor:{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 12 },
  progressRow:     { flexDirection: "row", alignItems: "center", gap: 10 },
  progressTrack:   { flex: 1, height: 5, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 4, overflow: "hidden" },
  progressFill:    { height: "100%", backgroundColor: color.yellow, borderRadius: 4 },
  progressLabel:   { fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: "600" },

  statsStrip: {
    flexDirection: "row", gap: 10,
    paddingHorizontal: 18, paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: "rgba(14,43,69,0.06)",
  },
  statChip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: color.paleBlue, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  statChipText: { fontSize: 11, fontWeight: "600", color: color.deepBlue },

  scrollContent: { paddingHorizontal: 18, paddingTop: 18 },
  sectionTitle:  { fontSize: 15, fontWeight: "700", color: color.deepBlue, marginBottom: 14, letterSpacing: -0.2 },

  lessonRow: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "#fff", borderRadius: 16,
    padding: 14, marginBottom: 10,
    shadowColor: color.navy, shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2,
    borderWidth: 1, borderColor: "rgba(14,43,69,0.04)",
  },
  lessonRowPressed: { opacity: 0.75 },
  lessonIndex: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: color.deepBlue,
    justifyContent: "center", alignItems: "center", flexShrink: 0,
  },
  lessonIndexDone:   { backgroundColor: "#1D9E75" },
  lessonIndexLocked: { backgroundColor: "rgba(14,43,69,0.3)" },
  lessonIndexText:   { fontSize: 13, fontWeight: "700", color: "#fff" },

  lessonInfo:        { flex: 1, minWidth: 0, gap: 3 },
  lessonTitle:       { fontSize: 14, fontWeight: "600", color: color.deepBlue, letterSpacing: -0.1 },
  lessonTitleLocked: { color: color.softGray },
  lessonMeta:        { flexDirection: "row", alignItems: "center", gap: 5 },
  lessonDuration:    { fontSize: 11, color: color.softGray },
  lessonPct:         { fontSize: 11, color: color.yellowDark, fontWeight: "700", marginLeft: 4 },
  lessonProgressTrack: {
    height: 3, backgroundColor: "rgba(14,43,69,0.08)",
    borderRadius: 3, overflow: "hidden", marginTop: 4,
  },
  lessonProgressFill: { height: "100%", backgroundColor: color.yellow, borderRadius: 3 },

  lessonPlayBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: color.deepBlue,
    justifyContent: "center", alignItems: "center", flexShrink: 0,
  },
  lessonPlayBtnDone: { backgroundColor: color.paleBlue },
});
