import { StyleSheet, View } from "react-native";

const WAVE_HEIGHTS = [8, 18, 12, 22, 10, 16, 8];

export function Waveform() {
  return (
    <View style={styles.waveform}>
      {WAVE_HEIGHTS.map((h, i) => (
        <View key={i} style={[styles.waveBar, { height: h }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  waveform: {
    position: "absolute",
    right: 16,
    bottom: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    opacity: 0.3,
  },
  waveBar: {
    width: 3,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
});
