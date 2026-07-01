import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

const C = {
  navy: "#103149",
  navyDeep: "#0A1E2E",
  yellow: "#F6C04F",
  bg: "#EEF5FB",
  card: "#FFFFFF",
  border: "#E5EDF4",
  textPrimary: "#0E2B45",
  textMuted: "#6B7280",
  softGray: "#9AA6B2",
  red: "#EF4444",
  redLight: "#FEE2E2",
  white: "#FFFFFF",
  paleBlue: "#F3F8FB",
};

const LANGUAGES = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
] as const;

// ─── Setting row ──────────────────────────────────────────────────────────────

type SettingItemProps = {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  loading?: boolean;
  destructive?: boolean;
  isLast?: boolean;
};

function SettingItem({
  icon,
  iconBg,
  iconColor,
  label,
  sublabel,
  onPress,
  loading,
  destructive,
  isLast,
}: SettingItemProps) {
  return (
    <Pressable
      style={[styles.settingRow, !isLast && styles.settingRowBorder]}
      onPress={onPress}
      android_ripple={{ color: "rgba(0,0,0,0.04)" }}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text
          style={[
            styles.settingLabel,
            destructive && styles.settingLabelDestructive,
          ]}
        >
          {label}
        </Text>
        {sublabel ? (
          <Text style={styles.settingSublabel}>{sublabel}</Text>
        ) : null}
      </View>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={destructive ? C.red : C.textMuted}
        />
      ) : (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={destructive ? C.red : C.textMuted}
        />
      )}
    </Pressable>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, t } = useLanguage();
  const {
    profile,
    logOut,
    logoutPending,
    updateEmail,
    updateEmailPending,
    updatePassword,
    updatePasswordPending,
    uploadAvatar,
    uploadAvatarPending,
  } = useAuth();

  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function closeEmailModal() {
    setEmailModalVisible(false);
    setNewEmail("");
  }

  function closePasswordModal() {
    setPasswordModalVisible(false);
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  }

  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  async function pickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("settings.alert.permissionDenied"),
        t("settings.alert.galleryAccess"),
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    try {
      await uploadAvatar(result.assets[0].uri);
    } catch (err: any) {
      Alert.alert(t("common.error"), err?.message ?? t("settings.alert.cannotUpdatePhoto"));
    }
  }

  async function handleChangeEmail() {
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert(t("settings.alert.requiredField"), t("settings.alert.enterEmail"));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      Alert.alert(t("settings.alert.invalidAddress"), t("settings.alert.enterValidEmail"));
      return;
    }
    if (trimmed === profile?.email) {
      Alert.alert(t("settings.alert.sameEmail"), t("settings.alert.alreadyCurrentEmail"));
      return;
    }
    try {
      await updateEmail(trimmed);
      closeEmailModal();
      Alert.alert(
        t("settings.alert.emailSentTitle"),
        t("settings.alert.emailSentBody", { email: trimmed }),
      );
    } catch (err: any) {
      Alert.alert(t("common.error"), err?.message ?? t("settings.alert.cannotChangeEmail"));
    }
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      Alert.alert(t("settings.alert.passwordTooShort"), t("settings.alert.passwordMinLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t("common.error"), t("settings.alert.passwordMismatch"));
      return;
    }
    try {
      await updatePassword(newPassword);
      closePasswordModal();
      Alert.alert(t("settings.alert.passwordChangedTitle"), t("settings.alert.passwordChangedBody"));
    } catch (err: any) {
      Alert.alert(t("common.error"), err?.message ?? t("settings.alert.cannotUpdatePassword"));
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <StatusBar style="light" />
      {/* ── Header ── */}
      <LinearGradient
        colors={[C.navyDeep, C.navy]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Text style={styles.headerEyebrow}>{t("settings.eyebrow")}</Text>
        <Text style={styles.headerTitle}>{t("settings.title")}</Text>

        <View style={styles.profileCard}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {profile?.name?.[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.name ?? "—"}</Text>
            <Text style={styles.profileRole}>
              {profile?.role ? t(`settings.role.${profile.role}`) : "—"}
            </Text>
            <Text style={styles.profileEmail}>{profile?.email ?? "—"}</Text>
          </View>
          <Pressable
            style={[styles.editAvatarBtn, uploadAvatarPending && { opacity: 0.5 }]}
            onPress={pickAvatar}
            disabled={uploadAvatarPending}
          >
            {uploadAvatarPending ? (
              <ActivityIndicator size="small" color={C.navy} />
            ) : (
              <Ionicons name="camera-outline" size={16} color={C.navy} />
            )}
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Profil ── */}
        <Section title={t("settings.sectionProfile")}>
          <SettingItem
            icon="person-outline"
            iconBg="#E9F2FF"
            iconColor="#1E88E5"
            label={t("settings.editProfile")}
            onPress={() => router.push("/(protected)/(tabs)/settings/editProfile")}
          />
          <SettingItem
            icon="mail-outline"
            iconBg="#FFF3CD"
            iconColor="#F59E0B"
            label={t("settings.changeEmail")}
            sublabel={profile?.email}
            onPress={() => setEmailModalVisible(true)}
          />
          <SettingItem
            icon="lock-closed-outline"
            iconBg="#F3E8FF"
            iconColor="#9333EA"
            label={t("settings.changePassword")}
            onPress={() => setPasswordModalVisible(true)}
            isLast
          />
        </Section>

        {/* ── Préférences ── */}
        <Section title={t("settings.sectionPreferences")}>
          <SettingItem
            icon="language-outline"
            iconBg="#E9F2FF"
            iconColor="#1E88E5"
            label={t("settings.language")}
            sublabel={`${currentLang.flag}  ${currentLang.name}`}
            onPress={() => router.push("/(protected)/(tabs)/settings/language")}
            isLast
          />
        </Section>

        {/* ── Email modal ── */}
        <Modal
          visible={emailModalVisible}
          transparent
          animationType="slide"
          onRequestClose={closeEmailModal}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={closeEmailModal}
            >
              <Pressable style={styles.modalSheet} onPress={() => {}}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>{t("settings.emailModal.title")}</Text>

                <View style={styles.modalField}>
                  <Text style={styles.modalFieldLabel}>{t("settings.emailModal.currentLabel")}</Text>
                  <View style={[styles.modalInputRow, styles.modalInputRowDisabled]}>
                    <Ionicons name="mail-outline" size={16} color={C.softGray} />
                    <Text style={styles.modalInputDisabled}>{profile?.email ?? "—"}</Text>
                  </View>
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalFieldLabel}>{t("settings.emailModal.newLabel")}</Text>
                  <View style={styles.modalInputRow}>
                    <Ionicons name="mail-outline" size={16} color={C.textMuted} />
                    <TextInput
                      style={styles.modalInput}
                      value={newEmail}
                      onChangeText={setNewEmail}
                      placeholder={t("settings.emailModal.newPlaceholder")}
                      placeholderTextColor={C.textMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoFocus
                    />
                  </View>
                  <Text style={styles.modalHint}>
                    {t("settings.emailModal.hint")}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.modalSaveBtn, updateEmailPending && { opacity: 0.6 }]}
                  onPress={handleChangeEmail}
                  disabled={updateEmailPending}
                >
                  {updateEmailPending ? (
                    <ActivityIndicator size="small" color={C.navy} />
                  ) : (
                    <>
                      <Ionicons name="send-outline" size={16} color={C.navy} />
                      <Text style={styles.modalSaveBtnText}>{t("settings.emailModal.submit")}</Text>
                    </>
                  )}
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </KeyboardAvoidingView>
        </Modal>

        {/* ── Password modal ── */}
        <Modal
          visible={passwordModalVisible}
          transparent
          animationType="slide"
          onRequestClose={closePasswordModal}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={closePasswordModal}
            >
              <Pressable style={styles.modalSheet} onPress={() => {}}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>{t("settings.passwordModal.title")}</Text>

                <View style={styles.modalField}>
                  <Text style={styles.modalFieldLabel}>{t("settings.passwordModal.newLabel")}</Text>
                  <View style={styles.modalInputRow}>
                    <Ionicons name="lock-closed-outline" size={16} color={C.textMuted} />
                    <TextInput
                      style={styles.modalInput}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder={t("settings.passwordModal.newPlaceholder")}
                      placeholderTextColor={C.textMuted}
                      secureTextEntry={!showNewPassword}
                      autoFocus
                    />
                    <Pressable onPress={() => setShowNewPassword((v) => !v)}>
                      <Ionicons
                        name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                        size={18}
                        color={C.textMuted}
                      />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalFieldLabel}>{t("settings.passwordModal.confirmLabel")}</Text>
                  <View
                    style={[
                      styles.modalInputRow,
                      confirmPassword.length > 0 &&
                        newPassword !== confirmPassword &&
                        styles.modalInputRowError,
                    ]}
                  >
                    <Ionicons name="lock-closed-outline" size={16} color={C.textMuted} />
                    <TextInput
                      style={styles.modalInput}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder={t("settings.passwordModal.confirmPlaceholder")}
                      placeholderTextColor={C.textMuted}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <Pressable onPress={() => setShowConfirmPassword((v) => !v)}>
                      <Ionicons
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        size={18}
                        color={C.textMuted}
                      />
                    </Pressable>
                  </View>
                  {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                    <Text style={styles.modalError}>
                      {t("settings.passwordModal.mismatch")}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.modalSaveBtn, updatePasswordPending && { opacity: 0.6 }]}
                  onPress={handleChangePassword}
                  disabled={updatePasswordPending}
                >
                  {updatePasswordPending ? (
                    <ActivityIndicator size="small" color={C.navy} />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle-outline" size={16} color={C.navy} />
                      <Text style={styles.modalSaveBtnText}>{t("settings.passwordModal.submit")}</Text>
                    </>
                  )}
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </KeyboardAvoidingView>
        </Modal>

        {/* ── Légal ── */}
        <Section title={t("settings.sectionLegal")}>
          <SettingItem
            icon="document-text-outline"
            iconBg="#E9F2FF"
            iconColor="#1E88E5"
            label={t("settings.mentions")}
            onPress={() =>
              router.push({
                pathname: "/(protected)/(tabs)/settings/legal",
                params: { type: "mentions" },
              })
            }
          />
          <SettingItem
            icon="reader-outline"
            iconBg="#FFF3CD"
            iconColor="#F59E0B"
            label={t("settings.cgu")}
            onPress={() =>
              router.push({
                pathname: "/(protected)/(tabs)/settings/legal",
                params: { type: "cgu" },
              })
            }
          />
          <SettingItem
            icon="shield-checkmark-outline"
            iconBg="#DCFCE7"
            iconColor="#22C55E"
            label={t("settings.privacy")}
            onPress={() =>
              router.push({
                pathname: "/(protected)/(tabs)/settings/legal",
                params: { type: "privacy" },
              })
            }
          />
          <SettingItem
            icon="cookie-outline"
            iconBg="#FEF3C7"
            iconColor="#D97706"
            label={t("settings.cookies")}
            onPress={() =>
              router.push({
                pathname: "/(protected)/(tabs)/settings/legal",
                params: { type: "cookies" },
              })
            }
            isLast
          />
        </Section>

        {/* ── Compte ── */}
        <Section title={t("settings.sectionAccount")}>
          <SettingItem
            icon="log-out-outline"
            iconBg={C.redLight}
            iconColor={C.red}
            label={t("settings.logout")}
            onPress={logOut}
            loading={logoutPending}
            destructive
            isLast
          />
        </Section>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerEyebrow: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.4,
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 14,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: C.yellow,
  },
  avatarPlaceholder: {
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { fontSize: 22, fontWeight: "800", color: C.yellow },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: 16, fontWeight: "800", color: C.white },
  profileRole: { fontSize: 12, color: C.yellow, fontWeight: "600" },
  profileEmail: { fontSize: 11, color: "rgba(255,255,255,0.5)" },
  editAvatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.yellow,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: { paddingTop: 24, paddingHorizontal: 20 },

  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: "500", color: C.textPrimary },
  settingLabelDestructive: { color: C.red, fontWeight: "600" },
  settingSublabel: { fontSize: 12, color: C.textMuted, marginTop: 1 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: C.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  modalField: { marginBottom: 16 },
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  modalInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  modalInputRowDisabled: { backgroundColor: "#F3F4F6" },
  modalInputRowError: { borderColor: C.red },
  modalInput: { flex: 1, fontSize: 15, color: C.textPrimary },
  modalInputDisabled: { flex: 1, fontSize: 15, color: C.softGray },
  modalHint: { fontSize: 11, color: C.textMuted, marginTop: 5 },
  modalError: { fontSize: 11, color: C.red, marginTop: 5 },
  modalSaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.yellow,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 4,
  },
  modalSaveBtnText: { fontSize: 15, fontWeight: "700", color: C.navy },
});
