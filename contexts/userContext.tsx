import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import { useAuth } from "@/hooks/useAuth";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "eleve" | "professeur" | "admin";
  level: "beginner" | "intermediate" | "expert";
  created_at: string;
};

export type UserPayload = {
  name: string;
  email: string;
  role: "eleve" | "professeur" | "admin";
  level: "beginner" | "intermediate" | "expert";
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: "eleve" | "professeur" | "admin";
  level: "beginner" | "intermediate" | "expert";
};

type UserContextType = {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  createUser: (input: CreateUserInput) => Promise<void>;
  updateUser: (id: string, payload: UserPayload) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
};

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);

// Isolated client so signUp never overwrites the admin's session
const anonClient = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

export function UserProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { session } = useAuth();

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
    enabled: !!session?.user?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (input: CreateUserInput) => {
      // Use the isolated client so the admin session is not replaced
      const { data: authData, error: authError } = await anonClient.auth.signUp(
        {
          email: input.email,
          password: input.password,
          options: { data: { name: input.name } },
        },
      );
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("Échec de la création du compte.");

      // Trigger already inserted the public.users row — update role & level
      const { data: updated, error: updateError } = await supabase
        .from("users")
        .update({ role: input.role, level: input.level })
        .eq("id", userId)
        .select()
        .single();
      if (updateError) throw updateError;
      return updated as User;
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData<User[]>(["users"], (old = []) => [
        newUser,
        ...old,
      ]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UserPayload;
    }) => {
      const { data: updated, error } = await supabase
        .from("users")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return updated as User;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<User[]>(["users"], (old = []) =>
        old.map((u) => (u.id === updated.id ? updated : u)),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("users").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<User[]>(["users"], (old = []) =>
        old.filter((u) => u.id !== id),
      );
    },
  });

  return (
    <UserContext.Provider
      value={{
        users: data ?? [],
        isLoading,
        error: error as Error | null,
        refetch,
        createUser: createMutation.mutateAsync,
        updateUser: (id, payload) =>
          updateMutation.mutateAsync({ id, payload }),
        deleteUser: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
