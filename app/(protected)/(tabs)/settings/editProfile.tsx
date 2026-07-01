import { AuthContext } from "@/contexts/authContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useRouter } from "expo-router";
import { Camera, ChevronLeft, Mail, Save, User } from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  deepBlue: "#0E2B45",
  navy: "#103149",
  paleBlue: "#F3F8FB",
  bgGradientTop: "#ECF6FF",
  yellow: "#FFD66B",
  yellowDark: "#F6C04F",
  softGray: "#9AA6B2",
  white: "#FFFFFF",
  border: "#E5E7EB",
  inputBg: "#FAFBFC",
  textMuted: "#6B7280",
  red: "#EF4444",
};

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, updateProfilePending } = useContext(AuthContext);
  const { t } = useLanguage();

  const [name, setName] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
    }
  }, [profile]);

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert(t("settings.alert.requiredField"), t("admin.settings.profileModal.requiredName"));
      return;
    }
    try {
      await updateProfile({ name: trimmed });
      router.back();
    } catch (err: any) {
      Alert.alert(t("common.error"), err?.message ?? t("admin.settings.profileModal.cannotUpdate"));
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={20} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("admin.settings.profileModal.title")}</Text>
        <TouchableOpacity
          style={[styles.saveBtn, updateProfilePending && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={updateProfilePending}
        >
          {updateProfilePending ? (
            <ActivityIndicator size="small" color={COLORS.navy} />
          ) : (
            <>
              <Save size={15} color={COLORS.navy} />
              <Text style={styles.saveBtnText}>{t("admin.settings.profileModal.submit")}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={40} color={COLORS.softGray} />
            </View>
          )}
          <TouchableOpacity style={styles.cameraBtn}>
            <Camera size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Role badge */}
        {profile?.role && (
          <View style={styles.roleBadgeWrapper}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {t(`settings.role.${profile.role}`)}
              </Text>
            </View>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>{t("admin.settings.profileModal.fullName")}</Text>
            <View style={styles.inputRow}>
              <User size={16} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={t("admin.settings.profileModal.namePlaceholder")}
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t("admin.settings.profileModal.emailLabel")}</Text>
            <View style={[styles.inputRow, styles.inputRowDisabled]}>
              <Mail size={16} color={COLORS.softGray} />
              <Text style={styles.inputDisabled}>{profile?.email ?? ""}</Text>
            </View>
            <Text style={styles.hint}>{t("admin.settings.profileModal.emailHint")}</Text>
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.paleBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.navy,
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
  avatarSection: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 12,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.paleBlue,
    borderWidth: 3,
    borderColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    marginLeft: 24,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.yellowDark,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  roleBadgeWrapper: {
    alignItems: "center",
    marginBottom: 28,
  },
  roleBadge: {
    backgroundColor: COLORS.yellowDark,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.navy,
  },
  form: {
    paddingHorizontal: 20,
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
  inputRowDisabled: {
    backgroundColor: COLORS.inputBg,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.deepBlue,
  },
  inputDisabled: {
    flex: 1,
    fontSize: 15,
    color: COLORS.softGray,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
