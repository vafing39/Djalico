import { color } from "@/config/color";
import VideoModal from "@/components/VideoModal";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useParcours } from "@/hooks/useParcours";
import { useCourses } from "@/hooks/useCourses";
import { useLessons } from "@/hooks/useLessons";
import { useVideos } from "@/hooks/useVideos";
import type { Course, Lesson, TagType } from "@/types";
import type { VideoProgressStore } from "@/contexts/videoContext";

// ─── Local types ──────────────────────────────────────────────────────────────

type LessonStatus = "done" | "current" | "available";

type RenderLesson = {
  id: string;
  videoId: string;
  index: number;
  title: string;
  duration: string;
  status: LessonStatus;
  url: string;
};

type SelectedVideo = { id: string; videoId: string; url: string; title: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEVEL_LABEL: Record<TagType, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  expert: "Expert",
};

const TAG_STYLES = {
  expert:       { bg: "rgba(255,214,107,0.28)", text: "#8A6200",  dot: color.yellowDark },
  intermediate: { bg: "rgba(29,158,117,0.12)",  text: "#0F6E56",  dot: "#1D9E75"        },
  beginner:     { bg: "rgba(181,212,244,0.4)",  text: "#185FA5",  dot: "#3A8FD4"        },
};

function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}min${s > 0 ? ` ${s}s` : ""}`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return `${h}h${rem > 0 ? ` ${rem}min` : ""}`;
}

function toRenderLesson(lesson: Lesson, progress: VideoProgressStore): RenderLesson {
  const pct = progress[lesson.video_id]?.pct ?? 0;
  const status: LessonStatus = pct >= 0.9 ? "done" : pct > 0 ? "current" : "available";
  return {
    id: lesson.id,
    videoId: lesson.video_id,
    index: lesson.index,
    title: lesson.title,
    duration: formatDuration(lesson.duration_seconds),
    status,
    url: lesson.video?.url ?? "",
  };
}

// ─── Circular progress (SVG arc) ─────────────────────────────────────────────

function CircularProgress({ progress, size = 56 }: { progress: number; size?: number }) {
  const strokeWidth = 4;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(14,43,69,0.1)" strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color.yellowDark} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${circ * (1 - progress)}`}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={{ fontSize: 12, fontWeight: "800", color: color.deepBlue }}>
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
}

// ─── Lesson row ───────────────────────────────────────────────────────────────

function LessonRow({
  lesson,
  animDelay,
  onPress,
}: {
  lesson: RenderLesson;
  animDelay: number;
  onPress?: () => void;
}) {
  const [fadeAnim]   = useState(() => new Animated.Value(0));
  const [translateX] = useState(() => new Animated.Value(16));
  const [scale]      = useState(() => new Animated.Value(1));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,   { toValue: 1, duration: 340, delay: animDelay, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 340, delay: animDelay, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, animDelay, translateX]);

  const isCurrent   = lesson.status === "current";
  const isDone      = lesson.status === "done";
  const isAvailable = lesson.status === "available";

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View
        style={[
          styles.lessonRow,
          isCurrent && styles.lessonRowCurrent,
          isDone    && styles.lessonRowDone,
          { opacity: fadeAnim, transform: [{ translateX }, { scale }] },
        ]}
      >
        <View style={[styles.lessonIcon, isDone && styles.lessonIconDone, isCurrent && styles.lessonIconCurrent]}>
          {isDone ? (
            <Text style={styles.lessonIconCheck}>✓</Text>
          ) : isCurrent ? (
            <View style={styles.playTriangleSmall} />
          ) : (
            <Text style={styles.lessonIndexText}>{lesson.index}</Text>
          )}
        </View>

        <View style={styles.lessonConnectorWrap}><View style={[styles.lessonConnector, isDone && styles.connectorDone, isCurrent && styles.connectorCurrent]} /></View>

        <View style={styles.lessonContent}>
          <View style={styles.lessonTop}>
            <Text numberOfLines={1} style={styles.lessonTitle}>{lesson.title}</Text>
            {isCurrent && <View style={styles.currentPill}><Text style={styles.currentPillText}>En cours</Text></View>}
          </View>
          <Text style={styles.lessonDuration}>
            <Feather name="clock" size={10} /> {lesson.duration}
          </Text>
        </View>

        <View style={[styles.lessonAction, isDone && styles.lessonActionDone, isCurrent && styles.lessonActionCurrent, isAvailable && styles.lessonActionAvailable]}>
          <Feather name={isDone ? "refresh-cw" : "play"} size={12} color={isDone ? color.softGray : "#fff"} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Course block ─────────────────────────────────────────────────────────────

