import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MY_COURSES } from "@/data/mockData";
import ModalView from "./modal";
import { color, TAG_STYLES } from "@/config/adminTheme";


const FILTERS = ["Tous", "Guitare", "Piano", "Saxophone", "Percussions", "Jazz"] as const;
type Filter = (typeof FILTERS)[number];

export default function GestionCours() {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>("Tous");

  const filtered = activeFilter === "Tous"
    ? MY_COURSES
    : MY_COURSES.filter((c) => c.category === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <LinearGradient colors={[color.navyDeep, color.navy]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerEyebrow}>Administration</Text>
            <Text style={styles.headerTitle}>Gestion des cours</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{MY_COURSES.length}</Text>
              <Text style={styles.countLabel}>cours</Text>
            </View>
            <Pressable style={styles.addBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={22} color={color.navy} />
              <Text style={styles.addBtnText}>Ajouter</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Filters ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {FILTERS.map((f) => (
            <Pressable key={f} style={[styles.filterChip, activeFilter === f && styles.filterChipActive]} onPress={() => setActiveFilter(f)}>
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Course list ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes cours</Text>
          <Text style={styles.sectionCount}>{filtered.length} au total</Text>
        </View>

        <View style={styles.listWrap}>
          {filtered.map((course, i) => {
            const tag = TAG_STYLES[course.tagType] ?? TAG_STYLES.beginner;
            return (
              <View key={course.id} style={[styles.courseCard, i < filtered.length - 1 && styles.courseCardBorder]}>
                <Image source={{ uri: course.image }} style={styles.thumbnail} />
                <View style={styles.courseInfo}>
                  <View style={styles.courseTopRow}>
                    <Text style={styles.courseTitle} numberOfLines={1}>{course.title}</Text>
                    <View style={[styles.tagBadge, { backgroundColor: tag.bg }]}>
                      <Text style={[styles.tagText, { color: tag.text }]}>{course.tag}</Text>
                    </View>
                  </View>
                  <Text style={styles.courseInstructor}>
                    <Ionicons name="person-outline" size={11} color={color.textMuted} /> {course.instructor}
                  </Text>
                  <View style={styles.courseMeta}>
                    <Ionicons name="musical-notes-outline" size={11} color={color.textMuted} />
                    <Text style={styles.courseMetaText}>{course.category}</Text>
                    <View style={styles.metaDot} />
                    <Ionicons name="time-outline" size={11} color={color.textMuted} />
                    <Text style={styles.courseMetaText}>{course.duration}</Text>
                  </View>
                </View>
                <View style={styles.actions}>
                  <Pressable style={[styles.actionBtn, { backgroundColor: "#E9F2FF" }]}>
                    <Ionicons name="create-outline" size={16} color="#1E88E5" />
                  </Pressable>
                  <Pressable style={[styles.actionBtn, { backgroundColor: "#FFE7E7" }]}>
                    <Ionicons name="trash-outline" size={16} color={color.red} />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <ModalView visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 22, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerEyebrow: { fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: "500", marginBottom: 2 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: color.white, letterSpacing: -0.4 },
  headerRight: { alignItems: "flex-end", gap: 10 },
  countBadge: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, alignItems: "center" },
  countText: { fontSize: 24, fontWeight: "800", color: color.white },
  countLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: color.yellow, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  addBtnText: { fontSize: 13, fontWeight: "700", color: color.navy },

  scrollContent: { paddingTop: 8 },
  filtersRow: { paddingHorizontal: 20, paddingVertical: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: color.card, borderWidth: 1.5, borderColor: color.border },
  filterChipActive: { backgroundColor: color.navy, borderColor: color.navy },
  filterText: { fontSize: 13, fontWeight: "600", color: color.textMuted },
  filterTextActive: { color: color.white },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: color.textPrimary, letterSpacing: -0.3 },
  sectionCount: { fontSize: 12, color: color.textMuted, fontWeight: "500" },

  listWrap: { marginHorizontal: 20, backgroundColor: color.card, borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
  courseCard: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  courseCardBorder: { borderBottomWidth: 1, borderBottomColor: color.border },
  thumbnail: { width: 64, height: 64, borderRadius: 12, flexShrink: 0 },
  courseInfo: { flex: 1, gap: 4 },
  courseTopRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  courseTitle: { flex: 1, fontSize: 13.5, fontWeight: "700", color: color.textPrimary },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 10, fontWeight: "700" },
  courseInstructor: { fontSize: 12, color: color.textMuted },
  courseMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  courseMetaText: { fontSize: 11, color: color.textMuted },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: color.border },
  actions: { flexDirection: "column", gap: 6 },
  actionBtn: { width: 32, height: 32, borderRadius: 10, justifyContent: "center", alignItems: "center" },
});
