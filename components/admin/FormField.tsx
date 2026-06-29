import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";
import { color } from "@/config/adminTheme";

type Props = {
  label: string;
  required?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  /** false renders the input dimmed and non-editable */
  editable?: boolean;
  /** use inside white cards (video modal) — switches input bg to color.bg */
  variant?: "card";
};

export default function FormField({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  editable = true,
  variant,
}: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          variant === "card" && styles.inputCard,
          multiline && styles.inputMultiline,
          !editable && styles.inputDisabled,
        ]}
        placeholder={placeholder}
        placeholderTextColor={color.textMuted}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : undefined}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 7 },
  label: { fontSize: 13, fontWeight: "700", color: color.textPrimary },
  required: { color: "#EF4444" },
  input: {
    backgroundColor: color.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: color.textPrimary,
    borderWidth: 1,
    borderColor: color.border,
  },
  inputCard: { backgroundColor: color.bg },
  inputMultiline: { height: 90, paddingTop: 13 },
  inputDisabled: { opacity: 0.5 },
});
