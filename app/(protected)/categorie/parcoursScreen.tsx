import { color } from "@/config/color";
import {
  PARCOURS_DETAIL,
  Module,
  Lesson,
  LessonStatus,
  MY_COURSES,
  COURSE_LESSONS,
  CourseLesson,
} from "@/data/mockData";
import VideoModal from "@/components/VideoModal";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonProgress = Record<string, { pct: number; time: number }>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TAG_STYLES = {
  expert: {
    bg: "rgba(255,214,107,0.28)",
    text: "#8A6200",
    dot: color.yellowDark,
  },
  intermediate: {
    bg: "rgba(29,158,117,0.12)",
    text: "#0F6E56",
    dot: "#1D9E75",
  },
  beginner: { bg: "rgba(181,212,244,0.4)", text: "#185FA5", dot: "#3A8FD4" },
};

function mapCourseLesson(
  cl: CourseLesson,
  progress: LessonProgress,
  isLocked: boolean,
): Lesson {
  const pct = progress[cl.id]?.pct ?? 0;
  const status: LessonStatus =
    pct >= 0.9
      ? "done"
      : pct > 0
        ? "current"
        : isLocked
          ? "locked"
          : "available";
  return {
    id: cl.id,
    index: cl.index,
    title: cl.title,
    duration: cl.duration,
    status,
  };
}

// ─── Circular progress ────────────────────────────────────────────────────────

function CircularProgress({
  progress,
  size = 56,
}: {
  progress: number;
  size?: number;
}) {
  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 4,
          borderColor: "rgba(14,43,69,0.1)",
          position: "absolute",
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 4,
          borderColor: "transparent",
          borderTopColor: color.yellowDark,
          borderRightColor: progress > 0.25 ? color.yellowDark : "transparent",
          borderBottomColor: progress > 0.5 ? color.yellowDark : "transparent",
          borderLeftColor: progress > 0.75 ? color.yellowDark : "transparent",
          transform: [{ rotate: "-90deg" }],
          position: "absolute",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontSize: 12, fontWeight: "800", color: color.deepBlue }}
        >
          {Math.round(progress * 100)}%
        </Text>
      </View>
    </View>
  );
}

// ─── Lesson row ───────────────────────────────────────────────────────────────

