import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { color } from "@/config/adminTheme";

type Props = {
  title: string;
  subtitle: string;
  isBusy: boolean;
  submitLabel: string;
  submitIcon: string;
  onClose: () => void;
  onSubmit: () => void;
};

export default function ModalHeader({
  title,
  subtitle,
  isBusy,
  submitLabel,
  submitIcon,
  onClose,
  onSubmit,
}: Props) {
  const barAnimRef = useRef(new Animated.Value(-80));
  const barAnim = barAnimRef.current;

  useEffect(() => {
    if (!isBusy) { barAnim.setValue(-80); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(barAnim, { toValue: 80, duration: 700, useNativeDriver: true }),
        Animated.timing(barAnim, { toValue: -80, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isBusy, barAnim]);

  return (
    <View style={styles.header}>
      <Pressable style={styles.closeBtn} onPress={onClose}>
        <Ionicons name="close" size={20} color={color.red} />
      </Pressable>

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
      </View>

      <Pressable style={styles.submitBtn} onPress={onSubmit} disabled={isBusy}>
        <View style={styles.submitBtnInner}>
          <Ionicons
            name={(isBusy ? "checkmark-circle-outline" : submitIcon) as any}
            size={15}
            color={color.navy}
          />
          <Text style={styles.submitText}>{submitLabel}</Text>
        </View>
        {isBusy && (
          <View style={styles.savingBarTrack}>
            <Animated.View style={[styles.savingBarFill, { transform: [{ translateX: barAnim }] }]} />
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: color.redLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.red,
  },
  center: { flex: 1, alignItems: "center" },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: color.textPrimary,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  subtitle: { fontSize: 12, color: color.textMuted, marginTop: 2, textAlign: "center" },
  submitBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: color.yellow,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    gap: 4,
  },
  submitBtnInner: { flexDirection: "row", alignItems: "center", gap: 6 },
  savingBarTrack: {
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(14,43,69,0.15)",
    overflow: "hidden",
  },
  savingBarFill: {
    width: 40,
    height: "100%",
    borderRadius: 2,
    backgroundColor: color.navy,
  },
  submitText: { fontSize: 13, fontWeight: "700", color: color.navy },
});
