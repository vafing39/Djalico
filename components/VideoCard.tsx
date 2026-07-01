import { color } from "@/config/color";
import { Bookmark } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export function VideoCard({
  item,
  onPress,
  onBookmarkPress,
}: {
  item: any;
  onPress?: () => void;
  onBookmarkPress?: () => void;
}) {
  const isExpert = item.tagType === "expert";

  return (
    <Pressable style={styles.videoCard} onPress={onPress}>
      <View style={styles.videoThumb}>
        <Image source={{ uri: item.image }} style={styles.videoThumbImg} />
        <View style={styles.playBtn}>
          <View style={styles.playTriangle} />
        </View>
      </View>

      <View style={styles.videoInfo}>
        <Text numberOfLines={1} style={styles.videoTitle}>
          {item.title}
        </Text>
        <Text style={styles.videoSub}>{item.subtitle}</Text>

        <View style={styles.videoTags}>
          <View style={[styles.tag, isExpert ? styles.tagExpert : styles.tagBeginner]}>
            <Text style={[styles.tagText, isExpert ? styles.tagTextExpert : styles.tagTextBeginner]}>
              {item.tag}
            </Text>
          </View>
        </View>

        {typeof item.progress === "number" && item.progress > 0 && (
          <View style={styles.progressWrap}>
            <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
          </View>
        )}
      </View>

      {onBookmarkPress && (
        <Pressable
          hitSlop={8}
          style={styles.bookmarkBtn}
          onPress={(e) => { e.stopPropagation?.(); onBookmarkPress(); }}
        >
          <Bookmark
            size={18}
            color={item.bookmarked ? color.yellowDark : color.softGray}
            fill={item.bookmarked ? color.yellowDark : "transparent"}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  videoThumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: color.paleBlue,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  videoThumbImg: { width: "100%", height: "100%", resizeMode: "cover" },
  videoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginHorizontal: 24,
    marginBottom: 12,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(14,43,69,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  playBtn: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(14,43,69,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 8,
    borderStyle: "solid",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#fff",
    marginLeft: 2,
  },
  videoInfo: { flex: 1, minWidth: 0 },
  videoTitle: { fontSize: 14, fontWeight: "600", color: color.deepBlue, letterSpacing: -0.2, marginBottom: 2 },
  videoSub:   { fontSize: 12, color: color.softGray, marginBottom: 6 },
  videoTags:  { flexDirection: "row", gap: 6, marginBottom: 6 },
  tag:             { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
  tagExpert:       { backgroundColor: "rgba(255,214,107,0.3)" },
  tagBeginner:     { backgroundColor: "rgba(181,212,244,0.4)" },
  tagText:         { fontSize: 11, fontWeight: "600" },
  tagTextExpert:   { color: "#8A6200" },
  tagTextBeginner: { color: "#185FA5" },
  progressWrap: { height: 3, backgroundColor: "rgba(14,43,69,0.08)", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: color.yellowDark, borderRadius: 2 },
  bookmarkBtn:  { width: 36, height: 36, borderRadius: 10, backgroundColor: color.paleBlue, justifyContent: "center", alignItems: "center", flexShrink: 0 },
});
