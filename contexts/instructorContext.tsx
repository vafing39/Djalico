import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Instructor } from "@/types";
import type { PropsWithChildren } from "react";

export type { Instructor };

type InstructorContextType = {
  instructors: Instructor[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const InstructorContext = createContext<InstructorContextType | undefined>(
  undefined,
);

export function InstructorProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();

  const { data, isLoading, error, refetch } = useQuery<Instructor[]>({
    queryKey: ["instructors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name")
        .in("role", ["professeur", "admin"])
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return (
    <InstructorContext.Provider
      value={{
        instructors: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
