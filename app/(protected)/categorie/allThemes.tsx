import { ThemeCard } from "@/components/ThemeCard";
import { color } from "@/config/color";
import { THEMES } from "@/data/mockData";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Header() {
  return (
    <View style={styles.headerWrap}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Feather name="arrow-left" size={18} color="#fff" />
      </Pressable>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>Explorer</Text>
          <Text style={styles.headerTitle}>Thèmes musicaux</Text>
        </View>
        <View style={styles.headerCount}>
          <Text style={styles.headerCountText}>{THEMES.length}</Text>
        </View>
      </View>
    </View>
  );
}

export default function AllThemesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={THEMES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={<Header />}
        renderItem={({ item }) => (
          <ThemeCard
            item={item}
            onPress={() => router.navigate("/categorie/allParcoursScreen")}
          />
        )}
        ListFooterComponent={<View style={{ height: 110 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgGradientTop,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  headerWrap: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  backBtn: {
    height: 38,
    width: 38,
    borderRadius: 12,
    backgroundColor: "rgba(3,3,3,0.53)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
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
});
