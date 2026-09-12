import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import ModalHeader from "@/components/admin/ModalHeader";
import FormField from "@/components/admin/FormField";
import PickerField from "@/components/admin/PickerField";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUsers } from "@/hooks/useUsers";
import { useCategories } from "@/hooks/useCategories";
import { useLanguage } from "@/hooks/useLanguage";
import type { User } from "@/types";
import { color, LEVELS } from "@/config/adminTheme";
import { isStrongPassword } from "@/utils/passwordRules";

const ROLE_VALUES: User["role"][] = ["eleve", "professeur", "admin"];

function makeUserSchema(t: (key: string) => string, isEdit: boolean) {
  return z.object({
    name: z.string().trim().min(1, t("admin.modals.user.nameRequired")),
    email: z.string().trim().min(1, t("admin.modals.user.emailRequired")),
    password: isEdit
      ? z.string()
      : z
          .string()
          .min(1, t("admin.modals.user.passwordRequired"))
          .refine(isStrongPassword, t("password.rule")),
    role: z.string(),
    level: z.string(),
    instrumentIds: z.array(z.string()),
  });
}

type UserFormFields = z.infer<ReturnType<typeof makeUserSchema>>;

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
    deleteUser,
    isCreating,
    isUpdating,
    isUpdatingInstruments,
    isDeleting,
  } = useUsers();
  const { categories } = useCategories();
  const { t } = useLanguage();
  const isEdit = !!user;
  const isPendingReview = user?.status === "pending_review";
  const isBusy = isCreating || isUpdating || isUpdatingInstruments || isDeleting;
  const roles = ROLE_VALUES.map((value) => ({ label: t(`settings.role.${value}`), value }));
  const levels = LEVELS.map((l) => ({ label: t(`common.level.${l.value}`), value: l.value }));

  const userSchema = useMemo(() => makeUserSchema(t, isEdit), [t, isEdit]);

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
  } = useForm<UserFormFields>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "eleve",
      level: "beginner",
      instrumentIds: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!visible) return;
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        level:
          user.status === "pending_review" && user.requested_level
            ? user.requested_level
            : user.level,
        instrumentIds: user.user_instruments.map((ui) => ui.category.id),
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: "eleve",
        level: "beginner",
        instrumentIds: [],
      });
    }
  }, [visible, user, reset]);

  const handleSubmit = handleFormSubmit(
    async (data) => {
      try {
        if (isEdit) {
          await updateUser(user!.id, {
            name: data.name,
            role: data.role as User["role"],
            level: data.level as User["level"],
            ...(isPendingReview && { status: "active" }),
          });
          await updateUserInstruments(user!.id, data.instrumentIds);
        } else {
          await createUser({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role as User["role"],
            level: data.level as User["level"],
          });
        }
        onClose();
      } catch (err: any) {
        Alert.alert(t("common.error"), err.message);
      }
    },
    (formErrors) => {
      const firstError = Object.values(formErrors)[0];
      if (firstError?.message) {
        Alert.alert(t("settings.alert.requiredField"), firstError.message);
      }
    },
  );

  function handleReject() {
    if (!user) return;
    Alert.alert(
      t("admin.modals.user.rejectConfirmTitle"),
      t("admin.modals.user.rejectConfirmBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("admin.modals.user.reject"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(user.id);
              onClose();
            } catch (err: any) {
              Alert.alert(t("common.error"), err.message);
            }
          },
        },
      ],
    );
  }

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

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
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
              <Pressable
                style={styles.rejectBtn}
                onPress={handleReject}
                disabled={isBusy}
              >
                <Text style={styles.rejectBtnText}>
                  {t("admin.modals.user.reject")}
                </Text>
              </Pressable>
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

            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <FormField
                  label={t("admin.modals.user.name")}
                  required
                  value={value}
                  onChangeText={onChange}
                  placeholder={t("admin.modals.user.namePlaceholder")}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <FormField
                  label={t("admin.modals.user.email")}
                  value={value}
                  onChangeText={onChange}
                  placeholder={t("admin.modals.user.emailPlaceholder")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isEdit}
                />
              )}
            />

            {!isEdit && (
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                  <FormField
                    label={t("admin.modals.user.password")}
                    required
                    value={value}
                    onChangeText={onChange}
                    placeholder={t("settings.passwordModal.newPlaceholder")}
                    secureTextEntry
                    hint={t("password.rule")}
                  />
                )}
              />
            )}

            <Controller
              control={control}
              name="role"
              render={({ field: { value, onChange } }) => (
                <PickerField
                  label={t("admin.form.role")}
                  selectedValue={value}
                  onValueChange={onChange}
                  items={roles}
                />
              )}
            />

            <Controller
              control={control}
              name="level"
              render={({ field: { value, onChange } }) => (
                <PickerField
                  label={t("admin.form.level")}
                  selectedValue={value}
                  onValueChange={onChange}
                  items={levels}
                />
              )}
            />

            {isEdit && (
              <Controller
                control={control}
                name="instrumentIds"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.instrumentsField}>
                    <Text style={styles.instrumentsLabel}>
                      {t("admin.modals.user.instrument")}
                    </Text>
                    <View style={styles.chipGrid}>
                      {categories.map((cat) => {
                        const selected = value.includes(cat.id);
                        return (
                          <Pressable
                            key={cat.id}
                            style={[styles.chip, selected && styles.chipSelected]}
                            onPress={() =>
                              onChange(
                                selected
                                  ? value.filter((id) => id !== cat.id)
                                  : [...value, cat.id],
                              )
                            }
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
              />
            )}
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
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
  rejectBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#EF4444",
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#EF4444",
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
