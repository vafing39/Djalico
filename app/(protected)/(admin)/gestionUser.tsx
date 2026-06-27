import React, { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, UserContext } from "@/contexts/userContext";
import AdminHeader from "@/components/AdminHeader";
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

  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader
        title="Gestion des utilisateurs"
        count={users.length}
        countLabel="utilisateurs"
        onAdd={() => setCreating(true)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher un utilisateur"
      />

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
            {filteredUsers.map((item) => (
              <UserCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
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
