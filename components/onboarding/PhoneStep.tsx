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

export default function PhoneStep({ value, onChange, error }: Props) {
  const { t } = useLanguage();
  return (
    <View style={s.step}>
      <Text style={s.title}>{t("onboarding.phoneLabel")}</Text>

      <View style={s.field}>
        <View style={[s.inputWrap, !!error && s.inputWrapError]}>
          <Ionicons
            name="call-outline"
            size={18}
            color={color.softGray}
            style={s.inputIcon}
          />
          <TextInput
            style={s.input}
            placeholder={t("onboarding.phonePlaceholder")}
            placeholderTextColor={color.softGray}
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
          />
        </View>
        {error && <Text style={s.fieldError}>{error}</Text>}
      </View>
    </View>
  );
}
