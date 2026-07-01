import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { color } from "@/config/adminTheme";
import { useAuditLog, AuditEntry } from "@/hooks/useAuditLog";
import * as ImagePicker from "expo-image-picker";

// ─── Audit helpers ────────────────────────────────────────────────────────────

const ACTION_META: Record<string, { labelKey: string; bg: string; text: string }> =
  {
    created: { labelKey: "admin.settings.audit.created", bg: "#DCFCE7", text: "#166534" },
    updated: { labelKey: "admin.settings.audit.updated", bg: "#E9F2FF", text: "#1E4FA5" },
    deleted: { labelKey: "admin.settings.audit.deleted", bg: "#FFE7E7", text: "#B91C1C" },
  };

const ENTITY_ICON: Record<string, string> = {
  videos: "play-circle-outline",
  courses: "book-outline",
  parcours: "map-outline",
  users: "person-outline",
};

const ENTITY_LABEL_KEY: Record<string, string> = {
  videos: "admin.settings.entity.video",
  courses: "admin.settings.entity.course",
  parcours: "admin.settings.entity.parcours",
  users: "admin.settings.entity.user",
};

function formatRelative(iso: string, t: (key: string, params?: Record<string, string | number>) => string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return t("admin.settings.timeAgo.now");
  if (diff < 3600) return t("admin.settings.timeAgo.minutes", { n: Math.floor(diff / 60) });
  if (diff < 86400) return t("admin.settings.timeAgo.hours", { n: Math.floor(diff / 3600) });
  return t("admin.settings.timeAgo.days", { n: Math.floor(diff / 86400) });
}

function AuditRow({ item }: { item: AuditEntry }) {
  const { t } = useLanguage();
  const meta = ACTION_META[item.action];
  const label = meta ? t(meta.labelKey) : item.action;
  const bg = meta?.bg ?? color.border;
  const text = meta?.text ?? color.textMuted;
  const icon = ENTITY_ICON[item.entity_type] ?? "ellipse-outline";
  const etypeKey = ENTITY_LABEL_KEY[item.entity_type];
  const etype = etypeKey ? t(etypeKey) : item.entity_type;

  return (
    <View style={auditStyles.row}>
      <View style={[auditStyles.iconWrap, { backgroundColor: bg }]}>
        <Ionicons name={icon as any} size={18} color={text} />
      </View>
      <View style={auditStyles.body}>
        <View style={auditStyles.topRow}>
          <Text style={auditStyles.title} numberOfLines={1}>
            {item.entity_title}
          </Text>
          <View style={[auditStyles.badge, { backgroundColor: bg }]}>
            <Text style={[auditStyles.badgeText, { color: text }]}>
              {label}
            </Text>
          </View>
        </View>
        <Text style={auditStyles.sub}>
          {etype}
          {item.actor_name ? ` · ${item.actor_name}` : ""}
        </Text>
        <Text style={auditStyles.time}>{formatRelative(item.created_at, t)}</Text>
      </View>
    </View>
  );
}

const auditStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
    gap: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  body: { flex: 1, gap: 3 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { flex: 1, fontSize: 14, fontWeight: "700", color: color.textPrimary },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  sub: { fontSize: 12, color: color.textMuted },
  time: { fontSize: 11, color: color.softGray },
});

// ─── Setting row ──────────────────────────────────────────────────────────────

type SettingItemProps = {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  toggle?: boolean;
  value?: boolean;
  destructive?: boolean;
  loading?: boolean;
  isLast?: boolean;
};

function SettingItem({
  icon,
  iconBg,
  iconColor,
  label,
  sublabel,
  onPress,
  toggle,
  value,
  destructive,
  loading,
  isLast,
}: SettingItemProps) {
  return (
    <Pressable
      style={[styles.settingRow, !isLast && styles.settingRowBorder]}
      onPress={!toggle ? onPress : undefined}
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
        {sublabel && <Text style={styles.settingSublabel}>{sublabel}</Text>}
      </View>
      {toggle ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: color.border, true: color.yellow }}
          thumbColor={value ? color.navy : color.white}
        />
      ) : loading ? (
        <ActivityIndicator
          size="small"
          color={destructive ? color.red : color.textMuted}
        />
      ) : (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={destructive ? color.red : color.textMuted}
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

const LANGUAGES = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
] as const;

