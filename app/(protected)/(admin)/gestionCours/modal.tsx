import { useEffect, useMemo } from "react";
import { useController, useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet } from "react-native";
import { z } from "zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCourses } from "@/hooks/useCourses";
import { useLessons } from "@/hooks/useLessons";
import { useVideos } from "@/hooks/useVideos";
import { color, LEVELS } from "@/config/adminTheme";
import { useLanguage } from "@/hooks/useLanguage";
import type { Course, TagType, LessonDraft, Video } from "@/types";
import ModalHeader from "@/components/admin/ModalHeader";
import CourseForm from "@/components/admin/CourseForm";
import VideoPickerSection from "@/components/admin/VideoPickerSection";

function makeCourseSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().trim().min(1, t("admin.form.titleRequired")),
    instructorId: z.string(),
    categoryId: z.string(),
    level: z.string(),
    durationHours: z.string(),
    durationMin: z.string(),
    coverImage: z.string().nullable(),
    published: z.boolean(),
    lessonDrafts: z.array(z.custom<LessonDraft>()),
    deletedLessonIds: z.array(z.string()),
    videoSearch: z.string(),
  });
}

type CourseModalFields = z.infer<ReturnType<typeof makeCourseSchema>>;

function defaultCourseValues(): CourseModalFields {
  return {
    title: "",
    instructorId: "",
    categoryId: "",
    level: LEVELS[0].value,
    durationHours: "0",
    durationMin: "0",
    coverImage: null,
    published: false,
    lessonDrafts: [],
    deletedLessonIds: [],
    videoSearch: "",
  };
}

// Bridges CourseForm's flat value/setter props to the form.
function CourseFormFields({ control }: { control: Control<CourseModalFields> }) {
  const title = useController({ control, name: "title" });
  const instructorId = useController({ control, name: "instructorId" });
  const categoryId = useController({ control, name: "categoryId" });
  const level = useController({ control, name: "level" });
  const durationHours = useController({ control, name: "durationHours" });
  const durationMin = useController({ control, name: "durationMin" });
  const coverImage = useController({ control, name: "coverImage" });
  const published = useController({ control, name: "published" });

  return (
    <CourseForm
      title={title.field.value}
      setTitle={title.field.onChange}
      instructorId={instructorId.field.value}
      setInstructorId={instructorId.field.onChange}
      categoryId={categoryId.field.value}
      setCategoryId={categoryId.field.onChange}
      level={level.field.value as TagType}
      setLevel={level.field.onChange}
      durationHours={durationHours.field.value}
      setDurationHours={durationHours.field.onChange}
      durationMin={durationMin.field.value}
      setDurationMin={durationMin.field.onChange}
      coverImage={coverImage.field.value}
      setCoverImage={coverImage.field.onChange}
      published={published.field.value}
      setPublished={published.field.onChange}
    />
  );
}

// Bridges VideoPickerSection's toggle/reorder callbacks to the lessonDrafts
// and deletedLessonIds array fields.
function VideoPickerFields({
  control,
  videos,
}: {
  control: Control<CourseModalFields>;
  videos: Video[];
}) {
  const lessonDraftsField = useController({ control, name: "lessonDrafts" });
  const deletedIdsField = useController({ control, name: "deletedLessonIds" });
  const videoSearchField = useController({ control, name: "videoSearch" });
  const lessonDrafts = lessonDraftsField.field.value;

  function toggleVideo(video: Video) {
    const draftIdx = lessonDrafts.findIndex((d) => d.video_id === video.id);
    if (draftIdx !== -1) {
      const draft = lessonDrafts[draftIdx];
      if (draft.id) {
        deletedIdsField.field.onChange([...deletedIdsField.field.value, draft.id]);
      }
      lessonDraftsField.field.onChange(lessonDrafts.filter((_, i) => i !== draftIdx));
    } else {
      lessonDraftsField.field.onChange([
        ...lessonDrafts,
        {
          title: video.title,
          video_id: video.id,
          index: lessonDrafts.length + 1,
          duration_seconds: video.duration_seconds,
        },
      ]);
    }
  }

  function moveLessonUp(idx: number) {
    if (idx === 0) return;
    const next = [...lessonDrafts];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    lessonDraftsField.field.onChange(next);
  }

  function moveLessonDown(idx: number) {
    if (idx === lessonDrafts.length - 1) return;
    const next = [...lessonDrafts];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    lessonDraftsField.field.onChange(next);
  }

  return (
    <VideoPickerSection
      videos={videos}
      lessonDrafts={lessonDrafts}
      videoSearch={videoSearchField.field.value}
      onSearchChange={videoSearchField.field.onChange}
      onToggleVideo={toggleVideo}
      onMoveUp={moveLessonUp}
      onMoveDown={moveLessonDown}
    />
  );
}

