import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
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
import { Course, CourseContext } from "@/contexts/courseContext";
import { supabase } from "@/utils/supabase";
import { color, LEVELS } from "@/config/adminTheme";

type Category = { id: string; title: string; emoji: string };
type TagType = "beginner" | "intermediate" | "expert";

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
  const isEdit = !!course;

  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState<TagType>(LEVELS[0].value);
  const [durationHours, setDurationHours] = useState("0");
  const [durationMin, setDurationMin] = useState("0");
  const [coverImage, setCoverImage] = useState<string | null>(null);

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
    } else {
      reset();
    }
  }, [visible, course]);

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

  function handleSubmit() {
    if (!title.trim()) {
      Alert.alert("Champ requis", "Le titre est obligatoire.");
      return;
    }
    if (!instructor.trim()) {
      Alert.alert("Champ requis", "L'instructeur est obligatoire.");
      return;
    }
    const totalDurationSeconds =
      (parseInt(durationHours) || 0) * 3600 + (parseInt(durationMin) || 0) * 60;

    saveCourse({
      editId: isEdit ? course!.id : null,
      imageUri: coverImage,
      imageUrl: isEdit ? (course!.image_url ?? "") : "",
      title,
      instructor,
      categoryId,
      tagType: level,
      totalDurationSeconds,
    })
      .then(() => {
        reset();
        onClose();
      })
      .catch((err: Error) => Alert.alert("Erreur", err.message));
  }

  function reset() {
    setTitle("");
    setInstructor("");
    setCategoryId("");
    setLevel(LEVELS[0].value);
    setDurationHours("0");
    setDurationMin("0");
    setCoverImage(null);
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
              {isEdit ? "Modifier le cours" : "Nouveau cours"}
            </Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {isEdit ? course!.title : "Remplis les informations du cours"}
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
  scrollContent: { padding: 20, gap: 20 },
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
});
