import { supabase } from "@/utils/supabase";
import {
  UseMutateAsyncFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import { useAuth } from "@/hooks/useAuth";
import type { Video, VideoPayload, SaveVideoInput } from "@/types";

export type { Video, VideoPayload, SaveVideoInput };

export type VideoProgressEntry = { pct: number; time: number; updatedAt: string };
export type VideoProgressStore = Record<string, VideoProgressEntry>;

type VideoContextType = {
  videos: Video[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  addVideo: (payload: VideoPayload) => Promise<Video>;
  updateVideo: (id: string, payload: Partial<VideoPayload>) => Promise<void>;
  deleteVideo: UseMutateAsyncFunction<string, Error, string, unknown>;
  saveVideo: UseMutateAsyncFunction<
    Video | null,
    Error,
    SaveVideoInput,
    unknown
  >;
  isSaving: boolean;
  videoProgress: VideoProgressStore;
  progressLoading: boolean;
  saveProgress: (videoId: string, pct: number, time: number) => void;
};

export const VideoContext = createContext<VideoContextType>(
  {} as VideoContextType,
);

async function uploadToStorage(
  uri: string,
  bucket: string,
  path: string,
  contentType: string,
): Promise<string> {
  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, { contentType, upsert: true });
  if (error) throw error;
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl;
}

function randomSuffix() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function extractStoragePath(url: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export function VideoProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user?.id;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*, category:categories(id, title, emoji)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Video[];
    },
    enabled: !!session?.user?.id,
  });

  const refetchVideos = async () => {
    await queryClient.refetchQueries({ queryKey: ["videos"] });
  };

  // ── Video progress ──────────────────────────────────────────────────────────

  const { data: videoProgress = {}, isLoading: progressLoading } =
    useQuery<VideoProgressStore>({
      queryKey: ["video-progress", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("user_video_progress")
          .select("video_id, progress, playback_time, last_watched_at")
          .eq("user_id", userId!);
        if (error) throw error;
        const store: VideoProgressStore = {};
        for (const row of data ?? []) {
          store[row.video_id] = {
            pct: row.progress,
            time: row.playback_time ?? 0,
            updatedAt: row.last_watched_at ?? new Date().toISOString(),
          };
        }
        return store;
      },
      enabled: !!userId,
    });

  const progressMutation = useMutation({
    mutationFn: async ({
      videoId,
      pct,
      time,
    }: {
      videoId: string;
      pct: number;
      time: number;
    }) => {
      if (!userId) return;
      const { error } = await supabase.from("user_video_progress").upsert(
        {
          user_id: userId,
          video_id: videoId,
          progress: pct,
          playback_time: time,
          last_watched_at: new Date().toISOString(),
        },
        { onConflict: "user_id,video_id" },
      );
      if (error) throw error;
    },
    onMutate: ({ videoId, pct, time }) => {
      queryClient.setQueryData<VideoProgressStore>(
        ["video-progress", userId],
        (prev) => ({
          ...prev,
          [videoId]: { pct, time, updatedAt: new Date().toISOString() },
        }),
      );
    },
  });

  const addMutation = useMutation({
    mutationFn: async (payload: VideoPayload) => {
      const { data, error } = await supabase
        .from("videos")
        .insert(payload)
        .select("*, category:categories(id, title, emoji)")
        .single();
      if (error) throw error;
      return data as Video;
    },
    onSuccess: refetchVideos,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<VideoPayload>;
    }) => {
      const { error } = await supabase
        .from("videos")
        .update(payload)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: refetchVideos,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const cached = queryClient.getQueryData<Video[]>(["videos"]) ?? [];
      const video = cached.find((v) => v.id === id);

      const storagePaths: string[] = [];
      if (video?.url) {
        const p = extractStoragePath(video.url, "videos");
        if (p) storagePaths.push(p);
      }
      if (video?.image_url) {
        const p = extractStoragePath(video.image_url, "videos");
        if (p) storagePaths.push(p);
      }
      if (storagePaths.length > 0) {
        await supabase.storage.from("videos").remove(storagePaths);
      }

      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Video[]>(["videos"], (old = []) =>
        old.filter((v) => v.id !== id),
      );
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (input: SaveVideoInput): Promise<Video | null> => {
      let finalVideoUrl = input.videoUrl.trim();
      if (input.videoUri) {
        const ext = input.videoUri.split(".").pop() ?? "mp4";
        finalVideoUrl = await uploadToStorage(
          input.videoUri,
          "videos",
          `private/${randomSuffix()}.${ext}`,
          `video/${ext}`,
        );
      }

      let finalImageUrl: string | null = input.imageUrl.trim() || null;
      if (input.imageUri) {
        const ext = input.imageUri.split(".").pop() ?? "jpg";
        finalImageUrl = await uploadToStorage(
          input.imageUri,
          "videos",
          `private/thumbnails/${randomSuffix()}.${ext}`,
          `image/${ext}`,
        );
      }

      const payload: VideoPayload = {
        title: input.title.trim(),
        subtitle: input.subtitle.trim() || null,
        category_id: input.categoryId || null,
        tag_type: input.tagType,
        url: finalVideoUrl,
        image_url: finalImageUrl,
        duration_seconds: input.durationSeconds,
        published: input.published,
      };

      if (input.editId) {
        const { error } = await supabase
          .from("videos")
          .update(payload)
          .eq("id", input.editId);
        if (error) throw error;
        return null;
      } else {
        const { data: inserted, error } = await supabase
          .from("videos")
          .insert(payload)
          .select("*, category:categories(id, title, emoji)")
          .single();
        if (error) throw error;
        if (input.courseId) {
          const { data: lastLesson } = await supabase
            .from("course_videos")
            .select("index")
            .eq("course_id", input.courseId)
            .order("index", { ascending: false })
            .limit(1);
          const nextIndex =
            lastLesson?.[0] != null ? lastLesson[0].index + 1 : 0;
          await supabase.from("course_videos").insert({
            course_id: input.courseId,
            title: inserted.title,
            url: inserted.url,
            duration_seconds: input.durationSeconds,
            index: nextIndex,
          });
        }
        return inserted as Video;
      }
    },
    onSuccess: (result) => {
      if (result) {
        // Insert: prepend to cache instantly, no refetch needed
        queryClient.setQueryData<Video[]>(["videos"], (old = []) => [
          result,
          ...old,
        ]);
      } else {
        // Edit: refetch to get updated data
        queryClient.refetchQueries({ queryKey: ["videos"] });
      }
    },
  });

  return (
    <VideoContext.Provider
      value={{
        videos: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
        addVideo: addMutation.mutateAsync,
        updateVideo: (id, payload) =>
          updateMutation.mutateAsync({ id, payload }),
        deleteVideo: deleteMutation.mutateAsync,
        saveVideo: saveMutation.mutateAsync,
        isSaving: saveMutation.isPending,
        videoProgress,
        progressLoading,
        saveProgress: (videoId, pct, time) =>
          progressMutation.mutate({ videoId, pct, time }),
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}
