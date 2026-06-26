import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren } from "react";

export type Video = {
  id: string;
  title: string;
  subtitle: string | null;
  url: string;
  image_url: string | null;
  tag_type: "beginner" | "intermediate" | "expert";
  duration_seconds: number;
  published: boolean;
  created_at: string;
  category: { id: string; title: string; emoji: string } | null;
};

export type VideoPayload = {
  title: string;
  subtitle?: string | null;
  category_id?: string | null;
  tag_type: "beginner" | "intermediate" | "expert";
  url: string;
  image_url?: string | null;
  duration_seconds: number;
  published: boolean;
};

type VideoContextType = {
  videos: Video[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  addVideo: (payload: VideoPayload) => Promise<Video>;
  updateVideo: (id: string, payload: Partial<VideoPayload>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
};

export const VideoContext = createContext<VideoContextType>({} as VideoContextType);

export function VideoProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["videos"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<VideoPayload> }) => {
      const { error } = await supabase.from("videos").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["videos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["videos"] }),
  });

  return (
    <VideoContext.Provider
      value={{
        videos: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
        addVideo: addMutation.mutateAsync,
        updateVideo: (id, payload) => updateMutation.mutateAsync({ id, payload }),
        deleteVideo: deleteMutation.mutateAsync,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}
