import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
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

// ─── Validation ───────────────────────────────────────────────────────────────

function makeLoginSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t("login.emailRequired"))
      .email(t("login.emailInvalid")),
    password: z
      .string()
      .min(1, t("login.passwordRequired"))
      .min(6, t("login.passwordMinLength")),
  });
}

type LoginFields = z.infer<ReturnType<typeof makeLoginSchema>>;
type FieldErrors = Partial<Record<keyof LoginFields, string>>;

// ─── Decorative background notes ────────────────────────────────────────────────
// A hand-tuned constellation of musical glyphs scattered behind the form. Each
// note varies along five axes (glyph, size, opacity, rotation, color, position)
// so the field reads as organic rather than tiled. Purely decorative — the layer
// uses pointerEvents="none" and is hidden from assistive tech.

type Pct = `${number}%`;

type DecoNote = {
  glyph: string;
  size: number;
  opacity: number;
  rotate: string;
  color: string;
  pos: { top?: Pct; bottom?: Pct; left?: Pct; right?: Pct };
};

const DECO_NOTES: DecoNote[] = [
  // ── Top-left ──
  {
    glyph: "𝄞",
    size: 58,
    opacity: 0.45,
    rotate: "-12deg",
    color: "#FF6B6B",
    pos: { top: "4%", left: "6%" },
  },
  {
    glyph: "♪",
    size: 24,
    opacity: 0.55,
    rotate: "18deg",
    color: color.yellowDark,
    pos: { top: "13%", left: "24%" },
  },
  {
    glyph: "♬",
    size: 36,
    opacity: 0.38,
    rotate: "-28deg",
    color: "#4ECDC4",
    pos: { top: "21%", left: "3%" },
  },
  {
    glyph: "♩",
    size: 18,
    opacity: 0.5,
    rotate: "8deg",
    color: "#A78BFA",
    pos: { top: "2%", left: "42%" },
  },
  {
    glyph: "♫",
    size: 28,
    opacity: 0.42,
    rotate: "-20deg",
    color: "#FF8C42",
    pos: { top: "32%", left: "14%" },
  },
  {
    glyph: "𝄢",
    size: 42,
    opacity: 0.35,
    rotate: "34deg",
    color: "#38BDF8",
    pos: { top: "8%", left: "58%" },
  },

  // ── Top-right ──
  {
    glyph: "♫",
    size: 46,
    opacity: 0.45,
    rotate: "22deg",
    color: color.yellow,
    pos: { top: "7%", right: "6%" },
  },
  {
    glyph: "♪",
    size: 26,
    opacity: 0.55,
    rotate: "-18deg",
    color: "#FF3CAC",
    pos: { top: "18%", right: "22%" },
  },
  {
    glyph: "𝄢",
    size: 50,
    opacity: 0.32,
    rotate: "10deg",
    color: "#2ECC71",
    pos: { top: "28%", right: "4%" },
  },
  {
    glyph: "♩",
    size: 20,
    opacity: 0.58,
    rotate: "-30deg",
    color: color.yellowDark,
    pos: { top: "15%", right: "38%" },
  },
  {
    glyph: "♬",
    size: 32,
    opacity: 0.4,
    rotate: "40deg",
    color: "#9B59B6",
    pos: { top: "5%", right: "52%" },
  },
  {
    glyph: "𝄞",
    size: 22,
    opacity: 0.48,
    rotate: "-14deg",
    color: "#FF6B6B",
    pos: { top: "36%", right: "16%" },
  },

  // ── Center (slightly lower — behind the card) ──
  {
    glyph: "♫",
    size: 22,
    opacity: 0.25,
    rotate: "30deg",
    color: "#4ECDC4",
    pos: { top: "45%", left: "8%" },
  },
  {
    glyph: "♬",
    size: 26,
    opacity: 0.22,
    rotate: "-8deg",
    color: "#A78BFA",
    pos: { top: "50%", right: "9%" },
  },
  {
    glyph: "♪",
    size: 18,
    opacity: 0.24,
    rotate: "22deg",
    color: "#FF8C42",
    pos: { top: "43%", left: "52%" },
  },
  {
    glyph: "♩",
    size: 30,
    opacity: 0.2,
    rotate: "-42deg",
    color: "#38BDF8",
    pos: { top: "58%", left: "34%" },
  },

  // ── Bottom-left ──
  {
    glyph: "𝄞",
    size: 44,
    opacity: 0.44,
    rotate: "14deg",
    color: "#FF3CAC",
    pos: { bottom: "8%", left: "5%" },
  },
  {
    glyph: "♩",
    size: 16,
    opacity: 0.58,
    rotate: "40deg",
    color: color.yellow,
    pos: { bottom: "29%", left: "36%" },
  },
  {
    glyph: "♬",
    size: 52,
    opacity: 0.35,
    rotate: "-10deg",
    color: "#9B59B6",
    pos: { bottom: "6%", left: "38%" },
  },
  {
    glyph: "♫",
    size: 22,
    opacity: 0.48,
    rotate: "28deg",
    color: "#FF6B6B",
    pos: { bottom: "36%", left: "8%" },
  },

  // ── Bottom-right ──
  {
    glyph: "♫",
    size: 52,
    opacity: 0.4,
    rotate: "-16deg",
    color: "#38BDF8",
    pos: { bottom: "6%", right: "7%" },
  },
  {
    glyph: "♬",
    size: 32,
    opacity: 0.55,
    rotate: "26deg",
    color: color.yellowDark,
    pos: { bottom: "17%", right: "10%" },
  },
  {
    glyph: "♪",
    size: 20,
    opacity: 0.6,
    rotate: "45deg",
    color: "#4ECDC4",
    pos: { bottom: "33%", right: "5%" },
  },
  {
    glyph: "𝄢",
    size: 38,
    opacity: 0.4,
    rotate: "-34deg",
    color: "#A78BFA",
    pos: { bottom: "12%", right: "38%" },
  },
  {
    glyph: "♩",
    size: 24,
    opacity: 0.5,
    rotate: "16deg",
    color: "#FF3CAC",
    pos: { bottom: "40%", right: "18%" },
  },
  {
    glyph: "𝄞",
    size: 28,
    opacity: 0.44,
    rotate: "-24deg",
    color: "#FF8C42",
    pos: { bottom: "26%", right: "52%" },
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const { login, loginPending, loginError } = useAuth();
  const { t } = useLanguage();
  const loginSchema = useMemo(() => makeLoginSchema(t), [t]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  function handleSubmit() {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LoginFields;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    login(result.data);
  }

  return (
    <LinearGradient
      colors={["#060F1A", color.deepBlue]}
      style={styles.gradient}
    >
      {/* ── Decorative musical notes: fixed, non-interactive, bottom of z-stack ── */}
      <View
        style={styles.notesLayer}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {DECO_NOTES.map((note, i) => (
          <Text
            key={i}
            style={[
              styles.note,
              note.pos,
              {
                fontSize: note.size,
                opacity: note.opacity,
                color: note.color,
                transform: [{ rotate: note.rotate }],
              },
            ]}
          >
            {note.glyph}
          </Text>
        ))}
      </View>

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
            {/* ── Brand ── */}
            <View style={styles.brand}>
              <View style={styles.logoWrap}>
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={styles.logo}
                />
              </View>
              <Text style={styles.appName}>Djalico</Text>
              <Text style={styles.tagline}>{t("login.tagline")}</Text>
            </View>

            {/* ── Form card ── */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t("login.title")}</Text>

              {/* Server error */}
              {loginError && (
                <View style={styles.serverError}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color="#B91C1C"
                  />
                  <Text style={styles.serverErrorText}>{loginError}</Text>
                </View>
              )}

              {/* Email */}
              <View style={styles.field}>
                <Text style={styles.label}>{t("login.emailLabel")}</Text>
                <View
                  style={[
                    styles.inputWrap,
                    emailFocused && styles.inputWrapFocused,
                    !!errors.email && styles.inputWrapError,
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
                    placeholder={t("login.emailPlaceholder")}
                    placeholderTextColor={color.softGray}
                    value={email}
                    onChangeText={(v) => {
                      setEmail(v);
                      setErrors((e) => ({ ...e, email: undefined }));
                    }}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
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

              {/* Password */}
              <View style={styles.field}>
                <Text style={styles.label}>{t("login.passwordLabel")}</Text>
                <View
                  style={[
                    styles.inputWrap,
                    passwordFocused && styles.inputWrapFocused,
                    !!errors.password && styles.inputWrapError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={passwordFocused ? color.yellowDark : color.softGray}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={t("login.passwordPlaceholder")}
                    placeholderTextColor={color.softGray}
                    value={password}
                    onChangeText={(v) => {
                      setPassword(v);
                      setErrors((e) => ({ ...e, password: undefined }));
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
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

              {/* Forgot password */}
              <Link href="/forgot-password" asChild>
                <Pressable hitSlop={8} style={styles.forgotPasswordBtn}>
                  <Text style={styles.forgotPasswordText}>
                    {t("login.forgotPassword")}
                  </Text>
                </Pressable>
              </Link>

              {/* Submit */}
              <Pressable
                style={({ pressed }) => [
                  styles.btn,
                  pressed && styles.btnPressed,
                ]}
                onPress={handleSubmit}
                disabled={loginPending}
              >
                {loginPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.btnText}>{t("login.submit")}</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={color.deepBlue}
                    />
                  </>
                )}
              </Pressable>

              {/* Register */}
              <View style={styles.registerRow}>
                <Text style={styles.registerText}>
                  {t("login.noAccount")}
                </Text>
                <Link href="/register" asChild>
                  <Pressable hitSlop={8}>
                    <Text style={styles.registerLink}>
                      {t("login.registerLink")}
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>{t("login.footer")}</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    gap: 28,
  },

  // Decorative notes layer (fills the gradient, sits behind all content, never scrolls)
  notesLayer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  // Base note style; per-note dynamic values (size/opacity/color/rotation/position)
  // are merged inline at render time.
  note: { position: "absolute", fontWeight: "700" },

  // Brand
  brand: { alignItems: "center", gap: 10 },
  logoWrap: {
    width: 88,
    height: 88,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 6,
  },
  logo: { width: "100%", height: "100%" },
  appName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    fontWeight: "500",
  },

  // Card
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
  },

  // Server error
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

  // Fields
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
  eyeBtn: { paddingLeft: 8 },
  fieldError: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
    marginLeft: 2,
  },

  // Forgot password
  forgotPasswordBtn: { alignSelf: "flex-end", marginTop: -6 },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.yellowDark,
  },

  // Register
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 4,
  },
  registerText: {
    fontSize: 13,
    color: color.softGray,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: "700",
    color: color.deepBlue,
  },

  // Button
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

  // Footer
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
});
