import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo } from "react";
import { Controller, useController, useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CategoryLevelPickers from "@/components/admin/CategoryLevelPickers";
import DurationField from "@/components/admin/DurationField";
import FormField from "@/components/admin/FormField";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
import { useVideos } from "@/hooks/useVideos";
import { supabase } from "@/utils/supabase";
import { useLanguage } from "@/hooks/useLanguage";
import { color } from "@/config/adminTheme";
import type { Video, Category, TagType } from "@/types";

// ─── Validation ───────────────────────────────────────────────────────────────

function makeVideoSchema(t: (key: string) => string) {
  return z
    .object({
      title: z.string().trim().min(1, t("admin.form.titleRequired")),
      subtitle: z.string(),
      categoryId: z.string(),
      tagType: z.string(),
      videoUri: z.string().nullable(),
      videoUrl: z.string(),
      imageUri: z.string().nullable(),
      imageUrl: z.string(),
      published: z.boolean(),
      durationMin: z.string(),
      durationSec: z.string(),
    })
    .refine((data) => !!data.videoUri || data.videoUrl.trim().length > 0, {
      message: t("admin.modals.video.fileRequired"),
      path: ["videoUrl"],
    });
}

type VideoFormFields = z.infer<ReturnType<typeof makeVideoSchema>>;

function defaultVideoValues(): VideoFormFields {
  return {
    title: "",
    subtitle: "",
    categoryId: "",
    tagType: "beginner",
    videoUri: null,
    videoUrl: "",
    imageUri: null,
    imageUrl: "",
    published: false,
    durationMin: "0",
    durationSec: "0",
  };
}

// Bridges DurationField's two independent value/setter pairs to the form.
function DurationFields({ control, label }: { control: Control<VideoFormFields>; label: string }) {
  const minField = useController({ control, name: "durationMin" });
  const secField = useController({ control, name: "durationSec" });
  return (
    <DurationField
      label={label}
      variant="card"
      fields={[
        { value: minField.field.value, onChange: minField.field.onChange, unit: "min", placeholder: "mm" },
        { value: secField.field.value, onChange: secField.field.onChange, unit: "sec", placeholder: "ss" },
      ]}
    />
  );
}

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
  const { saveVideo, isSaving } = useVideos();
  const { t } = useLanguage();
  const isEdit = !!video;

  const videoSchema = useMemo(() => makeVideoSchema(t), [t]);

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    setValue,
  } = useForm<VideoFormFields>({
    resolver: zodResolver(videoSchema),
    defaultValues: defaultVideoValues(),
  });

  // A file picked from the phone, OR (on edit) an existing value that's
  // already one of our own Supabase-hosted files — in both cases we show
  // "Sélectionné" and hide the raw link, instead of exposing the internal
  // storage URL in a text field.
  const isStorageUrl = (url: string) => url.includes("/storage/v1/object/public/videos/");

  const videoUriField = useController({ control, name: "videoUri" });
  const videoUrlField = useController({ control, name: "videoUrl" });
  const imageUriField = useController({ control, name: "imageUri" });
  const imageUrlField = useController({ control, name: "imageUrl" });
  const categoryIdField = useController({ control, name: "categoryId" });
  const tagTypeField = useController({ control, name: "tagType" });

  const hasStoredVideoFile =
    !videoUriField.field.value && isStorageUrl(videoUrlField.field.value);
  const hasStoredImageFile =
    !imageUriField.field.value && isStorageUrl(imageUrlField.field.value);
  const thumbnailPreview = imageUriField.field.value || imageUrlField.field.value || null;

  useEffect(() => {
    if (!visible) return;
    if (video) {
      reset({
        title: video.title,
        subtitle: video.subtitle ?? "",
        categoryId: video.category?.id ?? "",
        tagType: video.tag_type,
        videoUri: null,
        videoUrl: video.url,
        imageUri: null,
        imageUrl: video.image_url ?? "",
        published: video.published,
        durationMin: String(Math.floor(video.duration_seconds / 60)),
        durationSec: String(video.duration_seconds % 60),
      });
    } else {
      reset(defaultVideoValues());
    }
  }, [visible, video, reset]);

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
      setValue("videoUri", asset.uri);
      setValue("videoUrl", "");
      if (asset.duration) {
        const totalSec = Math.round(asset.duration / 1000);
        setValue("durationMin", String(Math.floor(totalSec / 60)));
        setValue("durationSec", String(totalSec % 60));
      }
    } catch (err: unknown) {
      Alert.alert(
        t("common.error"),
        err instanceof Error ? err.message : t("admin.modals.video.pickError"),
      );
    }
  }

  async function pickImage() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          t("admin.modals.video.permissionDeniedTitle"),
          t("admin.modals.video.permissionDeniedBody"),
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;
      setValue("imageUri", result.assets[0].uri);
      setValue("imageUrl", "");
    } catch (err: unknown) {
      Alert.alert(
        t("common.error"),
        err instanceof Error ? err.message : t("admin.modals.video.pickError"),
      );
    }
  }

  const handleSubmit = handleFormSubmit(
    (data) => {
      saveVideo({
        editId: isEdit ? video!.id : null,
        videoUri: data.videoUri,
        videoUrl: data.videoUrl,
        imageUri: data.imageUri,
        imageUrl: data.imageUrl,
        title: data.title,
        subtitle: data.subtitle,
        categoryId: data.categoryId,
        tagType: data.tagType as TagType,
        durationSeconds:
          (parseInt(data.durationMin) || 0) * 60 + (parseInt(data.durationSec) || 0),
        published: data.published,
      })
        .then(onClose)
        .catch((err: Error) => Alert.alert(t("common.error"), err.message));
    },
    (formErrors) => {
      const firstError = Object.values(formErrors)[0];
      if (firstError?.message) {
        Alert.alert(t("settings.alert.requiredField"), firstError.message);
      }
    },
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      statusBarTranslucent
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

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Video ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {t("admin.modals.video.section")} <Text style={{ color: color.red }}>*</Text>
            </Text>
            <Controller
              control={control}
              name="videoUri"
              render={({ field: { value: videoUri } }) => {
                const selected = !!videoUri || hasStoredVideoFile;
                return (
                  <Pressable style={styles.uploadZone} onPress={pickVideo}>
                    <Ionicons
                      name={selected ? "checkmark-circle" : "cloud-upload-outline"}
                      size={28}
                      color={selected ? color.green : color.white}
                    />
                    <Text style={styles.uploadTitle}>
                      {selected ? t("admin.modals.video.selected") : t("admin.modals.video.import")}
                    </Text>
                    <Text style={styles.uploadSub}>{t("admin.modals.video.formatHint")}</Text>
                  </Pressable>
                );
              }}
            />
            {!videoUriField.field.value && !hasStoredVideoFile && (
              <>
                <Text style={styles.divider}>{t("admin.modals.video.orUrl")}</Text>
                <Controller
                  control={control}
                  name="videoUrl"
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder={t("admin.modals.video.urlPlaceholder")}
                      placeholderTextColor={color.textMuted}
                      value={value}
                      onChangeText={(v) => {
                        onChange(v);
                        // Switching away from a picked file: its auto-detected
                        // duration no longer applies to the pasted URL.
                        setValue("videoUri", null);
                        setValue("durationMin", "0");
                        setValue("durationSec", "0");
                      }}
                      autoCapitalize="none"
                      keyboardType="url"
                    />
                  )}
                />
              </>
            )}
          </View>

          {/* ── Thumbnail ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("admin.modals.video.thumbnail")}</Text>
            <Pressable style={[styles.uploadZone, styles.uploadZoneClip]} onPress={pickImage}>
              {thumbnailPreview ? (
                <>
                  <Image source={{ uri: thumbnailPreview }} style={styles.uploadPreviewImage} />
                  <View style={styles.uploadPreviewBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={color.green} />
                    <Text style={styles.uploadPreviewBadgeText}>
                      {t("admin.modals.video.imageSelected")}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Ionicons name="image-outline" size={28} color={color.white} />
                  <Text style={styles.uploadTitle}>{t("admin.form.chooseImage")}</Text>
                  <Text style={styles.uploadSub}>{t("admin.modals.video.imageFormatHint")}</Text>
                </>
              )}
            </Pressable>
            {!imageUriField.field.value && !hasStoredImageFile && (
              <>
                <Text style={styles.divider}>{t("admin.modals.video.orUrl")}</Text>
                <Controller
                  control={control}
                  name="imageUrl"
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder={t("admin.modals.video.imageUrlPlaceholder")}
                      placeholderTextColor={color.textMuted}
                      value={value}
                      onChangeText={(v) => {
                        onChange(v);
                        setValue("imageUri", null);
                      }}
                      autoCapitalize="none"
                      keyboardType="url"
                    />
                  )}
                />
              </>
            )}
          </View>

          {/* ── Informations ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("admin.modals.video.information")}</Text>

            <Controller
              control={control}
              name="title"
              render={({ field: { value, onChange } }) => (
                <FormField
                  label={t("admin.form.title")}
                  required
                  value={value}
                  onChangeText={onChange}
                  placeholder={t("admin.modals.video.titlePlaceholder")}
                  variant="card"
                />
              )}
            />

            <Controller
              control={control}
              name="subtitle"
              render={({ field: { value, onChange } }) => (
                <FormField
                  label={t("admin.modals.video.subtitle")}
                  value={value}
                  onChangeText={onChange}
                  placeholder={t("admin.form.optional")}
                  variant="card"
                />
              )}
            />

            <DurationFields control={control} label={t("admin.modals.video.duration")} />
          </View>

          {/* ── Classification ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("admin.modals.video.classification")}</Text>

            <CategoryLevelPickers
              categoryId={categoryIdField.field.value}
              setCategoryId={categoryIdField.field.onChange}
              categories={categories}
              level={tagTypeField.field.value as TagType}
              setLevel={tagTypeField.field.onChange}
            />

            <Controller
              control={control}
              name="published"
              render={({ field: { value, onChange } }) => (
                <View style={styles.publishRow}>
                  <Text style={styles.label}>{t("admin.modals.video.published")}</Text>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: color.border, true: color.navy }}
                    thumbColor={color.white}
                  />
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

  uploadZoneClip: { overflow: "hidden", minHeight: 140 },
  uploadPreviewImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover",
  },
  uploadPreviewBadge: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  uploadPreviewBadgeText: { fontSize: 12, fontWeight: "600", color: color.white },

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


  publishRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

});
