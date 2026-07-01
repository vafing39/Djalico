import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Text,
  StatusBar,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import YoutubeIframe, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { useLanguage } from "@/hooks/useLanguage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoModalProps {
  visible: boolean;
  videoUrl: string | null;
  title?: string;
  onClose: () => void;
  initialTime?: number;
  onProgress?: (currentTime: number, pct: number) => void;
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

// ─── Native player (mp4, m3u8…) ──────────────────────────────────────────────

function NativePlayer({
  url,
  initialTime,
  onProgress,
  videoWidth,
  videoHeight,
}: {
  url: string;
  initialTime?: number;
  onProgress?: (currentTime: number, pct: number) => void;
  videoWidth: number;
  videoHeight: number;
}) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
    p.timeUpdateEventInterval = 3; // fire every 3 s
    p.play();
  });

  // Resume position once mounted
  useEffect(() => {
    if (initialTime && initialTime > 0) {
      player.currentTime = initialTime;
    }
  }, []);

  // Report progress every 3 s via timeUpdate
  useEffect(() => {
    if (!onProgress) return;
    const sub = player.addListener("timeUpdate", ({ currentTime }) => {
      const dur = player.duration;
      if (dur > 0) onProgress(currentTime, currentTime / dur);
    });
    return () => sub.remove();
  }, [onProgress]);

  return (
    <VideoView
      player={player}
      style={{ width: videoWidth, height: videoHeight, backgroundColor: "#000" }}
      allowsFullscreen
      allowsPictureInPicture
      contentFit="contain"
    />
  );
}

// ─── YouTube player ───────────────────────────────────────────────────────────

function YouTubePlayer({
  videoId,
  initialTime,
  onProgress,
  videoWidth,
  videoHeight,
}: {
  videoId: string;
  initialTime?: number;
  onProgress?: (currentTime: number, pct: number) => void;
  videoWidth: number;
  videoHeight: number;
}) {
  const [ready, setReady] = useState(false);
  const iframeRef = useRef<YoutubeIframeRef>(null);

  // Poll progress every 3 s once the player is ready
  useEffect(() => {
    if (!ready || !onProgress) return;
    const interval = setInterval(async () => {
      if (!iframeRef.current) return;
      const [currentTime, duration] = await Promise.all([
        iframeRef.current.getCurrentTime(),
        iframeRef.current.getDuration(),
      ]);
      if (duration > 0) onProgress(currentTime, currentTime / duration);
    }, 3000);
    return () => clearInterval(interval);
  }, [ready, onProgress]);

  return (
    <View style={{ width: videoWidth, height: videoHeight, backgroundColor: "#000" }}>
      {!ready && (
        <View style={styles.loader}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      )}
      <YoutubeIframe
        ref={iframeRef}
        videoId={videoId}
        width={videoWidth}
        height={videoHeight}
        play={true}
        onReady={() => setReady(true)}
        initialPlayerParams={{
          controls: true,
          rel: false,
          modestbranding: true,
          preventFullScreen: false,
          start: initialTime ? Math.floor(initialTime) : 0,
        }}
      />
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VideoModal({
  visible,
  videoUrl,
  title,
  onClose,
  initialTime,
  onProgress,
}: VideoModalProps) {
  const { t } = useLanguage();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const videoWidth = width;
  const videoHeight = isLandscape ? height : width * (9 / 16);

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
      supportedOrientations={["portrait", "landscape"]}
      onRequestClose={handleClose}
    >
      <StatusBar hidden />

      <View style={styles.overlay}>
        <View style={[styles.container, isLandscape && styles.containerLandscape]}>

          {/* Portrait: header with title + close button */}
          {!isLandscape && (
            <View style={styles.header}>
              {title ? (
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
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
          )}

          {isYouTube && (
            <YouTubePlayer
              key={youtubeId!}
              videoId={youtubeId!}
              initialTime={initialTime}
              onProgress={onProgress}
              videoWidth={videoWidth}
              videoHeight={videoHeight}
            />
          )}

          {isNative && (
            <NativePlayer
              key={videoUrl!}
              url={videoUrl!}
              initialTime={initialTime}
              onProgress={onProgress}
              videoWidth={videoWidth}
              videoHeight={videoHeight}
            />
          )}

          {!isYouTube && !isNative && videoUrl && (
            <View style={[styles.errorContainer, { width: videoWidth, height: videoHeight }]}>
              <Text style={styles.errorText}>{t("video.unsupportedFormat")}</Text>
            </View>
          )}

          {/* Landscape: floating close button over the video */}
          {isLandscape && (
            <Pressable style={styles.floatingClose} onPress={handleClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
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
    backgroundColor: "#0f0f0f",
    borderRadius: Platform.OS === "ios" ? 16 : 8,
    overflow: "hidden",
  },
  containerLandscape: {
    borderRadius: 0,
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
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    zIndex: 1,
  },
  errorContainer: {
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#888",
    fontSize: 14,
  },
  floatingClose: {
    position: "absolute",
    top: 16,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
});
