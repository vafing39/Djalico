import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { VideoCard } from "@/components/VideoCard";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Screen from "@/components/Screen";
import VideoModal from "@/components/VideoModal";

const TOP_VIDEOS = [
  {
    id: "v1",
    title: "Les accords de base",
    subtitle: "Guitare acoustique · 18 min",
    image:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=200&q=60",
    tag: "Expert",
    tagType: "expert",
    progress: 0.65,
    bookmarked: true,
    categorie: "Guitare",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E&list=RDg4tEghJ8E7E&start_radio=1",
  },
  {
    id: "v2",
    title: "Solfège pour débutants",
    subtitle: "Théorie musicale · 25 min",
    image:
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=200&q=60",
    tag: "Débutant",
    tagType: "beginner",
    progress: 0.3,
    bookmarked: false,
    categorie: "Guitare",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E&list=RDg4tEghJ8E7E&start_radio=1",
  },
  {
    id: "v3",
    title: "Improvisation jazz",
    subtitle: "Saxophone · 40 min",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=200&q=60",
    tag: "Expert",
    tagType: "expert",
    progress: 0,
    bookmarked: false,
    categorie: "Trompette",
    url: "https://www.youtube.com/watch?v=g4tEghJ8E7E&list=RDg4tEghJ8E7E&start_radio=1",
  },
];

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

function Header() {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Feather name="arrow-left" size={18} color="#fff" />
      </Pressable>
      <View style={styles.header}>
        {/* Back button */}
        <View>
          <Text style={styles.headerEyebrow}>Bibliothèque</Text>
          <Text style={styles.headerTitle}>Toutes les videos</Text>
        </View>
        <View style={styles.headerCount}>
          <Text style={styles.headerCountText}>{TOP_VIDEOS.length}</Text>
        </View>
      </View>
    </View>
  );
}

const AllVideos = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const openVideo = (url: string, title: string) => {
    setSelectedVideo({ url, title });
    setModalVisible(true);
  };

  return (
    <Screen>
      <FlatList
        data={TOP_VIDEOS}
        ListHeaderComponent={<Header />}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => openVideo(item.url, item.title)}
            >
              <VideoCard key={item.id} item={item} />
              <VideoModal
                visible={modalVisible}
                videoUrl={selectedVideo?.url ?? null}
                title={selectedVideo?.title}
                onClose={() => {
                  setModalVisible(false);
                  setSelectedVideo(null);
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </Screen>
  );
};

export default AllVideos;

const styles = StyleSheet.create({
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
