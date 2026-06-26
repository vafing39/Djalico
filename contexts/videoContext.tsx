import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
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

type VideoContextType = {
  videos: Video[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const VideoContext = createContext<VideoContextType>({} as VideoContextType);

export function VideoProvider({ children }: PropsWithChildren) {
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

  return (
    <VideoContext.Provider
      value={{
        videos: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}
