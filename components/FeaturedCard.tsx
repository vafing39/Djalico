import { color } from "@/config/color";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { Waveform } from "./WaveForm";

export function FeaturedCard({ item }: { item: any }) {
  return (
    <LinearGradient
      colors={[item.gradientStart, item.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.featuredCard}
    >
      <View style={styles.featuredCircle1} />
      <View style={styles.featuredCircle2} />
      <Waveform />

      <View
        style={[
          styles.featuredBadge,
          item.badgeLight && styles.featuredBadgeLight,
        ]}
      >
        <Text
          style={[
            styles.featuredBadgeText,
            item.badgeLight && styles.featuredBadgeTextLight,
          ]}
        >
          {item.badge}
        </Text>
      </View>

      <View style={styles.featuredContent}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.featuredSubtitle}>{item.subtitle}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  featuredRow: {
    paddingHorizontal: 24,
    gap: 14,
  },
  featuredCard: {
    width: 260,
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  featuredCircle1: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(255,214,107,0.18)",
  },
  featuredCircle2: {
    position: "absolute",
    bottom: -30,
    left: -10,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  featuredBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: color.yellow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  featuredBadgeLight: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  featuredBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: color.deepBlue,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  featuredBadgeTextLight: {
    color: "#fff",
  },
  featuredContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  featuredTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
  },
});
