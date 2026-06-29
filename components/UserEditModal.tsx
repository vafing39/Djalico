import { useContext, useEffect, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, View } from "react-native";
import ModalHeader from "@/components/admin/ModalHeader";
import FormField from "@/components/admin/FormField";
import PickerField from "@/components/admin/PickerField";
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
        <ModalHeader
          title={isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          subtitle={isEdit ? user!.name : "Remplis les informations du compte"}
          isBusy={isBusy}
          submitLabel={isEdit ? "Enregistrer" : "Créer"}
          submitIcon={isEdit ? "save-outline" : "checkmark"}
          onClose={onClose}
          onSubmit={handleSubmit}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <FormField
              label="Nom"
              required
              value={name}
              onChangeText={setName}
              placeholder="Nom complet"
            />

            <FormField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="adresse@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isEdit}
            />

            {!isEdit && (
              <FormField
                label="Mot de passe"
                required
                value={password}
                onChangeText={setPassword}
                placeholder="6 caractères minimum"
                secureTextEntry
              />
            )}

            <PickerField
              label="Rôle"
              selectedValue={role}
              onValueChange={(v) => setRole(v as User["role"])}
              items={ROLES}
            />

            <PickerField
              label="Niveau"
              selectedValue={level}
              onValueChange={(v) => setLevel(v as User["level"])}
              items={LEVELS}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
  scrollContent: { padding: 20 },
  form: { gap: 16 },
});
