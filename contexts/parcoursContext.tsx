import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import { useAuth } from "@/hooks/useAuth";

export type Parcours = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  tag_type: "beginner" | "intermediate" | "expert";
  total_duration_seconds: number;
  created_at: string;
  category: { id: string; title: string; emoji: string } | null;
  instructor: { id: string; name: string; avatar_url: string | null } | null;
};

export type ParcoursPayload = {
  title: string;
  description?: string | null;
  category_id?: string | null;
  instructor_id?: string | null;
  tag_type: "beginner" | "intermediate" | "expert";
  cover_image_url?: string | null;
  total_duration_seconds: number;
};

export type SaveParcoursInput = {
  editId?: string | null;
  coverImageUri: string | null;
  coverImageUrl: string;
  title: string;
  description: string;
  categoryId: string;
  instructorId: string;
  tagType: "beginner" | "intermediate" | "expert";
  totalDurationSeconds: number;
  courseIds: string[];
};

type ParcoursContextType = {
  parcours: Parcours[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  saveParcours: (input: SaveParcoursInput) => Promise<void>;
  deleteParcours: (id: string) => Promise<void>;
  isSaving: boolean;
};

export const ParcoursContext = createContext<ParcoursContextType>(
  {} as ParcoursContextType,
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

export function ParcoursProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["parcours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parcours")
        .select(
          "*, category:categories(id, title, emoji), instructor:users(id, name, avatar_url)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Parcours[];
    },
    enabled: !!session?.user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const cached = queryClient.getQueryData<Parcours[]>(["parcours"]) ?? [];
      const p = cached.find((p) => p.id === id);

      if (p?.cover_image_url) {
        const path = extractStoragePath(p.cover_image_url, "image");
        if (path) await supabase.storage.from("image").remove([path]);
      }

      await supabase.from("parcours_courses").delete().eq("parcours_id", id);

      const { error } = await supabase.from("parcours").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Parcours[]>(["parcours"], (old = []) =>
        old.filter((p) => p.id !== id),
      );
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (input: SaveParcoursInput): Promise<Parcours> => {
      let finalImageUrl: string | null = input.coverImageUrl.trim() || null;
      if (input.coverImageUri) {
        const ext = input.coverImageUri.split(".").pop() ?? "jpg";
        finalImageUrl = await uploadToStorage(
          input.coverImageUri,
          "image",
          `private/parcours/${randomSuffix()}.${ext}`,
          `image/${ext}`,
        );
      }

      const payload: ParcoursPayload = {
        title: input.title.trim(),
        description: input.description.trim() || null,
        category_id: input.categoryId || null,
        instructor_id: input.instructorId || null,
        tag_type: input.tagType,
        cover_image_url: finalImageUrl,
        total_duration_seconds: input.totalDurationSeconds,
      };

      let result: Parcours;

      if (input.editId) {
        const { data: updated, error } = await supabase
          .from("parcours")
          .update(payload)
          .eq("id", input.editId)
          .select(
            "*, category:categories(id, title, emoji), instructor:users(id, name, avatar_url)",
          )
          .single();
        if (error) throw error;
        result = updated as Parcours;

        await supabase
          .from("parcours_courses")
          .delete()
          .eq("parcours_id", input.editId);
      } else {
        const { data: inserted, error } = await supabase
          .from("parcours")
          .insert(payload)
          .select(
            "*, category:categories(id, title, emoji), instructor:users(id, name, avatar_url)",
          )
          .single();
        if (error) throw error;
        result = inserted as Parcours;
      }

      if (input.courseIds.length > 0) {
        const rows = input.courseIds.map((course_id, order_index) => ({
          parcours_id: result.id,
          course_id,
          order_index,
        }));
        const { error: junctionError } = await supabase
          .from("parcours_courses")
          .insert(rows);
        if (junctionError) throw junctionError;
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.setQueryData<Parcours[]>(["parcours"], (old = []) => {
        const exists = old.some((p) => p.id === result.id);
        if (exists) return old.map((p) => (p.id === result.id ? result : p));
        return [result, ...old];
      });
    },
  });

  return (
    <ParcoursContext.Provider
      value={{
        parcours: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
        saveParcours: saveMutation.mutateAsync,
        deleteParcours: deleteMutation.mutateAsync,
        isSaving: saveMutation.isPending,
      }}
    >
      {children}
    </ParcoursContext.Provider>
  );
}