export default function ModalView({
  visible,
  onClose,
  course,
}: {
  visible: boolean;
  onClose: () => void;
  course?: Course | null;
}) {
  const { saveCourse, isSaving } = useCourses();
  const { lessons: allLessons, saveLessons, isSavingLessons } = useLessons();
  const { videos: rawVideos } = useVideos();
  const { t } = useLanguage();
  const videos = [...rawVideos].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
  );
  const isEdit = !!course;

  const courseSchema = useMemo(() => makeCourseSchema(t), [t]);

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
  } = useForm<CourseModalFields>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultCourseValues(),
  });

  useEffect(() => {
    if (!visible) return;
    if (course) {
      const totalSec = course.total_duration_seconds;
      reset({
        title: course.title,
        instructorId: course.instructor?.id ?? "",
        categoryId: course.category?.id ?? "",
        level: course.tag_type,
        durationHours: String(Math.floor(totalSec / 3600)),
        durationMin: String(Math.floor((totalSec % 3600) / 60)),
        coverImage: null,
        published: course.published,
        lessonDrafts: allLessons
          .filter((l) => l.course_id === course.id)
          .sort((a, b) => a.index - b.index)
          .map((l) => ({ id: l.id, title: l.title, video_id: l.video_id, index: l.index, duration_seconds: l.duration_seconds })),
        deletedLessonIds: [],
        videoSearch: "",
      });
    } else {
      reset(defaultCourseValues());
    }
  }, [visible, course, allLessons, reset]);

  // ── Submit ────────────────────────────────────────────────────────────────────

  const handleSubmit = handleFormSubmit(
    async (data) => {
      const totalDurationSeconds =
        (parseInt(data.durationHours) || 0) * 3600 + (parseInt(data.durationMin) || 0) * 60;

      try {
        const savedCourse = await saveCourse({
          editId: isEdit ? course!.id : null,
          imageUri: data.coverImage,
          imageUrl: isEdit ? (course!.image_url ?? "") : "",
          title: data.title,
          instructorId: data.instructorId,
          categoryId: data.categoryId,
          tagType: data.level as TagType,
          totalDurationSeconds,
          published: data.published,
        });
        await saveLessons(savedCourse.id, data.lessonDrafts, data.deletedLessonIds);
        reset(defaultCourseValues());
        onClose();
      } catch (err: unknown) {
        Alert.alert(t("common.error"), (err as Error).message);
      }
    },
    (formErrors) => {
      const firstError = Object.values(formErrors)[0];
      if (firstError?.message) {
        Alert.alert(t("settings.alert.requiredField"), firstError.message);
      }
    },
  );

  function handleClose() {
    reset(defaultCourseValues());
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" statusBarTranslucent onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        <ModalHeader
          title={isEdit ? t("admin.modals.course.editTitle") : t("admin.modals.course.addTitle")}
          subtitle={isEdit ? course!.title : t("admin.modals.course.newSubtitle")}
          isBusy={isSaving || isSavingLessons}
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
          <CourseFormFields control={control} />

          <VideoPickerFields control={control} videos={videos} />
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
  scrollContent: { padding: 20, gap: 24 },
});
