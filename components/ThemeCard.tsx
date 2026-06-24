import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";

const { width } = Dimensions.get("window");

export function ThemeCard({ item, onPress }: { item: any; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <LinearGradient
        colors={item.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.themeCard}
      >
        <Text style={styles.themeEmoji}>{item.emoji}</Text>
        <View style={styles.themeContent}>
          <Text style={styles.themeTitle}>{item.title}</Text>
          <Text style={styles.themeCount}>{item.count}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const CARD_GAP = 12;
const THEME_SIZE = (width - 48 - CARD_GAP) / 2;

const styles = StyleSheet.create({
  themeEmoji: {
    fontSize: 28,
    position: "absolute",
    top: 12,
    right: 12,
    opacity: 0.7,
  },
  themeCard: {
    width: THEME_SIZE,
    height: 110,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 12,
  },
  themeContent: {},
  themeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.2,
  },
  themeCount: { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 },
});
