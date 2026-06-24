import React, { useCallback, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import YoutubeIframe from "react-native-youtube-iframe";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIDEO_HEIGHT = SCREEN_WIDTH * (9 / 16);

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoModalProps {
  visible: boolean;
  videoUrl: string | null;
  title?: string;
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /\/embed\/([^?&#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

// ─── Sous-composant : lecteur natif (mp4, m3u8...) ───────────────────────────

function NativePlayer({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={styles.video}
      allowsFullscreen
      allowsPictureInPicture
      contentFit="contain"
    />
  );
}

// ─── Sous-composant : lecteur YouTube ────────────────────────────────────────

function YouTubePlayer({ videoId }: { videoId: string }) {
  const [ready, setReady] = useState(false);

  return (
    <View style={styles.video}>
      {/* Spinner pendant le chargement */}
      {!ready && (
        <View style={styles.loader}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      )}
      <YoutubeIframe
        videoId={videoId}
        width={SCREEN_WIDTH}
        height={VIDEO_HEIGHT}
        play={true} // autoplay dès que prêt
        onReady={() => setReady(true)}
        initialPlayerParams={{
          controls: true,
          rel: false,
          modestbranding: true,
          preventFullScreen: false,
        }}
      />
    </View>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function VideoModal({
  visible,
  videoUrl,
  title,
  onClose,
}: VideoModalProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const youtubeId =
    videoUrl && isYouTubeUrl(videoUrl) ? getYouTubeId(videoUrl) : null;

  const isYouTube = youtubeId !== null;
  const isNative = videoUrl !== null && !isYouTube;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar hidden />

      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            {title ? (
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            ) : (
              <View />
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* YouTube */}
          {isYouTube && <YouTubePlayer videoId={youtubeId!} />}

          {/* Fichier direct (mp4, m3u8...) */}
          {isNative && <NativePlayer url={videoUrl!} />}

          {/* URL non reconnue */}
          {!isYouTube && !isNative && videoUrl && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Format vidéo non supporté</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.88)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: "#0f0f0f",
    borderRadius: Platform.OS === "ios" ? 16 : 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1a1a1a",
  },
  title: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    marginRight: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  video: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: "#000",
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    zIndex: 1,
  },
  errorContainer: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#888",
    fontSize: 14,
  },
});
