import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { color, TAG_STYLES } from "@/config/adminTheme";
import { useLanguage } from "@/hooks/useLanguage";
import type { TagType } from "@/types";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

type Props = {
  imageUrl: string | null;
  title: string;
  tagType: TagType;
  metaIcon: IoniconsName;
  metaText: string;
  // optional — shown only when provided
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  subtitle?: string | null;
  instructor?: string | null;
  durationBadge?: string | null; // overlay label on the thumbnail
  published?: boolean; // coloured dot after metaText
  showBorder: boolean;
  onPlay?: () => void; // if set, thumbnail becomes pressable with play overlay
  onEdit: () => void;
  onDelete: () => void;
};

export default function AdminListCard({
  imageUrl,
  title,
  tagType,
  metaIcon,
  metaText,
  thumbnailWidth = 64,
  thumbnailHeight = 64,
  subtitle,
  instructor,
  durationBadge,
  published,
  showBorder,
  onPlay,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useLanguage();
  const tag = TAG_STYLES[tagType] ?? TAG_STYLES.beginner;

  const thumbnailInner = (
    <>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]} />
      )}
      {durationBadge ? (
        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={9} color="#fff" />
          <Text style={styles.durationText}>{durationBadge}</Text>
        </View>
      ) : null}
      {onPlay ? (
        <View style={styles.playOverlay}>
          <Ionicons name="play" size={14} color="#fff" />
        </View>
      ) : null}
    </>
  );

  return (
    <View style={[styles.card, showBorder && styles.cardBorder]}>
      {onPlay ? (
        <Pressable
          style={[
            styles.thumbnailWrap,
            { width: thumbnailWidth, height: thumbnailHeight },
          ]}
          onPress={onPlay}
        >
          {thumbnailInner}
        </Pressable>
      ) : (
        <View
          style={[
            styles.thumbnailWrap,
            { width: thumbnailWidth, height: thumbnailHeight },
          ]}
        >
          {thumbnailInner}
        </View>
      )}

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={[styles.tagBadge, { backgroundColor: tag.bg }]}>
            <Text style={[styles.tagText, { color: tag.text }]}>
              {t(`common.level.${tagType}`)}
            </Text>
          </View>
        </View>
        {instructor ? (
          <Text style={styles.instructor}>
            <Ionicons name="person-outline" size={11} color={color.textMuted} />{" "}
            {instructor}
          </Text>
        ) : null}
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        <View style={styles.meta}>
          <Ionicons name={metaIcon} size={11} color={color.textMuted} />
          <Text style={styles.metaText}>{metaText}</Text>
          {published !== undefined ? (
            <View
              style={[
                styles.publishedDot,
                { backgroundColor: published ? color.green : color.border },
              ]}
            />
          ) : null}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: "#E9F2FF" }]}
          onPress={onEdit}
        >
          <Ionicons name="create-outline" size={16} color="#1E88E5" />
        </Pressable>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: "#FFE7E7" }]}
          onPress={onDelete}
        >
          <Ionicons name="trash-outline" size={16} color={color.red} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  cardBorder: { borderBottomWidth: 1, borderBottomColor: color.border },

  thumbnailWrap: { borderRadius: 10, overflow: "hidden", flexShrink: 0 },
  thumbnail: { width: "100%", height: "100%", resizeMode: "cover" },
  thumbnailPlaceholder: { backgroundColor: color.border },
  durationBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  durationText: { fontSize: 9, color: "#fff", fontWeight: "600" },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  info: { flex: 1, gap: 3 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: "700",
    color: color.textPrimary,
  },
  tagBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7 },
  tagText: { fontSize: 9, fontWeight: "700" },
  instructor: { fontSize: 12, color: color.textMuted },
  subtitle: { fontSize: 11, color: color.textMuted },
  meta: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, color: color.textMuted, flex: 1 },
  publishedDot: { width: 7, height: 7, borderRadius: 4 },

  actions: { flexDirection: "column", gap: 6 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
