import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "@/contexts/userContext";
import type { User } from "@/types";
import { color, LEVELS } from "@/config/adminTheme";

const ROLES: { label: string; value: User["role"] }[] = [
  { label: "Élève",      value: "eleve"      },
  { label: "Professeur", value: "professeur" },
  { label: "Admin",      value: "admin"      },
];

type Props = {
  user: User | null;
  visible: boolean;
  onClose: () => void;
};

export default function UserEditModal({ user, visible, onClose }: Props) {
  const { createUser, updateUser, isCreating, isUpdating } = useContext(UserContext);
  const isEdit = !!user;
  const isBusy = isCreating || isUpdating;

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [role,     setRole]     = useState<User["role"]>("eleve");
  const [level,    setLevel]    = useState<User["level"]>("beginner");

  useEffect(() => {
    if (!visible) return;
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setLevel(user.level);
    } else {
      setName(""); setEmail(""); setPassword("");
      setRole("eleve"); setLevel("beginner");
    }
  }, [visible, user]);

  function handleSubmit() {
    if (!name.trim()) {
      Alert.alert("Champ requis", "Le nom est obligatoire.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Champ requis", "L'email est obligatoire.");
      return;
    }
    if (!isEdit && password.length < 6) {
      Alert.alert("Mot de passe trop court", "Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const action = isEdit
      ? updateUser(user!.id, { name: name.trim(), role, level })
      : createUser({ name: name.trim(), email: email.trim(), password, role, level });

    action.then(onClose).catch((err: Error) => Alert.alert("Erreur", err.message));
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color={color.red} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {isEdit ? user!.name : "Remplis les informations du compte"}
            </Text>
          </View>
          <Pressable
            style={[styles.saveBtn, isBusy && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isBusy}
          >
            {isBusy ? (
              <ActivityIndicator color={color.navy} size="small" />
            ) : (
              <>
                <Ionicons
                  name={isEdit ? "save-outline" : "checkmark"}
                  size={15}
                  color={color.navy}
                />
                <Text style={styles.saveBtnText}>
                  {isEdit ? "Enregistrer" : "Créer"}
                </Text>
              </>
            )}
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <Field label="Nom" required>
              <TextInput
                style={styles.input}
                placeholder="Nom complet"
                placeholderTextColor={color.textMuted}
                value={name}
                onChangeText={setName}
              />
            </Field>

            <Field label="Email">
              <TextInput
                style={[styles.input, isEdit && styles.inputDisabled]}
                placeholder="adresse@email.com"
                placeholderTextColor={color.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isEdit}
              />
            </Field>

            {!isEdit && (
              <Field label="Mot de passe" required>
                <TextInput
                  style={styles.input}
                  placeholder="6 caractères minimum"
                  placeholderTextColor={color.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </Field>
            )}

            <Field label="Rôle">
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={role}
                  onValueChange={(v) => setRole(v as User["role"])}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {ROLES.map((r) => (
                    <Picker.Item
                      key={r.value}
                      label={r.label}
                      value={r.value}
                      color={color.white}
                    />
                  ))}
                </Picker>
              </View>
            </Field>

            <Field label="Niveau">
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={level}
                  onValueChange={(v) => setLevel(v as User["level"])}
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
  saveBtn: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: color.yellow,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  saveBtnText: { fontSize: 13, fontWeight: "700", color: color.navy },
  scrollContent: { padding: 20 },
  form: { gap: 16 },
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
  inputDisabled: {
    opacity: 0.5,
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
});
