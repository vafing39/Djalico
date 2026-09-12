import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo } from "react";
import { Controller, useController, useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import ModalHeader from "@/components/admin/ModalHeader";
import CategoryLevelPickers from "@/components/admin/CategoryLevelPickers";
import CoverImagePicker from "@/components/admin/CoverImagePicker";
import DurationField from "@/components/admin/DurationField";
import FormField from "@/components/admin/FormField";
import PickerField from "@/components/admin/PickerField";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { useParcours } from "@/hooks/useParcours";
import { useCourses } from "@/hooks/useCourses";
import { color, LEVELS } from "@/config/adminTheme";
import { useLanguage } from "@/hooks/useLanguage";
import type { Parcours, Category, TagType } from "@/types";

type Instructor = { id: string; name: string };

function makeParcoursSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().trim().min(1, t("admin.form.titleRequired")),
    description: z.string(),
    categoryId: z.string(),
    instructorId: z.string(),
    level: z.string(),
    durationHours: z.string(),
    durationMin: z.string(),
    coverImage: z.string().nullable(),
    courseIds: z.array(z.string()),
  });
}

type ParcoursFormFields = z.infer<ReturnType<typeof makeParcoursSchema>>;

function defaultParcoursValues(): ParcoursFormFields {
  return {
    title: "",
    description: "",
    categoryId: "",
    instructorId: "",
    level: LEVELS[0].value,
    durationHours: "0",
    durationMin: "0",
    coverImage: null,
    courseIds: [],
  };
}

// Bridges to shared components that take several independent value/setter
// pairs at once, where a single Controller render-prop can't cover all of them.
function CategoryLevelPickerFields({
  control,
  categories,
}: {
  control: Control<ParcoursFormFields>;
  categories: Category[];
}) {
  const categoryField = useController({ control, name: "categoryId" });
  const levelField = useController({ control, name: "level" });
  return (
    <CategoryLevelPickers
      categoryId={categoryField.field.value}
      setCategoryId={categoryField.field.onChange}
      categories={categories}
      level={levelField.field.value as TagType}
      setLevel={levelField.field.onChange}
    />
  );
}

function DurationFields({ control }: { control: Control<ParcoursFormFields> }) {
  const hoursField = useController({ control, name: "durationHours" });
  const minField = useController({ control, name: "durationMin" });
  return (
    <DurationField
      fields={[
        { value: hoursField.field.value, onChange: hoursField.field.onChange, unit: "h" },
        { value: minField.field.value, onChange: minField.field.onChange, unit: "min" },
      ]}
    />
  );
}

export default function ModalView({
  visible,
  onClose,
  parcours,
}: {
  visible: boolean;
  onClose: () => void;
  parcours?: Parcours | null;
}) {
  const { saveParcours, isSaving } = useParcours();
  const { courses } = useCourses();
  const { t } = useLanguage();
  const isEdit = !!parcours;

  const parcoursSchema = useMemo(() => makeParcoursSchema(t), [t]);

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    setValue,
  } = useForm<ParcoursFormFields>({
    resolver: zodResolver(parcoursSchema),
    defaultValues: defaultParcoursValues(),
  });

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
      const totalSec = parcours.total_duration_seconds;
      reset({
        title: parcours.title,
        description: parcours.description ?? "",
        categoryId: parcours.category?.id ?? "",
        instructorId: parcours.instructor?.id ?? "",
        level: parcours.tag_type,
        durationHours: String(Math.floor(totalSec / 3600)),
        durationMin: String(Math.floor((totalSec % 3600) / 60)),
        coverImage: null,
        courseIds: [],
      });
    } else {
      reset(defaultParcoursValues());
    }
  }, [visible, parcours, reset]);

  useEffect(() => {
    if (isEdit && linkedCourseIds.length > 0) {
      setValue("courseIds", linkedCourseIds);
    }
  }, [linkedCourseIds, isEdit, setValue]);

  const handleSubmit = handleFormSubmit(
    (data) => {
      const totalDurationSeconds =
        (parseInt(data.durationHours) || 0) * 3600 +
        (parseInt(data.durationMin) || 0) * 60;

      saveParcours({
        editId: isEdit ? parcours!.id : null,
        coverImageUri: data.coverImage,
        coverImageUrl: isEdit ? (parcours!.cover_image_url ?? "") : "",
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        instructorId: data.instructorId,
        tagType: data.level as TagType,
        totalDurationSeconds,
        courseIds: data.courseIds,
      })
        .then(() => {
          reset(defaultParcoursValues());
          onClose();
        })
        .catch((err: Error) => Alert.alert(t("common.error"), err.message));
    },
    (formErrors) => {
      const firstError = Object.values(formErrors)[0];
      if (firstError?.message) {
        Alert.alert(t("settings.alert.requiredField"), firstError.message);
      }
    },
  );

  function handleClose() {
    reset(defaultParcoursValues());
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      statusBarTranslucent
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

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <Controller
              control={control}
              name="title"
              render={({ field: { value, onChange } }) => (
                <FormField
                  label={t("admin.form.title")}
                  required
                  value={value}
                  onChangeText={onChange}
                  placeholder={t("admin.modals.parcours.titlePlaceholder")}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange } }) => (
                <FormField
                  label={t("admin.modals.parcours.description")}
                  value={value}
                  onChangeText={onChange}
                  placeholder={t("admin.modals.parcours.descriptionPlaceholder")}
                  multiline
                />
              )}
            />

            <CategoryLevelPickerFields control={control} categories={categories} />

            <Controller
              control={control}
              name="instructorId"
              render={({ field: { value, onChange } }) => (
                <PickerField
                  label={t("admin.modals.course.instructor")}
                  selectedValue={value}
                  onValueChange={onChange}
                  placeholder={t("admin.form.none")}
                  items={instructors.map((u) => ({ label: u.name, value: u.id }))}
                />
              )}
            />

            <DurationFields control={control} />

            <Controller
              control={control}
              name="coverImage"
              render={({ field: { value, onChange } }) => (
                <CoverImagePicker coverImage={value} setCoverImage={onChange} />
              )}
            />

            <Controller
              control={control}
              name="courseIds"
              render={({ field: { value, onChange } }) => (
                <View style={styles.field}>
                  <Text style={styles.sectionLabel}>{t("admin.modals.parcours.coursesIncluded")}</Text>
                  <Text style={styles.fieldHint}>
                    {t(
                      value.length === 1
                        ? "admin.modals.parcours.courseSelected"
                        : "admin.modals.parcours.courseSelectedPlural",
                      { n: value.length },
                    )}
                  </Text>
                  <View style={styles.courseList}>
                    {courses.map((course) => {
                      const selected = value.includes(course.id);
                      return (
                        <Pressable
                          key={course.id}
                          style={[styles.courseRow, selected && styles.courseRowSelected]}
                          onPress={() =>
                            onChange(
                              selected
                                ? value.filter((c) => c !== course.id)
                                : [...value, course.id],
                            )
                          }
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
              )}
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
        </KeyboardAvoidingView>
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
