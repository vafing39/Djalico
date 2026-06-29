import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Lesson, LessonDraft } from "@/types";

export type { Lesson, LessonDraft };

type LessonContextType = {
  lessons: Lesson[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  saveLessons: (courseId: string, drafts: LessonDraft[], deletedIds: string[]) => Promise<void>;
  isSavingLessons: boolean;
};

export const LessonContext = createContext<LessonContextType>(
  {} as LessonContextType,
);

export function LessonProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_videos")
        .select("*, video:videos(url, image_url)")
        .order("course_id")
        .order("index");
      if (error) throw error;
      return data as Lesson[];
    },
    enabled: !!session?.user?.id,
  });

  const saveLessonsMutation = useMutation({
    mutationFn: async ({
      courseId,
      drafts,
      deletedIds,
    }: {
      courseId: string;
      drafts: LessonDraft[];
      deletedIds: string[];
    }) => {
      if (deletedIds.length > 0) {
        const { error } = await supabase
          .from("course_videos")
          .delete()
          .in("id", deletedIds);
        if (error) throw error;
      }

      if (drafts.length > 0) {
        const rows = drafts.map((d, i) => ({
          ...(d.id ? { id: d.id } : {}),
          course_id: courseId,
          title: d.title,
          video_id: d.video_id,
          index: i + 1,
          duration_seconds: d.duration_seconds,
        }));
        const { error } = await supabase
          .from("course_videos")
          .upsert(rows, { onConflict: "id" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });

  return (
    <LessonContext.Provider
      value={{
        lessons: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
        saveLessons: (courseId, drafts, deletedIds) =>
          saveLessonsMutation.mutateAsync({ courseId, drafts, deletedIds }),
        isSavingLessons: saveLessonsMutation.isPending,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
}
