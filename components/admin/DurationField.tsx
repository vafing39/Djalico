import { StyleSheet, Text, TextInput, View } from "react-native";
import { color } from "@/config/adminTheme";

type Entry = {
  value: string;
  onChange: (v: string) => void;
  unit: string;
  placeholder?: string;
};

type Props = {
  label?: string;
  fields: [Entry, Entry];
  /** "card" variant: lighter input bg for use inside white cards */
  variant?: "card";
};

export default function DurationField({ label = "Durée totale", fields, variant }: Props) {
  const inputBg = variant === "card" ? color.bg : color.card;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {fields.map((f, idx) => (
          <View key={idx} style={styles.col}>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg }]}
              placeholder={f.placeholder ?? "0"}
              placeholderTextColor={color.textMuted}
              value={f.value}
              onChangeText={f.onChange}
              keyboardType="number-pad"
            />
            <Text style={styles.unit}>{f.unit}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 7 },
  label: { fontSize: 13, fontWeight: "700", color: color.textPrimary },
  row: { flexDirection: "row", gap: 12 },
  col: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  input: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: color.textPrimary,
    borderWidth: 1,
    borderColor: color.border,
  },
  unit: { fontSize: 13, fontWeight: "600", color: color.textMuted },
});
