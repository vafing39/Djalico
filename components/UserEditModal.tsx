import { useContext, useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ModalHeader from "@/components/admin/ModalHeader";
import FormField from "@/components/admin/FormField";
import PickerField from "@/components/admin/PickerField";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "@/contexts/userContext";
import { useCategories } from "@/hooks/useCategories";
import { useLanguage } from "@/hooks/useLanguage";
import type { User } from "@/types";
import { color, LEVELS } from "@/config/adminTheme";

const ROLE_VALUES: User["role"][] = ["eleve", "professeur", "admin"];

type Props = {
  user: User | null;
  visible: boolean;
  onClose: () => void;
};

export default function UserEditModal({ user, visible, onClose }: Props) {
  const {
    createUser,
    updateUser,
    updateUserInstruments,
    isCreating,
    isUpdating,
    isUpdatingInstruments,
  } = useContext(UserContext);
  const { categories } = useCategories();
  const { t } = useLanguage();
  const isEdit = !!user;
  const isPendingReview = user?.status === "pending_review";
  const isBusy = isCreating || isUpdating || isUpdatingInstruments;
  const roles = ROLE_VALUES.map((value) => ({ label: t(`settings.role.${value}`), value }));
  const levels = LEVELS.map((l) => ({ label: t(`common.level.${l.value}`), value: l.value }));

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [role,     setRole]     = useState<User["role"]>("eleve");
  const [level,    setLevel]    = useState<User["level"]>("beginner");
  const [instrumentIds, setInstrumentIds] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) return;
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setLevel(
        user.status === "pending_review" && user.requested_level
          ? user.requested_level
          : user.level,
      );
      setInstrumentIds(user.user_instruments.map((ui) => ui.category.id));
    } else {
      setName(""); setEmail(""); setPassword("");
      setRole("eleve"); setLevel("beginner"); setInstrumentIds([]);
    }
  }, [visible, user]);

  function toggleInstrument(categoryId: string) {
    setInstrumentIds((ids) =>
      ids.includes(categoryId)
        ? ids.filter((id) => id !== categoryId)
        : [...ids, categoryId],
    );
  }

  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert(t("settings.alert.requiredField"), t("admin.modals.user.nameRequired"));
      return;
    }
    if (!email.trim()) {
      Alert.alert(t("settings.alert.requiredField"), t("admin.modals.user.emailRequired"));
      return;
    }
    if (!isEdit && password.length < 6) {
      Alert.alert(t("settings.alert.passwordTooShort"), t("settings.alert.passwordMinLength"));
      return;
    }

    try {
      if (isEdit) {
        await updateUser(user!.id, {
          name: name.trim(),
          role,
          level,
          ...(isPendingReview && { status: "active" }),
        });
        await updateUserInstruments(user!.id, instrumentIds);
      } else {
        await createUser({ name: name.trim(), email: email.trim(), password, role, level });
      }
      onClose();
    } catch (err: any) {
      Alert.alert(t("common.error"), err.message);
    }
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
          title={isEdit ? t("admin.modals.user.editTitle") : t("admin.modals.user.addTitle")}
          subtitle={isEdit ? user!.name : t("admin.modals.user.newSubtitle")}
          isBusy={isBusy}
          submitLabel={
            isPendingReview
              ? t("admin.modals.user.validateSubmit")
              : isEdit
                ? t("common.save")
                : t("admin.form.create")
          }
          submitIcon={isPendingReview ? "checkmark-circle" : isEdit ? "save-outline" : "checkmark"}
          onClose={onClose}
          onSubmit={handleSubmit}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            {isPendingReview && (
              <View style={styles.pendingNotice}>
                <Text style={styles.pendingNoticeText}>
                  {t("admin.modals.user.pendingNotice")}
                </Text>
              </View>
            )}

            {isPendingReview && (
              <View style={styles.onboardingInfo}>
                <Text style={styles.onboardingInfoTitle}>
                  {t("admin.modals.user.onboardingInfoTitle")}
                </Text>
                <View style={styles.onboardingInfoRow}>
                  <Text style={styles.onboardingInfoLabel}>
                    {t("admin.modals.user.birthDate")}
                  </Text>
                  <Text style={styles.onboardingInfoValue}>
                    {user!.birth_date ?? "—"}
                  </Text>
                </View>
                <View style={styles.onboardingInfoRow}>
                  <Text style={styles.onboardingInfoLabel}>
                    {t("admin.modals.user.phone")}
                  </Text>
                  <Text style={styles.onboardingInfoValue}>
                    {user!.phone ?? "—"}
                  </Text>
                </View>
                <View style={styles.onboardingInfoRow}>
                  <Text style={styles.onboardingInfoLabel}>
                    {t("admin.modals.user.requestedLevel")}
                  </Text>
                  <Text style={styles.onboardingInfoValue}>
                    {user!.requested_level
                      ? t(`common.level.${user!.requested_level}`)
                      : "—"}
                  </Text>
                </View>
                <View style={styles.onboardingInfoRow}>
                  <Text style={styles.onboardingInfoLabel}>
                    {t("admin.modals.user.goal")}
                  </Text>
                  <Text style={styles.onboardingInfoValue}>
                    {user!.learning_goal ?? "—"}
                  </Text>
                </View>
              </View>
            )}

            <FormField
              label={t("admin.modals.user.name")}
              required
              value={name}
              onChangeText={setName}
              placeholder={t("admin.modals.user.namePlaceholder")}
            />

            <FormField
              label={t("admin.modals.user.email")}
              value={email}
              onChangeText={setEmail}
              placeholder={t("admin.modals.user.emailPlaceholder")}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isEdit}
            />

            {!isEdit && (
              <FormField
                label={t("admin.modals.user.password")}
                required
                value={password}
                onChangeText={setPassword}
                placeholder={t("settings.passwordModal.newPlaceholder")}
                secureTextEntry
              />
            )}

            <PickerField
              label={t("admin.form.role")}
              selectedValue={role}
              onValueChange={(v) => setRole(v as User["role"])}
              items={roles}
            />

            <PickerField
              label={t("admin.form.level")}
              selectedValue={level}
              onValueChange={(v) => setLevel(v as User["level"])}
              items={levels}
            />

            {isEdit && (
              <View style={styles.instrumentsField}>
                <Text style={styles.instrumentsLabel}>
                  {t("admin.modals.user.instrument")}
                </Text>
                <View style={styles.chipGrid}>
                  {categories.map((cat) => {
                    const selected = instrumentIds.includes(cat.id);
                    return (
                      <Pressable
                        key={cat.id}
                        style={[styles.chip, selected && styles.chipSelected]}
                        onPress={() => toggleInstrument(cat.id)}
                      >
                        <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                        <Text
                          style={[
                            styles.chipText,
                            selected && styles.chipTextSelected,
                          ]}
                        >
                          {cat.title}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
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
  pendingNotice: {
    backgroundColor: "#FFF3CD",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F6C04F",
  },
  pendingNoticeText: {
    fontSize: 13,
    color: "#92610A",
    fontWeight: "500",
    lineHeight: 18,
  },
  onboardingInfo: {
    backgroundColor: color.card,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: color.border,
  },
  onboardingInfoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: color.deepBlue,
    marginBottom: 2,
  },
  onboardingInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  onboardingInfoLabel: {
    fontSize: 13,
    color: color.textMuted,
  },
  onboardingInfoValue: {
    fontSize: 13,
    color: color.textPrimary,
    fontWeight: "500",
    flexShrink: 1,
    textAlign: "right",
  },

  instrumentsField: { gap: 8 },
  instrumentsLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: color.textPrimary,
  },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: color.card,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: color.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    borderColor: color.yellow,
    backgroundColor: "#FFF7E6",
  },
  chipEmoji: { fontSize: 15 },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.textPrimary,
  },
  chipTextSelected: { color: color.deepBlue },
});
