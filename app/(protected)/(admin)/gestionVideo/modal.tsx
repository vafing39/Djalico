import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useContext, useEffect, useState } from "react";
import DurationField from "@/components/admin/DurationField";
import FormField from "@/components/admin/FormField";
import PickerField from "@/components/admin/PickerField";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import ModalHeader from "@/components/admin/ModalHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { CourseContext } from "@/contexts/courseContext";
import { VideoContext } from "@/contexts/videoContext";
import { supabase } from "@/utils/supabase";
import { useLanguage } from "@/hooks/useLanguage";
import { color, LEVELS } from "@/config/adminTheme";
import type { Video, Category, TagType } from "@/types";

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function ModalView({
  visible,
  onClose,
  video,
}: {
  visible: boolean;
  onClose: () => void;
  video?: Video | null;
}) {
  const { saveVideo, isSaving } = useContext(VideoContext);
  const { courses } = useContext(CourseContext);
  const { t } = useLanguage();
  const isEdit = !!video;

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagType, setTagType] = useState<TagType>("beginner");
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [courseId, setCourseId] = useState("");
  const [published, setPublished] = useState(false);
  const [durationMin, setDurationMin] = useState("0");
  const [durationSec, setDurationSec] = useState("0");

  useEffect(() => {
    if (!visible) return;
    if (video) {
      setTitle(video.title);
      setSubtitle(video.subtitle ?? "");
      setCategoryId(video.category?.id ?? "");
      setTagType(video.tag_type);
      setVideoUrl(video.url);
      setVideoUri(null);
      setImageUrl(video.image_url ?? "");
      setImageUri(null);
      setPublished(video.published);
      setDurationMin(String(Math.floor(video.duration_seconds / 60)));
      setDurationSec(String(video.duration_seconds % 60));
      setCourseId("");
    } else {
      setTitle("");
      setSubtitle("");
      setCategoryId("");
      setTagType("beginner");
      setVideoUri(null);
      setVideoUrl("");
      setImageUri(null);
      setImageUrl("");
      setCourseId("");
      setPublished(false);
      setDurationMin("0");
      setDurationSec("0");
    }
  }, [visible, video]);

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

  async function pickVideo() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          t("admin.modals.video.permissionDeniedTitle"),
          t("admin.modals.video.permissionDeniedBody"),
        );
        return;
      }
      if (perm.accessPrivileges === "limited") {
        Alert.alert(
          t("admin.modals.video.limitedAccessTitle"),
          t("admin.modals.video.limitedAccessBody"),
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        Alert.alert(
          t("admin.modals.video.unreachableTitle"),
          t("admin.modals.video.unreachableBody"),
        );
        return;
      }
      setVideoUri(asset.uri);
      setVideoUrl("");
      if (asset.duration) {
        const totalSec = Math.round(asset.duration / 1000);
        setDurationMin(String(Math.floor(totalSec / 60)));
        setDurationSec(String(totalSec % 60));
      }
    } catch (err: unknown) {
      Alert.alert(
        t("common.error"),
        err instanceof Error ? err.message : t("admin.modals.video.pickError"),
      );
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    setImageUri(result.assets[0].uri);
    setImageUrl("");
  }

  function handleSubmit() {
    if (!title.trim()) {
      Alert.alert(t("settings.alert.requiredField"), t("admin.form.titleRequired"));
      return;
    }
    if (!videoUri && !videoUrl.trim()) {
      Alert.alert(
        t("settings.alert.requiredField"),
        t("admin.modals.video.fileRequired"),
      );
      return;
    }
    saveVideo({
      editId: isEdit ? video!.id : null,
      videoUri,
      videoUrl,
      imageUri,
      imageUrl,
      title,
      subtitle,
      categoryId,
      tagType,
      durationSeconds:
        (parseInt(durationMin) || 0) * 60 + (parseInt(durationSec) || 0),
      published,
      courseId,
    })
      .then(onClose)
      .catch((err: Error) => Alert.alert(t("common.error"), err.message));
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <ModalHeader
          title={isEdit ? t("admin.modals.video.editTitle") : t("admin.modals.video.addTitle")}
          subtitle={isEdit ? video!.title : t("admin.modals.video.newSubtitle")}
          isBusy={isSaving}
          submitLabel={isEdit ? t("common.save") : t("admin.modals.video.publish")}
          submitIcon={isEdit ? "save-outline" : "cloud-upload-outline"}
          onClose={onClose}
          onSubmit={handleSubmit}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Niveau ── */}
          <View style={styles.levelRow}>
            {LEVELS.map((l) => (
              <Pressable
                key={l.value}
                style={[
                  styles.levelChip,
                  tagType === l.value && styles.levelChipActive,
                ]}
                onPress={() => setTagType(l.value)}
              >
                <Text
                  style={[
                    styles.levelText,
                    tagType === l.value && styles.levelTextActive,
                  ]}
                >
                  {t(`common.level.${l.value}`)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* ── Video ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {t("admin.modals.video.section")} <Text style={{ color: color.red }}>*</Text>
            </Text>
            <Pressable style={styles.uploadZone} onPress={pickVideo}>
              <Ionicons
                name={videoUri ? "checkmark-circle" : "cloud-upload-outline"}
                size={28}
                color={videoUri ? color.green : color.white}
              />
              <Text style={styles.uploadTitle}>
                {videoUri ? t("admin.modals.video.selected") : t("admin.modals.video.import")}
              </Text>
              <Text style={styles.uploadSub}>{t("admin.modals.video.formatHint")}</Text>
            </Pressable>
            <Text style={styles.divider}>{t("admin.modals.video.orUrl")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("admin.modals.video.urlPlaceholder")}
              placeholderTextColor={color.textMuted}
              value={videoUrl}
              onChangeText={(v) => {
                setVideoUrl(v);
                setVideoUri(null);
              }}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          {/* ── Thumbnail ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("admin.modals.video.thumbnail")}</Text>
            <Pressable style={styles.uploadZone} onPress={pickImage}>
              <Ionicons
                name={imageUri ? "checkmark-circle" : "image-outline"}
                size={28}
                color={imageUri ? color.green : color.white}
              />
              <Text style={styles.uploadTitle}>
                {imageUri ? t("admin.modals.video.imageSelected") : t("admin.form.chooseImage")}
              </Text>
              <Text style={styles.uploadSub}>{t("admin.modals.video.imageFormatHint")}</Text>
            </Pressable>
            <Text style={styles.divider}>{t("admin.modals.video.orUrl")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("admin.modals.video.imageUrlPlaceholder")}
              placeholderTextColor={color.textMuted}
              value={imageUrl}
              onChangeText={(v) => {
                setImageUrl(v);
                setImageUri(null);
              }}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          {/* ── Informations ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("admin.modals.video.information")}</Text>

            <FormField
              label={t("admin.form.title")}
              required
              value={title}
              onChangeText={setTitle}
              placeholder={t("admin.modals.video.titlePlaceholder")}
              variant="card"
            />

            <FormField
              label={t("admin.modals.video.subtitle")}
              value={subtitle}
              onChangeText={setSubtitle}
              placeholder={t("admin.form.optional")}
              variant="card"
            />

            <DurationField
              label={t("admin.modals.video.duration")}
              variant="card"
              fields={[
                { value: durationMin, onChange: setDurationMin, unit: "min", placeholder: "mm" },
                { value: durationSec, onChange: setDurationSec, unit: "sec", placeholder: "ss" },
              ]}
            />
          </View>

          {/* ── Classification ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("admin.modals.video.classification")}</Text>

            <PickerField
              label={t("admin.form.category")}
              variant="card"
              selectedValue={categoryId}
              onValueChange={setCategoryId}
              placeholder={t("admin.modals.video.noCategoryPlaceholder")}
              items={categories.map((c) => ({ label: `${c.emoji} ${c.title}`, value: c.id }))}
            />

            {!isEdit && (
              <PickerField
                label={t("admin.modals.video.linkedCourse")}
                variant="card"
                selectedValue={courseId}
                onValueChange={setCourseId}
                placeholder={t("admin.form.none")}
                hint={t("admin.modals.video.linkedCourseHint")}
                items={courses.map((c) => ({ label: c.title, value: c.id }))}
              />
            )}

            <View style={styles.publishRow}>
              <Text style={styles.label}>{t("admin.modals.video.published")}</Text>
              <Switch
                value={published}
                onValueChange={setPublished}
                trackColor={{ false: color.border, true: color.navy }}
                thumbColor={color.white}
              />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },


  scrollContent: { padding: 16, gap: 12 },

  card: {
    backgroundColor: color.white,
    borderRadius: 20,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: color.textPrimary },

  uploadZone: {
    backgroundColor: color.deepBlue,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: color.border,
    borderStyle: "dashed",
    paddingVertical: 20,
    alignItems: "center",
    gap: 6,
  },
  uploadTitle: { fontSize: 14, fontWeight: "600", color: color.white },
  uploadSub: { fontSize: 11, color: color.yellow },

  divider: {
    textAlign: "center",
    fontSize: 12,
    color: color.textMuted,
    fontWeight: "500",
  },

  label: { fontSize: 13, fontWeight: "700", color: color.textPrimary },
  input: {
    backgroundColor: color.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: color.textPrimary,
    borderWidth: 1,
    borderColor: color.border,
  },


  levelRow: { flexDirection: "row", gap: 8 },
  levelChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: color.border,
    alignItems: "center",
  },
  levelChipActive: { backgroundColor: color.navy, borderColor: color.navy },
  levelText: { fontSize: 12, fontWeight: "600", color: color.textMuted },
  levelTextActive: { color: color.white },

  publishRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

});
