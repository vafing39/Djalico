import { Picker } from "@react-native-picker/picker";
import { Platform, StyleSheet, Text, View } from "react-native";
import { color, LEVELS, pickerStyleDefs } from "@/config/adminTheme";
import { useLanguage } from "@/hooks/useLanguage";
import type { Category, TagType } from "@/types";

type Props = {
  categoryId: string;
  setCategoryId: (v: string) => void;
  categories: Category[];
  level: TagType;
  setLevel: (v: TagType) => void;
};

export default function CategoryLevelPickers({
  categoryId,
  setCategoryId,
  categories,
  level,
  setLevel,
}: Props) {
  const { t } = useLanguage();

  return (
    <View style={styles.row}>
      <View style={styles.col}>
        <Text style={styles.label}>{t("admin.form.category")}</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={categoryId}
            onValueChange={(v) => setCategoryId(v as string)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            dropdownIconColor={color.white}
          >
            <Picker.Item label={t("admin.form.noneFem")} value="" color={Platform.OS === "ios" ? color.white : undefined} />
            {categories.map((c) => (
              <Picker.Item key={c.id} label={`${c.emoji} ${c.title}`} value={c.id} color={Platform.OS === "ios" ? color.white : undefined} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.col}>
        <Text style={styles.label}>{t("admin.form.level")}</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={level}
            onValueChange={(v) => setLevel(v as TagType)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            dropdownIconColor={color.white}
          >
            {LEVELS.map((l) => (
              <Picker.Item key={l.value} label={t(`common.level.${l.value}`)} value={l.value} color={Platform.OS === "ios" ? color.white : undefined} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  col: { flex: 1, gap: 7 },
  label: { fontSize: 13, fontWeight: "700", color: color.textPrimary },
  pickerWrap: pickerStyleDefs.wrap,
  picker: pickerStyleDefs.picker,
  pickerItem: pickerStyleDefs.item,
});
