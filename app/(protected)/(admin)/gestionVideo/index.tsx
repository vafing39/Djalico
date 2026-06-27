import React, { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video, VideoContext } from "@/contexts/videoContext";
import AdminHeader from "@/components/AdminHeader";
import VideoModal from "@/components/VideoModal";
import AdminListCard from "@/components/AdminListCard";
import ModalView from "./modal";
import { color } from "@/config/adminTheme";


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
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
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
      <AdminHeader
        title="Gestion des vidéos"
        count={videos.length}
        countLabel="vidéos"
        onAdd={openAdd}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher une vidéo…"
      />

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
              const duration = `${Math.floor(item.duration_seconds / 60)}:${String(item.duration_seconds % 60).padStart(2, "0")}`;
              return (
                <AdminListCard
                  key={item.id}
                  imageUrl={item.image_url}
                  thumbnailWidth={80}
                  thumbnailHeight={52}
                  title={item.title}
                  tagType={item.tag_type}
                  subtitle={item.subtitle}
                  durationBadge={duration}
                  metaIcon="videocam-outline"
                  metaText={`${item.category ? `${item.category.emoji} ${item.category.title}` : "Vidéo"} · ${duration}`}
                  published={item.published}
                  showBorder={i < filteredVideos.length - 1}
                  onPlay={() => setPlayingVideo(item)}
                  onEdit={() => openEdit(item)}
                  onDelete={() => handleDelete(item)}
                />
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
      <VideoModal
        visible={!!playingVideo}
        videoUrl={playingVideo?.url ?? null}
        title={playingVideo?.title}
        onClose={() => setPlayingVideo(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
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
