import { color } from "@/config/color";
import { useLanguage } from "@/contexts/LanguageContext";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Header() {
  const { t } = useLanguage();
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerEyebrow}>{t("saves.library")}</Text>
        <Text style={styles.headerTitle}>{t("saves.favorites")}</Text>
      </View>
      <View style={styles.headerCount}>
        <Text style={styles.headerCountText}>0</Text>
      </View>
    </View>
  );
}

function EmptyState() {
  const { t } = useLanguage();
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Feather name="bookmark" size={36} color={color.softGray} />
      </View>
      <Text style={styles.emptyTitle}>{t("saves.empty")}</Text>
      <Text style={styles.emptyDesc}>{t("saves.emptyDesc")}</Text>
    </View>
  );
}

export default function Favoris() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <EmptyState />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bgGradientTop },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerEyebrow: {
    fontSize: 12,
    fontWeight: "600",
    color: color.softGray,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: color.deepBlue,
    letterSpacing: -0.5,
  },
  headerCount: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: color.yellow,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: color.yellowDark,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  headerCountText: {
    fontSize: 16,
    fontWeight: "800",
    color: color.deepBlue,
  },

  emptyWrap: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#EAF1F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: color.deepBlue,
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 13,
    color: color.softGray,
    textAlign: "center",
    lineHeight: 19,
  },
});
