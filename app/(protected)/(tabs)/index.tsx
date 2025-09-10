import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // expo alias may import differently, see note
import { Bookmark } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

const { width } = Dimensions.get("window");

const COLORS = {
  deepBlue: "#0E2B45",       // text & deep accents
  navy: "#103149",
  paleBlue: "#F3F8FB",       // background card
  bgGradientTop: "#ECF6FF",  // page gradient top
  bgGradientBottom: "#FFFFFF",
  yellow: "#FFD66B",         // accent pastel yellow
  yellowDark: "#F6C04F",
  softGray: "#9AA6B2",
};

const CATEGORY_DATA = [
  { id: "1", title: "Guitare" },
  { id: "2", title: "Basse" },
  { id: "3", title: "Trompette" },
  { id: "4", title: "Flûte" },
  { id: "5", title: "Saxophone" },
];

const TOP_VIDEOS = [
  {
    id: "v1",
    title: "Chemin vers la guitare",
    subtitle: "7 vidéos",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=60",
    expert: true,
  },
  {
    id: "v2",
    title: "Chemin vers la guitare",
    subtitle: "7 vidéos",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=60",
    expert: true,
  },
];

export default function App() {
  // Animated header shrink
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [220, 110],
    extrapolate: "clamp",
  });

  const titleSize = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [28, 20],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[COLORS.bgGradientTop, COLORS.bgGradientBottom]}
        style={styles.pageGradient}
      >
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <View style={styles.headerTop}>
            <View style={styles.profileRow}>
              <Image
                source={{
                  uri:
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60",
                }}
                style={styles.avatar}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.greetingSmall}>Hi, Magdalena</Text>
              </View>
            </View>

            <View style={styles.badgeWrap}>
              <View style={styles.expertBadge}>
                <AntDesign name="star" size={14} color={COLORS.deepBlue} />
                <Text style={styles.expertText}>Expert</Text>
              </View>
            </View>
          </View>

          <Animated.Text style={[styles.headline, { fontSize: titleSize }]}>
            Transforme tes instants en mélodie grâce aux vidéos !
          </Animated.Text>

          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Feather name="search" size={20} color={COLORS.deepBlue} />
              <TextInput
                placeholder="Chercher un instrument, une vidéo..."
                placeholderTextColor={COLORS.softGray}
                style={styles.searchInput}
              />
            </View>
          </View>
        </Animated.View>

        <FlatList
          contentContainerStyle={styles.contentContainer}
          data={TOP_VIDEOS}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View>
              <Text style={styles.sectionTitle}>Categorie d'instrument</Text>

              <View style={styles.categoriesRow}>
                {CATEGORY_DATA.map((c) => (
                  <Pressable
                    key={c.id}
                    style={({ pressed }) => [
                      styles.pill,
                      pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                    ]}
                  >
                    <Text style={styles.pillText}>{c.title}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
                Tops Vidéos
              </Text>
            </View>
          }
          renderItem={({ item }) => <VideoCard item={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

function VideoCard({ item }) {
  return (
    <View style={styles.cardRow}>
      <View style={styles.card}>
        <View style={styles.thumbWrap}>
          <Image source={{ uri: item.image }} style={styles.thumbImage} />
          <View style={styles.thumbBadge}>
            <Text style={styles.thumbBadgeText}>Expert</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={2} style={styles.cardTitle}>
              {item.title}
            </Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>

          <Pressable style={styles.iconHeart}>
            <Bookmark size={20} color={COLORS.yellowDark} />
          </Pressable>
        </View>
      </View>

      {/* duplicate for second column if you want side-by-side; here for single-column feed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgGradientTop,
  },
  pageGradient: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: "flex-end",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ddd",
  },
  greetingSmall: {
    color: COLORS.deepBlue,
    fontSize: 14,
  },
  badgeWrap: {},
  expertBadge: {
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  expertText: {
    color: COLORS.deepBlue,
    marginLeft: 6,
    fontWeight: "600",
  },
  headline: {
    color: COLORS.deepBlue,
    fontWeight: "700",
    marginTop: 12,
    lineHeight: 38,
  },
  searchRow: {
    marginTop: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 15,
    color: COLORS.deepBlue,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.deepBlue,
    fontWeight: "700",
    marginBottom: 12,
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: {
    color: COLORS.deepBlue,
    fontWeight: "600",
  },
  cardRow: {
    // single column card centered
    alignItems: "center",
  },
  card: {
    width: width - 40,
    backgroundColor: COLORS.paleBlue,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    position:'relative'
  },
  thumbWrap: {
    backgroundColor: "#e8f2f8",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  thumbBadge: {
    position: "absolute",
    top: 20,
    left: 25,
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  thumbBadgeText: {
    fontWeight: "600",
    color: COLORS.deepBlue,
  },
  thumbImage: {
    width: "92%",
    height: "88%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  cardFooter: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    color: COLORS.deepBlue,
    fontWeight: "700",
    fontSize: 18,
  },
  cardSubtitle: {
    color: COLORS.softGray,
    marginTop: 4,
  },
  iconHeart: {
    marginLeft: 12,
    padding: 6,
  },
  bottomNav: {
    position: "absolute",
    bottom: 16,
    left: 18,
    right: 18,
    height: 64,
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 11,
    color: COLORS.deepBlue,
    marginTop: 2,
  },
});
