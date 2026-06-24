import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalView from "./modal";
import { ADMIN_VIDEOS } from "@/data/mockData";

const COLORS = {
  deepBlue: "#0E2B45",
  navy: "#103149",
  paleBlue: "#F3F8FB",
  bgGradientTop: "#ECF6FF",
  bgGradientBottom: "#FFFFFF",
  yellow: "#FFD66B",
  yellowDark: "#F6C04F",
  softGray: "#9AA6B2",
};

const videos = ADMIN_VIDEOS;

export default function gestionVideo() {
  const [modalVisible, setModalVisible] = useState(false);

  const renderVideoItem = ({ item }) => (
    <View style={styles.videoCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoDuration}>{item.duration}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons name="play-circle" size={22} color={COLORS.deepBlue} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={22} color={COLORS.yellowDark} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={22} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const Mylist = () => (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={renderVideoItem}
      scrollEnabled={false}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bgGradientBottom, paddingHorizontal: 20 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestion des vidéos</Text>
        <Ionicons name="ellipsis-vertical" size={24} color={COLORS.deepBlue} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Gestion / Outils */}
        <Text style={styles.sectionTitle}>⚙️ Gestion</Text>
        <View style={styles.tools}>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolText}>Trier par</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolText}>Filtrer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolText}>Catégories</Text>
          </TouchableOpacity>
        </View>

        {/* Liste des vidéos */}
        <Text style={styles.sectionTitle}>📂 Mes vidéos</Text>
        <Mylist />

        {/* Ajouter une vidéo */}
        <Text style={styles.sectionTitle}>➕ Ajouter une vidéo</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="cloud-upload-outline" size={20} color={COLORS.deepBlue} />
          <Text style={styles.addButtonText}>Ajouter une nouvelle vidéo</Text>
        </TouchableOpacity>
      </ScrollView>

      <ModalView onVisible={modalVisible} onCloseModal={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.deepBlue,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.navy,
    marginTop: 20,
    marginBottom: 8,
  },
  videoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.paleBlue,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  thumbnail: {
    width: 60,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.deepBlue,
  },
  videoDuration: {
    fontSize: 12,
    color: COLORS.softGray,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.yellow,
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  addButtonText: {
    marginLeft: 8,
    color: COLORS.deepBlue,
    fontWeight: "600",
  },
  tools: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  toolButton: {
    flex: 1,
    backgroundColor: COLORS.paleBlue,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  toolText: {
    color: COLORS.deepBlue,
    fontWeight: "500",
  },
});
