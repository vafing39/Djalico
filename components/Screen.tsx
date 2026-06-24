import { StyleSheet } from "react-native";
import React, { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { color } from "@/config/color";

const Screen = ({ children }: PropsWithChildren) => {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <LinearGradient
        colors={[color.bgGradientTop, color.bgGradientBottom]}
        style={styles.pageGradient}
      >
        {children}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgGradientTop,
  },
  pageGradient: {
    flex: 1,
  },
  featuredRow: {
    paddingHorizontal: 24,
    gap: 14,
  },
});
