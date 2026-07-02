import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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

function makeRegisterSchema(t: (key: string) => string) {
  return z
    .object({
      name: z.string().min(1, t("register.nameRequired")),
      email: z
        .string()
        .min(1, t("register.emailRequired"))
        .email(t("register.emailInvalid")),
      password: z
        .string()
        .min(1, t("register.passwordRequired"))
        .min(6, t("register.passwordMinLength")),
      confirmPassword: z.string().min(1, t("register.passwordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("register.passwordMismatch"),
      path: ["confirmPassword"],
    });
}

type RegisterFields = z.infer<ReturnType<typeof makeRegisterSchema>>;
type FieldErrors = Partial<Record<keyof RegisterFields, string>>;

export default function RegisterScreen() {
  const {
    register,
    registerPending,
    registerError,
    registerRequiresConfirmation,
    resetRegister,
  } = useAuth();
  const { t } = useLanguage();
  const registerSchema = useMemo(() => makeRegisterSchema(t), [t]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  // La mutation vit dans AuthProvider (au-dessus du Stack) : sans ce reset,
  // revenir sur cet écran après une inscription réussie réaffiche l'état de succès.
  useEffect(() => {
    return () => resetRegister();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit() {
    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof RegisterFields;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    register(result.data);
  }

  return (
    <LinearGradient
      colors={["#060F1A", color.deepBlue]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>

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
              {registerRequiresConfirmation ? (
                <View style={styles.successWrap}>
                  <Ionicons
                    name="mail-open-outline"
                    size={48}
                    color={color.yellowDark}
                  />
                  <Text style={styles.cardTitle}>
                    {t("register.confirmationTitle")}
                  </Text>
                  <Text style={styles.subtitle}>
                    {t("register.confirmationBody")}
                  </Text>
                  <Link href="/login" asChild>
                    <Pressable style={styles.linkBtn}>
                      <Text style={styles.linkText}>
                        {t("register.backToLogin")}
                      </Text>
                    </Pressable>
                  </Link>
                </View>
              ) : (
                <>
                  <Text style={styles.cardTitle}>{t("register.title")}</Text>
                  <Text style={styles.subtitle}>{t("register.subtitle")}</Text>

                  {registerError && (
                    <View style={styles.serverError}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={16}
                        color="#B91C1C"
                      />
                      <Text style={styles.serverErrorText}>
                        {registerError}
                      </Text>
                    </View>
                  )}

                  <View style={styles.field}>
                    <Text style={styles.label}>{t("register.nameLabel")}</Text>
                    <View
                      style={[
                        styles.inputWrap,
                        !!errors.name && styles.inputWrapError,
                      ]}
                    >
                      <Ionicons
                        name="person-outline"
                        size={18}
                        color={color.softGray}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder={t("register.namePlaceholder")}
                        placeholderTextColor={color.softGray}
                        value={name}
                        onChangeText={(v) => {
                          setName(v);
                          setErrors((e) => ({ ...e, name: undefined }));
                        }}
                        autoCapitalize="words"
                        returnKeyType="next"
                      />
                    </View>
                    {errors.name && (
                      <Text style={styles.fieldError}>{errors.name}</Text>
                    )}
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>
                      {t("register.emailLabel")}
                    </Text>
                    <View
                      style={[
                        styles.inputWrap,
                        !!errors.email && styles.inputWrapError,
                      ]}
                    >
                      <Ionicons
                        name="mail-outline"
                        size={18}
                        color={color.softGray}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder={t("register.emailPlaceholder")}
                        placeholderTextColor={color.softGray}
                        value={email}
                        onChangeText={(v) => {
                          setEmail(v);
                          setErrors((e) => ({ ...e, email: undefined }));
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                      />
                    </View>
                    {errors.email && (
                      <Text style={styles.fieldError}>{errors.email}</Text>
                    )}
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>
                      {t("register.passwordLabel")}
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
                      <TextInput
                        style={styles.input}
                        placeholder={t("register.passwordPlaceholder")}
                        placeholderTextColor={color.softGray}
                        value={password}
                        onChangeText={(v) => {
                          setPassword(v);
                          setErrors((e) => ({ ...e, password: undefined }));
                        }}
                        secureTextEntry={!showPassword}
                        returnKeyType="next"
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
                    {errors.password && (
                      <Text style={styles.fieldError}>{errors.password}</Text>
                    )}
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>
                      {t("register.confirmPasswordLabel")}
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
                      <TextInput
                        style={styles.input}
                        placeholder={t("register.passwordPlaceholder")}
                        placeholderTextColor={color.softGray}
                        value={confirmPassword}
                        onChangeText={(v) => {
                          setConfirmPassword(v);
                          setErrors((e) => ({
                            ...e,
                            confirmPassword: undefined,
                          }));
                        }}
                        secureTextEntry={!showPassword}
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                      />
                    </View>
                    {errors.confirmPassword && (
                      <Text style={styles.fieldError}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.btn,
                      pressed && styles.btnPressed,
                    ]}
                    onPress={handleSubmit}
                    disabled={registerPending}
                  >
                    {registerPending ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Text style={styles.btnText}>
                          {t("register.submit")}
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={18}
                          color={color.deepBlue}
                        />
                      </>
                    )}
                  </Pressable>

                  <View style={styles.footerRow}>
                    <Text style={styles.footerText}>
                      {t("register.alreadyAccount")}
                    </Text>
                    <Link href="/login" asChild>
                      <Pressable hitSlop={8}>
                        <Text style={styles.linkText}>
                          {t("register.loginLink")}
                        </Text>
                      </Pressable>
                    </Link>
                  </View>
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
    gap: 20,
  },

  backBtn: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginLeft: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
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

  successWrap: { alignItems: "center", gap: 12 },

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

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 4,
  },
  footerText: {
    fontSize: 13,
    color: color.softGray,
  },
  linkBtn: { alignSelf: "center", marginTop: 4 },
  linkText: {
    fontSize: 13,
    fontWeight: "700",
    color: color.deepBlue,
  },
});
