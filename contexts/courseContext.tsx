import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import { useAuth } from "@/hooks/useAuth";

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

export type CoursePayload = {
  title: string;
  instructor: string;
  category_id?: string | null;
  tag_type: "beginner" | "intermediate" | "expert";
  image_url?: string | null;
  total_duration_seconds: number;
};

export type SaveCourseInput = {
  editId?: string | null;
  imageUri: string | null;
  imageUrl: string;
  title: string;
  instructor: string;
  categoryId: string;
  tagType: "beginner" | "intermediate" | "expert";
  totalDurationSeconds: number;
};

type CourseContextType = {
  courses: Course[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  saveCourse: (input: SaveCourseInput) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  isSaving: boolean;
};

export const CourseContext = createContext<CourseContextType>(
  {} as CourseContextType,
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

export function CourseProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { session } = useAuth();

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
    enabled: !!session?.user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const cached = queryClient.getQueryData<Course[]>(["courses"]) ?? [];
      const course = cached.find((c) => c.id === id);

      if (course?.image_url) {
        const path = extractStoragePath(course.image_url, "image");
        if (path) await supabase.storage.from("image").remove([path]);
      }

      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Course[]>(["courses"], (old = []) =>
        old.filter((c) => c.id !== id),
      );
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (input: SaveCourseInput): Promise<Course> => {
      let finalImageUrl: string | null = input.imageUrl.trim() || null;
      if (input.imageUri) {
        const ext = input.imageUri.split(".").pop() ?? "jpg";
        finalImageUrl = await uploadToStorage(
          input.imageUri,
          "image",
          `private/covers/${randomSuffix()}.${ext}`,
          `image/${ext}`,
        );
      }

      const payload: CoursePayload = {
        title: input.title.trim(),
        instructor: input.instructor.trim(),
        category_id: input.categoryId || null,
        tag_type: input.tagType,
        image_url: finalImageUrl,
        total_duration_seconds: input.totalDurationSeconds,
      };

      if (input.editId) {
        const { data: updated, error } = await supabase
          .from("courses")
          .update(payload)
          .eq("id", input.editId)
          .select("*, category:categories(id, title, emoji)")
          .single();
        if (error) throw error;
        return updated as Course;
      } else {
        const { data: inserted, error } = await supabase
          .from("courses")
          .insert(payload)
          .select("*, category:categories(id, title, emoji)")
          .single();
        if (error) throw error;
        return inserted as Course;
      }
    },
    onSuccess: (result) => {
      queryClient.setQueryData<Course[]>(["courses"], (old = []) => {
        const exists = old.some((c) => c.id === result.id);
        if (exists) return old.map((c) => (c.id === result.id ? result : c));
        return [result, ...old];
      });
    },
  });

  return (
    <CourseContext.Provider
      value={{
        courses: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
        saveCourse: saveMutation.mutateAsync,
        deleteCourse: deleteMutation.mutateAsync,
        isSaving: saveMutation.isPending,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
