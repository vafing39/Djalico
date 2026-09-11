import { Picker } from "@react-native-picker/picker";
import { Platform, StyleSheet, Text, View } from "react-native";
import { color, pickerStyleDefs, pickerStyleDefsCard } from "@/config/adminTheme";

type Item = { label: string; value: string };

type Props = {
  label: string;
  selectedValue: string;
  onValueChange: (v: string) => void;
  items: Item[];
  /** Renders a leading "— ... —" item when provided */
  placeholder?: string;
  /** Optional hint shown below the label */
  hint?: string;
  /** "card" variant: no forced white color on items (for white-card modals) */
  variant?: "card";
};

export default function PickerField({
  label,
  selectedValue,
  onValueChange,
  items,
  placeholder,
  hint,
  variant,
}: Props) {
  const isCard = variant === "card";
  const itemColor = isCard
    ? color.textPrimary
    : Platform.OS === "android"
      ? undefined
      : color.white;
  const defs = isCard ? pickerStyleDefsCard : pickerStyleDefs;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {hint && <Text style={styles.hint}>{hint}</Text>}
      <View style={defs.wrap}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(v) => onValueChange(v as string)}
          style={defs.picker}
          itemStyle={defs.item}
          dropdownIconColor={isCard ? color.textPrimary : color.white}
        >
          {placeholder && (
            <Picker.Item label={placeholder} value="" color={itemColor} />
          )}
          {items.map((i) => (
            <Picker.Item key={i.value} label={i.label} value={i.value} color={itemColor} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 7 },
  label: { fontSize: 13, fontWeight: "700", color: color.textPrimary },
  hint: { fontSize: 11, color: color.textMuted, marginTop: -2 },
});
