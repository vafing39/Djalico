import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ChevronLeft, Eye, EyeOff, Lock } from "lucide-react-native";
import { useState } from "react";
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

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSave() {
    if (newPassword.length < 6) {
      Alert.alert(
        t("settings.alert.passwordTooShort"),
        t("settings.alert.passwordMinLength"),
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t("common.error"), t("settings.alert.passwordMismatch"));
      return;
    }
    try {
      await updatePassword(newPassword);
      Alert.alert(
        t("settings.alert.passwordChangedTitle"),
        t("settings.alert.passwordChangedBody"),
      );
      router.back();
    } catch (err: any) {
      Alert.alert(t("common.error"), err?.message ?? t("settings.alert.cannotUpdatePassword"));
    }
  }

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
          onPress={handleSave}
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
            <View style={styles.inputRow}>
              <Lock size={16} color={COLORS.softGray} />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder={t("settings.passwordModal.newPlaceholder")}
                placeholderTextColor={COLORS.softGray}
                secureTextEntry={!showNewPassword}
                autoFocus
              />
              <TouchableOpacity onPress={() => setShowNewPassword((v) => !v)}>
                {showNewPassword ? (
                  <EyeOff size={18} color={COLORS.softGray} />
                ) : (
                  <Eye size={18} color={COLORS.softGray} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t("settings.passwordModal.confirmLabel")}</Text>
            <View
              style={[
                styles.inputRow,
                confirmPassword.length > 0 &&
                  newPassword !== confirmPassword &&
                  styles.inputRowError,
              ]}
            >
              <Lock size={16} color={COLORS.softGray} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t("settings.passwordModal.confirmPlaceholder")}
                placeholderTextColor={COLORS.softGray}
                secureTextEntry={!showConfirmPassword}
                onSubmitEditing={handleSave}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)}>
                {showConfirmPassword ? (
                  <EyeOff size={18} color={COLORS.softGray} />
                ) : (
                  <Eye size={18} color={COLORS.softGray} />
                )}
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <Text style={styles.fieldError}>{t("settings.passwordModal.mismatch")}</Text>
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
