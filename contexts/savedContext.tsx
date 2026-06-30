import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

type SavedContextType = {
  savedVideoIds: string[];
  isVideoSaved: (videoId: string) => boolean;
  toggleVideoSave: (videoId: string) => void;
  isLoading: boolean;
};

export const SavedContext = createContext<SavedContextType>({} as SavedContextType);

export function SavedProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const { data: savedVideoIds = [], isLoading } = useQuery<string[]>({
    queryKey: ["saved_videos", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_saved_videos")
        .select("video_id")
        .eq("user_id", userId!);
      if (error) throw error;
      return data.map((row) => row.video_id);
    },
    enabled: !!userId,
  });

  const savedSet = useMemo(() => new Set(savedVideoIds), [savedVideoIds]);

  const isVideoSaved = useCallback((videoId: string) => savedSet.has(videoId), [savedSet]);

  const mutation = useMutation({
    mutationFn: async ({ videoId, currentlySaved }: { videoId: string; currentlySaved: boolean }) => {
      if (currentlySaved) {
        const { error } = await supabase
          .from("user_saved_videos")
          .delete()
          .match({ user_id: userId, video_id: videoId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_saved_videos")
          .insert({ user_id: userId, video_id: videoId });
        if (error) throw error;
      }
    },
    onMutate: ({ videoId, currentlySaved }) => {
      queryClient.setQueryData<string[]>(["saved_videos", userId], (old = []) =>
        currentlySaved ? old.filter((id) => id !== videoId) : [...old, videoId],
      );
    },
    onError: (_err, { videoId, currentlySaved }) => {
      queryClient.setQueryData<string[]>(["saved_videos", userId], (old = []) =>
        currentlySaved ? [...old, videoId] : old.filter((id) => id !== videoId),
      );
    },
  });

  const toggleVideoSave = useCallback(
    (videoId: string) => {
      mutation.mutate({ videoId, currentlySaved: savedSet.has(videoId) });
    },
    [mutation, savedSet],
  );

  return (
    <SavedContext.Provider value={{ savedVideoIds, isVideoSaved, toggleVideoSave, isLoading }}>
      {children}
    </SavedContext.Provider>
  );
}
