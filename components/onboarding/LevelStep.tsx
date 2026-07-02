import { Pressable, Text, View } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";
import type { TagType } from "@/types";
import { onboardingStyles as s } from "./onboardingStyles";

const LEVELS: TagType[] = ["beginner", "intermediate", "expert"];

type Props = {
  value: TagType | "";
  onChange: (level: TagType) => void;
  error?: string;
};

export default function LevelStep({ value, onChange, error }: Props) {
  const { t } = useLanguage();
  return (
    <View style={s.step}>
      <Text style={s.title}>{t("onboarding.levelLabel")}</Text>

      <View style={s.field}>
        <View style={s.chipGrid}>
          {LEVELS.map((level) => {
            const selected = level === value;
            return (
              <Pressable
                key={level}
                style={[s.chip, selected && s.chipSelected]}
                onPress={() => onChange(level)}
              >
                <Text style={s.chipText}>{t(`common.level.${level}`)}</Text>
              </Pressable>
            );
          })}
        </View>
        {error && <Text style={s.fieldError}>{error}</Text>}
      </View>
    </View>
  );
}
