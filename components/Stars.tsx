import { color } from "@/config/color";
import { View, Text, StyleSheet } from "react-native";

export function Stars({ count }: { count: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={[
            styles.star,
            i <= count ? styles.starFilled : styles.starEmpty,
          ]}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  starsRow: { flexDirection: "row", gap: 1 },
  star: { fontSize: 11 },
  starFilled: { color: color.yellowDark },
  starEmpty: { color: "rgba(14,43,69,0.15)" },
});
