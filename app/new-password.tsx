import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { color } from "@/config/color";
import { isStrongPassword } from "@/utils/passwordRules";

function makeNewPasswordSchema(t: (key: string) => string) {
  return z
    .object({
      password: z
        .string()
        .min(1, t("newPassword.passwordRequired"))
        .refine(isStrongPassword, t("password.rule")),
      confirmPassword: z.string().min(1, t("newPassword.passwordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("newPassword.passwordMismatch"),
      path: ["confirmPassword"],
    });
}

type NewPasswordFields = z.infer<ReturnType<typeof makeNewPasswordSchema>>;

export default function NewPasswordScreen() {
  const { session, updatePassword, updatePasswordPending, logOut } = useAuth();
  const { t } = useLanguage();
  const newPasswordSchema = useMemo(() => makeNewPasswordSchema(t), [t]);

  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFields>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      await updatePassword(data.password);
      Alert.alert(
        t("newPassword.successTitle"),
        t("newPassword.successBody"),
      );
      logOut();
    } catch (err: any) {
      setSubmitError(err?.message ?? null);
    }
  });

  return (
    <LinearGradient
      colors={["#060F1A", color.deepBlue]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              {!session ? (
                <View style={styles.centerWrap}>
                  <Ionicons
                    name="close-circle-outline"
                    size={48}
                    color="#EF4444"
                  />
                  <Text style={styles.cardTitle}>
                    {t("newPassword.noSessionTitle")}
                  </Text>
                  <Text style={styles.subtitle}>
                    {t("newPassword.noSessionBody")}
                  </Text>
                  <Link href="/forgot-password" asChild>
                    <Pressable style={styles.linkBtn}>
                      <Text style={styles.linkText}>
                        {t("resetPassword.requestNewCode")}
                      </Text>
                    </Pressable>
                  </Link>
                </View>
              ) : (
                <>
                  <Text style={styles.cardTitle}>
                    {t("newPassword.title")}
                  </Text>
                  <Text style={styles.subtitle}>
                    {t("newPassword.subtitle")}
                  </Text>

                  {submitError && (
                    <View style={styles.serverError}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={16}
                        color="#B91C1C"
                      />
                      <Text style={styles.serverErrorText}>{submitError}</Text>
                    </View>
                  )}

                  <View style={styles.field}>
                    <Text style={styles.label}>
                      {t("newPassword.passwordLabel")}
                    </Text>
                    <View
                      style={[
                        styles.inputWrap,
                        !!errors.password && styles.inputWrapError,
                      ]}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={18}
                        color={color.softGray}
                        style={styles.inputIcon}
                      />
                      <Controller
                        control={control}
                        name="password"
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextInput
                            style={styles.input}
                            placeholder={t("newPassword.passwordPlaceholder")}
                            placeholderTextColor={color.softGray}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry={!showPassword}
                            returnKeyType="next"
                          />
                        )}
                      />
                      <Pressable
                        onPress={() => setShowPassword((v) => !v)}
                        hitSlop={8}
                        style={styles.eyeBtn}
                      >
                        <Ionicons
                          name={showPassword ? "eye-off-outline" : "eye-outline"}
                          size={18}
                          color={color.softGray}
                        />
                      </Pressable>
                    </View>
                    {errors.password ? (
                      <Text style={styles.fieldError}>{errors.password.message}</Text>
                    ) : (
                      <Text style={styles.fieldHint}>{t("password.rule")}</Text>
                    )}
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>
                      {t("newPassword.confirmPasswordLabel")}
                    </Text>
                    <View
                      style={[
                        styles.inputWrap,
                        !!errors.confirmPassword && styles.inputWrapError,
                      ]}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={18}
                        color={color.softGray}
                        style={styles.inputIcon}
                      />
                      <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextInput
                            style={styles.input}
                            placeholder={t("newPassword.passwordPlaceholder")}
                            placeholderTextColor={color.softGray}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry={!showPassword}
                            returnKeyType="done"
                            onSubmitEditing={onSubmit}
                          />
                        )}
                      />
                    </View>
                    {errors.confirmPassword && (
                      <Text style={styles.fieldError}>
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.btn,
                      pressed && styles.btnPressed,
                    ]}
                    onPress={onSubmit}
                    disabled={updatePasswordPending}
                  >
                    {updatePasswordPending ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.btnText}>
                        {t("newPassword.submit")}
                      </Text>
                    )}
                  </Pressable>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    gap: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 10,
  },
  centerWrap: { alignItems: "center", gap: 12, paddingVertical: 12 },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: color.deepBlue,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: color.softGray,
    lineHeight: 20,
    textAlign: "center",
  },

  serverError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  serverErrorText: {
    flex: 1,
    fontSize: 13,
    color: "#B91C1C",
    fontWeight: "500",
  },

  field: { gap: 7 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: color.deepBlue,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.paleBlue,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapError: {
    borderColor: "#EF4444",
    backgroundColor: "#FFF5F5",
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: color.deepBlue,
    height: "100%",
  },
  eyeBtn: { paddingLeft: 8 },
  fieldError: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
    marginLeft: 2,
  },
  fieldHint: {
    fontSize: 12,
    color: color.softGray,
    marginLeft: 2,
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: color.yellowDark,
    borderRadius: 14,
    height: 54,
    marginTop: 4,
    shadowColor: color.yellowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 4,
  },
  btnPressed: { opacity: 0.85 },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    color: color.deepBlue,
    letterSpacing: 0.3,
  },

  linkBtn: { alignSelf: "center", marginTop: 4 },
  linkText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.deepBlue,
  },
});
