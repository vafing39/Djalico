import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { color } from "@/config/adminTheme";

type Props = {
  title: string;
  count: number;
  countLabel: string;
  onAdd: () => void;
  addLabel?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  searchPlaceholder?: string;
};

export default function AdminHeader({
  title,
  count,
  countLabel,
  onAdd,
  addLabel = "Ajouter",
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher…",
}: Props) {
  const hasSearch = searchValue !== undefined && onSearchChange !== undefined;

  return (
    <LinearGradient
      colors={[color.navyDeep, color.navy]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>Administration</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.countLabel}>{countLabel}</Text>
          </View>
          <Pressable style={styles.addBtn} onPress={onAdd}>
            <Ionicons name="add" size={22} color={color.navy} />
            <Text style={styles.addBtnText}>{addLabel}</Text>
          </Pressable>
        </View>
      </View>

      {hasSearch && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="rgba(255,255,255,0.5)" />
          <TextInput
            placeholder={searchPlaceholder}
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={styles.searchInput}
            value={searchValue}
            onChangeText={onSearchChange}
            returnKeyType="search"
          />
          {searchValue.length > 0 && (
            <Pressable onPress={() => onSearchChange("")}>
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.5)" />
            </Pressable>
          )}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  eyebrow: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
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
});
