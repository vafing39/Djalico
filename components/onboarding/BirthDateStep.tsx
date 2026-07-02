import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";
import { color } from "@/config/color";
import { onboardingStyles as s } from "./onboardingStyles";

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

// Numeric keypad has no "/" key, so we insert the separators ourselves as the user types digits.
function formatBirthDate(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export default function BirthDateStep({ value, onChange, error }: Props) {
  const { t } = useLanguage();
  return (
    <View style={s.step}>
      <Text style={s.title}>{t("onboarding.birthDateLabel")}</Text>
      <Text style={s.subtitle}>{t("onboarding.subtitle")}</Text>

      <View style={s.field}>
        <View style={[s.inputWrap, !!error && s.inputWrapError]}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color={color.softGray}
            style={s.inputIcon}
          />
          <TextInput
            style={s.input}
            placeholder={t("onboarding.birthDatePlaceholder")}
            placeholderTextColor={color.softGray}
            value={value}
            onChangeText={(v) => onChange(formatBirthDate(v))}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>
        {error && <Text style={s.fieldError}>{error}</Text>}
      </View>
    </View>
  );
}
