import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
  } = useAuth();

  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

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
            icon="lock-closed-outline"
            iconBg="#F3E8FF"
            iconColor="#9333EA"
            label={t("settings.changePassword")}
            onPress={() => router.push("/(protected)/changePassword")}
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

        {/* ── Légal ── */}
        <Section title={t("settings.sectionLegal")}>
          <SettingItem
            icon="document-text-outline"
            iconBg="#E9F2FF"
            iconColor="#1E88E5"
            label={t("settings.mentions")}
            onPress={() =>
              router.push({
                pathname: "/(protected)/legal",
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
                pathname: "/(protected)/legal",
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
                pathname: "/(protected)/legal",
                params: { type: "privacy" },
              })
            }
          />
          <SettingItem
            icon="browsers-outline"
            iconBg="#FEF3C7"
            iconColor="#D97706"
            label={t("settings.cookies")}
            onPress={() =>
              router.push({
                pathname: "/(protected)/legal",
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
});
