import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren } from "react";

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

type ParcoursContextType = {
  parcours: Parcours[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const ParcoursContext = createContext<ParcoursContextType>({} as ParcoursContextType);

export function ParcoursProvider({ children }: PropsWithChildren) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["parcours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parcours")
        .select(
          "*, category:categories(id, title, emoji), instructor:users(id, name, avatar_url)"
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Parcours[];
    },
  });

  return (
    <ParcoursContext.Provider
      value={{
        parcours: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
      }}
    >
      {children}
    </ParcoursContext.Provider>
  );
}
