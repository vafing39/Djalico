import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Category } from "@/types";
import type { PropsWithChildren } from "react";

export type { Category };

type CategoryContextType = {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined,
);

export function CategoryProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();

  const { data, isLoading, error, refetch } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, title, emoji")
        .order("title");
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return (
    <CategoryContext.Provider
      value={{
        categories: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}
