import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video, VideoContext } from "@/contexts/videoContext";
import ModalView from "./modal";
import { color } from "@/config/adminTheme";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const LEVELS = [
  { key: "all", label: "Tous" },
  { key: "beginner", label: "Débutant" },
  { key: "intermediate", label: "Intermédiaire" },
  { key: "expert", label: "Expert" },
] as const;
type LevelKey = (typeof LEVELS)[number]["key"];

export default function GestionVideo() {
  const { videos, isLoading, error, deleteVideo } = useContext(VideoContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState<LevelKey>("all");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  function openAdd() {
    setEditingVideo(null);
    setModalVisible(true);
  }

  function openEdit(video: Video) {
    setEditingVideo(video);
    setModalVisible(true);
  }

  function handleDelete(video: Video) {
    Alert.alert(
      "Supprimer la vidéo",
      `Voulez-vous vraiment supprimer « ${video.title} » ? Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () =>
            deleteVideo(video.id).catch((err: Error) =>
              Alert.alert("Erreur", err.message),
            ),
        },
      ],
    );
  }

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const list: { id: string; title: string; emoji: string }[] = [];
    for (const v of videos) {
      if (v.category && !seen.has(v.category.id)) {
        seen.add(v.category.id);
        list.push(v.category);
      }
    }
    return list;
  }, [videos]);

  const filteredVideos = useMemo(() => {
    const q = search.trim().toLowerCase();
    return videos.filter((v) => {
      if (q && !v.title.toLowerCase().includes(q)) return false;
      if (activeLevel !== "all" && v.tag_type !== activeLevel) return false;
      if (activeCategoryId !== "all" && v.category?.id !== activeCategoryId)
        return false;
      return true;
    });
  }, [videos, search, activeLevel, activeCategoryId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <LinearGradient
        colors={[color.navyDeep, color.navy]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerEyebrow}>Administration</Text>
            <Text style={styles.headerTitle}>Gestion des vidéos</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{videos.length}</Text>
              <Text style={styles.countLabel}>vidéos</Text>
            </View>
            <Pressable style={styles.addBtn} onPress={openAdd}>
              <Ionicons name="add" size={22} color={color.navy} />
              <Text style={styles.addBtnText}>Ajouter</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchRow}>
          <Ionicons
            name="search-outline"
            size={16}
            color="rgba(255,255,255,0.5)"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une vidéo…"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Level filter ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {LEVELS.map((l) => (
            <Pressable
              key={l.key}
              style={[
                styles.filterChip,
                activeLevel === l.key && styles.filterChipActive,
              ]}
              onPress={() => setActiveLevel(l.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeLevel === l.key && styles.filterTextActive,
                ]}
              >
                {l.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Category filter ── */}
        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            <Pressable
              style={[
                styles.filterChip,
                activeCategoryId === "all" && styles.filterChipActive,
              ]}
              onPress={() => setActiveCategoryId("all")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeCategoryId === "all" && styles.filterTextActive,
                ]}
              >
                Toutes catégories
              </Text>
            </Pressable>
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                style={[
                  styles.filterChip,
                  activeCategoryId === cat.id && styles.filterChipActive,
                ]}
                onPress={() => setActiveCategoryId(cat.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeCategoryId === cat.id && styles.filterTextActive,
                  ]}
                >
                  {cat.emoji} {cat.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* ── Video list ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes vidéos</Text>
          <Text style={styles.sectionCount}>
            {filteredVideos.length} au total
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={color.navy}
            style={{ marginTop: 40 }}
          />
        ) : error ? (
          <Text style={styles.errorText}>Erreur de chargement des vidéos</Text>
        ) : filteredVideos.length === 0 ? (
          <Text style={styles.emptyText}>Aucune vidéo trouvée</Text>
        ) : (
          <View style={styles.listWrap}>
            {filteredVideos.map((item, i) => {
              const duration = formatDuration(item.duration_seconds);
              return (
                <View
                  key={item.id}
                  style={[
                    styles.videoCard,
                    i < filteredVideos.length - 1 && styles.videoCardBorder,
                  ]}
                >
                  <View style={styles.thumbnailWrap}>
                    {item.image_url ? (
                      <Image
                        source={{ uri: item.image_url }}
                        style={styles.thumbnail}
                      />
                    ) : (
                      <View
                        style={[styles.thumbnail, styles.thumbnailPlaceholder]}
                      />
                    )}
                    <View style={styles.durationBadge}>
                      <Ionicons name="time-outline" size={9} color="#fff" />
                      <Text style={styles.durationText}>{duration}</Text>
                    </View>
                    <View style={styles.playOverlay}>
                      <Ionicons name="play" size={14} color="#fff" />
                    </View>
                  </View>

                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <View style={styles.videoMeta}>
                      <Ionicons
                        name="videocam-outline"
                        size={12}
                        color={color.textMuted}
                      />
                      <Text style={styles.videoMetaText}>
                        {item.category
                          ? `${item.category.emoji} ${item.category.title}`
                          : "Vidéo"}{" "}
                        · {duration}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <Pressable
                      style={[styles.actionBtn, { backgroundColor: "#E9F2FF" }]}
                      onPress={() => openEdit(item)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={16}
                        color="#1E88E5"
                      />
                    </Pressable>
                    <Pressable
                      style={[styles.actionBtn, { backgroundColor: "#FFE7E7" }]}
                      onPress={() => handleDelete(item)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color={color.red}
                      />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <ModalView
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        video={editingVideo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 16,
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
    color: color.white,
    letterSpacing: -0.4,
  },
  headerRight: { alignItems: "flex-end", gap: 10 },
  countBadge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  countText: { fontSize: 24, fontWeight: "800", color: color.white },
  countLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: color.yellow,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  addBtnText: { fontSize: 13, fontWeight: "700", color: color.navy },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: color.white },

  scrollContent: { paddingTop: 8, paddingBottom: 20 },

  filtersRow: { paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: color.card,
    borderWidth: 1.5,
    borderColor: color.border,
  },
  filterChipActive: { backgroundColor: color.navy, borderColor: color.navy },
  filterText: { fontSize: 13, fontWeight: "600", color: color.textMuted },
  filterTextActive: { color: color.white },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: color.textPrimary,
    letterSpacing: -0.3,
  },
  sectionCount: { fontSize: 12, color: color.textMuted, fontWeight: "500" },

  listWrap: {
    marginHorizontal: 20,
    backgroundColor: color.card,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  videoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  videoCardBorder: { borderBottomWidth: 1, borderBottomColor: color.border },

  thumbnailWrap: {
    width: 80,
    height: 52,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
  },
  thumbnail: { width: "100%", height: "100%", resizeMode: "cover" },
  thumbnailPlaceholder: { backgroundColor: color.border },
  durationBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  durationText: { fontSize: 9, color: "#fff", fontWeight: "600" },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  videoInfo: { flex: 1 },
  videoTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    color: color.textPrimary,
    lineHeight: 19,
    marginBottom: 5,
  },
  videoMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  videoMetaText: { fontSize: 11, color: color.textMuted },

  actions: { flexDirection: "column", gap: 6 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    textAlign: "center",
    marginTop: 40,
    color: color.red,
    fontSize: 14,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: color.textMuted,
    fontSize: 14,
    fontWeight: "500",
  },
});
