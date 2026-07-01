import { useContext, useEffect, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CourseContext } from "@/contexts/courseContext";
import { LessonContext } from "@/contexts/lessonContext";
import { VideoContext } from "@/contexts/videoContext";
import { color, LEVELS } from "@/config/adminTheme";
import { useLanguage } from "@/hooks/useLanguage";
import type { Course, TagType, LessonDraft, Video } from "@/types";
import ModalHeader from "@/components/admin/ModalHeader";
import CourseForm from "@/components/admin/CourseForm";
import VideoPickerSection from "@/components/admin/VideoPickerSection";

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
  const { t } = useLanguage();
  const videos = [...rawVideos].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
  );
  const isEdit = !!course;

  // ── Course fields ─────────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState<TagType>(LEVELS[0].value);
  const [durationHours, setDurationHours] = useState("0");
  const [durationMin, setDurationMin] = useState("0");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // ── Video selection ───────────────────────────────────────────────────────────
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
      setLessonDrafts(
        allLessons
          .filter((l) => l.course_id === course.id)
          .sort((a, b) => a.index - b.index)
          .map((l) => ({ id: l.id, title: l.title, video_id: l.video_id, index: l.index, duration_seconds: l.duration_seconds })),
      );
      setDeletedLessonIds([]);
    } else {
      reset();
    }
  }, [visible, course, allLessons]);

  // ── Video toggle & reorder ────────────────────────────────────────────────────

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
    if (!title.trim()) { Alert.alert(t("settings.alert.requiredField"), t("admin.form.titleRequired")); return; }
    if (!instructor.trim()) { Alert.alert(t("settings.alert.requiredField"), t("admin.modals.course.instructorRequired")); return; }

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
      Alert.alert(t("common.error"), (err as Error).message);
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

  function handleClose() { reset(); onClose(); }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onRequestClose={handleClose}>
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <CourseForm
            title={title} setTitle={setTitle}
            instructor={instructor} setInstructor={setInstructor}
            categoryId={categoryId} setCategoryId={setCategoryId}
            level={level} setLevel={setLevel}
            durationHours={durationHours} setDurationHours={setDurationHours}
            durationMin={durationMin} setDurationMin={setDurationMin}
            coverImage={coverImage} setCoverImage={setCoverImage}
          />

          <VideoPickerSection
            videos={videos}
            lessonDrafts={lessonDrafts}
            videoSearch={videoSearch}
            onSearchChange={setVideoSearch}
            onToggleVideo={toggleVideo}
            onMoveUp={moveLessonUp}
            onMoveDown={moveLessonDown}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
  scrollContent: { padding: 20, gap: 24 },
});
