import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";
import { color } from "@/config/color";
import type { Category } from "@/types";
import { onboardingStyles as s } from "./onboardingStyles";

type Props = {
  categories: Category[];
  isLoading?: boolean;
  loadError?: boolean;
  onRetry?: () => void;
  value: string[];
  onChange: (categoryIds: string[]) => void;
  error?: string;
};

export default function InstrumentStep({
  categories,
  isLoading,
  loadError,
  onRetry,
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
        {categories.length === 0 && isLoading ? (
          <ActivityIndicator color={color.deepBlue} />
        ) : categories.length === 0 && loadError ? (
          <View>
            <Text style={s.fieldError}>{t("onboarding.instrumentLoadError")}</Text>
            <Pressable style={[s.chip, { alignSelf: "flex-start" }]} onPress={onRetry}>
              <Text style={s.chipText}>{t("common.retry")}</Text>
            </Pressable>
          </View>
        ) : (
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
        )}
        {error && <Text style={s.fieldError}>{error}</Text>}
      </View>
    </View>
  );
}
