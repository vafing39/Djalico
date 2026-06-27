import React, { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Course, CourseContext } from "@/contexts/courseContext";
import AdminHeader from "@/components/AdminHeader";
import AdminListCard from "@/components/AdminListCard";
import ModalView from "./modal";
import { color } from "@/config/adminTheme";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
}

const LEVELS = [
  { key: "all", label: "Tous" },
  { key: "beginner", label: "Débutant" },
  { key: "intermediate", label: "Intermédiaire" },
  { key: "expert", label: "Expert" },
] as const;
type LevelKey = (typeof LEVELS)[number]["key"];

export default function GestionCours() {
  const { courses, isLoading, error, deleteCourse } = useContext(CourseContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [activeFilter, setActiveFilter] = useState<LevelKey>("all");

  function openAdd() {
    setEditingCourse(null);
    setModalVisible(true);
  }

  function openEdit(course: Course) {
    setEditingCourse(course);
    setModalVisible(true);
  }

  function handleDelete(course: Course) {
    Alert.alert(
      "Supprimer le cours",
      `Voulez-vous vraiment supprimer « ${course.title} » ? Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () =>
            deleteCourse(course.id).catch((err: Error) =>
              Alert.alert("Erreur", err.message),
            ),
        },
      ],
    );
  }

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? courses
        : courses.filter((c) => c.tag_type === activeFilter),
    [courses, activeFilter],
  );

  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader
        title="Gestion des cours"
        count={courses.length}
        countLabel="cours"
        onAdd={openAdd}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Filters ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {LEVELS.map((f) => (
            <Pressable
              key={f.key}
              style={[
                styles.filterChip,
                activeFilter === f.key && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(f.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f.key && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Course list ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes cours</Text>
          <Text style={styles.sectionCount}>{filtered.length} au total</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={color.navy}
            style={{ marginTop: 40 }}
          />
        ) : error ? (
          <Text style={styles.errorText}>Erreur de chargement des cours</Text>
        ) : filtered.length === 0 ? (
          <Text style={styles.emptyText}>Aucun cours trouvé</Text>
        ) : (
          <View style={styles.listWrap}>
            {filtered.map((course, i) => (
              <AdminListCard
                key={course.id}
                imageUrl={course.image_url}
                title={course.title}
                tagType={course.tag_type}
                instructor={course.instructor}
                metaIcon="musical-notes-outline"
                metaText={`${course.category ? `${course.category.emoji} ${course.category.title}` : "—"} · ${formatDuration(course.total_duration_seconds)}`}
                showBorder={i < filtered.length - 1}
                onEdit={() => openEdit(course)}
                onDelete={() => handleDelete(course)}
              />
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <ModalView
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        course={editingCourse}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
  scrollContent: { paddingTop: 8 },
  filtersRow: { paddingHorizontal: 20, paddingVertical: 16, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: color.card,
    borderWidth: 1.5,
    borderColor: color.border,
  },
  filterChipActive: { backgroundColor: color.navy, borderColor: color.navy },
  filterText: { fontSize: 13, fontWeight: "600", color: color.textMuted },
  filterTextActive: { color: color.white },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: color.textPrimary,
    letterSpacing: -0.3,
  },
  sectionCount: { fontSize: 12, color: color.textMuted, fontWeight: "500" },
  listWrap: {
    marginHorizontal: 20,
    backgroundColor: color.card,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  errorText: {
    textAlign: "center",
    marginTop: 40,
    color: color.red,
    fontSize: 14,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: color.textMuted,
    fontSize: 14,
    fontWeight: "500",
  },
});
