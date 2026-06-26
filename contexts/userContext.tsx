import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "eleve" | "professeur" | "admin";
  level: "beginner" | "intermediate" | "expert";
  created_at: string;
};

type UserContextType = {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);

export function UserProvider({ children }: PropsWithChildren) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as User[];
    },
  });

  return (
    <UserContext.Provider
      value={{
        users: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
