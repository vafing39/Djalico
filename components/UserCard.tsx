import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { User } from "@/types";
import { color } from "@/config/adminTheme";
import { useLanguage } from "@/hooks/useLanguage";

const ROLE_COLORS: Record<User["role"], { text: string; bg: string }> = {
  eleve: { text: "#1E4FA5", bg: "#E9F2FF" },
  professeur: { text: "#166534", bg: "#DCFCE7" },
  admin: { text: color.red, bg: color.redLight },
};

const STATUS_COLORS: Record<"pending_review" | "onboarding", { text: string; bg: string }> = {
  pending_review: { text: "#92610A", bg: "#FFF3CD" },
  onboarding: { text: color.textMuted, bg: color.border },
};

type Props = {
  item: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
};

export default function UserCard({ item, onEdit, onDelete }: Props) {
  const { t } = useLanguage();
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: ROLE_COLORS[item.role].bg },
          ]}
        >
          <Text
            style={[styles.roleText, { color: ROLE_COLORS[item.role].text }]}
          >
            {t(`settings.role.${item.role}`)}
          </Text>
        </View>
        {item.status !== "active" && (
          <View
            style={[
              styles.roleBadge,
              { backgroundColor: STATUS_COLORS[item.status].bg },
            ]}
          >
            <Text
              style={[
                styles.roleText,
                { color: STATUS_COLORS[item.status].text },
              ]}
            >
              {t(
                item.status === "pending_review"
                  ? "admin.users.statusPendingReview"
                  : "admin.users.statusOnboarding",
              )}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => onEdit?.(item)}>
          <Ionicons name="pencil" size={20} color={color.navy} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => onDelete?.(item)}
        >
          <Ionicons name="trash" size={20} color={color.red} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: color.paleBlue,
    padding: 16,
    borderRadius: 16,
    shadowColor: color.navy,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: color.deepBlue,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: color.navy,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: color.white,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: color.deepBlue,
  },
  email: {
    fontSize: 13,
    color: color.softGray,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    padding: 6,
  },
});