function CourseBlock({
  course,
  lessons,
  progress,
  globalOffset,
  onPressLesson,
}: {
  course: Course;
  lessons: Lesson[];
  progress: VideoProgressStore;
  globalOffset: number;
  onPressLesson: (lesson: Lesson) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const doneCount = lessons.filter((l) => (progress[l.video_id]?.pct ?? 0) >= 0.9).length;
  const allDone   = doneCount === lessons.length && lessons.length > 0;

  return (
    <View style={styles.moduleBlock}>
      <Pressable onPress={() => setCollapsed((v) => !v)} style={styles.moduleHeader}>
        <View style={styles.moduleHeaderLeft}>
          <View style={[styles.moduleDot, allDone && styles.moduleDotDone]} />
          <View>
            <Text style={styles.moduleTitle}>{course.title}</Text>
            <Text style={styles.moduleMeta}>{doneCount}/{lessons.length} leçons complétées</Text>
          </View>
        </View>
        <Feather name={collapsed ? "chevron-down" : "chevron-up"} size={16} color={color.softGray} />
      </Pressable>

      {!collapsed &&
        lessons.map((l, i) => (
          <LessonRow
            key={l.id}
            lesson={toRenderLesson(l, progress)}
            animDelay={(globalOffset + i) * 55}
            onPress={() => onPressLesson(l)}
          />
        ))}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ParcoursScreen() {
  const { courseId, parcoursId } = useLocalSearchParams<{ courseId?: string; parcoursId?: string }>();

  const { parcours, parcoursCourses } = useParcours();
  const { courses }                   = useCourses();
  const { lessons }                   = useLessons();
  const { videoProgress, saveProgress } = useVideos();

  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null);

  // ── Course mode ────────────────────────────────────────────────────────────
  const course = useMemo(
    () => (courseId ? courses.find((c) => c.id === courseId) ?? null : null),
    [courseId, courses],
  );
  const courseLessons = useMemo(
    () =>
      courseId
        ? lessons.filter((l) => l.course_id === courseId).sort((a, b) => a.index - b.index)
        : [],
    [courseId, lessons],
  );
  const isCourseMode = !!courseId && !!course;

  // ── Parcours mode ──────────────────────────────────────────────────────────
  const p = useMemo(
    () => (parcoursId ? parcours.find((x) => x.id === parcoursId) ?? null : null),
    [parcoursId, parcours],
  );

  const parcoursCourseData = useMemo(() => {
    if (!parcoursId) return [];
    return parcoursCourses
      .filter((pc) => pc.parcours_id === parcoursId)
      .sort((a, b) => a.order_index - b.order_index)
      .map((pc) => ({
        courseId: pc.course_id,
        course: courses.find((c) => c.id === pc.course_id) ?? null,
        lessons: lessons
          .filter((l) => l.course_id === pc.course_id)
          .sort((a, b) => a.index - b.index),
      }))
      .filter((x): x is { courseId: string; course: Course; lessons: Lesson[] } => x.course !== null);
  }, [parcoursId, parcoursCourses, courses, lessons]);

  // ── Progress handler ───────────────────────────────────────────────────────
  const handleProgress = useCallback(
    (currentTime: number, pct: number) => {
      if (!selectedVideo) return;
      saveProgress(selectedVideo.videoId, pct, currentTime);
    },
    [selectedVideo, saveProgress],
  );

  function openLesson(lesson: Lesson) {
    setSelectedVideo({
      id: lesson.id,
      videoId: lesson.video_id,
      url: lesson.video?.url ?? "",
      title: lesson.title,
    });
  }

  // ── Course mode derived ────────────────────────────────────────────────────
  const totalLessons     = courseLessons.length;
  const completedLessons = courseLessons.filter((l) => (videoProgress[l.video_id]?.pct ?? 0) >= 0.9).length;
  const courseProgress   = totalLessons > 0 ? completedLessons / totalLessons : 0;
  const firstUnfinished  = courseLessons.find((l) => (videoProgress[l.video_id]?.pct ?? 0) < 0.9);

  // ── Parcours mode derived ──────────────────────────────────────────────────
  const parcoursTotal     = parcoursCourseData.reduce((sum, x) => sum + x.lessons.length, 0);
  const parcoursCompleted = parcoursCourseData.reduce(
    (sum, x) => sum + x.lessons.filter((l) => (videoProgress[l.video_id]?.pct ?? 0) >= 0.9).length,
    0,
  );
  const parcoursProgress    = parcoursTotal > 0 ? parcoursCompleted / parcoursTotal : 0;
  const parcoursFirstLesson = parcoursCourseData
    .flatMap((x) => x.lessons)
    .find((l) => (videoProgress[l.video_id]?.pct ?? 0) < 0.9);

  // ── Shared hero values ─────────────────────────────────────────────────────
  const tagType        = isCourseMode ? course!.tag_type       : (p?.tag_type ?? "beginner");
  const tagStyle       = TAG_STYLES[tagType];
  const heroImage      = isCourseMode ? course!.image_url      : p?.cover_image_url;
  const heroTitle      = isCourseMode ? course!.title          : (p?.title ?? "");
  const heroCategory   = isCourseMode ? (course!.category?.title ?? "") : (p?.category?.title ?? "");
  const heroInstructor = isCourseMode ? course!.instructor     : (p?.instructor?.name ?? "");
  const heroTag        = LEVEL_LABEL[tagType];
  const heroLessons    = isCourseMode ? totalLessons           : parcoursTotal;
  const heroDuration   = formatDuration(isCourseMode ? course!.total_duration_seconds : (p?.total_duration_seconds ?? 0));
  const heroProgress   = isCourseMode ? courseProgress         : parcoursProgress;
  const heroCompleted  = isCourseMode ? completedLessons       : parcoursCompleted;
  const instructorAvatar = !isCourseMode ? p?.instructor?.avatar_url : null;

  let offset = 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Hero ── */}
        <View style={styles.heroWrap}>
          {heroImage ? (
            <Image source={{ uri: heroImage }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, { backgroundColor: color.deepBlue }]} />
          )}
          <LinearGradient colors={["rgba(14,43,69,0.15)", "rgba(14,43,69,0.78)"]} style={styles.heroGradient} />

          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={18} color="#fff" />
          </Pressable>

          <View style={[styles.heroTag, { backgroundColor: tagStyle.bg }]}>
            <View style={[styles.tagDot, { backgroundColor: tagStyle.dot }]} />
            <Text style={[styles.heroTagText, { color: tagStyle.text }]}>{heroTag}</Text>
          </View>

          <View style={styles.heroBottom}>
            <Text style={styles.heroCategory}>{heroCategory}</Text>
            <Text style={styles.heroTitle}>{heroTitle}</Text>
            <View style={styles.heroInstructorRow}>
              {instructorAvatar ? (
                <Image source={{ uri: instructorAvatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Feather name="user" size={11} color="rgba(255,255,255,0.7)" />
                </View>
              )}
              <Text style={styles.heroInstructor}>{heroInstructor}</Text>
            </View>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Feather name="play-circle" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.heroStatText}>{heroLessons} leçons</Text>
              </View>
              <View style={styles.heroStatDot} />
              <View style={styles.heroStat}>
                <Feather name="clock" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.heroStatText}>{heroDuration}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Progress card ── */}
        <View style={styles.progressCard}>
          <CircularProgress progress={heroProgress} size={60} />
          <View style={styles.progressCardInfo}>
            <Text style={styles.progressCardTitle}>Ta progression</Text>
            <Text style={styles.progressCardSub}>{heroCompleted} leçons sur {heroLessons} terminées</Text>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${heroProgress * 100}%` as any }]} />
            </View>
          </View>
          <Pressable
            style={styles.resumeBtn}
            onPress={() => {
              if (isCourseMode && firstUnfinished) openLesson(firstUnfinished);
              else if (!isCourseMode && parcoursFirstLesson) openLesson(parcoursFirstLesson);
            }}
          >
            <Text style={styles.resumeBtnText}>Reprendre</Text>
            <View style={styles.resumePlay}><View style={styles.playTriangleTiny} /></View>
          </Pressable>
        </View>

        {/* ── Description (parcours mode only) ── */}
        {!isCourseMode && p?.description ? (
          <View style={styles.descSection}>
            <Text style={styles.descText}>{p.description}</Text>
          </View>
        ) : null}

        {/* ── Lessons / courses ── */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>
            {isCourseMode ? "Contenu du cours" : "Contenu du parcours"}
          </Text>

          {isCourseMode
            ? courseLessons.map((l, i) => (
                <LessonRow
                  key={l.id}
                  lesson={toRenderLesson(l, videoProgress)}
                  animDelay={i * 55}
                  onPress={() => openLesson(l)}
                />
              ))
            : parcoursCourseData.map(({ courseId: cId, course: c, lessons: cls }) => {
                const thisOffset = offset;
                offset += cls.length;
                return (
                  <CourseBlock
                    key={cId}
                    course={c}
                    lessons={cls}
                    progress={videoProgress}
                    globalOffset={thisOffset}
                    onPressLesson={openLesson}
                  />
                );
              })}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      <VideoModal
        visible={selectedVideo !== null}
        videoUrl={selectedVideo?.url ?? null}
        title={selectedVideo?.title}
        initialTime={selectedVideo ? (videoProgress[selectedVideo.videoId]?.time ?? 0) : 0}
        onProgress={handleProgress}
        onClose={() => setSelectedVideo(null)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgGradientTop },
  scrollContent: { paddingBottom: 20 },

  heroWrap: { height: 300, position: "relative" },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  heroGradient: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0 },
  backBtn: { position: "absolute", top: 55, left: 20, width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(14,43,69,0.45)", justifyContent: "center", alignItems: "center" },
  heroTag: { position: "absolute", top: 16, right: 20, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  tagDot: { width: 5, height: 5, borderRadius: 3 },
  heroTagText: { fontSize: 11, fontWeight: "700" },
  heroBottom: { position: "absolute", bottom: 15, left: 0, right: 0, padding: 20 },
  heroCategory: { fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  heroTitle: { fontSize: 24, fontWeight: "800", color: "#fff", letterSpacing: -0.4, marginBottom: 10 },
  heroInstructorRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  avatar: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.5)" },
  avatarFallback: { width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.5)", justifyContent: "center", alignItems: "center" },
  heroInstructor: { fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: "500" },
  heroStats: { flexDirection: "row", alignItems: "center", gap: 10 },
  heroStat: { flexDirection: "row", alignItems: "center", gap: 5 },
  heroStatText: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "500" },
  heroStatDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.4)" },

  progressCard: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginTop: -20, backgroundColor: "#fff", borderRadius: 20, padding: 16, gap: 14, shadowColor: color.navy, shadowOpacity: 0.12, shadowOffset: { width: 0, height: 8 }, shadowRadius: 18, elevation: 6 },
  progressCardInfo: { flex: 1 },
  progressCardTitle: { fontSize: 14, fontWeight: "700", color: color.deepBlue, marginBottom: 2 },
  progressCardSub: { fontSize: 11, color: color.softGray, marginBottom: 8 },
  progressBarTrack: { height: 4, backgroundColor: "rgba(14,43,69,0.08)", borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: color.yellowDark, borderRadius: 4 },
  resumeBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: color.deepBlue, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  resumeBtnText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  resumePlay: { width: 18, height: 18, borderRadius: 9, backgroundColor: color.yellow, justifyContent: "center", alignItems: "center" },
  playTriangleTiny: { width: 0, height: 0, borderTopWidth: 4, borderBottomWidth: 4, borderLeftWidth: 6, borderStyle: "solid", borderTopColor: "transparent", borderBottomColor: "transparent", borderLeftColor: color.deepBlue, marginLeft: 1 },

  descSection: { paddingHorizontal: 24, paddingTop: 22, paddingBottom: 4 },
  descText: { fontSize: 13.5, lineHeight: 21, color: color.softGray, fontWeight: "400" },

  modulesSection: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: color.deepBlue, letterSpacing: -0.3, marginBottom: 16 },

  moduleBlock: { backgroundColor: "#fff", borderRadius: 18, marginBottom: 12, overflow: "hidden", shadowColor: color.navy, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2 },
  moduleHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "rgba(14,43,69,0.05)" },
  moduleHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  moduleDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "rgba(14,43,69,0.15)" },
  moduleDotDone: { backgroundColor: "#1D9E75" },
  moduleTitle: { fontSize: 14, fontWeight: "700", color: color.deepBlue },
  moduleMeta: { fontSize: 11, color: color.softGray, marginTop: 1 },

  lessonRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13, gap: 12, borderBottomWidth: 1, borderBottomColor: "rgba(14,43,69,0.04)" },
  lessonRowCurrent: { backgroundColor: "rgba(255,214,107,0.07)" },
  lessonRowDone: { backgroundColor: "#FAFFFE" },

  lessonIcon: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: color.yellowDark, justifyContent: "center", alignItems: "center", flexShrink: 0, backgroundColor: color.yellowDark },
  lessonIconDone: { backgroundColor: "#1D9E75", borderColor: "#1D9E75" },
  lessonIconCurrent: { backgroundColor: color.yellow, borderColor: color.yellowDark },
  lessonIconCheck: { fontSize: 13, color: "#fff", fontWeight: "800" },
  lessonIndexText: { fontSize: 12, fontWeight: "700", color: color.deepBlue },
  playTriangleSmall: { width: 0, height: 0, borderTopWidth: 5, borderBottomWidth: 5, borderLeftWidth: 8, borderStyle: "solid", borderTopColor: "transparent", borderBottomColor: "transparent", borderLeftColor: color.deepBlue, marginLeft: 2 },

  lessonConnectorWrap: { display: "none" },
  lessonConnector: {},
  connectorDone: {},
  connectorCurrent: {},

  lessonContent: { flex: 1, gap: 3 },
  lessonTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  lessonTitle: { fontSize: 13.5, fontWeight: "600", color: color.deepBlue, flex: 1 },
  currentPill: { backgroundColor: color.yellow, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  currentPillText: { fontSize: 10, fontWeight: "700", color: color.deepBlue },
  lessonDuration: { fontSize: 11, color: color.softGray },

  lessonAction: { width: 28, height: 28, borderRadius: 9, backgroundColor: color.deepBlue, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  lessonActionDone: { backgroundColor: color.paleBlue },
  lessonActionCurrent: { backgroundColor: color.yellowDark },
  lessonActionAvailable: { backgroundColor: color.deepBlue },
});
