import { color } from "@/config/color";
import { Course, MY_COURSES } from "@/data/mockData";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
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

function getProgress(course: Course) {
  return course.totalLessons === 0
    ? 0
    : course.completedLessons / course.totalLessons;
}

const STATUS_CONFIG = {
  en_cours: { label: "En cours", color: color.yellowDark, bg: "rgba(246,192,79,0.15)" },
  termine: { label: "Terminé", color: "#1D9E75", bg: "rgba(29,158,117,0.12)" },
  non_commence: { label: "À commencer", color: color.softGray, bg: "rgba(154,166,178,0.15)" },
};

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const course = MY_COURSES.find((c) => c.id === id);

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Cours introuvable</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const progress = getProgress(course);
  const statusConfig = STATUS_CONFIG[course.status];
  const isComplete = course.status === "termine";
  const isNotStarted = course.status === "non_commence";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Cover image ── */}
        <View style={styles.coverWrap}>
          <Image source={{ uri: course.image }} style={styles.coverImage} />
          <LinearGradient
            colors={["rgba(14,43,69,0.55)", "transparent", "rgba(14,43,69,0.75)"]}
            style={StyleSheet.absoluteFill}
          />

          {/* Back button */}
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#fff" />
          </Pressable>

          {/* Status pill */}
          <View style={[styles.statusPill, { backgroundColor: statusConfig.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* ── Content ── */}
        <View style={styles.content}>
          {/* Category */}
          <Text style={styles.category}>{course.category}</Text>

          {/* Title */}
          <Text style={styles.title}>{course.title}</Text>

          {/* Instructor */}
          <View style={styles.instructorRow}>
            <View style={styles.instructorAvatar}>
              <Feather name="user" size={14} color={color.softGray} />
            </View>
            <Text style={styles.instructorName}>{course.instructor}</Text>
          </View>

          {/* ── Stats row ── */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Feather name="book-open" size={16} color={color.deepBlue} />
              <Text style={styles.statValue}>{course.totalLessons}</Text>
              <Text style={styles.statLabel}>Leçons</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Feather name="clock" size={16} color={color.deepBlue} />
              <Text style={styles.statValue}>{course.duration}</Text>
              <Text style={styles.statLabel}>Durée</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Feather name="check-circle" size={16} color={color.deepBlue} />
              <Text style={styles.statValue}>{course.completedLessons}</Text>
              <Text style={styles.statLabel}>Terminées</Text>
            </View>
          </View>

          {/* ── Progress section ── */}
          {!isNotStarted && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Progression</Text>
                <Text style={styles.progressPct}>{Math.round(progress * 100)}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    isComplete && styles.progressFillDone,
                    { width: `${progress * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressSub}>
                {course.completedLessons} / {course.totalLessons} leçons complétées
              </Text>
              {course.lastWatched && (
                <Text style={styles.lastWatched}>Dernière activité : {course.lastWatched}</Text>
              )}
            </View>
          )}

          {/* ── CTA button ── */}
          <Pressable
            style={[
              styles.ctaBtn,
              isComplete && styles.ctaBtnDone,
              isNotStarted && styles.ctaBtnStart,
            ]}
          >
            <Feather
              name={isComplete ? "refresh-cw" : "play"}
              size={18}
              color={isComplete ? color.deepBlue : "#fff"}
            />
            <Text style={[styles.ctaBtnText, isComplete && styles.ctaBtnTextDone]}>
              {isComplete ? "Revoir le cours" : isNotStarted ? "Commencer" : "Continuer"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgGradientTop },
  scrollContent: { paddingBottom: 40 },

  // Cover
  coverWrap: { height: 300, width: "100%" },
  coverImage: { width: "100%", height: "100%", resizeMode: "cover" },
  backButton: {
    position: "absolute",
    top: 16,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(14,43,69,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  statusPill: {
    position: "absolute",
    bottom: 18,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: "700" },

  // Content
  content: { padding: 24 },
  category: {
    fontSize: 12,
    color: color.softGray,
    fontWeight: "600",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: color.deepBlue,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  instructorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  instructorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: color.paleBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  instructorName: { fontSize: 14, color: color.softGray, fontWeight: "500" },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 24,
    shadowColor: color.navy,
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  statBox: { flex: 1, alignItems: "center", gap: 4 },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: color.deepBlue,
    marginTop: 4,
  },
  statLabel: { fontSize: 10, color: color.softGray, fontWeight: "600" },
  statDivider: { width: 1, height: 36, backgroundColor: "rgba(14,43,69,0.08)" },

  // Progress
  progressSection: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    shadowColor: color.navy,
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressTitle: { fontSize: 14, fontWeight: "700", color: color.deepBlue },
  progressPct: { fontSize: 14, fontWeight: "800", color: color.yellowDark },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(14,43,69,0.08)",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: color.yellow,
    borderRadius: 8,
  },
  progressFillDone: { backgroundColor: "#1D9E75" },
  progressSub: { fontSize: 12, color: color.softGray },
  lastWatched: { fontSize: 11, color: color.softGray, marginTop: 4, fontStyle: "italic" },

  // CTA
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: color.deepBlue,
    borderRadius: 16,
    paddingVertical: 16,
  },
  ctaBtnDone: { backgroundColor: color.paleBlue },
  ctaBtnStart: { backgroundColor: "#1A5F9A" },
  ctaBtnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  ctaBtnTextDone: { color: color.deepBlue },

  // Not found
  notFound: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  notFoundText: { fontSize: 16, color: color.softGray },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: color.deepBlue,
    borderRadius: 12,
  },
  backBtnText: { color: "#fff", fontWeight: "700" },
});
