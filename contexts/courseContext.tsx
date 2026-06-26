import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren } from "react";

export type Course = {
  id: string;
  title: string;
  instructor: string;
  tag_type: "beginner" | "intermediate" | "expert";
  image_url: string | null;
  total_duration_seconds: number;
  created_at: string;
  category: { id: string; title: string; emoji: string } | null;
};

type CourseContextType = {
  courses: Course[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const CourseContext = createContext<CourseContextType>({} as CourseContextType);

export function CourseProvider({ children }: PropsWithChildren) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, category:categories(id, title, emoji)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Course[];
    },
  });

  return (
    <CourseContext.Provider
      value={{
        courses: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
