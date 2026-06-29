import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { ParcoursContext } from "@/contexts/parcoursContext";
import { CourseContext } from "@/contexts/courseContext";
import { color, LEVELS } from "@/config/adminTheme";
import type { Parcours, Category, TagType } from "@/types";

type Instructor = { id: string; name: string };

export default function ModalView({
  visible,
  onClose,
  parcours,
}: {
  visible: boolean;
  onClose: () => void;
  parcours?: Parcours | null;
}) {
  const { saveParcours, isSaving } = useContext(ParcoursContext);
  const { courses } = useContext(CourseContext);
  const isEdit = !!parcours;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [level, setLevel] = useState<TagType>(LEVELS[0].value);
  const [durationHours, setDurationHours] = useState("0");
  const [durationMin, setDurationMin] = useState("0");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

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

  const { data: instructors = [] } = useQuery<Instructor[]>({
    queryKey: ["instructors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name")
        .in("role", ["professeur", "admin"])
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: linkedCourseIds = [] } = useQuery<string[]>({
    queryKey: ["parcours-courses", parcours?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parcours_courses")
        .select("course_id")
        .eq("parcours_id", parcours!.id)
        .order("order_index");
      if (error) throw error;
      return data.map((r: { course_id: string }) => r.course_id);
    },
    enabled: !!parcours,
  });

  useEffect(() => {
    if (!visible) return;
    if (parcours) {
      setTitle(parcours.title);
      setDescription(parcours.description ?? "");
      setCategoryId(parcours.category?.id ?? "");
      setInstructorId(parcours.instructor?.id ?? "");
      setLevel(parcours.tag_type);
      setCoverImage(null);
      const totalSec = parcours.total_duration_seconds;
      setDurationHours(String(Math.floor(totalSec / 3600)));
      setDurationMin(String(Math.floor((totalSec % 3600) / 60)));
    } else {
      reset();
    }
  }, [visible, parcours]);

  useEffect(() => {
    if (isEdit && linkedCourseIds.length > 0) {
      setSelectedCourseIds(linkedCourseIds);
    }
  }, [linkedCourseIds, isEdit]);

  function toggleCourse(id: string) {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

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

  function handleSubmit() {
    if (!title.trim()) {
      Alert.alert("Champ requis", "Le titre est obligatoire.");
      return;
    }
    const totalDurationSeconds =
      (parseInt(durationHours) || 0) * 3600 +
      (parseInt(durationMin) || 0) * 60;

    saveParcours({
      editId: isEdit ? parcours!.id : null,
      coverImageUri: coverImage,
      coverImageUrl: isEdit ? (parcours!.cover_image_url ?? "") : "",
      title,
      description,
      categoryId,
      instructorId,
      tagType: level,
      totalDurationSeconds,
      courseIds: selectedCourseIds,
    })
      .then(() => {
        reset();
        onClose();
      })
      .catch((err: Error) => Alert.alert("Erreur", err.message));
  }

  function reset() {
    setTitle("");
    setDescription("");
    setCategoryId("");
    setInstructorId("");
    setLevel(LEVELS[0].value);
    setDurationHours("0");
    setDurationMin("0");
    setCoverImage(null);
    setSelectedCourseIds([]);
  }

  function handleClose() {
    reset();
    onClose();
  }

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
              {isEdit ? "Modifier le parcours" : "Nouveau parcours"}
            </Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {isEdit ? parcours!.title : "Remplis les informations du parcours"}
            </Text>
          </View>
          <Pressable
            style={[styles.submitBtn, isSaving && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={color.navy} size="small" />
            ) : (
              <>
                <Ionicons
                  name={isEdit ? "save-outline" : "checkmark"}
                  size={15}
                  color={color.navy}
                />
                <Text style={styles.submitText}>
                  {isEdit ? "Enregistrer" : "Créer"}
                </Text>
              </>
            )}
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <Field label="Titre" required>
              <TextInput
                style={styles.input}
                placeholder="Ex : Chemin vers la guitare"
                placeholderTextColor={color.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </Field>

            <Field label="Description">
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Décris le parcours…"
                placeholderTextColor={color.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
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
                      <Picker.Item label="— Aucune —" value="" color={color.white} />
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

            <Field label="Instructeur">
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={instructorId}
                  onValueChange={(v) => setInstructorId(v as string)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="— Aucun —" value="" color={color.white} />
                  {instructors.map((u) => (
                    <Picker.Item
                      key={u.id}
                      label={u.name}
                      value={u.id}
                      color={color.white}
                    />
                  ))}
                </Picker>
              </View>
            </Field>

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
                    <Image source={{ uri: coverImage }} style={styles.imagePreview} />
                    <View style={styles.imageOverlay}>
                      <Ionicons name="camera-outline" size={20} color={color.white} />
                      <Text style={styles.imageOverlayText}>Changer</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.imageIconWrap}>
                      <Ionicons name="image-outline" size={28} color={color.navy} />
                    </View>
                    <Text style={styles.imagePickerTitle}>Choisir une image</Text>
                    <Text style={styles.imagePickerSub}>Format 16:9 recommandé</Text>
                  </>
                )}
              </Pressable>
            </Field>

            <Field label="Cours inclus">
              <Text style={styles.fieldHint}>
                {selectedCourseIds.length} cours sélectionné
                {selectedCourseIds.length !== 1 ? "s" : ""}
              </Text>
              <View style={styles.courseList}>
                {courses.map((course) => {
                  const selected = selectedCourseIds.includes(course.id);
                  return (
                    <Pressable
                      key={course.id}
                      style={[styles.courseRow, selected && styles.courseRowSelected]}
                      onPress={() => toggleCourse(course.id)}
                    >
                      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                        {selected && (
                          <Ionicons name="checkmark" size={12} color={color.white} />
                        )}
                      </View>
                      <View style={styles.courseRowInfo}>
                        <Text
                          style={[styles.courseRowTitle, selected && styles.courseRowTitleSelected]}
                          numberOfLines={1}
                        >
                          {course.title}
                        </Text>
                        <Text style={styles.courseRowMeta}>
                          {course.category
                            ? `${course.category.emoji} ${course.category.title}`
                            : "—"}
                          {" · "}
                          {course.instructor}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </Field>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

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
  submitBtn: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: color.yellow,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  submitText: { fontSize: 13, fontWeight: "700", color: color.navy },
  scrollContent: { padding: 20, gap: 20 },
  form: { gap: 16 },
  row: { flexDirection: "row", gap: 12 },
  field: { gap: 7 },
  fieldHint: { fontSize: 12, color: color.textMuted, marginBottom: 6 },
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
  inputMultiline: { height: 90, paddingTop: 13 },
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
  durationField: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
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
  imagePickerTitle: { fontSize: 14, fontWeight: "700", color: color.white },
  imagePickerSub: { fontSize: 12, color: color.yellow },
  courseList: { gap: 8 },
  courseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: color.card,
    borderWidth: 1.5,
    borderColor: color.border,
  },
  courseRowSelected: { borderColor: color.navy, backgroundColor: "#EEF4FA" },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: color.border,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  checkboxSelected: { backgroundColor: color.navy, borderColor: color.navy },
  courseRowInfo: { flex: 1 },
  courseRowTitle: { fontSize: 13.5, fontWeight: "600", color: color.textMuted },
  courseRowTitleSelected: { color: color.textPrimary },
  courseRowMeta: { fontSize: 11, color: color.textMuted, marginTop: 2 },
});
