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

function makeEmailSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t("forgotPassword.emailRequired"))
      .email(t("forgotPassword.emailInvalid")),
  });
}

export default function ForgotPasswordScreen() {
  const {
    requestPasswordReset,
    requestPasswordResetPending,
    requestPasswordResetError,
    requestPasswordResetSuccess,
    resetRequestPasswordReset,
  } = useAuth();
  const { t } = useLanguage();
  const emailSchema = useMemo(() => makeEmailSchema(t), [t]);

  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  // La mutation vit dans AuthProvider (au-dessus du Stack) : sans ce reset,
  // revenir sur cet écran après un envoi réussi réaffiche l'état de succès.
  useEffect(() => {
    return () => resetRequestPasswordReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit() {
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setFieldError(result.error.issues[0]?.message ?? null);
      return;
    }
    setFieldError(null);
    requestPasswordReset(result.data.email);
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
              {requestPasswordResetSuccess ? (
                <View style={styles.successWrap}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={48}
                    color={color.yellowDark}
                  />
                  <Text style={styles.cardTitle}>
                    {t("forgotPassword.successTitle")}
                  </Text>
                  <Text style={styles.subtitle}>
                    {t("forgotPassword.successBody")}
                  </Text>
                  <Link href="/login" asChild>
                    <Pressable style={styles.linkBtn}>
                      <Text style={styles.linkText}>
                        {t("forgotPassword.backToLogin")}
                      </Text>
                    </Pressable>
                  </Link>
                </View>
              ) : (
                <>
                  <Text style={styles.cardTitle}>
                    {t("forgotPassword.title")}
                  </Text>
                  <Text style={styles.subtitle}>
                    {t("forgotPassword.subtitle")}
                  </Text>

                  {requestPasswordResetError && (
                    <View style={styles.serverError}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={16}
                        color="#B91C1C"
                      />
                      <Text style={styles.serverErrorText}>
                        {requestPasswordResetError}
                      </Text>
                    </View>
                  )}

                  <View style={styles.field}>
                    <Text style={styles.label}>
                      {t("forgotPassword.emailLabel")}
                    </Text>
                    <View
                      style={[
                        styles.inputWrap,
                        emailFocused && styles.inputWrapFocused,
                        !!fieldError && styles.inputWrapError,
                      ]}
                    >
                      <Ionicons
                        name="mail-outline"
                        size={18}
                        color={emailFocused ? color.yellowDark : color.softGray}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder={t("forgotPassword.emailPlaceholder")}
                        placeholderTextColor={color.softGray}
                        value={email}
                        onChangeText={(v) => {
                          setEmail(v);
                          setFieldError(null);
                        }}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                      />
                    </View>
                    {fieldError && (
                      <Text style={styles.fieldError}>{fieldError}</Text>
                    )}
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.btn,
                      pressed && styles.btnPressed,
                    ]}
                    onPress={handleSubmit}
                    disabled={requestPasswordResetPending}
                  >
                    {requestPasswordResetPending ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Text style={styles.btnText}>
                          {t("forgotPassword.submit")}
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={18}
                          color={color.deepBlue}
                        />
                      </>
                    )}
                  </Pressable>

                  <Link href="/login" asChild>
                    <Pressable style={styles.linkBtn}>
                      <Text style={styles.linkText}>
                        {t("forgotPassword.backToLogin")}
                      </Text>
                    </Pressable>
                  </Link>
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
  inputWrapFocused: {
    borderColor: color.yellowDark,
    backgroundColor: "#FFFFFF",
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

  linkBtn: { alignSelf: "center", marginTop: 4 },
  linkText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.deepBlue,
  },
});
