import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import React from "react";
import ParcoursCard from "@/components/ParcoursCard";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Screen from "@/components/Screen";
import { ALL_PARCOURS } from "@/data/mockData";

const TOP_VIDEOS = ALL_PARCOURS;

function Header() {
  return (
    <View>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Feather name="arrow-left" size={18} color="#fff" />
      </Pressable>
      <View style={styles.header}>
        {/* Back button */}
        <View>
          <Text style={styles.headerEyebrow}>Bibliothèque</Text>
          <Text style={styles.headerTitle}>Tout les parcours</Text>
        </View>
        <View style={styles.headerCount}>
          <Text style={styles.headerCountText}>{TOP_VIDEOS.length}</Text>
        </View>
      </View>
    </View>
  );
}

const color = {
  deepBlue: "#0E2B45",
  navy: "#103149",
  paleBlue: "#F3F8FB",
  bgGradientTop: "#ECF6FF",
  bgGradientBottom: "#FFFFFF",
  yellow: "#FFD66B",
  yellowDark: "#F6C04F",
  softGray: "#9AA6B2",
};

const AllParcoursScreens = () => {
  return (
    <Screen>
      <FlatList
        data={TOP_VIDEOS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Header />}
        renderItem={({ item, index }) => (
          <ParcoursCard item={item} index={index} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListFooterComponent={<View style={{ height: 110 }} />}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgGradientTop,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  columnWrapper: {
    paddingHorizontal: 20,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
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
  backBtn: {
    height: 38,
    width: 38,
    borderRadius: 12,
    backgroundColor: "rgba(3, 3, 3, 0.53)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default AllParcoursScreens;
