import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MY_COURSES, PARCOURS_DETAILS } from "@/data/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────

type VideoEntry = {
  key: string;
  title: string;
  description: string;
  parcoursId: string;
  courseId: string;
};

function createEntry(): VideoEntry {
  return { key: Date.now().toString() + Math.random(), title: "", description: "", parcoursId: "", courseId: "" };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PARCOURS_LIST = Object.values(PARCOURS_DETAILS);

function getCoursesForParcours(parcoursId: string) {
  if (!parcoursId) return MY_COURSES;
  const p = PARCOURS_DETAILS[parcoursId];
  if (!p) return MY_COURSES;
  const ids = p.courses.map((s) => s.courseId);
  return MY_COURSES.filter((c) => ids.includes(c.id));
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const C = {
  navy:        "#103149",
  navyDeep:    "#0B2035",
  white:       "#FFFFFF",
  textPrimary: "#1F2937",
  textMuted:   "#6B7280",
  yellow:      "#F6C04F",
  bg:          "#F7FAFF",
  card:        "#FFFFFF",
  border:      "#E5E7EB",
  red:         "#F44336",
};

// ─── Single video entry card ───────────────────────────────────────────────────

function VideoEntryCard({
  entry,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: {
  entry: VideoEntry;
  index: number;
  canRemove: boolean;
  onUpdate: (patch: Partial<VideoEntry>) => void;
  onRemove: () => void;
}) {
  const availableCourses = getCoursesForParcours(entry.parcoursId);

  return (
    <View style={styles.entryCard}>
      {/* Card header */}
      <View style={styles.entryHeader}>
        <View style={styles.entryIndex}>
          <Text style={styles.entryIndexText}>{index + 1}</Text>
        </View>
        <Text style={styles.entryTitle}>Vidéo {index + 1}</Text>
        {canRemove && (
          <Pressable style={styles.removeBtn} onPress={onRemove}>
            <Ionicons name="trash-outline" size={16} color={C.red} />
          </Pressable>
        )}
      </View>

      {/* Upload zone */}
      <Pressable style={styles.uploadZone}>
        <Ionicons name="cloud-upload-outline" size={24} color={C.navy} />
        <Text style={styles.uploadTitle}>Importer la vidéo</Text>
        <Text style={styles.uploadSub}>MP4, MOV — max 500 Mo</Text>
      </Pressable>

      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>Titre <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Ex : Les gammes pentatoniques"
          placeholderTextColor={C.textMuted}
          value={entry.title}
          onChangeText={(v) => onUpdate({ title: v })}
        />
      </View>

      {/* Parcours */}
      <View style={styles.field}>
        <Text style={styles.label}>Parcours</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={entry.parcoursId}
            onValueChange={(v) => onUpdate({ parcoursId: v as string, courseId: "" })}
            style={styles.picker}
          >
            <Picker.Item label="— Tous les parcours —" value="" />
            {PARCOURS_LIST.map((p) => (
              <Picker.Item key={p.id} label={p.title} value={p.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Course (filtered by parcours) */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Cours <Text style={styles.required}>*</Text>
          {entry.parcoursId ? (
            <Text style={styles.labelHint}>  ({availableCourses.length} dans ce parcours)</Text>
          ) : null}
        </Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={entry.courseId}
            onValueChange={(v) => onUpdate({ courseId: v as string })}
            style={styles.picker}
          >
            <Picker.Item label="— Sélectionner un cours —" value="" />
            {availableCourses.map((c) => (
              <Picker.Item key={c.id} label={c.title} value={c.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Décris le contenu de la vidéo…"
          placeholderTextColor={C.textMuted}
          value={entry.description}
          onChangeText={(v) => onUpdate({ description: v })}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function ModalView({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [entries, setEntries] = useState<VideoEntry[]>([createEntry()]);

  function addEntry() {
    setEntries((prev) => [...prev, createEntry()]);
  }

  function removeEntry(key: string) {
    setEntries((prev) => prev.filter((e) => e.key !== key));
  }

  function updateEntry(key: string, patch: Partial<VideoEntry>) {
    setEntries((prev) => prev.map((e) => (e.key === key ? { ...e, ...patch } : e)));
  }

  function handleSubmit() {
    // TODO: wire to API
    setEntries([createEntry()]);
    onClose();
  }

  function handleClose() {
    setEntries([createEntry()]);
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
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Ajouter des vidéos</Text>
            <Text style={styles.headerSub}>{entries.length} vidéo{entries.length > 1 ? "s" : ""} à publier</Text>
          </View>
          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <Ionicons name="close" size={20} color={C.textMuted} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Video entries ── */}
          {entries.map((entry, i) => (
            <VideoEntryCard
              key={entry.key}
              entry={entry}
              index={i}
              canRemove={entries.length > 1}
              onUpdate={(patch) => updateEntry(entry.key, patch)}
              onRemove={() => removeEntry(entry.key)}
            />
          ))}

          {/* ── Add another ── */}
          <Pressable style={styles.addMoreBtn} onPress={addEntry}>
            <Ionicons name="add-circle-outline" size={20} color={C.navy} />
            <Text style={styles.addMoreText}>Ajouter une autre vidéo</Text>
          </Pressable>

          {/* ── Submit ── */}
          <View style={styles.actionRow}>
            <Pressable style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Annuler</Text>
            </Pressable>
            <Pressable style={styles.submitBtn} onPress={handleSubmit}>
              <Ionicons name="cloud-upload-outline" size={18} color={C.navy} />
              <Text style={styles.submitText}>
                Publier {entries.length > 1 ? `${entries.length} vidéos` : "la vidéo"}
              </Text>
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
  container: { flex: 1, backgroundColor: C.bg },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontSize: 20, fontWeight: "800", color: C.textPrimary, letterSpacing: -0.3 },
  headerSub: { fontSize: 13, color: C.textMuted, marginTop: 3 },
  closeBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.bg, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: C.border },

  scrollContent: { padding: 16, gap: 16 },

  // Entry card
  entryCard: { backgroundColor: C.white, borderRadius: 20, padding: 16, gap: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  entryHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  entryIndex: { width: 26, height: 26, borderRadius: 8, backgroundColor: C.navy, justifyContent: "center", alignItems: "center" },
  entryIndexText: { fontSize: 12, fontWeight: "800", color: C.white },
  entryTitle: { flex: 1, fontSize: 15, fontWeight: "700", color: C.textPrimary },
  removeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#FFE7E7", justifyContent: "center", alignItems: "center" },

  // Upload zone
  uploadZone: { backgroundColor: C.bg, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, borderStyle: "dashed", paddingVertical: 20, alignItems: "center", gap: 6 },
  uploadTitle: { fontSize: 14, fontWeight: "600", color: C.textPrimary },
  uploadSub: { fontSize: 11, color: C.textMuted },

  // Form fields
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: "700", color: C.textPrimary },
  labelHint: { fontSize: 11, fontWeight: "400", color: C.textMuted },
  required: { color: C.red },
  input: { backgroundColor: C.bg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, color: C.textPrimary, borderWidth: 1, borderColor: C.border },
  inputMultiline: { height: 90, paddingTop: 13 },
  pickerWrap: { backgroundColor: C.bg, borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  picker: { color: C.textPrimary },

  // Add more
  addMoreBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16, borderWidth: 1.5, borderColor: C.navy, borderStyle: "dashed" },
  addMoreText: { fontSize: 14, fontWeight: "700", color: C.navy },

  // Actions
  actionRow: { flexDirection: "row", gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 16, borderRadius: 16, borderWidth: 1.5, borderColor: C.border, alignItems: "center" },
  cancelText: { fontSize: 15, fontWeight: "600", color: C.textMuted },
  submitBtn: { flex: 2, flexDirection: "row", paddingVertical: 16, borderRadius: 16, backgroundColor: C.yellow, alignItems: "center", justifyContent: "center", gap: 8 },
  submitText: { fontSize: 15, fontWeight: "700", color: C.navy },
});
