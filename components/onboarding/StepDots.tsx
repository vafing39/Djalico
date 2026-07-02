import { StyleSheet, View } from "react-native";
import { color } from "@/config/color";

type Props = {
  total: number;
  current: number;
};

export default function StepDots({ total, current }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: 10 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotActive: {
    width: 32,
    backgroundColor: color.yellowDark,
  },
});
