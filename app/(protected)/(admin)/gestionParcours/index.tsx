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
import AdminHeader from "@/components/AdminHeader";
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
  const { parcours, isLoading, error, deleteParcours } = useContext(ParcoursContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingParcours, setEditingParcours] = useState<Parcours | null>(null);
  const [activeFilter, setActiveFilter] = useState<LevelKey>("all");
  const [search, setSearch] = useState("");

  function handleEdit(p: Parcours) {
    setEditingParcours(p);
    setModalVisible(true);
  }

  function handleDelete(p: Parcours) {
    Alert.alert(
      "Supprimer le parcours",
      `Voulez-vous vraiment supprimer « ${p.title} » ? Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () =>
            deleteParcours(p.id).catch((err: Error) =>
              Alert.alert("Erreur", err.message),
            ),
        },
      ],
    );
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return parcours.filter((p) => {
      if (activeFilter !== "all" && p.tag_type !== activeFilter) return false;
      if (q && !p.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [parcours, activeFilter, search]);

  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader
        title="Gestion des parcours"
        count={parcours.length}
        countLabel="parcours"
        onAdd={() => { setEditingParcours(null); setModalVisible(true); }}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher un parcours"
      />

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

      <ModalView
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setEditingParcours(null); }}
        parcours={editingParcours}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
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
