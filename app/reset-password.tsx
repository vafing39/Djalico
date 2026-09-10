import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
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

function makeCodeSchema(t: (key: string) => string) {
  return z.object({
    otp: z
      .string()
      .min(1, t("resetPassword.codeRequired"))
      .regex(/^\d{6}$/, t("resetPassword.codeInvalid")),
  });
}

type CodeFields = z.infer<ReturnType<typeof makeCodeSchema>>;
type FieldErrors = Partial<Record<keyof CodeFields, string>>;

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const {
    verifyPasswordResetOtp,
    verifyPasswordResetOtpPending,
    requestPasswordReset,
    requestPasswordResetPending,
  } = useAuth();
  const { t } = useLanguage();
  const codeSchema = useMemo(() => makeCodeSchema(t), [t]);

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email) return;
    const result = codeSchema.safeParse({ otp });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof CodeFields;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitError(null);
    try {
      await verifyPasswordResetOtp({ email, token: result.data.otp });
      router.replace("/new-password");
    } catch (err: any) {
      setSubmitError(err?.message ?? null);
    }
  }

  function handleResend() {
    if (!email) return;
    requestPasswordReset(email);
  }

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
              {!email ? (
                <View style={styles.centerWrap}>
                  <Ionicons
                    name="close-circle-outline"
                    size={48}
                    color="#EF4444"
                  />
                  <Text style={styles.cardTitle}>
                    {t("resetPassword.missingEmailTitle")}
                  </Text>
                  <Text style={styles.subtitle}>
                    {t("resetPassword.missingEmailBody")}
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
                    {t("resetPassword.title")}
                  </Text>
                  <Text style={styles.subtitle}>
                    {t("resetPassword.subtitle", { email })}
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
                      {t("resetPassword.codeLabel")}
                    </Text>
                    <View
                      style={[
                        styles.inputWrap,
                        !!errors.otp && styles.inputWrapError,
                      ]}
                    >
                      <Ionicons
                        name="key-outline"
                        size={18}
                        color={color.softGray}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, styles.otpInput]}
                        placeholder={t("resetPassword.codePlaceholder")}
                        placeholderTextColor={color.softGray}
                        value={otp}
                        onChangeText={(v) => {
                          setOtp(v.replace(/[^0-9]/g, "").slice(0, 6));
                          setErrors((e) => ({ ...e, otp: undefined }));
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                      />
                    </View>
                    {errors.otp && (
                      <Text style={styles.fieldError}>{errors.otp}</Text>
                    )}
                    <Pressable
                      onPress={handleResend}
                      disabled={requestPasswordResetPending}
                      style={styles.resendBtn}
                    >
                      {requestPasswordResetPending ? (
                        <ActivityIndicator color={color.deepBlue} size="small" />
                      ) : (
                        <Text style={styles.resendText}>
                          {t("resetPassword.resendCode")}
                        </Text>
                      )}
                    </Pressable>
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.btn,
                      pressed && styles.btnPressed,
                    ]}
                    onPress={handleSubmit}
                    disabled={verifyPasswordResetOtpPending}
                  >
                    {verifyPasswordResetOtpPending ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.btnText}>
                        {t("resetPassword.submit")}
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
  otpInput: {
    letterSpacing: 4,
    fontWeight: "700",
  },
  fieldError: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
    marginLeft: 2,
  },
  resendBtn: { alignSelf: "flex-end", marginTop: 2 },
  resendText: {
    fontSize: 12,
    fontWeight: "600",
    color: color.deepBlue,
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
