import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CourseContext } from "@/contexts/courseContext";
import { LessonContext } from "@/contexts/lessonContext";
import { VideoContext } from "@/contexts/videoContext";
import { supabase } from "@/utils/supabase";
import { color, LEVELS } from "@/config/adminTheme";
import type { Course, Category, TagType, LessonDraft, Video } from "@/types";

export default function ModalView({
  visible,
  onClose,
  course,
}: {
  visible: boolean;
  onClose: () => void;
  course?: Course | null;
}) {
  const { saveCourse, isSaving } = useContext(CourseContext);
  const { lessons: allLessons, saveLessons, isSavingLessons } = useContext(LessonContext);
  const { videos: rawVideos } = useContext(VideoContext);
  const videos = [...rawVideos].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
  const isEdit = !!course;

  // ── Course fields ────────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState<TagType>(LEVELS[0].value);
  const [durationHours, setDurationHours] = useState("0");
  const [durationMin, setDurationMin] = useState("0");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // ── Lesson drafts ────────────────────────────────────────────────────────────
  const [lessonDrafts, setLessonDrafts] = useState<LessonDraft[]>([]);
  const [deletedLessonIds, setDeletedLessonIds] = useState<string[]>([]);
  const [videoSearch, setVideoSearch] = useState("");

  useEffect(() => {
    if (!visible) return;
    if (course) {
      setTitle(course.title);
      setInstructor(course.instructor);
      setCategoryId(course.category?.id ?? "");
      setLevel(course.tag_type);
      setCoverImage(null);
      const totalSec = course.total_duration_seconds;
      setDurationHours(String(Math.floor(totalSec / 3600)));
      setDurationMin(String(Math.floor((totalSec % 3600) / 60)));
      // Load existing lessons for this course
      const existing = allLessons
        .filter((l) => l.course_id === course.id)
        .sort((a, b) => a.index - b.index)
        .map((l) => ({
          id: l.id,
          title: l.title,
          video_id: l.video_id,
          index: l.index,
          duration_seconds: l.duration_seconds,
        }));
      setLessonDrafts(existing);
      setDeletedLessonIds([]);
    } else {
      reset();
    }
  }, [visible, course, allLessons]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, title, emoji")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Autorise l'accès à ta galerie pour choisir une image.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
  }

  // ── Lesson helpers ────────────────────────────────────────────────────────────

  function toggleVideo(video: Video) {
    const draftIdx = lessonDrafts.findIndex((d) => d.video_id === video.id);
    if (draftIdx !== -1) {
      const draft = lessonDrafts[draftIdx];
      if (draft.id) setDeletedLessonIds((prev) => [...prev, draft.id!]);
      setLessonDrafts((prev) => prev.filter((_, i) => i !== draftIdx));
    } else {
      setLessonDrafts((prev) => [
        ...prev,
        { title: video.title, video_id: video.id, index: prev.length + 1, duration_seconds: video.duration_seconds },
      ]);
    }
  }

  function moveLessonUp(idx: number) {
    if (idx === 0) return;
    setLessonDrafts((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  function moveLessonDown(idx: number) {
    setLessonDrafts((prev) => {
      if (idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }

  // ── Submit ────────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert("Champ requis", "Le titre est obligatoire.");
      return;
    }
    if (!instructor.trim()) {
      Alert.alert("Champ requis", "L'instructeur est obligatoire.");
      return;
    }
    const invalidLesson = lessonDrafts.find((d) => !d.video_id);
    if (invalidLesson) {
      Alert.alert("Leçon incomplète", "Chaque leçon doit avoir une vidéo associée.");
      return;
    }

    const totalDurationSeconds =
      (parseInt(durationHours) || 0) * 3600 + (parseInt(durationMin) || 0) * 60;

    try {
      const savedCourse = await saveCourse({
        editId: isEdit ? course!.id : null,
        imageUri: coverImage,
        imageUrl: isEdit ? (course!.image_url ?? "") : "",
        title,
        instructor,
        categoryId,
        tagType: level,
        totalDurationSeconds,
      });

      await saveLessons(savedCourse.id, lessonDrafts, deletedLessonIds);
      reset();
      onClose();
    } catch (err: unknown) {
      Alert.alert("Erreur", (err as Error).message);
    }
  }

  function reset() {
    setTitle("");
    setInstructor("");
    setCategoryId("");
    setLevel(LEVELS[0].value);
    setDurationHours("0");
    setDurationMin("0");
    setCoverImage(null);
    setLessonDrafts([]);
    setDeletedLessonIds([]);
    setVideoSearch("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  const isBusy = isSaving || isSavingLessons;

  const barAnim = useRef(new Animated.Value(-80)).current;
  useEffect(() => {
    if (!isBusy) { barAnim.setValue(-80); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(barAnim, { toValue: 80, duration: 700, useNativeDriver: true }),
        Animated.timing(barAnim, { toValue: -80, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isBusy, barAnim]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <Ionicons name="close" size={20} color={color.red} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {isEdit ? "Modifier le cours" : "Nouveau cours"}
            </Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {isEdit ? course!.title : "Remplis les informations du cours"}
            </Text>
          </View>
          <Pressable
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={isBusy}
          >
            <View style={styles.submitBtnInner}>
              <Ionicons
                name={isBusy ? "checkmark-circle-outline" : isEdit ? "save-outline" : "checkmark"}
                size={15}
                color={color.navy}
              />
              <Text style={styles.submitText}>
                {isEdit ? "Enregistrer" : "Créer"}
              </Text>
            </View>
            {isBusy && (
              <View style={styles.savingBarTrack}>
                <Animated.View
                  style={[styles.savingBarFill, { transform: [{ translateX: barAnim }] }]}
                />
              </View>
            )}
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Course info ─────────────────────────────────────────────────── */}
          <View style={styles.form}>
            <Field label="Titre" required>
              <TextInput
                style={styles.input}
                placeholder="Ex : Fingerstyle acoustique"
                placeholderTextColor={color.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </Field>

            <Field label="Instructeur" required>
              <TextInput
                style={styles.input}
                placeholder="Ex : Marc Dupont"
                placeholderTextColor={color.textMuted}
                value={instructor}
                onChangeText={setInstructor}
              />
            </Field>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Field label="Catégorie">
                  <View style={styles.pickerWrap}>
                    <Picker
                      selectedValue={categoryId}
                      onValueChange={(v) => setCategoryId(v as string)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      <Picker.Item
                        label="— Aucune —"
                        value=""
                        color={color.white}
                      />
                      {categories.map((c) => (
                        <Picker.Item
                          key={c.id}
                          label={`${c.emoji} ${c.title}`}
                          value={c.id}
                          color={color.white}
                        />
                      ))}
                    </Picker>
                  </View>
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Niveau">
                  <View style={styles.pickerWrap}>
                    <Picker
                      selectedValue={level}
                      onValueChange={(v) => setLevel(v as TagType)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      {LEVELS.map((l) => (
                        <Picker.Item
                          key={l.value}
                          label={l.label}
                          value={l.value}
                          color={color.white}
                        />
                      ))}
                    </Picker>
                  </View>
                </Field>
              </View>
            </View>

            <Field label="Durée totale">
              <View style={styles.durationRow}>
                <View style={styles.durationField}>
                  <TextInput
                    style={[styles.input, styles.durationInput]}
                    placeholder="0"
                    placeholderTextColor={color.textMuted}
                    value={durationHours}
                    onChangeText={setDurationHours}
                    keyboardType="number-pad"
                  />
                  <Text style={styles.durationUnit}>h</Text>
                </View>
                <View style={styles.durationField}>
                  <TextInput
                    style={[styles.input, styles.durationInput]}
                    placeholder="0"
                    placeholderTextColor={color.textMuted}
                    value={durationMin}
                    onChangeText={setDurationMin}
                    keyboardType="number-pad"
                  />
                  <Text style={styles.durationUnit}>min</Text>
                </View>
              </View>
            </Field>

            <Field label="Image de couverture">
              <Pressable style={styles.imagePicker} onPress={pickImage}>
                {coverImage ? (
                  <>
                    <Image
                      source={{ uri: coverImage }}
                      style={styles.imagePreview}
                    />
                    <View style={styles.imageOverlay}>
                      <Ionicons
                        name="camera-outline"
                        size={20}
                        color={color.white}
                      />
                      <Text style={styles.imageOverlayText}>Changer</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.imageIconWrap}>
                      <Ionicons
                        name="image-outline"
                        size={28}
                        color={color.navy}
                      />
                    </View>
                    <Text style={styles.imagePickerTitle}>
                      Choisir une image
                    </Text>
                    <Text style={styles.imagePickerSub}>
                      Format 16:9 recommandé
                    </Text>
                  </>
                )}
              </Pressable>
            </Field>
          </View>

          {/* ── Lessons ─────────────────────────────────────────────────────── */}
          <View style={styles.lessonsSection}>
            <View style={styles.lessonsSectionHeader}>
              <Text style={styles.lessonsSectionTitle}>Vidéos</Text>
              {lessonDrafts.length > 0 && (
                <View style={styles.lessonCountBadge}>
                  <Text style={styles.lessonCountText}>{lessonDrafts.length}</Text>
                </View>
              )}
            </View>

            {videos.length > 0 && (
              <View style={styles.searchWrap}>
                <Ionicons name="search-outline" size={15} color={color.textMuted} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher une vidéo…"
                  placeholderTextColor={color.textMuted}
                  value={videoSearch}
                  onChangeText={setVideoSearch}
                  clearButtonMode="while-editing"
                />
              </View>
            )}

            {videos.length === 0 ? (
              <View style={styles.emptyLessons}>
                <Ionicons name="film-outline" size={32} color={color.textMuted} />
                <Text style={styles.emptyLessonsText}>Aucune vidéo disponible</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.videoList}
                contentContainerStyle={styles.videoListContent}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {videos
                  .filter((v) =>
                    videoSearch.trim() === "" ||
                    v.title.toLowerCase().includes(videoSearch.trim().toLowerCase()),
                  )
                  .map((video) => {
                    const draftIdx = lessonDrafts.findIndex((d) => d.video_id === video.id);
                    const isSelected = draftIdx !== -1;
                    return (
                      <Pressable
                        key={video.id}
                        style={[styles.videoCheckRow, isSelected && styles.videoCheckRowSelected]}
                        onPress={() => toggleVideo(video)}
                      >
                        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                          {isSelected && <Ionicons name="checkmark" size={12} color="#fff" />}
                        </View>
                        <Text
                          style={[styles.videoCheckTitle, isSelected && styles.videoCheckTitleSelected]}
                          numberOfLines={1}
                        >
                          {video.title}
                        </Text>
                        {isSelected && (
                          <View style={styles.lessonOrderInline}>
                            <Pressable
                              onPress={() => moveLessonUp(draftIdx)}
                              disabled={draftIdx === 0}
                              style={[styles.moveBtn, draftIdx === 0 && { opacity: 0.25 }]}
                            >
                              <Ionicons name="chevron-up" size={12} color={color.textPrimary} />
                            </Pressable>
                            <View style={styles.indexBadge}>
                              <Text style={styles.indexBadgeText}>{draftIdx + 1}</Text>
                            </View>
                            <Pressable
                              onPress={() => moveLessonDown(draftIdx)}
                              disabled={draftIdx === lessonDrafts.length - 1}
                              style={[styles.moveBtn, draftIdx === lessonDrafts.length - 1 && { opacity: 0.25 }]}
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

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {children}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: color.textPrimary,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  headerSub: {
    fontSize: 12,
    color: color.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: color.redLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.red,
  },
  scrollContent: { padding: 20, gap: 24 },
  form: { gap: 16 },
  row: { flexDirection: "row", gap: 12 },
  field: { gap: 7 },
  label: { fontSize: 13, fontWeight: "700", color: color.textPrimary },
  required: { color: color.red },
  input: {
    backgroundColor: color.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: color.textPrimary,
    borderWidth: 1,
    borderColor: color.border,
  },
  pickerWrap: {
    backgroundColor: color.deepBlue,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.border,
    overflow: "hidden",
  },
  picker: { color: color.white },
  pickerItem: {
    color: color.white,
    backgroundColor: color.deepBlue,
    fontSize: 14,
  },
  durationRow: { flexDirection: "row", gap: 12 },
  durationField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  durationInput: { flex: 1 },
  durationUnit: { fontSize: 13, fontWeight: "600", color: color.textMuted },
  imagePicker: {
    height: 160,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: color.border,
    borderStyle: "dashed",
    backgroundColor: color.deepBlue,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imagePreview: { width: "100%", height: "100%", resizeMode: "cover" },
  imageOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageOverlayText: { fontSize: 12, fontWeight: "600", color: color.white },
  imageIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#E9F2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: color.white,
  },
  imagePickerSub: { fontSize: 12, color: color.yellow },
  submitBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: color.yellow,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    gap: 4,
  },
  submitBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  savingBarTrack: {
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(14,43,69,0.15)",
    overflow: "hidden",
  },
  savingBarFill: {
    width: 40,
    height: "100%",
    borderRadius: 2,
    backgroundColor: color.navy,
  },
  submitText: { fontSize: 13, fontWeight: "700", color: color.navy },

  // Lessons section
  lessonsSection: { gap: 8 },
  videoList: {
    maxHeight: 320,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.card,
  },
  videoListContent: { gap: 1, padding: 4 },
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
  searchIcon: { flexShrink: 0 },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: color.textPrimary,
  },
  lessonsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  lessonsSectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: color.textPrimary,
    letterSpacing: -0.2,
  },
  lessonCountBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: color.deepBlue,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  lessonCountText: { fontSize: 11, fontWeight: "700", color: color.white },
  emptyLessons: {
    alignItems: "center",
    paddingVertical: 28,
    backgroundColor: color.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: color.border,
    gap: 6,
  },
  emptyLessonsText: { fontSize: 14, fontWeight: "700", color: color.textPrimary },

  // Video checkbox rows
  videoCheckRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: color.card,
  },
  videoCheckRowSelected: {
    backgroundColor: "rgba(14,43,69,0.06)",
  },
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
  checkboxSelected: {
    backgroundColor: color.deepBlue,
    borderColor: color.deepBlue,
  },
  videoCheckTitle: {
    flex: 1,
    fontSize: 13,
    color: color.textMuted,
  },
  videoCheckTitleSelected: {
    color: color.textPrimary,
    fontWeight: "600",
  },
  lessonOrderInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
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
