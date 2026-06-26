import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalView from "./modal";
import { ADMIN_VIDEOS } from "@/data/mockData";

const C = {
  navy:        "#103149",
  navyDeep:    "#0B2035",
  white:       "#FFFFFF",
  textPrimary: "#1F2937",
  textMuted:   "#6B7280",
  yellow:      "#F6C04F",
  red:         "#F44336",
  border:      "#E5E7EB",
  bg:          "#F7FAFF",
  card:        "#FFFFFF",
};

const FILTERS = ["Tous", "Récents", "En attente", "Publiés"] as const;
type Filter = (typeof FILTERS)[number];

export default function GestionVideo() {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>("Tous");

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Header ── */}
      <LinearGradient
        colors={[C.navyDeep, C.navy]}
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
              <Text style={styles.countText}>{ADMIN_VIDEOS.length}</Text>
              <Text style={styles.countLabel}>vidéos</Text>
            </View>
            <Pressable style={styles.addBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={22} color={C.navy} />
              <Text style={styles.addBtnText}>Ajouter</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Filters ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Video list ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes vidéos</Text>
          <Text style={styles.sectionCount}>{ADMIN_VIDEOS.length} au total</Text>
        </View>

        <View style={styles.listWrap}>
          {ADMIN_VIDEOS.map((item, i) => (
            <View
              key={item.id}
              style={[styles.videoCard, i < ADMIN_VIDEOS.length - 1 && styles.videoCardBorder]}
            >
              {/* Thumbnail with duration badge */}
              <View style={styles.thumbnailWrap}>
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                <View style={styles.durationBadge}>
                  <Ionicons name="time-outline" size={9} color="#fff" />
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
                <View style={styles.playOverlay}>
                  <Ionicons name="play" size={14} color="#fff" />
                </View>
              </View>

              {/* Info */}
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.videoMeta}>
                  <Ionicons name="videocam-outline" size={12} color={C.textMuted} />
                  <Text style={styles.videoMetaText}>Vidéo · {item.duration}</Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <Pressable style={[styles.actionBtn, { backgroundColor: "#E9F2FF" }]}>
                  <Ionicons name="create-outline" size={16} color="#1E88E5" />
                </Pressable>
                <Pressable style={[styles.actionBtn, { backgroundColor: "#FFE7E7" }]}>
                  <Ionicons name="trash-outline" size={16} color={C.red} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <ModalView visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 22, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerEyebrow: { fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: "500", marginBottom: 2 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: C.white, letterSpacing: -0.4 },
  headerRight: { alignItems: "flex-end", gap: 10 },
  countBadge: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, alignItems: "center" },
  countText: { fontSize: 24, fontWeight: "800", color: C.white },
  countLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.yellow, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  addBtnText: { fontSize: 13, fontWeight: "700", color: C.navy },

  scrollContent: { paddingTop: 8, paddingBottom: 20 },

  filtersRow: { paddingHorizontal: 20, paddingVertical: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border },
  filterChipActive: { backgroundColor: C.navy, borderColor: C.navy },
  filterText: { fontSize: 13, fontWeight: "600", color: C.textMuted },
  filterTextActive: { color: C.white },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: C.textPrimary, letterSpacing: -0.3 },
  sectionCount: { fontSize: 12, color: C.textMuted, fontWeight: "500" },

  listWrap: { marginHorizontal: 20, backgroundColor: C.card, borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
  videoCard: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  videoCardBorder: { borderBottomWidth: 1, borderBottomColor: C.border },

  thumbnailWrap: { width: 80, height: 52, borderRadius: 10, overflow: "hidden", position: "relative", flexShrink: 0 },
  thumbnail: { width: "100%", height: "100%", resizeMode: "cover" },
  durationBadge: { position: "absolute", bottom: 4, left: 4, flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6 },
  durationText: { fontSize: 9, color: "#fff", fontWeight: "600" },
  playOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.2)" },

  videoInfo: { flex: 1 },
  videoTitle: { fontSize: 13.5, fontWeight: "600", color: C.textPrimary, lineHeight: 19, marginBottom: 5 },
  videoMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  videoMetaText: { fontSize: 11, color: C.textMuted },

  actions: { flexDirection: "column", gap: 6 },
  actionBtn: { width: 32, height: 32, borderRadius: 10, justifyContent: "center", alignItems: "center" },

});
