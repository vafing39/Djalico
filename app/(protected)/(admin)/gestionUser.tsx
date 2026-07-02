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
import { UserContext } from "@/contexts/userContext";
import { useLanguage } from "@/hooks/useLanguage";
import type { User } from "@/types";
import AdminHeader from "@/components/AdminHeader";
import UserCard from "@/components/UserCard";
import UserEditModal from "@/components/UserEditModal";
import { color } from "@/config/adminTheme";

export default function GestionUser() {
  const { users, isLoading, error, deleteUser } = useContext(UserContext);
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);

  const pendingCount = useMemo(
    () => users.filter((u) => u.status === "pending_review").length,
    [users],
  );

  const filteredUsers = useMemo(
    () =>
      users
        .filter((u) => !pendingOnly || u.status === "pending_review")
        .filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
        ),
    [users, search, pendingOnly],
  );

  function handleEdit(user: User) {
    setEditingUser(user);
  }

  function handleDelete(user: User) {
    Alert.alert(
      t("admin.users.deleteTitle"),
      t("admin.users.deleteConfirm", { name: user.name }),
      [
        { text: t("common.delete.cancel"), style: "cancel" },
        {
          text: t("common.delete.confirm"),
          style: "destructive",
          onPress: () =>
            deleteUser(user.id).catch((err: Error) =>
              Alert.alert(t("common.error"), err.message),
            ),
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader
        title={t("admin.users.title")}
        count={users.length}
        countLabel={t("admin.users.countLabel")}
        onAdd={() => setCreating(true)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("admin.users.searchPlaceholder")}
      />

      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterChip, !pendingOnly && styles.filterChipActive]}
          onPress={() => setPendingOnly(false)}
        >
          <Text
            style={[
              styles.filterChipText,
              !pendingOnly && styles.filterChipTextActive,
            ]}
          >
            {t("admin.users.filterAll")}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, pendingOnly && styles.filterChipActive]}
          onPress={() => setPendingOnly(true)}
        >
          <Text
            style={[
              styles.filterChipText,
              pendingOnly && styles.filterChipTextActive,
            ]}
          >
            {t("admin.users.filterPending", { count: pendingCount })}
          </Text>
        </Pressable>
      </View>

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
            {t("admin.users.errorLoading")}
          </Text>
        ) : filteredUsers.length === 0 ? (
          <Text style={styles.emptyText}>{t("admin.users.empty")}</Text>
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
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.border,
  },
  filterChipActive: {
    backgroundColor: color.navy,
    borderColor: color.navy,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.textMuted,
  },
  filterChipTextActive: {
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
