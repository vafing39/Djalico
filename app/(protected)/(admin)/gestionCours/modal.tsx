import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const C = {
  navy: "#103149", white: "#FFFFFF", textPrimary: "#1F2937", textMuted: "#6B7280",
  yellow: "#F6C04F", red: "#F44336", bg: "#F7FAFF", card: "#FFFFFF", border: "#E5E7EB",
};

const CATEGORIES = ["Guitare", "Saxophone", "Piano", "Percussions", "Balafon", "Jazz"];
const LEVELS = [
  { label: "Débutant",      value: "beginner"     },
  { label: "Intermédiaire", value: "intermediate" },
  { label: "Expert",        value: "expert"       },
];

export default function ModalView({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [title, setTitle]           = useState("");
  const [instructor, setInstructor] = useState("");
  const [category, setCategory]     = useState(CATEGORIES[0]);
  const [level, setLevel]           = useState(LEVELS[0].value);
  const [duration, setDuration]     = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "Autorise l'accès à ta galerie pour choisir une image.");
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
    // TODO: wire to API
    reset();
    onClose();
  }

  function reset() {
    setTitle(""); setInstructor(""); setCategory(CATEGORIES[0]);
    setLevel(LEVELS[0].value); setDuration(""); setCoverImage(null);
  }

  function handleClose() { reset(); onClose(); }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Nouveau cours</Text>
            <Text style={styles.headerSub}>Remplis les informations du cours</Text>
          </View>
          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <Ionicons name="close" size={20} color={C.textMuted} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <Field label="Titre" required>
              <TextInput style={styles.input} placeholder="Ex : Fingerstyle acoustique" placeholderTextColor={C.textMuted} value={title} onChangeText={setTitle} />
            </Field>

            <Field label="Instructeur" required>
              <TextInput style={styles.input} placeholder="Ex : Marc Dupont" placeholderTextColor={C.textMuted} value={instructor} onChangeText={setInstructor} />
            </Field>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Field label="Catégorie">
                  <View style={styles.pickerWrap}>
                    <Picker selectedValue={category} onValueChange={(v) => setCategory(v as string)} style={styles.picker}>
                      {CATEGORIES.map((c) => <Picker.Item key={c} label={c} value={c} />)}
                    </Picker>
                  </View>
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Niveau">
                  <View style={styles.pickerWrap}>
                    <Picker selectedValue={level} onValueChange={(v) => setLevel(v as string)} style={styles.picker}>
                      {LEVELS.map((l) => <Picker.Item key={l.value} label={l.label} value={l.value} />)}
                    </Picker>
                  </View>
                </Field>
              </View>
            </View>

            <Field label="Durée totale">
              <TextInput style={styles.input} placeholder="Ex : 4h 30min" placeholderTextColor={C.textMuted} value={duration} onChangeText={setDuration} />
            </Field>

            <Field label="Image de couverture">
              <Pressable style={styles.imagePicker} onPress={pickImage}>
                {coverImage ? (
                  <>
                    <Image source={{ uri: coverImage }} style={styles.imagePreview} />
                    <View style={styles.imageOverlay}>
                      <Ionicons name="camera-outline" size={20} color="#fff" />
                      <Text style={styles.imageOverlayText}>Changer</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.imageIconWrap}>
                      <Ionicons name="image-outline" size={28} color={C.navy} />
                    </View>
                    <Text style={styles.imagePickerTitle}>Choisir une image</Text>
                    <Text style={styles.imagePickerSub}>Format 16:9 recommandé</Text>
                  </>
                )}
              </Pressable>
            </Field>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Annuler</Text>
            </Pressable>
            <Pressable style={styles.submitBtn} onPress={handleSubmit}>
              <Ionicons name="checkmark" size={18} color={C.navy} />
              <Text style={styles.submitText}>Créer le cours</Text>
            </Pressable>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}{required && <Text style={styles.required}> *</Text>}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontSize: 20, fontWeight: "800", color: C.textPrimary, letterSpacing: -0.3 },
  headerSub: { fontSize: 13, color: C.textMuted, marginTop: 3 },
  closeBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.bg, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: C.border },
  scrollContent: { padding: 20, gap: 20 },
  form: { gap: 16 },
  row: { flexDirection: "row", gap: 12 },
  field: { gap: 7 },
  label: { fontSize: 13, fontWeight: "700", color: C.textPrimary },
  required: { color: C.red },
  input: { backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, color: C.textPrimary, borderWidth: 1, borderColor: C.border },
  pickerWrap: { backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  picker: { color: C.textPrimary },
  imagePicker: { height: 160, borderRadius: 16, borderWidth: 1.5, borderColor: C.border, borderStyle: "dashed", backgroundColor: C.bg, overflow: "hidden", alignItems: "center", justifyContent: "center", gap: 8 },
  imagePreview: { width: "100%", height: "100%", resizeMode: "cover" },
  imageOverlay: { position: "absolute", bottom: 10, right: 10, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(0,0,0,0.55)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  imageOverlayText: { fontSize: 12, fontWeight: "600", color: "#fff" },
  imageIconWrap: { width: 52, height: 52, borderRadius: 14, backgroundColor: "#E9F2FF", justifyContent: "center", alignItems: "center" },
  imagePickerTitle: { fontSize: 14, fontWeight: "700", color: C.textPrimary },
  imagePickerSub: { fontSize: 12, color: C.textMuted },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  cancelBtn: { flex: 1, paddingVertical: 16, borderRadius: 16, borderWidth: 1.5, borderColor: C.border, alignItems: "center" },
  cancelText: { fontSize: 15, fontWeight: "600", color: C.textMuted },
  submitBtn: { flex: 2, flexDirection: "row", paddingVertical: 16, borderRadius: 16, backgroundColor: C.yellow, alignItems: "center", justifyContent: "center", gap: 8 },
  submitText: { fontSize: 15, fontWeight: "700", color: C.navy },
});
