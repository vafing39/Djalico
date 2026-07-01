import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ModalHeader from "@/components/admin/ModalHeader";
import CategoryLevelPickers from "@/components/admin/CategoryLevelPickers";
import CoverImagePicker from "@/components/admin/CoverImagePicker";
import DurationField from "@/components/admin/DurationField";
import FormField from "@/components/admin/FormField";
import PickerField from "@/components/admin/PickerField";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { ParcoursContext } from "@/contexts/parcoursContext";
import { CourseContext } from "@/contexts/courseContext";
import { color, LEVELS } from "@/config/adminTheme";
import { useLanguage } from "@/hooks/useLanguage";
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
  const { t } = useLanguage();
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



  function handleSubmit() {
    if (!title.trim()) {
      Alert.alert(t("settings.alert.requiredField"), t("admin.form.titleRequired"));
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
      .catch((err: Error) => Alert.alert(t("common.error"), err.message));
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
        <ModalHeader
          title={isEdit ? t("admin.modals.parcours.editTitle") : t("admin.modals.parcours.addTitle")}
          subtitle={isEdit ? parcours!.title : t("admin.modals.parcours.newSubtitle")}
          isBusy={isSaving}
          submitLabel={isEdit ? t("common.save") : t("admin.form.create")}
          submitIcon={isEdit ? "save-outline" : "checkmark"}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <FormField
              label={t("admin.form.title")}
              required
              value={title}
              onChangeText={setTitle}
              placeholder={t("admin.modals.parcours.titlePlaceholder")}
            />

            <FormField
              label={t("admin.modals.parcours.description")}
              value={description}
              onChangeText={setDescription}
              placeholder={t("admin.modals.parcours.descriptionPlaceholder")}
              multiline
            />

            <CategoryLevelPickers
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              categories={categories}
              level={level}
              setLevel={setLevel}
            />

            <PickerField
              label={t("admin.modals.course.instructor")}
              selectedValue={instructorId}
              onValueChange={setInstructorId}
              placeholder={t("admin.form.none")}
              items={instructors.map((u) => ({ label: u.name, value: u.id }))}
            />

            <DurationField
              fields={[
                { value: durationHours, onChange: setDurationHours, unit: "h" },
                { value: durationMin, onChange: setDurationMin, unit: "min" },
              ]}
            />

            <CoverImagePicker coverImage={coverImage} setCoverImage={setCoverImage} />

            <View style={styles.field}>
              <Text style={styles.sectionLabel}>{t("admin.modals.parcours.coursesIncluded")}</Text>
              <Text style={styles.fieldHint}>
                {t(
                  selectedCourseIds.length === 1
                    ? "admin.modals.parcours.courseSelected"
                    : "admin.modals.parcours.courseSelectedPlural",
                  { n: selectedCourseIds.length },
                )}
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
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
  scrollContent: { padding: 20, gap: 20 },
  form: { gap: 16 },
  field: { gap: 7 },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: color.textPrimary },
  fieldHint: { fontSize: 12, color: color.textMuted, marginBottom: 6 },
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
