import { color } from "@/config/color";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useEffect, useState } from "react";
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

type LessonStatus = "done" | "current" | "locked";

interface Lesson {
  id: string;
  index: number;
  title: string;
  duration: string;
  status: LessonStatus;
  preview?: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PARCOURS = {
  id: "p1",
  title: "Chemin vers la guitare",
  instructor: "Marc Dupont",
  instructorAvatar:
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=60",
  tag: "Expert",
  tagType: "expert" as const,
  totalLessons: 18,
  completedLessons: 7,
  totalDuration: "6h 45min",
  category: "Guitare",
  description:
    "Un parcours complet pour maîtriser la guitare acoustique, des bases aux techniques avancées de fingerstyle et d'improvisation.",
  coverImage:
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=60",
  modules: [
    {
      id: "m1",
      title: "Les fondamentaux",
      lessons: [
        {
          id: "l1",
          index: 1,
          title: "Posture & prise en main",
          duration: "12 min",
          status: "done" as LessonStatus,
        },
        {
          id: "l2",
          index: 2,
          title: "Premiers accords ouverts",
          duration: "18 min",
          status: "done" as LessonStatus,
        },
        {
          id: "l3",
          index: 3,
          title: "Changer d'accord fluidement",
          duration: "22 min",
          status: "done" as LessonStatus,
        },
        {
          id: "l4",
          index: 4,
          title: "Strumming & rythme de base",
          duration: "15 min",
          status: "done" as LessonStatus,
        },
      ],
    },
    {
      id: "m2",
      title: "Technique & expressivité",
      lessons: [
        {
          id: "l5",
          index: 5,
          title: "Introduction au fingerpicking",
          duration: "25 min",
          status: "done" as LessonStatus,
        },
        {
          id: "l6",
          index: 6,
          title: "Gammes pentatoniques",
          duration: "20 min",
          status: "done" as LessonStatus,
        },
        {
          id: "l7",
          index: 7,
          title: "Bends, slides & vibratos",
          duration: "28 min",
          status: "done" as LessonStatus,
        },
        {
          id: "l8",
          index: 8,
          title: "Improvisation guidée",
          duration: "35 min",
          status: "current" as LessonStatus,
        },
      ],
    },
    {
      id: "m3",
      title: "Styles avancés",
      lessons: [
        {
          id: "l9",
          index: 9,
          title: "Fingerstyle acoustique",
          duration: "32 min",
          status: "locked" as LessonStatus,
        },
        {
          id: "l10",
          index: 10,
          title: "Intro au jazz manouche",
          duration: "40 min",
          status: "locked" as LessonStatus,
        },
        {
          id: "l11",
          index: 11,
          title: "Arpèges & patterns avancés",
          duration: "30 min",
          status: "locked" as LessonStatus,
        },
        {
          id: "l12",
          index: 12,
          title: "Composition fingerstyle",
          duration: "45 min",
          status: "locked" as LessonStatus,
        },
      ],
    },
    {
      id: "m4",
      title: "Projet final",
      lessons: [
        {
          id: "l13",
          index: 13,
          title: "Analyse d'un morceau complet",
          duration: "38 min",
          status: "locked" as LessonStatus,
        },
        {
          id: "l14",
          index: 14,
          title: "Enregistrement & retour",
          duration: "20 min",
          status: "locked" as LessonStatus,
        },
      ],
    },
  ] as Module[],
};

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

// ─── Circular progress ────────────────────────────────────────────────────────

function CircularProgress({
  progress,
  size = 56,
}: {
  progress: number;
  size?: number;
}) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const strokeDash = circ * progress;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {/* SVG-like via View trick: use a ring */}
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
      {/* Filled arc approximation using rotation */}
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
          inset: 0,
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
}: {
  lesson: Lesson;
  animDelay: number;
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
  }, []);

  const isCurrent = lesson.status === "current";
  const isDone = lesson.status === "done";
  const isLocked = lesson.status === "locked";

  return (
    <Pressable
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
        {/* Index / status icon */}
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
          ) : (
            <Feather name="lock" size={11} color="rgba(14,43,69,0.3)" />
          )}
        </View>

        {/* Connector line (not last) */}
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

        {/* Right action */}
        {!isLocked && (
          <View
            style={[
              styles.lessonAction,
              isDone && styles.lessonActionDone,
              isCurrent && styles.lessonActionCurrent,
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

// ─── Module block ─────────────────────────────────────────────────────────────

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
      {/* Module header */}
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

      {/* Lessons */}
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
  const p = PARCOURS;
  const progress = p.completedLessons / p.totalLessons;
  const tagStyle = TAG_STYLES[p.tagType];

  // Compute global lesson offset per module for staggered animation
  let offset = 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero cover ── */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: p.coverImage }} style={styles.heroImage} />
          <LinearGradient
            colors={["rgba(14,43,69,0.15)", "rgba(14,43,69,0.78)"]}
            style={styles.heroGradient}
          />

          {/* Back button */}
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={18} color="#fff" />
          </Pressable>

          {/* Tag */}
          <View style={[styles.heroTag, { backgroundColor: tagStyle.bg }]}>
            <View style={[styles.tagDot, { backgroundColor: tagStyle.dot }]} />
            <Text style={[styles.heroTagText, { color: tagStyle.text }]}>
              {p.tag}
            </Text>
          </View>

          {/* Hero bottom */}
          <View style={styles.heroBottom}>
            <Text style={styles.heroCategory}>{p.category}</Text>
            <Text style={styles.heroTitle}>{p.title}</Text>

            {/* Instructor row */}
            <View style={styles.heroInstructorRow}>
              <Image
                source={{ uri: p.instructorAvatar }}
                style={styles.avatar}
              />
              <Text style={styles.heroInstructor}>{p.instructor}</Text>
            </View>

            {/* Stats row */}
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Feather
                  name="play-circle"
                  size={12}
                  color="rgba(255,255,255,0.7)"
                />
                <Text style={styles.heroStatText}>{p.totalLessons} leçons</Text>
              </View>
              <View style={styles.heroStatDot} />
              <View style={styles.heroStat}>
                <Feather name="clock" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.heroStatText}>{p.totalDuration}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Progress card ── */}
        <View style={styles.progressCard}>
          <CircularProgress progress={progress} size={60} />
          <View style={styles.progressCardInfo}>
            <Text style={styles.progressCardTitle}>Ta progression</Text>
            <Text style={styles.progressCardSub}>
              {p.completedLessons} leçons sur {p.totalLessons} terminées
            </Text>
            {/* Linear bar */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress * 100}%` },
                ]}
              />
            </View>
          </View>
          <Pressable style={styles.resumeBtn}>
            <Text style={styles.resumeBtnText}>Reprendre</Text>
            <View style={styles.resumePlay}>
              <View style={styles.playTriangleTiny} />
            </View>
          </Pressable>
        </View>

        {/* ── Description ── */}
        <View style={styles.descSection}>
          <Text style={styles.descText}>{p.description}</Text>
        </View>

        {/* ── Modules & lessons ── */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>Contenu du parcours</Text>

          {p.modules.map((module) => {
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
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgGradientTop },
  scrollContent: { paddingBottom: 20 },

  // Hero
  heroWrap: { height: 300, position: "relative" },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  heroGradient: { position: "absolute", inset: 0 },
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

  // Progress card
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

  // Description
  descSection: { paddingHorizontal: 24, paddingTop: 22, paddingBottom: 4 },
  descText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: color.softGray,
    fontWeight: "400",
  },

  // Modules
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

  // Lesson row
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

  // Icon circle
  lessonIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(14,43,69,0.12)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
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

  // Connector line (vertical, purely decorative spacing)
  lessonConnectorWrap: { display: "none" }, // hidden — using padding spacing instead
  lessonConnector: {},
  connectorDone: {},
  connectorCurrent: {},

  // Content
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

  // Action button
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
});
