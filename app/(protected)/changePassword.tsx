import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ChevronLeft, Eye, EyeOff, Lock } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

function makeChangePasswordSchema(t: (key: string) => string) {
  return z
    .object({
      newPassword: z
        .string()
        .min(1, t("newPassword.passwordRequired"))
        .min(6, t("settings.alert.passwordMinLength")),
      confirmPassword: z.string().min(1, t("newPassword.passwordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("settings.passwordModal.mismatch"),
      path: ["confirmPassword"],
    });
}

type ChangePasswordFields = z.infer<ReturnType<typeof makeChangePasswordSchema>>;

const COLORS = {
  deepBlue: "#0E2B45",
  navy: "#103149",
  paleBlue: "#F3F8FB",
  bgGradientTop: "#ECF6FF",
  yellowDark: "#F6C04F",
  softGray: "#9AA6B2",
  white: "#FFFFFF",
  border: "#E5E7EB",
  red: "#EF4444",
};

export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updatePassword, updatePasswordPending } = useAuth();
  const { t } = useLanguage();
  const changePasswordSchema = useMemo(() => makeChangePasswordSchema(t), [t]);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFields>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updatePassword(data.newPassword);
      Alert.alert(
        t("settings.alert.passwordChangedTitle"),
        t("settings.alert.passwordChangedBody"),
      );
      router.back();
    } catch (err: any) {
      Alert.alert(t("common.error"), err?.message ?? t("settings.alert.cannotUpdatePassword"));
    }
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={20} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("settings.passwordModal.title")}</Text>
        <TouchableOpacity
          style={[styles.saveBtn, updatePasswordPending && styles.saveBtnDisabled]}
          onPress={onSubmit}
          disabled={updatePasswordPending}
        >
          {updatePasswordPending ? (
            <ActivityIndicator size="small" color={COLORS.navy} />
          ) : (
            <Text style={styles.saveBtnText}>{t("settings.passwordModal.submit")}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>{t("settings.passwordModal.newLabel")}</Text>
            <View style={[styles.inputRow, errors.newPassword && styles.inputRowError]}>
              <Lock size={16} color={COLORS.softGray} />
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={t("settings.passwordModal.newPlaceholder")}
                    placeholderTextColor={COLORS.softGray}
                    secureTextEntry={!showNewPassword}
                    autoFocus
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowNewPassword((v) => !v)}>
                {showNewPassword ? (
                  <EyeOff size={18} color={COLORS.softGray} />
                ) : (
                  <Eye size={18} color={COLORS.softGray} />
                )}
              </TouchableOpacity>
            </View>
            {errors.newPassword && (
              <Text style={styles.fieldError}>{errors.newPassword.message}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t("settings.passwordModal.confirmLabel")}</Text>
            <View
              style={[styles.inputRow, errors.confirmPassword && styles.inputRowError]}
            >
              <Lock size={16} color={COLORS.softGray} />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={t("settings.passwordModal.confirmPlaceholder")}
                    placeholderTextColor={COLORS.softGray}
                    secureTextEntry={!showConfirmPassword}
                    onSubmitEditing={onSubmit}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)}>
                {showConfirmPassword ? (
                  <EyeOff size={18} color={COLORS.softGray} />
                ) : (
                  <Eye size={18} color={COLORS.softGray} />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.fieldError}>{errors.confirmPassword.message}</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgGradientTop,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: COLORS.deepBlue,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.yellowDark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.navy,
  },
  scroll: {
    paddingBottom: 40,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.navy,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  inputRowError: {
    borderColor: COLORS.red,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.deepBlue,
  },
  fieldError: {
    fontSize: 12,
    color: COLORS.red,
    fontWeight: "500",
  },
});
