import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren } from "react";
import { useAuth } from "@/hooks/useAuth";

export type Lesson = {
  id: string;
  course_id: string;
  index: number;
  title: string;
  url: string;
  duration_seconds: number;
};

type LessonContextType = {
  lessons: Lesson[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const LessonContext = createContext<LessonContextType>(
  {} as LessonContextType,
);

export function LessonProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_lessons")
        .select("*")
        .order("course_id")
        .order("index");
      if (error) throw error;
      return data as Lesson[];
    },
    enabled: !!session?.user?.id,
  });

  return (
    <LessonContext.Provider
      value={{
        lessons: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
}
