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
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, UserContext } from "@/contexts/userContext";
import UserCard from "@/components/UserCard";
import UserEditModal from "@/components/UserEditModal";
import { color } from "@/config/adminTheme";

export default function GestionUser() {
  const { users, isLoading, error, deleteUser } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  function handleEdit(user: User) {
    setEditingUser(user);
  }

  function handleDelete(user: User) {
    Alert.alert(
      "Supprimer l'utilisateur",
      `Voulez-vous vraiment supprimer « ${user.name} » ? Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () =>
            deleteUser(user.id).catch((err: Error) =>
              Alert.alert("Erreur", err.message),
            ),
        },
      ],
    );
  }

  const renderItem = ({ item }: { item: User }) => (
    <UserCard item={item} onEdit={handleEdit} onDelete={handleDelete} />
  );

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
            <Text style={styles.headerTitle}>Gestion des utilisateurs</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{users.length}</Text>
              <Text style={styles.countLabel}>utilisateurs</Text>
            </View>
            <Pressable style={styles.addBtn} onPress={() => setCreating(true)}>
              <Ionicons name="add" size={22} color={color.navy} />
              <Text style={styles.addBtnText}>Ajouter</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="rgba(255,255,255,0.5)" />
          <TextInput
            placeholder="Rechercher un utilisateur"
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color="rgba(255,255,255,0.5)"
              />
            </Pressable>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={color.navy}
            style={{ marginTop: 40 }}
          />
        ) : error ? (
          <Text style={styles.errorText}>
            Erreur de chargement des utilisateurs
          </Text>
        ) : filteredUsers.length === 0 ? (
          <Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>
        ) : (
          <View style={styles.listWrap}>
            {filteredUsers.map((item) => renderItem({ item }))}
          </View>
        )}
      </ScrollView>

      <UserEditModal
        user={editingUser}
        visible={editingUser !== null}
        onClose={() => setEditingUser(null)}
      />
      <UserEditModal
        user={null}
        visible={creating}
        onClose={() => setCreating(false)}
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
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerEyebrow: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: color.white,
    letterSpacing: -0.4,
  },
  headerRight: { alignItems: "flex-end", gap: 10 },
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
  countBadge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  countText: { fontSize: 24, fontWeight: "800", color: color.white },
  countLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: color.white,
  },
  listContent: { paddingTop: 16, paddingBottom: 120 },
  listWrap: { marginHorizontal: 20, gap: 12 },
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
  },
});
