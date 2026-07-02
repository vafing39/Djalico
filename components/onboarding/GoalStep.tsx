import { Text, TextInput, View } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";
import { color } from "@/config/color";
import { onboardingStyles as s } from "./onboardingStyles";

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function GoalStep({ value, onChange, error }: Props) {
  const { t } = useLanguage();
  return (
    <View style={s.step}>
      <Text style={s.title}>{t("onboarding.goalLabel")}</Text>

      <View style={s.field}>
        <View style={[s.inputWrap, s.textAreaWrap, !!error && s.inputWrapError]}>
          <TextInput
            style={[s.input, s.textArea]}
            placeholder={t("onboarding.goalPlaceholder")}
            placeholderTextColor={color.softGray}
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
            returnKeyType="done"
          />
        </View>
        {error && <Text style={s.fieldError}>{error}</Text>}
      </View>
    </View>
  );
}
