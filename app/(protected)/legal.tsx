import { LEGAL_CONTENT } from "@/constants/legalContent";
import { useLanguage } from "@/hooks/useLanguage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

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
  white: "#FFFFFF",
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LegalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { type } = useLocalSearchParams<{ type: string }>();
  const content = LEGAL_CONTENT[type ?? "mentions"] ?? LEGAL_CONTENT.mentions;

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <StatusBar style="light" />
      {/* Header */}
      <LinearGradient
        colors={[C.navyDeep, C.navy]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 14 }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={C.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {content.heading}
        </Text>
        <View style={styles.backBtn} />
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.updated}>{content.updated}</Text>

        {content.sections.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t("legal.footer")}{"\n"}
            <Text style={styles.footerEmail}>{t("legal.footerEmail")}</Text>
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: C.white,
    marginHorizontal: 8,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  updated: {
    fontSize: 12,
    color: C.softGray,
    marginBottom: 24,
    fontStyle: "italic",
  },

  section: {
    marginBottom: 24,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.navy,
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 14,
    color: C.textMuted,
    lineHeight: 22,
  },

  footer: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  footerText: {
    fontSize: 13,
    color: C.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  footerEmail: {
    color: C.navy,
    fontWeight: "600",
  },
});
