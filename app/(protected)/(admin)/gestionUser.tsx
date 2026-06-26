import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ADMIN_USERS_INITIAL } from "@/data/mockData";
import { color } from "@/config/adminTheme";


export default function gestionUser() {
  const [users, setUsers] = useState(ADMIN_USERS_INITIAL);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.role}>{item.role}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="pencil" size={20} color={color.navy} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.pageTitle}>Gestion des utilisateurs</Text>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={color.softGray}
            style={{ marginHorizontal: 8 }}
          />
          <TextInput
            placeholder="Rechercher un utilisateur"
            placeholderTextColor={color.softGray}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Liste */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        {/* Bouton flottant */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <Ionicons name="add" size={28} color={color.navy} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgBottom,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: color.deepBlue,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.paleBlue,
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: color.deepBlue,
    paddingRight: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.paleBlue,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: color.navy,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: color.deepBlue,
  },
  email: {
    fontSize: 14,
    color: color.softGray,
    marginTop: 2,
  },
  role: {
    fontSize: 13,
    marginTop: 4,
    color: color.navy,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    padding: 6,
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 24,
    backgroundColor: color.yellowLight,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: color.navy,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});