function LessonRow({
  lesson,
  animDelay,
  onPress,
}: {
  lesson: Lesson;
  animDelay: number;
  onPress?: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(16)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 340,
        delay: animDelay,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 340,
        delay: animDelay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, animDelay, translateX]);

  const isCurrent = lesson.status === "current";
  const isDone = lesson.status === "done";
  const isLocked = lesson.status === "locked";
  const isAvailable = lesson.status === "available";

  return (
    <Pressable
      onPress={!isLocked && onPress ? onPress : undefined}
      onPressIn={() =>
        !isLocked &&
        Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
      }
    >
      <Animated.View
        style={[
          styles.lessonRow,
          isCurrent && styles.lessonRowCurrent,
          isDone && styles.lessonRowDone,
          isLocked && styles.lessonRowLocked,
          { opacity: fadeAnim, transform: [{ translateX }, { scale }] },
        ]}
      >
        {/* Status icon */}
        <View
          style={[
            styles.lessonIcon,
            isDone && styles.lessonIconDone,
            isCurrent && styles.lessonIconCurrent,
            isLocked && styles.lessonIconLocked,
          ]}
        >
          {isDone ? (
            <Text style={styles.lessonIconCheck}>✓</Text>
          ) : isCurrent ? (
            <View style={styles.playTriangleSmall} />
          ) : isLocked ? (
            <Feather name="lock" size={11} color="rgba(14,43,69,0.3)" />
          ) : (
            <Text style={styles.lessonIndexText}>{lesson.index}</Text>
          )}
        </View>

        {/* Connector placeholder */}
        <View style={styles.lessonConnectorWrap}>
          <View
            style={[
              styles.lessonConnector,
              isDone && styles.connectorDone,
              isCurrent && styles.connectorCurrent,
            ]}
          />
        </View>

        {/* Content */}
        <View style={styles.lessonContent}>
          <View style={styles.lessonTop}>
            <Text
              numberOfLines={1}
              style={[styles.lessonTitle, isLocked && styles.lessonTitleLocked]}
            >
              {lesson.title}
            </Text>
            {isCurrent && (
              <View style={styles.currentPill}>
                <Text style={styles.currentPillText}>En cours</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.lessonDuration,
              isLocked && styles.lessonDurationLocked,
            ]}
          >
            <Feather name="clock" size={10} /> {lesson.duration}
          </Text>
        </View>

        {/* Action button — visible for done, current, and available */}
        {!isLocked && (
          <View
            style={[
              styles.lessonAction,
              isDone && styles.lessonActionDone,
              isCurrent && styles.lessonActionCurrent,
              isAvailable && styles.lessonActionAvailable,
            ]}
          >
            <Feather
              name={isDone ? "refresh-cw" : "play"}
              size={12}
              color={isDone ? color.softGray : "#fff"}
            />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

// ─── Module block (parcours mode only) ────────────────────────────────────────

function ModuleBlock({
  module,
  globalOffset,
}: {
  module: Module;
  globalOffset: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const doneCount = module.lessons.filter((l) => l.status === "done").length;
  const allDone = doneCount === module.lessons.length;

  return (
    <View style={styles.moduleBlock}>
      <Pressable
        onPress={() => setCollapsed((v) => !v)}
        style={styles.moduleHeader}
      >
        <View style={styles.moduleHeaderLeft}>
          <View style={[styles.moduleDot, allDone && styles.moduleDotDone]} />
          <View>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.moduleMeta}>
              {doneCount}/{module.lessons.length} leçons complétées
            </Text>
          </View>
        </View>
        <Feather
          name={collapsed ? "chevron-down" : "chevron-up"}
          size={16}
          color={color.softGray}
        />
      </Pressable>

      {!collapsed &&
        module.lessons.map((lesson, i) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            animDelay={(globalOffset + i) * 55}
          />
        ))}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ParcoursScreen() {
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();

  // Course mode state (only used when courseId is provided)
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(
    null,
  );

  const course = courseId ? MY_COURSES.find((c) => c.id === courseId) : null;
  const courseLessons = courseId
    ? COURSE_LESSONS.filter((l) => l.courseId === courseId)
    : [];
  const isCourseMode = !!courseId && !!course;

  useEffect(() => {
    if (!isCourseMode || courseLessons.length === 0) return;
    async function load() {
      const entries = await AsyncStorage.multiGet(
        courseLessons.map((l) => `djalico_lesson_${l.id}`),
      );
      const map: LessonProgress = {};
      entries.forEach(([key, value]) => {
        if (value) {
          const id = key.replace("djalico_lesson_", "");
          try {
            map[id] = JSON.parse(value);
          } catch {}
        }
      });
      setLessonProgress(map);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleProgress = useCallback(
    async (currentTime: number, pct: number) => {
      if (!selectedLesson) return;
      const data = { pct, time: currentTime };
      await AsyncStorage.setItem(
        `djalico_lesson_${selectedLesson.id}`,
        JSON.stringify(data),
      );
      setLessonProgress((prev) => ({ ...prev, [selectedLesson.id]: data }));
    },
    [selectedLesson],
  );

  // ── Course mode derived values ────────────────────────────────────────────
  const totalLessons = courseLessons.length;
  const completedLessons = courseLessons.filter(
    (l) => (lessonProgress[l.id]?.pct ?? 0) >= 0.9,
  ).length;
  const courseProgress = totalLessons > 0 ? completedLessons / totalLessons : 0;
  const isCourseLocked = course?.status === "non_commence";
  const firstUnfinished = courseLessons.find(
    (l) => (lessonProgress[l.id]?.pct ?? 0) < 0.9,
  );

  // ── Parcours mode data ────────────────────────────────────────────────────
  const p = PARCOURS_DETAIL;
  const parcoursProgress = p.completedLessons / p.totalLessons;
  const tagStyle = TAG_STYLES[isCourseMode ? course!.tagType : p.tagType];

  // Staggered animation offset counter for ModuleBlock
  let offset = 0;

  // ── Shared header data ────────────────────────────────────────────────────
  const heroImage = isCourseMode ? course!.image : p.coverImage;
  const heroTitle = isCourseMode ? course!.title : p.title;
  const heroCategory = isCourseMode ? course!.category : p.category;
  const heroInstructor = isCourseMode ? course!.instructor : p.instructor;
  const heroTag = isCourseMode ? course!.tag : p.tag;
  const heroLessons = isCourseMode ? totalLessons : p.totalLessons;
  const heroDuration = isCourseMode ? course!.duration : p.totalDuration;
  const heroProgress = isCourseMode ? courseProgress : parcoursProgress;
  const heroCompleted = isCourseMode ? completedLessons : p.completedLessons;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero cover ── */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: heroImage }} style={styles.heroImage} />
          <LinearGradient
            colors={["rgba(14,43,69,0.15)", "rgba(14,43,69,0.78)"]}
            style={styles.heroGradient}
          />

          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={18} color="#fff" />
          </Pressable>

          <View style={[styles.heroTag, { backgroundColor: tagStyle.bg }]}>
            <View style={[styles.tagDot, { backgroundColor: tagStyle.dot }]} />
            <Text style={[styles.heroTagText, { color: tagStyle.text }]}>
              {heroTag}
            </Text>
          </View>

          <View style={styles.heroBottom}>
            <Text style={styles.heroCategory}>{heroCategory}</Text>
            <Text style={styles.heroTitle}>{heroTitle}</Text>

            <View style={styles.heroInstructorRow}>
              {!isCourseMode && p.instructorAvatar ? (
                <Image
                  source={{ uri: p.instructorAvatar }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Feather
                    name="user"
                    size={11}
                    color="rgba(255,255,255,0.7)"
                  />
                </View>
              )}
              <Text style={styles.heroInstructor}>{heroInstructor}</Text>
            </View>

            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Feather
                  name="play-circle"
                  size={12}
                  color="rgba(255,255,255,0.7)"
                />
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
            <Text style={styles.progressCardSub}>
              {heroCompleted} leçons sur {heroLessons} terminées
            </Text>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${heroProgress * 100}%` as any },
                ]}
              />
            </View>
          </View>
          <Pressable
            style={styles.resumeBtn}
            onPress={
              isCourseMode && firstUnfinished
                ? () => setSelectedLesson(firstUnfinished)
                : undefined
            }
          >
            <Text style={styles.resumeBtnText}>Reprendre</Text>
            <View style={styles.resumePlay}>
              <View style={styles.playTriangleTiny} />
            </View>
          </Pressable>
        </View>

        {/* ── Description (parcours mode only) ── */}
        {!isCourseMode && (
          <View style={styles.descSection}>
            <Text style={styles.descText}>{p.description}</Text>
          </View>
        )}

        {/* ── Lessons / modules ── */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>
            {isCourseMode ? "Contenu du cours" : "Contenu du parcours"}
          </Text>

          {isCourseMode
            ? // Flat lesson list for course mode
              courseLessons.map((cl, i) => (
                <LessonRow
                  key={cl.id}
                  lesson={mapCourseLesson(cl, lessonProgress, isCourseLocked)}
                  animDelay={i * 55}
                  onPress={() => setSelectedLesson(cl)}
                />
              ))
            : // Module-based list for parcours mode
              p.modules.map((module) => {
                const thisOffset = offset;
                offset += module.lessons.length;
                return (
                  <ModuleBlock
                    key={module.id}
                    module={module}
                    globalOffset={thisOffset}
                  />
                );
              })}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Video player — course mode only */}
      {isCourseMode && (
        <VideoModal
          visible={selectedLesson !== null}
          videoUrl={selectedLesson?.url ?? null}
          title={selectedLesson?.title}
          initialTime={
            selectedLesson ? (lessonProgress[selectedLesson.id]?.time ?? 0) : 0
          }
          onProgress={handleProgress}
          onClose={() => setSelectedLesson(null)}
        />
      )}
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
  backBtn: {
    position: "absolute",
    top: 55,
    left: 20,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(14,43,69,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTag: {
    position: "absolute",
    top: 16,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagDot: { width: 5, height: 5, borderRadius: 3 },
  heroTagText: { fontSize: 11, fontWeight: "700" },
  heroBottom: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    padding: 20,
  },
  heroCategory: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  heroInstructorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  avatarFallback: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroInstructor: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  heroStats: { flexDirection: "row", alignItems: "center", gap: 10 },
  heroStat: { flexDirection: "row", alignItems: "center", gap: 5 },
  heroStatText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  heroStatDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  progressCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: -20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    gap: 14,
    shadowColor: color.navy,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 6,
  },
  progressCardInfo: { flex: 1 },
  progressCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: color.deepBlue,
    marginBottom: 2,
  },
  progressCardSub: { fontSize: 11, color: color.softGray, marginBottom: 8 },
  progressBarTrack: {
    height: 4,
    backgroundColor: "rgba(14,43,69,0.08)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: color.yellowDark,
    borderRadius: 4,
  },
  resumeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: color.deepBlue,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  resumeBtnText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  resumePlay: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: color.yellow,
    justifyContent: "center",
    alignItems: "center",
  },
  playTriangleTiny: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 6,
    borderStyle: "solid",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: color.deepBlue,
    marginLeft: 1,
  },

  descSection: { paddingHorizontal: 24, paddingTop: 22, paddingBottom: 4 },
  descText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: color.softGray,
    fontWeight: "400",
  },

  modulesSection: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: color.deepBlue,
    letterSpacing: -0.3,
    marginBottom: 16,
  },

  moduleBlock: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: color.navy,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(14,43,69,0.05)",
  },
  moduleHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  moduleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(14,43,69,0.15)",
  },
  moduleDotDone: { backgroundColor: "#1D9E75" },
  moduleTitle: { fontSize: 14, fontWeight: "700", color: color.deepBlue },
  moduleMeta: { fontSize: 11, color: color.softGray, marginTop: 1 },

  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(14,43,69,0.04)",
  },
  lessonRowCurrent: { backgroundColor: "rgba(255,214,107,0.07)" },
  lessonRowDone: { backgroundColor: "#FAFFFE" },
  lessonRowLocked: { opacity: 0.5 },

  lessonIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: color.yellowDark,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    backgroundColor: color.yellowDark,
  },
  lessonIconDone: { backgroundColor: "#1D9E75", borderColor: "#1D9E75" },
  lessonIconCurrent: {
    backgroundColor: color.yellow,
    borderColor: color.yellowDark,
  },
  lessonIconLocked: {
    backgroundColor: "rgba(14,43,69,0.04)",
    borderColor: "rgba(14,43,69,0.08)",
  },
  lessonIconCheck: { fontSize: 13, color: "#fff", fontWeight: "800" },
  lessonIndexText: { fontSize: 12, fontWeight: "700", color: color.deepBlue },
  playTriangleSmall: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 8,
    borderStyle: "solid",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: color.deepBlue,
    marginLeft: 2,
  },

  lessonConnectorWrap: { display: "none" },
  lessonConnector: {},
  connectorDone: {},
  connectorCurrent: {},

  lessonContent: { flex: 1, gap: 3 },
  lessonTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  lessonTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    color: color.deepBlue,
    flex: 1,
  },
  lessonTitleLocked: { color: color.softGray },
  currentPill: {
    backgroundColor: color.yellow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentPillText: { fontSize: 10, fontWeight: "700", color: color.deepBlue },
  lessonDuration: { fontSize: 11, color: color.softGray },
  lessonDurationLocked: { color: "rgba(154,166,178,0.6)" },

  lessonAction: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: color.deepBlue,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  lessonActionDone: { backgroundColor: color.paleBlue },
  lessonActionCurrent: { backgroundColor: color.yellowDark },
  lessonActionAvailable: { backgroundColor: color.deepBlue },
});
