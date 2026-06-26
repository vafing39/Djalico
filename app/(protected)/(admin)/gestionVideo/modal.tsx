import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { CourseContext } from "@/contexts/courseContext";
import { Video, VideoContext } from "@/contexts/videoContext";
import { supabase } from "@/utils/supabase"; // used only for categories fetch + course_lessons insert
import { color, LEVELS } from "@/config/adminTheme";

// ─── Types & constants ────────────────────────────────────────────────────────

type Category = { id: string; title: string; emoji: string };
type TagType = "beginner" | "intermediate" | "expert";



// ─── Helpers ──────────────────────────────────────────────────────────────────

async function uploadToStorage(
  uri: string,
  bucket: string,
  path: string,
  contentType: string,
): Promise<string> {
  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, { contentType, upsert: true });
  if (error) throw error;
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl;
}

function randomSuffix() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
  const { addVideo, updateVideo } = useContext(VideoContext);
  const { courses } = useContext(CourseContext);
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 1,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setVideoUri(asset.uri);
    setVideoUrl("");
    if (asset.duration) {
      const totalSec = Math.round(asset.duration / 1000);
      setDurationMin(String(Math.floor(totalSec / 60)));
      setDurationSec(String(totalSec % 60));
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

  const mutation = useMutation({
    mutationFn: async () => {
      const durationSeconds =
        (parseInt(durationMin) || 0) * 60 + (parseInt(durationSec) || 0);

      let finalVideoUrl = videoUrl.trim();
      if (videoUri) {
        const ext = videoUri.split(".").pop() ?? "mp4";
        finalVideoUrl = await uploadToStorage(
          videoUri,
          "videos",
          `${randomSuffix()}.${ext}`,
          `video/${ext}`,
        );
      }

      let finalImageUrl: string | null = imageUrl.trim() || null;
      if (imageUri) {
        const ext = imageUri.split(".").pop() ?? "jpg";
        finalImageUrl = await uploadToStorage(
          imageUri,
          "videos",
          `thumbnails/${randomSuffix()}.${ext}`,
          `image/${ext}`,
        );
      }

      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        category_id: categoryId || null,
        tag_type: tagType,
        url: finalVideoUrl,
        image_url: finalImageUrl,
        duration_seconds: durationSeconds,
        published,
      };

      if (isEdit) {
        await updateVideo(video!.id, payload);
      } else {
        const inserted = await addVideo(payload);
        if (courseId) {
          const { data: lastLesson } = await supabase
            .from("course_lessons")
            .select("index")
            .eq("course_id", courseId)
            .order("index", { ascending: false })
            .limit(1);
          const nextIndex =
            lastLesson?.[0] != null ? lastLesson[0].index + 1 : 0;
          await supabase.from("course_lessons").insert({
            course_id: courseId,
            title: inserted.title,
            url: inserted.url,
            duration_seconds: durationSeconds,
            index: nextIndex,
          });
        }
      }
    },
    onSuccess: onClose,
    onError: (err: Error) => Alert.alert("Erreur", err.message),
  });

  function handleSubmit() {
    if (!title.trim()) {
      Alert.alert("Champ requis", "Le titre est obligatoire.");
      return;
    }
    if (!videoUri && !videoUrl.trim()) {
      Alert.alert(
        "Champ requis",
        "Veuillez importer une vidéo ou saisir une URL.",
      );
      return;
    }
    mutation.mutate();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>
              {isEdit ? "Modifier la vidéo" : "Ajouter une vidéo"}
            </Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {isEdit ? video!.title : "Nouvelle vidéo"}
            </Text>
          </View>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color={color.textMuted} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Video ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Vidéo <Text style={{ color: color.red }}>*</Text>
            </Text>
            <Pressable style={styles.uploadZone} onPress={pickVideo}>
              <Ionicons
                name={videoUri ? "checkmark-circle" : "cloud-upload-outline"}
                size={28}
                color={videoUri ? color.green : color.navy}
              />
              <Text style={styles.uploadTitle}>
                {videoUri ? "Vidéo sélectionnée" : "Importer depuis la galerie"}
              </Text>
              <Text style={styles.uploadSub}>MP4, MOV — max 500 Mo</Text>
            </Pressable>
            <Text style={styles.divider}>— ou saisir une URL —</Text>
            <TextInput
              style={styles.input}
              placeholder="https://… ou youtube.com/watch?v=…"
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
            <Text style={styles.cardTitle}>Miniature</Text>
            <Pressable style={styles.uploadZone} onPress={pickImage}>
              <Ionicons
                name={imageUri ? "checkmark-circle" : "image-outline"}
                size={28}
                color={imageUri ? color.green : color.navy}
              />
              <Text style={styles.uploadTitle}>
                {imageUri ? "Image sélectionnée" : "Choisir une image"}
              </Text>
              <Text style={styles.uploadSub}>JPG, PNG — format 16:9</Text>
            </Pressable>
            <Text style={styles.divider}>— ou saisir une URL —</Text>
            <TextInput
              style={styles.input}
              placeholder="https://…"
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
            <Text style={styles.cardTitle}>Informations</Text>

            <View style={styles.field}>
              <Text style={styles.label}>
                Titre <Text style={{ color: color.red }}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex : Les gammes pentatoniques"
                placeholderTextColor={color.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Sous-titre</Text>
              <TextInput
                style={styles.input}
                placeholder="Optionnel"
                placeholderTextColor={color.textMuted}
                value={subtitle}
                onChangeText={setSubtitle}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Durée</Text>
              <View style={styles.durationRow}>
                <View style={styles.durationField}>
                  <TextInput
                    style={[styles.input, styles.durationInput]}
                    placeholder="mm"
                    placeholderTextColor={color.textMuted}
                    value={durationMin}
                    onChangeText={setDurationMin}
                    keyboardType="number-pad"
                  />
                  <Text style={styles.durationUnit}>min</Text>
                </View>
                <View style={styles.durationField}>
                  <TextInput
                    style={[styles.input, styles.durationInput]}
                    placeholder="ss"
                    placeholderTextColor={color.textMuted}
                    value={durationSec}
                    onChangeText={setDurationSec}
                    keyboardType="number-pad"
                  />
                  <Text style={styles.durationUnit}>sec</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── Classification ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Classification</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Catégorie</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={categoryId}
                  onValueChange={setCategoryId}
                  style={styles.picker}
                >
                  <Picker.Item label="— Aucune catégorie —" value="" />
                  {categories.map((c) => (
                    <Picker.Item
                      key={c.id}
                      label={`${c.emoji} ${c.title}`}
                      value={c.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Niveau</Text>
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
                      {l.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {!isEdit && (
              <View style={styles.field}>
                <Text style={styles.label}>Cours associé</Text>
                <Text style={styles.hint}>
                  La vidéo sera ajoutée comme leçon de ce cours.
                </Text>
                <View style={styles.pickerWrap}>
                  <Picker
                    selectedValue={courseId}
                    onValueChange={setCourseId}
                    style={styles.picker}
                  >
                    <Picker.Item label="— Aucun —" value="" />
                    {courses.map((c) => (
                      <Picker.Item key={c.id} label={c.title} value={c.id} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            <View style={styles.publishRow}>
              <Text style={styles.label}>Publié</Text>
              <Switch
                value={published}
                onValueChange={setPublished}
                trackColor={{ false: color.border, true: color.navy }}
                thumbColor={color.white}
              />
            </View>
          </View>

          {/* ── Actions ── */}
          <View style={styles.actionRow}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={[styles.submitBtn, mutation.isPending && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <ActivityIndicator color={color.navy} size="small" />
              ) : (
                <>
                  <Ionicons
                    name={isEdit ? "save-outline" : "cloud-upload-outline"}
                    size={18}
                    color={color.navy}
                  />
                  <Text style={styles.submitText}>
                    {isEdit ? "Enregistrer" : "Publier"}
                  </Text>
                </>
              )}
            </Pressable>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: color.textPrimary,
    letterSpacing: -0.3,
  },
  headerSub: { fontSize: 13, color: color.textMuted, marginTop: 3, maxWidth: 260 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: color.bg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.border,
  },

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
    backgroundColor: color.bg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: color.border,
    borderStyle: "dashed",
    paddingVertical: 20,
    alignItems: "center",
    gap: 6,
  },
  uploadTitle: { fontSize: 14, fontWeight: "600", color: color.textPrimary },
  uploadSub: { fontSize: 11, color: color.textMuted },

  divider: {
    textAlign: "center",
    fontSize: 12,
    color: color.textMuted,
    fontWeight: "500",
  },

  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: "700", color: color.textPrimary },
  hint: { fontSize: 11, color: color.textMuted, marginTop: -2 },
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

  durationRow: { flexDirection: "row", gap: 10 },
  durationField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  durationInput: { flex: 1 },
  durationUnit: { fontSize: 13, color: color.textMuted, fontWeight: "500" },

  pickerWrap: {
    backgroundColor: color.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.border,
    overflow: "hidden",
  },
  picker: { color: color.textPrimary },

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

  actionRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: color.border,
    alignItems: "center",
  },
  cancelText: { fontSize: 15, fontWeight: "600", color: color.textMuted },
  submitBtn: {
    flex: 2,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: color.yellow,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitText: { fontSize: 15, fontWeight: "700", color: color.navy },
});
