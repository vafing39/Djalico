import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Switch, Text, View } from "react-native";
import { supabase } from "@/utils/supabase";
import { useLanguage } from "@/hooks/useLanguage";
import { color } from "@/config/adminTheme";
import type { Category, TagType } from "@/types";
import CategoryLevelPickers from "./CategoryLevelPickers";
import CoverImagePicker from "./CoverImagePicker";
import DurationField from "./DurationField";
import FormField from "./FormField";

type Props = {
  title: string;
  setTitle: (v: string) => void;
  instructor: string;
  setInstructor: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  level: TagType;
  setLevel: (v: TagType) => void;
  durationHours: string;
  setDurationHours: (v: string) => void;
  durationMin: string;
  setDurationMin: (v: string) => void;
  coverImage: string | null;
  setCoverImage: (v: string | null) => void;
  published: boolean;
  setPublished: (v: boolean) => void;
};

export default function CourseForm({
  title, setTitle,
  instructor, setInstructor,
  categoryId, setCategoryId,
  level, setLevel,
  durationHours, setDurationHours,
  durationMin, setDurationMin,
  coverImage, setCoverImage,
  published, setPublished,
}: Props) {
  const { t } = useLanguage();
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("id, title, emoji").order("title");
      if (error) throw error;
      return data;
    },
  });

  return (
    <View style={styles.form}>
      <FormField
        label={t("admin.form.title")}
        required
        value={title}
        onChangeText={setTitle}
        placeholder={t("admin.modals.course.titlePlaceholder")}
      />

      <FormField
        label={t("admin.modals.course.instructor")}
        required
        value={instructor}
        onChangeText={setInstructor}
        placeholder={t("admin.modals.course.instructorPlaceholder")}
      />

      <CategoryLevelPickers
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categories={categories}
        level={level}
        setLevel={setLevel}
      />

      <DurationField
        fields={[
          { value: durationHours, onChange: setDurationHours, unit: "h" },
          { value: durationMin, onChange: setDurationMin, unit: "min" },
        ]}
      />

      <CoverImagePicker coverImage={coverImage} setCoverImage={setCoverImage} />

      <View style={styles.publishRow}>
        <Text style={styles.label}>{t("admin.modals.course.published")}</Text>
        <Switch
          value={published}
          onValueChange={setPublished}
          trackColor={{ false: color.border, true: color.navy }}
          thumbColor={color.white}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16 },
  publishRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 13, fontWeight: "700", color: color.textPrimary },
});
