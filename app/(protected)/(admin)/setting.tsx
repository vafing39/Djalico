import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "@/contexts/LanguageContext";

// ── Placeholder — replace with auth context later ─────────────────────────────
const ADMIN = {
  name: "Kamal Cheikh",
  role: "Administrateur",
  email: "kamal@djalico.com",
  avatar:
    "https://images.unsplash.com/photo-1603415526960-f7e0328d13db?q=80&w=200",
};

const C = {
  navy: "#103149",
  navyDeep: "#0B2035",
  white: "#FFFFFF",
  textPrimary: "#1F2937",
  textMuted: "#6B7280",
  yellow: "#F6C04F",
  red: "#F44336",
  redLight: "#FFE7E7",
  bg: "#F7FAFF",
  card: "#FFFFFF",
  border: "#E5E7EB",
};

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
          trackColor={{ false: C.border, true: C.yellow }}
          thumbColor={value ? C.navy : C.white}
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

const LANGUAGES = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
] as const;

export default function Setting() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const { language, setLanguage } = useLanguage();

  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <LinearGradient
        colors={[C.navyDeep, C.navy]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerEyebrow}>Administration</Text>
        <Text style={styles.headerTitle}>Réglages</Text>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: ADMIN.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{ADMIN.name}</Text>
            <Text style={styles.profileRole}>{ADMIN.role}</Text>
            <Text style={styles.profileEmail}>{ADMIN.email}</Text>
          </View>
          <Pressable style={styles.editAvatarBtn}>
            <Ionicons name="camera-outline" size={16} color={C.navy} />
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Profil ── */}
        <Section title="Profil">
          <SettingItem
            icon="person-outline"
            iconBg="#E9F2FF"
            iconColor="#1E88E5"
            label="Modifier le profil"
          />
          <SettingItem
            icon="mail-outline"
            iconBg="#FFF3CD"
            iconColor="#F59E0B"
            label="Changer l'email"
            sublabel={ADMIN.email}
          />
          <SettingItem
            icon="lock-closed-outline"
            iconBg="#F3E8FF"
            iconColor="#9333EA"
            label="Modifier mot de passe"
            isLast
          />
        </Section>

        {/* ── Préférences ── */}
        <Section title="Préférences">
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
        </Section>

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
              <Text style={styles.modalTitle}>Langue</Text>
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
                      <Ionicons name="checkmark" size={18} color={C.yellow} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </Pressable>
          </Pressable>
        </Modal>

        {/* ── Sécurité & gestion ── */}
        <Section title="Sécurité & gestion">
          <SettingItem
            icon="people-outline"
            iconBg="#E9F2FF"
            iconColor="#1E88E5"
            label="Gérer les rôles utilisateurs"
          />
          <SettingItem
            icon="shield-outline"
            iconBg="#FFF3CD"
            iconColor="#F59E0B"
            label="Journal d'activité"
            isLast
          />
        </Section>

        {/* ── Déconnexion ── */}
        <Section title="Compte">
          <SettingItem
            icon="log-out-outline"
            iconBg={C.redLight}
            iconColor={C.red}
            label="Se déconnecter"
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
    fontSize: 24,
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
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 14,
  },
  langRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  langRowSelected: { backgroundColor: "rgba(246,192,79,0.08)", borderRadius: 12, paddingHorizontal: 8 },
  langFlag: { fontSize: 22 },
  langName: { flex: 1, fontSize: 15, fontWeight: "500", color: C.textPrimary },
  langNameSelected: { fontWeight: "700", color: C.navy },
});
