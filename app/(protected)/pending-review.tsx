import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { color } from "@/config/color";

export default function PendingReviewScreen() {
  const { refreshProfile, logOut } = useAuth();
  const { t } = useLanguage();

  return (
    <LinearGradient
      colors={["#060F1A", color.deepBlue]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.card}>
            <Ionicons
              name="hourglass-outline"
              size={48}
              color={color.yellowDark}
            />
            <Text style={styles.title}>{t("pendingReview.title")}</Text>
            <Text style={styles.body}>{t("pendingReview.body")}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.btn,
                pressed && styles.btnPressed,
              ]}
              onPress={() => refreshProfile()}
            >
              <Ionicons name="refresh" size={18} color={color.deepBlue} />
              <Text style={styles.btnText}>{t("pendingReview.refresh")}</Text>
            </Pressable>

            <Pressable style={styles.linkBtn} onPress={() => logOut()}>
              <Text style={styles.linkText}>{t("pendingReview.logout")}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    gap: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: color.deepBlue,
    textAlign: "center",
  },
  body: {
    fontSize: 14,
    color: color.softGray,
    lineHeight: 20,
    textAlign: "center",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: color.yellowDark,
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 20,
    marginTop: 6,
    alignSelf: "stretch",
  },
  btnPressed: { opacity: 0.85 },
  btnText: {
    fontSize: 15,
    fontWeight: "700",
    color: color.deepBlue,
  },
  linkBtn: { marginTop: 2 },
  linkText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.softGray,
  },
});
