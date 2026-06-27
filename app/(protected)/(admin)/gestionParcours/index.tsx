import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import { Parcours, ParcoursContext } from "@/contexts/parcoursContext";
import AdminListCard from "@/components/AdminListCard";
import ModalView from "./modal";
import { color } from "@/config/adminTheme";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
}

const LEVELS = [
  { key: "all", label: "Tous" },
  { key: "beginner", label: "Débutant" },
  { key: "intermediate", label: "Intermédiaire" },
  { key: "expert", label: "Expert" },
] as const;
type LevelKey = (typeof LEVELS)[number]["key"];

export default function GestionParcours() {
  const { parcours, isLoading, error } = useContext(ParcoursContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<LevelKey>("all");

  function handleEdit(p: Parcours) {
    Alert.alert("Modifier", `Modification de « ${p.title} » — à venir.`);
  }

  function handleDelete(p: Parcours) {
    Alert.alert(
      "Supprimer le parcours",
      `Voulez-vous vraiment supprimer « ${p.title} » ? Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => {} },
      ],
    );
  }

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? parcours
        : parcours.filter((p) => p.tag_type === activeFilter),
    [parcours, activeFilter],
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <LinearGradient colors={[color.navyDeep, color.navy]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerEyebrow}>Administration</Text>
            <Text style={styles.headerTitle}>Gestion des parcours</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{parcours.length}</Text>
              <Text style={styles.countLabel}>parcours</Text>
            </View>
            <Pressable style={styles.addBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={22} color={color.navy} />
              <Text style={styles.addBtnText}>Ajouter</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Filters ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {LEVELS.map((f) => (
            <Pressable key={f.key} style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]} onPress={() => setActiveFilter(f.key)}>
              <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>{f.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Parcours list ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes parcours</Text>
          <Text style={styles.sectionCount}>{filtered.length} au total</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={color.navy} style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={styles.errorText}>Erreur de chargement des parcours</Text>
        ) : filtered.length === 0 ? (
          <Text style={styles.emptyText}>Aucun parcours trouvé</Text>
        ) : (
          <View style={styles.listWrap}>
            {filtered.map((p, i) => (
              <AdminListCard
                key={p.id}
                imageUrl={p.cover_image_url}
                title={p.title}
                tagType={p.tag_type}
                instructor={p.instructor?.name ?? null}
                metaIcon="map-outline"
                metaText={`${p.category ? `${p.category.emoji} ${p.category.title}` : "—"} · ${formatDuration(p.total_duration_seconds)}`}
                showBorder={i < filtered.length - 1}
                onEdit={() => handleEdit(p)}
                onDelete={() => handleDelete(p)}
              />
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <ModalView visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 22, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerEyebrow: { fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: "500", marginBottom: 2 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: color.white, letterSpacing: -0.4 },
  headerRight: { alignItems: "flex-end", gap: 10 },
  countBadge: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, alignItems: "center" },
  countText: { fontSize: 24, fontWeight: "800", color: color.white },
  countLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: color.yellow, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  addBtnText: { fontSize: 13, fontWeight: "700", color: color.navy },

  scrollContent: { paddingTop: 8 },
  filtersRow: { paddingHorizontal: 20, paddingVertical: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: color.card, borderWidth: 1.5, borderColor: color.border },
  filterChipActive: { backgroundColor: color.navy, borderColor: color.navy },
  filterText: { fontSize: 13, fontWeight: "600", color: color.textMuted },
  filterTextActive: { color: color.white },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: color.textPrimary, letterSpacing: -0.3 },
  sectionCount: { fontSize: 12, color: color.textMuted, fontWeight: "500" },

  listWrap: { marginHorizontal: 20, backgroundColor: color.card, borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
  errorText: { textAlign: "center", marginTop: 40, color: color.red, fontSize: 14, fontWeight: "500" },
  emptyText: { textAlign: "center", marginTop: 40, color: color.textMuted, fontSize: 14, fontWeight: "500" },
});
