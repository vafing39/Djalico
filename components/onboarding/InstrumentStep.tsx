import { Pressable, Text, View } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";
import type { Category } from "@/types";
import { onboardingStyles as s } from "./onboardingStyles";

type Props = {
  categories: Category[];
  value: string[];
  onChange: (categoryIds: string[]) => void;
  error?: string;
};

export default function InstrumentStep({
  categories,
  value,
  onChange,
  error,
}: Props) {
  const { t } = useLanguage();

  function toggle(categoryId: string) {
    onChange(
      value.includes(categoryId)
        ? value.filter((id) => id !== categoryId)
        : [...value, categoryId],
    );
  }

  return (
    <View style={s.step}>
      <Text style={s.title}>{t("onboarding.instrumentLabel")}</Text>

      <View style={s.field}>
        <View style={s.chipGrid}>
          {categories.map((cat) => {
            const selected = value.includes(cat.id);
            return (
              <Pressable
                key={cat.id}
                style={[s.chip, selected && s.chipSelected]}
                onPress={() => toggle(cat.id)}
              >
                <Text style={s.chipEmoji}>{cat.emoji}</Text>
                <Text style={s.chipText}>{cat.title}</Text>
              </Pressable>
            );
          })}
        </View>
        {error && <Text style={s.fieldError}>{error}</Text>}
      </View>
    </View>
  );
}