export default function Setting() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const {
    data: auditEntries = [],
    isLoading: auditLoading,
    refetch: refetchAudit,
  } = useAuditLog();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const {
    logOut,
    logoutPending,
    profile,
    updateProfile,
    updateProfilePending,
    updateEmail,
    updateEmailPending,
    updatePassword,
    updatePasswordPending,
    uploadAvatar,
    uploadAvatarPending,
  } = useAuth();

  useEffect(() => {
    if (profileModalVisible) setEditName(profile?.name ?? "");
  }, [profileModalVisible]);

  useEffect(() => {
    if (!emailModalVisible) setNewEmail("");
  }, [emailModalVisible]);

  useEffect(() => {
    if (!passwordModalVisible) {
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [passwordModalVisible]);

  const currentLang =
    LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

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
      Alert.alert(
        t("common.error"),
        err?.message ?? t("settings.alert.cannotUpdatePhoto"),
      );
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
      Alert.alert(
        t("settings.alert.invalidAddress"),
        t("settings.alert.enterValidEmail"),
      );
      return;
    }
    if (trimmed === profile?.email) {
      Alert.alert(t("settings.alert.sameEmail"), t("settings.alert.alreadyCurrentEmail"));
      return;
    }
    try {
      await updateEmail(trimmed);
      setEmailModalVisible(false);
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
      setPasswordModalVisible(false);
      Alert.alert(t("settings.alert.passwordChangedTitle"), t("settings.alert.passwordChangedBody"));
    } catch (err: any) {
      Alert.alert(
        t("common.error"),
        err?.message ?? t("settings.alert.cannotUpdatePassword"),
      );
    }
  }

  async function handleSaveProfile() {
    const trimmed = editName.trim();
    if (!trimmed) {
      Alert.alert(t("settings.alert.requiredField"), t("admin.settings.profileModal.requiredName"));
      return;
    }
    try {
      await updateProfile({ name: trimmed });
      setProfileModalVisible(false);
    } catch (err: any) {
      Alert.alert(
        t("common.error"),
        err?.message ?? t("admin.settings.profileModal.cannotUpdate"),
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <LinearGradient
        colors={[color.navyDeep, color.navy]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerEyebrow}>{t("admin.settings.eyebrow")}</Text>
        <Text style={styles.headerTitle}>{t("admin.settings.title")}</Text>

        {/* Profile card */}
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
            style={[
              styles.editAvatarBtn,
              uploadAvatarPending && { opacity: 0.5 },
            ]}
            onPress={pickAvatar}
            disabled={uploadAvatarPending}
          >
            {uploadAvatarPending ? (
              <ActivityIndicator size="small" color={color.navy} />
            ) : (
              <Ionicons name="camera-outline" size={16} color={color.navy} />
            )}
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Profil ── */}
        <Section title={t("admin.settings.sectionProfile")}>
          <SettingItem
            icon="person-outline"
            iconBg="#E9F2FF"
            iconColor="#1E88E5"
            label={t("admin.settings.editProfile")}
            onPress={() => setProfileModalVisible(true)}
          />
          <SettingItem
            icon="mail-outline"
            iconBg="#FFF3CD"
            iconColor="#F59E0B"
            label={t("admin.settings.changeEmail")}
            sublabel={profile?.email}
            onPress={() => setEmailModalVisible(true)}
          />
          <SettingItem
            icon="lock-closed-outline"
            iconBg="#F3E8FF"
            iconColor="#9333EA"
            label={t("admin.settings.changePassword")}
            onPress={() => setPasswordModalVisible(true)}
            isLast
          />
        </Section>

        {/* ── Préférences ── */}
        {/* <Section title="Préférences">
          <SettingItem
            icon="language-outline"
            iconBg="#E9F2FF"
            iconColor="#1E88E5"
            label="Langue"
            sublabel={`${currentLang.flag}  ${currentLang.name}`}
            onPress={() => setLangModalVisible(true)}
          />
          <SettingItem
            icon="moon-outline"
            iconBg="#1F2937"
            iconColor="#E5E7EB"
            label="Mode sombre"
            toggle
            value={darkMode}
            onPress={() => setDarkMode((v) => !v)}
          />
          <SettingItem
            icon="notifications-outline"
            iconBg="#DCFCE7"
            iconColor="#22C55E"
            label="Notifications"
            sublabel="Activées"
            toggle
            value={notifications}
            onPress={() => setNotifications((v) => !v)}
            isLast
          />
        </Section> */}

        {/* ── Language modal ── */}
        <Modal
          visible={langModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setLangModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setLangModalVisible(false)}
          >
            <Pressable style={styles.modalSheet} onPress={() => {}}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{t("admin.settings.langModalTitle")}</Text>
              {LANGUAGES.map((lang, i) => {
                const selected = lang.code === language;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.langRow,
                      i < LANGUAGES.length - 1 && styles.langRowBorder,
                      selected && styles.langRowSelected,
                    ]}
                    onPress={() => {
                      setLanguage(lang.code as any);
                      setLangModalVisible(false);
                    }}
                  >
                    <Text style={styles.langFlag}>{lang.flag}</Text>
                    <Text
                      style={[
                        styles.langName,
                        selected && styles.langNameSelected,
                      ]}
                    >
                      {lang.name}
                    </Text>
                    {selected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={color.yellow}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </Pressable>
          </Pressable>
        </Modal>

        {/* ── Audit log modal ── */}
        <Modal
          visible={auditModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setAuditModalVisible(false)}
        >
          <SafeAreaView style={auditModalStyles.container}>
            {/* Header */}
            <View style={auditModalStyles.header}>
              <View>
                <Text style={auditModalStyles.title}>{t("admin.settings.activityLog")}</Text>
                <Text style={auditModalStyles.sub}>
                  {auditEntries.length} {t("admin.settings.entries")}
                </Text>
              </View>
              <Pressable
                style={auditModalStyles.closeBtn}
                onPress={() => setAuditModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={color.textPrimary} />
              </Pressable>
            </View>

            {auditLoading ? (
              <ActivityIndicator style={{ marginTop: 40 }} color={color.navy} />
            ) : auditEntries.length === 0 ? (
              <View style={auditModalStyles.empty}>
                <Ionicons
                  name="document-text-outline"
                  size={48}
                  color={color.softGray}
                />
                <Text style={auditModalStyles.emptyText}>
                  {t("admin.settings.noActivity")}
                </Text>
              </View>
            ) : (
              <FlatList
                data={auditEntries}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <AuditRow item={item} />}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </SafeAreaView>
        </Modal>

        {/* ── Password modal ── */}
        <Modal
          visible={passwordModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setPasswordModalVisible(false)}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setPasswordModalVisible(false)}
          >
            <Pressable style={styles.modalSheet} onPress={() => {}}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{t("settings.passwordModal.title")}</Text>

              <View style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>{t("settings.passwordModal.newLabel")}</Text>
                <View style={styles.modalInputRow}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={16}
                    color={color.textMuted}
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder={t("settings.passwordModal.newPlaceholder")}
                    placeholderTextColor={color.textMuted}
                    secureTextEntry={!showNewPassword}
                    autoFocus
                  />
                  <Pressable onPress={() => setShowNewPassword((v) => !v)}>
                    <Ionicons
                      name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color={color.textMuted}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>
                  {t("settings.passwordModal.confirmLabel")}
                </Text>
                <View
                  style={[
                    styles.modalInputRow,
                    confirmPassword.length > 0 &&
                      newPassword !== confirmPassword &&
                      styles.modalInputRowError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={16}
                    color={color.textMuted}
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder={t("settings.passwordModal.confirmPlaceholder")}
                    placeholderTextColor={color.textMuted}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <Pressable onPress={() => setShowConfirmPassword((v) => !v)}>
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={18}
                      color={color.textMuted}
                    />
                  </Pressable>
                </View>
                {confirmPassword.length > 0 &&
                  newPassword !== confirmPassword && (
                    <Text style={styles.modalError}>
                      {t("settings.passwordModal.mismatch")}
                    </Text>
                  )}
              </View>

              <TouchableOpacity
                style={[
                  styles.modalSaveBtn,
                  updatePasswordPending && { opacity: 0.6 },
                ]}
                onPress={handleChangePassword}
                disabled={updatePasswordPending}
              >
                {updatePasswordPending ? (
                  <ActivityIndicator size="small" color={color.navy} />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={16}
                      color={color.navy}
                    />
                    <Text style={styles.modalSaveBtnText}>{t("settings.passwordModal.submit")}</Text>
                  </>
                )}
              </TouchableOpacity>
            </Pressable>
          </Pressable>
          </KeyboardAvoidingView>
        </Modal>

        {/* ── Email modal ── */}
        <Modal
          visible={emailModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setEmailModalVisible(false)}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setEmailModalVisible(false)}
          >
            <Pressable style={styles.modalSheet} onPress={() => {}}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{t("settings.emailModal.title")}</Text>

              {/* Current email */}
              <View style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>{t("settings.emailModal.currentLabel")}</Text>
                <View
                  style={[styles.modalInputRow, styles.modalInputRowDisabled]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={color.softGray}
                  />
                  <Text style={styles.modalInputDisabled}>
                    {profile?.email ?? "—"}
                  </Text>
                </View>
              </View>

              {/* New email */}
              <View style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>{t("settings.emailModal.newLabel")}</Text>
                <View style={styles.modalInputRow}>
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={color.textMuted}
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={newEmail}
                    onChangeText={setNewEmail}
                    placeholder={t("settings.emailModal.newPlaceholder")}
                    placeholderTextColor={color.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoFocus
                  />
                </View>
                <Text style={styles.modalHint}>
                  {t("settings.emailModal.hint")}
                </Text>
              </View>

              {/* Save button */}
              <TouchableOpacity
                style={[
                  styles.modalSaveBtn,
                  updateEmailPending && { opacity: 0.6 },
                ]}
                onPress={handleChangeEmail}
                disabled={updateEmailPending}
              >
                {updateEmailPending ? (
                  <ActivityIndicator size="small" color={color.navy} />
                ) : (
                  <>
                    <Ionicons
                      name="send-outline"
                      size={16}
                      color={color.navy}
                    />
                    <Text style={styles.modalSaveBtnText}>{t("settings.emailModal.submit")}</Text>
                  </>
                )}
              </TouchableOpacity>
            </Pressable>
          </Pressable>
          </KeyboardAvoidingView>
        </Modal>

        {/* ── Profile modal ── */}
        <Modal
          visible={profileModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setProfileModalVisible(false)}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setProfileModalVisible(false)}
          >
            <Pressable style={styles.modalSheet} onPress={() => {}}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{t("admin.settings.profileModal.title")}</Text>

              {/* Avatar preview */}
              <Pressable
                style={styles.modalAvatarRow}
                onPress={pickAvatar}
                disabled={uploadAvatarPending}
              >
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    style={styles.modalAvatar}
                  />
                ) : (
                  <View
                    style={[styles.modalAvatar, styles.modalAvatarPlaceholder]}
                  >
                    <Text style={styles.modalAvatarInitial}>
                      {editName?.[0]?.toUpperCase() ?? "?"}
                    </Text>
                  </View>
                )}
                <View style={styles.modalAvatarCamera}>
                  {uploadAvatarPending ? (
                    <ActivityIndicator size="small" color={color.navy} />
                  ) : (
                    <Ionicons
                      name="camera-outline"
                      size={14}
                      color={color.navy}
                    />
                  )}
                </View>
              </Pressable>

              {/* Name field */}
              <View style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>{t("admin.settings.profileModal.fullName")}</Text>
                <View style={styles.modalInputRow}>
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={color.textMuted}
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder={t("admin.settings.profileModal.namePlaceholder")}
                    placeholderTextColor={color.textMuted}
                    autoCapitalize="words"
                    autoFocus
                  />
                </View>
              </View>

              {/* Email (read-only) */}
              <View style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>{t("admin.settings.profileModal.emailLabel")}</Text>
                <View
                  style={[styles.modalInputRow, styles.modalInputRowDisabled]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={color.softGray}
                  />
                  <Text style={styles.modalInputDisabled}>
                    {profile?.email ?? "—"}
                  </Text>
                </View>
                <Text style={styles.modalHint}>
                  {t("admin.settings.profileModal.emailHint")}
                </Text>
              </View>

              {/* Save button */}
              <TouchableOpacity
                style={[
                  styles.modalSaveBtn,
                  updateProfilePending && { opacity: 0.6 },
                ]}
                onPress={handleSaveProfile}
                disabled={updateProfilePending}
              >
                {updateProfilePending ? (
                  <ActivityIndicator size="small" color={color.navy} />
                ) : (
                  <>
                    <Ionicons
                      name="save-outline"
                      size={16}
                      color={color.navy}
                    />
                    <Text style={styles.modalSaveBtnText}>{t("admin.settings.profileModal.submit")}</Text>
                  </>
                )}
              </TouchableOpacity>
            </Pressable>
          </Pressable>
          </KeyboardAvoidingView>
        </Modal>

        {/* ── Sécurité & gestion ── */}
        <Section title={t("admin.settings.sectionSecurity")}>
          <SettingItem
            icon="shield-outline"
            iconBg="#FFF3CD"
            iconColor="#F59E0B"
            label={t("admin.settings.activityLog")}
            sublabel={`${auditEntries.length} ${t("admin.settings.entries")}`}
            onPress={() => {
              refetchAudit();
              setAuditModalVisible(true);
            }}
            isLast
          />
        </Section>

        {/* ── Déconnexion ── */}
        <Section title={t("admin.settings.sectionAccount")}>
          <SettingItem
            icon="log-out-outline"
            iconBg={color.redLight}
            iconColor={color.red}
            label={t("admin.settings.logout")}
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
  container: { flex: 1, backgroundColor: color.bg },

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
    color: color.white,
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
    borderColor: color.yellow,
  },
  avatarPlaceholder: {
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: "800",
    color: color.yellow,
  },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: 16, fontWeight: "800", color: color.white },
  profileRole: { fontSize: 12, color: color.yellow, fontWeight: "600" },
  profileEmail: { fontSize: 11, color: "rgba(255,255,255,0.5)" },
  editAvatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: color.yellow,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: { paddingTop: 24, paddingHorizontal: 20 },

  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: color.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: color.card,
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
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: color.border },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: "500", color: color.textPrimary },
  settingLabelDestructive: { color: color.red, fontWeight: "600" },
  settingSublabel: { fontSize: 12, color: color.textMuted, marginTop: 1 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: color.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: color.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: color.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 14,
  },
  langRowBorder: { borderBottomWidth: 1, borderBottomColor: color.border },
  langRowSelected: {
    backgroundColor: "rgba(246,192,79,0.08)",
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  langFlag: { fontSize: 22 },
  langName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: color.textPrimary,
  },
  langNameSelected: { fontWeight: "700", color: color.navy },

  modalAvatarRow: { alignItems: "center", marginBottom: 20 },
  modalAvatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: color.yellow,
  },
  modalAvatarPlaceholder: {
    backgroundColor: color.paleBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  modalAvatarInitial: { fontSize: 28, fontWeight: "800", color: color.navy },
  modalAvatarCamera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: color.yellow,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: color.card,
  },
  modalField: { marginBottom: 16 },
  modalFieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: color.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  modalInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  modalInputRowDisabled: { backgroundColor: "#F3F4F6" },
  modalInput: { flex: 1, fontSize: 15, color: color.textPrimary },
  modalInputDisabled: { flex: 1, fontSize: 15, color: color.softGray },
  modalHint: { fontSize: 11, color: color.textMuted, marginTop: 5 },
  modalInputRowError: { borderColor: color.red },
  modalError: { fontSize: 11, color: color.red, marginTop: 5 },
  modalSaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.yellow,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 4,
  },
  modalSaveBtnText: { fontSize: 15, fontWeight: "700", color: color.navy },
});

const auditModalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
    backgroundColor: color.card,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: color.textPrimary,
    letterSpacing: -0.3,
  },
  sub: { fontSize: 12, color: color.textMuted, marginTop: 2 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: color.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { fontSize: 14, color: color.textMuted },
});
