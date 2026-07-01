import { color } from "@/config/color";
import { useLanguage } from "@/hooks/useLanguage";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ChevronLeft, Check, Globe } from "lucide-react-native";
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
  ...color,
  white: "#FFFFFF",
  navyDeep: "#0A1E2E",
  card: "#FFFFFF",
  border: "#E5EDF4",
  textPrimary: "#0E2B45",
  textMuted: "#6B7280",
};

export default function LanguageSettings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language: currentLanguage, setLanguage, t } = useLanguage();

  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const selectLanguage = (languageCode: string) => {
    setLanguage(languageCode as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <StatusBar style="light" />
      {/* Header */}
      <LinearGradient
        colors={[C.navyDeep, C.navy]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={20} color={C.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t("settings.language.title")}</Text>
          <Text style={styles.subtitle}>{t("settings.language.subtitle")}</Text>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.languagesList}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  currentLanguage === language.code &&
                    styles.selectedLanguageItem,
                ]}
                onPress={() => selectLanguage(language.code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text
                    style={[
                      styles.languageName,
                      currentLanguage === language.code &&
                        styles.selectedLanguageName,
                    ]}
                  >
                    {language.name}
                  </Text>
                </View>
                {currentLanguage === language.code && (
                  <Check size={20} color={C.navy} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Globe size={24} color={C.yellowDark} />
            <Text style={styles.infoTitle}>
              {t("settings.language.changeTitle")}
            </Text>
            <Text style={styles.infoText}>
              {t("settings.language.changeDesc")}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgGradientTop,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: C.white,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  languagesList: {
    backgroundColor: C.card,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  selectedLanguageItem: {
    backgroundColor: color.yellowDark,
  },
  languageInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
    color: C.textPrimary,
  },
  selectedLanguageName: {
    fontWeight: "700",
    color: C.navy,
  },
  infoSection: {
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: C.deepBlue,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.white,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 20,
  },
  bottomSpace: {
    height: 40,
  },
});
