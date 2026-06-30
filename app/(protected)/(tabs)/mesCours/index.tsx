import { color } from "@/config/color";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useCallback, useMemo } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useCourses } from "@/hooks/useCourses";
import { useLessons } from "@/hooks/useLessons";
import { useVideos } from "@/hooks/useVideos";
import type { Course } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FILTER_TABS = ["Tous", "En cours", "Terminés"];

const LEVEL_LABEL = { beginner: "Débutant", intermediate: "Intermédiaire", expert: "Expert" };

const TAG_STYLES = {
  expert:       { bg: "rgba(255,214,107,0.28)", text: "#8A6200", dot: color.yellowDark },
  intermediate: { bg: "rgba(29,158,117,0.12)",  text: "#0F6E56", dot: "#1D9E75"       },
  beginner:     { bg: "rgba(181,212,244,0.4)",   text: "#185FA5", dot: "#3A8FD4"       },
};

function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}min`;
  return `${h}h${m > 0 ? ` ${m}min` : ""}`;
}

// ─── ActiveCourseCard ─────────────────────────────────────────────────────────

function ActiveCourseCard({
  course,
  totalLessons,
  completedLessons,
  progress,
  onPress,
}: {
  course: Course;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  onPress: () => void;
}) {
  const currentLesson = Math.min(completedLessons + 1, totalLessons);
  const [scaleAnim] = useState(() => new Animated.Value(1));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View style={[styles.heroCard, { transform: [{ scale: scaleAnim }] }]}>
        {course.image_url ? (
          <Image source={{ uri: course.image_url }} style={styles.heroImage} />
        ) : (
          <View style={[styles.heroImage, { backgroundColor: color.deepBlue }]} />
        )}

        <LinearGradient colors={["transparent", "rgba(14,43,69,0.85)"]} style={styles.heroOverlay} />

        <View style={styles.heroCategoryPill}>
          <Text style={styles.heroCategoryText}>{course.category?.title ?? "Cours"}</Text>
        </View>

        <View style={styles.heroPlayRing}>
          <View style={styles.heroPlayBtn}>
            <View style={styles.playTriangle} />
          </View>
        </View>

        <View style={styles.heroBottom}>
          <Text style={styles.heroInstructor}>{course.instructor}</Text>
          <Text style={styles.heroTitle}>{course.title}</Text>
          <View style={styles.heroProgressRow}>
            <View style={styles.heroProgressTrack}>
              <View style={[styles.heroProgressFill, { width: `${progress * 100}%` as any }]} />
            </View>
            <Text style={styles.heroProgressLabel}>{currentLesson}/{totalLessons} leçons</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── CourseStatsBar ───────────────────────────────────────────────────────────

function CourseStatsBar({
  total,
  inProgress,
  done,
  totalSeconds,
}: {
  total: number;
  inProgress: number;
  done: number;
  totalSeconds: number;
}) {
  const totalHours = Math.floor(totalSeconds / 3600);
  const stats = [
    { label: "Cours",    value: String(total)       },
    { label: "En cours", value: String(inProgress)  },
    { label: "Terminés", value: String(done)         },
    { label: "Heures",   value: `${totalHours}h`    },
  ] as const;

  return (
    <View style={styles.statsBar}>
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
          {i < stats.length - 1 && <View style={styles.statDivider} />}
        </React.Fragment>
      ))}
    </View>
  );
}

// ─── CourseListItem ───────────────────────────────────────────────────────────

function CourseListItem({
  course,
  index,
  progress,
  isComplete,
  isNotStarted,
  onPress,
}: {
  course: Course;
  index: number;
  progress: number;
  isComplete: boolean;
  isNotStarted: boolean;
  onPress: () => void;
}) {
  const [fadeAnim]   = useState(() => new Animated.Value(0));
  const [translateX] = useState(() => new Animated.Value(-18));
  const [scaleAnim]  = useState(() => new Animated.Value(1));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,   { toValue: 1, duration: 380, delay: 100 + index * 70, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 380, delay: 100 + index * 70, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, index, translateX]);

  const tagStyle = TAG_STYLES[course.tag_type];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View
        style={[
          styles.courseCard,
          isComplete && styles.courseCardDone,
          { opacity: fadeAnim, transform: [{ translateX }, { scale: scaleAnim }] },
        ]}
      >
        <View style={styles.courseThumbWrap}>
          {course.image_url ? (
            <Image source={{ uri: course.image_url }} style={styles.courseThumb} />
          ) : (
            <View style={[styles.courseThumb, { backgroundColor: color.deepBlue }]} />
          )}
          {isComplete && (
            <View style={styles.completedOverlay}>
              <Text style={styles.completedCheck}>✓</Text>
            </View>
          )}
        </View>

        <View style={styles.courseInfo}>
          <View style={styles.courseMetaRow}>
            <View style={[styles.tagPill, { backgroundColor: tagStyle.bg }]}>
              <View style={[styles.tagDot, { backgroundColor: tagStyle.dot }]} />
              <Text style={[styles.tagText, { color: tagStyle.text }]}>{LEVEL_LABEL[course.tag_type]}</Text>
            </View>
            <Text style={styles.courseCategory}>{course.category?.title ?? ""}</Text>
          </View>

          <Text numberOfLines={1} style={styles.courseTitle}>{course.title}</Text>
          <Text numberOfLines={1} style={styles.courseInstructor}>{course.instructor}</Text>

          {!isNotStarted ? (
            <View style={styles.courseProgressRow}>
              <View style={styles.courseProgressTrack}>
                <View style={[styles.courseProgressFill, isComplete && styles.courseProgressFillDone, { width: `${progress * 100}%` as any }]} />
              </View>
              <Text style={styles.courseProgressPct}>{Math.round(progress * 100)}%</Text>
            </View>
          ) : (
            <Text style={styles.notStartedLabel}>Pas encore commencé</Text>
          )}
        </View>

        <View style={styles.courseRight}>
          <Text style={styles.courseDuration}>{formatDuration(course.total_duration_seconds)}</Text>
          <View style={[styles.courseActionBtn, isComplete && styles.courseActionBtnDone]}>
            <Feather name={isComplete ? "refresh-cw" : "play"} size={13} color={isComplete ? color.softGray : "#fff"} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MesCoursScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState(0);

  const { courses } = useCourses();
  const { lessons } = useLessons();
  const { videoProgress } = useVideos();

  const getCourseLessons = useCallback(
    (courseId: string) => lessons.filter((l) => l.course_id === courseId),
    [lessons],
  );

  const getCourseProgress = useCallback(
    (courseId: string) => {
      const cls = getCourseLessons(courseId);
      if (cls.length === 0) return 0;
      const done = cls.filter((l) => (videoProgress[l.video_id]?.pct ?? 0) >= 0.9).length;
      return done / cls.length;
    },
    [getCourseLessons, videoProgress],
  );

  const isCourseDone = useCallback(
    (c: Course) => {
      const cls = getCourseLessons(c.id);
      return cls.length > 0 && cls.every((l) => (videoProgress[l.video_id]?.pct ?? 0) >= 0.9);
    },
    [getCourseLessons, videoProgress],
  );

  const isCourseStarted = useCallback(
    (c: Course) => getCourseLessons(c.id).some((l) => (videoProgress[l.video_id]?.pct ?? 0) > 0),
    [getCourseLessons, videoProgress],
  );

  const filteredCourses = useMemo(
    () =>
      courses.filter((c) => {
        if (activeFilter === 1) return isCourseStarted(c) && !isCourseDone(c);
        if (activeFilter === 2) return isCourseDone(c);
        return true;
      }),
    [courses, activeFilter, isCourseStarted, isCourseDone],
  );

  const activeCourse = useMemo(
    () => courses.find((c) => isCourseStarted(c) && !isCourseDone(c)) ?? null,
    [courses, isCourseStarted, isCourseDone],
  );

  const stats = useMemo(() => {
    const done = courses.filter(isCourseDone).length;
    const inProg = courses.filter((c) => isCourseStarted(c) && !isCourseDone(c)).length;
    const totalSec = courses.reduce((a, c) => a + (c.total_duration_seconds ?? 0), 0);
    return { total: courses.length, done, inProg, totalSec };
  }, [courses, isCourseDone, isCourseStarted]);

  function navigateToCourse(course: Course) {
    router.push(`/(protected)/categorie/parcoursScreen?courseId=${course.id}` as any);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={[color.bgGradientTop, color.bgGradientBottom]} style={styles.gradient}>

        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>Mon apprentissage</Text>
            <Text style={styles.headerTitle}>
              Mes cours <Text style={styles.headerTitleAccent}>& parcours</Text>
            </Text>
          </View>
          <Pressable style={styles.filterBtn}>
            <Feather name="sliders" size={18} color="#fff" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <CourseStatsBar
            total={stats.total}
            inProgress={stats.inProg}
            done={stats.done}
            totalSeconds={stats.totalSec}
          />

          {activeCourse && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionActiveDot} />
                  <Text style={styles.sectionTitle}>Continuer</Text>
                </View>
              </View>
              <ActiveCourseCard
                course={activeCourse}
                totalLessons={getCourseLessons(activeCourse.id).length}
                completedLessons={getCourseLessons(activeCourse.id).filter((l) => (videoProgress[l.video_id]?.pct ?? 0) >= 0.9).length}
                progress={getCourseProgress(activeCourse.id)}
                onPress={() => navigateToCourse(activeCourse)}
              />
            </View>
          )}

          <View style={styles.filterTabsWrap}>
            {FILTER_TABS.map((tab, i) => (
              <Pressable
                key={tab}
                style={[styles.filterTab, activeFilter === i && styles.filterTabActive]}
                onPress={() => setActiveFilter(i)}
              >
                <Text style={[styles.filterTabText, activeFilter === i && styles.filterTabTextActive]}>{tab}</Text>
                {activeFilter === i && <View style={styles.filterTabUnderline} />}
              </Pressable>
            ))}
          </View>

          <View style={styles.courseList}>
            {filteredCourses.map((course, index) => (
              <CourseListItem
                key={course.id}
                course={course}
                index={index}
                progress={getCourseProgress(course.id)}
                isComplete={isCourseDone(course)}
                isNotStarted={!isCourseStarted(course)}
                onPress={() => navigateToCourse(course)}
              />
            ))}
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgGradientTop },
  gradient:  { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    paddingHorizontal: 24, paddingTop: 12, marginBottom: 20,
  },
  headerEyebrow:     { fontSize: 12, color: color.softGray, marginBottom: 2, fontWeight: "600", letterSpacing: 1.2, textTransform: "uppercase" },
  headerTitle:       { fontSize: 27, fontWeight: "800", color: color.deepBlue, letterSpacing: -0.5 },
  headerTitleAccent: { fontStyle: "italic", color: "#1A5F9A", fontWeight: "700" },
  filterBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: color.deepBlue, justifyContent: "center", alignItems: "center", marginTop: 4 },

  statsBar: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 24, marginBottom: 24, backgroundColor: "#fff",
    borderRadius: 18, paddingVertical: 16, paddingHorizontal: 12,
    shadowColor: color.navy, shadowOpacity: 0.07, shadowOffset: { width: 0, height: 6 }, shadowRadius: 14, elevation: 3,
  },
  statItem:    { flex: 1, alignItems: "center", gap: 2 },
  statValue:   { fontSize: 20, fontWeight: "800", color: color.deepBlue, letterSpacing: -0.5 },
  statLabel:   { fontSize: 10, color: color.softGray, fontWeight: "600", letterSpacing: 0.3 },
  statDivider: { width: 1, height: 28, backgroundColor: "rgba(14,43,69,0.08)" },

  section: { marginBottom: 24 },
  sectionHeader:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 14 },
  sectionTitleRow:  { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionActiveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.yellowDark },
  sectionTitle:     { fontSize: 17, fontWeight: "700", color: color.deepBlue, letterSpacing: -0.3 },

  heroCard: { marginHorizontal: 24, height: 220, borderRadius: 22, overflow: "hidden", shadowColor: color.navy, shadowOpacity: 0.2, shadowOffset: { width: 0, height: 12 }, shadowRadius: 20, elevation: 8 },
  heroImage:        { width: "100%", height: "100%", resizeMode: "cover" },
  heroOverlay:      { position: "absolute", bottom: 0, left: 0, right: 0, height: "75%" },
  heroCategoryPill: { position: "absolute", top: 14, left: 14, backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  heroCategoryText: { color: "#fff", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  heroPlayRing:     { position: "absolute", top: "50%", right: 18, transform: [{ translateY: -22 }], width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: "rgba(255,255,255,0.5)", justifyContent: "center", alignItems: "center" },
  heroPlayBtn:      { width: 36, height: 36, borderRadius: 18, backgroundColor: color.yellow, justifyContent: "center", alignItems: "center" },
  playTriangle:     { width: 0, height: 0, borderTopWidth: 6, borderBottomWidth: 6, borderLeftWidth: 10, borderStyle: "solid", borderTopColor: "transparent", borderBottomColor: "transparent", borderLeftColor: color.deepBlue, marginLeft: 2 },
  heroBottom:         { position: "absolute", bottom: 0, left: 0, right: 0, padding: 16 },
  heroInstructor:     { fontSize: 11, color: "rgba(255,255,255,0.65)", marginBottom: 2 },
  heroTitle:          { fontSize: 18, fontWeight: "800", color: "#fff", marginBottom: 10, letterSpacing: -0.3 },
  heroProgressRow:    { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 5 },
  heroProgressTrack:  { flex: 1, height: 4, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 4, overflow: "hidden" },
  heroProgressFill:   { height: "100%", backgroundColor: color.yellow, borderRadius: 4 },
  heroProgressLabel:  { fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: "600" },

  filterTabsWrap:      { flexDirection: "row", paddingHorizontal: 24, marginBottom: 16, borderBottomWidth: 1.5, borderBottomColor: "rgba(14,43,69,0.07)" },
  filterTab:           { marginRight: 22, paddingBottom: 10, position: "relative", marginBottom: -1.5 },
  filterTabActive:     {},
  filterTabText:       { fontSize: 14, fontWeight: "600", color: color.softGray, paddingVertical: 4 },
  filterTabTextActive: { color: color.deepBlue },
  filterTabUnderline:  { position: "absolute", bottom: 0, left: 0, right: 0, height: 2.5, backgroundColor: color.yellowDark, borderRadius: 2 },

  courseList: { paddingHorizontal: 24, gap: 12 },
  courseCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 18, padding: 12, gap: 12,
    shadowColor: color.navy, shadowOpacity: 0.07, shadowOffset: { width: 0, height: 5 }, shadowRadius: 12, elevation: 3,
    borderWidth: 1, borderColor: "rgba(14,43,69,0.04)",
  },
  courseCardDone: { borderColor: "rgba(29,158,117,0.15)", backgroundColor: "#FAFFFE" },

  courseThumbWrap:  { width: 72, height: 72, borderRadius: 14, overflow: "hidden", flexShrink: 0, backgroundColor: color.paleBlue },
  courseThumb:      { width: "100%", height: "100%", resizeMode: "cover" },
  completedOverlay: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(29,158,117,0.55)", justifyContent: "center", alignItems: "center" },
  completedCheck:   { fontSize: 22, color: "#fff", fontWeight: "800" },

  courseInfo:      { flex: 1, minWidth: 0, gap: 3 },
  courseMetaRow:   { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 1 },
  tagPill:         { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagDot:          { width: 5, height: 5, borderRadius: 3 },
  tagText:         { fontSize: 10, fontWeight: "700" },
  courseCategory:  { fontSize: 11, color: color.softGray, fontWeight: "500" },
  courseTitle:     { fontSize: 14, fontWeight: "700", color: color.deepBlue, letterSpacing: -0.2 },
  courseInstructor:{ fontSize: 11, color: color.softGray },
  courseProgressRow:      { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 5 },
  courseProgressTrack:    { flex: 1, height: 4, backgroundColor: "rgba(14,43,69,0.08)", borderRadius: 4, overflow: "hidden" },
  courseProgressFill:     { height: "100%", backgroundColor: color.yellow, borderRadius: 4 },
  courseProgressFillDone: { backgroundColor: "#1D9E75" },
  courseProgressPct:      { fontSize: 10, fontWeight: "700", color: color.softGray, width: 30 },
  notStartedLabel:        { fontSize: 11, color: color.softGray, marginTop: 4, fontStyle: "italic" },

  courseRight:        { alignItems: "center", gap: 8, flexShrink: 0 },
  courseDuration:     { fontSize: 10, color: color.softGray, fontWeight: "600" },
  courseActionBtn:    { width: 32, height: 32, borderRadius: 10, backgroundColor: color.deepBlue, justifyContent: "center", alignItems: "center" },
  courseActionBtnDone:{ backgroundColor: color.paleBlue },
});
