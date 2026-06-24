import { color } from "@/config/color";
import { View, Text, Image, StyleSheet } from "react-native";
import { Stars } from "./Stars";

export function TeacherCard({ item }: { item: any }) {
  return (
    <View style={styles.teacherCard}>
      <Image source={{ uri: item.image }} style={styles.teacherAvatar} />
      <Text numberOfLines={1} style={styles.teacherName}>
        {item.name}
      </Text>
      <Text numberOfLines={1} style={styles.teacherSpec}>
        {item.spec}
      </Text>
      <View style={styles.teacherRatingRow}>
        <Stars count={item.stars} />
        <Text style={styles.teacherRating}>{item.rating}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  teachersRow: { gap: 12, paddingRight: 4 },
  teacherCard: {
    width: 130,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(14,43,69,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  teacherAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: color.yellow,
  },
  teacherName: {
    fontSize: 13,
    fontWeight: "600",
    color: color.deepBlue,
    textAlign: "center",
  },
  teacherSpec: {
    fontSize: 11,
    color: color.softGray,
    textAlign: "center",
    lineHeight: 14,
  },
  teacherRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  teacherRating: {
    fontSize: 11,
    fontWeight: "600",
    color: color.deepBlue,
    marginLeft: 2,
  },
});
